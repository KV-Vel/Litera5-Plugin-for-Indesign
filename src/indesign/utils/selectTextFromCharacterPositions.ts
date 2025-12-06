import { Position } from "litera5-api-js-client";
import { TextVariations } from "../../types/data";
import getSelection from "./getSelection";
import { app } from "../../globals";

export default function getTextFromCharsPositions(
    start: Position["start"],
    end: Position["end"],
    targetText: TextVariations,
) {
    const firstTextChar = targetText.characters.item(start);
    const lastTextChar = targetText.characters.item(end);
    const textFromFirstAndLastChars = targetText.characters.itemByRange(
        firstTextChar,
        lastTextChar,
    );

    app.select(textFromFirstAndLastChars);
    const selectedTypo = getSelection();

    return selectedTypo as TextVariations;
}
