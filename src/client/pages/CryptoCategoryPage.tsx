import React from "react";
import { Link, useParams } from "react-router-dom";
import cryptoData from "../../data/cryptocurrencies.json";
import type { Cryptocurrency } from "../../types";
import "../styles/index.css";
import { useI18n } from "../i18n";



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
  const { t } = useI18n();
  const { category } = useParams<{ category?: string }>();
  const config = category ? categoryConfigs[category] : categoryConfigs["layer-1"];

  if (!config) {
    return <div className="page"><p>{t("src_client_pages_cryptocategorypage__l41__h0")}</p></div>;
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
            <span>{t("src_client_pages_cryptocategorypage__l55__h1")}</span>
            <strong>{config.coins.length}</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_cryptocategorypage__l59__h2")}</span>
            <strong>{t("src_client_pages_cryptocategorypage__l60__h3")}</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_cryptocategorypage__l63__h4")}</span>
            <strong>{t("src_client_pages_cryptocategorypage__l64__h5")}</strong>
          </div>
        </div>
      </section>

      {/* Coins List */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">{t("src_client_pages_cryptocategorypage__l72__h6")}</p>
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
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>{t("src_client_pages_cryptocategorypage__l85__h7")}</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>{t("src_client_pages_cryptocategorypage__l86__h8")}</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{t("src_client_pages_cryptocategorypage__l87__h9")}</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{t("src_client_pages_cryptocategorypage__l88__h10")}</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{t("src_client_pages_cryptocategorypage__l89__h11")}</th>
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
          <p className="eyebrow">{t("src_client_pages_cryptocategorypage__l135__h12")}</p>
          <h3>{t("src_client_pages_cryptocategorypage__l136__h13")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_cryptocategorypage__l138__h14")}</li>
            <li>{t("src_client_pages_cryptocategorypage__l139__h15")}</li>
            <li>{t("src_client_pages_cryptocategorypage__l140__h16")}</li>
            <li>{t("src_client_pages_cryptocategorypage__l141__h17")}</li>
            <li>{t("src_client_pages_cryptocategorypage__l142__h18")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{t("src_client_pages_cryptocategorypage__l146__h19")}</p>
          <h3>{t("src_client_pages_cryptocategorypage__l147__h20")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_cryptocategorypage__l149__h21")}</li>
            <li>{t("src_client_pages_cryptocategorypage__l150__h22")}</li>
            <li>{t("src_client_pages_cryptocategorypage__l151__h23")}</li>
            <li>{t("src_client_pages_cryptocategorypage__l152__h24")}</li>
            <li>{t("src_client_pages_cryptocategorypage__l153__h25")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{t("src_client_pages_cryptocategorypage__l157__h26")}</p>
          <h3>{t("src_client_pages_cryptocategorypage__l158__h27")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_cryptocategorypage__l160__h28")}</li>
            <li>{t("src_client_pages_cryptocategorypage__l161__h29")}</li>
            <li>{t("src_client_pages_cryptocategorypage__l162__h30")}</li>
            <li>{t("src_client_pages_cryptocategorypage__l163__h31")}</li>
            <li>{t("src_client_pages_cryptocategorypage__l164__h32")}</li>
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
        <p className="eyebrow">{t("src_client_pages_cryptocategorypage__l180__h33")}</p>
        <h3>{t("src_client_pages_cryptocategorypage__l181__h34")}</h3>
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
