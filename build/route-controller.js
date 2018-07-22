"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
class RouteController {
    constructor(routeName, options, osseus) {
        this.options = options;
        this.controllerName = this._getName(routeName);
        this.osseus = osseus;
    }
    _getName(name) {
        return name.charAt(0).toUpperCase() + name.slice(1) + "Controller";
    }
    _parse(controller, routeParams) {
        let result = [];
        if (!routeParams) {
            result[0] = controller;
            result[1] = this.options.defaultAction;
            return result;
        }
        let arrayParams = routeParams.split(":");
        if (arrayParams.length === 1) {
            result[0] = controller;
            result[1] = routeParams;
            return result;
        }
        return arrayParams;
    }
    getHandler(routeParams, globalController) {
        let route = this._parse(this.controllerName, routeParams);
        let basePath = this.options.controllersPath;
        let ctrlNamePath = this.controllerName;
        let ctrlName = this.controllerName;
        if (this.startWith(route[0], ".")) {
            basePath = path.join(this.options.processdir, route[0]);
            ctrlNamePath = "";
            ctrlName = route[0];
        }
        else if (globalController) {
            basePath = path.join(this.options.processdir, globalController);
            ctrlNamePath = "";
            ctrlName = globalController;
        }
        let controller = require(path.join(basePath, ctrlNamePath))(this.osseus);
        return { "fnc": controller[route[1]], "name": ctrlName };
    }
    startWith(value, char) {
        return (value.substring(0, 1) === char) ? true : false;
    }
}
exports.RouteController = RouteController;
//# sourceMappingURL=route-controller.js.map