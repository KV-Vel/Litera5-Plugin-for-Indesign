import { useState, useEffect } from "react";
import { app, indesign } from "../../globals";
import { STYLES_NAMES } from "indd/constants";
import { CharacterStyle, Swatch } from "indesign";
import { OrthoKind } from "litera5-api-js-client";
import { TextVariations } from "types/data";

interface ActiveKindEntity {
    txt: TextVariations | null;
}

interface ActiveInddKind extends ActiveKindEntity {
    name: OrthoKind | null;
}

interface IsEveryInddKindActive extends ActiveKindEntity {
    isActive: boolean;
}

export function useInddKindsHighlight() {
    const [activeInddKind, setActiveInddKind] = useState<ActiveInddKind>({
        name: null,
        txt: null,
    });
    const [everyInddKinds, setEveryInddKinds] = useState<IsEveryInddKindActive>({
        isActive: true,
        txt: null,
    });

    // toggle одного типа аннотаций в InDesign
    useEffect(() => {
        const timerId = setTimeout(() => {
            if (!activeInddKind.name) return;

            app.select(activeInddKind.txt!);
            const charStyleGroup = app.activeDocument.characterStyleGroups.itemByName(
                STYLES_NAMES.CHARACTER_STYLE_GROUP,
            );
            const activeStyle = charStyleGroup.characterStyles.itemByName(STYLES_NAMES.ACTIVE);

            const kindCharStyle = charStyleGroup.characterStyles.itemByName(activeInddKind.name);
            kindCharStyle.underline = !kindCharStyle.underline;
            // Сразу после проверки activeStyle будет !isValid
            if (activeStyle.isValid) {
                // activeStyle.underlineColor сразу после проверки будет null, поэтому name проверяем
                const activeUnderline = activeStyle.underlineColor as Swatch;
                const activeStyleHadSelection = activeUnderline?.name.includes(activeInddKind.name);
                if (activeStyleHadSelection) {
                    activeStyle.underline = !activeStyle.underline;
                    activeStyle.strikeThru = !activeStyle.strikeThru;
                }
            }

            app.select(indesign.NothingEnum.NOTHING);
        }, 0);

        return () => clearTimeout(timerId);
    }, [activeInddKind]);

    // toggle всех аннотаций в InDesign
    useEffect(() => {
        const timerId = setTimeout(() => {
            app.select(everyInddKinds.txt!);

            const charStyleGroup = app.activeDocument.characterStyleGroups.itemByName(
                STYLES_NAMES.CHARACTER_STYLE_GROUP,
            );
            const everyPluginCharStyle =
                charStyleGroup.characterStyles.everyItem() as unknown as CharacterStyle;
            const activeStyle = charStyleGroup.characterStyles.itemByName(STYLES_NAMES.ACTIVE);

            activeStyle.strikeThru = everyInddKinds.isActive;
            everyPluginCharStyle.underline = everyInddKinds.isActive;

            app.select(indesign.NothingEnum.NOTHING);
        }, 0);
        return () => clearTimeout(timerId);
    }, [everyInddKinds]);

    return [setEveryInddKinds, setActiveInddKind] as const;
}
