var _ = require('underscore');
var path = require('path');

/**
 * @type {string[]} verb list
 */
const VERBS = ["GET", "POST", "PUT", "DELETE"];

/**
 *
 * @type {string} unix delimiters
 */
const DELIM = ' /';

/**
 * Parse JSON file confing and set controller
 *
 * @param app
 * @param options
 */
module.exports = function (app, options) {
    //  var routes = require(path.join(options.basePathController, options.controllerName + '.js'));

    // get json route file definition
    var json = require(path.join(options.basePathJson, options.routeName + '.json'));

    //set controllerName
    var controller = options.controllerName;


    // first things, lets setup gobal route options
    if (options.vars && !_.isEmpty(options.action) && _.isFunction(routes[options.action])) {
        routes[options.action](options.vars);
    }

    for (uri in json) {
        // route defaults
        var action = "index";
        var middleware = null;
        var regex = false;

        // set route settings
        if (_.isString(json[uri])) {
            action = json[uri];
        } else {
            // enfore required arguments
            if (_.isUndefined(json[uri].action)) error(uri, "Must define 'handler' if passing options");

            // set a custom controllerName if option is present
            if (_.isString(json[uri].controller)) {
                controller = json[uri].controller;
            }

            action = json[uri].action;
            middleware = getMiddleware(json[uri].middleware);
            regex = json[uri].regex;
        }

        // add controller
        var routes = require(path.join(options.basePathController, controller + '.js'));

        // get handler
        handler = routes[action];

        // parse uri
        var verb = "get";
        var pattern = uri;

        var uriParts = uri.split(DELIM);
        if (_.indexOf(VERBS, uriParts[0]) != -1) {
            // set the verb
            verb = uriParts.shift().toLowerCase();
            // put the rest of the URI back together incase it was split up (it really shouldnt be)
            pattern = '/' + uriParts.join(DELIM);
        }

        // process RegEx!
        if (regex) {
            var regexPattern = pattern;
            var flags = "";

            // pull apart regex patten from the flags
            if (pattern.indexOf("/") != -1) {
                var regexParts = pattern.split('/');
                flags = regexParts.pop();

                // check to see if we need to strip off a starting slash
                if (regexParts[0].trim() == "") {
                    regexParts.shift();
                }

                regexPattern = regexParts.join("/");
            }

            pattern = new RegExp(regexPattern, flags);
        }


        // ADD THAT ROUTE!
        if (middleware)
            app[verb](pattern, middleware, handler);
        else
            app[verb](pattern, handler);
    }


    /**
     * Parse middleware string "file:function"
     *
     * @param input
     * @returns {*}
     */
    function getMiddleware(input) {
        if (_.isString(input)) {
            return parseMiddleware(input)
        } else if (_.isArray(input)) {
            var items = new Array();

            input.forEach(function (item) {
                items.push(parseMiddleware(item));
            });

            return items;
        }

        return null;
    }

    /**
     * Parse middleware
     * @param input
     * @returns {*}
     */
    function parseMiddleware(input) {
        var parts = input.split(':');

        // sanity check
        if (parts.length != 2) error(uri, "malformed middleware descriptor");

        var middlewareFile = path.join(options.basePathJson, parts[0] + '.js');
        var middleware = require(middlewareFile);

        return middleware[parts[1]];
    }
};

/**
 * set errors
 *
 * @param uri
 * @param reason
 */
function error(uri, reason) {
    throw new Error("For " + uri + " " + reason);
}