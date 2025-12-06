import StatisticBadge from "../../../../components/StatisticBadge/StatisticBadge";
import { ExtendedAnnotationStats } from "../../../../../types/data";
import capitalize from "../../../../utils/capitalize";
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

    return (
        <ul className="multiselect multiselect--positioned-absolutely">
            <li className="checkbox-wrapper checkbox-wrapper--gap-between">
                <sp-checkbox
                    checked={isEveryKindSelected || !availableItems.length}
                    onChange={() => toggleEveryItem(isEveryKindSelected)}
                    disabled={availableItems.length === 0}
                    className={isEveryKindSelected ? "" : "muted"}
                >
                    Все примечания
                </sp-checkbox>
                <StatisticBadge badgeStyle="everyTypo" remainedTypos={remainedTyposCount} />
            </li>
            {availableItems.map((stat) => (
                <li key={stat.kind} className="checkbox-wrapper checkbox-wrapper--gap-between">
                    <sp-checkbox
                        checked={stat.selected}
                        onChange={() => toggleItem(stat.kind as OrthoKind)}
                        className={stat.selected ? "" : "muted"}
                    >
                        {capitalize(stat.name)}
                    </sp-checkbox>
                    <StatisticBadge badgeStyle={stat.kind} remainedTypos={stat.count} />
                </li>
            ))}
        </ul>
    );
}
