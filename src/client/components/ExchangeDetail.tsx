import React, { useEffect, useState } from "react";
import type { StockExchange, IndexSnapshot, MarketMover, SectorPerformance, MarketNews } from "../../types";
import { useI18n } from "../i18n";
import LineChart from "./LineChart";
import ChartJSLine from "./ChartJSLine";

interface ExchangeDetailProps {
  exchange: StockExchange;
  indexData?: IndexSnapshot;
  gainers?: MarketMover[];
  losers?: MarketMover[];
  mostActive?: MarketMover[];
  isLoading?: boolean;
}

const ExchangeDetail: React.FC<ExchangeDetailProps> = ({
  exchange,
  indexData,
  gainers = [],
  losers = [],
  mostActive = [],
  isLoading = false,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<
    "overview" | "chart" | "movers" | "sectors" | "news"
  >("overview");

  const [sectors, setSectors] = useState<SectorPerformance[]>([]);
  const [news, setNews] = useState<MarketNews[]>([]);
  const [isTabLoading, setIsTabLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "sectors" && sectors.length === 0) {
      setIsTabLoading(true);
      fetch(`http://localhost:3000/api/exchanges/${exchange.id}/sectors`)
        .then(r => r.json())
        .then(res => { if (res.success) setSectors(res.data); })
        .finally(() => setIsTabLoading(false));
    }
    if (activeTab === "news" && news.length === 0) {
      setIsTabLoading(true);
      fetch(`http://localhost:3000/api/exchanges/${exchange.id}/news`)
        .then(r => r.json())
        .then(res => { if (res.success) setNews(res.data); })
        .finally(() => setIsTabLoading(false));
    }
  }, [activeTab, exchange.id, sectors.length, news.length]);

  const generateSeries = (base: number, points = 30) => {
    const series: number[] = [];
    let value = base;
    for (let i = 0; i < points; i++) {
      // random walk small variations
      const change = (Math.random() - 0.5) * base * 0.01;
      value = Math.max(0, value + change);
      series.push(Number(value.toFixed(2)));
    }
    return series;
  };

  return (
    <div className="exchange-detail">
      {/* 1. Exchange Overview Header */}
      <section className="overview-header">
        <div className="exchange-info">
          <div className="exchange-header">
            <img src={exchange.logo} alt={exchange.name} className="logo" />
            <div className="info">
              <h1>{exchange.name}</h1>
              <p className="country">
                {exchange.country} • {exchange.timezone}
              </p>
              <p className="description">{exchange.description}</p>
            </div>
          </div>

          <div className="key-metrics">
            <div className="metric">
              <label>{t("marketCap")}</label>
              <p className="value">
                ${(exchange.marketCap / 1e12).toFixed(2)}T
              </p>
            </div>
            <div className="metric">
              <label>{t("listedCompanies")}</label>
              <p className="value">{exchange.listedCompanies.toLocaleString()}</p>
            </div>
            <div className="metric">
              <label>{t("avgDailyVolume")}</label>
              <p className="value">
                ${(exchange.avgDailyVolume / 1e9).toFixed(2)}B
              </p>
            </div>
            <div className="metric">
              <label>{t("tradingHours")}</label>
              <p className="value">
                {exchange.tradingHours.open} - {exchange.tradingHours.close}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Market Summary */}
        {indexData && (
          <section className="market-summary">
            <div className="index-snapshot">
              <h3>{indexData.name}</h3>
              <p className="index-value">{indexData.value.toFixed(2)}</p>
              <p
                className={`change ${indexData.change >= 0 ? "positive" : "negative"}`}
              >
                {indexData.change >= 0 ? "+" : ""}
                {indexData.change.toFixed(2)} ({indexData.percentChange.toFixed(2)}%)
              </p>
              <div className="breadth">
                <span className="advancers">
                  ↑ {indexData.advancers} {t("advancers")}
                </span>
                <span className="decliners">
                  ↓ {indexData.decliners} {t("decliners")}
                </span>
              </div>
            </div>
          </section>
        )}
      </section>

      {/* Navigation Tabs */}
      <nav className="tab-navigation">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          {t("overview")}
        </button>
        <button
          className={`tab ${activeTab === "chart" ? "active" : ""}`}
          onClick={() => setActiveTab("chart")}
        >
          {t("chart")}
        </button>
        <button
          className={`tab ${activeTab === "movers" ? "active" : ""}`}
          onClick={() => setActiveTab("movers")}
        >
          {t("topMovers")}
        </button>
        <button
          className={`tab ${activeTab === "sectors" ? "active" : ""}`}
          onClick={() => setActiveTab("sectors")}
        >
          {t("sectors")}
        </button>
        <button
          className={`tab ${activeTab === "news" ? "active" : ""}`}
          onClick={() => setActiveTab("news")}
        >
          {t("news")}
        </button>
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <section className="overview-section">
            <div className="info-grid">
              <div className="info-card">
                <h4>{t("founded")}</h4>
                <p>{exchange.founded}</p>
              </div>
              <div className="info-card">
                <h4>{t("mainIndex")}</h4>
                <p>
                  {exchange.mainIndexName} ({exchange.mainIndex})
                </p>
              </div>
              <div className="info-card">
                <h4>{t("baseCurrency")}</h4>
                <p>{exchange.currency}</p>
              </div>
              <div className="info-card">
                <h4>{t("website")}</h4>
                <a href={exchange.website} target="_blank" rel="noopener noreferrer">
                  {exchange.website}
                </a>
              </div>
            </div>
          </section>
        )}

        {activeTab === "chart" && (
            <section className="chart-section">
              <h3>{t("chart")}</h3>
              <div className="chart-controls">
                <button className="timeframe">1D</button>
                <button className="timeframe active">7D</button>
                <button className="timeframe">1M</button>
                <button className="timeframe">1Y</button>
              </div>

              <div>
                {indexData ? (
                  // prefer Chart.js when loaded, fallback to SVG LineChart
                  (window as any).Chart ? (
                    <ChartJSLine data={generateSeries(indexData.value, 30)} width={800} height={260} />
                  ) : (
                    <LineChart data={generateSeries(indexData.value, 30)} width={800} height={260} />
                  )
                ) : (
                  <div className="chart-placeholder">
                    <p>{t("chartComing")}</p>
                  </div>
                )}
              </div>
            </section>
        )}

        {activeTab === "movers" && (
          <section className="movers-section">
            <div className="movers-grid">
              <div className="mover-column gainers">
                <h3>{t("topGainers")}</h3>
                <div className="mover-list">
                  {gainers.length === 0 ? (
                    <p className="placeholder">{t("loadingGainers")}</p>
                  ) : (
                    gainers.map((mover) => {
                      const sigs = typeof mover.signals === 'string' ? JSON.parse(mover.signals) : (mover.signals || {});
                      return (
                      <div key={mover.symbol} className="mover-item">
                        <div className="mover-header">
                          <span className="symbol">{mover.symbol}</span>
                          <span className="company">{mover.company}</span>
                        </div>
                        <div className="mover-details">
                          <span className="price">
                            ${mover.price.toFixed(2)}
                          </span>
                          <span className="change positive">
                            +{mover.percentChange.toFixed(2)}%
                          </span>
                        </div>
                        {Object.keys(sigs).length > 0 && (
                          <div className="mover-signals" style={{ marginTop: 8, display: 'flex', gap: 6, fontSize: '0.75rem', flexWrap: 'wrap' }}>
                            {sigs.momentumScore && <span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 6px', borderRadius: 4 }}>Momentum: {sigs.momentumScore}</span>}
                            {sigs.unusualVolume && <span style={{ background: '#fffbeb', color: '#d97706', padding: '2px 6px', borderRadius: 4 }}>Unusual Vol</span>}
                          </div>
                        )}
                      </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mover-column losers">
                <h3>{t("topLosers")}</h3>
                <div className="mover-list">
                  {losers.length === 0 ? (
                    <p className="placeholder">{t("loadingLosers")}</p>
                  ) : (
                    losers.map((mover) => {
                      const sigs = typeof mover.signals === 'string' ? JSON.parse(mover.signals) : (mover.signals || {});
                      return (
                      <div key={mover.symbol} className="mover-item">
                        <div className="mover-header">
                          <span className="symbol">{mover.symbol}</span>
                          <span className="company">{mover.company}</span>
                        </div>
                        <div className="mover-details">
                          <span className="price">
                            ${mover.price.toFixed(2)}
                          </span>
                          <span className="change negative">
                            {mover.percentChange.toFixed(2)}%
                          </span>
                        </div>
                        {Object.keys(sigs).length > 0 && (
                          <div className="mover-signals" style={{ marginTop: 8, display: 'flex', gap: 6, fontSize: '0.75rem', flexWrap: 'wrap' }}>
                            {sigs.crashAlert && <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 6px', borderRadius: 4 }}>Crash Alert</span>}
                            {sigs.oversold && <span style={{ background: '#eff6ff', color: '#2563eb', padding: '2px 6px', borderRadius: 4 }}>Oversold</span>}
                            {sigs.reversalProb && <span style={{ background: '#fdf4ff', color: '#c026d3', padding: '2px 6px', borderRadius: 4 }}>Reversal: {sigs.reversalProb}%</span>}
                          </div>
                        )}
                      </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mover-column active">
                <h3>{t("mostActive")}</h3>
                <div className="mover-list">
                  {mostActive.length === 0 ? (
                    <p className="placeholder">{t("loadingActive")}</p>
                  ) : (
                    mostActive.map((mover) => {
                      const sigs = typeof mover.signals === 'string' ? JSON.parse(mover.signals) : (mover.signals || {});
                      return (
                      <div key={mover.symbol} className="mover-item">
                        <div className="mover-header">
                          <span className="symbol">{mover.symbol}</span>
                          <span className="company">{mover.company}</span>
                        </div>
                        <div className="mover-details">
                          <span className="volume">
                            Vol: {(mover.volume / 1e6).toFixed(0)}M
                          </span>
                          <span className="price">
                            ${mover.price.toFixed(2)}
                          </span>
                        </div>
                        {Object.keys(sigs).length > 0 && (
                          <div className="mover-signals" style={{ marginTop: 8, display: 'flex', gap: 6, fontSize: '0.75rem', flexWrap: 'wrap' }}>
                            {sigs.whaleSignal && <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '2px 6px', borderRadius: 4 }}>Whale Activity</span>}
                            {sigs.unusualActivity && <span style={{ background: '#fefce8', color: '#ca8a04', padding: '2px 6px', borderRadius: 4 }}>Unusual Activity</span>}
                          </div>
                        )}
                      </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "sectors" && (
          <section className="sectors-section">
            {isTabLoading ? <p>Loading sectors...</p> : (
              <div className="sectors-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
                {sectors.map(sector => (
                  <div key={sector.name} className="sector-card" style={{ padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
                    <h4 style={{ margin: "0 0 8px 0" }}>{sector.name}</h4>
                    <p style={{ margin: 0, fontSize: "1.2rem", color: sector.performance >= 0 ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                      {sector.performance > 0 ? "+" : ""}{sector.performance.toFixed(2)}%
                    </p>
                    <p style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: "0.85rem" }}>
                      Companies: {sector.companies}
                    </p>
                  </div>
                ))}
                {sectors.length === 0 && !isTabLoading && <p>No sector data available.</p>}
              </div>
            )}
          </section>
        )}

        {activeTab === "news" && (
          <section className="news-section">
            {isTabLoading ? <p>Loading news...</p> : (
              <div className="news-list" style={{ display: "grid", gap: 16 }}>
                {news.map(item => (
                  <div key={item.id} className="news-card" style={{ padding: 16, background: "#fff", borderRadius: 12, border: "1px solid #eee" }}>
                    <h4 style={{ margin: "0 0 8px 0" }}>{item.title}</h4>
                    <p style={{ margin: 0, color: "#4b5563", fontSize: "0.9rem" }}>{item.description}</p>
                    <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", color: "#9ca3af", fontSize: "0.8rem" }}>
                      <span>{item.source}</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {news.length === 0 && !isTabLoading && <p>No news available for this exchange.</p>}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ExchangeDetail;
