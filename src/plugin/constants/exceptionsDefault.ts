import { OrthoKind } from "litera5-api-js-client";

export const EXCEPTIONS_NAME = "exceptions";
export const EXCEPTIONS_DEFAULT_STATE = {
    [OrthoKind["GRAMMAR"]]: true,
    [OrthoKind["PAPER_STRUCTURE"]]: true,
    [OrthoKind["PUNCTUATION"]]: true,
    [OrthoKind["SEMANTIC"]]: true,
    [OrthoKind["SPELLING"]]: true,
    [OrthoKind["STYLE"]]: true,
    [OrthoKind["TYPOGRAPHY"]]: true,
    [OrthoKind["YO"]]: true,
};
