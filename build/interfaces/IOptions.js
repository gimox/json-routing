"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
class Options {
    get(options = {}) {
        options.routesPath = options.routesPath || "./api/routes";
        options.controllersPath = options.controllersPath || "./api/controllers";
        options.policyPath = options.policyPath || "./api/policy";
        options.processdir = options.processdir || process.cwd();
        options.cors = options.cors || (options.hasOwnProperty("cors") ? options.cors : true);
        options.corsOptions = options.corsOptions || {};
        options.displayRoute = options.hasOwnProperty("displayRoute") ? options.displayRoute : true;
        options.defaultAction = options.defaultAction || "index";
        options.urlPrefix = options.urlPrefix || "";
        options.bodyParserUrlEncoded = options.bodyParserUrlEncoded || { extended: true };
        options.displayCols = options.displayCols || [40, 7, 25, 7, 7];
        options.routesPath = path.join(options.processdir, options.routesPath);
        options.controllersPath = path.join(options.processdir, options.controllersPath);
        options.policyPath = path.join(options.processdir, options.policyPath);
        return options;
    }
}
exports.Options = Options;
//# sourceMappingURL=IOptions.js.map