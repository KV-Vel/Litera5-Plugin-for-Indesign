import { CheckOgxtResultsResponse, OrthoKind } from "litera5-api-js-client";
import {
    CheckedDocumentData,
    ExtendedAnnotationStats,
    TextVariations,
    TypoData,
} from "../../types/data";
import { initIndesignSettings } from "../../indesign/settings/settings";
import { app } from "../../globals";
import { TextFrame } from "indesign";
import { getTextFromCharsPositions } from "../../indesign/utils";
import { UserSettings } from "../../types/settings";

type AppData = {
    typos: TypoData[];
    stats: ExtendedAnnotationStats[];
    checkedDocData: CheckedDocumentData;
};

export function createAppDataFromResponse(
    { annotations, stats }: CheckOgxtResultsResponse,
    selection: TextVariations | TextFrame,
    settings: UserSettings,
): AppData {
    // На случай, если пользователь закроет документ до начала выделения ошибок.
    if (!app.documents.length) {
        throw new Error("Не удалось отметить ошибки, т.к проверяемый документ был закрыт.");
    }

    const textHasNoTypos = !annotations?.annotations || !stats?.annotations;
    const textToCheck = selection.texts.firstItem();
    if (textHasNoTypos) {
        return {
            typos: [],
            stats: [],
            checkedDocData: {
                name: app.activeDocument.name,
                text: textToCheck,
                id: crypto.randomUUID(),
            },
        };
    }

    const characterStyleGroup = initIndesignSettings();
    const annotationTypeChilds = new Map();
    const userFilteredAnnotations = annotations.annotations.filter(
        (item) => settings.exceptions[item.kind as OrthoKind] === true,
    );

    const typosData = userFilteredAnnotations.map((typo) => {
        const textWithTypo = typo.position.map(({ start, end }) => {
            const selectedTypoInText = getTextFromCharsPositions(start, end, textToCheck);
            // Возможно, лучше действительно сразу взять все characterStyles чем для условных 20 ошибок каждый раз брать новый стиль
            const charactersHighlightStyle = characterStyleGroup.characterStyles.itemByName(
                typo.kind,
            );
            selectedTypoInText.applyCharacterStyle(charactersHighlightStyle);

            return selectedTypoInText;
        });

        if (!annotationTypeChilds.has(typo.kind)) {
            annotationTypeChilds.set(typo.kind, [typo.id]);
        } else {
            const kindStat = annotationTypeChilds.get(typo.kind);
            kindStat.push(typo.id);
        }

        return { typo, selection: textWithTypo };
    });
    return {
        typos: typosData,
        stats: stats.annotations
            .filter((item) => settings.exceptions[item.kind as OrthoKind] === true)
            .map((annotationStat) => ({
                ...annotationStat,
                name: annotationStat.name === "ё" ? "Буква Ё" : annotationStat.name,
                selected: true,
                typoIds: annotationTypeChilds.get(annotationStat.kind),
            })),
        checkedDocData: {
            name: app.activeDocument.name,
            text: textToCheck,
            id: crypto.randomUUID(),
        },
    };
}
