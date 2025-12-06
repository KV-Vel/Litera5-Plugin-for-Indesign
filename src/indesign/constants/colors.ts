import { OrthoKind } from "litera5-api-js-client";
import { RGB, TypoColors } from "../types/color";

export const FILL_COLORS: Record<OrthoKind, RGB> = {
    mkSpelling: [159, 197, 232],
    mkGrammar: [234, 153, 153],
    mkPunctuation: [182, 215, 168],
    mkStyle: [249, 203, 156],
    mkSemantic: [109, 158, 235],
    mkTypography: [162, 196, 201],
    mkYo: [213, 166, 189],
    mkPaperStructure: [142, 124, 195],
};

const BORDER_COLORS: Record<OrthoKind, RGB> = {
    mkSpelling: [36, 96, 151],
    mkGrammar: [152, 31, 31],
    mkPunctuation: [76, 123, 56],
    mkStyle: [190, 101, 11],
    mkSemantic: [17, 58, 123],
    mkTypography: [58, 95, 101],
    mkYo: [119, 56, 87],
    mkPaperStructure: [47, 36, 79],
};

export const COLORS_STRUCTURE: TypoColors[] = [
    {
        fill: {
            value: FILL_COLORS[OrthoKind.SPELLING],
            name: `fill (${OrthoKind.SPELLING})`,
        },
        border: {
            value: BORDER_COLORS[OrthoKind.SPELLING],
            name: `border (${OrthoKind.SPELLING})`,
        },
    },
    {
        fill: {
            value: FILL_COLORS[OrthoKind.GRAMMAR],
            name: `fill (${OrthoKind.GRAMMAR})`,
        },
        border: {
            value: BORDER_COLORS[OrthoKind.GRAMMAR],
            name: `border (${OrthoKind.GRAMMAR})`,
        },
    },
    {
        fill: {
            value: FILL_COLORS[OrthoKind.PUNCTUATION],
            name: `fill (${OrthoKind.PUNCTUATION})`,
        },
        border: {
            value: BORDER_COLORS[OrthoKind.PUNCTUATION],
            name: `border (${OrthoKind.PUNCTUATION})`,
        },
    },
    {
        fill: {
            value: FILL_COLORS[OrthoKind.STYLE],
            name: `fill (${OrthoKind.STYLE})`,
        },
        border: {
            value: BORDER_COLORS[OrthoKind.STYLE],
            name: `border (${OrthoKind.STYLE})`,
        },
    },
    {
        fill: {
            value: FILL_COLORS[OrthoKind.SEMANTIC],
            name: `fill (${OrthoKind.SEMANTIC})`,
        },
        border: {
            value: BORDER_COLORS[OrthoKind.SEMANTIC],
            name: `border (${OrthoKind.SEMANTIC})`,
        },
    },
    {
        fill: {
            value: FILL_COLORS[OrthoKind.TYPOGRAPHY],
            name: `fill (${OrthoKind.TYPOGRAPHY})`,
        },
        border: {
            value: BORDER_COLORS[OrthoKind.TYPOGRAPHY],
            name: `border (${OrthoKind.TYPOGRAPHY})`,
        },
    },
    {
        fill: {
            value: FILL_COLORS[OrthoKind.YO],
            name: `fill (${OrthoKind.YO})`,
        },
        border: {
            value: BORDER_COLORS[OrthoKind.YO],
            name: `border (${OrthoKind.YO})`,
        },
    },
    {
        fill: {
            value: FILL_COLORS[OrthoKind.PAPER_STRUCTURE],
            name: `fill (${OrthoKind.PAPER_STRUCTURE})`,
        },
        border: {
            value: BORDER_COLORS[OrthoKind.PAPER_STRUCTURE],
            name: `border (${OrthoKind.PAPER_STRUCTURE})`,
        },
    },
];
