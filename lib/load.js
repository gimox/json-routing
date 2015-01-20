var _      = require('underscore')
    , path = require('path');


/**
 * Parse JSON file confing and set controller
 *
 * @param app
 * @param options
 */
module.exports = function (app, options) {

    var jsonFileName = path.join(options.basePathJson, options.routeName + '.json');

    // load json file inside try catch, if not load exit
    try {
        var json = require(jsonFileName); // loading definition file
    } catch (ex) {

        console.log('\x1b[31m *** ROUTING FILE DEFINITION ERROR :' + jsonFileName + '\x1b[0m');
        console.log('\x1b[31m All routes inside this file are not loaded, please check json syntax!\x1b[0m');

        return true;
    }


    var basePathController = options.basePathController; // controller path file
    var basePathPolicy = options.basePathPolicy; // policy path file
    var controller = getControllerName(options.routeName); // controller name
    var globalMiddleware = []; // populate middleware get from global file
    var baseUrl = "";

    //set global file options
    setFileGlobalParams(json);

    // start parsing json file
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
                , pattern = path.join(baseUrl, uri)
                , controllerPath
                , route
                , routes
                , defaultRoute = controller + ":index";

            // set default route
            if (_.isUndefined(params.route)) params.route = defaultRoute;

            route = parseRoute(params.route);
            controllerPath = getControllerPath(route[0]);

            middleware = getMiddleware(params.policy);

            //check cors
            if(options.cors) {
                middleware = addCors(middleware);
            }

            regex = params.regex;
            routes = require(controllerPath);

            // get handler
            handler = routes[route[1]];

            if (regex) pattern = addRegex(regex, pattern);

            addRoute(middleware, verb, pattern, handler);
        }
    }


    function addCors(mdlw) {

        //exit if cors disabled
        if (!options.cors) {
             return mdlw;
        }

        //cors is required

        //no middleware, normalize as null array
        if (_.isNull(mdlw)) {
            mdlw = [];
        }

        //TODO var override, need to be changed
        //exist a middleware pass as string, normalize as array
        if (_.isString(mdlw)) {
            mdlw = [mdlw];
        }

        if (_.isArray(mdlw)) {

            // console.log('*****array' + mdlw.length);

            mdlw.push([function (req, res, next) {
                // console.log('cors array');
                res.header("Access-Control-Allow-Origin", "*");
                res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
                // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

                // intercept OPTIONS method
                if ('OPTIONS' == req.method) {
                    res.send(200);
                }
                else {
                    next();
                }
            }]);

            return mdlw;
        }

        console.log('impossible!!');
        return mdlw;
    }

    /**
     * create routes
     *
     * @param middleware
     * @param verb
     * @param pattern
     * @param handler
     */
    function addRoute(middleware, verb, pattern, handler) {

        try {

            if (middleware) {
                app[verb](pattern, middleware, handler);
            } else {
                app[verb](pattern, handler);
            }

        } catch (ex) {
            console.log('\x1b[31m*** ROUTIG ERROR: ' + pattern + '\x1b[0m');
            console.log('file: ' + jsonFileName);
            console.log('verb: ' + verb);
            console.log('error:' + ex);
            console.log('\x1b[31m****************\x1b[0m');
        }
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

        var result = [];

        // case no param is passed
        if (_.isUndefined(routeParams)) {
            result[0] = controller;
            result[1] = 'index';

            return result;
        }

        var arrayParams = routeParams.split(':');

        // params is passed only with action
        if (arrayParams.length == 1) {
            result[0] = controller;
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
        return path.join(basePathController, controller + '.js');
    }

    /**
     * get middlewarePath
     *
     * @param middleware
     * @returns {string}
     */
    function getMiddlewarePath(middleware) {
        if (startWith(middleware, '.')) {
            // return dir from root project
            return path.join(options.processdir, middleware + '.js');
        }

        // default dir
        return path.join(basePathPolicy, middleware + '.js');
    }

    /**
     * return all middleware
     *
     * @param routeMiddleware
     * @returns {*}
     */
    function getAllMiddleWare(routeMiddleware) {

        if (globalMiddleware.length > 0) {

            // fix if policy is string and global array
            if (_.isString(routeMiddleware)) {
                routeMiddleware = [routeMiddleware];
            }

            return _.union(globalMiddleware, routeMiddleware);
        }
        return routeMiddleware;
    }


    /**
     * Parse middleware
     * check if is string or array and parse it
     *
     * @param input
     * @returns {*}
     */
    function getMiddleware(input) {

        var mdlw = getAllMiddleWare(input);

        if (_.isString(mdlw)) {

            var items = [];

            items.push(parseMiddleware(mdlw));

            return items;

        } else if (_.isArray(mdlw)) {

            var items = [];

            mdlw.forEach(function (item) {
                items.push(parseMiddleware(item));
            });

            return items;
        }

        return null;
    }

    /**
     * Parse middleware
     *
     * @param input
     * @returns {*}
     */
    function parseMiddleware(input) {

        var parts = input.split(':');

        // prevent malformed policy routes
        if (parts.length != 2) error(uri, "malformed json middleware");

        var middlewareFile = getMiddlewareFile(parts[0]);
        var middleware = require(middlewareFile);

        return middleware[parts[1]];
    }

    /**
     * return  middleware path
     *
     * @param fileName
     * @returns {string}
     */
    function getMiddlewareFile(fileName) {

        if (startWith(fileName, '.')) {
            return path.join(options.processdir, fileName + '.js');
        }

        return path.join(basePathPolicy, fileName + '.js');
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

    /**
     * check for json global params
     *
     * @param json
     * @returns {boolean}
     */
    function checkGlobalVars(json) {
        if (_.isUndefined(json.GLOBAL)) {
            return false;
        }
        return true;
    }

    /**
     * override Global default params with Global
     * file if present
     *
     * @param json
     * @returns {boolean}
     */
    function setFileGlobalParams(json) {

        if (!checkGlobalVars(json)) {
            return true
        }

        if (checkGlobalVars(json)) {

            //check controllerPath
            if (json.GLOBAL.hasOwnProperty('controllerPath')) {
                basePathController = path.join(options.processdir, json.GLOBAL.controllerPath);
            }

            // check controller Name
            if (json.GLOBAL.hasOwnProperty('controller')) {
                controller = json.GLOBAL.controller;
            }

            // check policy Path
            if (json.GLOBAL.hasOwnProperty('policyPath')) {
                basePathPolicy = path.join(options.processdir, json.GLOBAL.policyPath);
            }

            // check global policy and add it
            if (json.GLOBAL.hasOwnProperty('policy')) {

                if (_.isString(json.GLOBAL.policy)) {
                    globalMiddleware.push(json.GLOBAL.policy);
                } else {
                    globalMiddleware = json.GLOBAL.policy;
                }
            }

            // check global file Base Url
            if (json.GLOBAL.hasOwnProperty('baseUrl')) {
                baseUrl = json.GLOBAL.baseUrl;
            }

            // sanitize json route removing global setting
            delete json.GLOBAL;
        }

        return true;
    }

    /**
     * cerate a valid route if regex is true
     *
     * @param regex
     * @param pattern
     * @returns {*}
     */
    function addRegex(regex, pattern) {

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

            return new RegExp(regexPattern, flags);
        }

        return pattern;
    }

    /**
     * controller name is composed:
     * route name capitalizzed + Controller
     * route = "ping"
     * controller = "PingController"
     * suffix ".js" is added later
     *
     * @param string
     * @returns {string}
     */
    function getControllerName(string) {
        return string.charAt(0).toUpperCase() + string.slice(1) + 'Controller';
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