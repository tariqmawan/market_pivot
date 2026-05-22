import React from "react";
import { Link } from "react-router-dom";
import exchangesData from "../../data/exchanges.json";
import type { StockExchange, IndexSnapshot } from "../../types";

import type { MarketRegion } from "../../types";

import "../styles/index.css";

const exchanges = (exchangesData as any).exchanges as StockExchange[];

const formatMoney = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  return `$${value.toLocaleString()}`;
};

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

const IndicesPage: React.FC = () => {
  const uniqueIndices = React.useMemo(() => {
    const seen = new Set<string>();
    const items = exchanges
      .map((ex) => ({
        id: ex.mainIndex,
        symbol: ex.mainIndex,
        name: ex.mainIndexName,
        country: ex.country,
        currency: ex.currency,
        marketCap: ex.marketCap,
        region: ex.region,
        timezone: ex.timezone,
        tradingHours: ex.tradingHours,
      }))
      .filter((idx) => {
        if (!idx.id) return false;
        if (seen.has(idx.id)) return false;
        seen.add(idx.id);
        return true;
      });

    return items.sort((a, b) => b.marketCap - a.marketCap);
  }, []);

  return (
    <div className="page intelligence-page">
      <div className="section-heading">
        <p className="eyebrow">Indices</p>
        <h1>Market Indices Coverage</h1>
        <p>Primary indices mapped across global exchanges with exchange metadata.</p>
      </div>

      <div className="asset-grid compact">
        {uniqueIndices.map((idx) => (
          <AssetCard
            key={idx.id}
            to={`/stocks/${idx.id}`}
            eyebrow={idx.region}
            title={`${idx.name} (${idx.symbol})`}
            meta={`${idx.country} / ${idx.currency} / ${idx.tradingHours.open}-${idx.tradingHours.close}`}
            metric={formatMoney(idx.marketCap)}
          />
        ))}
      </div>
    </div>
  );
};

export default IndicesPage;
