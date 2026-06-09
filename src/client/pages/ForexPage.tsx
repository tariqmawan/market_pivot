import React from "react";
import { Link, useParams } from "react-router-dom";
import currenciesData from "../../data/currencies.json";
import LineChart from "../components/LineChart";
import ChartJSLine from "../components/ChartJSLine";
import { generateSeriesForSymbol, formatSignedPercent } from "../lib/chartSeries";
import "./ForexPage.css";
import { useI18n } from "../i18n";
import { translateStatic } from "../i18n/translate";


type Currency = {
  code: string;
  name: string;
  symbol: string;
  country: string;
  countryCode: string;
  region: string;
  type: "fiat" | "commodity" | "crypto";
  centralBank: string;
  description: string;
  interestRate?: number;
  inflation?: number;
  strengthIndex?: number;
  gdpGrowth?: number;
  tradeBalance?: number;
  reserveStatus?: string;
  capitalFlows?: string;
  logo: string;
  nameKey?: string;
  countryKey?: string;
  descriptionKey?: string;
};

const currencies = (currenciesData as { currencies: Currency[] }).currencies;

const MAJOR_PAIRS = ["USD", "EUR", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD"];
const EXOTIC_PAIRS = ["USD/TRY", "USD/ZAR", "USD/MXN", "USD/SEK", "USD/SGD", "USD/HKD", "USD/INR", "USD/BRL"];
const EMPTY_VALUE = "-";

const keySlug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");
const currencyTypeKey = (value: Currency["type"]) => `forex:currencyTypes.${value}`;
const centralBankKey = (value: string) => `forex:centralBanks.${keySlug(value)}`;
const regionKey = (value: string) => `forex:regions.${keySlug(value)}`;
const valueKey = (scope: string, value: string) => `forex:${scope}.${keySlug(value)}`;
const eventTitleKey = (id: string) => `forex:events.${id}`;
const newsTitleKey = (id: string) => `forex:newsTitles.${id}`;
const impactKey = (value: string) => `forex:impacts.${value}`;

const majorRates: Record<string, number> = {
  USD: 1, EUR: 0.92, JPY: 155, GBP: 0.79, CHF: 0.91, CNY: 7.24, HKD: 7.82,
  INR: 83.5, AUD: 1.52, SGD: 1.35, KRW: 1370, CAD: 1.37, BRL: 5.12, MXN: 16.8,
  CLP: 930, SEK: 10.7, NOK: 10.9, SAR: 3.75, AED: 3.67, ZAR: 18.4, NZD: 1.65,
};

const hashString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const generateRate = (base: string, quote: string, seed: number) => {
  const baseRate = majorRates[base] ?? 1;
  const quoteRate = majorRates[quote] ?? 1;
  return quoteRate / baseRate;
};

const computeChange = (code: string) => {
  const seed = hashString(code);
  return ((seed % 200) - 100) / 50; // -2% to +2%
};

const generateCurrencySeries = (code: string, points = 30) => {
  const base = majorRates[code] ?? 1;
  return generateSeriesForSymbol(code, base, "1M").slice(0, points);
};

const getStrength = (code: string) => {
  const seed = hashString(code);
  return 60 + (seed % 80); // 60-140
};

const translateCurrencyName = (t: ReturnType<typeof useI18n>["t"], currency: Currency) =>
  translateStatic(t, currency.nameKey, currency.name);

const translateCentralBank = (t: ReturnType<typeof useI18n>["t"], centralBank: string) =>
  t(centralBankKey(centralBank), centralBank);

const translateRegion = (t: ReturnType<typeof useI18n>["t"], region: string) =>
  t(regionKey(region), region);

const ForexPage: React.FC = () => {
  const { t, language } = useI18n();
  const { code: routeCode } = useParams();
  const detailCode = routeCode?.toUpperCase();
  const detailCurrency = detailCode
    ? currencies.find((c) => c.code.toUpperCase() === detailCode)
    : undefined;

  const [activeTab, setActiveTab] = React.useState<"strength" | "majors" | "cross" | "exotic" | "central" | "calendar" | "heatmap" | "volatility">("strength");
  const [base, setBase] = React.useState<string>("USD");
  const [quote, setQuote] = React.useState<string>("EUR");
  const [amount, setAmount] = React.useState<number>(100);

  const strengthList = [...currencies]
    .filter((c) => c.type === "fiat")
    .map((c) => ({ ...c, strength: getStrength(c.code), change: computeChange(c.code) }))
    .sort((a, b) => b.strength - a.strength);

  const topMovers = [...currencies]
    .map((c) => ({ ...c, change: computeChange(c.code) }))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, 10);

  const majorPairs = ["EUR/USD", "USD/JPY", "GBP/USD", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD"].map((pair) => {
    const [b, q] = pair.split("/");
    return {
      pair,
      base: b,
      quote: q,
      rate: generateRate(b, q, hashString(pair)),
      change: computeChange(pair),
      high: generateRate(b, q, hashString(pair)) * 1.04,
      low: generateRate(b, q, hashString(pair)) * 0.96,
      volatility: 4 + (hashString(pair) % 8),
    };
  });

  const crossPairs = ["EUR/GBP", "EUR/JPY", "GBP/JPY", "AUD/JPY", "EUR/CHF", "AUD/NZD", "CAD/CHF", "EUR/AUD"].map((pair) => {
    const [b, q] = pair.split("/");
    return {
      pair, base: b, quote: q,
      rate: generateRate(b, q, hashString(pair)),
      change: computeChange(pair),
      high: generateRate(b, q, hashString(pair)) * 1.05,
      low: generateRate(b, q, hashString(pair)) * 0.95,
    };
  });

  const exoticPairsList = ["USD/TRY", "USD/ZAR", "USD/MXN", "USD/SEK", "USD/SGD", "USD/HKD", "USD/INR", "USD/BRL", "USD/CLP", "USD/NOK", "USD/AED", "USD/SAR"].map((pair) => {
    const [b, q] = pair.split("/");
    return {
      pair, base: b, quote: q,
      rate: generateRate(b, q, hashString(pair)),
      change: computeChange(pair),
      high: generateRate(b, q, hashString(pair)) * 1.06,
      low: generateRate(b, q, hashString(pair)) * 0.94,
    };
  });

  const centralBanks = currencies.filter((c) => c.type === "fiat" && c.centralBank).slice(0, 8).map((c, i) => ({
    ...c,
    nextMeeting: ["2026-07-15", "2026-07-25", "2026-08-01", "2026-08-07", "2026-08-14", "2026-08-21", "2026-09-04", "2026-09-18"][i] ?? "2026-09-30",
    rate: c.interestRate ?? 2.5,
    lastChange: i % 2 === 0 ? 0.25 : -0.25,
    inflation: c.inflation ?? 2.5,
  }));

  const econEvents = [
    { time: "08:30", currency: "USD", eventKey: "nonFarmPayrolls", impact: "High", forecast: "180K", previous: "227K" },
    { time: "10:00", currency: "EUR", eventKey: "ecbPressConference", impact: "High", forecast: EMPTY_VALUE, previous: EMPTY_VALUE },
    { time: "12:30", currency: "GBP", eventKey: "boeGovernorSpeech", impact: "Medium", forecast: EMPTY_VALUE, previous: EMPTY_VALUE },
    { time: "14:00", currency: "USD", eventKey: "fomcMinutes", impact: "High", forecast: EMPTY_VALUE, previous: EMPTY_VALUE },
    { time: "21:50", currency: "JPY", eventKey: "bojSummaryOpinions", impact: "Medium", forecast: EMPTY_VALUE, previous: EMPTY_VALUE },
    { time: "23:30", currency: "AUD", eventKey: "rbaStatement", impact: "High", forecast: EMPTY_VALUE, previous: EMPTY_VALUE },
  ];

  const volatilityData = currencies.filter((c) => c.type === "fiat").map((c) => {
    const seed = hashString(c.code);
    return { code: c.code, currency: c, volatility: 3 + (seed % 12), trend: (seed % 20) - 10 };
  }).sort((a, b) => b.volatility - a.volatility).slice(0, 10);

  const regionalPerformance = ["Americas", "Europe", "Asia", "Middle East", "Africa"].map((region) => {
    const seed = hashString(region);
    return { region, performance: ((seed % 200) - 100) / 50 };
  });

  const baseRate = majorRates[base] ?? 1;
  const quoteRate = majorRates[quote] ?? 1;
  const convertedAmount = (amount * quoteRate) / baseRate;

  // ───── Per-currency detail view (route: /forex/:code) ─────
  if (detailCurrency) {
    const detailName = translateStatic(t, detailCurrency.nameKey, detailCurrency.name);
    const detailCountry = translateStatic(t, detailCurrency.countryKey, detailCurrency.country);
    const detailDescription = translateStatic(t, detailCurrency.descriptionKey, detailCurrency.description);
    const detailBank = translateCentralBank(t, detailCurrency.centralBank);
    const detailRegion = translateRegion(t, detailCurrency.region);
    const detailType = t(currencyTypeKey(detailCurrency.type), detailCurrency.type);
    const dcRate = majorRates[detailCurrency.code] ?? 1;
    const change = computeChange(detailCurrency.code);
    const strength = getStrength(detailCurrency.code);
    const series = generateSeriesForSymbol(detailCurrency.code, dcRate, "1M");
    const ratesVsMajors = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "CNY", "INR", "BRL"]
      .filter((c) => c !== detailCurrency.code)
      .map((target) => {
        const tRate = majorRates[target] ?? 1;
        const pairCode = `${detailCurrency.code}/${target}`;
        return {
          pair: pairCode,
          target,
          rate: tRate / dcRate,
          change: computeChange(pairCode),
        };
      });
    const detailEvents = [
      { time: "08:30", eventKey: "currencyCpiRelease", impact: "High" },
      { time: "12:00", eventKey: "centralBankPolicyUpdate", impact: "High" },
      { time: "14:00", eventKey: "currencyRetailSales", impact: "Medium" },
      { time: "16:00", eventKey: "currencyTradeBalance", impact: "Medium" },
    ];

    return (
      <div className="page forex-page forex-detail">
        <section className="forex-hero-wrap">
          <div className="forex-hero-bg">
            <img src="/logos/stockmarket.jpg" alt="" aria-hidden="true" />
          </div>
          <div className="forex-hero-overlay" />
          <div className="forex-hero-body">
            <Link to="/forex" className="back-link">← {t("forex.allCurrencies")}</Link>
            <p className="eyebrow">{detailCurrency.region} • {detailCurrency.type}</p>
            <h1>{detailCurrency.code} — {detailCurrency.name}</h1>
            <p>{detailCurrency.description || `${detailCurrency.country} currency, issued by ${detailCurrency.centralBank}.`}</p>
          </div>
          <div className="forex-hero-stats">
            <div className="forex-stat-pill">
              <span>{t("forex.code")}</span>
              <strong>{detailCurrency.code}</strong>
            </div>
            <div className="forex-stat-pill">
              <span>{t("forex.rateVsUsd")}</span>
              <strong>{dcRate.toFixed(detailCurrency.code === "JPY" || detailCurrency.code === "KRW" ? 2 : 4)}</strong>
            </div>
            <div className="forex-stat-pill">
              <span>{t("forex.change24h")}</span>
              <strong className={change >= 0 ? "positive" : "negative"}>{formatSignedPercent(change)}</strong>
            </div>
            <div className="forex-stat-pill">
              <span>{t("forex.strength")}</span>
              <strong>{strength.toFixed(1)}</strong>
            </div>
          </div>
        </section>

        <section className="forex-content">
          <div className="strength-section">
            <div className="section-header-row">
              <h2>{t("forex.priceChartFor", "", { pair: `${detailCurrency.code}/USD` })}</h2>
              <p>{t("forex.monthRollingRate")}</p>
            </div>
            <div style={{ background: "var(--surface,#fff)", border: "1px solid var(--border,#e2e8f0)", borderRadius: 12, padding: "1rem" }}>
              {window.Chart ? (
                <ChartJSLine data={series} width={1100} height={260} color={change >= 0 ? "#10b981" : "#ef4444"} />
              ) : (
                <LineChart data={series} width={1100} height={260} color={change >= 0 ? "#10b981" : "#ef4444"} />
              )}
            </div>
          </div>

          <div className="pairs-section">
            <div className="section-header-row">
              <h2>{t("forex.ratesVsMajor")}</h2>
              <p>{t("forex:ratesVsMajorSubtitle", "", { code: detailCurrency.code })}</p>
            </div>
            <div className="pairs-table-wrap">
              <table className="pairs-table">
                <thead>
                  <tr>
                    <th>{t("forex.pair")}</th>
                    <th>{t("forex.rate")}</th>
                    <th>{t("forex.change24h")}</th>
                    <th>{t("forex.action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {ratesVsMajors.map((r) => (
                    <tr key={r.pair}>
                      <td><strong>{r.pair}</strong></td>
                      <td>{r.rate.toFixed(4)}</td>
                      <td className={r.change >= 0 ? "positive" : "negative"}>{formatSignedPercent(r.change)}</td>
                      <td>
                        <Link to={`/forex/${r.target}`} className="secondary-action-sm">{t("forex.viewDetails")} {r.target}</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="central-section">
            <div className="section-header-row">
              <h2>{t("forex.centralBankMacro")}</h2>
              <p>{t("forex.centralBankMacroSubtitle")}</p>
            </div>
            <div className="central-grid">
              <div className="central-card">
                <div className="central-header">
                  <div>
                    <h4>{detailCurrency.code}</h4>
                    <span>{detailBank}</span>
                  </div>
                </div>
                <div className="central-stats">
                  <div><span>{t("forex.policyRate")}</span><strong>{(detailCurrency.interestRate ?? 2.5).toFixed(2)}%</strong></div>
                  <div><span>{t("forex.inflation")}</span><strong>{(detailCurrency.inflation ?? 2.5).toFixed(1)}%</strong></div>
                  <div><span>{t("forex.gdpGrowth")}</span><strong>{(detailCurrency.gdpGrowth ?? 2.0).toFixed(1)}%</strong></div>
                  <div>
                    <span>{t("forex.realRate")}</span>
                    <strong className={(detailCurrency.interestRate ?? 2.5) - (detailCurrency.inflation ?? 2.5) > 0 ? "positive" : "negative"}>
                      {((detailCurrency.interestRate ?? 2.5) - (detailCurrency.inflation ?? 2.5)).toFixed(2)}%
                    </strong>
                  </div>
                </div>
              </div>
              <div className="central-card">
                <div className="central-header"><div><h4>{t("forex.tradeProfile")}</h4><span>{detailCountry}</span></div></div>
                <div className="central-stats">
                  <div><span>{t("forex.reserveStatus")}</span><strong>{t(valueKey("reserveStatuses", detailCurrency.reserveStatus ?? "Regional"), detailCurrency.reserveStatus ?? t("forex.regional"))}</strong></div>
                  <div><span>{t("forex.capitalFlows")}</span><strong>{t(valueKey("capitalFlowTypes", detailCurrency.capitalFlows ?? "Open"), detailCurrency.capitalFlows ?? t("forex.open"))}</strong></div>
                  <div><span>{t("forex.tradeBalance")}</span><strong>{detailCurrency.tradeBalance != null ? `${detailCurrency.tradeBalance > 0 ? "+" : ""}${detailCurrency.tradeBalance.toFixed(1)}%` : EMPTY_VALUE}</strong></div>
                  <div><span>{t("forex.region")}</span><strong>{detailRegion}</strong></div>
                </div>
              </div>
            </div>
          </div>

          <div className="calendar-section">
            <div className="section-header-row">
              <h2>{t("forex.upcomingEvents")}</h2>
              <p>{t("forex:keyDataReleasesFor", "", { code: detailCurrency.code })}</p>
            </div>
            <div className="econ-events">
              {detailEvents.map((event, i) => (
                <div key={i} className={`econ-event impact-${event.impact.toLowerCase()}`}>
                  <div className="event-time">{event.time}</div>
                  <div className="event-currency">{detailCurrency.code}</div>
                  <div className="event-info">
                    <strong>{t(eventTitleKey(event.eventKey), "", { code: detailCurrency.code, centralBank: detailBank })}</strong>
                    <div className="event-meta"><span>{t("forex.source")}: {detailBank}</span></div>
                  </div>
                  <div className={`event-impact ${event.impact.toLowerCase()}`}>{t(impactKey(event.impact), event.impact)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="forex-news">
          <h2>{detailCurrency.code} {t("forex.newsDetail")}</h2>
          <div className="forex-news-grid">
            {[
              { titleKey: change >= 0 ? "currencyStrengthensPolicy" : "currencyWeakensPolicy", source: "Reuters" },
              { titleKey: "centralBankDataDependent", source: "Bloomberg" },
              { titleKey: "currencyLiquidityRobust", source: "FT" },
              { titleKey: "currencyFairValueUpdated", source: "WSJ" },
            ].map((n, i) => (
              <article key={i} className="forex-news-card">
                <span className="news-tag">{detailCurrency.code}</span>
                <h4>{t(newsTitleKey(n.titleKey), "", { code: detailCurrency.code, centralBank: detailBank })}</h4>
                <div className="news-meta"><span>{n.source}</span><span>{t("forex:hoursAgo", "", { count: i + 1 })}</span></div>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page forex-page">
      {/* Hero */}
      <section className="forex-hero-wrap">
        <div className="forex-hero-bg">
          <img src="/logos/stockmarket.jpg" alt="" aria-hidden="true" />
        </div>
        <div className="forex-hero-overlay" />
        <div className="forex-hero-body">
          <p className="eyebrow">{t("forex.foreignExchange")}</p>
          <h1>{t("forex.globalFxIntelligence")}</h1>
          <p>{t("forex.fxSubtitle")}</p>
        </div>
        <div className="forex-hero-stats">
          <div className="forex-stat-pill">
            <span>{t("forex.trackedCurrencies")}</span>
            <strong>{currencies.length}</strong>
          </div>
          <div className="forex-stat-pill">
            <span>{t("forex.majorPairs")}</span>
            <strong>{majorPairs.length}</strong>
          </div>
          <div className="forex-stat-pill">
            <span>{t("forex.centralBankLabel")}</span>
            <strong>{centralBanks.length}</strong>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="forex-tabs">
        {[
          { id: "strength", label: t("forex.currencyStrength") },
          { id: "majors", label: t("forex.majorPairs") },
          { id: "cross", label: t("forex.crossPairs") },
          { id: "exotic", label: t("forex.exoticPairs") },
          { id: "central", label: t("forex.centralBankLabel") },
          { id: "calendar", label: t("forex.economicCalendar") },
          { id: "volatility", label: t("forex.fxVolatility") },
          { id: "heatmap", label: t("forex.heatmapTitle") },
        ].map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="forex-content">
        {activeTab === "strength" && (
          <div className="strength-section">
            <div className="section-header-row">
              <h2>{t("forex.currencyStrength")}</h2>
              <p>{t("forex.strengthSubtitle")}</p>
            </div>
            <div className="strength-grid">
              {strengthList.map((currency) => {
                const tone = currency.strength > 100 ? "strong" : currency.strength > 80 ? "neutral" : "weak";
                return (
                  <Link key={currency.code} to={`/currencies/${currency.code}`} className={`strength-card tone-${tone}`}>
                    <div className="strength-rank">
                      <span className="strength-code">{currency.code}</span>
                      <span className="strength-name">{translateCurrencyName(t, currency)}</span>
                    </div>
                    <div className="strength-bar">
                      <div className="strength-fill" style={{ width: `${Math.min(100, currency.strength)}%` }} />
                    </div>
                    <div className="strength-value">
                      <strong>{currency.strength.toFixed(1)}</strong>
                      <em className={currency.change >= 0 ? "positive" : "negative"}>
                        {formatSignedPercent(currency.change)}
                      </em>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="regional-perf">
              <h3>{t("forex.regionalPerf")}</h3>
              <div className="regional-grid">
                {regionalPerformance.map((r) => (
                  <div key={translateRegion(t, r.region)} className="regional-card">
                    <span>{translateRegion(t, r.region)}</span>
                    <strong className={r.performance >= 0 ? "positive" : "negative"}>
                      {formatSignedPercent(r.performance)}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "majors" && (
          <div className="pairs-section">
            <div className="section-header-row">
              <h2>{t("forex.majorPairsTitle")}</h2>
              <p>{t("forex.majorPairsSubtitle")}</p>
            </div>
            <div className="pairs-grid">
              {majorPairs.map((pair) => (
                <div key={pair.pair} className="pair-card">
                  <div className="pair-header">
                    <h4>{pair.pair}</h4>
                    <em className={pair.change >= 0 ? "positive" : "negative"}>
                      {formatSignedPercent(pair.change)}
                    </em>
                  </div>
                  <div className="pair-rate">{pair.rate.toFixed(4)}</div>
                  <div className="pair-mini-chart">
                    {window.Chart ? (
                      <ChartJSLine
                        data={generateSeriesForSymbol(pair.pair, pair.rate, "1M").slice(0, 20)}
                        width={280}
                        height={70}
                        color={pair.change >= 0 ? "#10b981" : "#ef4444"}
                      />
                    ) : (
                      <LineChart
                        data={generateSeriesForSymbol(pair.pair, pair.rate, "1M").slice(0, 20)}
                        width={280}
                        height={70}
                        color={pair.change >= 0 ? "#10b981" : "#ef4444"}
                      />
                    )}
                  </div>
                  <div className="pair-stats">
                    <div><span>{t("forex.high52w")}</span><strong>{pair.high.toFixed(4)}</strong></div>
                    <div><span>{t("forex.low52w")}</span><strong>{pair.low.toFixed(4)}</strong></div>
                    <div><span>{t("forex.volatility")}</span><strong>{pair.volatility.toFixed(1)}%</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "cross" && (
          <div className="pairs-section">
            <div className="section-header-row">
              <h2>{t("forex.crossPairs")}</h2>
              <p>{t("forex.crossPairsSubtitle")}</p>
            </div>
            <div className="pairs-table-wrap">
              <table className="pairs-table">
                <thead>
                  <tr>
                    <th>{t("forex.pair")}</th>
                    <th>{t("forex.rate")}</th>
                    <th>{t("forex.change24h")}</th>
                    <th>{t("forex.high52w")}</th>
                    <th>{t("forex.low52w")}</th>
                    <th>{t("forex.trend")}</th>
                  </tr>
                </thead>
                <tbody>
                  {crossPairs.map((pair) => {
                    const series = generateSeriesForSymbol(pair.pair, pair.rate, "1M").slice(0, 16);
                    return (
                      <tr key={pair.pair}>
                        <td><strong>{pair.pair}</strong></td>
                        <td>{pair.rate.toFixed(4)}</td>
                        <td className={pair.change >= 0 ? "positive" : "negative"}>
                          {formatSignedPercent(pair.change)}
                        </td>
                        <td>{pair.high.toFixed(4)}</td>
                        <td>{pair.low.toFixed(4)}</td>
                        <td>
                          <div className="mini-trend">
                            {window.Chart ? (
                              <ChartJSLine
                                data={series}
                                width={120}
                                height={30}
                                color={pair.change >= 0 ? "#10b981" : "#ef4444"}
                              />
                            ) : (
                              <LineChart
                                data={series}
                                width={120}
                                height={30}
                                color={pair.change >= 0 ? "#10b981" : "#ef4444"}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "exotic" && (
          <div className="pairs-section">
            <div className="section-header-row">
              <h2>{t("forex.exoticPairs")}</h2>
              <p>{t("forex.exoticSubtitle")}</p>
            </div>
            <div className="pairs-grid">
              {exoticPairsList.map((pair) => (
                <div key={pair.pair} className="pair-card exotic">
                  <div className="pair-header">
                    <h4>{pair.pair}</h4>
                    <em className={pair.change >= 0 ? "positive" : "negative"}>
                      {formatSignedPercent(pair.change)}
                    </em>
                  </div>
                  <div className="pair-rate">{pair.rate.toFixed(4)}</div>
                  <div className="pair-stats compact">
                    <div><span>{t("forex.high52w")}</span><strong>{pair.high.toFixed(4)}</strong></div>
                    <div><span>{t("forex.low52w")}</span><strong>{pair.low.toFixed(4)}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "central" && (
          <div className="central-section">
            <div className="section-header-row">
              <h2>{t("forex.centralBankTracker")}</h2>
              <p>{t("forex.centralBankSubtitle")}</p>
            </div>
            <div className="central-grid">
              {centralBanks.map((cb) => (
                <div key={cb.code} className="central-card">
                  <div className="central-header">
                    <div>
                      <h4>{cb.code}</h4>
                      <span>{translateCentralBank(t, cb.centralBank)}</span>
                    </div>
                    <div className={`rate-pill ${cb.lastChange >= 0 ? "positive" : "negative"}`}>
                      {cb.lastChange >= 0 ? "+" : ""}{cb.lastChange.toFixed(2)}%
                    </div>
                  </div>
                  <div className="central-stats">
                    <div><span>{t("forex.policyRate")}</span><strong>{cb.rate.toFixed(2)}%</strong></div>
                    <div><span>{t("forex.inflation")}</span><strong>{cb.inflation.toFixed(1)}%</strong></div>
                    <div><span>{t("forex.nextMeeting")}</span><strong>{new Date(cb.nextMeeting).toLocaleDateString(language, { month: "short", day: "numeric" })}</strong></div>
                    <div><span>{t("forex.realRate")}</span><strong className={(cb.rate - cb.inflation) > 0 ? "positive" : "negative"}>{(cb.rate - cb.inflation).toFixed(2)}%</strong></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rates-table-wrap">
              <h3>{t("forex.globalRateComparison")}</h3>
              <table className="rates-table">
                <thead>
                  <tr>
                    <th>{t("forex.currency")}</th>
                    <th>{t("forex.centralBank")}</th>
                    <th>{t("forex.policyRate")}</th>
                    <th>{t("forex.inflation")}</th>
                    <th>{t("forex.realRate")}</th>
                    <th>{t("forex.trend")}</th>
                  </tr>
                </thead>
                <tbody>
                  {centralBanks.map((cb) => (
                    <tr key={`r-${cb.code}`}>
                      <td><strong>{cb.code}</strong></td>
                      <td>{translateCentralBank(t, cb.centralBank)}</td>
                      <td>{cb.rate.toFixed(2)}%</td>
                      <td>{cb.inflation.toFixed(1)}%</td>
                      <td className={(cb.rate - cb.inflation) > 0 ? "positive" : "negative"}>
                        {(cb.rate - cb.inflation).toFixed(2)}%
                      </td>
                      <td>
                        <div className="rate-bar">
                          <div className={`rate-bar-fill ${cb.lastChange >= 0 ? "positive" : "negative"}`} style={{ width: `${Math.abs(cb.lastChange) * 80}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="calendar-section">
            <div className="section-header-row">
              <h2>{t("forex.economicCalendar")}</h2>
              <p>{t("forex.calendarSubtitle")}</p>
            </div>
            <div className="econ-events">
              {econEvents.map((event, i) => (
                <div key={i} className={`econ-event impact-${event.impact.toLowerCase()}`}>
                  <div className="event-time">{event.time}</div>
                  <div className="event-currency">{event.currency}</div>
                  <div className="event-info">
                    <strong>{t(eventTitleKey(event.eventKey))}</strong>
                    <div className="event-meta">
                      <span>{t("forex.forecast")}: {event.forecast}</span>
                      <span>{t("forex.previous")}: {event.previous}</span>
                    </div>
                  </div>
                  <div className={`event-impact ${event.impact.toLowerCase()}`}>{t(impactKey(event.impact), event.impact)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "volatility" && (
          <div className="volatility-section">
            <div className="section-header-row">
              <h2>{t("forex.fxVolatility")}</h2>
              <p>{t("forex.volatilitySubtitle")}</p>
            </div>
            <div className="vol-list">
              {volatilityData.map((v) => (
                <div key={v.code} className="vol-row">
                  <div className="vol-info">
                    <strong>{v.code}</strong>
                    <span>{translateCurrencyName(t, v.currency)}</span>
                  </div>
                  <div className="vol-track">
                    <div className="vol-fill" style={{ width: `${Math.min(100, v.volatility * 8)}%` }} />
                  </div>
                  <div className="vol-value">{v.volatility.toFixed(1)}%</div>
                  <div className={`vol-trend ${v.trend >= 0 ? "positive" : "negative"}`}>
                    {formatSignedPercent(v.trend / 5)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "heatmap" && (
          <div className="heatmap-section">
            <div className="section-header-row">
              <h2>{t("forex.heatmapTitle")}</h2>
              <p>{t("forex.heatmapSubtitle")}</p>
            </div>
            <div className="fx-heatmap">
              {topMovers.map((c) => {
                const intensity = Math.min(1, Math.abs(c.change) / 2);
                const bg = c.change > 0
                  ? `rgba(16, 185, 129, ${0.3 + intensity * 0.5})`
                  : `rgba(239, 68, 68, ${0.3 + intensity * 0.5})`;
                return (
                  <Link key={c.code} to={`/currencies/${c.code}`} className="fx-heat-cell" style={{ backgroundColor: bg }}>
                    <span className="heat-code">{c.code}</span>
                    <span className="heat-name">{translateCurrencyName(t, c).split(" ")[0]}</span>
                    <em>{formatSignedPercent(c.change)}</em>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Converter card */}
      <section className="forex-converter">
        <h2>{t("forex.converter")}</h2>
        <div className="converter-row">
          <div className="converter-field">
            <label>{t("forex.amount")}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={0}
            />
          </div>
          <div className="converter-field">
            <label>{t("forex.from")}</label>
            <select value={base} onChange={(e) => setBase(e.target.value)}>
              {Object.keys(majorRates).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="converter-swap">⇄</div>
          <div className="converter-field">
            <label>{t("forex.to")}</label>
            <select value={quote} onChange={(e) => setQuote(e.target.value)}>
              {Object.keys(majorRates).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="converter-result">
            <span>{t("forex.result")}</span>
            <strong>{convertedAmount.toFixed(4)} {quote}</strong>
            <em>1 {base} = {(quoteRate / baseRate).toFixed(4)} {quote}</em>
          </div>
        </div>
      </section>

      {/* News Integration */}
      <section className="forex-news">
        <h2>{t("forex.newsInsights")}</h2>
        <div className="forex-news-grid">
          {[
            { titleKey: "usdRallyPauses", source: "Reuters", tag: "USD" },
            { titleKey: "ecbDataDependent", source: "Bloomberg", tag: "EUR" },
            { titleKey: "jpyInterventionWatch", source: "Nikkei", tag: "JPY" },
            { titleKey: "gbpStickyInflation", source: "FT", tag: "GBP" },
            { titleKey: "cnyWeakerMidpoint", source: "Caixin", tag: "CNY" },
            { titleKey: "audCommodityStrength", source: "ABC News", tag: "AUD" },
          ].map((n, i) => (
            <article key={i} className="forex-news-card">
              <span className="news-tag">{n.tag}</span>
              <h4>{t(newsTitleKey(n.titleKey))}</h4>
              <div className="news-meta"><span>{n.source}</span><span>{t("forex:hoursAgo", "", { count: i + 1 })}</span></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ForexPage;
