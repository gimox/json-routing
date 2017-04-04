import {IOptions} from "./interfaces/IOptions";
import * as path from "path";

/**
 * Create a array with middleware for route
 */
export class RouteMiddleware {

    options: IOptions;

    constructor(options: IOptions) {
        this.options = options;
    }

    /**
     * Get a array of middleware for route
     *
     * @param middlewareDef - middleware string controller:method
     * @param globalDef - like middlewareDef for all controller inside json definition file
     * @returns {Array} array of middleware
     */
    get(middlewareDef: Array<string> | string = [], globalDef: Array<string> | string = []): Array<string> {

        if (!Array.isArray(middlewareDef))
            middlewareDef = [middlewareDef];

        if (!Array.isArray(globalDef))
            globalDef = [globalDef];

        let mdlw = [...middlewareDef, ...globalDef];

        if (!mdlw.length)
            return [];

        return this.parse(mdlw);
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

            let middleware: object = require(path.join(basePath, parts[0]));

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





