import React from "react";
import { useI18n } from "../../i18n";



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
          <h2>Something went wrong</h2>
          <p>{this.state.error.message}</p>
          <button type="button" className="mp-admin-action-btn" onClick={() => window.location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
