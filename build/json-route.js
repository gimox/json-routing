"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IOptions_1 = require("./interfaces/IOptions");
const jroute_handler_1 = require("./jroute-handler");
const routes_display_1 = require("./routes-display");
const fs = require("fs");
const path = require("path");
class JsonRoute {
    constructor(app, options) {
        this.app = app;
        this.options = new IOptions_1.Options().get(options);
    }
    start() {
        let routes = this.getJsonRoute();
        if (this.options.cors)
            this.setCors();
        let routesInfo = [];
        for (let route of routes) {
            let info = new jroute_handler_1.JrouteHandler(route, this.options, this.app).set();
            routesInfo = [...routesInfo, ...info];
        }
        if (this.options.displayRoute)
            this.displayinfo(routesInfo);
        return routesInfo;
    }
    getJsonRoute() {
        let files = [];
        let routes = [];
        let filesFiltered;
        try {
            files = fs.readdirSync(this.options.routesPath);
            filesFiltered = files.filter((file) => path.extname(file) === ".json");
            routes = filesFiltered.map((file) => {
                return {
                    "path": path.join(this.options.routesPath, file),
                    "fullName": file,
                    "name": file.replace(".json", "")
                };
            });
        }
        catch (e) {
            console.log("\x1b[31m ****** \n  ROUTING FILE DEFINITION ERROR:\n     " + this.options.routesPath + "\n  NOT EXIST!!! \n ****** \x1b[0m");
        }
        return routes;
    }
    setCors() {
        this.app.use((req, res, next) => {
            let method = req.method && req.method.toUpperCase && req.method.toUpperCase();
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
            res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
            if ("OPTIONS" === method)
                res.sendStatus(204).end();
            else
                next();
        });
    }
    displayinfo(routesInfo) {
        new routes_display_1.RoutesDisplay(routesInfo);
    }
}
exports.JsonRoute = JsonRoute;
//# sourceMappingURL=json-route.js.map