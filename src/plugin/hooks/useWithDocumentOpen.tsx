import { useCallback, useContext } from "react";
// import { CheckedDocumentContext, CheckedDocumentDataType } from "../context/CheckedDocumentContext";
import { app } from "../../globals";
import { hasDuplicateDocuments, makeDocumentActive } from "../../indesign/utils";
import { Document } from "indesign";
import { InddErrorContext, InddErrorContextProps } from "../context/IndesignErrorsContext";

export function useWithDocumentOpen() {
    const [inddError, setInddError] = useContext(InddErrorContext) as InddErrorContextProps;

    const clearError = () => setInddError(null);

    /**
     * @description Выполняет действие, если возможно открыть документ.
     * @returns Возвращает булево значение, указывающее был ли выполнен callback в документе
     */
    const tryWithDocumentOpen = useCallback(
        (documentName: Document["name"], callback: () => void) => {
            try {
                const checkingDocument = app.documents.itemByName(documentName);

                const isCheckingDocumentActive = makeDocumentActive(checkingDocument);
                if (!isCheckingDocumentActive) {
                    throw new Error("Проверяемый документ более недоступен.");
                }

                if (hasDuplicateDocuments(documentName)) {
                    throw new Error(
                        "Обнаружено несколько документов с одинаковым именем. Закройте тот документ, который не проверяется в настоящий момент.",
                    );
                }

                callback();

                return true;
            } catch (err) {
                if (err instanceof Error) {
                    setInddError(err.message);
                } else {
                    setInddError("Неизвестная ошибка во время выполнения действия в Indesign.");
                }

                return false;
            }
        },
        [setInddError],
    );

    return { tryWithDocumentOpen, inddError, clearError } as const;
}
