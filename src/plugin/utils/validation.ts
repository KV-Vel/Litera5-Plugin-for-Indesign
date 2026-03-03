import { TextFrame } from "indesign";
import { TextVariations } from "../../types/data";
import { LITERA5_MIN_TEXT_LENGTH, LITERA5_LOGIN_PATTERN } from "../../litera5/constants";
import { getSelection } from "../../indesign/utils";

export function loginIsValid(login: string) {
    if (!login.trim().length) {
        throw new Error("Не указан логин.");
    }

    const loginHasValidPattern = LITERA5_LOGIN_PATTERN.test(login.trim());
    if (!loginHasValidPattern) {
        throw new Error(
            "Логин не соответствует формату. Правильный формат: ivanov.av, где invanov — фамилия, а av — инициалы.",
        );
    }

    return true;
}

export function indesignSelectionIsValid(selection: ReturnType<typeof getSelection>) {
    if (!selection) {
        throw new Error("Не найден выделенный текст или фрейм.");
    }

    if (selection.constructorName === "Cell") {
        throw new Error("Плагин не поддерживает проверку текста в таблице.");
    }

    const selectionWithoutTexts = !("texts" in selection);
    if (selectionWithoutTexts) {
        throw new Error(
            "Не найден текст в выделенном объекте. Убедитесь, что Вы выделили фрейм или текст в нем.",
        );
    }

    if ((selection as TextFrame).overflows) {
        throw new Error(
            "В выделенном объекте обнаружен вытесненный текст. Удалите вытесненный текст или переместите его в другой фрейм.",
        );
    }

    const selectionReachMinTextLength =
        (selection as TextVariations).texts.firstItem().length > LITERA5_MIN_TEXT_LENGTH;
    if (!selectionReachMinTextLength) {
        throw new Error(
            "Объём проверяемого текста должен быть не меньше 32 и не больше 100.000 знаков.",
        );
    }

    return true;
}
