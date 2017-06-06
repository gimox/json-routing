"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_middleware_1 = require("./route-middleware");
const route_controller_1 = require("./route-controller");
class JrouteHandler {
    constructor(route, options, app) {
        this.baseUrl = "";
        this.route = route;
        this.options = options;
        this.routeController = new route_controller_1.RouteController(this.route.name, this.options);
        this.app = app;
    }
    set() {
        this.json = this.loadRoute();
        this.globalOptions = this.json.GLOBAL || {};
        delete this.json.GLOBAL;
        this.baseUrl = this.setBaseUrl(this.globalOptions.baseUrl);
        let routeInfo = [];
        for (let uri in this.json) {
            let info = this.parseRoutes(uri, this.json);
            routeInfo = [...routeInfo, ...info];
        }
        return routeInfo;
    }
    setBaseUrl(globalBaseUrl = "") {
        return globalBaseUrl + this.baseUrl;
    }
    loadRoute() {
        try {
            return require(this.route.path);
        }
        catch (ex) {
            console.log("\x1b[31m *** ROUTING FILE DEFINITION ERROR :" + this.route.path + "\x1b[0m");
            console.log("\x1b[31m All routes inside this file are not loaded, please check json syntax!\x1b[0m");
            return true;
        }
    }
    parseRoutes(uri, json) {
        let routeInfo = [];
        for (let verb in json[uri]) {
            let params = json[uri][verb];
            let handlers = this.routeController.getHandler(params.route, this.globalOptions.controller);
            let middleware = new route_middleware_1.RouteMiddleware(this.options).get(params.policy, this.globalOptions.policy);
            let info = this.add(verb, uri, middleware, handlers.fnc, handlers.name);
            routeInfo.push(info);
        }
        return routeInfo;
    }
    add(verb, pattern, middleware, handler, controllerName) {
        verb = verb.toLowerCase();
        let status = "\x1b[31mFail\x1b[0m";
        let uriEndpoint = pattern;
        let basePath = this.baseUrl;
        let prefix = this.options.urlPrefix;
        if (pattern.startsWith("RE ")) {
            pattern = pattern.substring(3);
            if (pattern.startsWith("/")) {
                pattern = pattern.substring(1);
            }
            if (pattern.startsWith("/", pattern.length - 1)) {
                pattern = pattern.substring(0, pattern.length - 1);
            }
            uriEndpoint = new RegExp(pattern);
            basePath = "";
            prefix = "";
        }
        else {
            uriEndpoint = prefix + this.baseUrl + pattern;
        }
        try {
            this.app[verb](uriEndpoint, middleware, handler);
            status = "OK";
        }
        catch (ex) {
            status = "\x1b[31mFail\x1b[0m";
        }
        return { "verb": verb, "url": prefix + basePath + pattern, "controllerName": controllerName, "status": status };
    }
}
exports.JrouteHandler = JrouteHandler;
//# sourceMappingURL=jroute-handler.js.map