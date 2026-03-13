import { TextFrame } from "indesign";
import { TextVariations } from "../../types/data";
import { LITERA5_MIN_TEXT_LENGTH } from "../../litera5/constants";
import { getSelection } from "../../indesign/utils";

export function loginIsValid(login: string) {
    if (!login.trim().length) {
        throw new Error("Login not specified.");
    }

    return true;
}

export function indesignSelectionIsValid(selection: ReturnType<typeof getSelection>) {
    if (!selection) {
        throw new Error("Unable to find selected text or frame.");
    }

    if (selection.constructorName === "Cell") {
        throw new Error("Plugin does not support checking table cells.");
    }

    const selectionWithoutTexts = !("texts" in selection);
    if (selectionWithoutTexts) {
        throw new Error(
            "Unable to find text in selected object. Make sure text or frame was selected.",
        );
    }

    if ((selection as TextFrame).overflows) {
        throw new Error(
            "Selected object has an overflowed text. Delete overflowed text or move it to another frame.",
        );
    }

    const selectionReachMinTextLength =
        (selection as TextVariations).texts.firstItem().length > LITERA5_MIN_TEXT_LENGTH;
    if (!selectionReachMinTextLength) {
        throw new Error(
            "The text must contain no less than 32 and no more than 100.000 characters.",
        );
    }

    return true;
}
