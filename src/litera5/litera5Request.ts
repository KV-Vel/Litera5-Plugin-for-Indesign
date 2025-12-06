import { CheckOgxtResponse, CheckState } from "litera5-api-js-client";
import { createApi, CheckProfile, CheckOgxtResultsResponse } from "litera5-api-js-client";
import { config } from "./config";

const apiLitera5 = createApi(config);

const requestEndsWithFail = (requestState: CheckOgxtResultsResponse["state"]) => {
    const FAILED_STATES = [
        CheckState.ESTIMATED_ERROR,
        CheckState.ESTIMATED_REJECT,
        CheckState.CANCELLED,
        CheckState.REJECTED,
        CheckState.CHECKED_ERROR,
    ];
    return FAILED_STATES.includes(requestState);
};

/**
 * @description Инициализирует проверку текста
 */
async function initLitera5Check(
    login: string = "",
    text: string,
): Promise<CheckOgxtResponse["check"]> {
    /**
     *  Остальные 2 аргумента необязательные (согласно документации в репозитории Орфограммки) ??
     *  @see https://git.hitsoft-it.com/github/orfogrammatika/litera5-api-js-client/-/blob/master/src/api-model.ts?ref_type=heads
     */
    try {
        const initiatedDocumentData = await apiLitera5.checkOgxt({
            login: login,
            profile: CheckProfile.ORTHO,
            html: `<p>${text}</p>`,
            ogxt: text,
        });

        return initiatedDocumentData.check;
    } catch (error) {
        if (error instanceof Response) {
            if (error.status === 404) {
                throw new Error("Пользователь с таким логином не найден.");
            }
            void error.text().then((txt) => console.error(txt));
            /**
             * else if (error.status === 401 OR 403?) {
             *  throw new Error("Неверно указан API ключ") ???
             * }
             */
        }

        throw new Error("Сбой во время запуска проверки. ");
    }
}

let timeout: ReturnType<typeof setTimeout>;

/**
 * @description Ожидает окончания проверки текста и возвращает результат
 */
async function waitForCheckToComplete(
    id: CheckOgxtResponse["check"],
    readProgress: (result: CheckOgxtResultsResponse) => void,
): Promise<CheckOgxtResultsResponse> {
    const result = await apiLitera5.checkOgxtResults({ check: id });
    readProgress(result);

    return new Promise((resolve, reject) => {
        timeout = setTimeout(() => {
            if (requestEndsWithFail(result.state)) {
                if (timeout) clearTimeout(timeout);
                reject(result.message);
            }
            if (result.state === CheckState.CHECKED_SUCCESS) {
                return resolve(result);
            } else {
                if (timeout) clearTimeout(timeout);
                resolve(waitForCheckToComplete(id, readProgress));
            }
        }, 2500);
    });
}

export const litera5Request = { initLitera5Check, waitForCheckToComplete };
