import { useContext, useState } from "react";
import { CheckOgxtResultsResponse, CheckState, createApi } from "litera5-api-js-client";
import { TextVariations } from "../../types/data";
import { litera5Request } from "../../litera5/litera5Request";
import { indesignSelectionIsValid, loginIsValid } from "../utils/validation";
import { DispatchContext } from "../context/DispatchContext";
import { TextFrame } from "indesign";
import { CheckedDocumentContext, CheckedDocumentDataType } from "../context/CheckedDocumentContext";
import { ContextValueType, StatsContext } from "../context/StatsContext";
import { UserSettings } from "../../types/settings";
import { getSelection, textCleanUp } from "../../indesign/utils";
import { createAppDataFromResponse } from "../utils";
import { getSecureStorageData } from "../utils/getSecureStorageData";
import { SECURE_STORAGE_KEYS } from "../constants";

const initialProgressState = { progress: 0, message: "Initiating text check" };

export default function useTextCheck() {
    const [isLoading, setIsLoading] = useState(false);
    const [progressState, setProgressState] = useState(initialProgressState);
    const { setCheckedDocumentData } = useContext(
        CheckedDocumentContext,
    ) as CheckedDocumentDataType;
    const dispatch = useContext(DispatchContext);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setStats] = useContext(StatsContext) as ContextValueType;

    const [requestError, setRequestError] = useState("");

    function readProgress(response: CheckOgxtResultsResponse) {
        if (response.state === CheckState.CHECKED_SUCCESS) {
            /**
             * Могу ошибаться, но результат проверки никогда (или почти никогда) не возвращает 100%, хотя статус CHECKED_SUCCESS при этом будет.
             * Поэтому вручную показываем пользователю, что проверка достигла 100%
             */
            setProgressState({ progress: 100, message: "Highlighting errors in the text" });
        } else {
            setProgressState({ progress: response.progress, message: response.message });
        }
    }

    function runValidation(login: string, selection: ReturnType<typeof getSelection>) {
        loginIsValid(login);
        indesignSelectionIsValid(selection);
    }

    async function handleTextCheck(
        login: string,
        selection: ReturnType<typeof getSelection>,
        settings: UserSettings,
    ) {
        try {
            runValidation(login, selection);

            // Если ошибки не были закрыты, сбрасываем вручную перед началом проверки
            if (requestError) {
                setRequestError("");
            }

            const [plainText, selectionObject] = textCleanUp(
                selection as TextFrame | TextVariations,
            );

            setIsLoading(true);

            const config = {
                company: (await getSecureStorageData(SECURE_STORAGE_KEYS.COMPANY)).trim(),
                secret: (await getSecureStorageData(SECURE_STORAGE_KEYS.SECRET)).trim(),
            };
            const apiLitera5 = createApi(config);
            const documentCheckId = await litera5Request.initLitera5Check(
                login,
                plainText,
                apiLitera5,
            );
            if (documentCheckId) {
                const litera5Response: CheckOgxtResultsResponse =
                    await litera5Request.waitForCheckToComplete(
                        documentCheckId,
                        readProgress,
                        apiLitera5,
                    );

                const { typos, stats, checkedDocData } = createAppDataFromResponse(
                    litera5Response,
                    selectionObject,
                    settings,
                );
                setStats(stats);
                dispatch({ type: "SET_DATA", payload: { data: typos } });
                setCheckedDocumentData(checkedDocData);
                return litera5Response;
            }
        } catch (error) {
            console.error(error);
            setRequestError(error instanceof Error ? error.message : "Something went wrong...");
        } finally {
            setProgressState(initialProgressState);
            setIsLoading(false);
        }
    }

    return [
        isLoading,
        progressState,
        requestError,
        () => setRequestError(""),
        handleTextCheck,
    ] as const;
}
