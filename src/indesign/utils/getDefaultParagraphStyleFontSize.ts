import { app } from "../../globals";

/**
 * @description возвращает стиль параграфов по умолчанию
 */
export function getDefaultParagraphStyleFontSize() {
    /**
     * Дефолтный стиль параграфов идет под индексом 1.
     * Под нулевым индексом идет - [Без стиля], который не отображается в Indesign и его нельзя использовать
     */
    return app.activeDocument.paragraphStyles.item(1).pointSize;
}
