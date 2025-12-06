import { memo, useRef } from "react";
import "./AnnotationContainer.scss";
import { TextVariations, TypoData } from "../../../../../types/data";
import { OrthoKind } from "litera5-api-js-client";
import { RemoveAction } from "../../../../reducers/typoDataReducer";
import { StatisticBadge } from "../../../../components";

type AnnotationContainerProps = {
    typoData: TypoData;
    isSelected: boolean;
    onHighlight: (id: number, texts: TextVariations[], kind: OrthoKind) => void;
    onDelete: (action: RemoveAction, selection: TypoData["selection"], isSelected: boolean) => void;
};

export const AnnotationContainer = memo(function AnnotationContainer({
    typoData,
    isSelected,
    onHighlight,
    onDelete,
}: AnnotationContainerProps) {
    const ref = useRef<HTMLLIElement>(null);
    const { typo, selection } = typoData;

    function handleHighlight() {
        onHighlight(typo.id, selection, typo.kind as OrthoKind);
        if (ref.current) {
            ref.current.scrollIntoView({ block: "nearest" });
        }
    }

    return (
        <li
            className={`annotation ${isSelected ? typo.kind : ""}`}
            onClick={handleHighlight}
            ref={ref}
        >
            <StatisticBadge badgeStyle={typo.kind} />
            <div className="annotation__main-info">
                <div className="annotation__selection">
                    {typo.selection && <i>{typo.selection}</i>} —{" "}
                    <span dangerouslySetInnerHTML={{ __html: typo.description }}></span>
                </div>
                {/**Добавить PURIFY */}
                <div
                    dangerouslySetInnerHTML={{
                        __html: `<strong>Совет: </strong> ${typo.suggestion || ""}`,
                    }}
                    className="annotation__suggestion"
                ></div>
                <div
                    dangerouslySetInnerHTML={{
                        __html: `<strong>Пояснение: </strong> ${typo.explanation}`,
                    }}
                    className="annotation__explanation"
                ></div>
            </div>
            <div className="annotation__additional-info">
                {/* Тэг button имеет встроенные, непереопределяемые стили, поэтому оставил div ради красивой кнопки */}
                {/* Сделать компонент CustomButton из div? */}
                <div
                    className="delete-btn"
                    onClick={(event) => {
                        event.stopPropagation();
                        onDelete(
                            {
                                type: "REMOVE_ANNOTATION",
                                payload: { id: typoData.typo.id, kind: typoData.typo.kind },
                            },
                            typoData.selection,
                            isSelected,
                        );
                    }}
                >
                    <sp-icon name="ui:CrossSmall" size="s"></sp-icon>
                </div>
            </div>
        </li>
    );
});
