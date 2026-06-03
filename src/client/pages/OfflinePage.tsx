import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isOnline, onNetworkChange } from "../pwa/pwaManager";

/**
 * Static offline fallback page. Served by the service worker when a
 * navigation request fails (no network, no cached match). The page
 * self-recovers as soon as the browser regains connectivity.
 */
const OfflinePage: React.FC = () => {
  const [online, setOnline] = useState(isOnline());

  useEffect(() => onNetworkChange(setOnline), []);

  return (
    <div className="page offline-page" role="alert" aria-live="assertive">
      <section className="offline-hero">
        <p className="eyebrow">Offline</p>
        <h1>You’re disconnected from the markets</h1>
        <p>
          MarketsPivot is showing this page because the browser couldn’t reach our servers
          and the requested page wasn’t cached. Live data will resume automatically as
          soon as you’re back online.
        </p>
        <div className="offline-actions">
          <button
            type="button"
            className="primary-action"
            onClick={() => window.location.reload()}
            disabled={!online}
          >
            {online ? "Reload" : "Waiting for network…"}
          </button>
          <Link to="/" className="secondary-action">
            Go to homepage
          </Link>
        </div>
        <ul className="offline-tips">
          <li>Your watchlist and portfolio are still available offline.</li>
          <li>Pages you’ve visited recently will load from cache.</li>
          <li>API-dependent widgets (live prices) will be skipped.</li>
        </ul>
      </section>
    </div>
  );
};

export default OfflinePage;
