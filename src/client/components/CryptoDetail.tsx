import React from "react";
import type { Cryptocurrency, CryptoPrice, TradingPair } from "../../types";
import { useI18n } from "../i18n";
import LineChart from "./LineChart";
import ChartJSLine from "./ChartJSLine";
import {
  formatCompactUsd,
  formatPercent,
  formatPrice,
  formatSupply,
  formatUsd,
  toNumber,
} from "../lib/format";

interface CryptoDetailProps {
  crypto: Cryptocurrency;
  priceData?: CryptoPrice | null;
  tradingPairs?: TradingPair[];
  exchangeListings?: Array<{ exchange: string; totalVolume: number }>;
  news?: Array<{
    id?: number | string;
    title?: string;
    description?: string;
    source?: string;
    publishedAt?: string;
    url?: string;
  }>;
  isLoading?: boolean;
}

const safePrice = (data?: CryptoPrice | null): number =>
  typeof data?.price === "number" ? data.price : toNumber(data?.price);

const DetailSkeleton: React.FC = () => (
  <div className="crypto-detail skeleton">
    <div className="skeleton-block" style={{ height: 120, marginBottom: 16 }} />
    <div className="skeleton-block" style={{ height: 40, marginBottom: 24 }} />
    <div className="skeleton-block" style={{ height: 280 }} />
  </div>
);

const CryptoDetail: React.FC<CryptoDetailProps> = ({
  crypto,
  priceData,
  tradingPairs = [],
  exchangeListings = [],
  news = [],
  isLoading = false,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "price" | "pairs" | "exchanges" | "charts" | "on-chain" | "news"
  >("overview");

  const price = safePrice(priceData);
  const changePct = toNumber(priceData?.changePercent24h);
  const change24h = toNumber(priceData?.change24h);

  const chartSeries = React.useMemo(() => {
    const base = price > 0 ? price : 100;
    const series: number[] = [];
    let value = base;
    for (let i = 0; i < 50; i++) {
      const delta = (Math.random() - 0.5) * base * 0.03;
      value = Math.max(0, value + delta);
      series.push(Number(value.toFixed(2)));
    }
    return series;
  }, [price]);

  if (isLoading && !priceData) {
    return <DetailSkeleton />;
  }

  return (
    <div className="crypto-detail">
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
                <p className="price">{formatUsd(price)}</p>
                <p className={`change ${changePct >= 0 ? "positive" : "negative"}`}>
                  {changePct >= 0 ? "+" : ""}
                  {formatPrice(change24h)} ({formatPercent(changePct)})
                </p>
              </div>

              <div className="price-metrics">
                <div className="metric">
                  <label>{t("marketCap")}</label>
                  <p className="value">{formatCompactUsd(priceData.marketCap)}</p>
                </div>
                <div className="metric">
                  <label>{t("volume24h")}</label>
                  <p className="value">{formatCompactUsd(priceData.volume24h)}</p>
                </div>
                <div className="metric">
                  <label>{t("rank")}</label>
                  <p className="value">#{toNumber(priceData.rank) || "—"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <nav className="tab-navigation">
        {(
          [
            ["overview", t("overview")],
            ["price", t("priceMetrics")],
            ["pairs", t("tradingPairs")],
            ["exchanges", t("exchanges")],
            ["charts", t("charts")],
            ["on-chain", t("onChain")],
            ["news", t("news")],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`tab ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

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
              {crypto.blockTime != null && (
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
                  <p className="value">{formatSupply(crypto.circulatingSupply)}</p>
                  <p className="label">{crypto.symbol}</p>
                </div>
                {crypto.maxSupply != null && (
                  <div className="supply-card">
                    <h4>{t("maxSupply")}</h4>
                    <p className="value">{formatSupply(crypto.maxSupply)}</p>
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
                  <p className="value">{formatUsd(price)}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("change24h")}</h4>
                  <p className={`value ${changePct >= 0 ? "positive" : "negative"}`}>
                    {formatPercent(changePct)}
                  </p>
                </div>
                <div className="metric-card">
                  <h4>{t("marketCap")}</h4>
                  <p className="value">{formatCompactUsd(priceData.marketCap)}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("volume24h")}</h4>
                  <p className="value">{formatCompactUsd(priceData.volume24h)}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("ath")}</h4>
                  <p className="value">{formatUsd(priceData.ath)}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("atl")}</h4>
                  <p className="value">{formatUsd(priceData.atl)}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("marketRank")}</h4>
                  <p className="value">#{toNumber(priceData.rank) || "—"}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("circulatingSupply")}</h4>
                  <p className="value">{formatSupply(priceData.circulatingSupply)}</p>
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
            {isLoading && tradingPairs.length === 0 ? (
              <p className="placeholder">{t("loadingPairs")}</p>
            ) : tradingPairs.length === 0 ? (
              <p className="placeholder">No trading pairs available.</p>
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
                      <tr key={`${pair.pair}-${pair.exchange}`}>
                        <td>{pair.pair}</td>
                        <td>{formatUsd(pair.price)}</td>
                        <td>{formatCompactUsd(pair.volume24h)}</td>
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
            {exchangeListings.length === 0 ? (
              <div className="exchanges-placeholder">
                <p>{t("listedCryptoExchanges")} ({crypto.symbol})</p>
                <p className="subtitle">{t("exchangeExamples")}</p>
              </div>
            ) : (
              <div className="exchanges-list">
                {exchangeListings.map((ex, i) => (
                  <div key={ex.exchange} className="exchange-row">
                    <span className="rank">#{i + 1}</span>
                    <span className="exchange-name">{ex.exchange}</span>
                    <span className="volume">{formatCompactUsd(ex.totalVolume)} vol</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "charts" && (
          <section className="charts-section">
            <h3>{t("charts")}</h3>
            <div className="chart-controls">
              {(["1H", "24H", "7D", "1M", "1Y", "ALL"] as const).map((tf) => (
                <button key={tf} type="button" className={`timeframe ${tf === "7D" ? "active" : ""}`}>
                  {tf}
                </button>
              ))}
            </div>
            <div>
              {priceData && price > 0 ? (
                (window as Window & { Chart?: unknown }).Chart ? (
                  <ChartJSLine data={chartSeries} width={820} height={300} />
                ) : (
                  <LineChart data={chartSeries} width={820} height={300} />
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
                <p className="value">
                  {crypto.id === "bitcoin" ? "450K" : crypto.id === "ethereum" ? "1.1M" : "—"}
                </p>
              </div>
              <div className="metric-card">
                <h4>{t("activeAddresses")}</h4>
                <p className="value">
                  {crypto.id === "bitcoin" ? "1.2M" : crypto.id === "ethereum" ? "580K" : "—"}
                </p>
              </div>
              <div className="metric-card">
                <h4>{t("networkFees")}</h4>
                <p className="value">
                  {crypto.id === "bitcoin" ? "$2.1 avg" : crypto.id === "ethereum" ? "$4.8 avg" : "—"}
                </p>
              </div>
              <div className="metric-card">
                <h4>{t("circulatingSupply")}</h4>
                <p className="value">
                  {crypto.circulatingSupply
                    ? `${formatSupply(crypto.circulatingSupply)} ${crypto.symbol}`
                    : "—"}
                </p>
              </div>
            </div>
            <p className="note">{t("onChainComing")}</p>
          </section>
        )}

        {activeTab === "news" && (
          <section className="news-section">
            <h3>{t("news")}</h3>
            {news.length === 0 ? (
              <div className="news-placeholder">
                <p>{t("cryptoNewsComing")} ({crypto.symbol})</p>
                <p className="subtitle">{t("cryptoNewsSubtitle")}</p>
              </div>
            ) : (
              <div className="news-list">
                {news.map((article) => (
                  <div key={article.id ?? article.url} className="news-card">
                    <div className="news-meta">
                      <span className="news-source">{article.source}</span>
                      <span className="news-date">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <h4 className="news-title">{article.title}</h4>
                    {article.description ? (
                      <p className="news-desc">{article.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default React.memo(CryptoDetail);
