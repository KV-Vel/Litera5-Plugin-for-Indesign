import { createContext, useState } from "react";

export type ErrorContextProps = [
    error: string | null,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    clearError: () => void,
];

export const ErrorContext = createContext<ErrorContextProps | null>(null);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    return <ErrorContext value={[error, setError, clearError]}>{children}</ErrorContext>;
}
