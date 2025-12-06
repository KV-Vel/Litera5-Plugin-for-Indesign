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
            {settingsPageIsActive ? (
                <SettingsPage onReturn={() => setSettingsPageIsActive(false)} />
            ) : (
                <>
                    <TopActionBar>
                        <div className="authpage__header">
                            {/* <Logo /> */}
                            <div
                                onClick={() => setSettingsPageIsActive(true)}
                                className="settings-btn"
                            >
                                <img
                                    src={cog}
                                    alt="Иконка меню настроек"
                                    className="settings-btn__icon"
                                />
                            </div>
                        </div>
                    </TopActionBar>

                    <div className="authpage__form-wrapper">
                        <div className="authpage__inner-form-wrapper">
                            <div className="authpage__description">
                                <h2>Начало проверки</h2>

                                <ol>
                                    <li>
                                        <span>1</span>
                                        <article>
                                            <h4>Введите логин</h4>
                                            <p>
                                                Логин указывается в формате invanov.av, где{" "}
                                                <strong>ivanov</strong> — фамилия, а{" "}
                                                <strong>av</strong> — инициалы.
                                            </p>
                                        </article>
                                    </li>
                                    <li>
                                        <span>2</span>
                                        <article>
                                            <h4>Выберите текст для проверки</h4>
                                            <p>Выделите текст во фрейме или сам фрейм.</p>
                                        </article>
                                    </li>
                                    <li>
                                        <span>3</span>
                                        <article>
                                            <h4>
                                                Работайте с привычным Вам интерфейсом, прямиком в
                                                Indesign!
                                            </h4>
                                            <p>
                                                Нажмите кнопку &quot;Проверить текст&quot; и
                                                дождитесь окончания проверки,{" "}
                                                <strong>не снимая выделение</strong>.
                                            </p>
                                        </article>
                                    </li>
                                </ol>
                                <div className="alert-wrapper">
                                    <Alert
                                        header="Примечание"
                                        type={AlertVariant.INFO}
                                        description="Проверка будет выполнена от лица пользователя, указанного в поле ниже.
                                Проверенный текст также будет доступен для просмотра в личном кабинете на сайте Литеры."
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
                </>
            )}
        </div>
    );
}
