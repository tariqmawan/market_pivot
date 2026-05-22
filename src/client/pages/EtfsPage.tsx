import React from "react";
import type { StockSector } from "../../types";
import sectorsData from "../../data/sectors.json";

const stockSectors = (sectorsData as any).sectors as StockSector[];

const EtfsPage: React.FC = () => {
  const allEtfs = React.useMemo(() => {
    const map = new Map<string, { symbol: string; label: string; categories: string[] }>();

    stockSectors.forEach((sector) => {
      (sector.etfs ?? []).forEach((etf) => {
        if (!map.has(etf)) {
          map.set(etf, { symbol: etf, label: etf, categories: [sector.category] });
        } else {
          map.get(etf)!.categories.push(sector.category);
        }
      });
    });

    return Array.from(map.values())
      .map((x) => ({ ...x, categories: Array.from(new Set(x.categories)) }))
      .sort((a, b) => a.symbol.localeCompare(b.symbol));
  }, []);

  return (
    <div className="page intelligence-page">
      <div className="section-heading">
        <p className="eyebrow">ETFs & Funds</p>
        <h1>ETF Coverage by Equity Sectors</h1>
        <p>Sector-mapped ETF watchlist built from the stock sector dataset.</p>
      </div>

      <div className="asset-grid compact">
        {allEtfs.slice(0, 40).map((etf) => (
          <div key={etf.symbol} className="asset-card">
            <span className="eyebrow">ETF</span>
            <h3>{etf.label}</h3>
            <p>{etf.categories.join(" / ")}</p>
            <strong>Planned</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EtfsPage;
