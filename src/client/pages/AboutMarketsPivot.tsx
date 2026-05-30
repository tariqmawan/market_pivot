import React from "react";
import { useSEO } from "../lib/useSEO";

const GOLD = "#C9A87B";
const GOLD_LIGHT = "#e8c990";
const DARK = "#0f172a";

const stats = [
  { value: "30+", label: "Global Exchanges" },
  { value: "20+", label: "Cryptocurrencies" },
  { value: "20+", label: "Currency Pairs" },
  { value: "9", label: "Commodity Classes" },
];

const pillars = [
  {
    icon: "📊",
    title: "Equities & Exchanges",
    desc: "Track major exchanges worldwide — NYSE, NASDAQ, LSE, TSE and 26 more — with live market movers and sector performance.",
  },
  {
    icon: "💱",
    title: "Forex & Currencies",
    desc: "Real-time FX rates, economic indicators, interest rates, and currency pair analysis across 20+ currency pairs.",
  },
  {
    icon: "₿",
    title: "Crypto Markets",
    desc: "Live cryptocurrency prices, market caps, and 24h volume data covering top digital assets in one unified view.",
  },
  {
    icon: "🛢",
    title: "Commodities",
    desc: "Energy, metals, agriculture — all major commodity classes with price movements and historical context.",
  },
  {
    icon: "🌍",
    title: "Regional Intelligence",
    desc: "Market data organized by geography — understand macro trends across Asia-Pacific, Americas, Europe, and MENA.",
  },
  {
    icon: "🔍",
    title: "Screener & Calendar",
    desc: "Filter thousands of instruments by custom criteria, and stay ahead with an economic events calendar.",
  },
];

const values = [
  { title: "Clarity", desc: "Complex data, presented simply. No jargon — just insight." },
  { title: "Coverage", desc: "From frontier markets to S&P 500 leaders, we cover it all." },
  { title: "Speed", desc: "Real-time data via WebSocket keeps you updated every few seconds." },
];

const AboutMarketsPivot: React.FC = () => {
  useSEO({ title: "About MarketsPivot", description: "Learn about MarketsPivot — a Bloomberg-style market intelligence platform covering stocks, forex, crypto and commodities.", canonical: "https://marketspivot.com/about" });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#2c3e50" }}>

      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, #0f1e2e 0%, #162030 50%, #1a2a3a 100%)`,
        padding: "80px 5vw 72px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 20% 50%, rgba(201,168,123,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,168,123,0.07) 0%, transparent 50%)`,
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 860, position: "relative" }}>
          <div style={{
            display: "inline-block", padding: "4px 14px",
            border: `1px solid rgba(201,168,123,0.4)`,
            background: "rgba(201,168,123,0.08)",
            color: GOLD, fontSize: 11, fontWeight: 800,
            letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24,
          }}>
            About the Platform
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800,
            lineHeight: 1.08, color: "#ffffff", letterSpacing: "-0.5px", marginBottom: 20,
          }}>
            Market intelligence,<br />
            <span style={{ color: GOLD }}>built for clarity.</span>
          </h1>
          <p style={{
            fontSize: 18, color: "rgba(255,255,255,0.7)",
            maxWidth: 620, lineHeight: 1.65, marginBottom: 40,
          }}>
            MarketsPivot is a Bloomberg-style financial data platform covering equities, FX, crypto,
            commodities, regions, and sectors — organized into a clean, navigable experience.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <a href="/" style={{
              padding: "12px 28px", background: GOLD, color: "#0f172a",
              fontWeight: 800, fontSize: 14, textDecoration: "none", letterSpacing: "0.02em",
            }}>
              Explore Markets
            </a>
            <a href="/pricing" style={{
              padding: "12px 28px", background: "transparent",
              border: `1px solid rgba(201,168,123,0.45)`,
              color: GOLD, fontWeight: 800, fontSize: 14, textDecoration: "none",
            }}>
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{
        background: "#ffffff",
        borderTop: `3px solid ${GOLD}`,
        borderBottom: "1px solid #e5e7eb",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: "28px 24px",
              borderRight: i < stats.length - 1 ? "1px solid #e5e7eb" : "none",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: GOLD, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ background: "#f8f9fa", padding: "72px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div style={{ color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Our Mission</div>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 800, color: DARK, lineHeight: 1.15, marginBottom: 20 }}>
              Bringing institutional-grade data to everyone
            </h2>
            <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.7, marginBottom: 16 }}>
              MarketsPivot helps individuals and teams discover actionable insights across all major asset classes — organized into a clean, navigable experience that respects your time.
            </p>
            <p style={{ fontSize: 16, color: "#4b5563", lineHeight: 1.7 }}>
              Content on MarketsPivot is for general informational purposes. It is not investment advice. Always consult a licensed financial professional before making investment decisions.
            </p>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {values.map((v, i) => (
              <div key={i} style={{
                padding: "20px 22px",
                background: "#ffffff",
                borderLeft: `4px solid ${GOLD}`,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: DARK, marginBottom: 6 }}>{v.title}</div>
                <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.55 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage pillars */}
      <section style={{ background: "#ffffff", padding: "72px 5vw" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>What We Cover</div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, color: DARK, lineHeight: 1.15 }}>
              Six pillars of market intelligence
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#e5e7eb", border: "1px solid #e5e7eb" }}>
            {pillars.map((p, i) => (
              <div key={i} style={{
                background: "#ffffff", padding: "28px 24px",
                transition: "background 0.2s ease",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "#fdf8f2")}
                onMouseLeave={e => (e.currentTarget.style.background = "#ffffff")}
              >
                <div style={{ fontSize: 28, marginBottom: 14 }}>{p.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 15, color: DARK, marginBottom: 8 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section style={{
        background: `linear-gradient(135deg, #0f1e2e, #1a2e40)`,
        padding: "64px 5vw",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, color: "#ffffff", marginBottom: 14 }}>
            Have a question?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", marginBottom: 32, lineHeight: 1.6 }}>
            Reach out to our team — we typically respond within one business day.
          </p>
          <a href="mailto:support@marketspivot.example" style={{
            display: "inline-block", padding: "13px 36px",
            background: GOLD, color: "#0f172a",
            fontWeight: 800, fontSize: 14, textDecoration: "none",
            letterSpacing: "0.02em",
          }}>
            Contact Support
          </a>
        </div>
      </section>

    </div>
  );
};

export default AboutMarketsPivot;
