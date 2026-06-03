import React from "react";
import { Link } from "react-router-dom";
import { useWatchlistStore, type WatchlistSymbol } from "../stores/watchlistStore";
import { useActivityStore } from "../stores/activityStore";
import { fetchJson } from "../lib/apiClient";
import { formatSignedPercent } from "../lib/chartSeries";
import EmptyState from "../components/EmptyState";
import "./WatchlistPage.css";
import { useI18n } from "../i18n";


type Symbol = {
  symbol: string;
  name: string;
  type: WatchlistSymbol["type"];
  price: number;
  change: number;
  changePercent: number;
};

// Catalog item shape from /api/catalog
type CatalogItem = {
  symbol: string;
  name: string;
  type: "stock" | "currency" | "crypto" | "index" | "etf" | "commodity";
  exchange?: string;
  currency?: string;
};

const symbolFromCatalog = (c: CatalogItem): Symbol => {
  // Price/changes for newly-searched symbols start as 0 — the watchlist row will show "—"
  // until live data lands via the same catalog endpoint (extended in a future phase).
  return { symbol: c.symbol, name: c.name, type: c.type, price: 0, change: 0, changePercent: 0 };
};

const WatchlistPage: React.FC = () => {
  const { t } = useI18n();
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

  // Backend-driven search catalog (replaces the static JSON imports).
  const [searchResults, setSearchResults] = React.useState<Symbol[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const syncFromBackend = useWatchlistStore((s) => s.syncFromBackend);

  // Boot-time: pull the user's watchlists from the backend so the page
  // reflects the persisted state across devices.
  React.useEffect(() => {
    void syncFromBackend();
  }, [syncFromBackend]);

  // Debounced catalog search via /api/catalog.
  React.useEffect(() => {
    if (!searchTerm.trim()) { setSearchResults([]); return; }
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const params = new URLSearchParams({ q: searchTerm.trim(), limit: "8" });
        if (searchType !== "all") params.set("type", searchType);
        const res = await fetchJson<CatalogItem[]>(`/catalog?${params.toString()}`);
        if (res.success && Array.isArray(res.data)) {
          setSearchResults(res.data.map(symbolFromCatalog));
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 220);
    return () => { clearTimeout(timer); ctrl.abort(); };
  }, [searchTerm, searchType]);

  const activeWatchlist = watchlists.find((wl) => wl.id === activeWatchlistId) ?? watchlists[0];

  React.useEffect(() => {
    if (activeWatchlist && activeWatchlist.symbols.length === 0) {
      log("view", `Opened watchlist: ${activeWatchlist.name}`);
    }
  }, [activeWatchlist, log]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const name = newName.trim();
    const description = newDescription.trim();
    setNewName("");
    setNewDescription("");
    setShowCreate(false);
    // createWatchlist is now async (writes to backend); update UI optimistically
    // and let the store resolve the id when the server responds.
    createWatchlist(name, description)
      .then((id) => {
        setActiveWatchlist(id);
        log("watchlist_create", `Created watchlist: ${name}`);
      })
      .catch(() => {
        // Store already rolled back; nothing to do here.
      });
  };

  const handleRename = (id: string) => {
    if (!renameValue.trim()) return;
    const newName = renameValue.trim();
    setRenamingId(null);
    setRenameValue("");
    void renameWatchlist(id, newName)
      .then(() => log("watchlist_create", `Renamed watchlist to: ${newName}`))
      .catch(() => { /* store already rolled back */ });
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(t("watchlist.deleteConfirm", { name }))) {
      void deleteWatchlist(id)
        .then(() => log("watchlist_delete", `Deleted watchlist: ${name}`))
        .catch(() => { /* store already rolled back */ });
    }
  };

  const handleAdd = (symbol: Symbol) => {
    if (!activeWatchlist) return;
    const name = activeWatchlist.name;
    void addSymbol(activeWatchlist.id, {
      symbol: symbol.symbol,
      name: symbol.name,
      type: symbol.type,
      price: symbol.price,
      change: symbol.change,
      changePercent: symbol.changePercent,
      addedAt: Date.now(),
    })
      .then(() => log("watchlist_add", `Added ${symbol.symbol} to ${name}`))
      .catch(() => { /* store already rolled back */ });
  };

  const handleRemove = (symbol: string) => {
    if (!activeWatchlist) return;
    const name = activeWatchlist.name;
    void removeSymbol(activeWatchlist.id, symbol)
      .then(() => log("watchlist_remove", `Removed ${symbol} from ${name}`))
      .catch(() => { /* store already rolled back */ });
  };

  const handleToggleAlert = (symbol: string, enabled: boolean, price?: number) => {
    if (!activeWatchlist) return;
    void toggleAlert(activeWatchlist.id, symbol, enabled, price)
      .then(() => log("alert_create", `${enabled ? "Created" : "Removed"} alert for ${symbol}${price ? ` at $${price}` : ""}`))
      .catch(() => { /* local-only UI preference */ });
  };

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
            <h3>{t("watchlist.myLists")}</h3>
            <button type="button" onClick={() => setShowCreate(true)} className="add-list-btn">{t("watchlist.newList")}</button>
          </div>

          {showCreate && (
            <div className="create-form">
              <input
                type="text"
                placeholder={t("watchlist.listName")}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
              <input
                type="text"
                placeholder={t("watchlist.descriptionOptional")}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              <div className="form-actions">
                <button onClick={handleCreate} className="primary-action-sm" type="button">{t("watchlist.create")}</button>
                <button onClick={() => { setShowCreate(false); setNewName(""); setNewDescription(""); }} className="secondary-action-sm" type="button">{t("cancel")}</button>
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
                    aria-label={t("src_client_pages_watchlistpage__l289__h1")}
                    title={t("src_client_pages_watchlistpage__l290__h3")}
                  >✎</button>
                  {watchlists.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDelete(wl.id, wl.name)}
                      aria-label={t("src_client_pages_watchlistpage__l296__h4")}
                      title={t("src_client_pages_watchlistpage__l297__h6")}
                    >{t("src_client_pages_watchlistpage__l298__h7")}</button>
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
                  <div><span>{t("src_client_pages_watchlistpage__l316__h8")}</span><strong>{activeWatchlist.symbols.length}</strong></div>
                  <div><span>{t("src_client_pages_watchlistpage__l317__h9")}</span><strong className="positive">{activeWatchlist.symbols.filter((s) => s.changePercent >= 0).length}</strong></div>
                  <div><span>{t("src_client_pages_watchlistpage__l318__h10")}</span><strong className="negative">{activeWatchlist.symbols.filter((s) => s.changePercent < 0).length}</strong></div>
                </div>
              </div>

              <div className="watchlist-controls">
                <div className="control-group">
                  <label>{t("watchlist.sort")}</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
                    <option value="default">{t("watchlist.sortDefault")}</option>
                    <option value="alpha">{t("watchlist.sortAlpha")}</option>
                    <option value="price">{t("watchlist.sortPrice")}</option>
                    <option value="change">{t("watchlist.sortChange")}</option>
                    <option value="changePercent">{t("watchlist.sortChangePct")}</option>
                  </select>
                </div>
                <div className="control-group">
                  <label>{t("watchlist.type")}</label>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value as typeof filterType)}>
                    <option value="all">{t("watchlist.filterAll")}</option>
                    <option value="stock">{t("screener.stocks")}</option>
                    <option value="crypto">{t("screener.crypto")}</option>
                    <option value="currency">{t("screener.forex")}</option>
                    <option value="etf">{t("screener.etfs")}</option>
                    <option value="commodity">{t("src_client_pages_watchlistpage__l341__h12")}</option>
                    <option value="index">{t("src_client_pages_watchlistpage__l342__h13")}</option>
                  </select>
                </div>
                <div className="control-group">
                  <label>{t("watchlist.movement")}</label>
                  <select value={filterChange} onChange={(e) => setFilterChange(e.target.value as typeof filterChange)}>
                    <option value="all">{t("watchlist.filterAll")}</option>
                    <option value="gainers">{t("watchlist.filterGainers")}</option>
                    <option value="losers">{t("watchlist.filterLosers")}</option>
                  </select>
                </div>
              </div>

              <div className="watchlist-table-wrap">
                <table className="watchlist-table">
                  <thead>
                    <tr>
                      <th>{t("src_client_pages_watchlistpage__l359__h14")}</th>
                      <th>{t("src_client_pages_watchlistpage__l360__h15")}</th>
                      <th>{t("src_client_pages_watchlistpage__l361__h16")}</th>
                      <th className="text-right">{t("src_client_pages_watchlistpage__l362__h17")}</th>
                      <th className="text-right">{t("src_client_pages_watchlistpage__l363__h18")}</th>
                      <th className="text-right">{t("src_client_pages_watchlistpage__l364__h19")}</th>
                      <th>{t("src_client_pages_watchlistpage__l365__h20")}</th>
                      <th>{t("src_client_pages_watchlistpage__l366__h21")}</th>
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
                              aria-label={t("src_client_pages_watchlistpage__l405__h22")}
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
                            <Link to={sym.type === "currency" ? `/currencies/${sym.symbol.split("/")[0]}` : `/${sym.type === "crypto" ? "crypto" : "stocks"}/${sym.symbol.split("/")[0]}`} className="view-btn" title={t("viewDetails")}>📈</Link>
                            <button type="button" onClick={() => handleRemove(sym.symbol)} className="remove-btn" title={t("delete")}>✕</button>
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
              <p>{t("watchlist.noActive")}</p>
            </div>
          )}
        </main>

        {/* Search panel */}
        <aside className="search-panel">
          <h3>{t("watchlist.addSymbol")}</h3>
          <input
            type="text"
            placeholder={t("watchlist.searchPlaceholder")}
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
              <p className="empty">{t("watchlist.noMatches")}</p>
            )}
            {!searchTerm && (
              <p className="empty">{t("watchlist.typeToSearch")}</p>
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
                    {isAdded ? t("watchlist.added") : t("watchlist.addBtn")}
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
