import React from "react";
import { Link } from "react-router-dom";
import "../styles/index.css";
import { useI18n } from "../i18n";



const VolatilityIndexPage: React.FC = () => {
  const { t } = useI18n();
  const [selectedPeriod, setSelectedPeriod] = React.useState<"1D" | "1W" | "1M" | "3M" | "1Y">("1M");

  const volatilityMetrics = [
    {
      index: "VIX",
      name: "S&P 500 Volatility Index",
      current: 13.8,
      change: -1.1,
      low52w: 10.2,
      high52w: 28.5,
      description: "Fear gauge for equity market volatility",
    },
    {
      index: "VXN",
      name: "Nasdaq-100 Volatility Index",
      current: 16.2,
      change: -0.85,
      low52w: 12.1,
      high52w: 32.4,
      description: "Tech sector volatility measure",
    },
    {
      index: "RVX",
      name: "Russell 2000 Volatility Index",
      current: 18.5,
      change: -0.65,
      low52w: 14.8,
      high52w: 35.2,
      description: "Small-cap stock volatility",
    },
    {
      index: "MOVE",
      name: "Bond Market Volatility",
      current: 108.3,
      change: -2.15,
      low52w: 88.4,
      high52w: 156.7,
      description: "Treasury market volatility",
    },
  ];

  const volatilityRegimes = [
    { regime: "Low (<15)", description: "Market complacency", color: "#10b981" },
    { regime: "Normal (15-25)", description: "Healthy market conditions", color: "#fbbf24" },
    { regime: "Elevated (25-35)", description: "Increased uncertainty", color: "#f97316" },
    { regime: "High (>35)", description: "Extreme fear conditions", color: "#dc2626" },
  ];

  return (
    <div className="page intelligence-page">
      {/* Hero Section */}
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">{t("src_client_pages_volatilityindexpage__l59__h0")}</p>
          <h1>{t("src_client_pages_volatilityindexpage__l60__h1")}</h1>
          <p>{t("src_client_pages_volatilityindexpage__l65_h0")}</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>{t("src_client_pages_volatilityindexpage__l65__h3")}</span>
            <strong>13.8</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_volatilityindexpage__l69__h4")}</span>
            <strong>{t("src_client_pages_volatilityindexpage__l70__h5")}</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_volatilityindexpage__l73__h6")}</span>
            <strong>{t("src_client_pages_volatilityindexpage__l74__h7")}</strong>
          </div>
        </div>
      </section>

      {/* Key Volatility Indices */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">{t("src_client_pages_volatilityindexpage__l82__h8")}</p>
          <h2>{t("src_client_pages_volatilityindexpage__l83__h9")}</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "12px",
          }}
        >
          {volatilityMetrics.map((metric) => (
            <div
              key={metric.index}
              style={{
                padding: "20px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                backgroundColor: "#f8fafc",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#A27841", marginBottom: "4px" }}>
                    {metric.index}
                  </p>
                  <p style={{ fontSize: "13px", color: "#475569", fontWeight: 500 }}>
                    {metric.name}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong style={{ fontSize: "20px", display: "block" }}>{metric.current.toFixed(1)}</strong>
                  <em
                    style={{
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      color: metric.change >= 0 ? "#dc2626" : "#059669",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {metric.change >= 0 ? "+" : ""}{metric.change.toFixed(2)}
                  </em>
                </div>
              </div>

              <p style={{ fontSize: "12px", color: "#475569", marginTop: "12px", marginBottom: "8px" }}>
                {metric.description}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              >
                <div>
                  <span style={{ color: "#475569" }}>{t("src_client_pages_volatilityindexpage__l144__h10")}</span>
                  <strong style={{ display: "block" }}>{metric.low52w.toFixed(1)}</strong>
                </div>
                <div>
                  <span style={{ color: "#475569" }}>{t("src_client_pages_volatilityindexpage__l148__h11")}</span>
                  <strong style={{ display: "block" }}>{metric.high52w.toFixed(1)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Volatility Regimes */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">{t("src_client_pages_volatilityindexpage__l160__h12")}</p>
          <h2>{t("src_client_pages_volatilityindexpage__l161__h13")}</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
          }}
        >
          {volatilityRegimes.map((regime) => (
            <div
              key={regime.regime}
              style={{
                padding: "16px",
                border: `2px solid ${regime.color}`,
                borderRadius: "6px",
                backgroundColor: `${regime.color}15`,
              }}
            >
              <strong style={{ display: "block", color: regime.color, marginBottom: "8px" }}>
                {regime.regime}
              </strong>
              <p style={{ color: "#475569", fontSize: "14px" }}>{regime.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fear & Greed Gauge */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">{t("src_client_pages_volatilityindexpage__l192__h14")}</p>
          <h2>{t("src_client_pages_volatilityindexpage__l193__h15")}</h2>
        </div>
        <div
          style={{
            padding: "32px",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>
                Current Sentiment
              </p>
              <strong style={{ fontSize: "48px", color: "#059669" }}>67/100</strong>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "8px" }}>{t("src_client_pages_volatilityindexpage__l209__h16")}</p>
            </div>
            <div
              style={{
                width: "200px",
                height: "12px",
                backgroundColor: "#e2e8f0",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: "67%",
                  height: "100%",
                  background: "linear-gradient(90deg, #dc2626 0%, #f97316 25%, #fbbf24 50%, #10b981 75%, #059669 100%)",
                  borderRadius: "6px",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "8px",
              fontSize: "12px",
              color: "#475569",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>0-20</div>
              <div>{t("src_client_pages_volatilityindexpage__l242__h17")}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>20-40</div>
              <div>{t("src_client_pages_volatilityindexpage__l246__h18")}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>40-60</div>
              <div>{t("src_client_pages_volatilityindexpage__l250__h19")}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>60-80</div>
              <div>{t("src_client_pages_volatilityindexpage__l254__h20")}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>80-100</div>
              <div>{t("src_client_pages_volatilityindexpage__l258__h21")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Volatility Term Structure */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">{t("src_client_pages_volatilityindexpage__l267__h22")}</p>
          <h2>{t("src_client_pages_volatilityindexpage__l268__h23")}</h2>
        </div>
        <div
          style={{
            padding: "32px",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <p style={{ color: "#475569", fontSize: "14px", marginBottom: "24px" }}>
            Implied volatility across different option expiration dates shows market expectations for future price swings.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "12px",
            }}
          >
            {[
              { label: "1-Week IV", value: "11.2%" },
              { label: "1-Month IV", value: "13.8%" },
              { label: "3-Month IV", value: "15.4%" },
              { label: "6-Month IV", value: "16.8%" },
              { label: "1-Year IV", value: "17.2%" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "16px",
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "12px", color: "#475569", marginBottom: "8px" }}>{item.label}</p>
                <strong style={{ fontSize: "18px" }}>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insights & Actions */}
      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">{t("src_client_pages_volatilityindexpage__l316__h24")}</p>
          <h3>{t("src_client_pages_volatilityindexpage__l317__h25")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_volatilityindexpage__l319__h26")}</li>
            <li>{t("src_client_pages_volatilityindexpage__l320__h27")}</li>
            <li>{t("src_client_pages_volatilityindexpage__l321__h28")}</li>
            <li>{t("src_client_pages_volatilityindexpage__l322__h29")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{t("src_client_pages_volatilityindexpage__l326__h30")}</p>
          <h3>{t("src_client_pages_volatilityindexpage__l327__h31")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_volatilityindexpage__l329__h32")}</li>
            <li>{t("src_client_pages_volatilityindexpage__l330__h33")}</li>
            <li>{t("src_client_pages_volatilityindexpage__l331__h34")}</li>
            <li>{t("src_client_pages_volatilityindexpage__l332__h35")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{t("src_client_pages_volatilityindexpage__l336__h36")}</p>
          <h3>{t("src_client_pages_volatilityindexpage__l337__h37")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_volatilityindexpage__l339__h38")}</li>
            <li>{t("src_client_pages_volatilityindexpage__l340__h39")}</li>
            <li>{t("src_client_pages_volatilityindexpage__l341__h40")}</li>
            <li>{t("src_client_pages_volatilityindexpage__l342__h41")}</li>
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
        <p className="eyebrow">{t("src_client_pages_volatilityindexpage__l358__h42")}</p>
        <h3>{t("src_client_pages_volatilityindexpage__l359__h43")}</h3>
        <p style={{ color: "#475569", marginTop: "8px", marginBottom: "16px" }}>
          Use volatility metrics to adjust position sizing and hedge strategies
        </p>
        <Link to="/dashboard" className="primary-action" style={{ textDecoration: "none" }}>
          View Risk Dashboard
        </Link>
      </section>
    </div>
  );
};

export default VolatilityIndexPage;
