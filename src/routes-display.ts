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
        console.log(" Routes: " + this.routesInfo.length);
    }

    /**
     * create table content with route info
     */
    content() {
        let table: any = new CliTable({
            head: [
                "\x1b[32m\x1b[1mUrl\x1b[0m",
                "\x1b[32m\x1b[1mVerb\x1b[0m",
                "\x1b[32m\x1b[1mController\x1b[0m",
                "\x1b[32m\x1b[1mJWT\x1b[0m",
             //   "\x1b[32m\x1b[1mCors\x1b[0m",
                "\x1b[32m\x1b[1mCheck\x1b[0m"
            ]
            , colWidths: [40, 7, 25, 7, 7]
        });

        for (let info of this.routesInfo) {
            table.push([
                info.url,
                info.verb.toUpperCase(),
                info.controllerName.replace("Controller", ""),
                (info.protected ? "Yes" : "\x1b[31mNO\x1b[0m"),
             //   (info.cors ? "\x1b[36mYes\x1b[0m" : "NO"),
                (info.status ? "OK" : "\x1bKO\x1b[0m")
            ])
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
