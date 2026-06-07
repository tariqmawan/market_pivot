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
import { translateStatic } from "../i18n/translate";



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

const sectorKey = (sectorId: string, field: string) => `sectorspagenew.sectors.${sectorId}.${field}`;
const sectorArrayKey = (sectorId: string, field: string, value: string) =>
  `sectorspagenew.sectors.${sectorId}.${field}.${value.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "").toLowerCase()}`;

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
    return { industry, key: sectorArrayKey(sectorId, "industries", industry), weight: value };
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
  const tx = (key: string, fallback: string) => translateStatic(t, key, fallback);
  const sectorName = (s: Sector) => tx(s.nameKey, s.name);
  const sectorSummary = (s: Sector) => tx(sectorKey(s.id, "summary"), s.summary);
  const sectorDescription = (s: Sector) => tx(sectorKey(s.id, "description"), s.description);
  const sectorCategory = (s: Sector) => tx(`sectorspagenew.categories.${s.category}`, s.category);
  const sectorVolatility = (s: Sector) => tx(`sectorspagenew.volatility.${s.volatility}`, s.volatility);
  const sectorInvestorProfile = (s: Sector) => tx(sectorKey(s.id, "investorProfile"), s.investorProfile);
  const regionLabel = (region: string) => tx(`sectorspagenew.regions.${region}`, region.replace(/-/g, " "));
  const newsThemeLabel = (s: Sector, theme: string) => tx(sectorArrayKey(s.id, "newsThemes", theme), theme);
  const { sectorId } = useParams();
  const sector = sectors.find((s) => s.id.toLowerCase() === (sectorId ?? "").toLowerCase());

  if (!sector) {
    return (
      <div className="page sectors-list">
        <section className="coverage-hero">
          <div>
            <p className="eyebrow">{t("sectorspagenew.h0_l94")}</p>
            <h1>{t("sectorspagenew.h1")}</h1>
            <p>{t("sectorspagenew.h0_l100")}</p>
          </div>
          <div className="metric-strip">
            <div className="metric-tile"><span>{t("sectorspagenew.h3")}</span><strong>{sectors.length}</strong></div>
            <div className="metric-tile"><span>{t("sectorspagenew.h4")}</span><strong>{sectorName([...sectors].sort((a,b) => b.performanceYtd - a.performanceYtd)[0])}</strong></div>
            <div className="metric-tile"><span>{t("sectorspagenew.h5")}</span><strong>{formatMoney(sectors.reduce((s, sec) => s + sec.marketCapUSD, 0))}</strong></div>
          </div>
        </section>

        <section className="sectors-list-grid">
          {sectors.map((s) => (
            <Link key={s.id} to={`/sectors/${s.id}`} className="sector-list-card">
              <div className="sector-icon">{SECTOR_ICONS[s.id.toLowerCase()] ?? <HiComputerDesktop size={28} />}</div>
              <div className="sector-info">
                <div className="sector-info-top">
                  <h3>{sectorName(s)}</h3>
                  <span className="sector-cat-pill">{sectorCategory(s)}</span>
                </div>
                <p>{sectorSummary(s)}</p>
                <div className="sector-info-stats">
                  <div><span>{t("sectorspagenew.h6")}</span><strong className={s.performanceYtd >= 0 ? "positive" : "negative"}>{formatSignedPercent(s.performanceYtd)}</strong></div>
                  <div><span>{t("sectorspagenew.h7")}</span><strong>{s.peRatio.toFixed(1)}</strong></div>
                  <div><span>{t("sectorspagenew.h8")}</span><strong>{formatMoney(s.marketCapUSD)}</strong></div>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="sector-rotation">
          <h2>{t("sectorspagenew.h9")}</h2>
          <div className="rotation-grid">
            {rotationAnalysis().map((s) => (
              <div key={s.id} className={`rotation-card ${s.momentum > 2 ? "hot" : s.momentum < -2 ? "cold" : "neutral"}`}>
                <span className="rotation-icon">{SECTOR_ICONS[s.id.toLowerCase()] ?? <HiComputerDesktop size={28} />}</span>
                <strong>{sectorName(s)}</strong>
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
            <HiArrowLeft size={14} /> {t("sectorspagenew.h11")}
          </Link>

          {/* Eyebrow badges */}
          <div className="sector-hero-badges">
            <span className="sector-cat-pill">{sectorCategory(sector)}</span>
            <span className="sector-vol-pill">{t("sectorspagenew.volatilityLabel")}: {sectorVolatility(sector)}</span>
          </div>

          {/* Title with icon badge */}
          <div className="sector-hero-title-row">
            <div className="sector-title-icon-badge">
              {SECTOR_ICONS[sector.id.toLowerCase()] ?? <HiComputerDesktop size={28} />}
            </div>
            <h1>{sectorName(sector)}</h1>
          </div>

          <p className="sector-hero-desc">{sectorDescription(sector)}</p>

          {/* Investor profile */}
          <div className="sector-investor-row">
            <HiUser size={13} />
            <span>{sectorInvestorProfile(sector)}</span>
          </div>
        </div>

        {/* Metric cards row */}
        <div className="sector-hero-metrics">
          <div className="sector-metric-card">
            <span>{t("sectorspagenew.h12")}</span>
            <strong>{formatMoney(sector.marketCapUSD)}</strong>
          </div>
          <div className="sector-metric-card">
            <span>{t("sectorspagenew.h13")}</span>
            <strong className={sector.performanceYtd >= 0 ? "positive" : "negative"}>
              {formatSignedPercent(sector.performanceYtd)}
            </strong>
          </div>
          <div className="sector-metric-card">
            <span>{t("sectorspagenew.h23")}</span>
            <strong>{sector.peRatio.toFixed(1)}</strong>
          </div>
          <div className="sector-metric-card">
            <span>{t("sectorspagenew.dividendYield")}</span>
            <strong>{sector.dividendYield.toFixed(2)}%</strong>
          </div>
        </div>
      </section>

      <section className="sector-chart-section">
        <h2>{t("sectorspagenew.h16")}</h2>
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
          <h3>{t("sectorspagenew.h17")}</h3>
          <div className="company-list">
            {sector.topCompanies.map((company, i) => {
              const performance = ((hashString(company) % 200) - 100) / 10;
              return (
                <div key={company} className="company-row">
                  <span className="company-rank">{i + 1}</span>
                  <div className="company-info">
                    <strong>{company}</strong>
                    <span>{t("sectorspagenew.h12")}: {formatMoney(100e9 + hashString(company) * 1e7)}</span>
                  </div>
                  <em className={performance >= 0 ? "positive" : "negative"}>{formatSignedPercent(performance)}</em>
                </div>
              );
            })}
          </div>
        </div>
        <div className="sector-card-block">
          <h3>{t("sectorspagenew.h18")}</h3>
          <div className="etf-list">
            {sector.etfs.map((etf) => {
              const performance = ((hashString(etf) % 200) - 100) / 10;
              return (
                <Link key={etf} to={`/screener?type=etf&symbol=${etf}`} className="etf-row">
                  <div>
                    <strong>{etf}</strong>
                    <span>{t("sectorspagenew.etfLabel")} • {formatMoney((2 + hashString(etf) % 80) * 1e9)} {t("sectorspagenew.aum")}</span>
                  </div>
                  <em className={performance >= 0 ? "positive" : "negative"}>{formatSignedPercent(performance)}</em>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="sector-card-block">
          <h3>{t("sectorspagenew.h19")}</h3>
          <div className="industry-list">
            {industries.map((ind) => (
              <div key={ind.industry} className="industry-row">
                <span>{tx(ind.key, ind.industry)}</span>
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
          <h3>{t("sectorspagenew.h20")}</h3>
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
          <h3>{t("sectorspagenew.h21")}</h3>
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
          <h3>{t("sectorspagenew.h22")}</h3>
          <div className="valuation-list">
            <div><span>{t("sectorspagenew.h23")}</span><strong>{valuation.pe.toFixed(1)}</strong></div>
            <div><span>{t("sectorspagenew.h24")}</span><strong>{valuation.peg}</strong></div>
            <div><span>{t("sectorspagenew.h25")}</span><strong>{valuation.pb}</strong></div>
            <div><span>{t("sectorspagenew.h26")}</span><strong>{valuation.ps}</strong></div>
            <div><span>{t("sectorspagenew.h27")}</span><strong>{valuation.evEbitda}</strong></div>
            <div><span>{t("sectorspagenew.h28")}</span><strong>{valuation.fcfYield}%</strong></div>
            <div><span>{t("sectorspagenew.h29")}</span><strong>{valuation.roe}%</strong></div>
          </div>
        </div>
      </section>

      <section className="sector-card-block">
        <h3>{t("sectorspagenew.h30")}</h3>
        <div className="related-themes">
          <div>
            <h4>{t("sectorspagenew.h31")}</h4>
            <div className="tag-cloud">
              {sector.relatedRegions.map((r) => (
                <Link key={r} to={`/regions/${r}`} className="region-tag">{regionLabel(r)}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4>{t("sectorspagenew.h32")}</h4>
            <div className="tag-cloud">
              {sector.newsThemes.map((theme) => <span key={theme} className="theme-tag">{newsThemeLabel(sector, theme)}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="sector-card-block">
        <h3>{t("sectorspagenew.h33")}</h3>
        <div className="forex-news-grid">
          {[
            { title: t("sectorspagenew.news.rotation", { sector: sectorName(sector) }), source: "Reuters", tag: sectorName(sector) },
            { title: t("sectorspagenew.news.earnings", { company: sector.topCompanies[0] }), source: "Bloomberg", tag: t("sectorspagenew.newsTags.earnings") },
            { title: t("sectorspagenew.news.analyst", { sector: sectorName(sector) }), source: "FT", tag: t("sectorspagenew.newsTags.analyst") },
            { title: t("sectorspagenew.news.flows", { etf: sector.etfs[0], sector: sectorName(sector) }), source: "WSJ", tag: t("sectorspagenew.newsTags.flows") },
            { title: t("sectorspagenew.news.regulation", { sector: sectorName(sector) }), source: "Bloomberg", tag: t("sectorspagenew.newsTags.regulation") },
            { title: t("sectorspagenew.news.strategic", { company: sector.topCompanies[1] }), source: "CNBC", tag: t("sectorspagenew.newsTags.strategic") },
          ].map((n, i) => (
            <article key={i} className="forex-news-card">
              <span className="news-tag">{n.tag}</span>
              <h4>{n.title}</h4>
              <div className="news-meta"><span>{n.source}</span><span>{t("forex:hoursAgo", "", { count: i + 1 })}</span></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SectorsPage;
