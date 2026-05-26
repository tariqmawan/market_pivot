import React from "react";
import { Link, useParams } from "react-router-dom";
import type { Cryptocurrency } from "../../types";
import CryptoDetail from "../components/CryptoDetail";
import { useI18n } from "../i18n";

type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  pagination?: { page: number; limit: number; total: number; pages: number };
  error?: string;
};

type ApiResponse<T> = { success: boolean; data: T; error?: string };

const AssetCard: React.FC<{
  to: string;
  eyebrow: string;
  title: string;
  meta: string;
  metric: string;
}> = ({ to, eyebrow, title, meta, metric }) => (
  <Link to={to} className="asset-card">
    <span className="eyebrow">{eyebrow}</span>
    <h3>{title}</h3>
    <p>{meta}</p>
    <strong>{metric}</strong>
  </Link>
);

export default function CryptoPage() {
  const { cryptoId } = useParams();
  const { t } = useI18n();

  const [list, setList] = React.useState<Cryptocurrency[]>([]);
  const [listLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<string | null>(null);

  const [crypto, setCrypto] = React.useState<Cryptocurrency | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [detailError, setDetailError] = React.useState<string | null>(null);
  const [overview, setOverview] = React.useState<{
    gainers: Array<{ symbol?: string; name?: string; changePercent24h?: number }>;
    losers: Array<{ symbol?: string; name?: string; changePercent24h?: number }>;
    trending: Array<{ symbol?: string; name?: string; volume24h?: number }>;
  } | null>(null);

  React.useEffect(() => {
    if (cryptoId) return;
    setListLoading(true);
    setListError(null);
    fetch("/api/cryptos?limit=60&page=1")
      .then((r) => r.json())
      .then((json: PaginatedResponse<Cryptocurrency>) => {
        if (!json.success) throw new Error(json.error ?? "Failed to load crypto list");
        setList(json.data);
      })
      .catch((e: unknown) => setListError(e instanceof Error ? e.message : "Failed to load crypto list"))
      .finally(() => setListLoading(false));

    fetch("/api/cryptos/market/overview")
      .then((r) => r.json())
      .then((json) => setOverview(json?.data ?? null))
      .catch(() => setOverview(null));
  }, [cryptoId]);

  React.useEffect(() => {
    if (!cryptoId) return;
    setDetailLoading(true);
    setDetailError(null);
    fetch(`/api/cryptos/${encodeURIComponent(cryptoId)}`)
      .then((r) => r.json())
      .then((json: ApiResponse<Cryptocurrency>) => {
        if (!json.success) throw new Error(json.error ?? "Cryptocurrency not found");
        setCrypto(json.data);
      })
      .catch((e: unknown) => setDetailError(e instanceof Error ? e.message : "Failed to load crypto"))
      .finally(() => setDetailLoading(false));
  }, [cryptoId]);

  if (cryptoId) {
    if (detailLoading) return <div className="page"><p>Loading crypto…</p></div>;
    if (detailError || !crypto) return <div className="page"><p>{detailError ?? "Crypto not found"}</p></div>;
    return <CryptoDetail crypto={crypto} isLoading={false} />;
  }

  return (
    <div className="page">
      <div className="section-heading">
        <p className="eyebrow">{t("crypto")}</p>
        <h1>{t("topCryptos")}</h1>
        <p>{t("cryptoIntro")}</p>
      </div>

      {listError ? <p className="error">{listError}</p> : null}
      {listLoading ? <p>Loading…</p> : null}

      {overview ? (
        <div className="info-grid" style={{ marginBottom: 16 }}>
          <div className="info-card">
            <h4>Top Gainers</h4>
            <p>{overview.gainers?.slice(0, 3).map((g) => g.symbol ?? g.name).join(", ") || "-"}</p>
          </div>
          <div className="info-card">
            <h4>Top Losers</h4>
            <p>{overview.losers?.slice(0, 3).map((g) => g.symbol ?? g.name).join(", ") || "-"}</p>
          </div>
          <div className="info-card">
            <h4>Trending</h4>
            <p>{overview.trending?.slice(0, 3).map((g) => g.symbol ?? g.name).join(", ") || "-"}</p>
          </div>
        </div>
      ) : null}

      <div className="asset-grid compact">
        {list.map((item) => (
          <AssetCard
            key={item.id}
            to={`/crypto/${item.id}`}
            eyebrow={item.category}
            title={`${item.name} (${item.symbol})`}
            meta={`Consensus: ${item.consensusMechanism}`}
            metric={`Launched ${item.launched}`}
          />
        ))}
      </div>
    </div>
  );
}

