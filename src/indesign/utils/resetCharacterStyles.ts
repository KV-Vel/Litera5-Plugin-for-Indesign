import { app } from "../../globals";
import { TextVariations } from "../../types/data";

/**
 * @description сбрасывает стиль символов на стиль по умолчанию — [Без стиля]
 * @param texts текстовые объекты, у которых должен быть сброшен применненный стиль символов
 */
export default function resetCharacterStyles(texts: TextVariations[]) {
    const defaultCharStyle = app.activeDocument.characterStyles.itemByName("[Без стиля]");
    /**
     * Индизайн багует при применении стиля [Без стиля] через код и не снимает стиль.
     * Чтобы сработало, нужно очистить стили символов через clearOverrides.
     * Однако clearOverrides убирает также сжатие текста, которое могло быть применено, что очень мешает.
     * Поэтому выход только в создании дополнительного стиля на основе [Без стиля] и последующим его удалении (чтобы сбросился на Без стиля автоматом).
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
         * Из-за проверки на валидность появляется баг с тем, когда используя, уже отмеченные ошибки в тексте,
         * пользователь добавил новые слова в текст, тогда ссылка на объект с текстом в индизе
         * будет обновляться и выделение текста будет неточным
         */

        // if (!text.isValid) {
        //     return;
        // }

        app.select(text);
        text.applyCharacterStyle(deletingCharStyle);
        // text.clearOverrides(indesign.OverrideType.CHARACTER_ONLY);
    });

    deletingCharStyle.remove(defaultCharStyle);
}
