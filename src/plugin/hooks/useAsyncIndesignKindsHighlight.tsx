import { useState, useEffect } from "react";
import { app, indesign } from "../../globals";
import { STYLES_NAMES } from "../../indesign/constants";
import { CharacterStyle, Swatch } from "indesign";
import { OrthoKind } from "litera5-api-js-client";
import { TextVariations } from "../../types/data";

export default function useAsyncIndesignKindsHighlight() {
    const [indesignKindState, setIndesignKindState] = useState<{
        kind: OrthoKind | null;
        txt: TextVariations | null;
    }>({
        kind: null,
        txt: null,
    });
    const [everyIndesignKindsState, setEveryIndesignKindsState] = useState<{
        active: boolean;
        txt: TextVariations | null;
    }>({
        active: true,
        txt: null,
    });

    /**
     * Здесь useEffect + setTimeout, потому что, без этого в Indesign появляется странное поведение (или я чего-то не знаю про React):
     * если проверенный текст находится на нескольких страницах, то при снятии выбора с типа аннотации, выделение на тексте может не сохраняться, пока
     * пользователь не поставит курсор в текст фрейма
     */

    // toggle одного типа аннотаций в InDesign
    useEffect(() => {
        const timerId = setTimeout(() => {
            app.select(indesignKindState.txt!);
            const pluginCharStyleGroup = app.activeDocument.characterStyleGroups.itemByName(
                STYLES_NAMES.CHARACTER_STYLE_GROUP,
            );
            const activeStyle = pluginCharStyleGroup.characterStyles.itemByName(
                STYLES_NAMES.ACTIVE,
            );

            if (indesignKindState.kind) {
                const kindCharStyle = pluginCharStyleGroup.characterStyles.itemByName(
                    indesignKindState.kind as string,
                );
                kindCharStyle.underline = !kindCharStyle.underline;
                // Сразу после проверки activeStyle будет !isValid
                if (activeStyle.isValid) {
                    // activeStyle.underlineColor сразу после проверки будет null, поэтому name проверяем
                    if (
                        (activeStyle.underlineColor as Swatch)?.name.includes(
                            indesignKindState.kind,
                        )
                    ) {
                        activeStyle.underline = !activeStyle.underline;
                        activeStyle.strikeThru = !activeStyle.strikeThru;
                    }
                }
            }

            app.select(indesign.NothingEnum.NOTHING);
        }, 0);

        return () => clearTimeout(timerId);
    }, [indesignKindState]);

    // toggle всех аннотаций в InDesign
    useEffect(() => {
        const timerId = setTimeout(() => {
            app.select(everyIndesignKindsState.txt!);
            const pluginCharStyleGroup = app.activeDocument.characterStyleGroups.itemByName(
                STYLES_NAMES.CHARACTER_STYLE_GROUP,
            );
            const everyPluginCharStyle =
                pluginCharStyleGroup.characterStyles.everyItem() as unknown as CharacterStyle;
            const activeStyle = pluginCharStyleGroup.characterStyles.itemByName(
                STYLES_NAMES.ACTIVE,
            );
            activeStyle.strikeThru = everyIndesignKindsState.active;
            everyPluginCharStyle.underline = everyIndesignKindsState.active;
            app.select(indesign.NothingEnum.NOTHING);
        }, 0);
        return () => clearTimeout(timerId);
    }, [everyIndesignKindsState]);

    return [setEveryIndesignKindsState, setIndesignKindState] as const;
}
