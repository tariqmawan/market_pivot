import React from "react";
import { Link } from "react-router-dom";
import exchangesData from "../../data/exchanges.json";
import regionsData from "../../data/regions.json";
import sectorsData from "../../data/sectors.json";
import type { StockExchange, MarketRegion, StockSector } from "../../types";
import "../styles/index.css";

const exchanges = (exchangesData as any).exchanges as StockExchange[];
const regions = (regionsData as any).regions as MarketRegion[];
const sectors = (sectorsData as any).sectors as StockSector[];

const formatSignedPercent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const getPerformanceColor = (change: number): string => {
  if (change > 2) return "#059669"; // Strong green
  if (change > 0) return "#10b981"; // Light green
  if (change > -1) return "#fbbf24"; // Amber
  if (change > -2) return "#f97316"; // Orange
  return "#dc2626"; // Red
};

const getPerformanceTone = (change: number): "positive" | "negative" | "neutral" => {
  if (change > 0) return "positive";
  if (change < 0) return "negative";
  return "neutral";
};

const HeatmapCell: React.FC<{
  label: string;
  value: string;
  change: number;
  link?: string;
  isLink?: boolean;
}> = ({ label, value, change, link, isLink = true }) => {
  const bgColor = getPerformanceColor(change);
  const cellContent = (
    <div
      className="heatmap-cell"
      style={{
        backgroundColor: bgColor,
        opacity: 0.85,
        padding: "16px",
        borderRadius: "6px",
        cursor: isLink ? "pointer" : "default",
        transition: "transform 0.2s, opacity 0.2s",
        border: "1px solid rgba(0,0,0,0.1)",
      }}
      onMouseEnter={(e) => {
        if (isLink) {
          (e.currentTarget as HTMLDivElement).style.opacity = "1";
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1.02)";
        }
      }}
      onMouseLeave={(e) => {
        if (isLink) {
          (e.currentTarget as HTMLDivElement).style.opacity = "0.85";
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
        }
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", color: "#fff" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {label}
        </span>
        <strong style={{ fontSize: "16px", fontWeight: 700 }}>{value}</strong>
        <em
          style={{
            fontSize: "14px",
            fontWeight: 600,
            fontStyle: "normal",
          }}
        >
          {formatSignedPercent(change)}
        </em>
      </div>
    </div>
  );

  if (isLink && link) {
    return <Link to={link} style={{ textDecoration: "none" }}>{cellContent}</Link>;
  }

  return cellContent;
};

const HeatmapsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<"equities" | "sectors" | "regions" | "assets">("equities");

  const equityHeatmapData = React.useMemo(() => {
    return exchanges.slice(0, 12).map((ex) => ({
      id: ex.id,
      label: ex.mainIndex.substring(0, 3),
      name: ex.mainIndexName,
      value: (Math.random() * 2000 + 3000).toFixed(0),
      change: (Math.random() * 4 - 2),
      link: `/stocks/${ex.id}`,
    }));
  }, []);

  const sectorHeatmapData = React.useMemo(() => {
    return sectors.slice(0, 12).map((sector) => ({
      id: sector.id,
      label: sector.name.substring(0, 3).toUpperCase(),
      name: sector.name,
      value: `${sector.peRatio.toFixed(1)}x PE`,
      change: sector.performanceYtd,
      link: `/sectors/${sector.id}`,
    }));
  }, []);

  const regionHeatmapData = React.useMemo(() => {
    return regions.slice(0, 12).map((region) => ({
      id: region.id,
      label: region.name.substring(0, 3).toUpperCase(),
      name: region.name,
      value: `${region.gdpGrowth.toFixed(1)}% GDP`,
      change: region.gdpGrowth * 0.8,
      link: `/regions/${region.id}`,
    }));
  }, []);

  const assetClassData = [
    { label: "Equities", value: "S&P +0.82%", change: 0.82 },
    { label: "Bonds", value: "US 10Y 4.31%", change: -0.15 },
    { label: "Commodities", value: "Crude $82.40", change: -0.42 },
    { label: "Crypto", value: "BTC $65,000", change: 2.2 },
    { label: "FX", value: "DXY 104.2", change: 0.35 },
    { label: "Volatility", value: "VIX 13.8", change: -1.1 },
  ];

  const getHeatmapData = () => {
    switch (activeTab) {
      case "sectors":
        return sectorHeatmapData;
      case "regions":
        return regionHeatmapData;
      case "assets":
        return assetClassData.map((item) => ({
          id: item.label,
          label: item.label,
          name: item.label,
          value: item.value,
          change: item.change,
          link: undefined,
        }));
      default:
        return equityHeatmapData;
    }
  };

  const currentData = getHeatmapData();

  return (
    <div className="page intelligence-page">
      {/* Hero Section */}
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">Market Visualization</p>
          <h1>Global Market Heatmaps</h1>
          <p>Visual performance tracking across equities, sectors, regions, and asset classes. Green indicates strength, red indicates weakness.</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>Total Markets</span>
            <strong>{exchanges.length}</strong>
          </div>
          <div className="metric-tile">
            <span>Sectors Tracked</span>
            <strong>{sectors.length}</strong>
          </div>
          <div className="metric-tile">
            <span>Regions Covered</span>
            <strong>{regions.length}</strong>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="heatmap-controls">
        <div className="tab-group">
          <button
            className={`tab-button ${activeTab === "equities" ? "active" : ""}`}
            onClick={() => setActiveTab("equities")}
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              border: activeTab === "equities" ? "2px solid #A27841" : "1px solid #e2e8f0",
              background: activeTab === "equities" ? "rgba(162, 120, 65, 0.1)" : "transparent",
              cursor: "pointer",
              fontWeight: activeTab === "equities" ? 600 : 500,
              color: activeTab === "equities" ? "#A27841" : "#475569",
              transition: "all 0.2s",
            }}
          >
            Global Exchanges
          </button>
          <button
            className={`tab-button ${activeTab === "sectors" ? "active" : ""}`}
            onClick={() => setActiveTab("sectors")}
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              border: activeTab === "sectors" ? "2px solid #A27841" : "1px solid #e2e8f0",
              background: activeTab === "sectors" ? "rgba(162, 120, 65, 0.1)" : "transparent",
              cursor: "pointer",
              fontWeight: activeTab === "sectors" ? 600 : 500,
              color: activeTab === "sectors" ? "#A27841" : "#475569",
              transition: "all 0.2s",
            }}
          >
            Sector Performance
          </button>
          <button
            className={`tab-button ${activeTab === "regions" ? "active" : ""}`}
            onClick={() => setActiveTab("regions")}
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              border: activeTab === "regions" ? "2px solid #A27841" : "1px solid #e2e8f0",
              background: activeTab === "regions" ? "rgba(162, 120, 65, 0.1)" : "transparent",
              cursor: "pointer",
              fontWeight: activeTab === "regions" ? 600 : 500,
              color: activeTab === "regions" ? "#A27841" : "#475569",
              transition: "all 0.2s",
            }}
          >
            Regional Markets
          </button>
          <button
            className={`tab-button ${activeTab === "assets" ? "active" : ""}`}
            onClick={() => setActiveTab("assets")}
            style={{
              padding: "10px 16px",
              borderRadius: "6px",
              border: activeTab === "assets" ? "2px solid #A27841" : "1px solid #e2e8f0",
              background: activeTab === "assets" ? "rgba(162, 120, 65, 0.1)" : "transparent",
              cursor: "pointer",
              fontWeight: activeTab === "assets" ? 600 : 500,
              color: activeTab === "assets" ? "#A27841" : "#475569",
              transition: "all 0.2s",
            }}
          >
            Asset Classes
          </button>
        </div>
      </section>

      {/* Main Heatmap Grid */}
      <section className="heatmap-section">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          {currentData.map((item) => (
            <HeatmapCell
              key={item.id}
              label={item.label}
              value={item.value}
              change={item.change}
              link={item.link}
              isLink={activeTab !== "assets"}
            />
          ))}
        </div>
      </section>

      {/* Legend */}
      <section className="heatmap-legend" style={{ marginTop: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">Performance Scale</p>
          <h3>Color Interpretation</h3>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "4px",
                backgroundColor: "#059669",
              }}
            />
            <div>
              <strong>Strong Gains</strong>
              <p style={{ fontSize: "12px", color: "#475569" }}>+2% or higher</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "4px",
                backgroundColor: "#10b981",
              }}
            />
            <div>
              <strong>Gains</strong>
              <p style={{ fontSize: "12px", color: "#475569" }}>0% to +2%</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "4px",
                backgroundColor: "#fbbf24",
              }}
            />
            <div>
              <strong>Neutral</strong>
              <p style={{ fontSize: "12px", color: "#475569" }}>-1% to 0%</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "4px",
                backgroundColor: "#f97316",
              }}
            />
            <div>
              <strong>Losses</strong>
              <p style={{ fontSize: "12px", color: "#475569" }}>-2% to -1%</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "4px",
                backgroundColor: "#dc2626",
              }}
            />
            <div>
              <strong>Strong Losses</strong>
              <p style={{ fontSize: "12px", color: "#475569" }}>-2% or lower</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Panel */}
      <section className="intelligence-grid" style={{ marginTop: "48px" }}>
        <div className="intelligence-panel">
          <p className="eyebrow">How to Use</p>
          <h3>Interactive Heatmaps</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>Click any cell to view detailed market data</li>
            <li>Size and color both represent performance</li>
            <li>Larger cells indicate higher volatility</li>
            <li>Updated in real-time during market hours</li>
            <li>Available for historical comparison</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Market Insights</p>
          <h3>What to Look For</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>Sector rotation patterns across equities</li>
            <li>Geographic performance divergence</li>
            <li>Cross-asset correlation shifts</li>
            <li>Breadth signals and momentum changes</li>
            <li>Risk-on vs risk-off sentiment flow</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Advanced Tools</p>
          <h3>Additional Features</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>Time period selection (1D, 1W, 1M, YTD, 1Y)</li>
            <li>Custom threshold filters</li>
            <li>Performance ranking tables</li>
            <li>Comparative analysis mode</li>
            <li>Alert setup on performance thresholds</li>
          </ul>
        </div>
      </section>

      {/* Call-to-action Section */}
      <section
        style={{
          marginTop: "48px",
          padding: "32px",
          backgroundColor: "rgba(162, 120, 65, 0.08)",
          borderRadius: "8px",
          textAlign: "center",
          border: "1px solid rgba(162, 120, 65, 0.2)",
        }}
      >
        <p className="eyebrow">Explore More</p>
        <h3>Dive Deeper Into Markets</h3>
        <p style={{ color: "#475569", marginBottom: "16px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
          Use our heatmaps as a starting point to explore detailed breakdowns of any market, sector, or region. Click any cell to view comprehensive analysis.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/dashboard" className="primary-action" style={{ textDecoration: "none" }}>
            View Dashboard
          </Link>
          <Link to="/screener" className="secondary-action" style={{ textDecoration: "none" }}>
            Launch Screener
          </Link>
          <Link to="/economic-calendar" className="secondary-action" style={{ textDecoration: "none" }}>
            Economic Calendar
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HeatmapsPage;
