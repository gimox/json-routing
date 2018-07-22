import * as express from "express";
import {JsonRoute} from "../src/json-route";
import {IRouteInfo} from "../src/interfaces/IRouteInfo";


const port: number = process.env.PORT || 3000;
let app: express.Application = express();

export const routeInfo: Array<IRouteInfo> = new JsonRoute({
    "server": {
        "app": app
    }
}, {
    "processdir": __dirname,
    "displayRoute": true,
    "jwt": {
        "secret": "12345678910abc"
    },
}).start();


console.log("Total routes:", routeInfo.length);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({"message": "invalid token..."});
    }
    next();
});

/**
 * server start
 *
 * @type {http.Server}
 */
const server = app.listen(port, () => {
    console.log("Listening on port %d", server.address().port);
});


