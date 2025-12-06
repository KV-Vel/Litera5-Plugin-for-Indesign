import "./RequestCheckTextForm.scss";
import Alert from "../../../../components/Alert/Alert";
import { AlertVariant } from "../../../../components/Alert/types";
import { FormProps } from "../../types";
import useTextCheck from "../../../../hooks/useTextCheck";
import capitalize from "../../../../utils/capitalize";
import Loader from "../../../../components/Loader/Loader";
import { indesignUtils } from "../../../../../indesign/utils";
import { OrthoKind } from "litera5-api-js-client";
import { EXCEPTIONS_NAME, EXCEPTIONS_DEFAULT_STATE } from "../../../../constants/exceptionsDefault";

export default function RequestCheckForm({ login, onLoginChange, onRequest }: FormProps) {
    const [isLoading, checkState, errorState, clearError, handleTextCheck] = useTextCheck();

    function handleRequest(
        litera5Login: string,
        selection: ReturnType<<T extends { constructorName: string }>() => T> | undefined,
    ) {
        const exceptions = localStorage.getItem(EXCEPTIONS_NAME);
        const parsedExceptions: Record<OrthoKind, boolean> = exceptions
            ? JSON.parse(exceptions)
            : EXCEPTIONS_DEFAULT_STATE;
        onRequest(() => handleTextCheck(litera5Login, selection, parsedExceptions));
    }

    function handleLoginChange(event: React.ChangeEvent<HTMLInputElement>) {
        onLoginChange(event.target.value);
    }

    return (
        <form className="form">
            <div className="form__group">
                <label>
                    {" "}
                    Логин от Литеры
                    <input placeholder="ivanov.av" value={login} onChange={handleLoginChange} />
                </label>
            </div>
            {errorState.hasError && (
                <div className="form__alert-wrapper">
                    <Alert
                        header="Ошибка"
                        description={errorState.message}
                        type={AlertVariant.WARNING}
                        onClose={clearError}
                    />
                </div>
            )}
            {isLoading && (
                <Loader
                    currentValue={checkState.progress}
                    message={capitalize(checkState.message)}
                />
            )}
            <sp-button
                disabled={isLoading}
                onClick={() => handleRequest(login.trim(), indesignUtils.getSelection())}
            >
                <sp-icon name="ui:Magnifier"></sp-icon>
                Проверить текст
            </sp-button>
        </form>
    );
}
