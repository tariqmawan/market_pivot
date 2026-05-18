import React from "react";
import { Link } from "react-router-dom";

type ScreenerRow = {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  price: number;
  change: number;
  volume: string;
  score: number;
};

const rows: ScreenerRow[] = [
  { symbol: "AUR", name: "Aurora Capital", exchange: "NYSE", sector: "Financials", price: 182.31, change: 3.21, volume: "14.2M", score: 92 },
  { symbol: "NOVA", name: "Nova Systems", exchange: "NASDAQ", sector: "Technology", price: 96.77, change: -1.14, volume: "8.6M", score: 74 },
  { symbol: "VECTOR", name: "Vector Industries", exchange: "LSE", sector: "Industrials", price: 41.06, change: 2.02, volume: "5.1M", score: 86 },
  { symbol: "HELIO", name: "Helio Energy", exchange: "TSE", sector: "Energy", price: 57.48, change: 4.68, volume: "6.8M", score: 89 },
  { symbol: "QUANTA", name: "Quanta Labs", exchange: "NASDAQ", sector: "Healthcare", price: 122.84, change: 0.74, volume: "3.4M", score: 81 },
];

const sectors = ["All", "Technology", "Financials", "Industrials", "Energy", "Healthcare"];

const Screener: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [exchange, setExchange] = React.useState("All");
  const [sector, setSector] = React.useState("All");
  const [minChange, setMinChange] = React.useState<string>("0");

  const filtered = rows.filter((row) => {
    const search = `${row.symbol} ${row.name}`.toLowerCase();
    const queryOk = !query || search.includes(query.toLowerCase());
    const exchangeOk = exchange === "All" || row.exchange === exchange;
    const sectorOk = sector === "All" || row.sector === sector;
    const changeOk = row.change >= Number(minChange || 0);
    return queryOk && exchangeOk && sectorOk && changeOk;
  });

  return (
    <div className="page tool-page screener-page">
      <section className="tool-hero">
        <div>
          <p className="eyebrow">Market Screener</p>
          <h1>Discover market leaders with cleaner filters.</h1>
          <p>
            Scan global symbols by exchange, sector, momentum, and quality score in a modern
            workspace-style view.
          </p>
        </div>
        <div className="tool-hero-panel">
          <span>Matches</span>
          <strong>{filtered.length}</strong>
          <em>{exchange === "All" ? "All exchanges" : exchange}</em>
        </div>
      </section>

      <section className="tool-metric-grid">
        {[
          ["Universe", "5.2K", "Global listed names"],
          ["Momentum", "+2.1%", "Average 24h move"],
          ["Volume", "38.1M", "Screened today"],
          ["Signal", "Bullish", "Composite tilt"],
        ].map(([label, value, meta]) => (
          <div className="tool-metric" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <em>{meta}</em>
          </div>
        ))}
      </section>

      <section className="tool-layout">
        <aside className="tool-filter-card">
          <div className="tool-card-head">
            <div>
              <p className="eyebrow">Filters</p>
              <h2>Screen setup</h2>
            </div>
            <button
              type="button"
              className="tool-icon-button"
              onClick={() => {
                setQuery("");
                setExchange("All");
                setSector("All");
                setMinChange("0");
              }}
              aria-label="Reset filters"
            >
              Reset
            </button>
          </div>

          <label className="tool-field">
            <span>Symbol / Company</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="AAPL, NVIDIA, TSLA" />
          </label>

          <label className="tool-field">
            <span>Exchange</span>
            <select value={exchange} onChange={(e) => setExchange(e.target.value)}>
              <option value="All">All Exchanges</option>
              <option value="NYSE">NYSE</option>
              <option value="NASDAQ">NASDAQ</option>
              <option value="LSE">LSE</option>
              <option value="TSE">TSE</option>
            </select>
          </label>

          <label className="tool-field">
            <span>Minimum 24h Change</span>
            <input value={minChange} onChange={(e) => setMinChange(e.target.value)} type="number" step="0.01" />
          </label>

          <div className="tool-segmented" aria-label="Sector filter">
            {sectors.map((item) => (
              <button
                type="button"
                key={item}
                className={sector === item ? "active" : ""}
                onClick={() => setSector(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </aside>

        <section className="tool-results-card">
          <div className="tool-card-head">
            <div>
              <p className="eyebrow">Results</p>
              <h2>Matching Symbols</h2>
            </div>
            <span className="tool-live-chip">Demo data</span>
          </div>

          <div className="tool-table-wrap">
            <table className="tool-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Sector</th>
                  <th>Price</th>
                  <th>24h</th>
                  <th>Volume</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.symbol}>
                    <td>
                      <Link to="/dashboard" className="tool-symbol">
                        <strong>{row.symbol}</strong>
                        <span>{row.name}</span>
                      </Link>
                    </td>
                    <td>{row.sector}</td>
                    <td>${row.price.toFixed(2)}</td>
                    <td className={row.change >= 0 ? "positive" : "negative"}>
                      {row.change >= 0 ? "+" : ""}
                      {row.change.toFixed(2)}%
                    </td>
                    <td>{row.volume}</td>
                    <td>
                      <span className="tool-score">{row.score}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Screener;
