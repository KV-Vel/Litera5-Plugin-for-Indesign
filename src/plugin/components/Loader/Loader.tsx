import "./Loader.scss";

interface LoaderProps {
    maxValue?: number;
    currentValue: number;
    message: string;
}

export default function Loader({ maxValue = 100, currentValue, message }: LoaderProps) {
    return (
        <sp-progressbar max={maxValue} value={currentValue} value-label={`${currentValue}%`}>
            {" "}
            <sp-label slot="label">{message}</sp-label>
        </sp-progressbar>
    );
}
