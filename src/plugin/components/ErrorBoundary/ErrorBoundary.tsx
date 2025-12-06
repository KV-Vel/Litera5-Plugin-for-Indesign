interface ErrorBoundaryProps {
    fallback: React.ReactNode;
    children: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    { hasError: boolean }
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

// export default ErrorBoundary
