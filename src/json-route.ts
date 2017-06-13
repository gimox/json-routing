import {IOptions, Options} from "./interfaces/IOptions";
import {IRouteInfo} from "./interfaces/IRouteInfo";
import {IJsonRoute} from "./interfaces/IJsonRoute";

import {JrouteHandler} from "./jroute-handler";
import {RoutesDisplay} from "./routes-display";
import {RouteValidator} from "./route-validator";

import * as fs from "fs";
import * as path from "path";
import * as bodyParser from "body-parser";


/**
 * Main file
 * Json-route create a express like route using a json definition file without extra code
 */
export class JsonRoute {
    app: any;
    options: IOptions;

    constructor(app, options: IOptions) {
        this.app = app;
        this.options = new Options().get(options);

        this.setDefaultMdlw();
    }

    setDefaultMdlw() {
        this.app.use(bodyParser.urlencoded(this.options.bodyParserUrlEncoded));
        this.app.use(bodyParser.json());
        RouteValidator.init(this.app);
    }

    /**
     * This is the main fnc
     * @returns {Array<IRouteInfo>} - a list of routes parsed
     */
    start(): Array<IRouteInfo> {
        let routes = this.getJsonRoute();


        let routesInfo: Array<IRouteInfo> = [];

        for (let route of routes) {

            let info: Array<IRouteInfo> = new JrouteHandler(route, this.options, this.app).set();

            routesInfo = [...routesInfo, ...info];
        }

        if (this.options.displayRoute)
            this.displayinfo(routesInfo);

        return routesInfo;
    }


    /**
     * Get a list of json routes definition file
     *
     * @returns {Array<IJsonRoute>} - json route path definition file
     */
    getJsonRoute(): Array<IJsonRoute> {
        let files: Array<string> = [];
        let routes: Array<IJsonRoute> = [];
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

    /**
     * Display routes info table at startup
     *
     * @params {Array<IRouteInfo>} route info definition
     */
    displayinfo(routesInfo: Array<IRouteInfo>) {
        new RoutesDisplay(routesInfo);
    }


}
