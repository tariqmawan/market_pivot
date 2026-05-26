import React from "react";
import type { Currency, CurrencyPair } from "../../types";
import { useI18n } from "../i18n";
import LineChart from "./LineChart";

type RateRow = { toCode: string; rate: number; bid?: number; ask?: number; spread?: number; timestamp: string };
type ChartCandle = { timestamp: string; open: number; high: number; low: number; close: number; volume?: number };
type EconomicData = { currency: string; interestRate: number; inflationRate: number; gdpGrowth: number; lastUpdated: string };
type LinkedMarkets = {
  exchanges: Array<{ id: string; name: string; country: string }>;
  cryptoPairs: Array<{ pair: string; baseAsset: string; price: number; volume24h: number }>;
};
type NewsRow = { id: number; title: string; source: string; url: string; publishedAt: string; category: string };

interface CurrencyDetailProps {
  currency: Currency;
  isLoading?: boolean;
}

const CurrencyDetail: React.FC<CurrencyDetailProps> = ({
  currency,
  isLoading = false,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "rates" | "converter" | "chart" | "pairs" | "economic" | "linked" | "news"
  >("overview");
  const [convertAmount, setConvertAmount] = React.useState<string>("1");
  const [convertTo, setConvertTo] = React.useState<string>("USD");

  const [rates, setRates] = React.useState<RateRow[]>([]);
  const [pairs, setPairs] = React.useState<CurrencyPair[]>([]);
  const [economic, setEconomic] = React.useState<EconomicData | null>(null);
  const [linked, setLinked] = React.useState<LinkedMarkets | null>(null);
  const [news, setNews] = React.useState<NewsRow[]>([]);

  const [chartTimeframe, setChartTimeframe] = React.useState<"1D" | "1W" | "1M" | "1Y">("1M");
  const [chartAgainst, setChartAgainst] = React.useState<string>("USD");
  const [chartData, setChartData] = React.useState<ChartCandle[]>([]);

  const [loadingRates, setLoadingRates] = React.useState(false);
  const [loadingPairs, setLoadingPairs] = React.useState(false);
  const [loadingEconomic, setLoadingEconomic] = React.useState(false);
  const [loadingLinked, setLoadingLinked] = React.useState(false);
  const [loadingNews, setLoadingNews] = React.useState(false);
  const [loadingChart, setLoadingChart] = React.useState(false);

  const [converterRate, setConverterRate] = React.useState<number | null>(null);
  const [converterResult, setConverterResult] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!currency?.code) return;
    const code = currency.code.toUpperCase();

    setLoadingRates(true);
    fetch(`/api/currencies/${code}/rates`)
      .then((r) => r.json())
      .then((json) => setRates(json?.data?.rates ?? []))
      .catch(() => setRates([]))
      .finally(() => setLoadingRates(false));

    setLoadingPairs(true);
    fetch(`/api/currencies/${code}/pairs?limit=10`)
      .then((r) => r.json())
      .then((json) => setPairs(json?.data ?? []))
      .catch(() => setPairs([]))
      .finally(() => setLoadingPairs(false));

    setLoadingEconomic(true);
    fetch(`/api/currencies/${code}/economic-data`)
      .then((r) => r.json())
      .then((json) => setEconomic(json?.data ?? null))
      .catch(() => setEconomic(null))
      .finally(() => setLoadingEconomic(false));

    setLoadingLinked(true);
    fetch(`/api/currencies/${code}/linked-markets`)
      .then((r) => r.json())
      .then((json) => setLinked(json?.data ?? null))
      .catch(() => setLinked(null))
      .finally(() => setLoadingLinked(false));

    setLoadingNews(true);
    fetch(`/api/currencies/${code}/news?limit=10&page=1`)
      .then((r) => r.json())
      .then((json) => setNews(json?.data ?? []))
      .catch(() => setNews([]))
      .finally(() => setLoadingNews(false));
  }, [currency?.code]);

  React.useEffect(() => {
    if (!currency?.code) return;
    const code = currency.code.toUpperCase();
    setLoadingChart(true);
    fetch(`/api/currencies/${code}/chart?against=${encodeURIComponent(chartAgainst)}&timeframe=${chartTimeframe}`)
      .then((r) => r.json())
      .then((json) => setChartData(json?.data?.data ?? []))
      .catch(() => setChartData([]))
      .finally(() => setLoadingChart(false));
  }, [currency?.code, chartAgainst, chartTimeframe]);

  React.useEffect(() => {
    if (!currency?.code || !convertTo) return;
    const amount = Number(convertAmount);
    if (!Number.isFinite(amount) || amount < 0) return;

    const payload = { fromCode: currency.code, toCode: convertTo, amount };
    fetch(`/api/currencies/convert/amount`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((json) => {
        const rate = Number(json?.data?.rate ?? 0);
        const toAmount = Number(json?.data?.toAmount ?? 0);
        setConverterRate(Number.isFinite(rate) ? rate : null);
        setConverterResult(Number.isFinite(toAmount) ? toAmount : null);
      })
      .catch(() => {
        setConverterRate(null);
        setConverterResult(null);
      });
  }, [currency?.code, convertTo, convertAmount]);

  return (
    <div className="currency-detail">
      {/* 1. Currency Overview Header */}
      <section className="overview-header">
        <div className="currency-info">
          <div className="currency-header">
            <img src={currency.logo} alt={currency.name} className="logo" />
            <div className="info">
              <h1>{currency.name}</h1>
              <p className="code">{currency.symbol} ({currency.code})</p>
              <p className="country">
                {currency.country} • {currency.region}
              </p>
              <p className="description">{currency.description}</p>
            </div>
          </div>

          <div className="key-metrics">
            <div className="metric">
              <label>{t("currencyType")}</label>
              <p className="value">{currency.type}</p>
            </div>
            <div className="metric">
              <label>{t("centralBank")}</label>
              <p className="value">{currency.centralBank}</p>
            </div>
            {exchangeRates["USD"] && (
              <div className="metric">
                <label>vs USD</label>
                <p className="value">1 {currency.code} = {exchangeRates["USD"].toFixed(4)} USD</p>
              </div>
            )}
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
          className={`tab ${activeTab === "rates" ? "active" : ""}`}
          onClick={() => setActiveTab("rates")}
        >
          {t("exchangeRates")}
        </button>
        <button
          className={`tab ${activeTab === "converter" ? "active" : ""}`}
          onClick={() => setActiveTab("converter")}
        >
          {t("converter")}
        </button>
        <button
          className={`tab ${activeTab === "chart" ? "active" : ""}`}
          onClick={() => setActiveTab("chart")}
        >
          Chart
        </button>
        <button
          className={`tab ${activeTab === "pairs" ? "active" : ""}`}
          onClick={() => setActiveTab("pairs")}
        >
          {t("popularPairs")}
        </button>
        <button
          className={`tab ${activeTab === "economic" ? "active" : ""}`}
          onClick={() => setActiveTab("economic")}
        >
          {t("economicData")}
        </button>
        <button
          className={`tab ${activeTab === "linked" ? "active" : ""}`}
          onClick={() => setActiveTab("linked")}
        >
          Linked markets
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
                <h4>{t("code")}</h4>
                <p>{currency.code}</p>
              </div>
              <div className="info-card">
                <h4>{t("symbol")}</h4>
                <p>{currency.symbol}</p>
              </div>
              <div className="info-card">
                <h4>{t("country")}</h4>
                <p>{currency.country}</p>
              </div>
              <div className="info-card">
                <h4>{t("region")}</h4>
                <p>{currency.region}</p>
              </div>
              <div className="info-card">
                <h4>{t("type")}</h4>
                <p>{currency.type}</p>
              </div>
              <div className="info-card">
                <h4>{t("centralBank")}</h4>
                <p>{currency.centralBank}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "rates" && (
          <section className="rates-section">
            <h3>{t("exchangeRates")}</h3>
            <div className="rates-table">
              <table>
                <thead>
                  <tr>
                    <th>{t("currencies")}</th>
                    <th>{t("rate")}</th>
                    <th>{t("bid")}</th>
                    <th>{t("ask")}</th>
                    <th>{t("spread")}</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.map((row) => (
                    <tr key={row.toCode}>
                      <td>{row.toCode}</td>
                      <td>{Number(row.rate).toFixed(4)}</td>
                      <td>{row.bid != null ? Number(row.bid).toFixed(4) : "-"}</td>
                      <td>{row.ask != null ? Number(row.ask).toFixed(4) : "-"}</td>
                      <td>{row.spread != null ? Number(row.spread).toFixed(4) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loadingRates && <p className="placeholder">{t("loadingRates")}</p>}
              {!loadingRates && rates.length === 0 && (
                <p className="placeholder">{t("loadingRates")}</p>
              )}
            </div>
          </section>
        )}

        {activeTab === "converter" && (
          <section className="converter-section">
            <h3>{t("converter")}</h3>
            <div className="converter-box">
              <div className="converter-input-group">
                <label>{t("from")}</label>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  placeholder={t("amountPlaceholder")}
                />
                <span className="currency-code">{currency.code}</span>
              </div>

              <div className="converter-operator">
                <span>→</span>
              </div>

              <div className="converter-input-group">
                <label>{t("to")}</label>
                <select
                  value={convertTo}
                  onChange={(e) => setConvertTo(e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="AUD">AUD</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>

            <div className="converter-result">
              <p className="result-text">
                1 {currency.code} = {converterRate != null ? converterRate.toFixed(6) : "—"} {convertTo}
              </p>
              <p className="amount-text">
                {convertAmount} {currency.code} = {converterResult != null ? converterResult.toFixed(4) : "—"} {convertTo}
              </p>
            </div>
          </section>
        )}

        {activeTab === "chart" && (
          <section className="pairs-section">
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <h3 style={{ margin: 0 }}>Historical chart</h3>
              <select value={chartTimeframe} onChange={(e) => setChartTimeframe(e.target.value as any)}>
                <option value="1D">1D</option>
                <option value="1W">1W</option>
                <option value="1M">1M</option>
                <option value="1Y">1Y</option>
              </select>
              <select value={chartAgainst} onChange={(e) => setChartAgainst(e.target.value)}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="JPY">JPY</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            {loadingChart ? (
              <p className="placeholder">Loading chart…</p>
            ) : chartData.length ? (
              <LineChart data={chartData.map((c) => Number(c.close))} width={860} height={260} />
            ) : (
              <p className="placeholder">No chart data yet for {currency.code}/{chartAgainst} ({chartTimeframe}).</p>
            )}
          </section>
        )}

        {activeTab === "pairs" && (
          <section className="pairs-section">
            <h3>{t("popularPairs")}</h3>
            <div className="pairs-list">
              {loadingPairs ? (
                <p className="placeholder">{t("loadingPairs")}</p>
              ) : pairs.length === 0 ? (
                <p className="placeholder">{t("loadingPairs")}</p>
              ) : (
                pairs.map((pair) => (
                  <div key={pair.pair} className="pair-card">
                    <div className="pair-header">
                      <h4>{pair.pair}</h4>
                      <span className="rate">{Number(pair.rate).toFixed(4)}</span>
                    </div>
                    <div className="pair-details">
                      <div className="detail">
                        <label>{t("change24h")}</label>
                        <span
                          className={`value ${pair.change24h >= 0 ? "positive" : "negative"}`}
                        >
                          {pair.change24h >= 0 ? "+" : ""}{pair.change24h.toFixed(2)}%
                        </span>
                      </div>
                      <div className="detail">
                        <label>52w High</label>
                        <span className="value">{pair.high52w.toFixed(4)}</span>
                      </div>
                      <div className="detail">
                        <label>52w Low</label>
                        <span className="value">{pair.low52w.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === "economic" && (
          <section className="economic-section">
            <h3>{t("economicIndicators")}</h3>
            <div className="economic-indicators">
              <div className="indicator-card">
                <h4>{t("interestRate")}</h4>
                <p className="value">{loadingEconomic ? "—" : `${economic?.interestRate ?? 0}%`}</p>
                <p className="last-updated">{loadingEconomic ? t("dataLoading") : `Updated: ${new Date(economic?.lastUpdated ?? Date.now()).toLocaleDateString()}`}</p>
              </div>
              <div className="indicator-card">
                <h4>{t("inflationRate")}</h4>
                <p className="value">{loadingEconomic ? "—" : `${economic?.inflationRate ?? 0}%`}</p>
                <p className="last-updated">{loadingEconomic ? t("dataLoading") : `Updated: ${new Date(economic?.lastUpdated ?? Date.now()).toLocaleDateString()}`}</p>
              </div>
              <div className="indicator-card">
                <h4>{t("gdpGrowth")}</h4>
                <p className="value">{loadingEconomic ? "—" : `${economic?.gdpGrowth ?? 0}%`}</p>
                <p className="last-updated">{loadingEconomic ? t("dataLoading") : `Updated: ${new Date(economic?.lastUpdated ?? Date.now()).toLocaleDateString()}`}</p>
              </div>
              <div className="indicator-card">
                <h4>{t("employment")}</h4>
                <p className="value">-</p>
                <p className="last-updated">{t("dataLoading")}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "linked" && (
          <section className="news-section">
            <h3>Linked markets</h3>
            {loadingLinked ? (
              <p className="placeholder">Loading…</p>
            ) : (
              <>
                <div className="info-grid" style={{ marginBottom: 18 }}>
                  <div className="info-card">
                    <h4>Linked exchanges</h4>
                    <p>{linked?.exchanges?.length ?? 0}</p>
                  </div>
                  <div className="info-card">
                    <h4>Crypto quote pairs</h4>
                    <p>{linked?.cryptoPairs?.length ?? 0}</p>
                  </div>
                </div>

                <div className="rates-table">
                  <h4 style={{ marginTop: 0 }}>Exchanges using {currency.code}</h4>
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Name</th><th>Country</th></tr>
                    </thead>
                    <tbody>
                      {(linked?.exchanges ?? []).map((ex) => (
                        <tr key={ex.id}><td>{ex.id}</td><td>{ex.name}</td><td>{ex.country}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rates-table" style={{ marginTop: 18 }}>
                  <h4 style={{ marginTop: 0 }}>Crypto pairs quoting {currency.code}</h4>
                  <table>
                    <thead>
                      <tr><th>Pair</th><th>Price</th><th>Volume 24h</th></tr>
                    </thead>
                    <tbody>
                      {(linked?.cryptoPairs ?? []).map((p) => (
                        <tr key={p.pair}><td>{p.pair}</td><td>{Number(p.price).toFixed(6)}</td><td>{Number(p.volume24h).toLocaleString()}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        )}

        {activeTab === "news" && (
          <section className="news-section">
            <h3>{t("economicNews")}</h3>
            {loadingNews ? (
              <p className="placeholder">Loading…</p>
            ) : news.length ? (
              <div className="pairs-list">
                {news.map((n) => (
                  <a key={n.id} className="pair-card" href={n.url} target="_blank" rel="noreferrer">
                    <div className="pair-header">
                      <h4 style={{ margin: 0 }}>{n.title}</h4>
                      <span className="rate">{n.source}</span>
                    </div>
                    <div className="pair-details">
                      <div className="detail">
                        <label>Published</label>
                        <span className="value">{new Date(n.publishedAt).toLocaleString()}</span>
                      </div>
                      <div className="detail">
                        <label>Category</label>
                        <span className="value">{n.category}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="news-placeholder">
                <p>No currency news yet ({currency.code}).</p>
                <p className="subtitle">Wire provider ingestion + tagging to populate this feed.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default CurrencyDetail;
