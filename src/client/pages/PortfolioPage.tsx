import React from "react";
import { HiPencil, HiTrash, HiCheckCircle, HiArrowDownTray, HiPlus } from "react-icons/hi2";
import { usePortfolioStore, type Position } from "../stores/portfolioStore";
import { useActivityStore } from "../stores/activityStore";
import LineChart from "../components/LineChart";
import ChartJSLine from "../components/ChartJSLine";
import EmptyState from "../components/EmptyState";
import { generateSeriesForSymbol, formatSignedPercent, formatMoney } from "../lib/chartSeries";
import "./PortfolioPage.css";
import { useI18n } from "../i18n";


const TYPE_LABELS: Record<Position["type"], string> = {
  stock: "Stock",
  etf: "ETF",
  crypto: "Crypto",
  forex: "Forex",
  commodity: "Commodity",
  bond: "Bond",
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
      // Daily change estimated as 1% of market value as positions don't track daily change directly
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
    // Map UI label "ALL" → "5Y" engine timeframe; YTD reuses 1Y series.
    const tf = perfTimeframe === "YTD" ? "1Y" : perfTimeframe;
    return generateSeriesForSymbol(`portfolio-${activePortfolio.id}-${perfTimeframe}`, 100, tf);
  }, [activePortfolio, perfTimeframe]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const id = createPortfolio(newName.trim());
    log("portfolio_add", `Created portfolio: ${newName.trim()}`);
    setNewName("");
    setShowCreate(false);
    setActivePortfolio(id);
  };

  const handleRename = (id: string) => {
    if (!renameValue.trim()) return;
    renamePortfolio(id, renameValue.trim());
    setRenamingId(null);
    setRenameValue("");
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete portfolio "${name}"?`)) {
      deletePortfolio(id);
      log("portfolio_delete", `Deleted portfolio: ${name}`);
    }
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
          <p className="eyebrow">Holdings</p>
          <h1>Portfolio Tracker</h1>
          <p>Track positions, allocation, performance, P/L, dividends, sector mix, and export across multiple portfolios.</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile"><span>{t("src_client_pages_portfoliopage__l181__h3")}</span><strong>{formatMoney(totals.marketValue)}</strong></div>
          <div className="metric-tile"><span>{t("src_client_pages_portfoliopage__l182__h4")}</span><strong className={totals.pl >= 0 ? "positive" : "negative"}>{formatSignedPercent(totals.plPercent)}</strong></div>
          <div className="metric-tile"><span>{t("src_client_pages_portfoliopage__l183__h5")}</span><strong>{totals.positionCount}</strong></div>
        </div>
      </section>

      {/* Portfolio selector */}
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
                  defaultValue={pf.name}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={(e) => {
                    if (e.target.value.trim() && e.target.value !== pf.name) {
                      handleRename(pf.id);
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
              <span>{pf.positions.length} positions • {pf.baseCurrency}</span>
              <div className="portfolio-tab-actions" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => { setRenamingId(pf.id); setRenameValue(pf.name); }} title="Rename"><HiPencil size={12} /></button>
                {portfolios.length > 1 && (
                  <button type="button" onClick={() => handleDelete(pf.id, pf.name)} title="Delete"><HiTrash size={12} /></button>
                )}
              </div>
            </div>
          ))}
          {showCreate ? (
            <div className="portfolio-tab create-tab">
              <input
                type="text"
                placeholder={t("src_client_pages_portfoliopage__l233__h9")}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <div className="form-actions">
                <button onClick={handleCreate} className="primary-action-sm" type="button">{t("src_client_pages_portfoliopage__l239__h10")}</button>
                <button onClick={() => { setShowCreate(false); setNewName(""); }} className="secondary-action-sm" type="button">{t("src_client_pages_portfoliopage__l240__h11")}</button>
              </div>
            </div>
          ) : (
            <button className="portfolio-tab add-portfolio" onClick={() => setShowCreate(true)} type="button">
              + New Portfolio
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <section className="portfolio-summary">
        <div className="summary-card highlight">
          <span>{t("src_client_pages_portfoliopage__l254__h12")}</span>
          <strong>{formatMoney(totals.marketValue)}</strong>
          <em className={totals.dailyChange >= 0 ? "positive" : "negative"}>
            {totals.dailyChange >= 0 ? "+" : ""}{formatMoney(totals.dailyChange)} ({formatSignedPercent(totals.dailyChangePct)}) today
          </em>
        </div>
        <div className="summary-card">
          <span>{t("src_client_pages_portfoliopage__l261__h13")}</span>
          <strong>{formatMoney(totals.costBasis)}</strong>
          <em>Across {totals.positionCount} positions</em>
        </div>
        <div className="summary-card">
          <span>{t("src_client_pages_portfoliopage__l266__h14")}</span>
          <strong className={totals.pl >= 0 ? "positive" : "negative"}>{formatMoney(totals.pl)}</strong>
          <em className={totals.pl >= 0 ? "positive" : "negative"}>{formatSignedPercent(totals.plPercent)}</em>
        </div>
        <div className="summary-card">
          <span>{t("src_client_pages_portfoliopage__l271__h15")}</span>
          <strong>{formatMoney(totals.dividend)}</strong>
          <em>Yield {(totals.marketValue > 0 ? (totals.dividend / totals.marketValue) * 100 : 0).toFixed(2)}%</em>
        </div>
      </section>

      {/* Performance chart */}
      <section className="portfolio-performance">
        <div className="performance-header">
          <h2>{t("src_client_pages_portfoliopage__l280__h16")}</h2>
          <div className="performance-tabs">
            {(["1W", "1M", "3M", "YTD", "1Y", "5Y"] as const).map((p) => (
              <button
                key={p}
                type="button"
                className={p === perfTimeframe ? "active" : ""}
                onClick={() => setPerfTimeframe(p)}
              >
                {p === "5Y" ? "ALL" : p}
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
            <h2>{t("src_client_pages_portfoliopage__l316__h17")}</h2>
            <div className="header-actions">
              <button onClick={() => handleExport("csv")} className="secondary-action-sm icon-btn" type="button"><HiArrowDownTray size={14} /> CSV</button>
              <button onClick={() => handleExport("json")} className="secondary-action-sm icon-btn" type="button"><HiArrowDownTray size={14} /> JSON</button>
              <button onClick={() => setShowAdd(true)} className="primary-action-sm icon-btn" type="button"><HiPlus size={14} /> Add Position</button>
            </div>
          </div>

          <div className="positions-table-wrap">
            <table className="positions-table">
              <thead>
                <tr>
                  <th onClick={() => { setSortBy("symbol"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }} scope="col">
                    Symbol{sortBy === "symbol" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                  </th>
                  <th scope="col">{t("src_client_pages_portfoliopage__l331__h21")}</th>
                  <th className="text-right" scope="col">{t("src_client_pages_portfoliopage__l332__h22")}</th>
                  <th className="text-right" scope="col">{t("src_client_pages_portfoliopage__l333__h23")}</th>
                  <th className="text-right" scope="col">{t("src_client_pages_portfoliopage__l334__h24")}</th>
                  <th className="text-right" onClick={() => { setSortBy("value"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }} scope="col">
                    Value{sortBy === "value" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                  </th>
                  <th className="text-right" onClick={() => { setSortBy("pl"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }} scope="col">
                    P/L{sortBy === "pl" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                  </th>
                  <th className="text-right" onClick={() => { setSortBy("plPercent"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }} scope="col">
                    P/L %{sortBy === "plPercent" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                  </th>
                  <th className="text-right" onClick={() => { setSortBy("yield"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }} scope="col">
                    Yield{sortBy === "yield" ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
                  </th>
                  <th scope="col">{t("src_client_pages_portfoliopage__l347__h25")}</th>
                </tr>
              </thead>
              <tbody>
                {sortedPositions.length === 0 ? (
                  <tr><td colSpan={10}>
                    <EmptyState
                      compact
                      icon="💼"
                      title={t("portfolio.emptyPositions")}
                      actionLabel={t("portfolio.addPosition")}
                      onAction={() => setShowAdd(true)}
                    />
                  </td></tr>
                ) : sortedPositions.map((pos) => {
                  const marketValue = pos.quantity * pos.currentPrice;
                  const cost = pos.quantity * pos.averageCost;
                  const pl = marketValue - cost;
                  const plPct = (pl / cost) * 100;
                  const isEditing = editingId === pos.id;
                  return (
                    <tr key={pos.id}>
                      <td>
                        <strong>{pos.symbol}</strong>
                        <span className="position-name">{pos.name}</span>
                      </td>
                      <td>
                        <span className={`type-pill type-${pos.type}`}>{TYPE_LABELS[pos.type]}</span>
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
                      <td className="text-right">{pos.dividendYield?.toFixed(2) ?? "—"}%</td>
                      <td>
                        <div className="row-actions">
                          <button type="button" onClick={() => setEditingId(isEditing ? null : pos.id)} className="row-btn" title="Edit">{isEditing ? <HiCheckCircle size={14} /> : <HiPencil size={13} />}</button>
                          <button type="button" onClick={() => deletePosition(activePortfolio.id, pos.id)} className="row-btn delete" title="Delete"><HiTrash size={13} /></button>
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
                log("portfolio_add", `Added ${data.symbol} to ${activePortfolio.name}`);
                setShowAdd(false);
              }}
            />
          )}

          {/* Transactions */}
          <div className="transactions-section">
            <h3>{t("src_client_pages_portfoliopage__l442__h29")}</h3>
            <div className="transactions-list">
              {activePortfolio.transactions.slice(0, 10).map((tx) => {
                const pos = activePortfolio.positions.find((p) => p.id === tx.positionId);
                return (
                  <div key={tx.id} className={`transaction-row ${tx.type}`}>
                    <span className="tx-date">{tx.date}</span>
                    <span className={`tx-type ${tx.type}`}>{tx.type}</span>
                    <span className="tx-symbol">{pos?.symbol ?? "—"}</span>
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
            <h3>Sector Allocation</h3>
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
            <h3>Asset Allocation</h3>
            <div className="aside-card-body">
              <div className="allocation-list">
                {assetAllocation.map((a) => {
                  const color = a.type === "stock" ? "#2563eb" : a.type === "crypto" ? "#f59e0b" : a.type === "etf" ? "#8b5cf6" : a.type === "bond" ? "#10b981" : "#94a3b8";
                  return (
                    <div key={a.type} className="allocation-row">
                      <span className="allocation-label">
                        <span className="allocation-dot" style={{ backgroundColor: color }} />
                        {TYPE_LABELS[a.type]}
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
            <h3>Portfolio Settings</h3>
            <div className="aside-card-body">
              <div className="settings-list">
                <div>
                  <span>Base Currency</span>
                  <select
                    value={activePortfolio.baseCurrency}
                    onChange={(e) => setBaseCurrency(activePortfolio.id, e.target.value as Position["type"] & string as never)}
                  >
                    {["USD", "EUR", "GBP", "JPY", "INR"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <span>Total Positions</span>
                  <strong>{totals.positionCount}</strong>
                </div>
                <div>
                  <span>Dividend Yield</span>
                  <strong>{(totals.marketValue > 0 ? (totals.dividend / totals.marketValue) * 100 : 0).toFixed(2)}%</strong>
                </div>
                <div>
                  <span>Last Updated</span>
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
      <h3>{t("src_client_pages_portfoliopage__l562__h37")}</h3>
      <div className="form-grid">
        <div>
          <label>{t("src_client_pages_portfoliopage__l565__h38")}</label>
          <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder={t("src_client_pages_portfoliopage__l566__h39")} required />
        </div>
        <div>
          <label>{t("src_client_pages_portfoliopage__l569__h40")}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("src_client_pages_portfoliopage__l570__h41")} required />
        </div>
        <div>
          <label>{t("src_client_pages_portfoliopage__l573__h42")}</label>
          <select value={type} onChange={(e) => setType(e.target.value as Position["type"])}>
            <option value="stock">{t("src_client_pages_portfoliopage__l575__h43")}</option>
            <option value="etf">{t("src_client_pages_portfoliopage__l576__h44")}</option>
            <option value="crypto">{t("src_client_pages_portfoliopage__l577__h45")}</option>
            <option value="forex">{t("src_client_pages_portfoliopage__l578__h46")}</option>
            <option value="commodity">{t("src_client_pages_portfoliopage__l579__h47")}</option>
            <option value="bond">{t("src_client_pages_portfoliopage__l580__h48")}</option>
          </select>
        </div>
        <div>
          <label>{t("src_client_pages_portfoliopage__l584__h49")}</label>
          <input value={sector} onChange={(e) => setSector(e.target.value)} placeholder={t("src_client_pages_portfoliopage__l585__h50")} />
        </div>
        <div>
          <label>{t("src_client_pages_portfoliopage__l588__h51")}</label>
          <input type="number" step="any" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={0} required />
        </div>
        <div>
          <label>{t("src_client_pages_portfoliopage__l592__h52")}</label>
          <input type="number" step="any" value={averageCost} onChange={(e) => setAverageCost(Number(e.target.value))} min={0} required />
        </div>
        <div>
          <label>{t("src_client_pages_portfoliopage__l596__h53")}</label>
          <input type="number" step="any" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} min={0} />
        </div>
        <div>
          <label>{t("src_client_pages_portfoliopage__l600__h54")}</label>
          <input type="number" step="any" value={dividendYield} onChange={(e) => setDividendYield(Number(e.target.value))} min={0} />
        </div>
        <div>
          <label>{t("src_client_pages_portfoliopage__l604__h55")}</label>
          <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="primary-action-sm">{t("src_client_pages_portfoliopage__l609__h56")}</button>
        <button type="button" onClick={onCancel} className="secondary-action-sm">{t("src_client_pages_portfoliopage__l610__h57")}</button>
      </div>
    </form>
  );
};

export default PortfolioPage;
