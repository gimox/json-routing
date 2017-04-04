"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
class RouteMiddleware {
    constructor(options) {
        this.options = options;
    }
    get(middlewareDef = [], globalDef = []) {
        if (!Array.isArray(middlewareDef))
            middlewareDef = [middlewareDef];
        if (!Array.isArray(globalDef))
            globalDef = [globalDef];
        let mdlw = [...middlewareDef, ...globalDef];
        if (!mdlw.length)
            return [];
        return this.parse(mdlw);
    }
    parse(middlewareDef) {
        let result = [];
        middlewareDef.forEach((mdlw) => {
            let parts = mdlw.split(":");
            let basePath = this.options.policyPath;
            if (this.startWith(parts[0], "."))
                basePath = this.options.processdir;
            let middleware = require(path.join(basePath, parts[0]));
            result.push(middleware[parts[1]]);
        });
        return result;
    }
    startWith(value, char) {
        return (value.substring(0, 1) === char) ? true : false;
    }
}
exports.RouteMiddleware = RouteMiddleware;
//# sourceMappingURL=route-middleware.js.map