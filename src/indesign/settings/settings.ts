import { OrthoKind } from "litera5-api-js-client";
import { TypoColors, ColorName, RGB } from "../types/color";
import { CharacterStyleGroup, Color, ColorGroup, Swatch } from "indesign";
import {
    COLORS_STRUCTURE,
    ANNOTATION_HIGHLIGHT_SETTINGS,
    STYLES_NAMES,
    BIG_RATIO,
    SMALL_RATIO,
} from "../constants/index";
import { indesign, app } from "../../globals";
import { getDefaultParagraphStyleFontSize } from "../utils/index";

/**
 * @description создает группу цветов в активном документе
 */
function createColorGroup(
    name: string,
    swatches: Swatch[],
    otherProperties: object = {},
): ColorGroup {
    const { colorGroups } = app.activeDocument;
    return colorGroups.add(name, swatches, otherProperties);
}

function createHighlightColors(colorValues: TypoColors[]) {
    return colorValues.flatMap(({ fill, border }) => [
        createColor(fill.value, fill.name),
        createColor(border.value, border.name),
    ]);
}

function createColor(value: RGB, name: ColorName, props: object = {}): Color {
    const { colors } = app.activeDocument;
    return colors.add({
        colorValue: value,
        model: indesign.ColorModel.SPOT, // Тип цвета: Плашечный
        space: indesign.ColorSpace.RGB,
        name: name,
        ...props,
    });
}

function createCharacterStyleGroup(props: object): CharacterStyleGroup {
    const { characterStyleGroups } = app.activeDocument;
    return characterStyleGroups.add(props);
}

/**
 * @description создает стиль символов для каждого типа ошибки OrthoKind
 * @param group группа, где будут находиться стили
 * @param textSize размер текста исходя из которого будет создаваться высота линии выделения текста
 */
function createCharacterStylesForOrthoKinds(group: CharacterStyleGroup, textSize: number) {
    const { colors } = app.activeDocument;

    const calculatedSettings = {
        underlineWeight: (BIG_RATIO * textSize) / 100,
        underlineOffset: -(SMALL_RATIO * textSize) / 100,
    };

    Object.values(OrthoKind).forEach((typoName) => {
        const color = colors.itemByName(`fill (${typoName})`);

        group.characterStyles.add({
            name: typoName,
            underlineColor: color,
            ...calculatedSettings,
            ...ANNOTATION_HIGHLIGHT_SETTINGS.FILL,
        });
    });

    group.characterStyles.add({
        name: STYLES_NAMES.ACTIVE,
        ...calculatedSettings,
        ...ANNOTATION_HIGHLIGHT_SETTINGS.UNDERLINE,
        // Подчеркивание будет иметь отступ и высоту в 2 раза меньше чем выделение
        strikeThroughOffset: calculatedSettings.underlineOffset / 2,
        strikeThroughWeight: -(calculatedSettings.underlineOffset / 2),
        ...ANNOTATION_HIGHLIGHT_SETTINGS.FILL,
    });
}
/**
 * @description инициализицая параметров, групп и стилей Indesign для работы с плагином
 */
function initInddSettings(): CharacterStyleGroup {
    const { colorGroups, characterStyles, characterStyleGroups } = app.activeDocument;
    const colorGroup = colorGroups.itemByName(STYLES_NAMES.COLOR_GROUP);

    if (colorGroup.isValid) {
        /**
         * Поскольку заблокировать группу нельзя, во избежание изменения параметров стилей пользователем (вручную) —
         * при каждой проверке стили будут создаваться заново
         */
        colorGroup.remove();
    }
    const highlightColors = createHighlightColors(COLORS_STRUCTURE);
    createColorGroup(STYLES_NAMES.COLOR_GROUP, highlightColors);

    // Выбирает ["Без стиля"]. Выбор не по имени, чтобы избежать ошибок, если у пользователя интерфейс Indesign не на русском.
    const defaultCharStyle = characterStyles.firstItem();
    let characterStyleGroup = characterStyleGroups.itemByName(STYLES_NAMES.CHARACTER_STYLE_GROUP);
    if (characterStyleGroup.isValid) {
        characterStyleGroup.remove(defaultCharStyle);
    }

    characterStyleGroup = createCharacterStyleGroup({
        name: STYLES_NAMES.CHARACTER_STYLE_GROUP,
    });

    createCharacterStylesForOrthoKinds(
        characterStyleGroup,
        Number(getDefaultParagraphStyleFontSize()),
    );

    return characterStyleGroup;
}

export { initInddSettings };
