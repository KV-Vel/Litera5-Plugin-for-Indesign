import { createContext, useState } from "react";
import { CheckedDocData } from "types/data";

export type CheckedDocContextProps = {
    checkedDocData: CheckedDocData;
    setCheckedDocData: React.Dispatch<
        React.SetStateAction<CheckedDocContextProps["checkedDocData"]>
    >;
};

export const CheckedDocContext = createContext<CheckedDocContextProps | null>(null);

export function CheckedDocContextProvider({ children }: { children: React.ReactNode }) {
    const [checkedDocData, setCheckedDocData] = useState<CheckedDocData>({
        name: "",
        id: "",
        text: null,
    });

    return (
        <CheckedDocContext value={{ checkedDocData, setCheckedDocData }}>
            {children}
        </CheckedDocContext>
    );
}
