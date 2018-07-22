import * as path from "path";
// import * as cors from "cors";

import {RouteValidator} from "./route-validator";
import {IOptions} from "./interfaces/IOptions";


/**
 * Create a array with middleware for route
 */
export class RouteMiddleware {

    options: IOptions;
    app: any;
    osseus: any;

    constructor(options: IOptions, osseus: any) {
        this.options = options;
        this.app = osseus.server.app;
        this.osseus = osseus;
    }

    /**
     * Get a array of middleware for route
     *
     * @param middlewareDef - middleware string controller:method
     * @param globalDef - like middlewareDef for all controller inside json definition file
     * @param hasJwt - true if route is jwt protected
     * @param validators - express validators object
     * @params cors - true if enabled in route
     * @returns {Array} array of middleware
     */
    get(middlewareDef: Array<string> | string = [], globalDef: Array<string> | string = [], hasJwt: boolean = false, validators: any, hasCors: boolean, uri: string): Array<string> {

        if (!Array.isArray(middlewareDef))
            middlewareDef = [middlewareDef];

        if (!Array.isArray(globalDef))
            globalDef = [globalDef];

        const mdlw = [...globalDef, ...middlewareDef];

        let mdlwFnc = this.parse(mdlw);

        if (hasJwt && this.options.jwt) {
            try {
                const jwt = require("express-jwt");
                mdlwFnc.unshift(jwt(this.options.jwt));
            } catch (e) {
                console.log("\x1b[31m");
                console.log("************************************ WARNING!!!! ******************************************");
                console.log("*                                                                                         *");
                console.log("* JWT ROUTE NOT LOADED: PLEASE ADD express-jwt module: npm install --save express-jwt     *");
                console.log("*                                                                                         *");
                console.log("*******************************************************************************************");
                console.log("\x1b[0m");
            }
        }

        /**
         * add validator
         */
        if (validators.body || validators.params || validators.query) {
            const validatorMdw = RouteValidator.get(validators);

            /**
             * insert validator after jwt if is present
             */
            if (hasJwt && this.options.jwt) {
                mdlwFnc.splice(1, 0, validatorMdw);
            } else {
                mdlwFnc.unshift(validatorMdw);
            }
        }

        /**
         * add cors
         */
        /*
        if (cors) {
            this.app.options(uri, cors(this.options.corsOptions));
            mdlwFnc.unshift(cors(this.options.corsOptions) as any);
        }
        */

        return mdlwFnc;
    }

    /**
     * get middlefare method
     * @param middlewareDef -  middleware string controller:method with globalDef
     * @returns {Array<any>} array of middleware
     */
    parse(middlewareDef: Array<string>): Array<string> {

        let result: Array<any> = [];

        middlewareDef.forEach((mdlw) => {

            let parts: Array<string> = mdlw.split(":");

            let basePath: string = this.options.policyPath;

            if (this.startWith(parts[0], "."))
                basePath = this.options.processdir;

            let middleware: object = require(path.join(basePath, parts[0]))(this.osseus);

            result.push(middleware[parts[1]]);
        });

        return result;
    }

    /**
     * check if a string start with a string
     *
     * @param {string} value - string value to check
     * @param {string} char - check term
     * @returns {boolean} - true if strat with char
     */
    startWith(value, char) {
        return (value.substring(0, 1) === char) ? true : false;
    }


}





