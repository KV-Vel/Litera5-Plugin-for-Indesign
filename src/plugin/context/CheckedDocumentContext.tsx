import { createContext, useState } from "react";
import { CheckedDocumentData } from "../../types/data";

export type CheckedDocumentDataType = {
    checkedDocumentData: CheckedDocumentData;
    setCheckedDocumentData: React.Dispatch<
        React.SetStateAction<CheckedDocumentDataType["checkedDocumentData"]>
    >;
};

export const CheckedDocumentContext = createContext<CheckedDocumentDataType | null>(null);

export default function CheckedDocumentContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [checkedDocumentData, setCheckedDocumentData] = useState<CheckedDocumentData>({
        checkedDocumentName: "",
        checkId: "",
        checkedText: null,
    });

    return (
        <CheckedDocumentContext
            value={{
                checkedDocumentData: checkedDocumentData,
                setCheckedDocumentData: setCheckedDocumentData,
            }}
        >
            {children}
        </CheckedDocumentContext>
    );
}
