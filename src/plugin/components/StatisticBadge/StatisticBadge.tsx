import "./StaticBadge.scss";
import { StatisticBadgeProps } from "./types";

export default function StatisticBadge({
    badgeStyle,
    remainedTypos,
    size = "medium",
}: StatisticBadgeProps) {
    return (
        <div className={`statistic-badge statistic-badge--${size} ${badgeStyle}`}>
            {remainedTypos}
        </div>
    );
}
