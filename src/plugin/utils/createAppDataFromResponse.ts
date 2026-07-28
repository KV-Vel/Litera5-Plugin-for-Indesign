import { CheckOgxtResultsResponse } from "litera5-api-js-client";
import { CheckedDocData, ExtendedAnnotationStats, TextVariations, TypoData } from "types/data";
import { initInddSettings } from "indd/settings/settings";
import { app } from "../../globals";
import { TextFrame } from "indesign";
import { getTextFromCharsPositions } from "indd/utils";
import { UserSettings } from "types/settings";

type AppData = {
    typos: TypoData[];
    typosStats: ExtendedAnnotationStats[];
    checkedDocData: CheckedDocData;
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

    const textToCheck = selection.texts.firstItem();
    const appData = {
        typos: [],
        typosStats: [],
        checkedDocData: {
            name: app.activeDocument.name,
            text: textToCheck,
            id: crypto.randomUUID(),
        },
    };

    const textHasNoTypos = !annotations?.annotations || !stats?.annotations;
    if (textHasNoTypos) {
        return appData;
    }

    const characterStyleGroup = initInddSettings();
    const annotationTypeChilds = new Map();
    const userFilteredAnnotations = annotations.annotations.filter(
        ({ kind }) => settings.exceptions[kind] === true,
    );

    const typosData = userFilteredAnnotations.map((typo) => {
        const { position, kind, id } = typo;

        const textWithTypo = position.map(({ start, end }) => {
            const selectedTypoInText = getTextFromCharsPositions(start, end, textToCheck);
            // Возможно, лучше действительно сразу взять все characterStyles чем для условных 20 ошибок каждый раз брать новый стиль
            const charactersHighlightStyle = characterStyleGroup.characterStyles.itemByName(kind);
            selectedTypoInText.applyCharacterStyle(charactersHighlightStyle);

            return selectedTypoInText;
        });

        if (!annotationTypeChilds.has(kind)) {
            annotationTypeChilds.set(kind, [id]);
        } else {
            const kindStat = annotationTypeChilds.get(kind);
            kindStat.push(id);
        }

        return { typo, selection: textWithTypo };
    });
    return {
        typos: typosData,
        typosStats: stats.annotations
            .filter(({ kind }) => settings.exceptions[kind] === true)
            .map((annotationStat) => ({
                ...annotationStat,
                name: annotationStat.name === "ё" ? "Буква Ё" : annotationStat.name,
                selected: true,
                typoIds: annotationTypeChilds.get(annotationStat.kind),
            })),
        checkedDocData: { ...appData.checkedDocData },
    };
}
