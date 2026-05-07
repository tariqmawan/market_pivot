import React from "react";
import type { StockExchange, IndexSnapshot, MarketMover } from "../../../types";

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
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "chart" | "movers" | "sectors" | "news"
  >("overview");

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
              <label>Market Cap</label>
              <p className="value">
                ${(exchange.marketCap / 1e12).toFixed(2)}T
              </p>
            </div>
            <div className="metric">
              <label>Listed Companies</label>
              <p className="value">{exchange.listedCompanies.toLocaleString()}</p>
            </div>
            <div className="metric">
              <label>Avg Daily Volume</label>
              <p className="value">
                ${(exchange.avgDailyVolume / 1e9).toFixed(2)}B
              </p>
            </div>
            <div className="metric">
              <label>Trading Hours</label>
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
                  ↑ {indexData.advancers} Advancers
                </span>
                <span className="decliners">
                  ↓ {indexData.decliners} Decliners
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
          Overview
        </button>
        <button
          className={`tab ${activeTab === "chart" ? "active" : ""}`}
          onClick={() => setActiveTab("chart")}
        >
          Chart
        </button>
        <button
          className={`tab ${activeTab === "movers" ? "active" : ""}`}
          onClick={() => setActiveTab("movers")}
        >
          Top Movers
        </button>
        <button
          className={`tab ${activeTab === "sectors" ? "active" : ""}`}
          onClick={() => setActiveTab("sectors")}
        >
          Sectors
        </button>
        <button
          className={`tab ${activeTab === "news" ? "active" : ""}`}
          onClick={() => setActiveTab("news")}
        >
          News
        </button>
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <section className="overview-section">
            <div className="info-grid">
              <div className="info-card">
                <h4>Founded</h4>
                <p>{exchange.founded}</p>
              </div>
              <div className="info-card">
                <h4>Main Index</h4>
                <p>
                  {exchange.mainIndexName} ({exchange.mainIndex})
                </p>
              </div>
              <div className="info-card">
                <h4>Base Currency</h4>
                <p>{exchange.currency}</p>
              </div>
              <div className="info-card">
                <h4>Website</h4>
                <a href={exchange.website} target="_blank" rel="noopener noreferrer">
                  {exchange.website}
                </a>
              </div>
            </div>
          </section>
        )}

        {activeTab === "chart" && (
          <section className="chart-section">
            <div className="chart-placeholder">
              <p>📈 Interactive price chart will display here</p>
              <p className="subtitle">
                With timeframes: 1D, 1W, 1M, 1Y
              </p>
            </div>
          </section>
        )}

        {activeTab === "movers" && (
          <section className="movers-section">
            <div className="movers-grid">
              <div className="mover-column gainers">
                <h3>🔼 Top Gainers</h3>
                <div className="mover-list">
                  {gainers.length === 0 ? (
                    <p className="placeholder">Loading gainers...</p>
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
                <h3>🔽 Top Losers</h3>
                <div className="mover-list">
                  {losers.length === 0 ? (
                    <p className="placeholder">Loading losers...</p>
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
                <h3>🔁 Most Active</h3>
                <div className="mover-list">
                  {mostActive.length === 0 ? (
                    <p className="placeholder">Loading active...</p>
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
            <div className="sectors-placeholder">
              <p>📊 Sector performance breakdown will display here</p>
              <p className="subtitle">
                Technology, Finance, Energy, Healthcare, and more
              </p>
            </div>
          </section>
        )}

        {activeTab === "news" && (
          <section className="news-section">
            <div className="news-placeholder">
              <p>📰 Latest market news and updates will display here</p>
              <p className="subtitle">
                From Reuters, Bloomberg, and economic sources
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ExchangeDetail;
