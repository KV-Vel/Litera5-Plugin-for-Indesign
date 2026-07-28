import { useCallback, useContext } from "react";
import { app } from "../../globals";
import { hasDuplicateDocuments, makeDocumentActive } from "indd/utils";
import { ErrorContext, ErrorContextProps } from "../context/index";

export function useWithDocumentOpen() {
    const [error, setError] = useContext(ErrorContext) as ErrorContextProps;

    const clearError = () => setError(null);

    /**
     * @description Выполняет действие, если возможно открыть документ.
     * @returns Возвращает булево значение, указывающее был ли выполнен callback в документе
     */
    const tryWithDocumentOpen = useCallback(
        (docName: string, callback: () => void) => {
            try {
                app.scriptPreferences.enableRedraw = false;

                const checkingDoc = app.documents.itemByName(docName);

                const isCheckingDocActive = makeDocumentActive(checkingDoc);
                if (!isCheckingDocActive) {
                    throw new Error("Проверяемый документ более недоступен.");
                }

                if (hasDuplicateDocuments(docName)) {
                    throw new Error(
                        "Обнаружено несколько документов с одинаковым именем. Закройте тот документ, который не проверяется в настоящий момент.",
                    );
                }

                callback();

                return true;
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Неизвестная ошибка во время выполнения действия в Indesign.");
                }

                return false;
            }
        },
        [setError],
    );

    return { tryWithDocumentOpen, error, clearError } as const;
}
