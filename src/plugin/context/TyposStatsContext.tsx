import { ActionDispatch, createContext, useReducer } from "react";
import { ExtendedAnnotationStats } from "types/data";
import { StatsReducerActions, statsReducer } from "../reducers/statsReducer";

export type TyposStatsContextProps = [
    typosStats: ExtendedAnnotationStats[],
    dispatch: ActionDispatch<[action: StatsReducerActions]>,
];

export const TyposStatsContext = createContext<TyposStatsContextProps | null>(null);

export function TyposStatsProvider({ children }: { children: React.ReactNode }) {
    const [typosStats, dispatch] = useReducer(statsReducer, []);

    return <TyposStatsContext value={[typosStats, dispatch]}>{children}</TyposStatsContext>;
}
