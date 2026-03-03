import { OrthoKind } from "litera5-api-js-client";

export interface UserSettings {
    exceptions: Record<OrthoKind, boolean>;
}
