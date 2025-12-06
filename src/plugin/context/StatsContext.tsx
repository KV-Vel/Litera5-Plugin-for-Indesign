import { createContext, useState } from "react";
import { ExtendedAnnotationStats } from "../../types/data";

export type ContextValueType = [
    stats: ExtendedAnnotationStats[],
    setStats: React.Dispatch<React.SetStateAction<ExtendedAnnotationStats[]>>,
];

export const StatsContext = createContext<ContextValueType | null>(null);

export default function StatsProvider({ children }: { children: React.ReactNode }) {
    const [stats, setStats] = useState<ExtendedAnnotationStats[]>([]);

    return <StatsContext value={[stats, setStats]}>{children}</StatsContext>;
}
