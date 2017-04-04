import * as cliTable from "cli-table";
import {IRouteInfo} from "./interfaces/IRouteInfo";

export class RoutesDisplay {

    routesInfo: Array<IRouteInfo>;

    constructor(routesInfo: Array<IRouteInfo>) {
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
        let table: any = new cliTable({
            head: ["Url", "Verb", "Controller", "Check"]
            , colWidths: [40, 7, 25, 7]
        });

        for (let info of this.routesInfo) {
            table.push([info.url, info.verb.toUpperCase(), info.controllerName.replace("Controller", ""), info.status])
        }

        console.log(table.toString());
    }

    endTag() {
        console.log("");
    }


}