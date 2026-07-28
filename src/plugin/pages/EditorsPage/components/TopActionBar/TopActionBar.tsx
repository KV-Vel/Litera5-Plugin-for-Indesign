import "./TopActionBar.scss";

interface TopActionBarProps extends React.PropsWithChildren {
    contentPlacement?: "start" | "centered";
}

export function TopActionBar({ children, contentPlacement = "centered" }: TopActionBarProps) {
    return <div className={`toolbar toolbar--${contentPlacement}`}>{children}</div>;
}
