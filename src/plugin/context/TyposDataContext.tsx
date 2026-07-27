import { createContext, useState } from "react";
import { TypoData } from "types/data";

export type TyposDataContextProps = {
    typos: TypoData[];
    setTypos: React.Dispatch<React.SetStateAction<TypoData[]>>;
};

export const TyposDataContext = createContext<TyposDataContextProps | null>(null);

export function TyposDataProvider({ children }: { children: React.ReactNode }) {
    const [typos, setTypos] = useState<TypoData[]>([]);

    return <TyposDataContext value={{ typos, setTypos }}>{children}</TyposDataContext>;
}
