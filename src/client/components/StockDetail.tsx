import React from "react";
import { Link } from "react-router-dom";
import LineChart from "./LineChart";
import ChartJSLine from "./ChartJSLine";
import { generateSeriesForSymbol, formatMoney, formatSignedPercent, formatVolume } from "../lib/chartSeries";
import { useWatchlistStore } from "../stores/watchlistStore";
import { usePortfolioStore } from "../stores/portfolioStore";
import { useActivityStore } from "../stores/activityStore";
import "./StockDetail.css";
import { useI18n } from "../i18n";


export interface StockData {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  industry: string;
  logo: string;
  description: string;
  website: string;
  headquarters: string;
  employees: number;
  founded: number;
  ceo: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  open: number;
  dayLow: number;
  dayHigh: number;
  yearLow: number;
  yearHigh: number;
  volume: number;
  avgVolume: number;
  marketCap: number;
  pe: number;
  eps: number;
  beta: number;
  dividendYield: number;
  sharesOutstanding: number;
  revenue: number;
  netIncome: number;
  operatingMargin: number;
  freeCashFlow: number;
  quarterlyRevenueGrowth: number;
  quarterlyEarningsGrowth: number;
  nextEarningsDate: string;
  insiderBuys: number;
  insiderSells: number;
  ownershipChange: number;
  analystBuy: number;
  analystHold: number;
  analystSell: number;
  targetPrice: number;
  relatedCompanies: string[];
  tags: string[];
}

type Timeframe = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

const TIMEFRAMES: Timeframe[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

const formatEarningsDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const daysUntil = (dateStr: string) => {
  const target = new Date(dateStr).getTime();
  const today = Date.now();
  return Math.max(0, Math.round((target - today) / (1000 * 60 * 60 * 24)));
};

const StockDetail: React.FC<{ stock: StockData; allStocks: StockData[] }> = ({ stock, allStocks }) => {
  const { t } = useI18n();
  const [timeframe, setTimeframe] = React.useState<Timeframe>("1M");
  const [activeTab, setActiveTab] = React.useState<"overview" | "financials" | "earnings" | "insider" | "ratings" | "news">("overview");
  const [actionToast, setActionToast] = React.useState<string | null>(null);

  const { watchlists, activeWatchlistId, addSymbol } = useWatchlistStore();
  const { portfolios, activePortfolioId, addPosition } = usePortfolioStore();
  const { log } = useActivityStore();

  const activeWatchlist = watchlists.find((wl) => wl.id === activeWatchlistId) ?? watchlists[0];
  const activePortfolio = portfolios.find((pf) => pf.id === activePortfolioId) ?? portfolios[0];
  const inWatchlist = activeWatchlist?.symbols.some((s) => s.symbol === stock.symbol) ?? false;
  const inPortfolio = activePortfolio?.positions.some((p) => p.symbol === stock.symbol) ?? false;

  const showToast = React.useCallback((msg: string) => {
    setActionToast(msg);
    window.setTimeout(() => setActionToast(null), 2400);
  }, []);

  const handleAddWatchlist = () => {
    if (!activeWatchlist || inWatchlist) return;
    addSymbol(activeWatchlist.id, {
      symbol: stock.symbol,
      name: stock.name,
      type: "stock",
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      addedAt: Date.now(),
    });
    log("watchlist_add", `Added ${stock.symbol} to ${activeWatchlist.name}`);
    showToast(t("stockdetail.toast.watchlistAdded", { symbol: stock.symbol, name: activeWatchlist.name }));
  };

  const handleCreateAlert = () => {
    log("alert_create", `Created price alert for ${stock.symbol} at $${stock.price.toFixed(2)}`);
    showToast(t("stockdetail.toast.alertCreated", { symbol: stock.symbol, price: stock.price.toFixed(2) }));
  };

  const handleAddPortfolio = () => {
    if (!activePortfolio || inPortfolio) return;
    addPosition(activePortfolio.id, {
      symbol: stock.symbol,
      name: stock.name,
      type: "stock",
      sector: stock.sector,
      quantity: 1,
      averageCost: stock.price,
      currentPrice: stock.price,
      dividendYield: stock.dividendYield || undefined,
      purchaseDate: new Date().toISOString().split("T")[0],
    });
    log("portfolio_add", `Added ${stock.symbol} to ${activePortfolio.name}`);
    showToast(t("stockdetail.toast.portfolioAdded", { symbol: stock.symbol, name: activePortfolio.name }));
  };

  const series = React.useMemo(
    () => generateSeriesForSymbol(stock.symbol, stock.price, timeframe),
    [stock.symbol, stock.price, timeframe]
  );

  const tone = stock.changePercent >= 0 ? "positive" : "negative";
  const arrow = stock.changePercent >= 0 ? "▲" : "▼";

  const analystTotal = stock.analystBuy + stock.analystHold + stock.analystSell;
  const buyPct = analystTotal ? (stock.analystBuy / analystTotal) * 100 : 0;
  const holdPct = analystTotal ? (stock.analystHold / analystTotal) * 100 : 0;
  const sellPct = analystTotal ? (stock.analystSell / analystTotal) * 100 : 0;
  const consensusScore = analystTotal ? (stock.analystBuy * 3 + stock.analystHold * 2 + stock.analystSell) / analystTotal : 0;
  const consensusLabel = consensusScore > 2.5 ? t("stockdetail.analystStrongBuy") : consensusScore > 1.7 ? t("stockdetail.analystBuy") : consensusScore > 1.3 ? t("stockdetail.analystHold") : t("stockdetail.analystSell");

  const earningsHistory = React.useMemo(() => {
    const quarterLabels = ["stockdetail.earningsQuarter1", "stockdetail.earningsQuarter2", "stockdetail.earningsQuarter3", "stockdetail.earningsQuarter4", "stockdetail.earningsQuarter5", "stockdetail.earningsQuarter6"];
    return quarterLabels.map((labelKey, i) => {
      const surprise = (Math.sin(i + stock.symbol.length) * 7) + (i % 2 === 0 ? 3 : -2);
      return {
        quarter: t(labelKey),
        estimate: stock.eps * (0.85 + i * 0.03),
        actual: stock.eps * (0.85 + i * 0.03) * (1 + surprise / 100),
        surprisePct: Number(surprise.toFixed(1)),
      };
    });
  }, [stock.eps, stock.symbol, t]);

  const insiderTrades = React.useMemo(() => {
    const insiders = [
      { name: "CEO", roleKey: "stockdetail.insiderRoleCeo" },
      { name: "CFO", roleKey: "stockdetail.insiderRoleCfo" },
      { name: "COO", roleKey: "stockdetail.insiderRoleCoo" },
      { name: "CTO", roleKey: "stockdetail.insiderRoleCto" },
      { name: "Director A", roleKey: "stockdetail.insiderRoleIndependentDirector" },
      { name: "VP Sales", roleKey: "stockdetail.insiderRoleVpSales" },
      { name: "President", roleKey: "stockdetail.insiderRolePresident" },
    ];
    return insiders
      .map((insider, i) => {
        const isBuy = i % 3 !== 0;
        const shares = Math.round(5000 + Math.abs(Math.sin(i * 1.7) * 40000));
        return {
          name: insider.name,
          role: t(insider.roleKey),
          type: isBuy ? t("stockdetail.tradeTypeBuy") : t("stockdetail.tradeTypeSell"),
          shares,
          price: stock.price * (0.95 + (i * 0.012)),
          date: new Date(Date.now() - (i + 1) * 86400000 * 12).toISOString().split("T")[0],
          value: 0,
        };
      })
      .map((t) => ({ ...t, value: t.shares * t.price }));
  }, [stock.price]);

  const relatedStocks = allStocks.filter((s) =>
    stock.relatedCompanies.includes(s.symbol) || s.sector === stock.sector
  ).slice(0, 6);

  const newsItems = [
    { id: "n1", sourceKey: "stockdetail.newsSourceMarketWire", tagKey: "stockdetail.newsTagEarnings", titleKey: "stockdetail.newsTitle1", titleParams: { symbol: stock.symbol, beats: (Math.random() * 10 + 3).toFixed(1) } , publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
    { id: "n2", sourceKey: "stockdetail.newsSourceBloomberg", tagKey: "stockdetail.newsTagSector", titleKey: "stockdetail.newsTitle2", titleParams: { sector: stock.sector, symbol: stock.symbol }, publishedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString() },
    { id: "n3", sourceKey: "stockdetail.newsSourceReuters", tagKey: "stockdetail.newsTagAnalyst", titleKey: "stockdetail.newsTitle3", titleParams: { symbol: stock.symbol, target: stock.targetPrice.toFixed(2) }, publishedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
    { id: "n4", sourceKey: "stockdetail.newsSourceCNBC", tagKey: "stockdetail.newsTagBuyback", titleKey: "stockdetail.newsTitle4", titleParams: { symbol: stock.symbol, amountB: (stock.freeCashFlow / 1e9 * 0.05).toFixed(1) }, publishedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString() },
    { id: "n5", sourceKey: "stockdetail.newsSourceForm4Data", tagKey: "stockdetail.newsTagInsider", titleKey: "stockdetail.newsTitle5", titleParams: { buys: stock.insiderBuys, sells: stock.insiderSells }, publishedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString() },
    { id: "n6", sourceKey: "stockdetail.newsSourceWSJ", tagKey: "stockdetail.newsTagStrategic", titleKey: "stockdetail.newsTitle6", titleParams: { symbol: stock.symbol, industry: stock.industry.toLowerCase() }, publishedAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString() },
  ];

  return (
    <div className="stock-detail-page page">
      {actionToast && (
        <div className="stock-action-toast" role="status" aria-live="polite">
          {actionToast}
        </div>
      )}
      {/* Hero Section */}
      <section className="stock-hero">
        <div className="stock-hero-top">
          <div className="stock-identity">
            <div className="stock-ticker-badge">{stock.symbol.charAt(0)}</div>
            <div>
              <div className="stock-meta-line">
                <Link to="/stocks" className="back-link">{t("stockdetail.h0")}</Link>
                <span className="exchange-pill">{stock.exchange}</span>
                <span className="sector-pill">{stock.sector}</span>
                <span className="industry-pill">{stock.industry}</span>
              </div>
              <h1 className="stock-title">
                {stock.name} <span className="stock-ticker">({stock.symbol})</span>
              </h1>
              <div className="stock-tagline">{stock.description}</div>
            </div>
          </div>

          <div className="stock-price-block">
              <div className="stock-price-row">
              <span className="price-label">{t("stockdetail.h1")}</span>
              <span className={`stock-change-pill ${tone}`}>
                {arrow} {formatSignedPercent(stock.changePercent)}
              </span>
            </div>
            <div className="stock-price-value">${stock.price.toFixed(2)}</div>
            <div className={`stock-price-change ${tone}`}>
              {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)} ({formatSignedPercent(stock.changePercent)}) {t("stockdetail.today")}
            </div>
            <div className="quick-stats-row">
              <div><span>{t("stockdetail.h2")}</span><strong>${stock.open.toFixed(2)}</strong></div>
              <div><span>{t("stockdetail.h3")}</span><strong>${stock.previousClose.toFixed(2)}</strong></div>
              <div><span>{t("stockdetail.h4")}</span><strong>${stock.dayLow.toFixed(2)} – ${stock.dayHigh.toFixed(2)}</strong></div>
              <div><span>{t("stockdetail.h5")}</span><strong>${stock.yearLow.toFixed(2)} – ${stock.yearHigh.toFixed(2)}</strong></div>
            </div>
          </div>
        </div>

        {/* Timeframe Chart */}
        <div className="stock-chart-section">
          <div className="chart-toolbar">
            <div className="timeframe-buttons">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  className={timeframe === tf ? "active" : ""}
                  onClick={() => setTimeframe(tf)}
                  type="button"
                >
                  {tf}
                </button>
              ))}
            </div>
            <div className="chart-meta">
              <span>{t("stockdetail.lastUpdate", { time: new Date().toLocaleTimeString() })}</span>
            </div>
          </div>
          <div className="chart-canvas">
            {window.Chart ? (
              <ChartJSLine data={series} width={1080} height={300} color={tone === "positive" ? "#10b981" : "#ef4444"} />
            ) : (
              <LineChart data={series} width={1080} height={300} color={tone === "positive" ? "#10b981" : "#ef4444"} />
            )}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="stock-tabs" aria-label={t("stockdetail.h6")}>
        {[
          { id: "overview",   label: t("stockDetail.tabOverview") },
          { id: "financials", label: t("stockDetail.tabFinancials") },
          { id: "earnings",   label: t("stockDetail.tabEarnings") },
          { id: "insider",    label: t("stockDetail.tabInsider") },
          { id: "ratings",    label: t("stockDetail.tabRatings") },
          { id: "news",       label: t("stockDetail.tabNews") },
        ].map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`stock-tabpanel-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="stock-tab-content">
        {activeTab === "overview" && (
          <div className="overview-grid">
            {/* Company Profile */}
            <section className="info-card">
              <h3>{t("stockdetail.h8")}</h3>
              <dl className="info-list">
                <div><dt>{t("stockdetail.h9")}</dt><dd>{stock.name}</dd></div>
                <div><dt>{t("stockdetail.h10")}</dt><dd>{stock.symbol}</dd></div>
                <div><dt>{t("stockdetail.h11")}</dt><dd>{stock.exchange}</dd></div>
                <div><dt>{t("stockdetail.h12")}</dt><dd><Link to={`/sectors/${stock.sector.toLowerCase().replace(/\s+/g, "-")}`}>{stock.sector}</Link></dd></div>
                <div><dt>{t("stockdetail.h13")}</dt><dd>{stock.industry}</dd></div>
                <div><dt>{t("stockdetail.h14")}</dt><dd>{stock.employees.toLocaleString()}</dd></div>
                <div><dt>{t("stockdetail.h15")}</dt><dd>{stock.headquarters}</dd></div>
                <div><dt>{t("stockdetail.h16")}</dt><dd>{stock.founded}</dd></div>
                <div><dt>{t("stockdetail.h17")}</dt><dd>{stock.ceo}</dd></div>
                <div><dt>{t("stockdetail.h18")}</dt><dd><a href={stock.website} target="_blank" rel="noopener noreferrer">{stock.website}</a></dd></div>
              </dl>
            </section>

            {/* Key Statistics */}
            <section className="info-card">
              <h3>{t("stockdetail.h19")}</h3>
              <dl className="info-list">
                <div><dt>{t("stockdetail.h20")}</dt><dd>{formatMoney(stock.marketCap)}</dd></div>
                <div><dt>{t("stockdetail.h21")}</dt><dd>{stock.pe.toFixed(1)}</dd></div>
                <div><dt>{t("stockdetail.h22")}</dt><dd>${stock.eps.toFixed(2)}</dd></div>
                <div><dt>{t("stockdetail.h23")}</dt><dd>{stock.beta.toFixed(2)}</dd></div>
                <div><dt>{t("stockdetail.h24")}</dt><dd>{stock.dividendYield.toFixed(2)}%</dd></div>
                <div><dt>{t("stockdetail.h25")}</dt><dd>{(stock.sharesOutstanding / 1e9).toFixed(2)}B</dd></div>
                <div><dt>{t("stockdetail.h26")}</dt><dd>{formatVolume(stock.volume)}</dd></div>
                <div><dt>{t("stockdetail.h27")}</dt><dd>{formatVolume(stock.avgVolume)}</dd></div>
              </dl>
            </section>

            {/* Trading Performance */}
            <section className="info-card">
              <h3>{t("stockdetail.h28")}</h3>
              <dl className="info-list">
                <div><dt>{t("stockdetail.h29")}</dt><dd className="positive">${stock.dayHigh.toFixed(2)}</dd></div>
                <div><dt>{t("stockdetail.h30")}</dt><dd className="negative">${stock.dayLow.toFixed(2)}</dd></div>
                <div><dt>{t("stockdetail.h31")}</dt><dd className="positive">${stock.yearHigh.toFixed(2)}</dd></div>
                <div><dt>{t("stockdetail.h32")}</dt><dd className="negative">${stock.yearLow.toFixed(2)}</dd></div>
                <div><dt>{t("stockdetail.h33")}</dt><dd className={stock.price >= stock.yearHigh ? "positive" : "negative"}>{((stock.price / stock.yearHigh - 1) * 100).toFixed(2)}%</dd></div>
                <div><dt>{t("stockdetail.h34")}</dt><dd className={stock.price > stock.yearLow ? "positive" : "negative"}>{((stock.price / stock.yearLow - 1) * 100).toFixed(2)}%</dd></div>
              </dl>
            </section>

            {/* Tags */}
            <section className="info-card">
              <h3>{t("stockdetail.h35")}</h3>
              <div className="tag-cloud">
                {stock.tags.map((tag) => (
                  <span key={tag} className="tag-chip">{tag}</span>
                ))}
              </div>
              <div className="quick-actions-row">
                <button
                  type="button"
                  className="primary-action-sm"
                  onClick={handleAddWatchlist}
                  disabled={inWatchlist}
                  aria-label={inWatchlist ? t("stockDetail.alreadyInWatchlist") : t("stockDetail.addToWatchlist")}
                  title={inWatchlist ? t("stockDetail.alreadyInWatchlist") : (activeWatchlist?.name ?? "")}
                >
                  {inWatchlist ? t("stockDetail.inWatchlist") : t("stockDetail.addToWatchlist")}
                </button>
                <button
                  type="button"
                  className="secondary-action-sm"
                  onClick={handleCreateAlert}
                  aria-label={t("stockDetail.createAlert")}
                >
                  {t("stockDetail.createAlert")}
                </button>
                <button
                  type="button"
                  className="secondary-action-sm"
                  onClick={handleAddPortfolio}
                  disabled={inPortfolio}
                  aria-label={inPortfolio ? t("stockDetail.alreadyInPortfolio") : t("stockDetail.addToPortfolio")}
                  title={inPortfolio ? t("stockDetail.alreadyInPortfolio") : (activePortfolio?.name ?? "")}
                >
                  {inPortfolio ? t("stockDetail.inPortfolio") : t("stockDetail.addToPortfolio")}
                </button>
              </div>
            </section>
          </div>
        )}

        {activeTab === "financials" && (
          <div className="financials-grid">
            <section className="info-card wide">
              <h3>{t("stockdetail.h36")}</h3>
              <dl className="info-list">
                <div><dt>{t("stockdetail.financials.revenueTTM")}</dt><dd>{formatMoney(stock.revenue)}</dd></div>
                <div><dt>{t("stockdetail.financials.netIncomeTTM")}</dt><dd>{formatMoney(stock.netIncome)}</dd></div>
                <div><dt>{t("stockdetail.h37")}</dt><dd>{stock.operatingMargin.toFixed(2)}%</dd></div>
                <div><dt>{t("stockdetail.h38")}</dt><dd>{formatMoney(stock.freeCashFlow)}</dd></div>
                <div><dt>{t("stockdetail.financials.epsTTM")}</dt><dd>${stock.eps.toFixed(2)}</dd></div>
                <div><dt>{t("stockdetail.h39")}</dt><dd className={stock.quarterlyRevenueGrowth >= 0 ? "positive" : "negative"}>{formatSignedPercent(stock.quarterlyRevenueGrowth)}</dd></div>
                <div><dt>{t("stockdetail.h40")}</dt><dd className={stock.quarterlyEarningsGrowth >= 0 ? "positive" : "negative"}>{formatSignedPercent(stock.quarterlyEarningsGrowth)}</dd></div>
                <div><dt>{t("stockdetail.h41")}</dt><dd>{((stock.netIncome / stock.revenue) * 100).toFixed(2)}%</dd></div>
              </dl>
            </section>
            <section className="info-card">
              <h3>{t("stockdetail.h42")}</h3>
              <div className="balance-stats">
                <div>
                  <span>{t("stockdetail.h43")}</span>
                  <strong>{formatMoney(stock.freeCashFlow * 1.2)}</strong>
                </div>
                <div>
                  <span>{t("stockdetail.h44")}</span>
                  <strong>{formatMoney(stock.revenue * 0.15)}</strong>
                </div>
                <div>
                  <span>{t("stockdetail.h45")}</span>
                  <strong>0.42</strong>
                </div>
                <div>
                  <span>{t("stockdetail.h46")}</span>
                  <strong>{((stock.netIncome / (stock.marketCap * 0.6)) * 100).toFixed(1)}%</strong>
                </div>
                <div>
                  <span>{t("stockdetail.h47")}</span>
                  <strong>1.85</strong>
                </div>
              </div>
            </section>
            <section className="info-card wide">
              <h3>{t("stockdetail.revenueTrendTitle")}</h3>
              <div className="bar-chart">
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const value = stock.revenue / 4 * (0.85 + i * 0.04);
                  const max = stock.revenue / 4 * 1.1;
                  const heightPct = (value / max) * 100;
                  return (
                    <div key={i} className="bar-col">
                      <div className="bar-value">{formatMoney(value)}</div>
                      <div className="bar" style={{ height: `${heightPct}%` }} />
                      <div className="bar-label">{t("stockdetail.revenueQuarterLabel", { index: i + 1 })}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="earnings-grid">
            <section className="info-card">
              <h3>{t("stockdetail.h48")}</h3>
              <div className="next-earnings">
                <div className="ne-date">{formatEarningsDate(stock.nextEarningsDate)}</div>
                <div className="ne-countdown">
                  {t("stockdetail.earningsInDays", { days: daysUntil(stock.nextEarningsDate) })}
                </div>
                <div className="ne-meta">
                  <div><span>{t("stockdetail.h49")}</span><strong>${(stock.eps * 0.95).toFixed(2)}</strong></div>
                  <div><span>{t("stockdetail.h50")}</span><strong>{formatMoney(stock.revenue / 4)}</strong></div>
                </div>
              </div>
            </section>

            <section className="info-card wide">
              <h3>{t("stockdetail.h51")}</h3>
              <div className="earnings-table-wrap">
                <table className="earnings-table">
                  <thead>
                    <tr>
                      <th>{t("stockdetail.h52")}</th>
                      <th>{t("stockdetail.h53")}</th>
                      <th>{t("stockdetail.h54")}</th>
                      <th>{t("stockdetail.h55")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earningsHistory.map((row) => (
                      <tr key={row.quarter}>
                        <td>{row.quarter}</td>
                        <td>${row.estimate.toFixed(2)}</td>
                        <td>${row.actual.toFixed(2)}</td>
                        <td className={row.surprisePct >= 0 ? "positive" : "negative"}>
                          {row.surprisePct >= 0 ? "+" : ""}{row.surprisePct.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="info-card wide">
              <h3>{t("stockdetail.h56")}</h3>
              <div className="surprise-chart">
                {earningsHistory.map((row) => {
                  const heightPct = Math.min(100, Math.abs(row.surprisePct) * 12);
                  const isPositive = row.surprisePct >= 0;
                  return (
                    <div key={row.quarter} className="surprise-col">
                      <div className={`surprise-bar ${isPositive ? "positive" : "negative"}`} style={{ height: `${heightPct}%` }} />
                      <div className="surprise-value">{row.surprisePct >= 0 ? "+" : ""}{row.surprisePct.toFixed(1)}%</div>
                      <div className="surprise-label">{row.quarter}</div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {activeTab === "insider" && (
          <div className="insider-grid">
            <section className="info-card">
              <h3>{t("stockdetail.h57")}</h3>
              <div className="insider-summary">
                <div className="insider-stat">
                  <span>{t("stockdetail.insiderBuys90d")}</span>
                  <strong className="positive">{stock.insiderBuys}</strong>
                </div>
                <div className="insider-stat">
                  <span>{t("stockdetail.insiderSells90d")}</span>
                  <strong className="negative">{stock.insiderSells}</strong>
                </div>
                <div className="insider-stat">
                  <span>{t("stockdetail.h58")}</span>
                  <strong className={stock.ownershipChange >= 0 ? "positive" : "negative"}>
                    {stock.ownershipChange >= 0 ? "+" : ""}{stock.ownershipChange.toFixed(2)}%
                  </strong>
                </div>
              </div>
            </section>
            <section className="info-card wide">
              <h3>{t("stockdetail.h59")}</h3>
              <div className="insider-table-wrap">
                <table className="insider-table">
                  <thead>
                    <tr>
                      <th>{t("stockdetail.h60")}</th>
                      <th>{t("stockdetail.h61")}</th>
                      <th>{t("stockdetail.h62")}</th>
                      <th>{t("stockdetail.h63")}</th>
                      <th>{t("stockdetail.h64")}</th>
                      <th>{t("stockdetail.h65")}</th>
                      <th>{t("stockdetail.h66")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insiderTrades.map((trade, i) => (
                      <tr key={i}>
                        <td>{trade.name}</td>
                        <td>{trade.role}</td>
                        <td>
                          <span className={`trade-pill ${trade.type === t("stockdetail.tradeTypeBuy") ? "positive" : "negative"}`}>
                            {trade.type}
                          </span>
                        </td>
                        <td>{trade.shares.toLocaleString()}</td>
                        <td>${trade.price.toFixed(2)}</td>
                        <td>{formatMoney(trade.value)}</td>
                        <td>{trade.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === "ratings" && (
          <div className="ratings-grid">
            <section className="info-card">
              <h3>{t("stockdetail.h67")}</h3>
              <div className="consensus-block">
                <div className="consensus-label">{consensusLabel}</div>
                <div className="consensus-score">{consensusScore.toFixed(2)} / 3.0</div>
                <div className="consensus-bar">
                  <div className="bar-segment buy" style={{ width: `${buyPct}%` }} />
                  <div className="bar-segment hold" style={{ width: `${holdPct}%` }} />
                  <div className="bar-segment sell" style={{ width: `${sellPct}%` }} />
                </div>
                <div className="consensus-legend">
                  <div><span className="dot buy" /> {t("stockdetail.analystBuy")} {stock.analystBuy}</div>
                  <div><span className="dot hold" /> {t("stockdetail.analystHold")} {stock.analystHold}</div>
                  <div><span className="dot sell" /> {t("stockdetail.analystSell")} {stock.analystSell}</div>
                </div>
                <div className="target-block">
                  <div><span>{t("stockdetail.h68")}</span><strong>${stock.targetPrice.toFixed(2)}</strong></div>
                  <div><span>{t("stockdetail.h69")}</span>
                    <strong className={stock.targetPrice > stock.price ? "positive" : "negative"}>
                      {((stock.targetPrice / stock.price - 1) * 100).toFixed(2)}%
                    </strong>
                  </div>
                </div>
              </div>
            </section>
            <section className="info-card wide">
              <h3>{t("stockdetail.h70")}</h3>
              <div className="rating-dist">
                {[
                  { label: t("stockdetail.analystStrongBuy"), count: Math.round(stock.analystBuy * 0.4), color: "#059669" },
                  { label: t("stockdetail.analystBuy"), count: Math.round(stock.analystBuy * 0.6), color: "#10b981" },
                  { label: t("stockdetail.analystHold"), count: stock.analystHold, color: "#94a3b8" },
                  { label: t("stockdetail.analystUnderperform"), count: Math.round(stock.analystSell * 0.6), color: "#f97316" },
                  { label: t("stockdetail.analystSell"), count: stock.analystSell, color: "#dc2626" },
                ].map((r) => (
                  <div key={r.label} className="rating-row">
                    <span className="rating-label">{r.label}</span>
                    <div className="rating-track">
                      <div className="rating-fill" style={{ width: `${Math.min(100, r.count * 6)}%`, backgroundColor: r.color }} />
                    </div>
                    <span className="rating-count">{r.count}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "news" && (
      <div className="news-grid-tab">
            {newsItems.map((item) => (
              <article key={item.id} className="news-card">
                <span className="news-tag">{t(item.tagKey)}</span>
                <h4>{t(item.titleKey, item.titleParams)}</h4>
                <div className="news-meta">
                  <span>{t(item.sourceKey)}</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString(undefined)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Related Companies */}
      {relatedStocks.length > 0 && (
        <section className="related-section">
          <h3>{t("stockdetail.h71")}</h3>
          <div className="related-grid">
            {relatedStocks.map((s) => (
              <Link key={s.symbol} to={`/stocks/${s.symbol}`} className="related-card">
                <div className="related-symbol">{s.symbol.charAt(0)}</div>
                <div className="related-info">
                  <strong>{s.symbol}</strong>
                  <span>{s.name}</span>
                </div>
                <div className="related-price">
                  <strong>${s.price.toFixed(2)}</strong>
                  <em className={s.changePercent >= 0 ? "positive" : "negative"}>
                    {formatSignedPercent(s.changePercent)}
                  </em>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default StockDetail;
