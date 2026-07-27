import { CheckOgxtResultsResponse } from "litera5-api-js-client";
import { ExtendedAnnotationStats, TypoData } from "../../../types/data";

export interface RequestProps {
    login: string;
    onRequest: (fn: () => Promise<CheckOgxtResultsResponse | undefined>) => Promise<void>;
}

export interface FormProps extends RequestProps {
    onLoginChange: (value: string) => void;
}

export type TypoDataContextProps = [
    { typosData: TypoData[]; typosStats: ExtendedAnnotationStats[] },
    React.Dispatch<React.SetStateAction<TypoData[]>>,
];
