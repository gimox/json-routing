var _ = require('underscore')
    , path = require('path');

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


    for (uri in json) {


        // route defaults
        var action = "index"
            , middleware = null
            , regex = false
            , params = json[uri]
            , middlewarePath = params.policyPath;


        // set route settings
        if (_.isString(params)) {
            action = params;
        } else {
            // enfore required arguments
            if (_.isUndefined(params.action)) error(uri, "Must define 'handler' if passing options");

            // set a custom controllerName if option is present
            if (_.isString(params.controller)) controller = params.controller;

            action = params.action;


            middleware = getMiddleware(params.middleware);
            regex = params.regex;
        }

        // add controller
        var routes = require(path.join(options.basePathController, controller + '.js'));


        // get handler
        handler = routes[action];

        // parse uri
        var verb = "get"
            , pattern = uri
            , uriParts = pattern.split(DELIM);


        if (_.indexOf(VERBS, uriParts[0]) != -1) {
            // set the verb
            verb = uriParts.shift().toLowerCase();
            // put the rest of the URI back together in case it was split up
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

        var middlewareFile = path.join(options.basePathPolicy, parts[0] + '.js')
            , middleware = require(middlewareFile);

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