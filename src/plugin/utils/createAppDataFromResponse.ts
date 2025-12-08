import { CheckOgxtResultsResponse, OrthoKind } from "litera5-api-js-client";
import {
    CheckedDocumentData,
    ExtendedAnnotationStats,
    TextVariations,
    TypoData,
} from "../../types/data";

import { indesignUtils } from "../../indesign/utils";
import { initIndesignSettings } from "../../indesign/settings/settings";
import { app } from "../../globals";
import { TextFrame } from "indesign";

type AppData = {
    typos: TypoData[];
    stats: ExtendedAnnotationStats[];
    checkedDocData: CheckedDocumentData;
};

export default function createAppDataFromResponse(
    { annotations, stats }: CheckOgxtResultsResponse,
    selection: TextVariations | TextFrame,
    exceptions: Record<OrthoKind, boolean>,
): AppData {
    // На случай, если пользователь закроет документ до начала выделения ошибок.
    if (!app.documents.length) {
        throw new Error("Не удалось отметить ошибки, т.к не открыт ни один документ.");
    }

    const textHasNoTypos = !annotations?.annotations || !stats?.annotations;
    const textToCheck = selection.texts.firstItem();
    if (textHasNoTypos) {
        return {
            typos: [],
            stats: [],
            checkedDocData: {
                checkedDocumentName: app.activeDocument.name,
                checkedText: textToCheck,
                checkId: crypto.randomUUID(),
            },
        };
    }
    const characterStyleGroup = initIndesignSettings();
    const annotationTypeChilds = new Map();
    const userFilteredAnnotations = annotations.annotations.filter(
        (item) => exceptions[item.kind as OrthoKind] === true,
    );

    const typosData = userFilteredAnnotations.map((typo) => {
        const textWithTypo = typo.position.map(({ start, end }) => {
            const selectedTypoInText = indesignUtils.getTextFromCharsPositions(
                start,
                end,
                textToCheck,
            );
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

        return {
            typo,
            selection: textWithTypo,
            hidden: false,
        };
    });
    return {
        typos: typosData,
        stats: stats.annotations
            .filter((item) => exceptions[item.kind as OrthoKind] === true)
            .map((annotationStat) => ({
                ...annotationStat,
                name: annotationStat.name === "ё" ? "Буква Ё" : annotationStat.name,
                selected: true,
                typoIds: annotationTypeChilds.get(annotationStat.kind),
            })),
        checkedDocData: {
            checkedDocumentName: app.activeDocument.name,
            checkedText: textToCheck,
            checkId: crypto.randomUUID(),
        },
    };
}
