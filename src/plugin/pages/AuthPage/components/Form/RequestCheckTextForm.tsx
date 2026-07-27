import "./RequestCheckTextForm.scss";
import { AlertVariant } from "shared/Alert/types";
import { FormProps } from "../../types";
import { useTextCheck } from "plugin/hooks/index";
import { getSelection } from "indd/utils";
import { getUserSettings, capitalize } from "plugin/utils";
import { Alert, Loader } from "shared/index";

export default function RequestCheckForm({ login, onLoginChange, onRequest }: FormProps) {
    const [isLoading, checkState, errorState, clearError, handleTextCheck] = useTextCheck();

    function handleRequest(l5Login: string, selection: ReturnType<typeof getSelection>) {
        const userSettings = getUserSettings();
        onRequest(() => handleTextCheck(l5Login, selection, userSettings));
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
            {errorState && (
                <div className="form__alert-wrapper">
                    <Alert
                        header="Ошибка"
                        description={errorState}
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
                onClick={() => handleRequest(login.trim(), getSelection())}
            >
                <sp-icon name="ui:Magnifier"></sp-icon>
                Проверить текст
            </sp-button>
        </form>
    );
}
