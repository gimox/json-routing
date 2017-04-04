import {IOptions, Options} from "./interfaces/IOptions";
import {IRouteInfo} from "./interfaces/IRouteInfo";

import {JrouteHandler} from "./jroute-handler";
import {RoutesDisplay} from "./routes-display";

import * as fs from "fs";
import * as path from "path";


export class JsonRoute {
    app: any;
    options: IOptions;

    constructor(app: any, options: IOptions) {
        this.app = app;
        this.options = new Options().get(options);

        this.start();
    }

    start() {
        let routes = this.getJsonRoute();
        this.setCors();

        let routesInfo: Array<IRouteInfo> = [];

        for (let route of routes) {

            let info: Array<IRouteInfo> = new JrouteHandler(route, this.options, this.app).set();

            routesInfo = [...routesInfo, ...info];
        }

        if (this.options.displayRoute)
            this.displayinfo(routesInfo);

    }

    getJsonRoute() {
        let files: Array<string> = [];
        let routes: Array<any> = [];
        let filesFiltered: Array<string>;

        try {
            files = fs.readdirSync(this.options.routesPath);
            filesFiltered = files.filter((file) => path.extname(file) === ".json");
            routes = filesFiltered.map((file) => {
                return {
                    "path": path.join(this.options.routesPath, file),
                    "fullName": file,
                    "name": file.replace(".json", "")
                }
            });

        } catch (e) {
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

    displayinfo(routesInfo: Array<IRouteInfo>) {
        new RoutesDisplay(routesInfo);
    }


}