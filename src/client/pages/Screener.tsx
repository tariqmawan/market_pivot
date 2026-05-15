import React from "react";
// i18n is used across the app, but this page uses static labels for now.

const Screener: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [exchange, setExchange] = React.useState("All");
  const [minChange, setMinChange] = React.useState<string>("0");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: no backend screener yet in this repo.
  };

  return (
    <div className="page">
      <div className="section-heading">
        <p className="eyebrow">Market Screener</p>
        <h1>{"Screener"}</h1>
        <p>
          Filter by symbol, exchange, and performance thresholds. Results are placeholder until the
          screener API is connected.
        </p>
      </div>

      <section className="card" style={{ maxWidth: 980, margin: "0 auto" }}>
        <form onSubmit={handleSubmit} className="screener-form">
          <div className="form-grid">
            <label className="field">
              <span>Symbol / Company</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. AAPL, NVIDIA, TSLA"
              />
            </label>

            <label className="field">
              <span>Exchange</span>
              <select value={exchange} onChange={(e) => setExchange(e.target.value)}>
                <option value="All">All</option>
                <option value="NYSE">NYSE</option>
                <option value="NASDAQ">NASDAQ</option>
                <option value="LSE">LSE</option>
                <option value="TSE">TSE</option>
              </select>
            </label>

            <label className="field">
              <span>Min % Change (24h)</span>
              <input
                value={minChange}
                onChange={(e) => setMinChange(e.target.value)}
                type="number"
                step="0.01"
              />
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-action">
              Run Screener
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={() => {
                setQuery("");
                setExchange("All");
                setMinChange("0");
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      <section style={{ maxWidth: 980, margin: "18px auto 0" }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p className="eyebrow" style={{ margin: 0 }}>
                Results
              </p>
              <h2 style={{ marginTop: 6 }}>Matching Symbols</h2>
            </div>
            <div style={{ opacity: 0.7, fontSize: 13 }}>Demo UI</div>
          </div>

          <div style={{ marginTop: 14 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Symbol</th>
                  <th style={thStyle}>Exchange</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>24h Change</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { symbol: "AUR", exchange: "NYSE", price: 182.31, change: 3.21 },
                  { symbol: "NOVA", exchange: "NASDAQ", price: 96.77, change: -1.14 },
                  { symbol: "VECTOR", exchange: "LSE", price: 41.06, change: 2.02 },
                ].map((row) => (
                  <tr key={row.symbol}>
                    <td style={tdStyle}>{row.symbol}</td>
                    <td style={tdStyle}>{row.exchange}</td>
                    <td style={tdStyle}>${row.price.toFixed(2)}</td>
                    <td style={tdStyle}>
                      <span className={row.change >= 0 ? "positive" : "negative"}>
                        {row.change >= 0 ? "+" : ""}
                        {row.change.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  fontSize: 13,
  color: "#6b7280",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(0,0,0,0.04)",
  fontSize: 14,
};

export default Screener;

