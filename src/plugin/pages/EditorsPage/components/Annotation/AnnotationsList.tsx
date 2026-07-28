import { useState, memo, useCallback, use, useContext, useDeferredValue } from "react";
import { AnnotationContainer } from "./AnnotationContainer";
import { ExtendedAnnotationStats, TextVariations, TypoData } from "types/data";
import "./AnnotationsList.scss";
import { AlertVariant } from "shared/Alert/types";
import { Alert, StatisticBadge } from "shared/index";
import { OrthoKind } from "litera5-api-js-client";
import { STYLES_NAMES } from "indd/constants";
import { useWithDocumentOpen } from "plugin/hooks/index";
import {
    TyposStatsContext,
    TyposStatsContextProps,
    TyposDataContext,
    TyposDataContextProps,
} from "plugin/context/index";
import { app } from "../../../../../globals";
import { capitalize } from "plugin/utils";
import { CheckedDocContext, CheckedDocContextProps } from "plugin/context/index";

type AnnotationsListProps = {
    selectedKinds: ExtendedAnnotationStats["name"][];
    onRemoveAnnotation: (id: number, kind: string, selection: TypoData["selection"]) => void;
};

type ActiveAnnotationProps = {
    id: number | null;
    texts: TextVariations[] | null;
    kind: OrthoKind | null;
};

const MemoizedAnnotationContainer = memo(AnnotationContainer);

export function AnnotationsList({ selectedKinds, onRemoveAnnotation }: AnnotationsListProps) {
    const [activeAnnotation, setActiveAnnotation] = useState<ActiveAnnotationProps>({
        id: null,
        texts: null,
        kind: null,
    });
    const { tryWithDocumentOpen } = useWithDocumentOpen();
    const { checkedDocData } = useContext(CheckedDocContext) as CheckedDocContextProps;
    const { typos } = useContext(TyposDataContext) as TyposDataContextProps;

    const deferredKinds = useDeferredValue(selectedKinds);
    const typosToShow = typos.filter(({ typo }) => deferredKinds.includes(typo.kind));

    const annotationsAreEmpty = !typos.length;
    const kindsNotSelected = !selectedKinds.length && typos.length > 0;

    const handleRemoveAnnotation = useCallback(
        (id: number, kind: string, selection: TypoData["selection"], isSelected: boolean) => {
            if (isSelected) {
                setActiveAnnotation({ id: null, texts: null, kind: null });
            }
            onRemoveAnnotation(id, kind, selection);
        },
        [onRemoveAnnotation],
    );

    const onHighlight = useCallback(
        (id: number, texts: TextVariations[], kind: OrthoKind) => {
            tryWithDocumentOpen(checkedDocData.name, () => {
                const charStyleGroup = app.activeDocument.characterStyleGroups.itemByName(
                    STYLES_NAMES.CHARACTER_STYLE_GROUP,
                );
                const activeCharStyle = charStyleGroup.characterStyles.itemByName(
                    STYLES_NAMES.ACTIVE,
                );
                setActiveAnnotation((prevActive) => {
                    if (prevActive.texts) {
                        // Возвращаем предыдущему активному выделению его прежний стиль символов
                        const prevHighlightStyle = charStyleGroup.characterStyles.itemByName(
                            prevActive.kind!,
                        );
                        prevActive.texts.forEach((txtObj) =>
                            txtObj.applyCharacterStyle(prevHighlightStyle),
                        );
                    }

                    activeCharStyle.underline = true;
                    activeCharStyle.strikeThru = true;
                    activeCharStyle.underlineColor = `fill (${kind})`;
                    activeCharStyle.strikeThroughColor = `border (${kind})`;

                    texts.forEach((txt) => txt.applyCharacterStyle(activeCharStyle));
                    texts[0].showText();

                    return { id, texts, kind };
                });
            });
        },
        [checkedDocData.name, tryWithDocumentOpen],
    );

    if (kindsNotSelected) {
        const [typosStats] = use(TyposStatsContext) as TyposStatsContextProps;

        return (
            <div className="editors-page__alert-wrapper">
                <Alert
                    header="Имеются выключенные примечания."
                    description="Вы можете включить их и продолжить работу."
                    type={AlertVariant.QUESTION}
                >
                    <ul className="available-kinds-list">
                        {typosStats.map((stat) => (
                            <li key={stat.kind} className="list-item">
                                <span>{capitalize(stat.name)}</span>
                                <StatisticBadge badgeStyle={stat.kind} remainedTypos={stat.count} />
                            </li>
                        ))}
                    </ul>
                </Alert>
            </div>
        );
    }

    if (annotationsAreEmpty) {
        return (
            <div className="editors-page__alert-wrapper">
                <Alert
                    header="У вас не осталось больше примечаний."
                    description="Пожалуйста, перепроверьте ваш текст или закончите работу над ним и приступайте к работе над следующим."
                    type={AlertVariant.SUCCESS}
                />
            </div>
        );
    }

    return (
        <>
            <ul className="annotations-list">
                {typosToShow.map((typoData) => (
                    <MemoizedAnnotationContainer
                        key={typoData.typo.id}
                        isSelected={typoData.typo.id === activeAnnotation.id}
                        typoData={typoData}
                        onHighlight={onHighlight}
                        onDelete={handleRemoveAnnotation}
                    />
                ))}
            </ul>
        </>
    );
}
