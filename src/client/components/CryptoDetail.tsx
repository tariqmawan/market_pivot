import React from "react";
import type { Cryptocurrency, CryptoPrice, TradingPair } from "../../types";
import { useI18n } from "../i18n";
import LineChart from "./LineChart";
import ChartJSLine from "./ChartJSLine";

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
  const venueList = ["Binance", "Coinbase", "Kraken", "OKX", "Bybit"];
  const onChainEstimate = priceData
    ? {
        tx: Math.round(240000 + priceData.rank * 8500),
        active: Math.round(680000 / Math.max(priceData.rank, 1)),
        fees: crypto.category === "Stablecoin" ? "$0.04" : "$1.28",
        flow: `${priceData.changePercent24h >= 0 ? "+" : "-"}${Math.abs(priceData.volume24h / 1e9).toFixed(1)}B`,
      }
    : null;

  const generateSeries = (base: number, points = 50) => {
    const series: number[] = [];
    let value = base;
    for (let i = 0; i < points; i++) {
      const change = (Math.random() - 0.5) * base * 0.03;
      value = Math.max(0, value + change);
      series.push(Number(value.toFixed(2)));
    }
    return series;
  };

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

          <div className="module-feature-band">
            {["Price", "Volume", "Pairs", "Exchanges", "On-chain", "Funding", "Sentiment", "Risk score"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
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

            <div className="insight-strip">
              <div>
                <span>Token role</span>
                <strong>{crypto.category}</strong>
                <p>{crypto.description}</p>
              </div>
              <div>
                <span>Cross-market comparison</span>
                <strong>{crypto.symbol} vs NASDAQ / Gold / USD</strong>
                <p>Correlation widgets can compare crypto beta with equities, commodities, and FX.</p>
              </div>
              <div>
                <span>AI risk layer</span>
                <strong>{crypto.category === "Stablecoin" ? "Peg monitor" : "Volatility monitor"}</strong>
                <p>Rug-pull checks, scam scoring, sentiment, and cycle prediction can be layered here.</p>
              </div>
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
            <div className="exchange-list-grid">
              {venueList.map((venue, index) => (
                <div className="info-card" key={venue}>
                  <h4>{venue}</h4>
                  <p>{crypto.symbol}/USDT</p>
                  <span className="subtitle">Liquidity rank #{index + 1}</span>
                </div>
              ))}
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
            <div>
              {priceData ? (
                (window as any).Chart ? (
                  <ChartJSLine data={generateSeries(priceData.price, 60)} width={820} height={300} />
                ) : (
                  <LineChart data={generateSeries(priceData.price, 60)} width={820} height={300} />
                )
              ) : (
                <div className="chart-placeholder">
                  <p>{t("priceChart")}</p>
                </div>
              )}
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
                <p className="value">{onChainEstimate ? onChainEstimate.tx.toLocaleString() : "-"}</p>
              </div>
              <div className="metric-card">
                <h4>{t("activeAddresses")}</h4>
                <p className="value">{onChainEstimate ? onChainEstimate.active.toLocaleString() : "-"}</p>
              </div>
              <div className="metric-card">
                <h4>{t("networkFees")}</h4>
                <p className="value">{onChainEstimate?.fees ?? "-"}</p>
              </div>
              <div className="metric-card">
                <h4>{t("transactionVolume")}</h4>
                <p className="value">{onChainEstimate?.flow ?? "-"}</p>
              </div>
            </div>
            <p className="note">Designed for live wallet flows, exchange inflow/outflow, miner activity, gas monitoring, liquidation heatmaps, and funding-rate feeds.</p>
          </section>
        )}

        {activeTab === "news" && (
          <section className="news-section">
            <h3>{t("news")}</h3>
            <div className="news-card-list">
              {[
                `${crypto.name} liquidity improves across major venues`,
                `${crypto.symbol} sentiment shifts with cross-asset risk appetite`,
                `${crypto.category} tokens see rotation after macro data`,
              ].map((headline) => (
                <article className="news-mini-card" key={headline}>
                  <span>Crypto News</span>
                  <h3>{headline}</h3>
                  <p>Project updates, regulation, on-chain signals, and AI summaries can be connected here.</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CryptoDetail;
