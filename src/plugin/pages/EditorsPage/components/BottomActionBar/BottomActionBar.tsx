import { OrthoKind } from "litera5-api-js-client";
import { RequestProps } from "../../../AuthPage/types";
import useTextCheck from "../../../../hooks/useTextCheck";
import { EXCEPTIONS_DEFAULT_STATE, EXCEPTIONS_NAME } from "../../../../constants/exceptionsDefault";
import { indesignUtils } from "../../../../../indesign/utils";
import capitalize from "../../../../utils/capitalize";
import { Alert, Loader } from "../../../../components";
import { AlertVariant } from "../../../../components/Alert/types";
import "./BottomActionBar.scss";

interface BottomActionBarProps extends RequestProps {
    handleClearAnnotations: () => void;
}

export function BottomActionBar({
    login,
    onRequest,
    handleClearAnnotations,
}: BottomActionBarProps) {
    const [isLoading, progress, errorState, clearError, handleTextCheck] = useTextCheck();

    function startNewTextCheck(login: string) {
        const exceptions = localStorage.getItem(EXCEPTIONS_NAME);
        const parsedExceptions: Record<OrthoKind, boolean> = exceptions
            ? JSON.parse(exceptions)
            : EXCEPTIONS_DEFAULT_STATE;

        onRequest(() =>
            handleTextCheck(login.trim(), indesignUtils.getSelection(), parsedExceptions),
        );
    }
    return (
        <div className="bottom-action-bar">
            {isLoading && (
                <Loader currentValue={progress.progress} message={capitalize(progress.message)} />
            )}
            {errorState.hasError && (
                <Alert
                    header="Ошибка"
                    description={errorState.message}
                    type={AlertVariant.WARNING}
                    onClose={clearError}
                />
            )}
            <sp-button onClick={handleClearAnnotations} variant="secondary">
                Очистить подсказки
            </sp-button>
            <sp-button disabled={isLoading} onClick={() => startNewTextCheck(login)}>
                <sp-icon name="ui:Magnifier"></sp-icon>
                Начать новую проверку
            </sp-button>
        </div>
    );
}
