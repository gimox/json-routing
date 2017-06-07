import * as path from "path";

/**
 * Interface for json-route option
 */
export interface IOptions {
    routesPath?: string
    , controllersPath?: string
    , policyPath?: string
    , processdir?: string
    , cors?: boolean
    , displayRoute?: boolean
    , defaultAction?: string
    , urlPrefix?: string
    , jwt?: {
        secret: any
    }
    , bodyParserUrlEncoded?: any
}

/**
 * Set default options for IOption interface
 */
export class Options {
    get(options: IOptions = {}): IOptions {
        options.routesPath = options.routesPath || "./api/routes";
        options.controllersPath = options.controllersPath || "./api/controllers";
        options.policyPath = options.policyPath || "./api/policy";
        options.processdir = options.processdir || process.cwd();
        options.cors = options.cors || true;
        options.displayRoute = options.displayRoute || true;
        options.defaultAction = options.defaultAction || "index";
        options.urlPrefix = options.urlPrefix || "";
        options.bodyParserUrlEncoded = options.bodyParserUrlEncoded || { extended: true}

        options.routesPath = path.join(options.processdir, options.routesPath);
        options.controllersPath = path.join(options.processdir, options.controllersPath);
        options.policyPath = path.join(options.processdir, options.policyPath);

        return options;
    }
}


