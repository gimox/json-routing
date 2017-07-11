"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CliTable = require("cli-table");
class RoutesDisplay {
    constructor(routesInfo, colsWidth) {
        this.routesInfo = routesInfo;
        this.colsWidth = colsWidth;
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
                "\x1b[32m\x1b[1mCheck\x1b[0m"
            ],
            colWidths: this.colsWidth
        });
        for (let info of this.routesInfo) {
            table.push([
                info.url,
                info.verb.toUpperCase(),
                info.controllerName.replace("Controller", ""),
                (info.protected ? "Yes" : "\x1b[31mNO\x1b[0m"),
                (info.status ? "OK" : "\x1bKO\x1b[0m")
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