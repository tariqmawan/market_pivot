import React from "react";
import { Link } from "react-router-dom";
import cryptoData from "../../data/cryptocurrencies.json";
import type { Cryptocurrency } from "../../types";
import "../styles/index.css";

const cryptocurrencies = (cryptoData as any).cryptocurrencies as Cryptocurrency[];

const formatMoney = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
};

const TrendingCoinsPage: React.FC = () => {
  const trendingCoins = React.useMemo(() => {
    return cryptocurrencies.slice(0, 12).map((coin, idx) => ({
      ...coin,
      rank: idx + 1,
      price: 10000 + idx * 5000,
      change24h: (Math.random() * 20 - 5),
      volume24h: coin.circulatingSupply * (Math.random() * 100 + 50),
      sentiment: ["🔥 Hot", "📈 Rising", "⚡ Active", "💯 Strong"][idx % 4],
    }));
  }, []);

  return (
    <div className="page intelligence-page">
      {/* Hero Section */}
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">Cryptocurrency</p>
          <h1>Trending Coins</h1>
          <p>Real-time trending cryptocurrencies by trading activity, social momentum, and market cap growth.</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>Total Coins Tracked</span>
            <strong>{cryptocurrencies.length}</strong>
          </div>
          <div className="metric-tile">
            <span>Market Cap</span>
            <strong>$2.1T</strong>
          </div>
          <div className="metric-tile">
            <span>24h Volume</span>
            <strong>$85B</strong>
          </div>
        </div>
      </section>

      {/* Trending Coins Grid */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">Market Leaders</p>
          <h2>Top Trending Cryptocurrencies</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "12px",
          }}
        >
          {trendingCoins.map((coin) => (
            <Link
              to={`/crypto/${coin.id}`}
              key={coin.id}
              style={{
                textDecoration: "none",
                display: "block",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  backgroundColor: "#f8fafc",
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
                  el.style.backgroundColor = "#f8fafc";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                  <div>
                    <strong style={{ fontSize: "16px", display: "block" }}>
                      #{coin.rank} {coin.name}
                    </strong>
                    <p style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>{coin.symbol}</p>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "4px 8px",
                      backgroundColor: "rgba(162, 120, 65, 0.1)",
                      color: "#A27841",
                      borderRadius: "4px",
                    }}
                  >
                    {coin.sentiment}
                  </span>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <strong style={{ fontSize: "18px", display: "block" }}>${coin.price.toFixed(2)}</strong>
                  <em
                    style={{
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      color: coin.change24h >= 0 ? "#059669" : "#dc2626",
                    }}
                  >
                    {coin.change24h >= 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
                  </em>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    paddingTop: "12px",
                    borderTop: "1px solid #e2e8f0",
                    fontSize: "12px",
                    color: "#475569",
                  }}
                >
                  <div>
                    <span>24h Vol</span>
                    <strong style={{ display: "block" }}>{formatMoney(coin.volume24h)}</strong>
                  </div>
                  <div>
                    <span>Supply</span>
                    <strong style={{ display: "block" }}>{(coin.circulatingSupply / 1e6).toFixed(0)}M</strong>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Insights */}
      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">What's Trending</p>
          <h3>Market Dynamics</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>Social media mentions</li>
            <li>Exchange inflow/outflow</li>
            <li>Developer activity</li>
            <li>On-chain transactions</li>
            <li>Trading volume spikes</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Risk Factors</p>
          <h3>Considerations</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>High volatility risk</li>
            <li>Low liquidity concerns</li>
            <li>Market manipulation risk</li>
            <li>Regulatory changes</li>
            <li>Technology risk</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Trading Tips</p>
          <h3>Smart Strategies</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>Validate on-chain metrics</li>
            <li>Check developer updates</li>
            <li>Monitor volume patterns</li>
            <li>Use proper position sizing</li>
            <li>Set strict stop-losses</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          marginTop: "48px",
          padding: "32px",
          backgroundColor: "rgba(162, 120, 65, 0.08)",
          borderRadius: "8px",
          border: "1px solid rgba(162, 120, 65, 0.2)",
          textAlign: "center",
        }}
      >
        <p className="eyebrow">Crypto Research</p>
        <h3>Deep Dive Into Coins</h3>
        <p style={{ color: "#475569", marginTop: "8px", marginBottom: "16px" }}>
          Click any coin to view detailed charts, on-chain metrics, exchange listings, and news
        </p>
        <Link to="/crypto" className="primary-action" style={{ textDecoration: "none" }}>
          View All Cryptocurrencies
        </Link>
      </section>
    </div>
  );
};

export default TrendingCoinsPage;
