import React from "react";
import { Link } from "react-router-dom";
import { useWatchlistStore, type WatchlistSymbol } from "../stores/watchlistStore";
import { useActivityStore } from "../stores/activityStore";
import stocksData from "../../data/stocks.json";
import cryptocurrenciesData from "../../data/cryptocurrencies.json";
import currenciesData from "../../data/currencies.json";
import { formatSignedPercent } from "../lib/chartSeries";
import EmptyState from "../components/EmptyState";
import { useI18n } from "../i18n";
import "./WatchlistPage.css";

type Symbol = {
  symbol: string;
  name: string;
  type: WatchlistSymbol["type"];
  price: number;
  change: number;
  changePercent: number;
};

const stocks = (stocksData as { stocks: { symbol: string; name: string; price: number; change: number; changePercent: number }[] }).stocks;
const cryptos = (cryptocurrenciesData as { cryptocurrencies: { id: string; symbol: string; name: string; circulatingSupply: number }[] }).cryptocurrencies;
const currencies = (currenciesData as { currencies: { code: string; name: string; symbol: string }[] }).currencies;

const CRYPTO_BASE_PRICES: Record<string, number> = {
  BTC: 65000, ETH: 3200, BNB: 590, SOL: 145, ADA: 0.48, AVAX: 35,
  DOT: 6.8, TRX: 0.12, USDT: 1, USDC: 1, DAI: 1, LINK: 14, MATIC: 0.72, UNI: 8.5,
  ATOM: 8.1, XRP: 0.54, LTC: 82, XLM: 0.11, TON: 6.2, ARB: 1.1,
};

const buildSearchIndex = (): Symbol[] => {
  const result: Symbol[] = [];
  stocks.forEach((s) => {
    result.push({
      symbol: s.symbol,
      name: s.name,
      type: "stock",
      price: s.price,
      change: s.change,
      changePercent: s.changePercent,
    });
  });
  cryptos.forEach((c) => {
    const basePrice = CRYPTO_BASE_PRICES[c.symbol] ?? 10;
    const change = ((c.symbol.charCodeAt(0) % 10) - 4) * 0.5;
    result.push({
      symbol: c.symbol,
      name: c.name,
      type: "crypto",
      price: basePrice,
      change: change,
      changePercent: change,
    });
  });
  currencies.forEach((c) => {
    const rate = c.code === "USD" ? 1 : (c.code === "JPY" ? 155 : c.code === "INR" ? 83.5 : c.code === "EUR" ? 0.92 : c.code === "GBP" ? 0.79 : 1.5);
    result.push({
      symbol: c.code,
      name: c.name,
      type: "currency",
      price: rate,
      change: rate * 0.005,
      changePercent: 0.5,
    });
  });
  return result;
};

const SEARCH_INDEX = buildSearchIndex();

const WatchlistPage: React.FC = () => {
  const {
    watchlists,
    activeWatchlistId,
    createWatchlist,
    renameWatchlist,
    deleteWatchlist,
    setActiveWatchlist,
    addSymbol,
    removeSymbol,
    toggleAlert,
  } = useWatchlistStore();
  const { log } = useActivityStore();
  const { t } = useI18n();

  const [showCreate, setShowCreate] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");
  const [renamingId, setRenamingId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchType, setSearchType] = React.useState<"all" | "stock" | "crypto" | "currency">("all");
  const [sortBy, setSortBy] = React.useState<"default" | "alpha" | "price" | "change" | "changePercent">("default");
  const [filterType, setFilterType] = React.useState<"all" | WatchlistSymbol["type"]>("all");
  const [filterChange, setFilterChange] = React.useState<"all" | "gainers" | "losers">("all");

  const activeWatchlist = watchlists.find((wl) => wl.id === activeWatchlistId) ?? watchlists[0];

  React.useEffect(() => {
    if (activeWatchlist && activeWatchlist.symbols.length === 0) {
      log("view", `Opened watchlist: ${activeWatchlist.name}`);
    }
  }, [activeWatchlist, log]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const id = createWatchlist(newName.trim(), newDescription.trim());
    log("watchlist_create", `Created watchlist: ${newName.trim()}`);
    setNewName("");
    setNewDescription("");
    setShowCreate(false);
    setActiveWatchlist(id);
  };

  const handleRename = (id: string) => {
    if (!renameValue.trim()) return;
    renameWatchlist(id, renameValue.trim());
    log("watchlist_create", `Renamed watchlist to: ${renameValue.trim()}`);
    setRenamingId(null);
    setRenameValue("");
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(t("watchlist.deleteConfirm", { name }))) {
      deleteWatchlist(id);
      log("watchlist_delete", `Deleted watchlist: ${name}`);
    }
  };

  const handleAdd = (symbol: Symbol) => {
    if (!activeWatchlist) return;
    addSymbol(activeWatchlist.id, {
      symbol: symbol.symbol,
      name: symbol.name,
      type: symbol.type,
      price: symbol.price,
      change: symbol.change,
      changePercent: symbol.changePercent,
      addedAt: Date.now(),
    });
    log("watchlist_add", `Added ${symbol.symbol} to ${activeWatchlist.name}`);
  };

  const handleRemove = (symbol: string) => {
    if (!activeWatchlist) return;
    removeSymbol(activeWatchlist.id, symbol);
    log("watchlist_remove", `Removed ${symbol} from ${activeWatchlist.name}`);
  };

  const handleToggleAlert = (symbol: string, enabled: boolean, price?: number) => {
    if (!activeWatchlist) return;
    toggleAlert(activeWatchlist.id, symbol, enabled, price);
    log("alert_create", `${enabled ? "Created" : "Removed"} alert for ${symbol}${price ? ` at $${price}` : ""}`);
  };

  const searchResults = React.useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return SEARCH_INDEX
      .filter((s) => {
        if (searchType !== "all" && s.type !== searchType) return false;
        return s.symbol.toLowerCase().includes(term) || s.name.toLowerCase().includes(term);
      })
      .slice(0, 8);
  }, [searchTerm, searchType]);

  const sortedSymbols = React.useMemo(() => {
    if (!activeWatchlist) return [];
    let symbols = [...activeWatchlist.symbols];
    if (filterType !== "all") symbols = symbols.filter((s) => s.type === filterType);
    if (filterChange === "gainers") symbols = symbols.filter((s) => s.changePercent >= 0);
    if (filterChange === "losers") symbols = symbols.filter((s) => s.changePercent < 0);

    switch (sortBy) {
      case "alpha":
        symbols.sort((a, b) => a.symbol.localeCompare(b.symbol));
        break;
      case "price":
        symbols.sort((a, b) => b.price - a.price);
        break;
      case "change":
        symbols.sort((a, b) => b.change - a.change);
        break;
      case "changePercent":
        symbols.sort((a, b) => b.changePercent - a.changePercent);
        break;
    }
    return symbols;
  }, [activeWatchlist, sortBy, filterType, filterChange]);

  const isInWatchlist = (symbol: string) => {
    if (!activeWatchlist) return false;
    return activeWatchlist.symbols.some((s) => s.symbol === symbol);
  };

  return (
    <div className="page watchlist-page">
      <section className="coverage-hero watchlist-hero">
        <div>
          <p className="eyebrow">{t("watchlist.savedMarkets")}</p>
          <h1>{t("watchlist.title")}</h1>
          <p>{t("watchlist.subtitle")}</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile"><span>{t("watchlist.lists")}</span><strong>{watchlists.length}</strong></div>
          <div className="metric-tile"><span>{t("watchlist.totalSymbols")}</span><strong>{watchlists.reduce((s, w) => s + w.symbols.length, 0)}</strong></div>
          <div className="metric-tile"><span>{t("watchlist.activeAlerts")}</span><strong>{watchlists.reduce((s, w) => s + w.symbols.filter((sym) => sym.alertEnabled).length, 0)}</strong></div>
        </div>
      </section>

      <div className="watchlist-layout">
        {/* Sidebar */}
        <aside className="watchlist-sidebar">
          <div className="watchlist-sidebar-header">
            <h3>My Lists</h3>
            <button type="button" onClick={() => setShowCreate(true)} className="add-list-btn">+ New</button>
          </div>

          {showCreate && (
            <div className="create-form">
              <input
                type="text"
                placeholder="List name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              <div className="form-actions">
                <button onClick={handleCreate} className="primary-action-sm" type="button">Create</button>
                <button onClick={() => { setShowCreate(false); setNewName(""); setNewDescription(""); }} className="secondary-action-sm" type="button">Cancel</button>
              </div>
            </div>
          )}

          <div className="watchlist-list">
            {watchlists.map((wl) => (
              <div
                key={wl.id}
                className={`watchlist-list-item ${wl.id === activeWatchlistId ? "active" : ""}`}
                onClick={() => setActiveWatchlist(wl.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") setActiveWatchlist(wl.id); }}
              >
                <div className="wl-color" style={{ backgroundColor: wl.color }} />
                <div className="wl-info">
                  {renamingId === wl.id ? (
                    <input
                      type="text"
                      defaultValue={wl.name}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) => {
                        if (e.target.value.trim() && e.target.value !== wl.name) {
                          setRenameValue(e.target.value);
                          handleRename(wl.id);
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
                    <strong>{wl.name}</strong>
                  )}
                  <span>{wl.symbols.length} symbols</span>
                </div>
                <div className="wl-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => {
                      setRenamingId(wl.id);
                      setRenameValue(wl.name);
                    }}
                    aria-label="Rename"
                    title="Rename"
                  >✎</button>
                  {watchlists.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDelete(wl.id, wl.name)}
                      aria-label="Delete"
                      title="Delete"
                    >🗑</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="watchlist-main">
          {activeWatchlist ? (
            <>
              <div className="watchlist-header">
                <div>
                  <h2>{activeWatchlist.icon} {activeWatchlist.name}</h2>
                  <p>{activeWatchlist.description || "No description"}</p>
                </div>
                <div className="watchlist-summary">
                  <div><span>Symbols</span><strong>{activeWatchlist.symbols.length}</strong></div>
                  <div><span>Gainers</span><strong className="positive">{activeWatchlist.symbols.filter((s) => s.changePercent >= 0).length}</strong></div>
                  <div><span>Losers</span><strong className="negative">{activeWatchlist.symbols.filter((s) => s.changePercent < 0).length}</strong></div>
                </div>
              </div>

              <div className="watchlist-controls">
                <div className="control-group">
                  <label>Sort:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
                    <option value="default">Default</option>
                    <option value="alpha">Alphabetical</option>
                    <option value="price">Price (high-low)</option>
                    <option value="change">Change (high-low)</option>
                    <option value="changePercent">Change % (high-low)</option>
                  </select>
                </div>
                <div className="control-group">
                  <label>Type:</label>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value as typeof filterType)}>
                    <option value="all">All</option>
                    <option value="stock">Stocks</option>
                    <option value="crypto">Crypto</option>
                    <option value="currency">FX</option>
                    <option value="etf">ETFs</option>
                    <option value="commodity">Commodities</option>
                    <option value="index">Indices</option>
                  </select>
                </div>
                <div className="control-group">
                  <label>Movement:</label>
                  <select value={filterChange} onChange={(e) => setFilterChange(e.target.value as typeof filterChange)}>
                    <option value="all">All</option>
                    <option value="gainers">Gainers</option>
                    <option value="losers">Losers</option>
                  </select>
                </div>
              </div>

              <div className="watchlist-table-wrap">
                <table className="watchlist-table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Change</th>
                      <th className="text-right">Change %</th>
                      <th>Alert</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSymbols.length === 0 ? (
                      <tr>
                        <td colSpan={8}>
                          <EmptyState
                            compact
                            icon="⭐"
                            title={t("watchlist.emptyTable")}
                            description={t("watchlist.typeToSearch")}
                          />
                        </td>
                      </tr>
                    ) : sortedSymbols.map((sym) => (
                      <tr key={sym.symbol}>
                        <td>
                          <strong>{sym.symbol}</strong>
                        </td>
                        <td>{sym.name}</td>
                        <td>
                          <span className={`type-pill type-${sym.type}`}>{sym.type}</span>
                        </td>
                        <td className="text-right">
                          <strong>${sym.price.toFixed(sym.type === "currency" ? 4 : 2)}</strong>
                        </td>
                        <td className={`text-right ${sym.change >= 0 ? "positive" : "negative"}`}>
                          {sym.change >= 0 ? "+" : ""}{sym.change.toFixed(sym.type === "currency" ? 4 : 2)}
                        </td>
                        <td className={`text-right ${sym.changePercent >= 0 ? "positive" : "negative"}`}>
                          {formatSignedPercent(sym.changePercent)}
                        </td>
                        <td>
                          <div className="alert-control">
                            <button
                              type="button"
                              onClick={() => handleToggleAlert(sym.symbol, !sym.alertEnabled, sym.alertPrice)}
                              className={sym.alertEnabled ? "active" : ""}
                              aria-label="Toggle alert"
                            >
                              {sym.alertEnabled ? "🔔" : "🔕"}
                            </button>
                            {sym.alertEnabled && (
                              <span className="alert-price">@ ${sym.alertPrice?.toFixed(2) ?? "—"}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="row-actions">
                            <Link to={sym.type === "currency" ? `/currencies/${sym.symbol.split("/")[0]}` : `/${sym.type === "crypto" ? "crypto" : "stocks"}/${sym.symbol.split("/")[0]}`} className="view-btn" title="View">📈</Link>
                            <button type="button" onClick={() => handleRemove(sym.symbol)} className="remove-btn" title="Remove">✕</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="empty-active">
              <p>No active watchlist. Create one from the sidebar.</p>
            </div>
          )}
        </main>

        {/* Search panel */}
        <aside className="search-panel">
          <h3>Add Symbol</h3>
          <input
            type="text"
            placeholder="Search symbol or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="search-filters">
            {(["all", "stock", "crypto", "currency"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSearchType(t)}
                className={searchType === t ? "active" : ""}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="search-results">
            {searchTerm && searchResults.length === 0 && (
              <p className="empty">No matches found</p>
            )}
            {!searchTerm && (
              <p className="empty">Type to search across stocks, crypto, and currencies</p>
            )}
            {searchResults.map((sym) => {
              const isAdded = isInWatchlist(sym.symbol);
              return (
                <div key={sym.symbol} className="search-result-row">
                  <div className="search-result-info">
                    <strong>{sym.symbol}</strong>
                    <span>{sym.name}</span>
                    <em className={sym.changePercent >= 0 ? "positive" : "negative"}>
                      {formatSignedPercent(sym.changePercent)}
                    </em>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAdd(sym)}
                    disabled={isAdded}
                    className="add-btn"
                  >
                    {isAdded ? "Added" : "+ Add"}
                  </button>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default WatchlistPage;
