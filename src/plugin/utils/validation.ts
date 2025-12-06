import { TextFrame } from "indesign";
import { TextVariations } from "../../types/data";
import { LITERA5_MIN_TEXT_LENGTH, LITERA5_LOGIN_PATTERN } from "../../litera5/constants";

export function loginIsValid(login: string) {
    if (!login.trim().length) {
        return { valid: false, errorMessage: "Не указан логин." };
    }

    const loginHasValidPattern = LITERA5_LOGIN_PATTERN.test(login.trim());
    if (!loginHasValidPattern) {
        return {
            valid: false,
            errorMessage:
                "Логин не соответствует формату. Правильный формат: ivanov.av, где invanov — фамилия, а av — инициалы.",
        };
    }

    return { valid: true };
}

export function indesignSelectionIsValid<
    T extends { constructorName: string } | TextFrame | TextVariations | undefined,
>(selection: T) {
    if (!selection) {
        return { valid: false, errorMessage: "Не найден выделенный текст или фрейм." };
    }

    if (selection.constructorName === "Cell") {
        return {
            valid: false,
            errorMessage: "Нельзя проверить текст в таблице.",
        };
    }

    const selectionWithoutTexts = !("texts" in selection);
    if (selectionWithoutTexts) {
        return {
            valid: false,
            errorMessage:
                "Не найден текст в выделенном объекте. Убедитесь, что Вы выделили фрейм или текст в нем.",
        };
    }

    if ((selection as TextFrame).overflows) {
        return {
            valid: false,
            errorMessage:
                "В выделенном объекте обнаружен вытесненный текст. Удалите вытесненный текст или переместите его в другой фрейм.",
        };
    }

    const selectionReachMinTextLength =
        (selection as TextVariations).texts.firstItem().length > LITERA5_MIN_TEXT_LENGTH;
    if (!selectionReachMinTextLength) {
        return {
            valid: false,
            errorMessage:
                "Объём проверяемого текста должен быть не меньше 32 и не больше 100.000 знаков.",
        };
    }

    return { valid: true };
}
