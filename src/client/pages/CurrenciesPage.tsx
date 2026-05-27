import React from "react";
import { Link, useParams } from "react-router-dom";
import CurrencyDetail from "../components/CurrencyDetail";
import { useI18n } from "../i18n";

type Currency = {
  code: string;
  name: string;
  symbol: string;
  country: string;
  countryCode: string;
  region: string;
  type: string;
  centralBank: string;
  description?: string;
  logo?: string;
};

type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
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
  <Link to={to} className="asset-card forex-card">
    <div className="asset-card-head">
      <span className="eyebrow">{eyebrow}</span>
      <span className="asset-card-badge">FX</span>
    </div>

    <h3>{title}</h3>
    <p>{meta}</p>

    <div className="asset-card-footer">
      <strong>{metric}</strong>
    </div>
  </Link>
);

export default function CurrenciesPage() {
  const { code } = useParams();
  const { t } = useI18n();

  const [list, setList] = React.useState<Currency[]>([]);
  const [listLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<string | null>(null);

  const [currency, setCurrency] = React.useState<Currency | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);
  const [detailError, setDetailError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (code) return;
    setListLoading(true);
    setListError(null);
    fetch("/api/currencies?limit=50&page=1")
      .then((r) => r.json())
      .then((json: PaginatedResponse<Currency>) => {
        if (!json.success) throw new Error(json.error ?? "Failed to load currencies");
        setList(json.data);
      })
      .catch((e: unknown) => setListError(e instanceof Error ? e.message : "Failed to load currencies"))
      .finally(() => setListLoading(false));
  }, [code]);

  React.useEffect(() => {
    if (!code) return;
    setDetailLoading(true);
    setDetailError(null);
    fetch(`/api/currencies/${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then((json: ApiResponse<Currency>) => {
        if (!json.success) throw new Error(json.error ?? "Currency not found");
        setCurrency(json.data);
      })
      .catch((e: unknown) => setDetailError(e instanceof Error ? e.message : "Failed to load currency"))
      .finally(() => setDetailLoading(false));
  }, [code]);

  if (code) {
    if (detailLoading) return <div className="page"><p>Loading currency…</p></div>;
    if (detailError || !currency) return <div className="page"><p>{detailError ?? "Currency not found"}</p></div>;
    return <CurrencyDetail currency={currency as any} isLoading={false} />;
  }

  return (
    <div className="page">
      <div className="section-heading">
        <p className="eyebrow">{t("fx")}</p>
        <h1>{t("topCurrencies")}</h1>
        <p>{t("currencyIntro")}</p>
      </div>

      {listError ? <p className="error">{listError}</p> : null}
      {listLoading ? <p>Loading…</p> : null}

      <div className="asset-grid compact">
        {list.map((item) => (
          <AssetCard
            key={item.code}
            to={`/currencies/${item.code}`}
            eyebrow={item.region}
            title={`${item.code} - ${item.name}`}
            meta={`${item.country} / ${item.centralBank}`}
            metric={`Currency profile`}
          />
        ))}
      </div>
    </div>
  );
}

