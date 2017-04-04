import * as CliTable from "cli-table";
import {IRouteInfo} from "./interfaces/IRouteInfo";

/**
 * Display routes info
 */
export class RoutesDisplay {

    routesInfo: Array<IRouteInfo>;

    constructor(routesInfo: Array<IRouteInfo>) {
        this.routesInfo = routesInfo;
        this.main();
    }

    /**
     * main display method
     */
    main() {
        this.startTag();
        this.content();
        this.endTag();
    }

    /**
     * Add before
     */
    startTag() {
        console.log("");
        console.log(" Routes:");
    }

    /**
     * create table content with route info
     */
    content() {
        let table: any = new CliTable({
            head: ["Url", "Verb", "Controller", "Check"]
            , colWidths: [40, 7, 25, 7]
        });

        for (let info of this.routesInfo) {
            table.push([info.url, info.verb.toUpperCase(), info.controllerName.replace("Controller", ""), info.status])
        }

        console.log(table.toString());
    }

    /**
     * Add at end
     */
    endTag() {
        console.log("");
    }


}