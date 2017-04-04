import * as express from "express";
import {JsonRoute} from "../src/json-route";


let port = process.env.PORT || 3000;
let app = express();


let route = new JsonRoute(app, {
    "routesPath": "./api/routes",
    "processdir": __dirname
});


/**
 * server start
 *
 * @type {http.Server}
 */
let server = app.listen(port, function () {
    console.log("Listening on port %d", server.address().port);
});