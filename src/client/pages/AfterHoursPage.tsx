import React from "react";
import { Link } from "react-router-dom";
import exchangesData from "../../data/exchanges.json";
import type { StockExchange } from "../../types";
import "../styles/index.css";

const exchanges = (exchangesData as any).exchanges as StockExchange[];

const formatSignedPercent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const AfterHoursPage: React.FC = () => {
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
          <p className="eyebrow">Extended Trading</p>
          <h1>After-Hours Market Activity</h1>
          <p>Track earnings reactions, after-hours movers, and extended session volume for US equities.</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>Session Status</span>
            <strong>Active</strong>
          </div>
          <div className="metric-tile">
            <span>Closing Time</span>
            <strong>6:00 PM ET</strong>
          </div>
          <div className="metric-tile">
            <span>Volume</span>
            <strong>~520M</strong>
          </div>
        </div>
      </section>

      {/* After-Hours Movers */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">After-Hours Movements</p>
          <h2>Top Movers</h2>
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
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Symbol</th>
                <th style={{ padding: "12px", textAlign: "left", fontWeight: 600 }}>Company</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Regular Close</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>After-Hours</th>
                <th style={{ padding: "12px", textAlign: "right", fontWeight: 600 }}>Change</th>
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
          <p className="eyebrow">Corporate Events</p>
          <h2>Earnings Reports & Reactions</h2>
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
        <p className="eyebrow">Session Details</p>
        <h3>Understanding After-Hours Trading</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <div>
            <strong>Trading Hours</strong>
            <p style={{ color: "#475569", fontSize: "14px", marginTop: "4px" }}>4:00 PM - 8:00 PM ET</p>
          </div>
          <div>
            <strong>Liquidity</strong>
            <p style={{ color: "#475569", fontSize: "14px", marginTop: "4px" }}>Lower volume than regular hours</p>
          </div>
          <div>
            <strong>Spreads</strong>
            <p style={{ color: "#475569", fontSize: "14px", marginTop: "4px" }}>Wider bid-ask spreads</p>
          </div>
          <div>
            <strong>Volatility</strong>
            <p style={{ color: "#475569", fontSize: "14px", marginTop: "4px" }}>Can be higher on earnings</p>
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
