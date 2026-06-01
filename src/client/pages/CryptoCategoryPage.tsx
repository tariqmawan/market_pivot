import React from "react";
import { Link, useParams } from "react-router-dom";
import cryptoData from "../../data/cryptocurrencies.json";
import type { Cryptocurrency } from "../../types";
import "../styles/index.css";

const cryptocurrencies = (cryptoData as any).cryptocurrencies as Cryptocurrency[];

const categoryConfigs: Record<string, { title: string; description: string; eyebrow: string; coins: Cryptocurrency[] }> = {
  "meme-coins": {
    eyebrow: "Alternative Assets",
    title: "Meme Coins",
    description: "Community-driven and entertainment-focused cryptocurrencies with cult followings.",
    coins: cryptocurrencies.filter(c => ["DOGE", "SHIB"].includes(c.symbol)).concat(cryptocurrencies.slice(0, 3)),
  },
  "defi": {
    eyebrow: "Decentralized Finance",
    title: "DeFi Ecosystem",
    description: "Decentralized finance protocols, lending platforms, and yield farming opportunities.",
    coins: cryptocurrencies.filter(c => ["ETH", "UNI", "AAVE"].includes(c.symbol)).concat(cryptocurrencies.slice(0, 3)),
  },
  "layer-1": {
    eyebrow: "Blockchain Infrastructure",
    title: "Layer 1 Blockchains",
    description: "Primary blockchain networks competing with Ethereum for dApps and smart contracts.",
    coins: cryptocurrencies.filter(c => ["SOL", "ADA", "AVAX"].includes(c.symbol)).concat(cryptocurrencies.slice(0, 3)),
  },
  "stablecoins": {
    eyebrow: "Price Stability",
    title: "Stablecoins",
    description: "Cryptocurrencies pegged to fiat currencies or commodities for transaction stability.",
    coins: cryptocurrencies.filter(c => ["USDT", "USDC", "DAI"].includes(c.symbol)).concat(cryptocurrencies.slice(0, 3)),
  },
};

const CryptoCategoryPage: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const config = category ? categoryConfigs[category] : categoryConfigs["layer-1"];

  if (!config) {
    return <div className="page"><p>Category not found</p></div>;
  }

  return (
    <div className="page intelligence-page">
      {/* Hero */}
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">{config.eyebrow}</p>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>Coins Listed</span>
            <strong>{config.coins.length}</strong>
          </div>
          <div className="metric-tile">
            <span>Total Volume</span>
            <strong>$12.5B</strong>
          </div>
          <div className="metric-tile">
            <span>Avg Return</span>
            <strong>+24.5%</strong>
          </div>
        </div>
      </section>

      {/* Coins List */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">Top Assets</p>
          <h2>{config.title} Coins</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#f8fafc",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Rank</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Name</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Price</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>24h Change</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {config.coins.map((coin, idx) => (
                <tr
                  key={coin.id}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    backgroundColor: idx % 2 === 0 ? "transparent" : "rgba(162, 120, 65, 0.02)",
                  }}
                >
                  <td style={{ padding: "12px" }}>
                    <Link to={`/crypto/${coin.id}`} style={{ color: "#A27841", textDecoration: "none", fontWeight: 600 }}>
                      #{idx + 1}
                    </Link>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <Link to={`/crypto/${coin.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                      <strong>{coin.name}</strong> ({coin.symbol})
                    </Link>
                  </td>
                  <td style={{ padding: "12px", textAlign: "right" }}>${(Math.random() * 500 + 100).toFixed(2)}</td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      color: Math.random() > 0.5 ? "#059669" : "#dc2626",
                      fontWeight: 600,
                    }}
                  >
                    {(Math.random() * 20 - 10).toFixed(2)}%
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#475569" }}>
                    ${((Math.random() * 100 + 10) * 1e9).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">Category Metrics</p>
          <h3>Market Health</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>Dominance index</li>
            <li>Trading volume trends</li>
            <li>Volatility index</li>
            <li>Market sentiment</li>
            <li>Developer activity</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Analysis</p>
          <h3>Technical Outlook</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>Support levels</li>
            <li>Resistance points</li>
            <li>Moving averages</li>
            <li>RSI indicators</li>
            <li>Pattern analysis</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">News</p>
          <h3>Updates</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>Protocol updates</li>
            <li>Partnership news</li>
            <li>Exchange listings</li>
            <li>Regulatory changes</li>
            <li>Security audits</li>
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
        <p className="eyebrow">Explore Assets</p>
        <h3>Research Cryptocurrencies</h3>
        <div style={{ marginTop: "16px" }}>
          <Link to="/crypto" className="primary-action" style={{ textDecoration: "none" }}>
            View All Coins
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CryptoCategoryPage;
