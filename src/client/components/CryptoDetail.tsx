import React from "react";
import type { Cryptocurrency, TradingPair } from "../../types";
import { useI18n } from "../i18n";
import LineChart from "./LineChart";

interface CryptoDetailProps {
  crypto: Cryptocurrency;
  isLoading?: boolean;
}

type CoinGeckoMarket = {
  current_price: { usd: number };
  market_cap: { usd: number };
  total_volume: { usd: number };
  price_change_percentage_24h: number;
  ath: { usd: number };
  atl: { usd: number };
  circulating_supply: number;
  max_supply: number | null;
  market_cap_rank: number;
};

type MarketMover = {
  id?: string;
  symbol?: string;
  name?: string;
  price?: number;
  changePercent24h?: number;
  marketCap?: number;
  volume24h?: number;
};

const formatUsd = (value: number) => {
  if (!Number.isFinite(value)) return "-";
  return value.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
};

const formatCompact = (value: number) => {
  if (!Number.isFinite(value)) return "-";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return formatUsd(value);
};

const mapRangeToDays = (tf: "1H" | "24H" | "7D" | "1M" | "ALL") => {
  if (tf === "1H") return "1";
  if (tf === "24H") return "1";
  if (tf === "7D") return "7";
  if (tf === "1M") return "30";
  return "max";
};

const CryptoDetail: React.FC<CryptoDetailProps> = ({ crypto, isLoading = false }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "price" | "pairs" | "exchanges" | "charts" | "on-chain" | "news"
  >("overview");
  const [chartRange, setChartRange] = React.useState<"1H" | "24H" | "7D" | "1M" | "ALL">("7D");

  const [coinGeckoMarket, setCoinGeckoMarket] = React.useState<CoinGeckoMarket | null>(null);
  const [chartSeries, setChartSeries] = React.useState<number[]>([]);
  const [pairs, setPairs] = React.useState<TradingPair[]>([]);
  const [exchanges, setExchanges] = React.useState<Array<{ exchange: string; totalVolume: number }>>([]);
  const [onChain, setOnChain] = React.useState<{ note?: string } | null>(null);
  const [news, setNews] = React.useState<Array<{ id: number; title: string; source: string; url: string; publishedAt: string }>>([]);
  const [marketOverview, setMarketOverview] = React.useState<{
    gainers: MarketMover[];
    losers: MarketMover[];
    trending: MarketMover[];
  } | null>(null);

  const [marketLoading, setMarketLoading] = React.useState(true);
  const [chartLoading, setChartLoading] = React.useState(false);

  React.useEffect(() => {
    const id = crypto.id;
    const lowerId = id.toLowerCase();
    setMarketLoading(true);

    Promise.all([
      fetch(`/api/cryptos/${encodeURIComponent(id)}/pairs?limit=15`).then((r) => r.json()).catch(() => ({ data: [] })),
      fetch(`/api/cryptos/${encodeURIComponent(id)}/exchanges?limit=10`).then((r) => r.json()).catch(() => ({ data: [] })),
      fetch(`/api/cryptos/${encodeURIComponent(id)}/on-chain`).then((r) => r.json()).catch(() => ({ data: null })),
      fetch(`/api/cryptos/${encodeURIComponent(id)}/news?limit=8&page=1`).then((r) => r.json()).catch(() => ({ data: [] })),
      fetch(`/api/cryptos/market/overview`).then((r) => r.json()).catch(() => ({ data: { gainers: [], losers: [], trending: [] } })),
      fetch(`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(lowerId)}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`)
        .then((r) => r.json())
        .catch(() => null),
    ])
      .then(([pairsJson, exchJson, onChainJson, newsJson, moversJson, cgJson]) => {
        setPairs(pairsJson?.data ?? []);
        setExchanges((exchJson?.data ?? []).map((row: any) => ({ exchange: row.exchange, totalVolume: Number(row.totalVolume ?? 0) })));
        setOnChain(onChainJson?.data ?? null);
        setNews(newsJson?.data ?? []);
        setMarketOverview({
          gainers: moversJson?.data?.gainers ?? [],
          losers: moversJson?.data?.losers ?? [],
          trending: moversJson?.data?.trending ?? [],
        });
        setCoinGeckoMarket(cgJson?.market_data ?? null);
      })
      .finally(() => setMarketLoading(false));
  }, [crypto.id]);

  React.useEffect(() => {
    const id = crypto.id.toLowerCase();
    const days = mapRangeToDays(chartRange);
    setChartLoading(true);
    fetch(`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=${days}&interval=${days === "1" ? "hourly" : "daily"}`)
      .then((r) => r.json())
      .then((json) => {
        const prices = (json?.prices ?? []).map((p: [number, number]) => Number(p[1])).filter((v: number) => Number.isFinite(v));
        setChartSeries(prices);
      })
      .catch(() => setChartSeries([]))
      .finally(() => setChartLoading(false));
  }, [crypto.id, chartRange]);

  const rank = coinGeckoMarket?.market_cap_rank ?? "-";
  const price = coinGeckoMarket?.current_price?.usd ?? 0;
  const change24h = coinGeckoMarket?.price_change_percentage_24h ?? 0;
  const marketCap = coinGeckoMarket?.market_cap?.usd ?? 0;
  const volume24h = coinGeckoMarket?.total_volume?.usd ?? 0;
  const ath = coinGeckoMarket?.ath?.usd ?? 0;
  const atl = coinGeckoMarket?.atl?.usd ?? 0;
  const circSupply = coinGeckoMarket?.circulating_supply ?? crypto.circulatingSupply ?? 0;
  const maxSupply = coinGeckoMarket?.max_supply ?? crypto.maxSupply;

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

          {!marketLoading && coinGeckoMarket && (
            <div className="price-highlight">
              <div className="price-main">
                <p className="label">{t("currentPrice")}</p>
                <p className="price">{formatUsd(price)}</p>
                <p
                  className={`change ${change24h >= 0 ? "positive" : "negative"}`}
                >
                  {change24h >= 0 ? "+" : ""}
                  {change24h.toFixed(2)}%
                </p>
              </div>

              <div className="price-metrics">
                <div className="metric">
                  <label>{t("marketCap")}</label>
                  <p className="value">{formatCompact(marketCap)}</p>
                </div>
                <div className="metric">
                  <label>{t("volume24h")}</label>
                  <p className="value">{formatCompact(volume24h)}</p>
                </div>
                <div className="metric">
                  <label>{t("rank")}</label>
                  <p className="value">#{rank}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

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
            <div className="info-grid" style={{ marginBottom: 16 }}>
              <div className="info-card"><h4>Top Gainers</h4><p>{marketOverview?.gainers?.length ?? 0}</p></div>
              <div className="info-card"><h4>Top Losers</h4><p>{marketOverview?.losers?.length ?? 0}</p></div>
              <div className="info-card"><h4>Trending</h4><p>{marketOverview?.trending?.length ?? 0}</p></div>
              <div className="info-card"><h4>Market Cap</h4><p>{formatCompact(marketCap)}</p></div>
            </div>

            <div className="pairs-list" style={{ marginBottom: 18 }}>
              {(marketOverview?.trending ?? []).slice(0, 5).map((m, i) => (
                <div key={`${m.symbol ?? i}`} className="pair-card">
                  <div className="pair-header">
                    <h4>{m.name ?? m.symbol ?? "Coin"}</h4>
                    <span className="rate">{formatCompact(Number(m.marketCap ?? 0))}</span>
                  </div>
                  <div className="pair-details">
                    <div className="detail"><label>24h</label><span className={`value ${Number(m.changePercent24h ?? 0) >= 0 ? "positive" : "negative"}`}>{Number(m.changePercent24h ?? 0).toFixed(2)}%</span></div>
                    <div className="detail"><label>Volume</label><span className="value">{formatCompact(Number(m.volume24h ?? 0))}</span></div>
                  </div>
                </div>
              ))}
              {marketLoading && <p className="placeholder">Loading market overview…</p>}
            </div>

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
                    {(Number(circSupply) / 1e9).toFixed(2)}B
                  </p>
                  <p className="label">{crypto.symbol}</p>
                </div>
                {maxSupply && (
                  <div className="supply-card">
                    <h4>{t("maxSupply")}</h4>
                    <p className="value">
                      {(Number(maxSupply) / 1e9).toFixed(2)}B
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
            {coinGeckoMarket ? (
              <div className="metrics-grid">
                <div className="metric-card">
                  <h4>{t("currentPrice")}</h4>
                  <p className="value">{formatUsd(price)}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("change24h")}</h4>
                  <p
                    className={`value ${change24h >= 0 ? "positive" : "negative"}`}
                  >
                    {change24h >= 0 ? "+" : ""}
                    {change24h.toFixed(2)}%
                  </p>
                </div>
                <div className="metric-card">
                  <h4>{t("marketCap")}</h4>
                  <p className="value">{formatCompact(marketCap)}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("volume24h")}</h4>
                  <p className="value">{formatCompact(volume24h)}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("ath")}</h4>
                  <p className="value">{formatUsd(ath)}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("atl")}</h4>
                  <p className="value">{formatUsd(atl)}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("marketRank")}</h4>
                  <p className="value">#{rank}</p>
                </div>
                <div className="metric-card">
                  <h4>{t("circulatingSupply")}</h4>
                  <p className="value">
                    {(Number(circSupply) / 1e9).toFixed(2)}B
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
            {pairs.length === 0 ? (
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
                    {pairs.slice(0, 10).map((pair) => (
                      <tr key={pair.pair}>
                        <td>{pair.pair}</td>
                        <td>${Number(pair.price).toFixed(4)}</td>
                        <td>
                          {formatCompact(Number(pair.volume24h))}
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
            {exchanges.length === 0 ? (
              <div className="exchanges-placeholder">
                <p>{t("listedCryptoExchanges")} ({crypto.symbol})</p>
                <p className="subtitle">No exchange listing data yet.</p>
              </div>
            ) : (
              <div className="pairs-table">
                <table>
                  <thead>
                    <tr><th>Exchange</th><th>Volume</th></tr>
                  </thead>
                  <tbody>
                    {exchanges.map((ex) => (
                      <tr key={ex.exchange}>
                        <td>{ex.exchange}</td>
                        <td>{formatCompact(ex.totalVolume)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "charts" && (
          <section className="charts-section">
            <h3>{t("charts")}</h3>
            <div className="chart-controls">
              {(["1H", "24H", "7D", "1M", "ALL"] as const).map((tf) => (
                <button
                  key={tf}
                  className={`timeframe ${chartRange === tf ? "active" : ""}`}
                  onClick={() => setChartRange(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
            <div>
              {chartLoading ? (
                <div className="chart-placeholder"><p>Loading chart…</p></div>
              ) : chartSeries.length ? (
                <LineChart data={chartSeries} width={820} height={300} />
              ) : (
                <div className="chart-placeholder">
                  <p>{t("priceChart")}</p>
                </div>
              )}
              <p className="subtitle">{t("volumeOverlay")} (CoinGecko)</p>
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
            <p className="note">{onChain?.note ?? t("onChainComing")}</p>
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
              <div className="pairs-list">
                {news.map((item) => (
                  <a key={item.id} className="pair-card" href={item.url} target="_blank" rel="noreferrer">
                    <div className="pair-header">
                      <h4>{item.title}</h4>
                      <span className="rate">{item.source}</span>
                    </div>
                    <div className="pair-details">
                      <div className="detail">
                        <label>Published</label>
                        <span className="value">{new Date(item.publishedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default CryptoDetail;
