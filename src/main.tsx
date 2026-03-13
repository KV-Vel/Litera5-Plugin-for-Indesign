import { useState } from "react";
// COMPONENTS
import EditorsPage from "./plugin/pages/EditorsPage/EditorsPage";
// TYPES
import { CheckOgxtResultsResponse } from "litera5-api-js-client";
import AuthPage from "./plugin/pages/AuthPage/AuthPage";

export const App = () => {
    const [requestStatus, setRequestStatus] = useState<"Success" | null>(null);
    const [login, setLogin] = useState("");

    function onLoginChange(value: string) {
        setLogin(value);
    }

    async function onRequest(request: () => Promise<CheckOgxtResultsResponse | undefined>) {
        try {
            const response = await request();

            if (response) {
                setRequestStatus("Success");
            }
        } catch (error) {
            console.error(error instanceof Error ? error.message : "Failed to initiate request.");
        }
    }

    if (requestStatus === "Success") {
        return <EditorsPage login={login} onRequest={onRequest} />;
    }

    return (
        <>
            {!requestStatus && (
                <AuthPage login={login} onLoginChange={onLoginChange} onRequest={onRequest} />
            )}
        </>
    );
};
