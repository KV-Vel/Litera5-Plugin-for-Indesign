import { Component } from "react";
import "./ErrorBoundary.scss";

interface ErrorBoundaryProps {
    hasError: boolean;
    error: any;
}

export class ErrorBoundary extends Component<any, ErrorBoundaryProps> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error: error };
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error(error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            const { error } = this.state;

            return (
                <main className="error-boundary">
                    <section className="error-boundary__inner-wrapper">
                        <h2>Произошла непредвиденная ошибка</h2>
                        <p className="muted">
                            Если ошибка повторяется, пришлите, пожалуйста, информацию об ошибке на
                            данный электронный адрес:{" "}
                            <a href="mailto:kraevvalentin98@gmail.com">kraevvalentin98@gmail.com</a>
                        </p>
                        <section className="error-info">
                            <p className="muted">Информация об ошибке</p>
                            <p className="error-info--red">Ошибка: {error.message}</p>
                            {error?.cause && (
                                <p className="error-info--red">Причина: {error.cause}</p>
                            )}
                        </section>
                        <div className="error-boundary__btn-wrapper">
                            <sp-button
                                onClick={(event: MouseEvent) => {
                                    event.preventDefault();
                                    location.reload();
                                }}
                            >
                                Попробовать снова
                            </sp-button>
                        </div>
                    </section>
                </main>
            );
        }
        return this.props.children;
    }
}
