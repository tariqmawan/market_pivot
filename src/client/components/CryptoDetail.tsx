import React from "react";
import type { Cryptocurrency, CryptoPrice, TradingPair } from "../../../types";

interface CryptoDetailProps {
  crypto: Cryptocurrency;
  priceData?: CryptoPrice;
  tradingPairs?: TradingPair[];
  isLoading?: boolean;
}

const CryptoDetail: React.FC<CryptoDetailProps> = ({
  crypto,
  priceData,
  tradingPairs = [],
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "price" | "pairs" | "exchanges" | "charts" | "on-chain" | "news"
  >("overview");

  return (
    <div className="crypto-detail">
      {/* 1. Crypto Overview Header */}
      <section className="overview-header">
        <div className="crypto-info">
          <div className="crypto-header">
            <img src={crypto.logo} alt={crypto.name} className="logo" />
            <div className="info">
              <h1>{crypto.name}</h1>
              <p className="symbol">{crypto.symbol}</p>
              <p className="category">
                {crypto.category} • Launched {crypto.launched}
              </p>
              <p className="description">{crypto.description}</p>
            </div>
          </div>

          {priceData && (
            <div className="price-highlight">
              <div className="price-main">
                <p className="label">Current Price</p>
                <p className="price">${priceData.price.toFixed(2)}</p>
                <p
                  className={`change ${priceData.changePercent24h >= 0 ? "positive" : "negative"}`}
                >
                  {priceData.changePercent24h >= 0 ? "+" : ""}
                  {priceData.change24h.toFixed(2)} ({priceData.changePercent24h.toFixed(2)}%)
                </p>
              </div>

              <div className="price-metrics">
                <div className="metric">
                  <label>Market Cap</label>
                  <p className="value">
                    ${(priceData.marketCap / 1e9).toFixed(2)}B
                  </p>
                </div>
                <div className="metric">
                  <label>24h Volume</label>
                  <p className="value">
                    ${(priceData.volume24h / 1e9).toFixed(2)}B
                  </p>
                </div>
                <div className="metric">
                  <label>Rank</label>
                  <p className="value">#{priceData.rank}</p>
                </div>
              </div>
            </div>
          )}
        </div>
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
          className={`tab ${activeTab === "price" ? "active" : ""}`}
          onClick={() => setActiveTab("price")}
        >
          Price & Metrics
        </button>
        <button
          className={`tab ${activeTab === "pairs" ? "active" : ""}`}
          onClick={() => setActiveTab("pairs")}
        >
          Trading Pairs
        </button>
        <button
          className={`tab ${activeTab === "exchanges" ? "active" : ""}`}
          onClick={() => setActiveTab("exchanges")}
        >
          Exchanges
        </button>
        <button
          className={`tab ${activeTab === "charts" ? "active" : ""}`}
          onClick={() => setActiveTab("charts")}
        >
          Charts
        </button>
        <button
          className={`tab ${activeTab === "on-chain" ? "active" : ""}`}
          onClick={() => setActiveTab("on-chain")}
        >
          On-Chain
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
                <h4>Symbol</h4>
                <p>{crypto.symbol}</p>
              </div>
              <div className="info-card">
                <h4>Category</h4>
                <p>{crypto.category}</p>
              </div>
              <div className="info-card">
                <h4>Founded</h4>
                <p>{crypto.launched}</p>
              </div>
              <div className="info-card">
                <h4>Founder</h4>
                <p>{crypto.founder}</p>
              </div>
              <div className="info-card">
                <h4>Consensus Mechanism</h4>
                <p>{crypto.consensusMechanism}</p>
              </div>
              {crypto.blockTime && (
                <div className="info-card">
                  <h4>Block Time</h4>
                  <p>{crypto.blockTime} seconds</p>
                </div>
              )}
            </div>

            <div className="supply-info">
              <h3>Supply Information</h3>
              <div className="supply-grid">
                <div className="supply-card">
                  <h4>Circulating Supply</h4>
                  <p className="value">
                    {(crypto.circulatingSupply / 1e9).toFixed(2)}B
                  </p>
                  <p className="label">{crypto.symbol}</p>
                </div>
                {crypto.maxSupply && (
                  <div className="supply-card">
                    <h4>Max Supply</h4>
                    <p className="value">
                      {(crypto.maxSupply / 1e9).toFixed(2)}B
                    </p>
                    <p className="label">{crypto.symbol}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === "price" && (
          <section className="price-section">
            <h3>Price & Market Metrics</h3>
            {priceData ? (
              <div className="metrics-grid">
                <div className="metric-card">
                  <h4>Current Price</h4>
                  <p className="value">${priceData.price.toFixed(2)}</p>
                </div>
                <div className="metric-card">
                  <h4>24h Change</h4>
                  <p
                    className={`value ${priceData.changePercent24h >= 0 ? "positive" : "negative"}`}
                  >
                    {priceData.changePercent24h >= 0 ? "+" : ""}
                    {priceData.changePercent24h.toFixed(2)}%
                  </p>
                </div>
                <div className="metric-card">
                  <h4>Market Cap</h4>
                  <p className="value">
                    ${(priceData.marketCap / 1e9).toFixed(2)}B
                  </p>
                </div>
                <div className="metric-card">
                  <h4>24h Volume</h4>
                  <p className="value">
                    ${(priceData.volume24h / 1e9).toFixed(2)}B
                  </p>
                </div>
                <div className="metric-card">
                  <h4>All-Time High</h4>
                  <p className="value">${priceData.ath.toFixed(2)}</p>
                </div>
                <div className="metric-card">
                  <h4>All-Time Low</h4>
                  <p className="value">${priceData.atl.toFixed(2)}</p>
                </div>
                <div className="metric-card">
                  <h4>Market Rank</h4>
                  <p className="value">#{priceData.rank}</p>
                </div>
                <div className="metric-card">
                  <h4>Circulating Supply</h4>
                  <p className="value">
                    {(priceData.circulatingSupply / 1e9).toFixed(2)}B
                  </p>
                </div>
              </div>
            ) : (
              <p className="placeholder">Loading price data...</p>
            )}
          </section>
        )}

        {activeTab === "pairs" && (
          <section className="pairs-section">
            <h3>Trading Pairs</h3>
            {tradingPairs.length === 0 ? (
              <p className="placeholder">Loading trading pairs...</p>
            ) : (
              <div className="pairs-table">
                <table>
                  <thead>
                    <tr>
                      <th>Pair</th>
                      <th>Price</th>
                      <th>24h Volume</th>
                      <th>Exchange</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradingPairs.slice(0, 10).map((pair) => (
                      <tr key={pair.pair}>
                        <td>{pair.pair}</td>
                        <td>${pair.price.toFixed(2)}</td>
                        <td>
                          ${(pair.volume24h / 1e9).toFixed(2)}B
                        </td>
                        <td>{pair.exchange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "exchanges" && (
          <section className="exchanges-section">
            <h3>Exchanges Listing</h3>
            <div className="exchanges-placeholder">
              <p>🏢 Exchanges where {crypto.symbol} is traded</p>
              <p className="subtitle">Binance, Coinbase, Kraken, and more</p>
            </div>
          </section>
        )}

        {activeTab === "charts" && (
          <section className="charts-section">
            <h3>Price Charts</h3>
            <div className="chart-controls">
              <button className="timeframe">1H</button>
              <button className="timeframe">24H</button>
              <button className="timeframe active">7D</button>
              <button className="timeframe">1M</button>
              <button className="timeframe">1Y</button>
              <button className="timeframe">ALL</button>
            </div>
            <div className="chart-placeholder">
              <p>📈 Interactive price chart</p>
              <p className="subtitle">With volume overlay</p>
            </div>
          </section>
        )}

        {activeTab === "on-chain" && (
          <section className="on-chain-section">
            <h3>On-Chain Metrics (Advanced)</h3>
            <div className="on-chain-metrics">
              <div className="metric-card">
                <h4>Transactions Per Day</h4>
                <p className="value">-</p>
              </div>
              <div className="metric-card">
                <h4>Active Addresses</h4>
                <p className="value">-</p>
              </div>
              <div className="metric-card">
                <h4>Network Fees</h4>
                <p className="value">-</p>
              </div>
              <div className="metric-card">
                <h4>Transaction Volume</h4>
                <p className="value">-</p>
              </div>
            </div>
            <p className="note">On-chain data coming soon</p>
          </section>
        )}

        {activeTab === "news" && (
          <section className="news-section">
            <h3>News & Updates</h3>
            <div className="news-placeholder">
              <p>📰 Latest news and updates for {crypto.symbol}</p>
              <p className="subtitle">Project updates, partnerships, and market news</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CryptoDetail;
