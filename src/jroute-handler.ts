import {IOptions} from "./interfaces/IOptions";
import {IRouteInfo} from "./interfaces/IRouteInfo";
import {IHandler} from "./interfaces/IHandler";
import {IJsonRoute} from "./interfaces/IJsonRoute";
import {IControllerGlobal} from "./interfaces/IControllerGlobal";

import {RouteMiddleware} from "./route-middleware";
import {RouteController} from "./route-controller";

/**
 * Prepare controller, middleware handler
 */
export class JrouteHandler {
    osseus: any;
    app: any;
    route: IJsonRoute;
    options: IOptions;
    json: any;
    baseUrl: string = "";
    routeController: RouteController;
    globalOptions: IControllerGlobal;

    constructor(route: IJsonRoute, options: IOptions, osseus: any) {
        this.route = route;
        this.options = options;
        this.osseus = osseus;
        this.routeController = new RouteController(this.route.name, this.options, this.osseus);
        this.app = osseus.server.app;
    }

    /**
     * Create a Route from json definition
     *
     * @returns {Array<IRouteInfo>} - a info definition for this json data
     */
    set(): Array<IRouteInfo> {

        this.json = this.loadRoute();

        this.globalOptions = this.json.GLOBAL || {};
        delete this.json.GLOBAL;

        this.baseUrl = this.setBaseUrl(this.globalOptions.baseUrl);

        let routeInfo: Array<IRouteInfo> = [];

        for (let uri in this.json) {
            let info: Array<IRouteInfo> = this.parseRoutes(uri, this.json);
            routeInfo = [...routeInfo, ...info];
        }

        return routeInfo;
    }

    /**
     * Set base url for all route inside json definition.
     * Add global.baseUrl to route url
     *
     * @param {string} globalBaseUrl - global url string
     * @returns {string} - baseurl string
     */
    setBaseUrl(globalBaseUrl: string = ""): string {
        return globalBaseUrl + this.baseUrl;
    }

    /**
     * Load a json definition file
     *
     * @returns {any} json data or false
     */
    loadRoute(): any | boolean {
        try {
            return require(this.route.path);
        } catch (ex) {
            console.log("\x1b[31m *** ROUTING FILE DEFINITION ERROR :" + this.route.path + "\x1b[0m");
            console.log("\x1b[31m All routes inside this file are not loaded, please check json syntax!\x1b[0m");
            return true;
        }
    }

    /**
     * Create a route
     *
     * @param {object} uri - single url object
     * @param {object} json - all route
     * @returns {Array<IRouteInfo>} routes info definition for uri
     */
    parseRoutes(uri, json): Array<IRouteInfo> {
        let routeInfo: Array<IRouteInfo> = [];

        for (let verb in json[uri]) {
            const params = json[uri][verb];
            const hasJwt = params.jwt || false;
            const validators: any = params.validators || {};

            // get deafault cors and override with local route options if present
            const defaultCors = this.options.cors;
            const hasCors = params.cors || ( (params.hasOwnProperty("cors") && !params.cors) ? false : defaultCors);

            const handlers: IHandler = this.routeController.getHandler(params.route, this.globalOptions.controller);
            const middleware: Array<any> = new RouteMiddleware(this.options, this.osseus).get(params.policy, this.globalOptions.policy, hasJwt, validators, hasCors, uri);
            const info = this.add(verb, uri, middleware, handlers.fnc, handlers.name, hasJwt, hasCors);

            routeInfo.push(info);
        }

        return routeInfo;
    }

    /**
     * Add route
     *
     * @param verb - route verb
     * @param pattern - route uri
     * @param middleware - string or array of middleware
     * @param handler - controller function
     * @param controllerName - controller name
     * @param hasJwt - true if route is jwt protected
     * @param hasCors - true if enabled
     * @returns {{verb: string, url: string, controllerName: string, status: string}} route definition info
     */
    add(verb: string, pattern: string, middleware: Array<any>, handler: any, controllerName: string, hasJwt: boolean = false, hasCors: boolean): IRouteInfo {

        verb = verb.toLowerCase();

        let status: string = "\x1b[31mFail\x1b[0m";
        let uriEndpoint: any = pattern;
        let basePath: string = this.baseUrl;
        let prefix: string = this.options.urlPrefix;

        // regex normalization
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

        } else {

            uriEndpoint = prefix + this.baseUrl + pattern;
        }


        try {
            this.app[verb](uriEndpoint, middleware, handler);
            status = "OK";

        } catch (ex) {
            status = "\x1b[31mFail\x1b[0m";
        }

        return {
            "verb": verb,
            "url": prefix + basePath + pattern,
            "controllerName": controllerName,
            "status": status,
            "protected": hasJwt,
            "cors": hasCors
        };
    }


}
