import "./RequestCheckTextForm.scss";
import { AlertVariant } from "../../../../components/Alert/types";
import { FormProps } from "../../types";
import useTextCheck from "../../../../hooks/useTextCheck";
import { capitalize } from "../../../../utils/capitalize";
import { getSelection } from "../../../../../indesign/utils";
import { getUserSettings } from "../../../../utils";
import { Alert, Loader } from "../../../../components/index";

export default function RequestCheckForm({ login, onLoginChange, onRequest }: FormProps) {
    const [isLoading, checkState, errorState, clearError, handleTextCheck] = useTextCheck();

    function handleRequest(litera5Login: string, selection: ReturnType<typeof getSelection>) {
        const userSettings = getUserSettings();
        onRequest(() => handleTextCheck(litera5Login, selection, userSettings));
    }

    function handleLoginChange(event: React.ChangeEvent<HTMLInputElement>) {
        onLoginChange(event.target.value);
    }

    return (
        <form className="form">
            <div className="form__group">
                <label>
                    {" "}
                    Login from Litera5
                    <input placeholder="ivanov.av" value={login} onChange={handleLoginChange} />
                </label>
            </div>
            {errorState && (
                <div className="form__alert-wrapper">
                    <Alert
                        header="Error"
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
                Check text
            </sp-button>
        </form>
    );
}
