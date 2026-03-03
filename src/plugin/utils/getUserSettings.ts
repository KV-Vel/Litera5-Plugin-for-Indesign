import { UserSettings } from "../../types/settings";
import { DEFAULT_USER_SETTINGS, LOCAL_STORAGE_KEYS } from "../constants";

export function getUserSettings(): UserSettings {
    const userExceptions = localStorage.getItem(LOCAL_STORAGE_KEYS.EXCEPTIONS);

    return {
        exceptions: userExceptions ? JSON.parse(userExceptions) : DEFAULT_USER_SETTINGS.EXCEPTIONS,
    };
}
