import { createContext, useState } from "react";

export type InddErrorContextProps = [
    inddError: string | null,
    setInddError: React.Dispatch<React.SetStateAction<string | null>>,
];

export const InddErrorContext = createContext<InddErrorContextProps | null>(null);

export default function InddErrorProvider({ children }: { children: React.ReactNode }) {
    const [inddError, setInddError] = useState<string | null>(null);

    return <InddErrorContext value={[inddError, setInddError]}>{children}</InddErrorContext>;
}
