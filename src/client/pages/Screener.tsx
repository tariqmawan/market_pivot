import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";



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
  const { t } = useI18n();
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
          <p className="eyebrow">{t("src_client_pages_screener__l44__h0")}</p>
          <h1>{t("src_client_pages_screener__l45__h1")}</h1>
          <p>
            Scan global symbols by exchange, sector, momentum, and quality score in a modern
            workspace-style view.
          </p>
        </div>
        <div className="tool-hero-panel">
          <span>{t("src_client_pages_screener__l52__h2")}</span>
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
              <p className="eyebrow">{t("src_client_pages_screener__l77__h3")}</p>
              <h2>{t("src_client_pages_screener__l78__h4")}</h2>
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
              aria-label={t("src_client_pages_screener__l89__h5")}
            >
              Reset
            </button>
          </div>

          <label className="tool-field">
            <span>{t("src_client_pages_screener__l96__h7")}</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("src_client_pages_screener__l97__h8")} />
          </label>

          <label className="tool-field">
            <span>{t("src_client_pages_screener__l101__h9")}</span>
            <select value={exchange} onChange={(e) => setExchange(e.target.value)}>
              <option value="All">{t("src_client_pages_screener__l103__h10")}</option>
              <option value="NYSE">{t("src_client_pages_screener__l104__h11")}</option>
              <option value="NASDAQ">{t("src_client_pages_screener__l105__h12")}</option>
              <option value="LSE">{t("src_client_pages_screener__l106__h13")}</option>
              <option value="TSE">{t("src_client_pages_screener__l107__h14")}</option>
            </select>
          </label>

          <label className="tool-field">
            <span>{t("src_client_pages_screener__l112__h15")}</span>
            <input value={minChange} onChange={(e) => setMinChange(e.target.value)} type="number" step="0.01" />
          </label>

          <div className="tool-segmented" aria-label={t("src_client_pages_screener__l116__h16")}>
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
              <p className="eyebrow">{t("src_client_pages_screener__l133__h18")}</p>
              <h2>{t("src_client_pages_screener__l134__h19")}</h2>
            </div>
            <span className="tool-live-chip">{t("src_client_pages_screener__l136__h20")}</span>
          </div>

          <div className="tool-table-wrap">
            <table className="tool-table">
              <thead>
                <tr>
                  <th>{t("src_client_pages_screener__l143__h21")}</th>
                  <th>{t("src_client_pages_screener__l144__h22")}</th>
                  <th>{t("src_client_pages_screener__l145__h23")}</th>
                  <th>{t("src_client_pages_screener__l146__h24")}</th>
                  <th>{t("src_client_pages_screener__l147__h25")}</th>
                  <th>{t("src_client_pages_screener__l148__h26")}</th>
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
