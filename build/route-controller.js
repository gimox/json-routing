"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
class RouteController {
    constructor(routeName, options) {
        this.options = options;
        this.controllerName = this._getName(routeName);
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
        let isGlobal = false;
        if (this.startWith(route[0], ".")) {
            basePath = path.join(this.options.processdir, route[0]);
        }
        else if (globalController) {
            basePath = path.join(this.options.processdir, globalController);
            isGlobal = true;
        }
        let controller;
        let controllerName;
        if (isGlobal) {
            controller = require(basePath);
            controllerName = globalController;
        }
        else {
            controller = require(path.join(basePath, this.controllerName));
            controllerName = this.controllerName;
        }
        return { "fnc": controller[route[1]], "name": controllerName };
    }
    startWith(value, char) {
        return (value.substring(0, 1) === char) ? true : false;
    }
}
exports.RouteController = RouteController;
//# sourceMappingURL=route-controller.js.map