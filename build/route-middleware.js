"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const route_validator_1 = require("./route-validator");
class RouteMiddleware {
    constructor(options, osseus) {
        this.options = options;
        this.app = osseus.server.app;
        this.osseus = osseus;
    }
    get(middlewareDef = [], globalDef = [], hasJwt = false, validators, hasCors, uri) {
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
            }
            catch (e) {
                console.log("\x1b[31m");
                console.log("************************************ WARNING!!!! ******************************************");
                console.log("*                                                                                         *");
                console.log("* JWT ROUTE NOT LOADED: PLEASE ADD express-jwt module: npm install --save express-jwt     *");
                console.log("*                                                                                         *");
                console.log("*******************************************************************************************");
                console.log("\x1b[0m");
            }
        }
        if (validators.body || validators.params || validators.query) {
            const validatorMdw = route_validator_1.RouteValidator.get(validators);
            if (hasJwt && this.options.jwt) {
                mdlwFnc.splice(1, 0, validatorMdw);
            }
            else {
                mdlwFnc.unshift(validatorMdw);
            }
        }
        return mdlwFnc;
    }
    parse(middlewareDef) {
        let result = [];
        middlewareDef.forEach((mdlw) => {
            let parts = mdlw.split(":");
            let basePath = this.options.policyPath;
            if (this.startWith(parts[0], "."))
                basePath = this.options.processdir;
            let middleware = require(path.join(basePath, parts[0]))(this.osseus);
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