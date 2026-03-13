import { StatisticBadge } from "../../../../components";
import { ExtendedAnnotationStats } from "../../../../../types/data";
import { capitalize } from "../../../../utils";
import "./MultiSelect.scss";
import { OrthoKind } from "litera5-api-js-client";

type MultiSelectProps = {
    availableItems: ExtendedAnnotationStats[];
    toggleItem: (kindToToggle: OrthoKind) => void;
    toggleEveryItem: (isEveryKindSelected: boolean) => void;
};

export default function MultiSelect({
    availableItems,
    toggleItem,
    toggleEveryItem,
}: MultiSelectProps) {
    const isEveryKindSelected = availableItems.every((item) => item.selected);
    const remainedTyposCount = availableItems.reduce((acc, item) => (acc += item.count), 0);
    const hasNoRemainedTypos = remainedTyposCount <= 0;

    return (
        <ul className="multiselect multiselect--positioned-absolutely">
            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                <sp-checkbox
                    checked={isEveryKindSelected || hasNoRemainedTypos}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        /**
                         * В UXP среде <sp-checkbox>, да и обычный input с type="checkbox" имеют странное поведение при переключении
                         * Даже если прокинуть сюда ошибку и не обновить стейт, то состояние чекбокса все равно изменится.
                         * В документации ниже предлагается использовать ref или WC компонент, однако и с этими способами были какие-то баги + это лишний код
                         * Проблему удалось решить, добавив event.target.checked. Теперь состояние чекбокса правильно отображается (в зависимости от полученных данных).
                         * @see https://developer.adobe.com/indesign/uxp/reference/uxp-api/reference-spectrum/Spectrum%20UXP%20Widgets/Using%20with%20React/#boolean-attributes
                         */
                        event.target.checked = isEveryKindSelected;
                        toggleEveryItem(isEveryKindSelected);
                    }}
                    disabled={hasNoRemainedTypos}
                    class={isEveryKindSelected ? "" : "muted"}
                >
                    All annotations
                </sp-checkbox>
                <StatisticBadge badgeStyle="everyTypo" remainedTypos={remainedTyposCount} />
            </li>
            {availableItems.map((stat) => (
                <li key={stat.kind} className="checkbox-wrapper checkbox-wrapper--gap-between">
                    <sp-checkbox
                        checked={stat.selected}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            event.target.checked = stat.selected;
                            toggleItem(stat.kind as OrthoKind);
                        }}
                        class={stat.selected ? "" : "muted"}
                    >
                        {capitalize(stat.name)}
                    </sp-checkbox>
                    <StatisticBadge badgeStyle={stat.kind} remainedTypos={stat.count} />
                </li>
            ))}
        </ul>
    );
}
