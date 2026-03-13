import { uxp } from "../../globals";

export async function getSecureStorageData(key: string) {
    try {
        const { secureStorage } = uxp.storage;
        const storageData = await secureStorage.getItem(key);
        const decodedData = storageData ? String.fromCharCode(...storageData) : "";

        return decodedData;
    } catch (error) {
        console.error(
            error instanceof Error ? error.message : "Unable to extract data from the storage.",
        );
        return "";
    }
}
