import { Document } from "indesign";
import { app } from "../../globals";

/**
 * @description делает документ активным (у пользователя вкладка документа становится активной). При отсутствии документа возвращает false
 */
export function makeDocumentActive(document: Document): boolean {
    if (!document.isValid) return false;

    app.activeDocument = document;
    return true;
}
