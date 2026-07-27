import { CiceroKind, OrthoKind, QualityKind } from "litera5-api-js-client";

export interface UserSettings {
    exceptions: Record<OrthoKind | CiceroKind | QualityKind | string, boolean>;
}
