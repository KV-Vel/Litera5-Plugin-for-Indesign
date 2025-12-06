import { OrthoKind } from "litera5-api-js-client";
import { Alert, StatisticBadge } from "../../components";
import { AlertVariant } from "../../components/Alert/types";
import "./SettingsPage.scss";
import useLocalStorage from "../../hooks/useLocalStorage";
import { EXCEPTIONS_DEFAULT_STATE, EXCEPTIONS_NAME } from "../../constants/exceptionsDefault";
import TopActionBar from "../EditorsPage/components/TopActionBar/TopActionBar";
import { BackButton } from "../../components";

interface SettingsPageProps {
    onReturn: () => void;
}

export default function SettingsPage({ onReturn }: SettingsPageProps) {
    const [exceptions, setExceptions] = useLocalStorage<Record<OrthoKind, boolean>>(
        EXCEPTIONS_NAME,
        EXCEPTIONS_DEFAULT_STATE,
    );

    function handleSetExceptions(kind: OrthoKind) {
        setExceptions((prevExceptions) => ({
            ...prevExceptions,
            [kind]: !prevExceptions[kind],
        }));
    }

    return (
        <div className="settings-page">
            <TopActionBar contentPlacement="--start">
                <BackButton onReturn={onReturn} />
                <h2>Настройки</h2>
            </TopActionBar>
            <div>
                <section className="exceptions">
                    <h3>Исключения</h3>
                    <p>Типы примечаний, которые будут включены в проверку.</p>
                    <div className="alert-wrapper">
                        <Alert
                            header="Примечание"
                            description="Настройки будут применены во время следующей проверки."
                            type={AlertVariant.INFO}
                        />
                    </div>

                    <div className="exceptions__list">
                        <ul className="exceptions__column">
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkGrammar"]}
                                    onChange={() => handleSetExceptions(OrthoKind["GRAMMAR"])}
                                    className={exceptions["mkGrammar"] ? "" : "muted"}
                                >
                                    Грамматика
                                </sp-checkbox>
                                <StatisticBadge badgeStyle={OrthoKind["GRAMMAR"]} size="small" />
                            </li>
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkPaperStructure"]}
                                    onChange={() =>
                                        handleSetExceptions(OrthoKind["PAPER_STRUCTURE"])
                                    }
                                    className={exceptions["mkPaperStructure"] ? "" : "muted"}
                                >
                                    Оформление
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
                                    className={exceptions["mkPunctuation"] ? "" : "muted"}
                                >
                                    Пунктуация
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
                                    className={exceptions["mkSemantic"] ? "" : "muted"}
                                >
                                    Семантика
                                </sp-checkbox>
                                <StatisticBadge badgeStyle={OrthoKind["SEMANTIC"]} size="small" />
                            </li>
                        </ul>
                        <ul className="exceptions__column">
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkSpelling"]}
                                    onChange={() => handleSetExceptions(OrthoKind["SPELLING"])}
                                    className={exceptions["mkSpelling"] ? "" : "muted"}
                                >
                                    Орфография
                                </sp-checkbox>
                                <StatisticBadge badgeStyle={OrthoKind["SPELLING"]} size="small" />
                            </li>
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkStyle"]}
                                    onChange={() => handleSetExceptions(OrthoKind["STYLE"])}
                                    className={exceptions["mkStyle"] ? "" : "muted"}
                                >
                                    Стилистика
                                </sp-checkbox>
                                <StatisticBadge badgeStyle={OrthoKind["STYLE"]} size="small" />
                            </li>
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkTypography"]}
                                    onChange={() => handleSetExceptions(OrthoKind["TYPOGRAPHY"])}
                                    className={exceptions["mkTypography"] ? "" : "muted"}
                                >
                                    Типографика
                                </sp-checkbox>
                                <StatisticBadge badgeStyle={OrthoKind["TYPOGRAPHY"]} size="small" />
                            </li>
                            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                                <sp-checkbox
                                    checked={exceptions["mkYo"]}
                                    onChange={() => handleSetExceptions(OrthoKind["YO"])}
                                    className={exceptions["mkYo"] ? "" : "muted"}
                                >
                                    Буква Ё
                                </sp-checkbox>
                                <StatisticBadge badgeStyle={OrthoKind["YO"]} size="small" />
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </div>
    );
}
