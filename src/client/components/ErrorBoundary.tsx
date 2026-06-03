import React from "react";
import { useI18n } from "../i18n";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = { hasError: boolean; message: string };

// Functional child component reads translations via hook.
// Class components can't use hooks directly, so we delegate to a child.
const ErrorFallback: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => {
  const { t } = useI18n();
  return (
    <>
      <h2>{t("somethingWentWrong")}</h2>
      <p>{message}</p>
      <button type="button" onClick={onRetry}>
        {t("tryAgain")}
      </button>
    </>
  );
};

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
            <ErrorFallback
              message={this.state.message}
              onRetry={() => this.setState({ hasError: false, message: "" })}
            />
          </div>
        )
      );
    }
    return this.props.children;
  }
}
