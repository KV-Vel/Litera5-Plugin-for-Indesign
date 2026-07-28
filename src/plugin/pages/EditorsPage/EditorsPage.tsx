import { useCallback, useContext, useState, memo } from "react";
import {
    BottomActionBar,
    TopActionBar,
    AnnotationsList,
    Dropdown,
    MultiSelect,
} from "plugin/pages/EditorsPage/components/index";
import "./EditorsPage.scss";
import { RequestProps } from "../AuthPage/types";
import { TextVariations, TypoData } from "types/data";
import { AlertVariant } from "shared/Alert/types";
import {
    TyposDataContextProps,
    TyposDataContext,
    TyposStatsContext,
    TyposStatsContextProps,
    CheckedDocContext,
    CheckedDocContextProps,
} from "plugin/context/index";
import { AnnotationStats, OrthoKind } from "litera5-api-js-client";
import SettingsPage from "../SettingsPage/SettingsPage";
import { useWithDocumentOpen, useInddKindsHighlight } from "plugin/hooks/index";
import cog from "../../../assets/settings-svgrepo-com.svg";
import { Alert } from "shared/index";
import { resetCharacterStyles } from "indd/utils";

const MemoizedList = memo(AnnotationsList);

export default function EditorsPage(requestProps: RequestProps) {
    const [isSettingsPageActive, setIsSettingsPageActive] = useState(false);
    const [setEveryInddKinds, setActiveInddKind] = useInddKindsHighlight();
    const { setTypos } = useContext(TyposDataContext) as TyposDataContextProps;
    const [typosStats, dispatch] = useContext(TyposStatsContext) as TyposStatsContextProps;
    const { tryWithDocumentOpen, error, clearError } = useWithDocumentOpen();
    const { checkedDocData } = useContext(CheckedDocContext) as CheckedDocContextProps;

    const selectedKinds = typosStats.reduce(
        (acc: Array<AnnotationStats["kind"]>, obj) => (obj.selected ? [...acc, obj.kind] : acc),
        [],
    );

    function handleCheckboxToggle(kindType: OrthoKind) {
        const inddActionIsExecuted = tryWithDocumentOpen(checkedDocData.name, () => {
            setActiveInddKind({ name: kindType, txt: checkedDocData.text });
        });
        if (!inddActionIsExecuted) return;

        dispatch({ type: "TOGGLE_ONE_ANNOTATION", payload: { kindType } });
    }

    function onEveryCheckboxToggle(isEveryKindSelected: boolean) {
        const newToggleState = !isEveryKindSelected;

        const inddActionIsExecuted = tryWithDocumentOpen(checkedDocData.name, () => {
            setEveryInddKinds({
                isActive: newToggleState,
                txt: checkedDocData.text,
            });
        });
        if (!inddActionIsExecuted) return;

        dispatch({ type: "TOGGLE_EVERY_ANNOTATION", payload: { newToggleState } });
    }

    const onRemoveAnnotation = useCallback(
        (id: number, kind: string, selection: TypoData["selection"]) => {
            const inddActionIsExecuted = tryWithDocumentOpen(checkedDocData.name, () => {
                selection[0].showText();
                resetCharacterStyles(selection);
            });
            if (!inddActionIsExecuted) return;

            dispatch({ type: "DELETE_ONE", payload: { kind: kind, id: id } });
            setTypos((prevTypos) => prevTypos.filter(({ typo }) => typo.id !== id));
        },
        [checkedDocData.name, dispatch, setTypos, tryWithDocumentOpen],
    );

    function handleRemoveAllAnnotations(...selection: TextVariations[]) {
        const inddActionIsExecuted = tryWithDocumentOpen(checkedDocData.name, () => {
            selection[0].showText();
            resetCharacterStyles(selection);
        });
        if (!inddActionIsExecuted) return;

        dispatch({ type: "DELETE_ALL" });
        setTypos([]);
    }

    return (
        <>
            {isSettingsPageActive && (
                <SettingsPage onReturn={() => setIsSettingsPageActive(false)} />
            )}
            <main className={`editors-page ${isSettingsPageActive ? "hidden" : ""}`}>
                <TopActionBar>
                    <Dropdown name="Типы примечаний">
                        <MultiSelect
                            availableItems={typosStats}
                            toggleEveryItem={onEveryCheckboxToggle}
                            toggleItem={handleCheckboxToggle}
                        />
                    </Dropdown>
                    <div onClick={() => setIsSettingsPageActive(true)} className="settings-btn">
                        <img src={cog} alt="Иконка меню настроек" className="settings-btn__icon" />
                    </div>
                </TopActionBar>
                <MemoizedList
                    key={checkedDocData.id}
                    onRemoveAnnotation={onRemoveAnnotation}
                    selectedKinds={selectedKinds}
                />
                <BottomActionBar
                    {...requestProps}
                    сlearAnnotations={() => {
                        if (!checkedDocData.text) return;
                        handleRemoveAllAnnotations(checkedDocData.text);
                    }}
                >
                    {error && (
                        <Alert
                            header="Ошибка"
                            description={error}
                            type={AlertVariant.WARNING}
                            onClose={clearError}
                        />
                    )}
                </BottomActionBar>
            </main>
        </>
    );
}
