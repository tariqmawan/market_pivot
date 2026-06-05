import React from "react";
import type { StockSector } from "../../types";
import sectorsData from "../../data/sectors.json";
import { useI18n } from "../i18n";



const stockSectors = (sectorsData as any).sectors as StockSector[];

const EtfsPage: React.FC = () => {
  const { t } = useI18n();
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
        <p className="eyebrow">{t("src_client_pages_etfspage__l29__h0")}</p>
        <h1>{t("src_client_pages_etfspage__l30__h1")}</h1>
        <p>{t("src_client_pages_etfspage__l31__h2")}</p>
      </div>

      <div className="asset-grid compact">
        {allEtfs.slice(0, 40).map((etf) => (
          <div key={etf.symbol} className="asset-card">
            <span className="eyebrow">{t("src_client_pages_etfspage__l37__h3")}</span>
            <h3>{etf.label}</h3>
            <p>{etf.categories.join(" / ")}</p>
            <strong>{t("src_client_pages_etfspage__l40__h4")}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EtfsPage;
