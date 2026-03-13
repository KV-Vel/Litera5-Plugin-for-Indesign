import { CheckOgxtResponse, CheckState, Litera5Api } from "litera5-api-js-client";
import { CheckProfile, CheckOgxtResultsResponse } from "litera5-api-js-client";

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
    api: Litera5Api,
): Promise<CheckOgxtResponse["check"]> {
    /**
     *  Остальные 2 аргумента необязательные (согласно документации в репозитории Орфограммки) ??
     *  @see https://git.hitsoft-it.com/github/orfogrammatika/litera5-api-js-client/-/blob/master/src/api-model.ts?ref_type=heads
     */
    try {
        const initiatedDocumentData = await api.checkOgxt({
            login: login,
            profile: CheckProfile.ORTHO,
            html: `<p>${text}</p>`,
            ogxt: text,
        });

        return initiatedDocumentData.check;
    } catch (error) {
        if (error instanceof Response) {
            const errorMessage = await error.text();
            throw new Error(errorMessage || "Unable to get an error text: unknown error.");
        }

        throw new Error("Failed to launch text check.");
    }
}

let timeout: ReturnType<typeof setTimeout>;

/**
 * @description Ожидает окончания проверки текста и возвращает результат
 */
async function waitForCheckToComplete(
    id: CheckOgxtResponse["check"],
    readProgress: (result: CheckOgxtResultsResponse) => void,
    api: Litera5Api,
): Promise<CheckOgxtResultsResponse> {
    const result = await api.checkOgxtResults({ check: id });
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
                resolve(waitForCheckToComplete(id, readProgress, api));
            }
        }, 2500);
    });
}

export const litera5Request = { initLitera5Check, waitForCheckToComplete };
