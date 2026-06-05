import React from "react";
import { i18n } from "../../i18n";



export default class AdminErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mp-admin-error-boundary">
          <h2>{i18n.t("common:error")}</h2>
          <p>{this.state.error.message}</p>
          <button type="button" className="mp-admin-action-btn" onClick={() => window.location.reload()}>
            {i18n.t("common:refresh")}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
