import {IOptions} from "./interfaces/IOptions";
import {IHandler} from "./interfaces/IHandler";

import * as path from "path";


/**
 * Get controller method as handler
 */
export class RouteController {

    controllerName?: string;
    options: IOptions;
    osseus: any;

    constructor(routeName: string, options: IOptions, osseus: any) {
        this.options = options;
        this.controllerName = this._getName(routeName);
        this.osseus = osseus;
    }

    /**
     * Get controller name
     *
     * @param name - base name, declared in json definition
     * @returns {string} - controller name
     * @private
     */
    _getName(name: string): string {
        return name.charAt(0).toUpperCase() + name.slice(1) + "Controller";
    }

    /**
     * Parse route string
     * @param controller - controller
     * @param routeParams
     * @returns {Array} array with postion 0 - controller path, 1 - controller function
     * @private
     */
    _parse(controller: string, routeParams?: string): Array<string> {

        let result = [];

        // case no param is passed
        if (!routeParams) {
            result[0] = controller;
            result[1] = this.options.defaultAction;

            return result;
        }

        let arrayParams: Array<string> = routeParams.split(":");

        // params is passed only with action
        if (arrayParams.length === 1) {
            result[0] = controller;
            result[1] = routeParams;

            return result;
        }

        // all params
        return arrayParams;
    }

    /**
     * Get controller called function
     *
     * @param routeParams
     * @param globalController
     * @returns {{fnc: any, name: string}} object with function a name
     */
    getHandler(routeParams?: string, globalController?: string): IHandler {
        let route = this._parse(this.controllerName, routeParams);


        let basePath: string = this.options.controllersPath;
        let ctrlNamePath: string = this.controllerName;
        let ctrlName: string = this.controllerName;


        if (this.startWith(route[0], ".")) {

            basePath = path.join(this.options.processdir, route[0]);
            ctrlNamePath = "";
            ctrlName = route[0];

        } else if (globalController) {  // use global if exist

            basePath = path.join(this.options.processdir, globalController);
            ctrlNamePath = "";
            ctrlName = globalController;
        }

        let controller: any = require(path.join(basePath, ctrlNamePath))(this.osseus);

        return {"fnc": controller[route[1]], "name": ctrlName};
    }

    /**
     * check if a string start with a string
     *
     * @param {string} value - string value to check
     * @param {string} char - check term
     * @returns {boolean} - true if strat with char
     */
    startWith(value, char): boolean {
        return (value.substring(0, 1) === char) ? true : false;
    }


}
