var _ = require('underscore')
    , path = require('path');


/**
 * Parse JSON file confing and set controller
 *
 * @param app
 * @param options
 */
module.exports = function (app, options) {

    // get json route file definition
    var json = require(path.join(options.basePathJson, options.routeName + '.json'));

    main();

    /**
     * main job
     */
    function main() {
        for (uri in json) {

            // route defaults
            var action = "index"
                , verb = "get"
                , middleware = null
                , regex = false
                , params = json[uri]
                , pattern = uri
                , controller = options.controllerName
                , controllerPath = options.basePathController
                , middlewarePath = params.policyPath
                , route = "index."+controller;


            // set custom controller dir
            if (_.isString(params.controllerPath)) controllerPath = path.join(options.processdir, params.controllerPath);

            // set verb if params is present
            if (_.isString(params.verb)) verb = params.verb;

            // set route
            if (_.isString(params.route)) params.route = route;


            route = parseRoute(params.route);

            middleware = getMiddleware(params.policy);
            regex = params.regex;


            // add controller
            var routes = require(path.join(controllerPath, route[1] + '.js'));


            // get handler
            handler = routes[route[0]];


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


    }


    function parseRoute(routeParams) {

        var result = new Array();

        if (_.isUndefined(routeParams)) {
            result[0] = 'index';
            result[1] = options.controllerName;
            return result;
        }

        arrayParams = routeParams.split('.');

        if (arrayParams.length == 1) {
            result[0] = routeParams;
            result[1] = options.controllerName;
            return result;
        }

        return arrayParams;
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


    function getRoute(route) {

        var parts = input.split(':');

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