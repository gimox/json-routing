import * as express from "express";
import {JsonRoute} from "../src/json-route";
import {IRouteInfo} from "../src/interfaces/IRouteInfo";

let port: number = process.env.PORT || 3000;
let app = express();


let routeInfo: Array<IRouteInfo> = new JsonRoute(app, {
    "routesPath": "./api/routes",
    "processdir": __dirname
}).start();


console.log("Total routes:", routeInfo.length);


/**
 * server start
 *
 * @type {http.Server}
 */
let server = app.listen(port,  () => {
    console.log("Listening on port %d", server.address().port);
});