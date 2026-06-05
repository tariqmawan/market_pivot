import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  HiArrowLeft, HiUser, HiComputerDesktop, HiCpuChip, HiBanknotes,
  HiBolt, HiBeaker, HiHome, HiTruck, HiShieldCheck, HiCube, HiHeart,
  HiBuildingOffice2, HiRocketLaunch, HiWrench,
} from "react-icons/hi2";
import sectorsData from "../../data/sectors.json";
import LineChart from "../components/LineChart";
import ChartJSLine from "../components/ChartJSLine";
import { generateSeriesForSymbol, formatSignedPercent, formatMoney } from "../lib/chartSeries";
import "./SectorsPageNew.css";
import { useI18n } from "../i18n";



const SECTOR_ICONS: Record<string, React.ReactNode> = {
  technology:       <HiComputerDesktop size={28} />,
  banking:          <HiBanknotes size={28} />,
  ai:               <HiCpuChip size={28} />,
  energy:           <HiBolt size={28} />,
  healthcare:       <HiHeart size={28} />,
  mining:           <HiCube size={28} />,
  "real-estate":    <HiHome size={28} />,
  semiconductor:    <HiCpuChip size={28} />,
  ev:               <HiTruck size={28} />,
  "electric-vehicles": <HiTruck size={28} />,
  defence:          <HiShieldCheck size={28} />,
  defense:          <HiShieldCheck size={28} />,
  pharma:           <HiBeaker size={28} />,
  realestate:       <HiHome size={28} />,
  fintech:          <HiBanknotes size={28} />,
  aerospace:        <HiRocketLaunch size={28} />,
  industrial:       <HiWrench size={28} />,
  "real estate":    <HiHome size={28} />,
};

type Sector = {
  id: string;
  name: string;
  icon: string;
  category: "Growth" | "Cyclical" | "Defensive" | "Thematic" | "Income";
  summary: string;
  description: string;
  topCompanies: string[];
  etfs: string[];
  marketCapUSD: number;
  peRatio: number;
  performanceYtd: number;
  dividendYield: number;
  trendingStocks: string[];
  dividendLeaders: string[];
  relatedRegions: string[];
  newsThemes: string[];
  volatility: string;
  investorProfile: string;
};

const sectors = (sectorsData as { sectors: Sector[] }).sectors;

const hashString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const sectorIndustryBreakdown = (sectorId: string) => {
  const seed = hashString(sectorId);
  const industryMap: Record<string, string[]> = {
    technology: ["Software", "Hardware", "Semiconductors", "Cybersecurity", "Cloud"],
    banking: ["Money Center Banks", "Regional Banks", "Investment Banks", "Insurance", "Payments"],
    ai: ["GPU & Accelerators", "Cloud AI", "AI Software", "Robotics", "Data Platforms"],
    energy: ["Integrated Oil & Gas", "E&P", "Refining", "Pipelines", "Renewables"],
    healthcare: ["Pharma", "Biotech", "Devices", "Diagnostics", "Health Insurance"],
    mining: ["Gold", "Copper", "Lithium", "Iron Ore", "Diversified"],
    "real-estate": ["Residential", "Commercial", "Industrial REIT", "Data Center REIT", "Healthcare REIT"],
    semiconductor: ["Logic", "Memory", "Foundry", "Equipment", "Analog"],
    ev: ["Pure EV", "Hybrid", "Charging", "Batteries", "EV Materials"],
  };
  const baseIndustries = industryMap[sectorId] ?? ["Large Cap", "Mid Cap", "Small Cap", "Emerging", "Dividend"];
  return baseIndustries.map((industry, i) => {
    const value = 8 + ((seed + i * 31) % 28);
    return { industry, weight: value };
  });
};

const sectorPerformance = (sectorId: string) => {
  return ["1W", "1M", "3M", "6M", "YTD", "1Y", "3Y", "5Y"].map((period, i) => {
    const seed = hashString(`${sectorId}-${period}`);
    return { period, change: ((seed % 400) - 100) / 10 };
  });
};

const rotationAnalysis = () => {
  // Mock rotation: which sectors are hot/cooling
  return sectors.map((s) => {
    const seed = hashString(s.id);
    const momentum = ((seed % 200) - 100) / 10; // -10 to +10
    const trend = ((seed % 200) - 100) / 10;
    return { ...s, momentum, trend };
  }).sort((a, b) => b.momentum - a.momentum);
};

const valuationMetrics = (sector: Sector) => ({
  pe: sector.peRatio,
  peg: (sector.peRatio / Math.max(1, sector.performanceYtd)).toFixed(2),
  pb: (2.5 + (hashString(sector.id) % 30) / 10).toFixed(2),
  ps: (1.5 + (hashString(sector.id) % 80) / 10).toFixed(2),
  evEbitda: (8 + (hashString(sector.id) % 150) / 10).toFixed(2),
  fcfYield: (3 + (hashString(sector.id) % 50) / 10).toFixed(2),
  roe: (8 + (hashString(sector.id) % 250) / 10).toFixed(2),
});

const SectorsPage: React.FC = () => {
  const { t } = useI18n();
  const { sectorId } = useParams();
  const sector = sectors.find((s) => s.id.toLowerCase() === (sectorId ?? "").toLowerCase());

  if (!sector) {
    return (
      <div className="page sectors-list">
        <section className="coverage-hero">
          <div>
            <p className="eyebrow">{t("src_client_pages_sectorspagenew__l94__h0")}</p>
            <h1>{t("src_client_pages_sectorspagenew__l95__h1")}</h1>
            <p>{t("src_client_pages_sectorspagenew__l100_h0")}</p>
          </div>
          <div className="metric-strip">
            <div className="metric-tile"><span>{t("src_client_pages_sectorspagenew__l99__h3")}</span><strong>{sectors.length}</strong></div>
            <div className="metric-tile"><span>{t("src_client_pages_sectorspagenew__l100__h4")}</span><strong>{sectors.sort((a,b) => b.performanceYtd - a.performanceYtd)[0].name}</strong></div>
            <div className="metric-tile"><span>{t("src_client_pages_sectorspagenew__l101__h5")}</span><strong>{formatMoney(sectors.reduce((s, sec) => s + sec.marketCapUSD, 0))}</strong></div>
          </div>
        </section>

        <section className="sectors-list-grid">
          {sectors.map((s) => (
            <Link key={s.id} to={`/sectors/${s.id}`} className="sector-list-card">
              <div className="sector-icon">{s.icon}</div>
              <div className="sector-info">
                <div className="sector-info-top">
                  <h3>{s.name}</h3>
                  <span className="sector-cat-pill">{s.category}</span>
                </div>
                <p>{s.summary}</p>
                <div className="sector-info-stats">
                  <div><span>{t("src_client_pages_sectorspagenew__l116__h6")}</span><strong className={s.performanceYtd >= 0 ? "positive" : "negative"}>{formatSignedPercent(s.performanceYtd)}</strong></div>
                  <div><span>{t("src_client_pages_sectorspagenew__l117__h7")}</span><strong>{s.peRatio.toFixed(1)}</strong></div>
                  <div><span>{t("src_client_pages_sectorspagenew__l118__h8")}</span><strong>{formatMoney(s.marketCapUSD)}</strong></div>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="sector-rotation">
          <h2>{t("src_client_pages_sectorspagenew__l126__h9")}</h2>
          <div className="rotation-grid">
            {rotationAnalysis().map((s) => (
              <div key={s.id} className={`rotation-card ${s.momentum > 2 ? "hot" : s.momentum < -2 ? "cold" : "neutral"}`}>
                <span className="rotation-icon">{s.icon}</span>
                <strong>{s.name}</strong>
                <em className={s.momentum >= 0 ? "positive" : "negative"}>
                  {s.momentum >= 0 ? "↑" : "↓"} {formatSignedPercent(s.momentum)}
                </em>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const series = generateSeriesForSymbol(sector.id, 100, "1Y");
  const industries = sectorIndustryBreakdown(sector.id);
  const periods = sectorPerformance(sector.id);
  const valuation = valuationMetrics(sector);

  return (
    <div className="page sector-detail">
      <section className="sector-hero">
        <div className="sector-hero-inner">
          {/* Top nav */}
          <Link to="/sectors" className="back-link">
            <HiArrowLeft size={14} /> All Sectors
          </Link>

          {/* Eyebrow badges */}
          <div className="sector-hero-badges">
            <span className="sector-cat-pill">{sector.category}</span>
            <span className="sector-vol-pill">Volatility: {sector.volatility}</span>
          </div>

          {/* Title with icon badge */}
          <div className="sector-hero-title-row">
            <div className="sector-title-icon-badge">
              {SECTOR_ICONS[sector.id.toLowerCase()] ?? <HiComputerDesktop size={28} />}
            </div>
            <h1>{sector.name}</h1>
          </div>

          <p className="sector-hero-desc">{sector.description}</p>

          {/* Investor profile */}
          <div className="sector-investor-row">
            <HiUser size={13} />
            <span>{sector.investorProfile}</span>
          </div>
        </div>

        {/* Metric cards row */}
        <div className="sector-hero-metrics">
          <div className="sector-metric-card">
            <span>Market Cap</span>
            <strong>{formatMoney(sector.marketCapUSD)}</strong>
          </div>
          <div className="sector-metric-card">
            <span>YTD</span>
            <strong className={sector.performanceYtd >= 0 ? "positive" : "negative"}>
              {formatSignedPercent(sector.performanceYtd)}
            </strong>
          </div>
          <div className="sector-metric-card">
            <span>P/E Ratio</span>
            <strong>{sector.peRatio.toFixed(1)}</strong>
          </div>
          <div className="sector-metric-card">
            <span>Div. Yield</span>
            <strong>{sector.dividendYield.toFixed(2)}%</strong>
          </div>
        </div>
      </section>

      <section className="sector-chart-section">
        <h2>{t("src_client_pages_sectorspagenew__l170__h16")}</h2>
        <div className="sector-chart">
          {window.Chart ? (
            <ChartJSLine
              data={series}
              width={1200}
              height={280}
              color={sector.performanceYtd >= 0 ? "#10b981" : "#ef4444"}
            />
          ) : (
            <LineChart
              data={series}
              width={1200}
              height={280}
              color={sector.performanceYtd >= 0 ? "#10b981" : "#ef4444"}
            />
          )}
        </div>
        <div className="period-grid">
          {periods.map((p) => (
            <div key={p.period} className="period-card">
              <span>{p.period}</span>
              <strong className={p.change >= 0 ? "positive" : "negative"}>{formatSignedPercent(p.change)}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="sector-row-grid">
        <div className="sector-card-block">
          <h3>{t("src_client_pages_sectorspagenew__l200__h17")}</h3>
          <div className="company-list">
            {sector.topCompanies.map((company, i) => {
              const performance = ((hashString(company) % 200) - 100) / 10;
              return (
                <div key={company} className="company-row">
                  <span className="company-rank">{i + 1}</span>
                  <div className="company-info">
                    <strong>{company}</strong>
                    <span>Mkt Cap: {formatMoney(100e9 + hashString(company) * 1e7)}</span>
                  </div>
                  <em className={performance >= 0 ? "positive" : "negative"}>{formatSignedPercent(performance)}</em>
                </div>
              );
            })}
          </div>
        </div>
        <div className="sector-card-block">
          <h3>{t("src_client_pages_sectorspagenew__l218__h18")}</h3>
          <div className="etf-list">
            {sector.etfs.map((etf) => {
              const performance = ((hashString(etf) % 200) - 100) / 10;
              return (
                <Link key={etf} to={`/screener?type=etf&symbol=${etf}`} className="etf-row">
                  <div>
                    <strong>{etf}</strong>
                    <span>ETF • {formatMoney((2 + hashString(etf) % 80) * 1e9)} AUM</span>
                  </div>
                  <em className={performance >= 0 ? "positive" : "negative"}>{formatSignedPercent(performance)}</em>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="sector-card-block">
          <h3>{t("src_client_pages_sectorspagenew__l235__h19")}</h3>
          <div className="industry-list">
            {industries.map((ind) => (
              <div key={ind.industry} className="industry-row">
                <span>{ind.industry}</span>
                <div className="industry-bar">
                  <div className="industry-fill" style={{ width: `${ind.weight * 2}%` }} />
                </div>
                <strong>{ind.weight}%</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sector-row-grid">
        <div className="sector-card-block">
          <h3>{t("src_client_pages_sectorspagenew__l252__h20")}</h3>
          <div className="trending-list">
            {sector.trendingStocks.map((stock) => {
              const change = ((hashString(stock) % 200) - 100) / 10;
              return (
                <Link key={stock} to={`/stocks/${stock}`} className="trending-row">
                  <strong>{stock}</strong>
                  <em className={change >= 0 ? "positive" : "negative"}>{formatSignedPercent(change)}</em>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="sector-card-block">
          <h3>{t("src_client_pages_sectorspagenew__l266__h21")}</h3>
          <div className="trending-list">
            {sector.dividendLeaders.map((stock) => {
              const change = ((hashString(stock) % 200) - 100) / 10;
              const yieldPct = (1 + (hashString(stock) % 50) / 10).toFixed(2);
              return (
                <div key={stock} className="trending-row dividend">
                  <strong>{stock}</strong>
                  <span className="yield-pill">{yieldPct}%</span>
                  <em className={change >= 0 ? "positive" : "negative"}>{formatSignedPercent(change)}</em>
                </div>
              );
            })}
          </div>
        </div>
        <div className="sector-card-block">
          <h3>{t("src_client_pages_sectorspagenew__l282__h22")}</h3>
          <div className="valuation-list">
            <div><span>{t("src_client_pages_sectorspagenew__l284__h23")}</span><strong>{valuation.pe.toFixed(1)}</strong></div>
            <div><span>{t("src_client_pages_sectorspagenew__l285__h24")}</span><strong>{valuation.peg}</strong></div>
            <div><span>{t("src_client_pages_sectorspagenew__l286__h25")}</span><strong>{valuation.pb}</strong></div>
            <div><span>{t("src_client_pages_sectorspagenew__l287__h26")}</span><strong>{valuation.ps}</strong></div>
            <div><span>{t("src_client_pages_sectorspagenew__l288__h27")}</span><strong>{valuation.evEbitda}</strong></div>
            <div><span>{t("src_client_pages_sectorspagenew__l289__h28")}</span><strong>{valuation.fcfYield}%</strong></div>
            <div><span>{t("src_client_pages_sectorspagenew__l290__h29")}</span><strong>{valuation.roe}%</strong></div>
          </div>
        </div>
      </section>

      <section className="sector-card-block">
        <h3>{t("src_client_pages_sectorspagenew__l296__h30")}</h3>
        <div className="related-themes">
          <div>
            <h4>{t("src_client_pages_sectorspagenew__l299__h31")}</h4>
            <div className="tag-cloud">
              {sector.relatedRegions.map((r) => (
                <Link key={r} to={`/regions/${r}`} className="region-tag">{r.replace(/-/g, " ")}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4>{t("src_client_pages_sectorspagenew__l307__h32")}</h4>
            <div className="tag-cloud">
              {sector.newsThemes.map((t) => <span key={t} className="theme-tag">{t}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="sector-card-block">
        <h3>{t("src_client_pages_sectorspagenew__l316__h33")}</h3>
        <div className="forex-news-grid">
          {[
            { title: `${sector.name} sector rotation accelerates as macro data shifts`, source: "Reuters", tag: sector.name },
            { title: `${sector.topCompanies[0]} reports strong quarterly results, sector lifts`, source: "Bloomberg", tag: "Earnings" },
            { title: `Analyst update: ${sector.name} outlook remains constructive`, source: "FT", tag: "Analyst" },
            { title: `${sector.etfs[0]} sees record inflows amid ${sector.name.toLowerCase()} momentum`, source: "WSJ", tag: "Flows" },
            { title: `${sector.name} sector faces regulatory headwinds in Europe`, source: "Bloomberg", tag: "Regulation" },
            { title: `${sector.topCompanies[1]} announces strategic partnership`, source: "CNBC", tag: "Strategic" },
          ].map((n, i) => (
            <article key={i} className="forex-news-card">
              <span className="news-tag">{n.tag}</span>
              <h4>{n.title}</h4>
              <div className="news-meta"><span>{n.source}</span><span>{i + 1}h ago</span></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SectorsPage;
