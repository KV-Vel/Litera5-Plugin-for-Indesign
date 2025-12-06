import { useState } from "react";
// COMPONENTS
import EditorsPage from "./plugin/pages/EditorsPage/EditorsPage";
// TYPES
import { CheckOgxtResultsResponse } from "litera5-api-js-client";
import AuthPage from "./plugin/pages/AuthPage/AuthPage";

export const App = () => {
    const [requestStatus, setRequestStatus] = useState<"Success" | "Fail" | null>(null);
    const [login, setLogin] = useState("");

    function onLoginChange(value: string) {
        setLogin(value);
    }

    async function onRequest(fn: () => Promise<CheckOgxtResultsResponse | undefined>) {
        try {
            const response = await fn();

            if (response) {
                setRequestStatus("Success");
            }
        } catch (error) {
            // setRequestStatus("Fail");
            console.error(error instanceof Error ? error.message : "Не удалось выполнить проверку");
        }
    }

    if (requestStatus === "Success") {
        return <EditorsPage login={login} onRequest={onRequest} />;
    }

    return (
        <>
            {/* {requestStatus === "Fail"} Alert...с кнопкой ОК которая заресетит requestStatus на Null и таким образом выкинет обратно в форму*/}
            {!requestStatus && (
                <AuthPage login={login} onLoginChange={onLoginChange} onRequest={onRequest} />
            )}
        </>
    );
};
