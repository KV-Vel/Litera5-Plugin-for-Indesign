import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import { App } from "./main";
import TypoDataProvider from "./plugin/context/TyposDataProvider";
import CheckedDocumentContextProvider from "./plugin/context/CheckedDocumentContext";
import StatsProvider from "./plugin/context/StatsContext";
import InddErrorProvider from "./plugin/context/IndesignErrorsContext";
import { ErrorBoundary } from "./plugin/components";

ReactDOM.createRoot(document.getElementById("app") as HTMLElement).render(
    <React.StrictMode>
        <ErrorBoundary>
            <InddErrorProvider>
                <CheckedDocumentContextProvider>
                    <StatsProvider>
                        <TypoDataProvider>
                            <App />
                        </TypoDataProvider>
                    </StatsProvider>
                </CheckedDocumentContextProvider>
            </InddErrorProvider>
        </ErrorBoundary>
    </React.StrictMode>,
);
