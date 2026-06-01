import React from "react";
import { Link } from "react-router-dom";
import bondsYieldsData from "../../data/bonds_yields.json";
import "../styles/index.css";

type BondsYieldsItem = {
  id: string;
  country: string;
  instrument: string;
  curvePoint: string;
  currency: string;
  tenor: string;
  yieldPercent: number;
  changePercentDay: number;
  ytdPercent: number;
};

const bondsYields = (bondsYieldsData as any).bondsYields as BondsYieldsItem[];

const formatSignedPercent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const BondsYieldsPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = React.useState<string | null>(null);

  // Group yields by country
  const byCountry = React.useMemo(() => {
    const grouped: Record<string, BondsYieldsItem[]> = {};
    bondsYields.forEach((item) => {
      if (!grouped[item.country]) grouped[item.country] = [];
      grouped[item.country].push(item);
    });
    return grouped;
  }, []);

  const countries = Object.keys(byCountry).sort();
  const displayYields = selectedCountry ? byCountry[selectedCountry] : bondsYields;

  // Key yield spreads
  const spreadData = [
    { pair: "US 10Y - 2Y", value: 3.42, change: -0.15, interpretation: "Inversion signal" },
    { pair: "US 10Y - 30Y", value: 1.28, change: -0.08, interpretation: "Flat long-end" },
    { pair: "DE Bund - US 10Y", value: -2.15, change: 0.12, interpretation: "Rate divergence" },
    { pair: "UK Gilt - US 10Y", value: 1.05, change: -0.05, interpretation: "BOE vs Fed" },
  ];

  return (
    <div className="page intelligence-page">
      {/* Hero Section */}
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">Fixed Income</p>
          <h1>Bonds & Yield Curves</h1>
          <p>Real-time yield tracking across global sovereign debt markets, yield curves, and spread analysis.</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>US 10Y Yield</span>
            <strong>4.31%</strong>
          </div>
          <div className="metric-tile">
            <span>US 2Y Yield</span>
            <strong>4.89%</strong>
          </div>
          <div className="metric-tile">
            <span>2-10 Spread</span>
            <strong>-58bp</strong>
          </div>
        </div>
      </section>

      {/* Country Filter */}
      <section style={{ marginBottom: "24px" }}>
        <div style={{ marginBottom: "12px" }}>
          <button
            onClick={() => setSelectedCountry(null)}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: !selectedCountry ? "2px solid #A27841" : "1px solid #e2e8f0",
              background: !selectedCountry ? "rgba(162, 120, 65, 0.1)" : "transparent",
              cursor: "pointer",
              fontWeight: !selectedCountry ? 600 : 500,
              color: !selectedCountry ? "#A27841" : "#475569",
              marginRight: "8px",
            }}
          >
            All Countries
          </button>
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                border: selectedCountry === country ? "2px solid #A27841" : "1px solid #e2e8f0",
                background: selectedCountry === country ? "rgba(162, 120, 65, 0.1)" : "transparent",
                cursor: "pointer",
                fontWeight: selectedCountry === country ? 600 : 500,
                color: selectedCountry === country ? "#A27841" : "#475569",
                marginRight: "8px",
                marginBottom: "8px",
              }}
            >
              {country}
            </button>
          ))}
        </div>
      </section>

      {/* Yield Grid */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">Global Yields</p>
          <h2>Bond Yields by Tenor</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          {displayYields.map((bond) => (
            <div
              key={bond.id}
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
              <p style={{ fontSize: "11px", fontWeight: 600, color: "#A27841", marginBottom: "4px" }}>
                {bond.country} {bond.tenor}
              </p>
              <strong style={{ fontSize: "18px", display: "block" }}>{bond.yieldPercent.toFixed(2)}%</strong>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "8px" }}>
                {bond.instrument}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  marginTop: "8px",
                  paddingTop: "8px",
                  borderTop: "1px solid #e2e8f0",
                  fontSize: "11px",
                  color: "#475569",
                }}
              >
                <div>
                  <span>Today</span>
                  <em
                    style={{
                      display: "block",
                      fontStyle: "normal",
                      fontWeight: 600,
                      color: bond.changePercentDay >= 0 ? "#dc2626" : "#059669",
                    }}
                  >
                    {formatSignedPercent(bond.changePercentDay)}
                  </em>
                </div>
                <div>
                  <span>YTD</span>
                  <em
                    style={{
                      display: "block",
                      fontStyle: "normal",
                      fontWeight: 600,
                      color: bond.ytdPercent >= 0 ? "#dc2626" : "#059669",
                    }}
                  >
                    {formatSignedPercent(bond.ytdPercent)}
                  </em>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Yield Curve Section */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">Spreads & Relationships</p>
          <h2>Yield Curve Spreads</h2>
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
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Spread</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Value (bp)</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Change</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Signal</th>
              </tr>
            </thead>
            <tbody>
              {spreadData.map((spread) => (
                <tr key={spread.pair} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{spread.pair}</td>
                  <td style={{ padding: "12px", textAlign: "right" }}>
                    {(spread.value * 100).toFixed(0)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      color: spread.change >= 0 ? "#dc2626" : "#059669",
                      fontWeight: 600,
                    }}
                  >
                    {spread.change >= 0 ? "+" : ""}{(spread.change * 100).toFixed(0)}bp
                  </td>
                  <td style={{ padding: "12px", color: "#475569" }}>{spread.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Insights */}
      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">Rate Environment</p>
          <h3>Current Regime</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>Higher for longer narrative</li>
            <li>Fed likely near peak rates</li>
            <li>Term premium elevated</li>
            <li>Curve steepening pressure</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Market Drivers</p>
          <h3>Key Factors</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>Inflation data expectations</li>
            <li>Central bank communications</li>
            <li>Growth/recession signals</li>
            <li>Global rate differentials</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Trading Ideas</p>
          <h3>Fixed Income Strategies</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>Curve trades (steepeners/flatteners)</li>
            <li>Cross-country spread trades</li>
            <li>Duration positioning</li>
            <li>Breakeven inflation trades</li>
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
        <p className="eyebrow">Macro Analysis</p>
        <h3>Monitor Economic Indicators</h3>
        <p style={{ color: "#475569", marginTop: "8px", marginBottom: "16px" }}>
          Yield curves anticipate economic changes — track them for macro alpha signals
        </p>
        <Link to="/economic-calendar" className="primary-action" style={{ textDecoration: "none" }}>
          View Economic Calendar
        </Link>
      </section>
    </div>
  );
};

export default BondsYieldsPage;
