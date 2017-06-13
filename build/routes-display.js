"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CliTable = require("cli-table");
class RoutesDisplay {
    constructor(routesInfo) {
        this.routesInfo = routesInfo;
        this.main();
    }
    main() {
        this.startTag();
        this.content();
        this.endTag();
    }
    startTag() {
        console.log("");
        console.log(" Routes: " + this.routesInfo.length);
    }
    content() {
        let table = new CliTable({
            head: [
                "\x1b[32m\x1b[1mUrl\x1b[0m",
                "\x1b[32m\x1b[1mVerb\x1b[0m",
                "\x1b[32m\x1b[1mController\x1b[0m",
                "\x1b[32m\x1b[1mJWT\x1b[0m",
                "\x1b[32m\x1b[1mCors\x1b[0m",
                "\x1b[32m\x1b[1mCheck\x1b[0m"
            ],
            colWidths: [40, 7, 25, 7, 7, 7]
        });
        for (let info of this.routesInfo) {
            table.push([
                info.url,
                info.verb.toUpperCase(),
                info.controllerName.replace("Controller", ""),
                (info.protected ? "Yes" : "\x1b[31mNO\x1b[0m"),
                (info.cors ? "\x1b[36mYes\x1b[0m" : "NO"),
                (info.status ? "\u2713" : "\x1b[31mX\x1b[0m")
            ]);
        }
        console.log(table.toString());
    }
    endTag() {
        console.log("");
    }
}
exports.RoutesDisplay = RoutesDisplay;
//# sourceMappingURL=routes-display.js.map