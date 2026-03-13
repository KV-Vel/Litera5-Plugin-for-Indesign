import { app } from "../../globals";
import { TextVariations } from "../../types/data";

/**
 * @description сбрасывает стиль символов на стиль по умолчанию — [Без стиля]
 * @param texts текстовые объекты, у которых должен быть сброшен примененный стиль символов
 */
export function resetCharacterStyles(texts: TextVariations[]) {
    const defaultCharStyle = app.activeDocument.characterStyles.firstItem(); // Стиль символов - [Без стиля]
    let errors = 0;
    /**
     * Индизайн багует при применении стиля [Без стиля] через код и не снимает стиль.
     * Чтобы сработало, нужно очистить стили символов через clearOverrides.
     * Однако clearOverrides убирает также сжатие текста, которое могло быть применено.
     * Поэтому выход только в создании дополнительного стиля на основе [Без стиля] и последующем его удалении (чтобы сбросился на [Без стиля] автоматом).
     * Это тоже не идеальный вариант, потому что если по тексту где-то применены другие стили символов, то они соответственно будут сброшены
     * @see https://community.adobe.com/t5/indesign-discussions/applying-none-character-style/m-p/2329089
     */
    let deletingCharStyle = app.activeDocument.characterStyles.itemByName("toDelete");
    if (!deletingCharStyle.isValid) {
        deletingCharStyle = app.activeDocument.characterStyles.add({
            name: "toDelete",
            basedOn: defaultCharStyle,
        });
    }

    texts.forEach((text) => {
        /**
         * Из-за проверки текстового объекта indesign на isValid JS обновляет ссылку на этот объект.
         * Таким образом, если пользователь добавит новые слова в уже проверенный текст - тогда ссылка на объект с текстом в индизе будет обновляться
         * и выделение текста будет неточным
         */

        // if (!text.isValid) {
        //     return;
        // }
        try {
            app.select(text);
            text.applyCharacterStyle(deletingCharStyle);
        } catch (_) {
            errors += 1;
        }

        // text.clearOverrides(indesign.OverrideType.CHARACTER_ONLY);
    });

    deletingCharStyle.remove(defaultCharStyle);

    if (errors > 0) {
        throw new Error(
            `Failed to reset selection for some errors in the text. Number of annotations failed to reset in the text: ${errors} `,
        );
    }
}
