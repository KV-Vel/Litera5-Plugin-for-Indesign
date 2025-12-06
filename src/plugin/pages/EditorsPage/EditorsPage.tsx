// HOOKS
import { useCallback, useContext, useState, memo, startTransition } from "react";

// MODULES
import AnnotationsList from "./components/Annotation/AnnotationsList";
import Dropdown from "./components/Dropdown/Dropdown";
import MultiSelect from "./components/MultiSelect/MultiSelect";
import "./EditorsPage.scss";
// TYPES
import { RequestProps } from "../AuthPage/types";
import { DispatchContext } from "../../context/DispatchContext";
import { AnnotationStats, OrthoKind } from "litera5-api-js-client";
import { indesignUtils } from "../../../indesign/utils";
import { CheckedDocumentData, ExtendedAnnotationStats, TypoData } from "../../../types/data";
import { ClearAction, RemoveAction } from "../../reducers/typoDataReducer";
import SettingsPage from "../SettingsPage/SettingsPage";
import useAsyncIndesignKindsHighlight from "../../hooks/useAsyncIndesignKindsHighlight";
import { useWithCheckedDocumentOpen } from "../../hooks/useWithCheckedDocumentOpen";
import { ContextValueType, StatsContext } from "../../context/StatsContext";
import { BottomActionBar } from "./components/BottomActionBar/BottomActionBar";
import TopActionBar from "./components/TopActionBar/TopActionBar";
import cog from "../../../assets/settings-svgrepo-com.svg";

const MemoizedList = memo(AnnotationsList);

export default function EditorsPage(requestProps: RequestProps) {
    const [isSettingsPageActive, setIsSettingsPageActive] = useState(false);
    const [setEveryIndesignKindsState, setIndesignKindState] = useAsyncIndesignKindsHighlight();
    const dispatch = useContext(DispatchContext);
    const [stats, setStats] = useContext(StatsContext) as ContextValueType;
    const { withCheckedDocumentOpen, checkedDocumentData } = useWithCheckedDocumentOpen();

    const selectedKinds = stats.reduce((acc: Array<AnnotationStats["kind"]>, obj) => {
        if (obj.selected) {
            return [...acc, obj.kind];
        }
        return acc;
    }, []);

    function handleCheckboxToggle(kindType: OrthoKind) {
        setStats((prevStat) =>
            prevStat.map((stat) => {
                if (stat.kind === kindType) {
                    return {
                        ...stat,
                        selected: !stat.selected,
                    };
                }
                return stat;
            }),
        );

        withCheckedDocumentOpen(() => {
            setIndesignKindState({ kind: kindType, txt: checkedDocumentData.checkedText });
        });
    }

    function onEveryCheckboxToggle(isEveryKindSelected: boolean) {
        const newToggleState = !isEveryKindSelected;

        setStats((prevStats) => {
            return prevStats.map((stat) => ({
                ...stat,
                selected: newToggleState,
            }));
        });

        withCheckedDocumentOpen(() => {
            startTransition(() => {
                setEveryIndesignKindsState({
                    active: newToggleState,
                    txt: checkedDocumentData.checkedText,
                });
            });
        });
    }

    const onRemoveAnnotation = useCallback(
        (action: RemoveAction, selection: TypoData["selection"]) => {
            withCheckedDocumentOpen(() => {
                selection[0].showText();
                indesignUtils.resetCharacterStyles(selection);
            });

            setStats((prevStats) => {
                return prevStats.reduce((acc: ExtendedAnnotationStats[], stat) => {
                    if (stat.kind === action.payload.kind) {
                        const updatedChilds = stat.typoIds.filter((id) => id !== action.payload.id);
                        if (!updatedChilds.length) {
                            return acc;
                        } else {
                            return [
                                ...acc,
                                { ...stat, count: updatedChilds.length, typoIds: updatedChilds },
                            ];
                        }
                    }
                    return [...acc, stat];
                }, []);
            });
            dispatch(action);
        },
        [dispatch, setStats, withCheckedDocumentOpen],
    );

    function handleRemoveAllAnnotations(
        action: ClearAction,
        selection: NonNullable<CheckedDocumentData["checkedText"]>[],
    ) {
        withCheckedDocumentOpen(() => {
            selection[0].showText();
            indesignUtils.resetCharacterStyles(selection);
        });

        setStats([]);
        dispatch(action);
    }

    if (isSettingsPageActive) {
        return <SettingsPage onReturn={() => setIsSettingsPageActive(false)} />;
    }

    return (
        <>
            <main className="editors-page">
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
                    key={checkedDocumentData.checkId}
                    onRemoveAnnotation={onRemoveAnnotation}
                    selectedKinds={selectedKinds}
                />
                <BottomActionBar
                    {...requestProps}
                    handleClearAnnotations={() =>
                        handleRemoveAllAnnotations({ type: "CLEAR_ANNOTATIONS" }, [
                            checkedDocumentData.checkedText!,
                        ])
                    }
                />
            </main>
        </>
    );
}
