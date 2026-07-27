import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { App } from "./main";
import {
    TyposDataProvider,
    CheckedDocContextProvider,
    TyposStatsProvider,
    ErrorProvider,
} from "./plugin/context/index";
import { ErrorBoundary } from "shared/ErrorBoundary/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
    <React.StrictMode>
        <ErrorBoundary>
            <ErrorProvider>
                <CheckedDocContextProvider>
                    <TyposStatsProvider>
                        <TyposDataProvider>
                            <App />
                        </TyposDataProvider>
                    </TyposStatsProvider>
                </CheckedDocContextProvider>
            </ErrorProvider>
        </ErrorBoundary>
    </React.StrictMode>,
);
