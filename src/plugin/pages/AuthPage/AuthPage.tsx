import { useState } from "react";
import SettingsPage from "../SettingsPage/SettingsPage";
import "./AuthPage.scss";
// import { Logo } from "./components/Logo/Logo";
import RequestCheckForm from "./components/Form/RequestCheckTextForm";
import { RequestProps } from "./types";
import cog from "../../../assets/settings-svgrepo-com.svg";
import TopActionBar from "../EditorsPage/components/TopActionBar/TopActionBar";
import { Alert } from "../../components";
import { AlertVariant } from "../../components/Alert/types";

interface AuthPageProps extends RequestProps {
    onLoginChange: (value: string) => void;
}

export default function AuthPage({ login, onLoginChange, onRequest }: AuthPageProps) {
    const [settingsPageIsActive, setSettingsPageIsActive] = useState(false);

    return (
        <div className="container-column">
            {settingsPageIsActive && (
                <SettingsPage onReturn={() => setSettingsPageIsActive(false)} />
            )}
            <TopActionBar>
                <div className="authpage__header">
                    {/* <Logo /> */}
                    <div onClick={() => setSettingsPageIsActive(true)} className="settings-btn">
                        <img src={cog} alt="cog" className="settings-btn__icon" />
                    </div>
                </div>
            </TopActionBar>

            <div className={`authpage__form-wrapper ${settingsPageIsActive ? "hidden" : ""}`}>
                <div className="authpage__inner-form-wrapper">
                    <div className="authpage__description">
                        <h2>Start text check</h2>

                        <ol>
                            <li>
                                <span>1</span>
                                <article>
                                    <h4>Enter login</h4>
                                    <p>
                                        Your login is the string before the @ symbol. For example,
                                        if your website login is &quot;ivanov.av@example.com&quot;,
                                        enter &quot;ivanov.av&quot; in this field.
                                    </p>
                                </article>
                            </li>
                            <li>
                                <span>2</span>
                                <article>
                                    <h4>Select text to check</h4>
                                    <p>Select text in a text frame or text frame itself.</p>
                                </article>
                            </li>
                            <li>
                                <span>3</span>
                                <article>
                                    <h4>
                                        Work with already familiar interface, right in Adobe
                                        InDesign!
                                    </h4>
                                    <p>
                                        {" "}
                                        Click the &quot;Check text&quot; button and wait for the
                                        check to complete{" "}
                                        <strong>without deselecting the text</strong>.
                                    </p>
                                </article>
                            </li>
                        </ol>
                        <div className="alert-wrapper">
                            <Alert
                                header="Note"
                                type={AlertVariant.INFO}
                                description="The text check will be performed under the account of the user specified below.
                                The checked text will also be available for viewing on the Litera5 website."
                            />
                        </div>
                    </div>

                    <RequestCheckForm
                        login={login}
                        onLoginChange={onLoginChange}
                        onRequest={onRequest}
                    />
                </div>
            </div>
        </div>
    );
}
