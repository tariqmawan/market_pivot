import React from "react";
import type { StockExchange, IndexSnapshot, MarketMover } from "../../types";
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
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "chart" | "movers" | "sectors" | "news"
  >("overview");

  const sectorBreakdown = [
    ["Technology", 1.8, "Momentum leadership"],
    ["Financials", 0.9, "Credit-sensitive bid"],
    ["Energy", -0.4, "Oil beta cooling"],
    ["Healthcare", 0.3, "Defensive rotation"],
    ["Industrials", 0.7, "Capex demand"],
    ["Consumer", -0.2, "Margin watch"],
  ] as const;

  const proStats = [
    ["Average P/E", "21.4x"],
    ["Dividend Yield", "1.9%"],
    ["Market Breadth", `${indexData ? indexData.advancers : 0}/${indexData ? indexData.decliners : 0}`],
    ["Volatility", "Medium"],
    ["Smart Money Flow", "Net inflow"],
    ["AI Trend Strength", "74/100"],
  ];

  const topCompanies = ["MegaCap Tech", "Global Financials", "Energy Leaders", "Healthcare Majors"];

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

            <div className="module-feature-band">
              {[
                "Overview",
                "Top gainers",
                "Top losers",
                "Most active",
                "Trending stocks",
                "Index charts",
                "Sector heatmap",
                "AI alerts",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
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

            <div className="pro-dashboard-grid">
              {proStats.map(([label, value]) => (
                <div className="info-card" key={label}>
                  <h4>{label}</h4>
                  <p>{value}</p>
                </div>
              ))}
            </div>

            <div className="insight-strip">
              <div>
                <span>Currency context</span>
                <strong>{exchange.currency} market base</strong>
                <p>Market cap and turnover can be converted to USD from the user currency selector.</p>
              </div>
              <div>
                <span>Trading window</span>
                <strong>{exchange.tradingHours.open} - {exchange.tradingHours.close}</strong>
                <p>Open/close clocks, holidays, premarket and after-hours can plug into this exchange shell.</p>
              </div>
              <div>
                <span>AI exchange brief</span>
                <strong>Risk-on with selective breadth</strong>
                <p>Daily summaries can blend price action, volume anomalies, news, and macro events.</p>
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
                    gainers.map((mover) => (
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
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mover-column losers">
                <h3>{t("topLosers")}</h3>
                <div className="mover-list">
                  {losers.length === 0 ? (
                    <p className="placeholder">{t("loadingLosers")}</p>
                  ) : (
                    losers.map((mover) => (
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
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mover-column active">
                <h3>{t("mostActive")}</h3>
                <div className="mover-list">
                  {mostActive.length === 0 ? (
                    <p className="placeholder">{t("loadingActive")}</p>
                  ) : (
                    mostActive.map((mover) => (
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
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "sectors" && (
          <section className="sectors-section">
            <div className="sector-breakdown-grid">
              {sectorBreakdown.map(([sector, performance, note]) => (
                <div className="sector-tile" key={sector}>
                  <span>{sector}</span>
                  <strong className={performance >= 0 ? "positive" : "negative"}>
                    {performance >= 0 ? "+" : ""}{performance.toFixed(1)}%
                  </strong>
                  <p>{note}</p>
                </div>
              ))}
            </div>
            <div className="insight-strip">
              <div>
                <span>Top companies</span>
                <strong>{topCompanies.join(" / ")}</strong>
                <p>Largest companies by market cap and trending names can sit directly below this view.</p>
              </div>
              <div>
                <span>Rotation signal</span>
                <strong>Technology and financials leading</strong>
                <p>Sector rotation visualization and heatmaps are ready for live feeds.</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "news" && (
          <section className="news-section">
            <div className="news-card-list">
              {[
                `${exchange.name} breadth improves as advancers outpace decliners`,
                `${exchange.currency} moves shape foreign investor returns`,
                `${exchange.mainIndexName} futures point to selective risk appetite`,
              ].map((headline) => (
                <article key={headline} className="news-mini-card">
                  <span>Market News</span>
                  <h3>{headline}</h3>
                  <p>Connect Reuters, Bloomberg-style wires, NewsAPI, or internal editorial summaries here.</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ExchangeDetail;
