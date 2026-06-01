import React from "react";
import { Link } from "react-router-dom";
import exchangesData from "../../data/exchanges.json";
import type { StockExchange, MarketMover } from "../../types";
import "../styles/index.css";

const exchanges = (exchangesData as any).exchanges as StockExchange[];

const formatMoney = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  return `$${value.toLocaleString()}`;
};

const formatSignedPercent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const MoverCard: React.FC<{ mover: MarketMover }> = ({ mover }) => (
  <div
    style={{
      padding: "16px",
      border: "1px solid #e2e8f0",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s",
    }}
    onMouseEnter={(e) => {
      const el = e.currentTarget as HTMLDivElement;
      el.style.borderColor = "#A27841";
      el.style.backgroundColor = "rgba(162, 120, 65, 0.05)";
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget as HTMLDivElement;
      el.style.borderColor = "#e2e8f0";
      el.style.backgroundColor = "transparent";
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
      <div>
        <strong style={{ fontSize: "16px" }}>{mover.symbol}</strong>
        <p style={{ fontSize: "12px", color: "#475569" }}>{mover.company}</p>
      </div>
      <div style={{ textAlign: "right" }}>
        <strong style={{ fontSize: "16px" }}>${mover.price.toFixed(2)}</strong>
        <em
          style={{
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 600,
            color: mover.percentChange >= 0 ? "#059669" : "#dc2626",
          }}
        >
          {formatSignedPercent(mover.percentChange)}
        </em>
      </div>
    </div>
    <div style={{ marginTop: "12px", fontSize: "12px", color: "#475569" }}>
      <span>Volume: {(mover.volume / 1e6).toFixed(0)}M | </span>
      <span>Cap: {formatMoney(mover.marketCap)}</span>
    </div>
  </div>
);

const PreMarketPage: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  // Generate mock pre-market data
  const preMarketMovers = React.useMemo(() => {
    return exchanges.slice(0, 6).map((ex, idx) => ({
      symbol: `${ex.mainIndex}.${ex.id}`,
      company: `${ex.mainIndexName} Futures`,
      price: (Math.random() * 1000 + 2000),
      change: (Math.random() * 100 - 50) / 100,
      percentChange: (Math.random() * 2 - 1),
      volume: Math.random() * 1e8,
      marketCap: ex.marketCap,
    }));
  }, []);

  const indexFutures = React.useMemo(() => {
    return [
      { name: "S&P 500 E-mini (ES)", price: 5427.50, change: 28.25, changePercent: 0.52 },
      { name: "Nasdaq-100 (NQ)", price: 17832.25, change: 142.50, changePercent: 0.81 },
      { name: "Dow Jones (YM)", price: 38524.00, change: 85.75, changePercent: 0.22 },
      { name: "Russell 2000 (RTY)", price: 2018.50, change: -5.25, changePercent: -0.26 },
    ];
  }, []);

  return (
    <div className="page intelligence-page">
      {/* Hero Section */}
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">Global Markets</p>
          <h1>Pre-Market Overview</h1>
          <p>Track index futures, pre-market movers, and overnight sentiment before regular market open.</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>US Equity Futures</span>
            <strong>↑0.52%</strong>
          </div>
          <div className="metric-tile">
            <span>Asia Session</span>
            <strong>Closed</strong>
          </div>
          <div className="metric-tile">
            <span>Europe Session</span>
            <strong>Active</strong>
          </div>
        </div>
      </section>

      {/* Index Futures Section */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">Key Benchmarks</p>
          <h2>Global Index Futures</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "12px",
          }}
        >
          {indexFutures.map((future) => (
            <div
              key={future.name}
              style={{
                padding: "16px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                backgroundColor: "#f8fafc",
              }}
            >
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>
                {future.name}
              </p>
              <strong style={{ fontSize: "18px" }}>{future.price.toFixed(2)}</strong>
              <em
                style={{
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  color: future.changePercent >= 0 ? "#059669" : "#dc2626",
                  display: "block",
                  marginTop: "4px",
                }}
              >
                {future.changePercent >= 0 ? "+" : ""}{future.change.toFixed(2)} ({formatSignedPercent(future.changePercent)})
              </em>
            </div>
          ))}
        </div>
      </section>

      {/* Pre-Market Movers */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">Market Movements</p>
          <h2>Pre-Market Top Movers</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "12px",
          }}
        >
          {preMarketMovers.map((mover) => (
            <MoverCard key={mover.symbol} mover={mover as any} />
          ))}
        </div>
      </section>

      {/* Volume Alerts */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">Notable Activity</p>
          <h2>Volume Spikes & Gaps</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          {[
            { label: "NYSE", volume: "324M", note: "Above 20-day avg" },
            { label: "NASDAQ", volume: "158M", note: "Mixed sentiment" },
            { label: "AMEX", volume: "42M", note: "Below average" },
            { label: "Futures", volume: "2.3B", note: "Heavy buying" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: "16px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
              }}
            >
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#A27841" }}>{item.label}</p>
              <strong style={{ fontSize: "16px", display: "block", marginTop: "8px" }}>{item.volume}</strong>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Time to Market Open */}
      <section
        style={{
          padding: "32px",
          backgroundColor: "rgba(162, 120, 65, 0.08)",
          borderRadius: "8px",
          textAlign: "center",
          border: "1px solid rgba(162, 120, 65, 0.2)",
        }}
      >
        <p className="eyebrow">Regular Trading Hours</p>
        <h3>US Market Opens in ~2 hours 45 minutes</h3>
        <p style={{ color: "#475569", marginTop: "12px" }}>
          NYSE and NASDAQ open at 9:30 AM ET | Pre-market session continues until open
        </p>
        <div style={{ marginTop: "16px" }}>
          <Link to="/dashboard" className="primary-action" style={{ textDecoration: "none" }}>
            View Market Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PreMarketPage;
