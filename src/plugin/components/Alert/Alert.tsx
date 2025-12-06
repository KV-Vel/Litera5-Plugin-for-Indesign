import "./Alert.scss";
import { IconSizes, AlertVariant } from "./types";

interface AlertProps extends React.PropsWithChildren {
    header: string;
    type: AlertVariant;
    description?: string;
    iconSize?: IconSizes;
    onClose?: () => void;
}

export default function Alert({
    header,
    description,
    children,
    type = AlertVariant.INFO,
    iconSize = IconSizes.SMALL,
    onClose,
}: AlertProps) {
    return (
        <div className={`alert ${type.toLowerCase()}`}>
            <div className="alert__inner">
                <div className="alert__icon-wrapper">
                    <sp-icon name={`ui:${type}${iconSize}`} className="alert__icon"></sp-icon>
                </div>
                <div className="alert__text-wrapper">
                    <strong>{header}</strong>
                    {description && <p>{description}</p>}
                </div>
                {onClose && (
                    <div className="alert__delete-btn-wrapper">
                        <div className="delete-btn" onClick={onClose}>
                            <sp-icon name="ui:CrossSmall" size="s"></sp-icon>
                        </div>
                    </div>
                )}
            </div>
            {children}
        </div>
    );
}
