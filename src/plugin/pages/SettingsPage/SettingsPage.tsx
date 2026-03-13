import { OrthoKind } from "litera5-api-js-client";
import { Alert, StatisticBadge } from "../../components";
import { AlertVariant } from "../../components/Alert/types";
import "./SettingsPage.scss";
import useLocalStorage from "../../hooks/useLocalStorage";
import TopActionBar from "../EditorsPage/components/TopActionBar/TopActionBar";
import { BackButton } from "../../components";
import { DEFAULT_USER_SETTINGS, LOCAL_STORAGE_KEYS, SECURE_STORAGE_KEYS } from "../../constants";
import useSecureStorage from "../../hooks/useSecureStorage";

interface SettingsPageProps {
    onReturn: () => void;
}

export default function SettingsPage({ onReturn }: SettingsPageProps) {
    const [exceptions, setExceptions] = useLocalStorage<Record<OrthoKind, boolean>>(
        LOCAL_STORAGE_KEYS.EXCEPTIONS,
        DEFAULT_USER_SETTINGS.EXCEPTIONS,
    );
    const {
        data: company,
        handleChange: handleCompanyChange,
        handleBlur: handleCompanyInputBlur,
    } = useSecureStorage(SECURE_STORAGE_KEYS.COMPANY);
    const {
        data: secret,
        handleChange: handleSecretChange,
        handleBlur: handleSecretInputBlur,
    } = useSecureStorage(SECURE_STORAGE_KEYS.SECRET);

    function handleSetExceptions(kind: OrthoKind) {
        setExceptions((prevExceptions) => ({
            ...prevExceptions,
            [kind]: !prevExceptions[kind],
        }));
    }

    return (
        <div className="settings-page">
            <TopActionBar contentPlacement="start">
                <BackButton
                    onReturn={() => {
                        handleCompanyInputBlur();
                        handleSecretInputBlur();
                        onReturn();
                    }}
                />
                <h2>Settings</h2>
            </TopActionBar>
            <div>
                <section className="settings-section exceptions">
                    <h3>Exceptions</h3>
                    <p>Annotation types which will be included in the text check.</p>
                    <div className="alert-wrapper">
                        <Alert
                            header="Note"
                            description="New settings will be applied during next text check."
                            type={AlertVariant.INFO}
                        />
                    </div>

                    <div className="exceptions__list">
                        <ul className="exceptions__column">
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkGrammar"]}
                                    onChange={() => handleSetExceptions(OrthoKind["GRAMMAR"])}
                                    class={exceptions["mkGrammar"] ? "" : "muted"}
                                >
                                    Grammar
                                </sp-checkbox>
                                <StatisticBadge badgeStyle={OrthoKind["GRAMMAR"]} size="small" />
                            </li>
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkPaperStructure"]}
                                    onChange={() =>
                                        handleSetExceptions(OrthoKind["PAPER_STRUCTURE"])
                                    }
                                    class={exceptions["mkPaperStructure"] ? "" : "muted"}
                                >
                                    Paper structure
                                </sp-checkbox>
                                <StatisticBadge
                                    badgeStyle={OrthoKind["PAPER_STRUCTURE"]}
                                    size="small"
                                />
                            </li>
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkPunctuation"]}
                                    onChange={() => handleSetExceptions(OrthoKind["PUNCTUATION"])}
                                    class={exceptions["mkPunctuation"] ? "" : "muted"}
                                >
                                    Punctuation
                                </sp-checkbox>
                                <StatisticBadge
                                    badgeStyle={OrthoKind["PUNCTUATION"]}
                                    size="small"
                                />
                            </li>
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkSemantic"]}
                                    onChange={() => handleSetExceptions(OrthoKind["SEMANTIC"])}
                                    class={exceptions["mkSemantic"] ? "" : "muted"}
                                >
                                    Semantic
                                </sp-checkbox>
                                <StatisticBadge badgeStyle={OrthoKind["SEMANTIC"]} size="small" />
                            </li>
                        </ul>
                        <ul className="exceptions__column">
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkSpelling"]}
                                    onChange={() => handleSetExceptions(OrthoKind["SPELLING"])}
                                    class={exceptions["mkSpelling"] ? "" : "muted"}
                                >
                                    Spelling
                                </sp-checkbox>
                                <StatisticBadge badgeStyle={OrthoKind["SPELLING"]} size="small" />
                            </li>
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkStyle"]}
                                    onChange={() => handleSetExceptions(OrthoKind["STYLE"])}
                                    class={exceptions["mkStyle"] ? "" : "muted"}
                                >
                                    Style
                                </sp-checkbox>
                                <StatisticBadge badgeStyle={OrthoKind["STYLE"]} size="small" />
                            </li>
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkTypography"]}
                                    onChange={() => handleSetExceptions(OrthoKind["TYPOGRAPHY"])}
                                    class={exceptions["mkTypography"] ? "" : "muted"}
                                >
                                    Typography
                                </sp-checkbox>
                                <StatisticBadge badgeStyle={OrthoKind["TYPOGRAPHY"]} size="small" />
                            </li>
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkYo"]}
                                    onChange={() => handleSetExceptions(OrthoKind["YO"])}
                                    class={exceptions["mkYo"] ? "" : "muted"}
                                >
                                    The letter &quot;Ё&quot;
                                </sp-checkbox>
                                <StatisticBadge badgeStyle={OrthoKind["YO"]} size="small" />
                            </li>
                        </ul>
                    </div>
                </section>
                <section className="settings-section">
                    <h3>API</h3>
                    <p>
                        API access is provided by the Litera5 administration upon partner&apos;s
                        request. You must keep the API key secure, as it will be used to
                        authenticate users when working with Litera5.
                    </p>
                    <form>
                        <div className="input-wrapper">
                            <label>
                                {" "}
                                Company identificator (company)
                                <input
                                    value={company}
                                    onChange={handleCompanyChange}
                                    onBlur={handleCompanyInputBlur}
                                />
                            </label>
                        </div>
                        <div className="input-wrapper">
                            <label>
                                {" "}
                                Secret key (secret)
                                <input
                                    value={secret}
                                    onChange={handleSecretChange}
                                    onBlur={handleSecretInputBlur}
                                />
                            </label>
                        </div>
                    </form>
                </section>
                <section className="settings-section">
                    <h3>Annotations highlight height</h3>
                    <p>
                        The plugin calculates the highlight height of annotations based on the text
                        size of the &quot;[Basic Paragraph]&quot; style.
                    </p>
                </section>
            </div>
        </div>
    );
}
