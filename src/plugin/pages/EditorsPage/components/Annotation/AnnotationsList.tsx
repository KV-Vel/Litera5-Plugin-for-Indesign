import { useState, memo, useCallback, use, useContext, useDeferredValue } from "react";
import { AnnotationContainer } from "./AnnotationContainer";
import { ExtendedAnnotationStats, TextVariations, TypoData } from "../../../../../types/data";
import "./AnnotationsList.scss";
import { AlertVariant } from "../../../../components/Alert/types";
import Alert from "../../../../components/Alert/Alert";
import StatisticBadge from "../../../../components/StatisticBadge/StatisticBadge";
import capitalize from "../../../../utils/capitalize";
import { RemoveAction } from "../../../../reducers/typoDataReducer";
import { OrthoKind } from "litera5-api-js-client";
import { STYLES_NAMES } from "../../../../../indesign/constants";
import { useWithCheckedDocumentOpen } from "../../../../hooks/useWithCheckedDocumentOpen";
import { ContextValueType, StatsContext } from "../../../../context/StatsContext";
import { app } from "../../../../../globals";
import { TypoDataContext } from "../../../../context/TyposDataContext";

type AnnotationsListProps = {
    selectedKinds: ExtendedAnnotationStats["name"][];
    onRemoveAnnotation: (action: RemoveAction, selection: TypoData["selection"]) => void;
};

type ActiveAnnotationProps = {
    id: number | null;
    texts: TextVariations[] | null;
    kind: OrthoKind | null;
};

const MemoizedAnnotationContainer = memo(AnnotationContainer);

export default function AnnotationsList({
    selectedKinds,
    onRemoveAnnotation,
}: AnnotationsListProps) {
    const [activeAnnotation, setActiveAnnotation] = useState<ActiveAnnotationProps>({
        id: null,
        texts: null,
        kind: null,
    });
    const { withCheckedDocumentOpen } = useWithCheckedDocumentOpen();
    const typos = useContext(TypoDataContext);
    const deferredKinds = useDeferredValue(selectedKinds);

    const typosToShow = typos.filter(({ typo }) => deferredKinds.includes(typo.kind));

    const annotationsAreEmpty = !typos.length;
    const kindsNotSelected = !selectedKinds.length && typos.length > 0;

    const handleRemoveAnnotation = useCallback(
        (action: RemoveAction, selection: TypoData["selection"], isSelected: boolean) => {
            if (isSelected) {
                setActiveAnnotation({ id: null, texts: null, kind: null });
            }
            onRemoveAnnotation(action, selection);
        },
        [onRemoveAnnotation],
    );

    const onHighlight = useCallback(
        (id: number, texts: TextVariations[], kind: OrthoKind) => {
            withCheckedDocumentOpen(() => {
                const charStyleGroup = app.activeDocument.characterStyleGroups.itemByName(
                    STYLES_NAMES.CHARACTER_STYLE_GROUP,
                );
                const activeCharStyle = charStyleGroup.characterStyles.itemByName(
                    STYLES_NAMES.ACTIVE,
                );
                setActiveAnnotation((prevActive) => {
                    if (prevActive.texts) {
                        // Возвращаем предыдущему активному выделению его прежний стиль символов
                        const prevOrthoKindStyle = charStyleGroup!.characterStyles.itemByName(
                            prevActive.kind!,
                        );
                        prevActive.texts.forEach((txtObj) =>
                            txtObj.applyCharacterStyle(prevOrthoKindStyle!),
                        );
                    }

                    activeCharStyle.underline = true;
                    activeCharStyle.strikeThru = true;
                    activeCharStyle.underlineColor = `fill (${kind})`;
                    activeCharStyle.strikeThroughColor = `border (${kind})`;

                    texts.forEach((txtObj) => txtObj.applyCharacterStyle(activeCharStyle!));
                    texts[0].showText();

                    return { id: id, texts: texts, kind: kind };
                });
            });
        },
        [withCheckedDocumentOpen],
    );

    if (kindsNotSelected) {
        const [stats] = use(StatsContext) as ContextValueType;

        return (
            <div className="editors-page__alert-wrapper">
                <Alert
                    header="Имеются выключенные примечания."
                    description="Вы можете включить их и продолжить работу."
                    type={AlertVariant.QUESTION}
                >
                    <ul className="available-kinds-list">
                        {stats.map((stat) => (
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
