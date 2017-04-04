import {IOptions} from "./interfaces/IOptions";
import {IHandler} from "./interfaces/IHandler";

import * as path from "path";

export class RouteController {

    controllerName?: string;
    options: IOptions;

    constructor(routeName: string, options: IOptions) {
        this.options = options;
        this.controllerName = this._getName(routeName);
    }

    _getName(name: string): string {
        return name.charAt(0).toUpperCase() + name.slice(1) + "Controller";
    }

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

    getHandler(routeParams?: string, globalController?: string): IHandler {
        let route = this._parse(this.controllerName, routeParams);

        let basePath: string = this.options.controllersPath;

        let isGlobal: boolean = false;
        if (this.startWith(route[0], ".")) {

            basePath = path.join(this.options.processdir, route[0]);

        } else if (globalController) {  // use global if exist

            basePath = path.join(this.options.processdir, globalController);
            isGlobal = true;
        }

        let controller: any;
        let controllerName: string;

        if (isGlobal) {
            controller = require(basePath);
            controllerName = globalController;
        } else {
            controller = require(path.join(basePath, this.controllerName));
            controllerName = this.controllerName;
        }


        return {"fnc": controller[route[1]], "name": controllerName};
    }

    startWith(value, char): boolean {
        return (value.substring(0, 1) === char) ? true : false;
    }


}