import React from "react";
import { Link } from "react-router-dom";
import exchangesData from "../../data/exchanges.json";
import type { StockExchange } from "../../types";
import "../styles/index.css";
import { useI18n } from "../i18n";



const exchanges = (exchangesData as any).exchanges as StockExchange[];

const formatSignedPercent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const AfterHoursPage: React.FC = () => {
  const { t } = useI18n();
  const afterHoursData = React.useMemo(() => {
    return [
      { symbol: "AAPL", name: "Apple Inc.", afterHours: 194.25, regular: 193.80, change: 0.45, changePercent: 0.23 },
      { symbol: "MSFT", name: "Microsoft Corp.", afterHours: 418.50, regular: 417.20, change: 1.30, changePercent: 0.31 },
      { symbol: "NVDA", name: "NVIDIA Corporation", afterHours: 128.75, regular: 127.40, change: 1.35, changePercent: 1.06 },
      { symbol: "TSLA", name: "Tesla Inc.", afterHours: 245.80, regular: 246.20, change: -0.40, changePercent: -0.16 },
      { symbol: "AMZN", name: "Amazon.com Inc.", afterHours: 182.90, regular: 182.10, change: 0.80, changePercent: 0.44 },
      { symbol: "META", name: "Meta Platforms", afterHours: 512.30, regular: 510.50, change: 1.80, changePercent: 0.35 },
    ];
  }, []);

  const earningsReports = [
    { symbol: "INTC", name: "Intel", time: "4:30 PM ET", status: "Pending" },
    { symbol: "AMD", name: "Advanced Micro Devices", time: "5:00 PM ET", status: "Today" },
    { symbol: "QCOM", name: "Qualcomm", time: "5:30 PM ET", status: "Today" },
  ];

  return (
    <div className="page intelligence-page">
      {/* Hero Section */}
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">{t("src_client_pages_afterhourspage__l34__h0")}</p>
          <h1>{t("src_client_pages_afterhourspage__l35__h1")}</h1>
          <p>{t("src_client_pages_afterhourspage__l36__h2")}</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>{t("src_client_pages_afterhourspage__l40__h3")}</span>
            <strong>{t("src_client_pages_afterhourspage__l41__h4")}</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_afterhourspage__l44__h5")}</span>
            <strong>{t("src_client_pages_afterhourspage__l45__h6")}</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_afterhourspage__l48__h7")}</span>
            <strong>{t("src_client_pages_afterhourspage__l49__h8")}</strong>
          </div>
        </div>
      </section>

      {/* After-Hours Movers */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">{t("src_client_pages_afterhourspage__l57__h9")}</p>
          <h2>{t("src_client_pages_afterhourspage__l58__h10")}</h2>
          <p style={{ color: "#475569", marginTop: "4px" }}>
            Stocks with significant price action during extended trading (4:00 PM - 8:00 PM ET)
          </p>
        </div>
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
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>{t("src_client_pages_afterhourspage__l75__h11")}</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>{t("src_client_pages_afterhourspage__l76__h12")}</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{t("src_client_pages_afterhourspage__l77__h13")}</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{t("src_client_pages_afterhourspage__l78__h14")}</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>{t("src_client_pages_afterhourspage__l79__h15")}</th>
              </tr>
            </thead>
            <tbody>
              {afterHoursData.map((stock) => (
                <tr key={stock.symbol} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>{stock.symbol}</td>
                  <td style={{ padding: "12px", color: "#475569" }}>{stock.name}</td>
                  <td style={{ padding: "12px", textAlign: "right", color: "#475569" }}>${stock.regular.toFixed(2)}</td>
                  <td style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>${stock.afterHours.toFixed(2)}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Earnings Reactions */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">{t("src_client_pages_afterhourspage__l109__h16")}</p>
          <h2>{t("src_client_pages_afterhourspage__l110__h17")}</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "12px",
          }}
        >
          {earningsReports.map((report) => (
            <div
              key={report.symbol}
              style={{
                padding: "16px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                backgroundColor: "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <strong style={{ fontSize: "16px" }}>{report.symbol}</strong>
                  <p style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>{report.name}</p>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "4px 8px",
                    backgroundColor: report.status === "Today" ? "rgba(10, 184, 129, 0.1)" : "rgba(162, 120, 65, 0.1)",
                    color: report.status === "Today" ? "#059669" : "#A27841",
                    borderRadius: "4px",
                  }}
                >
                  {report.status}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "8px" }}>
                Expected: {report.time}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Session Info */}
      <section
        style={{
          padding: "32px",
          backgroundColor: "rgba(162, 120, 65, 0.08)",
          borderRadius: "8px",
          border: "1px solid rgba(162, 120, 65, 0.2)",
        }}
      >
        <p className="eyebrow">{t("src_client_pages_afterhourspage__l164__h18")}</p>
        <h3>{t("src_client_pages_afterhourspage__l165__h19")}</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <div>
            <strong>{t("src_client_pages_afterhourspage__l175__h20")}</strong>
            <p style={{ color: "#475569", fontSize: "14px", marginTop: "4px" }}>{t("src_client_pages_afterhourspage__l176__h21")}</p>
          </div>
          <div>
            <strong>{t("src_client_pages_afterhourspage__l179__h22")}</strong>
            <p style={{ color: "#475569", fontSize: "14px", marginTop: "4px" }}>{t("src_client_pages_afterhourspage__l180__h23")}</p>
          </div>
          <div>
            <strong>{t("src_client_pages_afterhourspage__l183__h24")}</strong>
            <p style={{ color: "#475569", fontSize: "14px", marginTop: "4px" }}>{t("src_client_pages_afterhourspage__l184__h25")}</p>
          </div>
          <div>
            <strong>{t("src_client_pages_afterhourspage__l187__h26")}</strong>
            <p style={{ color: "#475569", fontSize: "14px", marginTop: "4px" }}>{t("src_client_pages_afterhourspage__l188__h27")}</p>
          </div>
        </div>
        <div style={{ marginTop: "20px" }}>
          <Link to="/news" className="primary-action" style={{ textDecoration: "none" }}>
            View Latest Earnings News
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AfterHoursPage;
