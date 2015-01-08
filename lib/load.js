/**
 * Includes
 */
var _      = require('underscore');
var path   = require('path');

const VERBS = ["GET", "POST", "PUT", "DELETE"];
const DELIM = ' /';

/**
 * Parse JSON into expressjs routes
 */
module.exports = function(app, options){
    var routes = require(path.join(options.basePathController, options.routeName + '.js'));
    var json   = require(path.join(options.basePathJson, options.routeName + '.json'));

    // first things first, lets setup that route!
    if (options.vars && !_.isEmpty(options.setup) && _.isFunction(routes[options.setup])) {
        routes[options.setup](options.vars);
    }

    for(uri in json) {
        // route defaults
        var handler     = "index";
        var middleware  = null;
        var regex       = false;

        // set route settings
        if (_.isString(json[uri])) {
            handler = json[uri];
        } else {
            // enfore required arguments
            if (_.isUndefined(json[uri].handler)) error(uri, "Must define 'handler' if passing options");

            handler     = json[uri].handler;
            middleware  = getMiddleware(json[uri].middleware);
            regex       = json[uri].regex;
        }

        // get handler
        handler = routes[handler];

        // parse uri
        var verb     = "get";
        var pattern  = uri;

        var uriParts = uri.split(DELIM);
        if (_.indexOf(VERBS, uriParts[0]) != -1) {
            // set the verb
            verb    = uriParts.shift().toLowerCase();
            // put the rest of the URI back together incase it was split up (it really shouldnt be)
            pattern = '/' + uriParts.join(DELIM);
        }

        // process RegEx!
        if (regex) {
            var regexPattern    = pattern;
            var flags           = "";

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
     * - load file
     * - return function
     */
    function getMiddleware(input){
        if (_.isString(input)) {
            return parseMiddleware(input)
        } else if(_.isArray(input)) {
            var items = new Array();

            input.forEach(function(item){
                items.push(parseMiddleware(item));
            });

            return items;
        }

        return null;
    }

    function parseMiddleware(input){
        var parts = input.split(':');

        // sanity check
        if (parts.length != 2) error(uri, "malformed middleware descriptor");

        var middlewareFile  = path.join(options.basePath, parts[0] + '.js');
        var middleware      = require(middlewareFile);

        return middleware[parts[1]];
    }
};

function error(uri, reason) {
    throw new Error("For " + uri + " " + reason);
}