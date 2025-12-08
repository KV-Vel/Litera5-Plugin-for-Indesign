import { Document } from "indesign";
import { app } from "../../globals";

export default function makeDocumentActive(document: Document): boolean {
    if (document.isValid) {
        app.activeDocument = document;
        return true;
    }
    return false;
    /**
     * Попробовать проще
     * return app.activeDocument.name === document.name
     */
}
