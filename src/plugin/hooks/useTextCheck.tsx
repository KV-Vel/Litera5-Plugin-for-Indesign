import { useContext, useState } from "react";
import { CheckOgxtResultsResponse, CheckState, createApi } from "litera5-api-js-client";
import { TextVariations } from "types/data";
import { UserSettings } from "types/settings";
import { l5Req } from "../../litera5/litera5Request";
import { TextFrame } from "indesign";
import {
    CheckedDocContext,
    CheckedDocContextProps,
    TyposStatsContextProps,
    TyposStatsContext,
    TyposDataContextProps,
    TyposDataContext,
} from "../context/index";
import { getSelection, textCleanUp } from "indd/utils/index";
import {
    createAppDataFromResponse,
    getSecureStorageData,
    loginIsValid,
    inddSelectionIsValid,
} from "plugin/utils/index";
import { SECURE_STORAGE_KEYS } from "../constants";

const initialProgressState = { progress: 0, message: "Запуск проверки" };

export function useTextCheck() {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(initialProgressState);
    const { setCheckedDocData } = useContext(CheckedDocContext) as CheckedDocContextProps;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setStats] = useContext(TyposStatsContext) as TyposStatsContextProps;
    const { setTypos } = useContext(TyposDataContext) as TyposDataContextProps;
    const [requestError, setRequestError] = useState("");

    function updateProgress(response: CheckOgxtResultsResponse) {
        /**
         * Могу ошибаться, но результат проверки никогда (или почти никогда) не возвращает 100%, хотя статус CHECKED_SUCCESS при этом будет.
         * Поэтому вручную показываем пользователю, что проверка достигла 100%
         */
        const progressData =
            response.state === CheckState.CHECKED_SUCCESS
                ? { progress: 100, message: "Отмечаем ошибки в тексте" }
                : { progress: response.progress, message: response.message };

        setProgress(progressData);
    }

    function runValidation(login: string, selection: ReturnType<typeof getSelection>) {
        loginIsValid(login);
        inddSelectionIsValid(selection);
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
            const apiL5 = createApi(config);
            const docCheckId = await l5Req.initLitera5Check(login, plainText, apiL5);
            if (docCheckId) {
                const res = await l5Req.waitCheckResult(docCheckId, updateProgress, apiL5);

                const { typos, typosStats, checkedDocData } = createAppDataFromResponse(
                    res,
                    selectionObject,
                    settings,
                );
                setStats({ type: "SET_ANNOTATIONS", payload: { data: typosStats } });
                setTypos(typos);
                setCheckedDocData(checkedDocData);
                return res;
            }
        } catch (error) {
            console.error(error);
            setRequestError(error instanceof Error ? error.message : "Что-то пошло не так...");
        } finally {
            setProgress(initialProgressState);
            setIsLoading(false);
        }
    }

    return [isLoading, progress, requestError, () => setRequestError(""), handleTextCheck] as const;
}
