import { OrthoKind } from "litera5-api-js-client";

export type RGB = [number, number, number];
export type ColorTarget = "fill" | "border";
export type ColorName = `${ColorTarget} (${OrthoKind})`;

export interface TypoColors {
    fill: {
        value: RGB;
        name: ColorName;
    };
    border: {
        value: RGB;
        name: ColorName;
    };
}
