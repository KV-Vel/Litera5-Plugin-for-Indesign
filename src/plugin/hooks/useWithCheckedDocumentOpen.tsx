import { useCallback, useContext } from "react";
import { CheckedDocumentContext, CheckedDocumentDataType } from "../context/CheckedDocumentContext";
import { app } from "../../globals";
import { indesignUtils } from "../../indesign/utils";

export function useWithCheckedDocumentOpen() {
    const { checkedDocumentData } = useContext(CheckedDocumentContext) as CheckedDocumentDataType;

    const withCheckedDocumentOpen = useCallback(
        (cb: () => void) => {
            {
                if (app.documents.length) {
                    const checkingDocument = app.documents.itemByName(
                        checkedDocumentData.checkedDocumentName,
                    );
                    const isCheckingDocumentActive =
                        indesignUtils.makeDocumentActive(checkingDocument);
                    if (isCheckingDocumentActive) {
                        try {
                            cb();
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            }
        },
        [checkedDocumentData.checkedDocumentName],
    );

    return { withCheckedDocumentOpen, checkedDocumentData } as const;
}
