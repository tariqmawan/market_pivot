import React from "react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = { hasError: boolean; message: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || "Something went wrong" };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="page error-boundary">
            <h2>Something went wrong</h2>
            <p>{this.state.message}</p>
            <button type="button" onClick={() => this.setState({ hasError: false, message: "" })}>
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
