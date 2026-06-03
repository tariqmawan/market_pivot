import React from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/index.css";
import { useI18n } from "../i18n";



interface CategoryConfig {
  title: string;
  eyebrow: string;
  description: string;
  icon: string;
  items: Array<{ name: string; value: string; change: number }>;
  features: string[];
  insights: string[];
}

const categoryConfigs: Record<string, CategoryConfig> = {
  "commodities/energy": {
    eyebrow: "Energy Markets",
    title: "Energy Commodities",
    description: "Oil, natural gas, coal, and renewable energy commodity prices and futures.",
    icon: "⚡",
    items: [
      { name: "WTI Crude", value: "$82.40", change: -0.42 },
      { name: "Brent Crude", value: "$85.20", change: -0.35 },
      { name: "Natural Gas", value: "$2.85", change: 1.20 },
      { name: "Coal", value: "$185.50", change: 0.15 },
    ],
    features: ["Spot prices", "Futures contracts", "Supply-demand analysis", "Geopolitical impacts"],
    insights: ["OPEC decisions", "US inventory data", "Global demand trends", "Seasonal patterns"],
  },
  "commodities/metals": {
    eyebrow: "Precious & Industrial",
    title: "Metals Market",
    description: "Gold, silver, copper, and industrial metal prices with hedging strategies.",
    icon: "💎",
    items: [
      { name: "Gold", value: "$2,045/oz", change: 0.55 },
      { name: "Silver", value: "$24.35/oz", change: 0.80 },
      { name: "Copper", value: "$3.82/lb", change: -0.25 },
      { name: "Platinum", value: "$1,025/oz", change: 0.10 },
    ],
    features: ["Precious metals", "Industrial metals", "Futures pricing", "Safe-haven flows"],
    insights: ["USD strength", "Fed policy impact", "Industrial demand", "Inflation hedge"],
  },
  "commodities/agriculture": {
    eyebrow: "Agri Commodities",
    title: "Agriculture Markets",
    description: "Crop commodities including wheat, corn, soybeans, and sugar futures.",
    icon: "🌾",
    items: [
      { name: "Wheat", value: "$718.50", change: -1.20 },
      { name: "Corn", value: "$485.25", change: 0.45 },
      { name: "Soybeans", value: "$1,245.75", change: -0.85 },
      { name: "Sugar", value: "$21.45", change: 0.30 },
    ],
    features: ["Crop cycles", "Weather impacts", "Supply estimates", "Seasonal trends"],
    insights: ["Harvest reports", "Weather patterns", "Global supply", "Demand shifts"],
  },
  "commodities/industrial": {
    eyebrow: "Industrial Inputs",
    title: "Industrial Commodities",
    description: "Industrial materials like lithium, rare earths, and construction commodities.",
    icon: "🏭",
    items: [
      { name: "Lithium", value: "$520/ton", change: 2.10 },
      { name: "Steel", value: "$485/ton", change: -0.60 },
      { name: "Aluminum", value: "$2,450/ton", change: 0.35 },
      { name: "Uranium", value: "$85.50", change: 1.45 },
    ],
    features: ["Energy transition", "Manufacturing demand", "EV demand", "Tech usage"],
    insights: ["Green transition", "Supply chain", "Demand cycle", "Technology trends"],
  },
  "news/regions": {
    eyebrow: "Global Markets",
    title: "Regional News",
    description: "Market news and analysis categorized by geographic regions and trading blocs.",
    icon: "🌍",
    items: [],
    features: ["Americas news", "Europe coverage", "Asia-Pacific", "EMEA updates"],
    insights: ["Regional GDP", "Earnings season", "Central banks", "Trade policies"],
  },
  "news/sectors": {
    eyebrow: "Equity Markets",
    title: "Sector News",
    description: "Sector-specific news including earnings, M&A, and thematic trends.",
    icon: "📈",
    items: [],
    features: ["Tech coverage", "Financial news", "Healthcare updates", "Energy sector"],
    insights: ["Earnings reports", "Industry trends", "M&A activity", "Regulatory news"],
  },
  "news/crypto": {
    eyebrow: "Digital Assets",
    title: "Crypto News",
    description: "Cryptocurrency market news, regulation updates, and on-chain analysis.",
    icon: "₿",
    items: [],
    features: ["Price movements", "Regulation", "On-chain data", "Exchange news"],
    insights: ["Regulatory updates", "Protocol news", "Market sentiment", "Developer activity"],
  },
  "news/alerts": {
    eyebrow: "Real-Time Updates",
    title: "Market Alerts",
    description: "Breaking news, critical events, and market-moving catalysts in real-time.",
    icon: "🚨",
    items: [],
    features: ["Breaking news", "Market moving", "Critical alerts", "Watchlist alerts"],
    insights: ["Earnings surprises", "Economic data", "Policy changes", "Macro events"],
  },
};

const CategoryPage: React.FC = () => {
  const { t } = useI18n();
  const params = useParams<{ "*"?: string }>();
  const path = params["*"] || "news/alerts";
  const config = categoryConfigs[path];

  if (!config) {
    return (
      <div className="page intelligence-page">
        <div className="section-heading">
          <p className="eyebrow">{t("src_client_pages_categorypage__l119__h0")}</p>
          <h1>{t("src_client_pages_categorypage__l120__h1")}</h1>
          <p>{t("src_client_pages_categorypage__l121__h2")}</p>
        </div>
        <Link to="/dashboard" className="primary-action" style={{ textDecoration: "none" }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="page intelligence-page">
      {/* Hero Section */}
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">{config.eyebrow}</p>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>{t("src_client_pages_categorypage__l141__h3")}</span>
            <strong>{config.items.length || "Multiple"}</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_categorypage__l145__h4")}</span>
            <strong>{t("src_client_pages_categorypage__l146__h5")}</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_categorypage__l149__h6")}</span>
            <strong>{t("src_client_pages_categorypage__l150__h7")}</strong>
          </div>
        </div>
      </section>

      {/* Items Grid (if applicable) */}
      {config.items.length > 0 && (
        <section style={{ marginBottom: "48px" }}>
          <div style={{ marginBottom: "24px" }}>
            <p className="eyebrow">{t("src_client_pages_categorypage__l159__h8")}</p>
            <h2>{t("src_client_pages_categorypage__l160__h9")}</h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {config.items.map((item) => (
              <div
                key={item.name}
                style={{
                  padding: "16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  backgroundColor: "#f8fafc",
                }}
              >
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>
                  {item.name}
                </p>
                <strong style={{ fontSize: "18px", display: "block" }}>{item.value}</strong>
                <em
                  style={{
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    color: item.change >= 0 ? "#059669" : "#dc2626",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
                </em>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">{t("src_client_pages_categorypage__l204__h10")}</p>
          <h2>{t("src_client_pages_categorypage__l205__h11")}</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          {config.features.map((feature) => (
            <div
              key={feature}
              style={{
                padding: "16px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                backgroundColor: "#fff",
              }}
            >
              <strong style={{ display: "block", marginBottom: "8px" }}>{feature}</strong>
              <p style={{ fontSize: "12px", color: "#475569" }}>
                Comprehensive tracking and analysis included
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Insights */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">{t("src_client_pages_categorypage__l236__h12")}</p>
          <h2>{t("src_client_pages_categorypage__l237__h13")}</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
          }}
        >
          {config.insights.map((insight) => (
            <div
              key={insight}
              style={{
                padding: "16px",
                border: "2px solid #A27841",
                borderRadius: "6px",
                backgroundColor: "rgba(162, 120, 65, 0.05)",
              }}
            >
              <strong style={{ color: "#A27841" }}>{insight}</strong>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "8px" }}>
                Monitor for market impact and opportunities
              </p>
            </div>
          ))}
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
        <p className="eyebrow">{t("src_client_pages_categorypage__l276__h14")}</p>
        <h3>{t("src_client_pages_categorypage__l277__h15")}</h3>
        <p style={{ color: "#475569", marginTop: "8px", marginBottom: "16px" }}>
          Subscribe to alerts and get real-time notifications for this category
        </p>
        <Link to="/user" className="primary-action" style={{ textDecoration: "none" }}>
          Manage Alerts
        </Link>
      </section>
    </div>
  );
};

export default CategoryPage;
