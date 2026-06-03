import React from "react";
import { Link } from "react-router-dom";
import "../styles/index.css";
import { useI18n } from "../i18n";



const formatMoney = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  return `$${value.toLocaleString()}`;
};

const formatSignedPercent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const MoversPage: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = React.useState<"gainers" | "losers" | "active">("gainers");

  const gainers = React.useMemo(() => {
    return [
      { symbol: "NVDA", name: "NVIDIA", price: 128.75, change: 5.20, changePercent: 4.20, volume: "125M", cap: "$3.2T" },
      { symbol: "MAGNIFICO", name: "Magnificent Corp", price: 245.80, change: 3.15, changePercent: 1.30, volume: "52M", cap: "$980B" },
      { symbol: "TECHPRO", name: "TechPro Solutions", price: 178.40, change: 2.85, changePercent: 1.62, volume: "38M", cap: "$450B" },
      { symbol: "CRESCENDO", name: "Crescendo Inc.", price: 92.50, change: 1.95, changePercent: 2.15, volume: "24M", cap: "$210B" },
      { symbol: "INNOVATION", name: "Innovation Labs", price: 156.20, change: 1.75, changePercent: 1.13, volume: "19M", cap: "$380B" },
      { symbol: "QUANTUM", name: "Quantum Leap Ltd.", price: 203.60, change: 1.65, changePercent: 0.81, volume: "16M", cap: "$520B" },
    ];
  }, []);

  const losers = React.useMemo(() => {
    return [
      { symbol: "LEGACY", name: "Legacy Finance", price: 45.20, change: -2.80, changePercent: -5.82, volume: "92M", cap: "$180B" },
      { symbol: "DECLINE", name: "Decline Co.", price: 78.40, change: -2.15, changePercent: -2.66, volume: "58M", cap: "$320B" },
      { symbol: "FALLING", name: "Falling Markets", price: 112.35, change: -1.95, changePercent: -1.71, volume: "31M", cap: "$480B" },
      { symbol: "DOWNTURN", name: "Downturn Inc.", price: 89.70, change: -1.50, changePercent: -1.64, volume: "22M", cap: "$190B" },
      { symbol: "BEARISH", name: "Bearish Trends", price: 134.80, change: -1.35, changePercent: -0.99, volume: "18M", cap: "$650B" },
      { symbol: "SOFTEN", name: "Soften Holdings", price: 198.50, change: -0.95, changePercent: -0.48, volume: "14M", cap: "$420B" },
    ];
  }, []);

  const mostActive = React.useMemo(() => {
    return [
      { symbol: "AMD", name: "Advanced Micro Devices", price: 156.40, change: -0.85, changePercent: -0.54, volume: "285M", cap: "$900B" },
      { symbol: "META", name: "Meta Platforms", price: 512.30, change: 1.80, changePercent: 0.35, volume: "264M", cap: "$1.3T" },
      { symbol: "TSLA", name: "Tesla Inc.", price: 245.80, change: -2.15, changePercent: -0.87, volume: "156M", cap: "$850B" },
      { symbol: "MSFT", name: "Microsoft Corp.", price: 418.50, change: 1.30, changePercent: 0.31, volume: "148M", cap: "$3.1T" },
      { symbol: "AAPL", name: "Apple Inc.", price: 194.25, change: 0.45, changePercent: 0.23, volume: "142M", cap: "$3.0T" },
      { symbol: "AMZN", name: "Amazon.com Inc.", price: 182.90, change: 0.80, changePercent: 0.44, volume: "138M", cap: "$1.9T" },
    ];
  }, []);

  const getDisplayData = () => {
    switch (activeTab) {
      case "losers":
        return losers;
      case "active":
        return mostActive;
      default:
        return gainers;
    }
  };

  const displayData = getDisplayData();

  return (
    <div className="page intelligence-page">
      {/* Hero Section */}
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">{t("src_client_pages_moverspage__l67__h0")}</p>
          <h1>{t("src_client_pages_moverspage__l68__h1")}</h1>
          <p>{t("src_client_pages_moverspage__l69__h2")}</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>{t("src_client_pages_moverspage__l73__h3")}</span>
            <strong>{t("src_client_pages_moverspage__l74__h4")}</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_moverspage__l77__h5")}</span>
            <strong>{t("src_client_pages_moverspage__l78__h6")}</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_moverspage__l81__h7")}</span>
            <strong>{t("src_client_pages_moverspage__l82__h8")}</strong>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveTab("gainers")}
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              border: activeTab === "gainers" ? "2px solid #059669" : "1px solid #e2e8f0",
              background: activeTab === "gainers" ? "rgba(5, 150, 105, 0.1)" : "transparent",
              cursor: "pointer",
              fontWeight: activeTab === "gainers" ? 600 : 500,
              color: activeTab === "gainers" ? "#059669" : "#475569",
              transition: "all 0.2s",
            }}
          >
            🔼 Top Gainers
          </button>
          <button
            onClick={() => setActiveTab("losers")}
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              border: activeTab === "losers" ? "2px solid #dc2626" : "1px solid #e2e8f0",
              background: activeTab === "losers" ? "rgba(220, 38, 38, 0.1)" : "transparent",
              cursor: "pointer",
              fontWeight: activeTab === "losers" ? 600 : 500,
              color: activeTab === "losers" ? "#dc2626" : "#475569",
              transition: "all 0.2s",
            }}
          >
            🔽 Top Losers
          </button>
          <button
            onClick={() => setActiveTab("active")}
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              border: activeTab === "active" ? "2px solid #A27841" : "1px solid #e2e8f0",
              background: activeTab === "active" ? "rgba(162, 120, 65, 0.1)" : "transparent",
              cursor: "pointer",
              fontWeight: activeTab === "active" ? 600 : 500,
              color: activeTab === "active" ? "#A27841" : "#475569",
              transition: "all 0.2s",
            }}
          >
            ⚡ Most Active
          </button>
        </div>
      </section>

      {/* Movers Table */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#f8fafc",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>{t("src_client_pages_moverspage__l152__h9")}</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>{t("src_client_pages_moverspage__l153__h10")}</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>{t("src_client_pages_moverspage__l154__h11")}</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{t("src_client_pages_moverspage__l155__h12")}</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{t("src_client_pages_moverspage__l156__h13")}</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{t("src_client_pages_moverspage__l157__h14")}</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{t("src_client_pages_moverspage__l158__h15")}</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((stock, index) => (
                <tr
                  key={stock.symbol}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    backgroundColor: index % 2 === 0 ? "transparent" : "rgba(162, 120, 65, 0.02)",
                  }}
                >
                  <td style={{ padding: "12px", fontWeight: 600, color: "#475569" }}>{index + 1}</td>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{stock.symbol}</td>
                  <td style={{ padding: "12px", color: "#475569" }}>{stock.name}</td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>${stock.price.toFixed(2)}</td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      color: stock.changePercent >= 0 ? "#059669" : "#dc2626",
                      fontWeight: 600,
                    }}
                  >
                    {stock.changePercent >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({formatSignedPercent(stock.changePercent)})
                  </td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#475569" }}>{stock.volume}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#475569" }}>{stock.cap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Market Insights */}
      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">{t("src_client_pages_moverspage__l196__h16")}</p>
          <h3>{t("src_client_pages_moverspage__l197__h17")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_moverspage__l199__h18")}</li>
            <li>{t("src_client_pages_moverspage__l200__h19")}</li>
            <li>{t("src_client_pages_moverspage__l201__h20")}</li>
            <li>{t("src_client_pages_moverspage__l202__h21")}</li>
            <li>{t("src_client_pages_moverspage__l203__h22")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{t("src_client_pages_moverspage__l207__h23")}</p>
          <h3>{t("src_client_pages_moverspage__l208__h24")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_moverspage__l210__h25")}</li>
            <li>{t("src_client_pages_moverspage__l211__h26")}</li>
            <li>{t("src_client_pages_moverspage__l212__h27")}</li>
            <li>{t("src_client_pages_moverspage__l213__h28")}</li>
            <li>{t("src_client_pages_moverspage__l214__h29")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{t("src_client_pages_moverspage__l218__h30")}</p>
          <h3>{t("src_client_pages_moverspage__l219__h31")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_moverspage__l221__h32")}</li>
            <li>{t("src_client_pages_moverspage__l222__h33")}</li>
            <li>{t("src_client_pages_moverspage__l223__h34")}</li>
            <li>{t("src_client_pages_moverspage__l224__h35")}</li>
            <li>{t("src_client_pages_moverspage__l225__h36")}</li>
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
        <p className="eyebrow">{t("src_client_pages_moverspage__l241__h37")}</p>
        <h3>{t("src_client_pages_moverspage__l242__h38")}</h3>
        <div style={{ marginTop: "16px" }}>
          <Link to="/screener" className="primary-action" style={{ textDecoration: "none" }}>
            Launch Advanced Screener
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MoversPage;
