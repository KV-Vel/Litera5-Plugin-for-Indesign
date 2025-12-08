import { OrthoKind } from "litera5-api-js-client";
import { TypoColors, ColorName, RGB } from "../types/color";
import { CharacterStyleGroup, Color, ColorGroup, Swatch } from "indesign";
import {
    COLORS_STRUCTURE,
    CHARACTER_STYLES_SETTINGS,
    STYLES_NAMES,
    BIG_RATIO,
    SMALL_RATIO,
} from "../constants/index";
import { indesign } from "../../globals";
import { app } from "../../globals";

/**
 * @description создает группу цветов в активном документе
 */
function createColorGroup(
    name: string,
    swatches: Swatch[],
    otherProperties: object = {},
): ColorGroup {
    return app.activeDocument.colorGroups.add(name, swatches, { ...otherProperties });
}

function createHighlightColorsForGroup(colorValues: TypoColors[]) {
    return colorValues.flatMap(({ fill, border }) => [
        createColor(fill.value, fill.name),
        createColor(border.value, border.name),
    ]);
}

function createColor(value: RGB, name: ColorName, props: object = {}): Color {
    return app.activeDocument.colors.add({
        colorValue: value,
        model: indesign.ColorModel.SPOT, // Тип цвета: Плашечный
        space: indesign.ColorSpace.RGB,
        name: name,
        ...props,
    });
}

function createCharacterStyleGroup(props: object): CharacterStyleGroup {
    return app.activeDocument.characterStyleGroups.add({ ...props });
}

/**
 * @description создает стиль символов для каждого типа ошибки OrthoKind
 * @param group группа, где будут находиться стили
 * @param textSize размер текста исходя из которого будет создаваться высота линии выделения текста
 */
function createCharacterStylesForEachOrthoKind(group: CharacterStyleGroup, textSize: number) {
    const underlineWeight = (BIG_RATIO * textSize) / 100;
    const underlineOffset = -(SMALL_RATIO * textSize) / 100;

    Object.values(OrthoKind).forEach((typoName) => {
        const color = app.activeDocument.colors.itemByName(`fill (${typoName})`);

        group.characterStyles.add({
            name: typoName,
            underlineColor: color,
            underlineWeight: underlineWeight,
            underlineOffset: underlineOffset,
            ...CHARACTER_STYLES_SETTINGS.FILL,
        });
    });

    group.characterStyles.add({
        name: STYLES_NAMES.ACTIVE,
        underlineWeight: underlineWeight,
        underlineOffset: underlineOffset,
        ...CHARACTER_STYLES_SETTINGS.UNDERLINE,
        // Подчеркивание будет иметь отступ и высоту в 2 раза меньше чем выделение
        strikeThroughOffset: underlineOffset / 2,
        strikeThroughWeight: -(underlineOffset / 2),
        ...CHARACTER_STYLES_SETTINGS.FILL,
    });
}
/**
 * @description инициализицая параметров, групп, стилей Indesign для работы с плагином
 * @todo можно добавить различные пропсы в аргументы
 */
function initIndesignSettings(): CharacterStyleGroup {
    const colorGroup = app.activeDocument.colorGroups.itemByName(STYLES_NAMES.COLOR_GROUP);
    if (colorGroup.isValid) {
        /**
         * Поскольку заблокировать группу нельзя, во избежание изменения параметров стилей пользователем (вручную) —
         * при каждой проверке стили будут создаваться заново
         */
        colorGroup.remove();
    }
    const typoSelectionColors = createHighlightColorsForGroup(COLORS_STRUCTURE);
    createColorGroup(STYLES_NAMES.COLOR_GROUP, typoSelectionColors);

    const defaultCharStyle = app.activeDocument.characterStyles.itemByName("[Без стиля]");
    let characterStyleGroup = app.activeDocument.characterStyleGroups.itemByName(
        STYLES_NAMES.CHARACTER_STYLE_GROUP,
    );
    if (characterStyleGroup.isValid) {
        characterStyleGroup.remove(defaultCharStyle);
    }

    characterStyleGroup = createCharacterStyleGroup({
        name: STYLES_NAMES.CHARACTER_STYLE_GROUP,
    });

    // Именно 1 стиль имеет название [основной абзац], а не 0.
    const textSize = app.activeDocument.paragraphStyles.item(1);
    createCharacterStylesForEachOrthoKind(characterStyleGroup, Number(textSize.pointSize));

    return characterStyleGroup;
}

export { initIndesignSettings };
