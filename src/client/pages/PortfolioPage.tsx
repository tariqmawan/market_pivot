import React from "react";
import { HiPencil, HiTrash, HiCheckCircle, HiArrowDownTray, HiPlus, HiBriefcase } from "react-icons/hi2";
import { usePortfolioStore, type Position } from "../stores/portfolioStore";
import { useActivityStore } from "../stores/activityStore";
import LineChart from "../components/LineChart";
import ChartJSLine from "../components/ChartJSLine";
import EmptyState from "../components/EmptyState";
import { generateSeriesForSymbol, formatSignedPercent, formatMoney } from "../lib/chartSeries";
import { useI18n } from "../i18n";
import "./PortfolioPage.css";

const TYPE_LABEL_KEYS: Record<Position["type"], string> = {
  stock: "pages:portfolio.assetTypes.stock",
  etf: "pages:portfolio.assetTypes.etf",
  crypto: "pages:portfolio.assetTypes.crypto",
  forex: "pages:portfolio.assetTypes.forex",
  commodity: "pages:portfolio.assetTypes.commodity",
  bond: "pages:portfolio.assetTypes.bond",
};

const SORT_LABEL_KEYS = {
  symbol: "pages:portfolio.symbol",
  value: "pages:portfolio.value",
  pl: "pages:portfolio.pl",
  plPercent: "pages:portfolio.plPercent",
  yield: "pages:portfolio.yield",
} as const;

const sortIndicator = (active: boolean, dir: "asc" | "desc") => (active ? (dir === "asc" ? " ^" : " v") : "");

const txTypeKey = (type: string) => `pages:portfolio.transactionTypes.${type}`;

const timeframeLabel = (timeframe: "1W" | "1M" | "3M" | "YTD" | "1Y" | "5Y", allTime: string) => {
  return timeframe === "5Y" ? allTime : timeframe;
};

const PortfolioPage: React.FC = () => {
  const { t } = useI18n();
  const {
    portfolios,
    activePortfolioId,
    createPortfolio,
    renamePortfolio,
    deletePortfolio,
    setActivePortfolio,
    setBaseCurrency,
    addPosition,
    updatePosition,
    deletePosition,
    addTransaction,
    exportPortfolio,
  } = usePortfolioStore();
  const { log } = useActivityStore();

  const [showAdd, setShowAdd] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [showCreate, setShowCreate] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [renamingId, setRenamingId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"symbol" | "value" | "pl" | "plPercent" | "yield">("value");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");
  const [perfTimeframe, setPerfTimeframe] = React.useState<"1W" | "1M" | "3M" | "YTD" | "1Y" | "5Y">("1Y");

  const activePortfolio = portfolios.find((pf) => pf.id === activePortfolioId) ?? portfolios[0];

  const totals = React.useMemo(() => {
    if (!activePortfolio) {
      return { marketValue: 0, costBasis: 0, pl: 0, plPercent: 0, dailyChange: 0, dailyChangePct: 0, dividend: 0, positionCount: 0 };
    }
    let marketValue = 0;
    let costBasis = 0;
    let dailyChange = 0;
    let dividend = 0;
    activePortfolio.positions.forEach((p) => {
      marketValue += p.quantity * p.currentPrice;
      costBasis += p.quantity * p.averageCost;
      dailyChange += p.quantity * p.currentPrice * 0.01;
      if (p.dividendYield) dividend += (p.quantity * p.currentPrice * p.dividendYield) / 100;
    });
    const pl = marketValue - costBasis;
    return {
      marketValue,
      costBasis,
      pl,
      plPercent: costBasis > 0 ? (pl / costBasis) * 100 : 0,
      dailyChange,
      dailyChangePct: marketValue > 0 ? (dailyChange / marketValue) * 100 : 0,
      dividend,
      positionCount: activePortfolio.positions.length,
    };
  }, [activePortfolio]);

  const sortedPositions = React.useMemo(() => {
    if (!activePortfolio) return [];
    const positions = [...activePortfolio.positions];
    positions.sort((a, b) => {
      let cmp = 0;
      const aValue = a.quantity * a.currentPrice;
      const bValue = b.quantity * b.currentPrice;
      const aPL = aValue - a.quantity * a.averageCost;
      const bPL = bValue - b.quantity * b.averageCost;
      const aPLPct = aPL / (a.quantity * a.averageCost);
      const bPLPct = bPL / (b.quantity * b.averageCost);

      switch (sortBy) {
        case "symbol": cmp = a.symbol.localeCompare(b.symbol); break;
        case "value": cmp = aValue - bValue; break;
        case "pl": cmp = aPL - bPL; break;
        case "plPercent": cmp = aPLPct - bPLPct; break;
        case "yield": cmp = (a.dividendYield ?? 0) - (b.dividendYield ?? 0); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return positions;
  }, [activePortfolio, sortBy, sortDir]);

  const sectorAllocation = React.useMemo(() => {
    if (!activePortfolio || totals.marketValue === 0) return [];
    const map = new Map<string, number>();
    activePortfolio.positions.forEach((p) => {
      const value = p.quantity * p.currentPrice;
      map.set(p.sector, (map.get(p.sector) ?? 0) + value);
    });
    return Array.from(map.entries())
      .map(([sector, value]) => ({ sector, value, percent: (value / totals.marketValue) * 100 }))
      .sort((a, b) => b.value - a.value);
  }, [activePortfolio, totals.marketValue]);

  const assetAllocation = React.useMemo<Array<{ type: Position["type"]; value: number; percent: number }>>(() => {
    if (!activePortfolio || totals.marketValue === 0) return [];
    const map = new Map<Position["type"], number>();
    activePortfolio.positions.forEach((p) => {
      const value = p.quantity * p.currentPrice;
      map.set(p.type, (map.get(p.type) ?? 0) + value);
    });
    return Array.from(map.entries())
      .map(([type, value]) => ({ type, value, percent: (value / totals.marketValue) * 100 }))
      .sort((a, b) => b.value - a.value);
  }, [activePortfolio, totals.marketValue]);

  const performanceSeries = React.useMemo(() => {
    if (!activePortfolio) return [];
    const tf = perfTimeframe === "YTD" ? "1Y" : perfTimeframe;
    return generateSeriesForSymbol(`portfolio-${activePortfolio.id}-${perfTimeframe}`, 100, tf);
  }, [activePortfolio, perfTimeframe]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const trimmedName = newName.trim();
    const id = createPortfolio(trimmedName);
    log("portfolio_add", t("pages:portfolio.createdPortfolioLog", { name: trimmedName }));
    setNewName("");
    setShowCreate(false);
    setActivePortfolio(id);
  };

  const handleRename = (id: string, nextName: string) => {
    if (!nextName.trim()) return;
    renamePortfolio(id, nextName.trim());
    setRenamingId(null);
    setRenameValue("");
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(t("pages:portfolio.deletePortfolioConfirm", { name }))) {
      deletePortfolio(id);
      log("portfolio_delete", t("pages:portfolio.deletedPortfolioLog", { name }));
    }
  };

  const toggleSort = (field: "symbol" | "value" | "pl" | "plPercent" | "yield") => {
    setSortBy(field);
    setSortDir(sortBy === field && sortDir === "asc" ? "desc" : "asc");
  };

  const handleExport = (format: "csv" | "json") => {
    if (!activePortfolio) return;
    const data = exportPortfolio(activePortfolio.id, format);
    const blob = new Blob([data], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activePortfolio.name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!activePortfolio) return null;

  return (
    <div className="page portfolio-page">
      <section className="coverage-hero portfolio-hero">
        <div className="portfolio-hero-copy">
          <p className="eyebrow">{t("pages:portfolio.holdings")}</p>
          <h1>{t("pages:portfolio.title")}</h1>
          <p>{t("pages:portfolio.subtitle")}</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile"><span>{t("pages:portfolio.marketValue")}</span><strong>{formatMoney(totals.marketValue)}</strong></div>
          <div className="metric-tile"><span>{t("pages:portfolio.totalPl")}</span><strong className={totals.pl >= 0 ? "positive" : "negative"}>{formatSignedPercent(totals.plPercent)}</strong></div>
          <div className="metric-tile"><span>{t("pages:portfolio.positions")}</span><strong>{totals.positionCount}</strong></div>
        </div>
      </section>

      <div className="portfolio-selector">
        <div className="portfolio-tabs">
          {portfolios.map((pf) => (
            <div
              key={pf.id}
              className={`portfolio-tab ${pf.id === activePortfolioId ? "active" : ""}`}
              onClick={() => setActivePortfolio(pf.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter") setActivePortfolio(pf.id); }}
            >
              {renamingId === pf.id ? (
                <input
                  type="text"
                  value={renameValue}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value.trim() && e.target.value !== pf.name) {
                      handleRename(pf.id, e.target.value);
                    } else {
                      setRenamingId(null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                    if (e.key === "Escape") setRenamingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <strong>{pf.name}</strong>
              )}
              <span>{t("pages:portfolio.positionsWithCurrency", { count: pf.positions.length, currency: pf.baseCurrency })}</span>
              <div className="portfolio-tab-actions" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => { setRenamingId(pf.id); setRenameValue(pf.name); }} title={t("pages:portfolio.rename")}><HiPencil size={12} /></button>
                {portfolios.length > 1 && (
                  <button type="button" onClick={() => handleDelete(pf.id, pf.name)} title={t("pages:portfolio.delete")}><HiTrash size={12} /></button>
                )}
              </div>
            </div>
          ))}
          {showCreate ? (
            <div className="portfolio-tab create-tab">
              <input
                type="text"
                placeholder={t("pages:portfolio.portfolioName")}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <div className="form-actions">
                <button onClick={handleCreate} className="primary-action-sm" type="button">{t("pages:portfolio.create")}</button>
                <button onClick={() => { setShowCreate(false); setNewName(""); }} className="secondary-action-sm" type="button">{t("pages:portfolio.cancel")}</button>
              </div>
            </div>
          ) : (
            <button className="portfolio-tab add-portfolio" onClick={() => setShowCreate(true)} type="button">
              {t("pages:portfolio.newPortfolio")}
            </button>
          )}
        </div>
      </div>

      <section className="portfolio-summary">
        <div className="summary-card highlight">
          <span>{t("pages:portfolio.marketValue")}</span>
          <strong>{formatMoney(totals.marketValue)}</strong>
          <em className={totals.dailyChange >= 0 ? "positive" : "negative"}>
            {t("pages:portfolio.dailyChangeLine", {
              amount: `${totals.dailyChange >= 0 ? "+" : ""}${formatMoney(totals.dailyChange)}`,
              percent: formatSignedPercent(totals.dailyChangePct),
            })}
          </em>
        </div>
        <div className="summary-card">
          <span>{t("pages:portfolio.costBasis")}</span>
          <strong>{formatMoney(totals.costBasis)}</strong>
          <em>{t("pages:portfolio.acrossPositions", { count: totals.positionCount })}</em>
        </div>
        <div className="summary-card">
          <span>{t("pages:portfolio.unrealizedPl")}</span>
          <strong className={totals.pl >= 0 ? "positive" : "negative"}>{formatMoney(totals.pl)}</strong>
          <em className={totals.pl >= 0 ? "positive" : "negative"}>{formatSignedPercent(totals.plPercent)}</em>
        </div>
        <div className="summary-card">
          <span>{t("pages:portfolio.annualDividend")}</span>
          <strong>{formatMoney(totals.dividend)}</strong>
          <em>{t("pages:portfolio.yieldValue", { value: (totals.marketValue > 0 ? (totals.dividend / totals.marketValue) * 100 : 0).toFixed(2) })}</em>
        </div>
      </section>

      <section className="portfolio-performance">
        <div className="performance-header">
          <h2>{t("pages:portfolio.performance")}</h2>
          <div className="performance-tabs">
            {(["1W", "1M", "3M", "YTD", "1Y", "5Y"] as const).map((p) => (
              <button
                key={p}
                type="button"
                className={p === perfTimeframe ? "active" : ""}
                onClick={() => setPerfTimeframe(p)}
              >
                {timeframeLabel(p, t("pages:portfolio.allTime"))}
              </button>
            ))}
          </div>
        </div>
        <div className="performance-chart">
          {window.Chart ? (
            <ChartJSLine
              data={performanceSeries}
              width={1200}
              height={260}
              color={totals.pl >= 0 ? "#10b981" : "#ef4444"}
            />
          ) : (
            <LineChart
              data={performanceSeries}
              width={1200}
              height={260}
              color={totals.pl >= 0 ? "#10b981" : "#ef4444"}
            />
          )}
        </div>
      </section>

      <div className="portfolio-content">
        <main className="portfolio-main">
          <div className="section-header-row">
            <h2>{t("pages:portfolio.positions")}</h2>
            <div className="header-actions">
              <button onClick={() => handleExport("csv")} className="secondary-action-sm icon-btn" type="button"><HiArrowDownTray size={14} /> {t("pages:portfolio.exportCsv")}</button>
              <button onClick={() => handleExport("json")} className="secondary-action-sm icon-btn" type="button"><HiArrowDownTray size={14} /> {t("pages:portfolio.exportJson")}</button>
              <button onClick={() => setShowAdd(true)} className="primary-action-sm icon-btn" type="button"><HiPlus size={14} /> {t("pages:portfolio.addPosition")}</button>
            </div>
          </div>

          <div className="positions-table-wrap">
            <table className="positions-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort("symbol")} scope="col">
                    {t(SORT_LABEL_KEYS.symbol)}{sortIndicator(sortBy === "symbol", sortDir)}
                  </th>
                  <th scope="col">{t("pages:portfolio.type")}</th>
                  <th className="text-right" scope="col">{t("pages:portfolio.quantity")}</th>
                  <th className="text-right" scope="col">{t("pages:portfolio.avgCost")}</th>
                  <th className="text-right" scope="col">{t("pages:portfolio.price")}</th>
                  <th className="text-right" onClick={() => toggleSort("value")} scope="col">
                    {t(SORT_LABEL_KEYS.value)}{sortIndicator(sortBy === "value", sortDir)}
                  </th>
                  <th className="text-right" onClick={() => toggleSort("pl")} scope="col">
                    {t(SORT_LABEL_KEYS.pl)}{sortIndicator(sortBy === "pl", sortDir)}
                  </th>
                  <th className="text-right" onClick={() => toggleSort("plPercent")} scope="col">
                    {t(SORT_LABEL_KEYS.plPercent)}{sortIndicator(sortBy === "plPercent", sortDir)}
                  </th>
                  <th className="text-right" onClick={() => toggleSort("yield")} scope="col">
                    {t(SORT_LABEL_KEYS.yield)}{sortIndicator(sortBy === "yield", sortDir)}
                  </th>
                  <th scope="col">{t("pages:portfolio.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {sortedPositions.length === 0 ? (
                  <tr><td colSpan={10}>
                    <EmptyState
                      compact
                      icon={<HiBriefcase />}
                      title={t("pages:portfolio.emptyPositions")}
                      actionLabel={t("pages:portfolio.addPosition")}
                      onAction={() => setShowAdd(true)}
                    />
                  </td></tr>
                ) : sortedPositions.map((pos) => {
                  const marketValue = pos.quantity * pos.currentPrice;
                  const cost = pos.quantity * pos.averageCost;
                  const pl = marketValue - cost;
                  const plPct = cost > 0 ? (pl / cost) * 100 : 0;
                  const isEditing = editingId === pos.id;
                  return (
                    <tr key={pos.id}>
                      <td>
                        <strong>{pos.symbol}</strong>
                        <span className="position-name">{pos.name}</span>
                      </td>
                      <td>
                        <span className={`type-pill type-${pos.type}`}>{t(TYPE_LABEL_KEYS[pos.type])}</span>
                      </td>
                      <td className="text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            defaultValue={pos.quantity}
                            onBlur={(e) => updatePosition(activePortfolio.id, pos.id, { quantity: Number(e.target.value) })}
                            className="inline-input"
                          />
                        ) : (
                          pos.quantity
                        )}
                      </td>
                      <td className="text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            defaultValue={pos.averageCost}
                            onBlur={(e) => updatePosition(activePortfolio.id, pos.id, { averageCost: Number(e.target.value) })}
                            className="inline-input"
                          />
                        ) : (
                          formatMoney(pos.averageCost)
                        )}
                      </td>
                      <td className="text-right">{formatMoney(pos.currentPrice)}</td>
                      <td className="text-right"><strong>{formatMoney(marketValue)}</strong></td>
                      <td className={`text-right ${pl >= 0 ? "positive" : "negative"}`}>
                        <strong>{formatMoney(pl)}</strong>
                      </td>
                      <td className={`text-right ${pl >= 0 ? "positive" : "negative"}`}>
                        {formatSignedPercent(plPct)}
                      </td>
                      <td className="text-right">{pos.dividendYield?.toFixed(2) ?? "-"}%</td>
                      <td>
                        <div className="row-actions">
                          <button type="button" onClick={() => setEditingId(isEditing ? null : pos.id)} className="row-btn" title={t("pages:portfolio.edit")}>{isEditing ? <HiCheckCircle size={14} /> : <HiPencil size={13} />}</button>
                          <button type="button" onClick={() => deletePosition(activePortfolio.id, pos.id)} className="row-btn delete" title={t("pages:portfolio.delete")}><HiTrash size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {showAdd && (
            <AddPositionForm
              onCancel={() => setShowAdd(false)}
              onSubmit={(data) => {
                addPosition(activePortfolio.id, data);
                addTransaction(activePortfolio.id, {
                  positionId: "new",
                  type: "buy",
                  quantity: data.quantity,
                  price: data.averageCost,
                  date: data.purchaseDate,
                });
                log("portfolio_add", t("pages:portfolio.addedPositionLog", { symbol: data.symbol, portfolio: activePortfolio.name }));
                setShowAdd(false);
              }}
            />
          )}

          <div className="transactions-section">
            <h3>{t("pages:portfolio.recentTransactions")}</h3>
            <div className="transactions-list">
              {activePortfolio.transactions.slice(0, 10).map((tx) => {
                const pos = activePortfolio.positions.find((p) => p.id === tx.positionId);
                return (
                  <div key={tx.id} className={`transaction-row ${tx.type}`}>
                    <span className="tx-date">{tx.date}</span>
                    <span className={`tx-type ${tx.type}`}>{t(txTypeKey(tx.type), tx.type)}</span>
                    <span className="tx-symbol">{pos?.symbol ?? "-"}</span>
                    {tx.quantity > 0 && <span className="tx-qty">{tx.quantity}</span>}
                    {tx.quantity > 0 && <span className="tx-price">@ {formatMoney(tx.price)}</span>}
                    {tx.type === "dividend" && <span className="tx-amount">{formatMoney(tx.price)}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        <aside className="portfolio-aside">
          <div className="aside-card">
            <h3>{t("pages:portfolio.sectorAllocation")}</h3>
            <div className="aside-card-body">
              <div className="allocation-list">
                {sectorAllocation.map((s) => (
                  <div key={s.sector} className="allocation-row">
                    <span>{s.sector}</span>
                    <div className="allocation-track">
                      <div style={{ width: `${s.percent}%`, background: "linear-gradient(90deg,#A27841,#c89b5e)" }} />
                    </div>
                    <strong>{s.percent.toFixed(1)}%</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="aside-card">
            <h3>{t("pages:portfolio.assetAllocation")}</h3>
            <div className="aside-card-body">
              <div className="allocation-list">
                {assetAllocation.map((a) => {
                  const color = a.type === "stock" ? "#2563eb" : a.type === "crypto" ? "#f59e0b" : a.type === "etf" ? "#8b5cf6" : a.type === "bond" ? "#10b981" : "#94a3b8";
                  return (
                    <div key={a.type} className="allocation-row">
                      <span className="allocation-label">
                        <span className="allocation-dot" style={{ backgroundColor: color }} />
                        {t(TYPE_LABEL_KEYS[a.type])}
                      </span>
                      <div className="allocation-track">
                        <div style={{ width: `${a.percent}%`, backgroundColor: color }} />
                      </div>
                      <strong>{a.percent.toFixed(1)}%</strong>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="aside-card">
            <h3>{t("pages:portfolio.portfolioSettings")}</h3>
            <div className="aside-card-body">
              <div className="settings-list">
                <div>
                  <span>{t("pages:portfolio.baseCurrency")}</span>
                  <select
                    value={activePortfolio.baseCurrency}
                    onChange={(e) => setBaseCurrency(activePortfolio.id, e.target.value as Position["type"] & string as never)}
                  >
                    {["USD", "EUR", "GBP", "JPY", "INR"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <span>{t("pages:portfolio.totalPositions")}</span>
                  <strong>{totals.positionCount}</strong>
                </div>
                <div>
                  <span>{t("pages:portfolio.dividendYield")}</span>
                  <strong>{(totals.marketValue > 0 ? (totals.dividend / totals.marketValue) * 100 : 0).toFixed(2)}%</strong>
                </div>
                <div>
                  <span>{t("pages:portfolio.lastUpdated")}</span>
                  <strong>{new Date(activePortfolio.updatedAt).toLocaleDateString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const AddPositionForm: React.FC<{
  onSubmit: (data: Omit<Position, "id">) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const { t } = useI18n();
  const [symbol, setSymbol] = React.useState("");
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<Position["type"]>("stock");
  const [sector, setSector] = React.useState("Diversified");
  const [quantity, setQuantity] = React.useState(1);
  const [averageCost, setAverageCost] = React.useState(0);
  const [currentPrice, setCurrentPrice] = React.useState(0);
  const [dividendYield, setDividendYield] = React.useState(0);
  const [purchaseDate, setPurchaseDate] = React.useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !name) return;
    onSubmit({
      symbol: symbol.toUpperCase(),
      name,
      type,
      sector, 
      quantity,
      averageCost,
      currentPrice: currentPrice || averageCost,
      dividendYield: dividendYield || undefined,
      purchaseDate,
    });
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>{t("pages:portfolio.addPosition")}</h3>
      <div className="form-grid">
        <div>
          <label>{t("pages:portfolio.symbol")}</label>
          <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder={t("pages:portfolio.symbolPlaceholder")} required />
        </div>
        <div>
          <label>{t("pages:portfolio.name")}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("pages:portfolio.namePlaceholder")} required />
        </div>
        <div>
          <label>{t("pages:portfolio.type")}</label>
          <select value={type} onChange={(e) => setType(e.target.value as Position["type"])}>
            <option value="stock">{t("pages:portfolio.assetTypes.stock")}</option>
            <option value="etf">{t("pages:portfolio.assetTypes.etf")}</option>
            <option value="crypto">{t("pages:portfolio.assetTypes.crypto")}</option>
            <option value="forex">{t("pages:portfolio.assetTypes.forex")}</option>
            <option value="commodity">{t("pages:portfolio.assetTypes.commodity")}</option>
            <option value="bond">{t("pages:portfolio.assetTypes.bond")}</option>
          </select>
        </div>
        <div>
          <label>{t("pages:portfolio.sector")}</label>
          <input value={sector} onChange={(e) => setSector(e.target.value)} placeholder={t("pages:portfolio.sectorPlaceholder")} />
        </div>
        <div>
          <label>{t("pages:portfolio.quantity")}</label>
          <input type="number" step="any" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={0} required />
        </div>
        <div>
          <label>{t("pages:portfolio.avgCost")}</label>
          <input type="number" step="any" value={averageCost} onChange={(e) => setAverageCost(Number(e.target.value))} min={0} required />
        </div>
        <div>
          <label>{t("pages:portfolio.currentPrice")}</label>
          <input type="number" step="any" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} min={0} />
        </div>
        <div>
          <label>{t("pages:portfolio.dividendYieldPercent")}</label>
          <input type="number" step="any" value={dividendYield} onChange={(e) => setDividendYield(Number(e.target.value))} min={0} />
        </div>
        <div>
          <label>{t("pages:portfolio.purchaseDate")}</label>
          <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="primary-action-sm">{t("pages:portfolio.add")}</button>
        <button type="button" onClick={onCancel} className="secondary-action-sm">{t("pages:portfolio.cancel")}</button>
      </div>
    </form>
  );
};

export default PortfolioPage;
