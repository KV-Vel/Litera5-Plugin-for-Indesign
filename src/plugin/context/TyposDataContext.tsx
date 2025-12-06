import { createContext } from "react";
import { TypoData } from "../../types/data";

export const TypoDataContext = createContext<TypoData[]>([]);
