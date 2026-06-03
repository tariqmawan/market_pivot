import React from "react";
import { Link } from "react-router-dom";
import exchangesData from "../../data/exchanges.json";
import regionsData from "../../data/regions.json";
import sectorsData from "../../data/sectors.json";
import type { StockExchange, MarketRegion, StockSector } from "../../types";
import "../styles/index.css";
import { useI18n } from "../i18n";



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
  const { t } = useI18n();
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
          <p className="eyebrow">{t("src_client_pages_heatmapspage__l159__h0")}</p>
          <h1>{t("src_client_pages_heatmapspage__l160__h1")}</h1>
          <p>{t("src_client_pages_heatmapspage__l165_h0")}</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>{t("src_client_pages_heatmapspage__l165__h3")}</span>
            <strong>{exchanges.length}</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_heatmapspage__l169__h4")}</span>
            <strong>{sectors.length}</strong>
          </div>
          <div className="metric-tile">
            <span>{t("src_client_pages_heatmapspage__l173__h5")}</span>
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
          <p className="eyebrow">{t("src_client_pages_heatmapspage__l275__h6")}</p>
          <h3>{t("src_client_pages_heatmapspage__l276__h7")}</h3>
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
              <strong>{t("src_client_pages_heatmapspage__l295__h8")}</strong>
              <p style={{ fontSize: "12px", color: "#475569" }}>{t("src_client_pages_heatmapspage__l296__h9")}</p>
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
              <strong>{t("src_client_pages_heatmapspage__l309__h10")}</strong>
              <p style={{ fontSize: "12px", color: "#475569" }}>{t("src_client_pages_heatmapspage__l310__h11")}</p>
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
              <strong>{t("src_client_pages_heatmapspage__l323__h12")}</strong>
              <p style={{ fontSize: "12px", color: "#475569" }}>{t("src_client_pages_heatmapspage__l324__h13")}</p>
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
              <strong>{t("src_client_pages_heatmapspage__l337__h14")}</strong>
              <p style={{ fontSize: "12px", color: "#475569" }}>{t("src_client_pages_heatmapspage__l338__h15")}</p>
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
              <strong>{t("src_client_pages_heatmapspage__l351__h16")}</strong>
              <p style={{ fontSize: "12px", color: "#475569" }}>{t("src_client_pages_heatmapspage__l352__h17")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Panel */}
      <section className="intelligence-grid" style={{ marginTop: "48px" }}>
        <div className="intelligence-panel">
          <p className="eyebrow">{t("src_client_pages_heatmapspage__l361__h18")}</p>
          <h3>{t("src_client_pages_heatmapspage__l362__h19")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_heatmapspage__l364__h20")}</li>
            <li>{t("src_client_pages_heatmapspage__l365__h21")}</li>
            <li>{t("src_client_pages_heatmapspage__l366__h22")}</li>
            <li>{t("src_client_pages_heatmapspage__l367__h23")}</li>
            <li>{t("src_client_pages_heatmapspage__l368__h24")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{t("src_client_pages_heatmapspage__l372__h25")}</p>
          <h3>{t("src_client_pages_heatmapspage__l373__h26")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>{t("src_client_pages_heatmapspage__l375__h27")}</li>
            <li>{t("src_client_pages_heatmapspage__l376__h28")}</li>
            <li>{t("src_client_pages_heatmapspage__l377__h29")}</li>
            <li>{t("src_client_pages_heatmapspage__l378__h30")}</li>
            <li>{t("src_client_pages_heatmapspage__l379__h31")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{t("src_client_pages_heatmapspage__l383__h32")}</p>
          <h3>{t("src_client_pages_heatmapspage__l384__h33")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", paddingLeft: "20px" }}>
            <li>Time period selection (1D, 1W, 1M, YTD, 1Y)</li>
            <li>{t("src_client_pages_heatmapspage__l387__h34")}</li>
            <li>{t("src_client_pages_heatmapspage__l388__h35")}</li>
            <li>{t("src_client_pages_heatmapspage__l389__h36")}</li>
            <li>{t("src_client_pages_heatmapspage__l390__h37")}</li>
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
        <p className="eyebrow">{t("src_client_pages_heatmapspage__l406__h38")}</p>
        <h3>{t("src_client_pages_heatmapspage__l407__h39")}</h3>
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
