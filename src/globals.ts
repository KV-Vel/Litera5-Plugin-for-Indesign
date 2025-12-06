/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */

import { Application } from "indesign";

if (typeof require === "undefined") {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    window.require = (moduleName: string) => {
        return {};
    };
}

export const uxp = require("uxp") as typeof import("uxp");
const hostName = uxp && uxp?.host?.name?.toLowerCase();

export const indesign = (hostName === "indesign" ? require("indesign") : {}) as any;
export const { app } = indesign as Application;
