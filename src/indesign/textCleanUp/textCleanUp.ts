import { ChangeGrepPreference, FindGrepPreference, TextFrame } from "indesign";
import { app } from "../../globals";
import { TextVariations } from "../../types/data";

const GREP_SYMBOLS = {
    NONBREAKING_SPACE: "~S",
    DISCRETIONARY_HYPHEN: "~-",
    ANY_IDENT: "~i",
};

const grepExpressions = {
    removeDoubleSpace: "[  ]{2,}",
};

const findAndChangeGrep = (
    textObject: TextVariations | TextFrame,
    toFind: FindGrepPreference["findWhat"],
    changeTo: ChangeGrepPreference["changeTo"],
) => {
    if (!textObject.isValid) {
        return;
    }

    (app.findGrepPreferences as FindGrepPreference).findWhat = toFind;
    (app.changeGrepPreferences as ChangeGrepPreference).changeTo = changeTo;

    textObject.changeGrep(false);
};

/**
 * @description Убирает непечатаемые символы, которые не видит Литера при проверке, но видит Indesign
 */
export default function textCleanUp(
    text: TextVariations | TextFrame,
): [string, TextVariations | TextFrame] {
    // Убираем 2 и более пробела
    findAndChangeGrep(text, grepExpressions.removeDoubleSpace, " ");

    // Убираем дискреционный перенос
    findAndChangeGrep(text, GREP_SYMBOLS.DISCRETIONARY_HYPHEN, "");

    // Убираем фиксированный пробел
    findAndChangeGrep(text, GREP_SYMBOLS.NONBREAKING_SPACE, "");

    // Убираем произвольный отсуп
    findAndChangeGrep(text, GREP_SYMBOLS.ANY_IDENT, "");

    /**
     * Возвращаем не contents из аргумента text, а заново selection, потому что после очистки текста от непечатаемых символов
     * объект может стать !isValid и не даст вернуть text.contents
     */
    const currentSelection = (app.selection as TextVariations[] | TextFrame[])[0];
    return [currentSelection.contents.toString(), currentSelection];
}
