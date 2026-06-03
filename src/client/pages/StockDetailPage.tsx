import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import StockDetail, { type StockData } from "../components/StockDetail";
import EmptyState from "../components/EmptyState";
import { fetchJson } from "../lib/apiClient";
import "../components/StockDetail.css";
import { useI18n } from "../i18n";


type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; stock: StockData; allStocks: StockData[] };

const StockDetailPage: React.FC = () => {
  const { t } = useI18n();
  const { symbol } = useParams();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [retryNonce, setRetryNonce] = useState(0);

  useEffect(() => {
    if (!symbol) return;
    let cancelled = false;
    setState({ status: "loading" });

    (async () => {
      try {
        // Pull the requested symbol + the full stocks list in parallel from the backend.
        const [detailRes, listRes] = await Promise.all([
          fetchJson<StockData>(`/stocks/${encodeURIComponent(symbol)}`),
          fetchJson<StockData[]>(`/catalog?type=stock&limit=200`),
        ]);
        if (cancelled) return;
        if (!detailRes.success || !detailRes.data) {
          setState({ status: "error", message: detailRes.error ?? "Stock not found" });
          return;
        }
        const allStocks = Array.isArray(listRes.data) ? listRes.data : [];
        setState({ status: "ready", stock: detailRes.data, allStocks });
      } catch (e) {
        if (cancelled) return;
        setState({ status: "error", message: (e as Error).message });
      }
    })();

    return () => { cancelled = true; };
  }, [symbol, retryNonce]);

  if (state.status === "loading") {
    return (
      <div className="page stock-detail-loading">
        <div className="loading-state">
          <div className="loading-spinner" aria-hidden="true" />
          <p>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    // Fall back to the i18n "not found" copy when the backend has no record.
    if (state.message.toLowerCase().includes("not found")) {
      return (
        <div className="page">
          <EmptyState
            icon="🔎"
            title={t("stockDetail.notFoundTitle")}
            description={t("stockDetail.notFoundBody", { symbol })}
            secondary={
              <Link to="/stocks" className="primary-action" style={{ textDecoration: "none" }}>
                {t("stockDetail.backToStocks")}
              </Link>
            }
          />
        </div>
      );
    }
    return (
      <div className="page">
        <EmptyState
          icon="⚠️"
          title={t("common.error")}
          description={state.message}
          secondary={
            <button
              type="button"
              className="primary-action"
              onClick={() => setRetryNonce((n) => n + 1)}
            >
              {t("common.tryAgain")}
            </button>
          }
        />
      </div>
    );
  }

  return <StockDetail stock={state.stock} allStocks={state.allStocks} />;
};

export default StockDetailPage;
