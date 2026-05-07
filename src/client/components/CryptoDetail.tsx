import React from "react";
import type { Cryptocurrency, CryptoPrice, TradingPair } from "../../types";
import { useI18n } from "../i18n";

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
  const { t } = useI18n();
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
                <p className="label">{t("currentPrice")}</p>
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
                  <label>{t("marketCap")}</label>
                  <p className="value">
                    ${(priceData.marketCap / 1e9).toFixed(2)}B
                  </p>
                </div>
                <div className="metric">
                  <label>{t("volume24h")}</label>
                  <p className="value">
                    ${(priceData.volume24h / 1e9).toFixed(2)}B
                  </p>
                </div>
                <div className="metric">
                  <label>{t("rank")}</label>
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
          {t("overview")}
        </button>
        <button
          className={`tab ${activeTab === "price" ? "active" : ""}`}
          onClick={() => setActiveTab("price")}
        >
          {t("priceMetrics")}
        </button>
        <button
          className={`tab ${activeTab === "pairs" ? "active" : ""}`}
          onClick={() => setActiveTab("pairs")}
        >
          {t("tradingPairs")}
        </button>
        <button
          className={`tab ${activeTab === "exchanges" ? "active" : ""}`}
          onClick={() => setActiveTab("exchanges")}
        >
          {t("exchanges")}
        </button>
        <button
          className={`tab ${activeTab === "charts" ? "active" : ""}`}
          onClick={() => setActiveTab("charts")}
        >
          {t("charts")}
        </button>
        <button
          className={`tab ${activeTab === "on-chain" ? "active" : ""}`}
          onClick={() => setActiveTab("on-chain")}
        >
          {t("onChain")}
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
                <h4>{t("symbol")}</h4>
                <p>{crypto.symbol}</p>
              </div>
              <div className="info-card">
                <h4>{t("category")}</h4>
                <p>{crypto.category}</p>
              </div>
              <div className="info-card">
                <h4>{t("founded")}</h4>
                <p>{crypto.launched}</p>
              </div>
              <div className="info-card">
                <h4>{t("founder")}</h4>
                <p>{crypto.founder}</p>
              </div>
              <div className="info-card">
                <h4>{t("consensus")}</h4>
                <p>{crypto.consensusMechanism}</p>
              </div>
              {crypto.blockTime && (
                <div className="info-card">
                  <h4>{t("blockTime")}</h4>
                  <p>{crypto.blockTime} seconds</p>
                </div>
              )}
            </div>

            <div className="supply-info">
              <h3>{t("supplyInfo")}</h3>
              <div className="supply-grid">
                <div className="supply-card">
                  <h4>{t("circulatingSupply")}</h4>
                  <p className="value">
                    {(crypto.circulatingSupply / 1e9).toFixed(2)}B
                  </p>
                  <p className="label">{crypto.symbol}</p>
                </div>
                {crypto.maxSupply && (
                  <div className="supply-card">
                    <h4>{t("maxSupply")}</h4>
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
            <h3>{t("priceMetrics")}</h3>
            {priceData ? (
              <div className="metrics-grid">
                <div className="metric-card">
                  <h4>{t("currentPrice")}</h4>
                  <p className="value">${priceData.price.toFixed(2)}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("change24h")}</h4>
                  <p
                    className={`value ${priceData.changePercent24h >= 0 ? "positive" : "negative"}`}
                  >
                    {priceData.changePercent24h >= 0 ? "+" : ""}
                    {priceData.changePercent24h.toFixed(2)}%
                  </p>
                </div>
                <div className="metric-card">
                  <h4>{t("marketCap")}</h4>
                  <p className="value">
                    ${(priceData.marketCap / 1e9).toFixed(2)}B
                  </p>
                </div>
                <div className="metric-card">
                  <h4>{t("volume24h")}</h4>
                  <p className="value">
                    ${(priceData.volume24h / 1e9).toFixed(2)}B
                  </p>
                </div>
                <div className="metric-card">
                  <h4>{t("ath")}</h4>
                  <p className="value">${priceData.ath.toFixed(2)}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("atl")}</h4>
                  <p className="value">${priceData.atl.toFixed(2)}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("marketRank")}</h4>
                  <p className="value">#{priceData.rank}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("circulatingSupply")}</h4>
                  <p className="value">
                    {(priceData.circulatingSupply / 1e9).toFixed(2)}B
                  </p>
                </div>
              </div>
            ) : (
              <p className="placeholder">{t("loadingPrice")}</p>
            )}
          </section>
        )}

        {activeTab === "pairs" && (
          <section className="pairs-section">
            <h3>{t("tradingPairs")}</h3>
            {tradingPairs.length === 0 ? (
              <p className="placeholder">{t("loadingPairs")}</p>
            ) : (
              <div className="pairs-table">
                <table>
                  <thead>
                    <tr>
                      <th>{t("tradingPairs")}</th>
                      <th>{t("price")}</th>
                      <th>{t("volume24h")}</th>
                      <th>{t("exchange")}</th>
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
            <h3>{t("exchanges")}</h3>
            <div className="exchanges-placeholder">
              <p>{t("listedCryptoExchanges")} ({crypto.symbol})</p>
              <p className="subtitle">{t("exchangeExamples")}</p>
            </div>
          </section>
        )}

        {activeTab === "charts" && (
          <section className="charts-section">
            <h3>{t("charts")}</h3>
            <div className="chart-controls">
              <button className="timeframe">1H</button>
              <button className="timeframe">24H</button>
              <button className="timeframe active">7D</button>
              <button className="timeframe">1M</button>
              <button className="timeframe">1Y</button>
              <button className="timeframe">ALL</button>
            </div>
            <div className="chart-placeholder">
              <p>{t("priceChart")}</p>
              <p className="subtitle">{t("volumeOverlay")}</p>
            </div>
          </section>
        )}

        {activeTab === "on-chain" && (
          <section className="on-chain-section">
            <h3>{t("onChainMetrics")}</h3>
            <div className="on-chain-metrics">
              <div className="metric-card">
                <h4>{t("transactionsPerDay")}</h4>
                <p className="value">-</p>
              </div>
              <div className="metric-card">
                <h4>{t("activeAddresses")}</h4>
                <p className="value">-</p>
              </div>
              <div className="metric-card">
                <h4>{t("networkFees")}</h4>
                <p className="value">-</p>
              </div>
              <div className="metric-card">
                <h4>{t("transactionVolume")}</h4>
                <p className="value">-</p>
              </div>
            </div>
            <p className="note">{t("onChainComing")}</p>
          </section>
        )}

        {activeTab === "news" && (
          <section className="news-section">
            <h3>{t("news")}</h3>
            <div className="news-placeholder">
              <p>{t("cryptoNewsComing")} ({crypto.symbol})</p>
              <p className="subtitle">{t("cryptoNewsSubtitle")}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CryptoDetail;
