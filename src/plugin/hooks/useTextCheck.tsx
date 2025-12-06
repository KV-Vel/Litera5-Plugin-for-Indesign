import { useContext, useState } from "react";
import { CheckOgxtResultsResponse, CheckState, OrthoKind } from "litera5-api-js-client";
import textCleanUp from "../../indesign/textCleanUp/textCleanUp";
import { TextVariations } from "../../types/data";
import { litera5Request } from "../../litera5/litera5Request";
import { indesignSelectionIsValid, loginIsValid } from "../utils/validation";
import createAppDataFromResponse from "../utils/createAppDataFromResponse";
import { DispatchContext } from "../context/DispatchContext";
import { TextFrame } from "indesign";
import { CheckedDocumentContext, CheckedDocumentDataType } from "../context/CheckedDocumentContext";
import { ContextValueType, StatsContext } from "../context/StatsContext";

type ProgressType = Pick<CheckOgxtResultsResponse, "message" | "progress">;

interface ErrorState {
    hasError: boolean;
    message: Error["message"];
}

type HandleTextCheckProps = (
    login: string,
    selection: ReturnType<<T extends { constructorName: string }>() => T> | undefined,
    exceptions: Record<OrthoKind, boolean>,
) => Promise<CheckOgxtResultsResponse | undefined>;

type UseTextCheckReturn = [
    isLoading: boolean,
    state: ProgressType,
    errorState: ErrorState,
    clearError: () => void,
    handleTextCheck: HandleTextCheckProps,
];

const initialProgressState = { progress: 0, message: "Запуск проверки" };

export default function useTextCheck(): UseTextCheckReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [progressState, setProgressState] = useState(initialProgressState);
    const { setCheckedDocumentData } = useContext(
        CheckedDocumentContext,
    ) as CheckedDocumentDataType;
    const dispatch = useContext(DispatchContext);
    const [, setStats] = useContext(StatsContext) as ContextValueType;

    const [requestError, setRequestError] = useState<ErrorState>({
        // hasError ненужно. Достаточно {message: string} | null
        hasError: false,
        message: "",
    });

    function readProgress(response: CheckOgxtResultsResponse) {
        if (response.state === CheckState.CHECKED_SUCCESS) {
            /**
             * Могу ошибаться, но результат проверки никогда (или почти никогда) не возвращает 100%, хотя статус CHECKED_SUCCESS при этом будет.
             * Поэтому вручную показываем пользователю, что проверка достигла 100%
             */
            setProgressState({ progress: 100, message: "Отмечаем ошибки в тексте" });
        } else {
            setProgressState({ progress: response.progress, message: response.message });
        }
    }

    function runValidation(
        login: string,
        selection: ReturnType<<T extends { constructorName: string }>() => T> | undefined,
    ) {
        let inputIsValid = false;

        const loginPatternValidity = loginIsValid(login);
        if (!loginPatternValidity.valid) {
            setRequestError({ hasError: true, message: loginPatternValidity.errorMessage! });
            return inputIsValid;
        }

        const indesignSelectionValidity = indesignSelectionIsValid(selection);
        if (!indesignSelectionValidity.valid) {
            setRequestError({
                hasError: true,
                message: indesignSelectionValidity.errorMessage!,
            });
            return inputIsValid;
        }

        inputIsValid = true;
        return inputIsValid;
    }

    async function handleTextCheck<T extends { constructorName: string }>(
        login: string,
        selection: T | TextFrame | TextVariations | undefined,
        exceptions: Record<OrthoKind, boolean>,
    ) {
        const isInputValid = runValidation(login, selection);
        if (!isInputValid) return;

        // Если ошибки не были закрыты, сбрасываем вручную перед началом проверки
        if (requestError.hasError) {
            setRequestError({ hasError: false, message: "" });
        }

        const [plainText, selectionObject] = textCleanUp(selection as TextFrame | TextVariations);

        setIsLoading(true);

        try {
            const documentCheckId = await litera5Request.initLitera5Check(login, plainText);
            if (documentCheckId) {
                const litera5Response: CheckOgxtResultsResponse =
                    await litera5Request.waitForCheckToComplete(documentCheckId, readProgress);

                const { typos, stats, checkedDocData } = createAppDataFromResponse(
                    litera5Response,
                    selectionObject,
                    exceptions,
                );
                setStats(stats);
                dispatch({ type: "SET_DATA", payload: { data: typos } });
                setCheckedDocumentData(checkedDocData);
                return litera5Response;
            }
        } catch (error) {
            console.error(error);
            setRequestError({
                hasError: true,
                message: error instanceof Error ? error.message : "Что-то пошло не так...",
            });
        } finally {
            setProgressState(initialProgressState);
            setIsLoading(false);
        }
    }

    return [
        isLoading,
        progressState,
        requestError,
        () => setRequestError({ hasError: false, message: "" }),
        handleTextCheck,
    ] as const;
}
