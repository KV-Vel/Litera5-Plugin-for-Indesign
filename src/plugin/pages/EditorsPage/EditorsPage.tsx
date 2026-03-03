// HOOKS
import { useCallback, useContext, useState, memo } from "react";

// MODULES
import AnnotationsList from "./components/Annotation/AnnotationsList";
import Dropdown from "./components/Dropdown/Dropdown";
import MultiSelect from "./components/MultiSelect/MultiSelect";
import "./EditorsPage.scss";
// TYPES
import { RequestProps } from "../AuthPage/types";
import { DispatchContext } from "../../context/DispatchContext";
import { AnnotationStats, OrthoKind } from "litera5-api-js-client";
import { CheckedDocumentData, ExtendedAnnotationStats, TypoData } from "../../../types/data";
import { ClearAction, RemoveAction } from "../../reducers/typoDataReducer";
import SettingsPage from "../SettingsPage/SettingsPage";
import useAsyncIndesignKindsHighlight from "../../hooks/useAsyncIndesignKindsHighlight";
import { useWithDocumentOpen } from "../../hooks/useWithDocumentOpen";
import { ContextValueType, StatsContext } from "../../context/StatsContext";
import { BottomActionBar } from "./components/BottomActionBar/BottomActionBar";
import TopActionBar from "./components/TopActionBar/TopActionBar";
import cog from "../../../assets/settings-svgrepo-com.svg";
import { Alert } from "../../components";
import { AlertVariant } from "../../components/Alert/types";
import { resetCharacterStyles } from "../../../indesign/utils";
import {
    CheckedDocumentContext,
    CheckedDocumentDataType,
} from "../../context/CheckedDocumentContext";

const MemoizedList = memo(AnnotationsList);

export default function EditorsPage(requestProps: RequestProps) {
    const [isSettingsPageActive, setIsSettingsPageActive] = useState(false);
    const [setEveryIndesignKindsState, setIndesignKindState] = useAsyncIndesignKindsHighlight();
    const dispatch = useContext(DispatchContext);
    const [stats, setStats] = useContext(StatsContext) as ContextValueType;
    const { tryWithDocumentOpen, inddError, clearError } = useWithDocumentOpen();
    const { checkedDocumentData } = useContext(CheckedDocumentContext) as CheckedDocumentDataType;

    const selectedKinds = stats.reduce((acc: Array<AnnotationStats["kind"]>, obj) => {
        if (obj.selected) {
            return [...acc, obj.kind];
        }
        return acc;
    }, []);

    function handleCheckboxToggle(kindType: OrthoKind) {
        const inddActionWasExecuted = tryWithDocumentOpen(checkedDocumentData.name, () => {
            setIndesignKindState({ kind: kindType, txt: checkedDocumentData.text });
        });
        if (!inddActionWasExecuted) return;

        setStats((prevStats) => {
            return prevStats.map((stat) => {
                if (stat.kind === kindType) {
                    return {
                        ...stat,
                        selected: !stat.selected,
                    };
                }
                return stat;
            });
        });
    }

    function onEveryCheckboxToggle(isEveryKindSelected: boolean) {
        const newToggleState = !isEveryKindSelected;

        const inddActionWasExecuted = tryWithDocumentOpen(checkedDocumentData.name, () => {
            // startTransition(() => {
            setEveryIndesignKindsState({
                active: newToggleState,
                txt: checkedDocumentData.text,
            });
            // });
        });
        if (!inddActionWasExecuted) return;

        setStats((prevStats) => {
            return prevStats.map((stat) => ({
                ...stat,
                selected: newToggleState,
            }));
        });
    }

    const onRemoveAnnotation = useCallback(
        (action: RemoveAction, selection: TypoData["selection"]) => {
            const inddActionWasExecuted = tryWithDocumentOpen(checkedDocumentData.name, () => {
                selection[0].showText();
                resetCharacterStyles(selection);
            });
            if (!inddActionWasExecuted) return;

            setStats((prevStats) => {
                return prevStats.reduce((acc: ExtendedAnnotationStats[], stat) => {
                    if (stat.kind === action.payload.kind) {
                        const updatedChilds = stat.typoIds.filter((id) => id !== action.payload.id);
                        return !updatedChilds.length
                            ? acc
                            : [
                                  ...acc,
                                  { ...stat, count: updatedChilds.length, typoIds: updatedChilds },
                              ];
                    }
                    return [...acc, stat];
                }, []);
            });
            dispatch(action);
        },
        [checkedDocumentData.name, dispatch, setStats, tryWithDocumentOpen],
    );

    function handleRemoveAllAnnotations(
        action: ClearAction,
        selection: NonNullable<CheckedDocumentData["text"]>[],
    ) {
        const inddActionWasExecuted = tryWithDocumentOpen(checkedDocumentData.name, () => {
            selection[0].showText();
            resetCharacterStyles(selection);
        });
        if (!inddActionWasExecuted) return;

        setStats([]);
        dispatch(action);
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
                            availableItems={stats}
                            toggleEveryItem={onEveryCheckboxToggle}
                            toggleItem={handleCheckboxToggle}
                        />
                    </Dropdown>
                    <div onClick={() => setIsSettingsPageActive(true)} className="settings-btn">
                        <img src={cog} alt="Иконка меню настроек" className="settings-btn__icon" />
                    </div>
                </TopActionBar>
                <MemoizedList
                    key={checkedDocumentData.id}
                    onRemoveAnnotation={onRemoveAnnotation}
                    selectedKinds={selectedKinds}
                />
                <BottomActionBar
                    {...requestProps}
                    сlearAnnotations={() =>
                        handleRemoveAllAnnotations({ type: "CLEAR_ANNOTATIONS" }, [
                            checkedDocumentData.text!,
                        ])
                    }
                >
                    {inddError && (
                        <Alert
                            header="Ошибка"
                            description={inddError}
                            type={AlertVariant.WARNING}
                            onClose={clearError}
                        />
                    )}
                </BottomActionBar>
            </main>
        </>
    );
}
