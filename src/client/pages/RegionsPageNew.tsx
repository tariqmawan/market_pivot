import React from "react";
import { useParams, Link } from "react-router-dom";
import regionsData from "../../data/regions.json";
import exchangesData from "../../data/exchanges.json";
import currenciesData from "../../data/currencies.json";
import LineChart from "../components/LineChart";
import ChartJSLine from "../components/ChartJSLine";
import { generateSeriesForSymbol, formatSignedPercent, formatMoney } from "../lib/chartSeries";
import type { StockExchange, Currency } from "../../types";
import "./RegionsPageNew.css";

type RegionData = {
  id: string;
  name: string;
  type: string;
  summary: string;
  subRegions: Array<{ id: string; name: string; countries: string[]; majorExchanges: string[]; keyIndices: string[] }>;
  countries: string[];
  majorExchanges: string[];
  currencies: string[];
  keyIndices: string[];
  gdpGrowth: number;
  inflation: number;
  commodityImpact: string;
  tradeBalance?: string;
  calendarFocus: string[];
  sectorLeaders: string[];
  newsThemes: string[];
};

const regions = (regionsData as { regions: RegionData[] }).regions;
const exchanges = (exchangesData as { exchanges: StockExchange[] }).exchanges;
const currencies = (currenciesData as { currencies: Array<Currency & { strengthIndex?: number; interestRate?: number; inflation?: number; gdpGrowth?: number }> }).currencies;

const REGION_DETAIL_MAP: Record<string, {
  name: string;
  gdp: number;
  gdpGrowth: number;
  inflation: number;
  unemployment: number;
  interestRate: number;
  marketCap: number;
  population: string;
  majorIndices: { name: string; value: number; change: number }[];
  macroOutlook: string;
}> = {
  americas: {
    name: "Americas",
    gdp: 28000000000000,
    gdpGrowth: 2.1,
    inflation: 3.2,
    unemployment: 4.1,
    interestRate: 4.75,
    marketCap: 56000000000000,
    population: "1.0B",
    majorIndices: [
      { name: "S&P 500", value: 5420.18, change: 0.82 },
      { name: "NASDAQ", value: 17600.45, change: 1.21 },
      { name: "Dow Jones", value: 39120.50, change: 0.45 },
      { name: "TSX", value: 22100.10, change: 0.31 },
      { name: "Bovespa", value: 128500.20, change: -0.18 },
      { name: "IPC Mexico", value: 56400.85, change: 0.65 },
    ],
    macroOutlook: "US labor market resilient, services inflation sticky. Latam FX under pressure from rate differentials.",
  },
  europe: {
    name: "Europe",
    gdp: 18000000000000,
    gdpGrowth: 0.9,
    inflation: 2.5,
    unemployment: 6.2,
    interestRate: 3.5,
    marketCap: 21000000000000,
    population: "750M",
    majorIndices: [
      { name: "FTSE 100", value: 8120.30, change: 0.21 },
      { name: "DAX", value: 18500.45, change: 0.45 },
      { name: "CAC 40", value: 7650.10, change: 0.12 },
      { name: "SMI", value: 12100.50, change: 0.05 },
      { name: "IBEX 35", value: 11200.30, change: -0.18 },
      { name: "FTSE MIB", value: 33800.15, change: 0.34 },
    ],
    macroOutlook: "ECB data dependent, services inflation moderating. Industrial demand soft; banks benefiting from NIMs.",
  },
  "asia-pacific": {
    name: "Asia Pacific",
    gdp: 25000000000000,
    gdpGrowth: 4.5,
    inflation: 2.4,
    unemployment: 3.8,
    interestRate: 1.5,
    marketCap: 22000000000000,
    population: "4.5B",
    majorIndices: [
      { name: "Nikkei 225", value: 39800.20, change: 0.85 },
      { name: "Hang Seng", value: 19500.30, change: 1.45 },
      { name: "Shanghai", value: 3120.45, change: 0.35 },
      { name: "KOSPI", value: 2780.10, change: 0.62 },
      { name: "ASX 200", value: 7860.50, change: -0.21 },
      { name: "Sensex", value: 76500.85, change: 0.78 },
    ],
    macroOutlook: "China stimulus uncertainty, Japan rate normalization, India capex cycle, semiconductor capex rebound.",
  },
  "middle-east": {
    name: "Middle East",
    gdp: 3500000000000,
    gdpGrowth: 2.8,
    inflation: 2.3,
    unemployment: 5.5,
    interestRate: 5.0,
    marketCap: 4500000000000,
    population: "450M",
    majorIndices: [
      { name: "Tadawul", value: 12100.50, change: 0.45 },
      { name: "DFM", value: 4250.30, change: 0.85 },
      { name: "ADX", value: 9680.45, change: 0.21 },
      { name: "QE", value: 10500.20, change: -0.34 },
    ],
    macroOutlook: "Oil price stability supports GCC fiscal balances, sovereign diversification continues, Israel-Iran tensions monitored.",
  },
  africa: {
    name: "Africa",
    gdp: 2200000000000,
    gdpGrowth: 3.5,
    inflation: 8.2,
    unemployment: 8.0,
    interestRate: 7.5,
    marketCap: 1800000000000,
    population: "1.4B",
    majorIndices: [
      { name: "JSE All Share", value: 82500.40, change: 0.32 },
      { name: "NSE All Share", value: 105000.20, change: 0.85 },
      { name: "Egypt EGX30", value: 31200.50, change: 1.20 },
      { name: "Casablanca", value: 13800.30, change: 0.45 },
    ],
    macroOutlook: "EM growth divergence, FX pressure on ZAR/EGP, mining and resources supporting South Africa, fintech expansion in Nigeria/Kenya.",
  },
  "latin-america": {
    name: "Latin America",
    gdp: 6500000000000,
    gdpGrowth: 2.3,
    inflation: 4.5,
    unemployment: 7.2,
    interestRate: 9.5,
    marketCap: 4500000000000,
    population: "660M",
    majorIndices: [
      { name: "Bovespa", value: 128500.20, change: -0.18 },
      { name: "IPC Mexico", value: 56400.85, change: 0.65 },
      { name: "IPSA Chile", value: 6850.30, change: 0.42 },
      { name: "Merval", value: 1650000.50, change: 2.10 },
    ],
    macroOutlook: "Brazil Selic on hold, Mexico election cycle, Argentina reforms watched, copper and soy exports robust.",
  },
};

const RegionsPage: React.FC = () => {
  const { regionId } = useParams();
  const region = regions.find((r) => r.id.toLowerCase() === (regionId ?? "").toLowerCase());
  const detail = region ? REGION_DETAIL_MAP[region.id] : null;

  if (!region || !detail) {
    return (
      <div className="page regions-list">
        <section className="coverage-hero">
          <div>
            <p className="eyebrow">Global Markets</p>
            <h1>Regional Intelligence</h1>
            <p>Regional indices, GDP, inflation, unemployment, interest rates, market performance, macro outlook, economic calendar, heatmap, regional news, and country breakdown across six global regions.</p>
          </div>
          <div className="metric-strip">
            <div className="metric-tile"><span>Regions</span><strong>{regions.length}</strong></div>
            <div className="metric-tile"><span>Countries</span><strong>{regions.reduce((s, r) => s + r.countries.length, 0)}</strong></div>
            <div className="metric-tile"><span>Exchanges</span><strong>{exchanges.length}</strong></div>
          </div>
        </section>

        <section className="regions-list-grid">
          {regions.map((r) => {
            const det = REGION_DETAIL_MAP[r.id];
            return (
              <Link key={r.id} to={`/regions/${r.id}`} className="region-card">
                <div className="region-card-header">
                  <h3>{r.name}</h3>
                  <span className="region-group">{r.type}</span>
                </div>
                <p className="region-summary">{r.summary}</p>
                <div className="region-card-stats">
                  <div><span>GDP Growth</span><strong>{r.gdpGrowth.toFixed(1)}%</strong></div>
                  <div><span>Inflation</span><strong>{r.inflation.toFixed(1)}%</strong></div>
                  <div><span>Countries</span><strong>{r.countries.length}</strong></div>
                </div>
                <div className="region-card-footer">
                  {r.currencies.slice(0, 4).map((c) => <span key={c} className="mini-pill">{c}</span>)}
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    );
  }

  const regionExchanges = exchanges.filter((ex) => ex.region === region.name).slice(0, 8);
  const regionCurrencies = currencies.filter((c) => c.region.toLowerCase().includes(region.id.toLowerCase()) || (region.id === "asia-pacific" && (c.region === "Asia" || c.region === "Oceania")) || (region.id === "europe" && c.region === "Europe") || (region.id === "middle-east" && (c.region === "Middle East" || c.code === "SAR" || c.code === "AED")) || (region.id === "africa" && (c.region === "Africa" || c.code === "ZAR" || c.code === "EGP"))).slice(0, 6);

  return (
    <div className="page region-detail">
      <section className="coverage-hero region-hero">
        <div>
          <Link to="/regions" className="back-link">← All Regions</Link>
          <p className="eyebrow">{region.type} • {region.countries.length} countries</p>
          <h1>{detail.name}</h1>
          <p>{region.summary}</p>
        </div>
        <div className="metric-strip region-metrics">
          <div className="metric-tile"><span>GDP</span><strong>{formatMoney(detail.gdp)}</strong></div>
          <div className="metric-tile"><span>GDP Growth</span><strong className="positive">{detail.gdpGrowth.toFixed(1)}%</strong></div>
          <div className="metric-tile"><span>Inflation</span><strong>{detail.inflation.toFixed(1)}%</strong></div>
          <div className="metric-tile"><span>Population</span><strong>{detail.population}</strong></div>
        </div>
      </section>

      <section className="region-tabs-section">
        <h2>Regional Indices</h2>
        <div className="indices-grid">
          {detail.majorIndices.map((idx) => (
            <div key={idx.name} className="index-card">
              <div className="index-card-header">
                <h4>{idx.name}</h4>
                <em className={idx.change >= 0 ? "positive" : "negative"}>
                  {formatSignedPercent(idx.change)}
                </em>
              </div>
              <div className="index-value">{idx.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              <div className="index-mini-chart">
                {window.Chart ? (
                  <ChartJSLine
                    data={generateSeriesForSymbol(idx.name, idx.value, "1M").slice(0, 20)}
                    width={240}
                    height={60}
                    color={idx.change >= 0 ? "#10b981" : "#ef4444"}
                  />
                ) : (
                  <LineChart
                    data={generateSeriesForSymbol(idx.name, idx.value, "1M").slice(0, 20)}
                    width={240}
                    height={60}
                    color={idx.change >= 0 ? "#10b981" : "#ef4444"}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="region-macro-grid">
        <div className="macro-card">
          <h3>Macro Snapshot</h3>
          <div className="macro-stats">
            <div><span>GDP</span><strong>{formatMoney(detail.gdp)}</strong></div>
            <div><span>GDP Growth</span><strong className={detail.gdpGrowth >= 0 ? "positive" : "negative"}>{detail.gdpGrowth.toFixed(1)}%</strong></div>
            <div><span>Inflation</span><strong className={detail.inflation > 3 ? "negative" : "neutral"}>{detail.inflation.toFixed(1)}%</strong></div>
            <div><span>Unemployment</span><strong>{detail.unemployment.toFixed(1)}%</strong></div>
            <div><span>Interest Rate</span><strong>{detail.interestRate.toFixed(2)}%</strong></div>
            <div><span>Market Cap</span><strong>{formatMoney(detail.marketCap)}</strong></div>
          </div>
          <p className="macro-outlook">{detail.macroOutlook}</p>
        </div>
        <div className="macro-card">
          <h3>Market Performance</h3>
          <div className="performance-grid">
            {["1D", "1W", "1M", "3M", "YTD", "1Y"].map((p, i) => {
              const value = ((i * 17 + 11) % 200) / 10 - 5;
              return (
                <div key={p} className="performance-card">
                  <span>{p}</span>
                  <strong className={value >= 0 ? "positive" : "negative"}>{formatSignedPercent(value)}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="region-row-grid">
        <div className="region-card-block">
          <h3>Major Exchanges</h3>
          <div className="exchanges-list">
            {regionExchanges.length > 0 ? regionExchanges.map((ex) => (
              <Link key={ex.id} to={`/stocks/${ex.id}`} className="exchange-row">
                <div>
                  <strong>{ex.name}</strong>
                  <span>{ex.country} • {ex.currency}</span>
                </div>
                <span className="exchange-mc">{formatMoney(ex.marketCap)}</span>
              </Link>
            )) : region.majorExchanges.map((ex) => (
              <Link key={ex} to={`/stocks/${ex}`} className="exchange-row">
                <div><strong>{ex}</strong><span>Major exchange</span></div>
              </Link>
            ))}
          </div>
        </div>
        <div className="region-card-block">
          <h3>Currencies</h3>
          <div className="exchanges-list">
            {regionCurrencies.length > 0 ? regionCurrencies.map((c) => (
              <Link key={c.code} to={`/currencies/${c.code}`} className="exchange-row">
                <div>
                  <strong>{c.code} - {c.name}</strong>
                  <span>{c.centralBank}</span>
                </div>
                <span className="exchange-mc">Rate {c.strengthIndex?.toFixed(1) ?? "—"}</span>
              </Link>
            )) : region.currencies.map((c) => (
              <Link key={c} to={`/currencies/${c}`} className="exchange-row">
                <div><strong>{c}</strong><span>Major currency</span></div>
              </Link>
            ))}
          </div>
        </div>
        <div className="region-card-block">
          <h3>Country Breakdown</h3>
          <div className="country-list">
            {region.countries.map((country, i) => {
              const gdpShare = 30 + (i * 7 + 13) % 50;
              return (
                <div key={country} className="country-row">
                  <span className="country-name">{country}</span>
                  <div className="country-bar">
                    <div className="country-fill" style={{ width: `${gdpShare}%` }} />
                  </div>
                  <span className="country-share">{gdpShare}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="region-row-grid">
        <div className="region-card-block">
          <h3>Economic Calendar — {detail.name}</h3>
          <div className="econ-events">
            {[
              { time: "08:30", event: "CPI release", impact: "High" },
              { time: "10:00", event: "Central bank decision", impact: "High" },
              { time: "12:00", event: "PMI Manufacturing", impact: "Medium" },
              { time: "15:00", event: "Trade balance", impact: "Medium" },
            ].map((e, i) => (
              <div key={i} className={`region-event impact-${e.impact.toLowerCase()}`}>
                <span className="region-event-time">{e.time}</span>
                <span className="region-event-name">{e.event}</span>
                <span className={`region-event-impact ${e.impact.toLowerCase()}`}>{e.impact}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="region-card-block">
          <h3>Sector Leaders</h3>
          <div className="exchanges-list">
            {region.sectorLeaders.map((s) => (
              <div key={s} className="sector-row">
                <span className="sector-bullet">●</span>
                <strong>{s}</strong>
                <em>{(Math.random() * 8 - 1).toFixed(2)}%</em>
              </div>
            ))}
          </div>
        </div>
        <div className="region-card-block">
          <h3>Heatmap</h3>
          <div className="region-heatmap">
            {region.currencies.slice(0, 8).map((c, i) => {
              const value = ((i * 13 + 7) % 200) / 10 - 5;
              const intensity = Math.min(1, Math.abs(value) / 2);
              const bg = value > 0
                ? `rgba(16, 185, 129, ${0.3 + intensity * 0.5})`
                : `rgba(239, 68, 68, ${0.3 + intensity * 0.5})`;
              return (
                <div key={c} className="region-heat-cell" style={{ backgroundColor: bg }}>
                  <span>{c}</span>
                  <em>{formatSignedPercent(value)}</em>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="region-card-block">
        <h3>Regional News</h3>
        <div className="forex-news-grid">
          {[
            { title: `${detail.name} central bank signals data-dependent path`, tag: "Policy", source: "Reuters" },
            { title: `${region.currencies[0] ?? "USD"} strengthens on rate differential`, tag: "FX", source: "Bloomberg" },
            { title: `Commodity exports drive ${detail.name} trade surplus`, tag: "Trade", source: "FT" },
            { title: `${region.sectorLeaders[0]} sector leads regional gains`, tag: "Markets", source: "WSJ" },
            { title: `Inflation pressures ease in ${region.countries[0]}`, tag: "Macro", source: "Bloomberg" },
            { title: `${region.majorExchanges[0] ?? "Main exchange"} posts record volumes`, tag: "Markets", source: "CNBC" },
          ].map((n, i) => (
            <article key={i} className="forex-news-card">
              <span className="news-tag">{n.tag}</span>
              <h4>{n.title}</h4>
              <div className="news-meta"><span>{n.source}</span><span>{i + 1}h ago</span></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RegionsPage;
