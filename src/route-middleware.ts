import {IOptions} from "./interfaces/IOptions";
import * as path from "path";

export class RouteMiddleware {

    options: IOptions;

    constructor(options: IOptions) {
        this.options = options;
    }

    get(middlewareDef: Array<string> | string = [], globalDef: Array<string> | string = []): Array<string> {

        if (!Array.isArray(middlewareDef))
            middlewareDef = [middlewareDef];

        if (!Array.isArray(globalDef))
            globalDef = [globalDef];

        let mdlw = [...middlewareDef, ...globalDef];

        if (!mdlw.length)
            return [];

        return this.parse(mdlw);
    }

    parse(middlewareDef: Array<string>): Array<string> {

        let result: Array<any> = [];

        middlewareDef.forEach((mdlw) => {

            let parts: Array<string> = mdlw.split(":");

            let basePath: string = this.options.policyPath;

            if (this.startWith(parts[0], "."))
                basePath = this.options.processdir;


            let middleware: object = require(path.join(basePath, parts[0]));

            result.push(middleware[parts[1]]);
        });

        return result;
    }

    startWith(value, char) {
        return (value.substring(0, 1) === char) ? true : false;
    }


}





