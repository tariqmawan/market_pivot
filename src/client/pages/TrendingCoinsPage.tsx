import React from "react";
import { Link } from "react-router-dom";
import cryptoData from "../../data/cryptocurrencies.json";
import type { Cryptocurrency } from "../../types";
import "../styles/index.css";
import { useI18n } from "../i18n";



const cryptocurrencies = (cryptoData as any).cryptocurrencies as Cryptocurrency[];

const formatMoney = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
};

const TrendingCoinsPage: React.FC = () => {
  const { t } = useI18n();
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
          <p className="eyebrow">{t("src_client_pages_trendingcoinspage__l33__h0")}</p>
          <h1>{t("src_client_pages_trendingcoinspage__l34__h1")}</h1>
          <p>{t("src_client_pages_trendingcoinspage__l35__h2")}</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>{t("src_client_pages_trendingcoinspage__l39__h3")}</span>
            <strong>{cryptocurrencies.length}</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_trendingcoinspage__l43__h4")}</span>
            <strong>{t("src_client_pages_trendingcoinspage__l44__h5")}</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_trendingcoinspage__l47__h6")}</span>
            <strong>{t("src_client_pages_trendingcoinspage__l48__h7")}</strong>
          </div>
        </div>
      </section>

      {/* Trending Coins Grid */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">{t("src_client_pages_trendingcoinspage__l56__h8")}</p>
          <h2>{t("src_client_pages_trendingcoinspage__l57__h9")}</h2>
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
                    <span>{t("src_client_pages_trendingcoinspage__l142__h10")}</span>
                    <strong style={{ display: "block" }}>{formatMoney(coin.volume24h)}</strong>
                  </div>
                  <div>
                    <span>{t("src_client_pages_trendingcoinspage__l146__h11")}</span>
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
          <p className="eyebrow">{t("src_client_pages_trendingcoinspage__l159__h12")}</p>
          <h3>{t("src_client_pages_trendingcoinspage__l160__h13")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_trendingcoinspage__l162__h14")}</li>
            <li>{t("src_client_pages_trendingcoinspage__l163__h15")}</li>
            <li>{t("src_client_pages_trendingcoinspage__l164__h16")}</li>
            <li>{t("src_client_pages_trendingcoinspage__l165__h17")}</li>
            <li>{t("src_client_pages_trendingcoinspage__l166__h18")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{t("src_client_pages_trendingcoinspage__l170__h19")}</p>
          <h3>{t("src_client_pages_trendingcoinspage__l171__h20")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_trendingcoinspage__l173__h21")}</li>
            <li>{t("src_client_pages_trendingcoinspage__l174__h22")}</li>
            <li>{t("src_client_pages_trendingcoinspage__l175__h23")}</li>
            <li>{t("src_client_pages_trendingcoinspage__l176__h24")}</li>
            <li>{t("src_client_pages_trendingcoinspage__l177__h25")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{t("src_client_pages_trendingcoinspage__l181__h26")}</p>
          <h3>{t("src_client_pages_trendingcoinspage__l182__h27")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_trendingcoinspage__l184__h28")}</li>
            <li>{t("src_client_pages_trendingcoinspage__l185__h29")}</li>
            <li>{t("src_client_pages_trendingcoinspage__l186__h30")}</li>
            <li>{t("src_client_pages_trendingcoinspage__l187__h31")}</li>
            <li>{t("src_client_pages_trendingcoinspage__l188__h32")}</li>
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
        <p className="eyebrow">{t("src_client_pages_trendingcoinspage__l204__h33")}</p>
        <h3>{t("src_client_pages_trendingcoinspage__l205__h34")}</h3>
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
