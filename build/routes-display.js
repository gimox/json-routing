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
        console.log(" Routes:");
    }
    content() {
        let table = new CliTable({
            head: ["Url", "Verb", "Controller", "Check"],
            colWidths: [40, 7, 25, 7]
        });
        for (let info of this.routesInfo) {
            table.push([info.url, info.verb.toUpperCase(), info.controllerName.replace("Controller", ""), info.status]);
        }
        console.log(table.toString());
    }
    endTag() {
        console.log("");
    }
}
exports.RoutesDisplay = RoutesDisplay;
//# sourceMappingURL=routes-display.js.map