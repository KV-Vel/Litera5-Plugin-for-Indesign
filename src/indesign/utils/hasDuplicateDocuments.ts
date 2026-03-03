import { Document } from "indesign";
import { app } from "../../globals";

/**
 * @description указывает на наличие двух и более открытых документов с одинаковым именем.
 */
export function hasDuplicateDocuments(name: Document["name"]) {
    const allDocsNames = (app.documents.everyItem() as unknown as Document)
        .name as unknown as string[];

    const hasDuplicates = allDocsNames.filter((docName) => docName == name).length >= 2;

    return hasDuplicates;
}
