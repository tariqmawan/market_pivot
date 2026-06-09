import React, { useEffect, useState } from "react";
import type { StockExchange, IndexSnapshot, MarketMover, SectorPerformance, MarketNews } from "../../types";
import { fetchJson } from "../lib/apiClient";
import LineChart from "./LineChart";
import ChartJSLine from "./ChartJSLine";
import "./ExchangeDetail.css";
import { useI18n } from "../i18n";
import { translateStatic } from "../i18n/translate";


interface ExchangeDetailProps {
  exchange: StockExchange;
  indexData?: IndexSnapshot;
  gainers?: MarketMover[];
  losers?: MarketMover[];
  mostActive?: MarketMover[];
  isLoading?: boolean;
}

const TICKER_DOMAIN: Record<string, string> = {
  AAPL: "apple.com", MSFT: "microsoft.com", GOOGL: "google.com", AMZN: "amazon.com",
  META: "meta.com", TSLA: "tesla.com", NVDA: "nvidia.com", JPM: "jpmorganchase.com",
  JNJ: "jnj.com", V: "visa.com", MA: "mastercard.com", WMT: "walmart.com",
  PG: "pg.com", UNH: "uhg.com", HD: "homedepot.com", DIS: "disney.com",
  NFLX: "netflix.com", PYPL: "paypal.com", BAC: "bankofamerica.com", XOM: "exxonmobil.com",
  CVX: "chevron.com", KO: "coca-colacompany.com", PEP: "pepsico.com", COST: "costco.com",
  ADBE: "adobe.com", CRM: "salesforce.com", ORCL: "oracle.com", IBM: "ibm.com",
  INTC: "intel.com", AMD: "amd.com", QCOM: "qualcomm.com", TXN: "ti.com",
  GS: "goldmansachs.com", MS: "morganstanley.com", C: "citigroup.com", WFC: "wellsfargo.com",
  BABA: "alibaba.com", TSM: "tsmc.com", ASML: "asml.com", SAP: "sap.com",
};

const getCompanyLogo = (symbol: string): string => {
  const domain = TICKER_DOMAIN[symbol.toUpperCase()];
  if (domain) return `https://logo.clearbit.com/${domain}`;
  return "";
};

const MoverLogo: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [failed, setFailed] = useState(false);
  const src = getCompanyLogo(symbol);
  if (!src || failed) {
    return (
      <span className="mover-avatar" style={{ background: `hsl(${(symbol.charCodeAt(0) * 37) % 360}, 55%, 40%)` }}>
        {symbol.slice(0, 2)}
      </span>
    );
  }
  return <img src={src} alt={symbol} className="mover-logo" onError={() => setFailed(true)} />;
};

const ExchangeDetail: React.FC<ExchangeDetailProps> = ({
  exchange,
  indexData,
  gainers = [],
  losers = [],
  mostActive = [],
  isLoading = false,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"overview" | "chart" | "movers" | "sectors" | "news">("overview");

  const [sectors, setSectors] = useState<SectorPerformance[]>([]);
  const [news, setNews] = useState<MarketNews[]>([]);
  const [isTabLoading, setIsTabLoading] = useState(false);

  const formatMoney = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    return `$${value.toLocaleString()}`;
  };

  const formatSignedPercent = (value: unknown) => {
    const num = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(num)) return "—";
    return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
  };

  const exchangeName = translateStatic(t, exchange.nameKey, exchange.name);
  const exchangeCountry = translateStatic(t, exchange.countryKey, exchange.country);
  const exchangeTimezone = translateStatic(t, exchange.timezoneKey, exchange.timezone);

  useEffect(() => {
    if (activeTab === "sectors" && sectors.length === 0) {
      setIsTabLoading(true);
      fetchJson<SectorPerformance[]>(`/exchanges/${exchange.id}/sectors`)
        .then((res) => { if (res.success && res.data) setSectors(res.data); })
        .catch(() => { /* keep sectors empty; UI shows no-data state */ })
        .finally(() => setIsTabLoading(false));
    }
    if (activeTab === "news" && news.length === 0) {
      setIsTabLoading(true);
      fetchJson<MarketNews[]>(`/exchanges/${exchange.id}/news`)
        .then((res) => { if (res.success && res.data) setNews(res.data); })
        .catch(() => { /* keep news empty; UI shows no-data state */ })
        .finally(() => setIsTabLoading(false));
    }
  }, [activeTab, exchange.id, sectors.length, news.length]);

  const generateSeries = (base: number, points = 30) => {
    const series: number[] = [];
    let value = base;
    for (let i = 0; i < points; i++) {
      const change = (Math.random() - 0.5) * base * 0.01;
      value = Math.max(0, value + change);
      series.push(Number(value.toFixed(2)));
    }
    return series;
  };

  return (
    <div className="exchange-detail">
      {/* Exchange Hero */}
      <section className="exchange-hero">
        <div className="exchange-hero-banner">
          <img src="/logos/stockmarket.jpg" alt="" className="exchange-banner-img" aria-hidden="true" />
          <div className="exchange-banner-overlay" />
        </div>
        <div className="exchange-identity">
          <div className="exchange-logo-wrap">
            <img src={exchange.logo} alt={exchange.name} className="exchange-logo"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          </div>
          <div>
            <h1>{exchangeName}</h1>
            <p className="exchange-meta">
              {exchangeCountry}
              {" • "}
              {exchangeTimezone}
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="exchange-metrics">
          <div className="metric-item">
            <span className="metric-label">{t("marketCap")}</span>
            <span className="metric-value">{formatMoney(exchange.marketCap)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">{t("listedCompanies")}</span>
            <span className="metric-value">{exchange.listedCompanies.toLocaleString()}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">{t("avgDailyVolume")}</span>
            <span className="metric-value">{formatMoney(exchange.avgDailyVolume)}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">{t("tradingHours")}</span>
            <span className="metric-value">{exchange.tradingHours.open} - {exchange.tradingHours.close}</span>
          </div>
        </div>

        {/* Index Snapshot */}
        {indexData && (
          <div className="index-snapshot">
            <div className="index-info">
              <h2>{indexData.name}</h2>
              <span className={`index-change ${indexData.change >= 0 ? "positive" : "negative"}`}>
                {formatSignedPercent(indexData.percentChange)}
              </span>
            </div>
            <p className="index-value">{indexData.value.toLocaleString()}</p>
            <div className="market-breadth">
              <span className="breadth-item positive">▲ {indexData.advancers} {t("advancers")}</span>
              <span className="breadth-item negative">▼ {indexData.decliners} {t("decliners")}</span>
            </div>
          </div>
        )}
      </section>

      {/* Tab Navigation */}
      <nav className="exchange-tabs">
        <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
          {t("overview")}
        </button>
        <button className={activeTab === "chart" ? "active" : ""} onClick={() => setActiveTab("chart")}>
          {t("chart")}
        </button>
        <button className={activeTab === "movers" ? "active" : ""} onClick={() => setActiveTab("movers")}>
          {t("topMovers")}
        </button>
        <button className={activeTab === "sectors" ? "active" : ""} onClick={() => setActiveTab("sectors")}>
          {t("sectors")}
        </button>
        <button className={activeTab === "news" ? "active" : ""} onClick={() => setActiveTab("news")}>
          {t("news")}
        </button>
      </nav>

      {/* Tab Content */}
      <div className="exchange-content">
        {activeTab === "overview" && (
          <div className="overview-grid">
            <div className="overview-card">
              <h3>{t("founded")}</h3>
              <p>{exchange.founded}</p>
            </div>
            <div className="overview-card">
              <h3>{t("mainIndex")}</h3>
              <p>{exchange.mainIndexName} ({exchange.mainIndex})</p>
            </div>
            <div className="overview-card">
              <h3>{t("baseCurrency")}</h3>
              <p>{exchange.currency}</p>
            </div>
            <div className="overview-card">
              <h3>{t("website")}</h3>
              <a href={exchange.website} target="_blank" rel="noopener noreferrer">{exchange.website}</a>
            </div>
          </div>
        )}

        {activeTab === "chart" && (
          <div className="chart-container">
            {indexData ? (
              window.Chart ? (
                <ChartJSLine data={generateSeries(indexData.value, 30)} width={800} height={300} />
              ) : (
                <LineChart data={generateSeries(indexData.value, 30)} width={800} height={300} />
              )
            ) : (
              <div className="chart-placeholder">{t("chartComing")}</div>
            )}
          </div>
        )}

        {activeTab === "movers" && (
          <div className="movers-container">
            <div className="mover-section">
              <h3 className="mover-title positive">{t("topGainers")}</h3>
              <div className="mover-list">
                {gainers.length === 0 ? (
                  <p className="mover-placeholder">{t("loadingGainers")}</p>
                ) : (
                  gainers.slice(0, 5).map((mover) => (
                    <div key={mover.symbol} className="mover-row">
                      <MoverLogo symbol={mover.symbol} />
                      <span className="mover-symbol">{mover.symbol}</span>
                      <span className="mover-company">{mover.company}</span>
                      <span className="mover-change positive">{formatSignedPercent(mover.percentChange)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mover-section">
              <h3 className="mover-title negative">{t("topLosers")}</h3>
              <div className="mover-list">
                {losers.length === 0 ? (
                  <p className="mover-placeholder">{t("loadingLosers")}</p>
                ) : (
                  losers.slice(0, 5).map((mover) => (
                    <div key={mover.symbol} className="mover-row">
                      <MoverLogo symbol={mover.symbol} />
                      <span className="mover-symbol">{mover.symbol}</span>
                      <span className="mover-company">{mover.company}</span>
                      <span className="mover-change negative">{formatSignedPercent(mover.percentChange)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "sectors" && (
          <div className="sectors-container">
            {isTabLoading ? (
              <p>{t('loadingSectors')}</p>
            ) : sectors.length > 0 ? (
              <div className="sectors-grid">
                {sectors.map(sector => (
                  <div key={sector.name} className="sector-card">
                    <h4>{sector.name}</h4>
                    <p className={`sector-performance ${sector.performance >= 0 ? "positive" : "negative"}`}>
                      {formatSignedPercent(sector.performance)}
                    </p>
                    <span className="sector-companies">{sector.companies} {t("markets:companiesLabel")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p>{t('noSectorData')}</p>
            )}
          </div>
        )}

        {activeTab === "news" && (
          <div className="news-container">
            {isTabLoading ? (
              <p>{t('dataLoading')}</p>
            ) : news.length > 0 ? (
              <div className="news-grid">
                {news.slice(0, 6).map(item => (
                  <article key={item.id} className="news-item">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <div className="news-meta">
                      <span>{item.source}</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p>{t('noNewsAvailable')}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangeDetail;
