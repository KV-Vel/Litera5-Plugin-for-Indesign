import { RequestProps } from "../../../AuthPage/types";
import useTextCheck from "../../../../hooks/useTextCheck";
import "./BottomActionBar.scss";
import { getUserSettings, capitalize } from "../../../../utils";
import { getSelection } from "../../../../../indesign/utils";
import { Alert, Loader } from "../../../../components";
import { AlertVariant } from "../../../../components/Alert/types";

interface BottomActionBarProps extends RequestProps {
    сlearAnnotations: () => void;
}

export function BottomActionBar({
    login,
    onRequest,
    сlearAnnotations,
    children,
}: React.PropsWithChildren<BottomActionBarProps>) {
    const [isLoading, progress, errorState, clearError, handleTextCheck] = useTextCheck();

    function startNewTextCheck(login: string) {
        // Дефолтное value прокидывается во время первой проверки, при повторной проверке оно уже будет в сторедже.
        const userSettings = getUserSettings();

        onRequest(() => handleTextCheck(login.trim(), getSelection(), userSettings));
    }

    return (
        <div className="bottom-action-bar">
            {isLoading && (
                <Loader currentValue={progress.progress} message={capitalize(progress.message)} />
            )}
            {errorState && (
                <Alert
                    header="Error"
                    description={errorState}
                    type={AlertVariant.WARNING}
                    onClose={clearError}
                />
            )}
            {/**
             * children необходим для прокидывания других ошибок, т.к - это единственное место, где удобно их отобразить.
             */}
            {children}
            <sp-button onClick={сlearAnnotations} variant="secondary">
                Clear annotations
            </sp-button>
            <sp-button disabled={isLoading} onClick={() => startNewTextCheck(login)}>
                <sp-icon name="ui:Magnifier"></sp-icon>
                Start new text check
            </sp-button>
        </div>
    );
}
