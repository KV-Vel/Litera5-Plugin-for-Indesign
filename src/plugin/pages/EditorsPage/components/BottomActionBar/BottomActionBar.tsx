import { RequestProps } from "plugin/pages/AuthPage/types";
import { useTextCheck } from "plugin/hooks/index";
import "./BottomActionBar.scss";
import { getUserSettings, capitalize } from "plugin/utils/index";
import { getSelection } from "indd/utils/index";
import { Alert, Loader } from "shared/index";
import { AlertVariant } from "shared/Alert/types";

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
                    header="Ошибка"
                    description={errorState}
                    type={AlertVariant.WARNING}
                    onClose={clearError}
                />
            )}
            {children}
            <sp-button onClick={сlearAnnotations} variant="secondary">
                Очистить подсказки
            </sp-button>
            <sp-button disabled={isLoading} onClick={() => startNewTextCheck(login)}>
                <sp-icon name="ui:Magnifier"></sp-icon>
                Начать новую проверку
            </sp-button>
        </div>
    );
}
