var _      = require('underscore')
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
     * parse json file
     */
    function main() {
        for (uri in json) {
            // go to parse verbs
            parseRoutes(uri, json);
        }
    }

    /**
     * parse verbs
     * @param uri
     * @param json
     */
    function parseRoutes(uri, json) {

        for (key in json[uri]) {

            // route defaults
            var data = json[uri]
                , verb = key.toLowerCase()
                , action = "index"
                , middleware = null
                , regex = false
                , params = data[key]
                , pattern = uri
                , controller = options.controllerName
                , controllerPath
                , defaultRoute = controller + ":index";


            // set default route
            if (_.isUndefined(params.route)) params.route = defaultRote;


            route = parseRoute(params.route);
            controllerPath = getControllerPath(route[0]);
            middleware = getMiddleware(params.policy);
            regex = params.regex;


            //require routes
            var routes = require(controllerPath);

            console.log(verb);
            console.log(route);

            // get handler
            handler = routes[route[1]];


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


    function parseRoutes2(uri, json) {
        // route defaults
        var action = "index"
            , verb = "get"
            , middleware = null
            , regex = false
            , params = json[uri]
            , pattern = uri
            , controller = options.controllerName
            , controllerPath
            , defaultRoute = controller + ":index.";

        // set verb if params is present
        if (_.isString(params.verb)) verb = params.verb;

        // set default route
        if (_.isUndefined(params.route)) params.route = defaultRote;


        route = parseRoute(params.route);
        controllerPath = getControllerPath(route[0]);
        middleware = getMiddleware(params.policy);
        regex = params.regex;

        //require routes
        var routes = require(controllerPath);


        // get handler
        handler = routes[route[1]];


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
     * return array
     * [0] action
     * [1] controller
     *
     * @param routeParams
     * @returns {*}
     */
    function parseRoute(routeParams) {

        var result = new Array();

        // case no param is passed
        if (_.isUndefined(routeParams)) {
            result[0] = options.controllerName;
            result[1] = 'index';

            return result;
        }

        arrayParams = routeParams.split(':');

        // params is passed only with action
        if (arrayParams.length == 1) {
            result[0] = options.controllerName;
            result[1] = routeParams;

            return result;
        }

        // all params
        return arrayParams;
    }

    /**
     * return controller path
     * if controller start with "." it start from project root
     * else use default dir
     *
     * @param controller
     * @returns {*}
     */
    function getControllerPath(controller) {

        if (startWith(controller, '.')) {
            // return dir from root project
            return path.join(options.processdir, controller + '.js');
        }

        // default dir
        return path.join(options.basePathController, controller + '.js');
    }


    function getMiddlewarePath(middleware) {
        if (startWith(middleware, '.')) {
            // return dir from root project
            return path.join(options.processdir, middleware + '.js');
        }

        // default dir
        return path.join(options.basePathPolicy, middleware + '.js');
    }

    /**
     * Parse middleware string "function:file"
     *
     * @param input
     * @returns {*}
     */
    function getMiddleware(input) {

        if (_.isString(input)) {

            return parseMiddleware(input);
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
        if (parts.length != 2) error(uri, "malformed json middleware");

        var middlewareFile = path.join(options.basePathPolicy, parts[0] + '.js');
        var middleware = require(middlewareFile);

        return middleware[parts[1]];
    }


    /**
     * check if a string start with a value
     *
     * @param value
     * @param char
     * @returns {boolean}
     */
    function startWith(value, char) {

        if (value.substring(0, 1) == char) {
            return true;
        }

        return false;
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