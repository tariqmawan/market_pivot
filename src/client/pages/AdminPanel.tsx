import React from "react";
import { useAuthStore } from "../stores/authStore";
import {
  StockExchange,
  Currency,
  Cryptocurrency,
  MarketRegion,
  StockSector,
  Commodity,
} from "../../types";

import exchangesData from "../../data/exchanges.json";
import currenciesData from "../../data/currencies.json";
import cryptoData from "../../data/cryptocurrencies.json";
import regionsData from "../../data/regions.json";
import sectorsData from "../../data/sectors.json";
import commoditiesData from "../../data/commodities.json";

type Pillar = "exchanges" | "currencies" | "cryptos" | "regions" | "sectors" | "commodities";

const STORAGE_PREFIX = "mp_admin_";

const keyFor = (p: Pillar) => `${STORAGE_PREFIX}${p}`;

const AdminPanel: React.FC = () => {
  const { user } = useAuthStore();
  const [maintenance, setMaintenance] = React.useState(false);
  const [logs, setLogs] = React.useState<string[]>([
    "2026-05-12 09:12:34 - User login: demo@google.com",
    "2026-05-12 09:15:02 - Pricing page updated",
    "2026-05-12 09:21:47 - New signup: newuser@email.com",
  ]);

  const [active, setActive] = React.useState<Pillar>("exchanges");

  // data states
  const [exchanges, setExchanges] = React.useState<StockExchange[]>([]);
  const [currencies, setCurrencies] = React.useState<Currency[]>([]);
  const [cryptos, setCryptos] = React.useState<Cryptocurrency[]>([]);
  const [regions, setRegions] = React.useState<MarketRegion[]>([]);
  const [sectors, setSectors] = React.useState<StockSector[]>([]);
  const [commodities, setCommodities] = React.useState<Commodity[]>([]);

  const loadInitial = React.useCallback(() => {
    // load from localStorage if present, else from bundled data
    const ex = localStorage.getItem(keyFor("exchanges"));
    setExchanges(ex ? JSON.parse(ex) : (exchangesData.exchanges as StockExchange[]));

    const cu = localStorage.getItem(keyFor("currencies"));
    setCurrencies(cu ? JSON.parse(cu) : (currenciesData.currencies as Currency[]));

    const cr = localStorage.getItem(keyFor("cryptos"));
    setCryptos(cr ? JSON.parse(cr) : (cryptoData.cryptocurrencies as Cryptocurrency[]));

    const rg = localStorage.getItem(keyFor("regions"));
    setRegions(rg ? JSON.parse(rg) : (regionsData.regions as unknown as MarketRegion[]));

    const ss = localStorage.getItem(keyFor("sectors"));
    setSectors(ss ? JSON.parse(ss) : (sectorsData.sectors as StockSector[]));

    const cm = localStorage.getItem(keyFor("commodities"));
    setCommodities(cm ? JSON.parse(cm) : (commoditiesData.commodities as Commodity[]));
  }, []);

  React.useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const persist = (p: Pillar, data: any) => {
    localStorage.setItem(keyFor(p), JSON.stringify(data));
    setLogs((l) => [`${new Date().toISOString()} - Updated ${p}`, ...l].slice(0, 50));
  };

  // simple CRUD helpers
  const addItem = (p: Pillar) => {
    const id = `${p}_${Date.now()}`;
    if (p === "exchanges") {
      const item: StockExchange = {
        id,
        name: "New Exchange",
        country: "",
        countryCode: "",
        region: "",
        timezone: "UTC",
        currency: "USD",
        tradingHours: { open: "09:00", close: "17:00", timezone: "UTC" },
        mainIndex: "IDX",
        mainIndexName: "Main Index",
        description: "",
        founded: 2000,
        website: "",
        logo: "",
        marketCap: 0,
        listedCompanies: 0,
        avgDailyVolume: 0,
      };
      const next = [item, ...exchanges];
      setExchanges(next);
      persist(p, next);
      return;
    }

    if (p === "currencies") {
      const item: Currency = {
        code: id,
        name: "New Currency",
        symbol: "N",
        country: "",
        countryCode: "",
        region: "",
        type: "fiat",
        centralBank: "",
        description: "",
        logo: "",
      };
      const next = [item, ...currencies];
      setCurrencies(next);
      persist(p, next);
      return;
    }

    if (p === "cryptos") {
      const item: Cryptocurrency = {
        id,
        symbol: id.slice(0, 4).toUpperCase(),
        name: "New Crypto",
        category: "Infrastructure",
        description: "",
        launched: 2020,
        founder: "",
        maxSupply: null,
        circulatingSupply: 0,
        consensusMechanism: "",
        blockTime: null,
        logo: "",
      };
      const next = [item, ...cryptos];
      setCryptos(next);
      persist(p, next);
      return;
    }

    if (p === "regions") {
      const item: MarketRegion = {
        id,
        name: "New Region",
        group: "Asia-Pacific",
        summary: "",
        countries: [],
        majorExchanges: [],
        currencies: [],
        keyIndices: [],
        gdpGrowth: 0,
        inflation: 0,
        commodityImpact: "",
        calendarFocus: [],
        sectorLeaders: [],
        newsThemes: [],
      };
      const next = [item, ...regions];
      setRegions(next);
      persist(p, next);
      return;
    }

    if (p === "sectors") {
      const item: StockSector = {
        id,
        name: "New Sector",
        category: "Thematic",
        summary: "",
        topCompanies: [],
        etfs: [],
        peRatio: 0,
        performanceYtd: 0,
        trendingStocks: [],
        dividendLeaders: [],
        relatedRegions: [],
        newsThemes: [],
      };
      const next = [item, ...sectors];
      setSectors(next);
      persist(p, next);
      return;
    }

    if (p === "commodities") {
      const item: Commodity = {
        id,
        name: "New Commodity",
        symbol: id.slice(0, 3).toUpperCase(),
        category: "Industrial",
        unit: "unit",
        spotPrice: 0,
        changePercent24h: 0,
        futuresContract: "",
        supplyRegions: [],
        demandTrends: [],
        currencyCorrelation: "",
        economicImpact: "",
      };
      const next = [item, ...commodities];
      setCommodities(next);
      persist(p, next);
      return;
    }
  };

  const removeItem = (p: Pillar, id: string) => {
    if (p === "exchanges") {
      const next = exchanges.filter((e) => e.id !== id);
      setExchanges(next);
      persist(p, next);
      return;
    }
    if (p === "currencies") {
      const next = currencies.filter((c) => c.code !== id);
      setCurrencies(next);
      persist(p, next);
      return;
    }
    if (p === "cryptos") {
      const next = cryptos.filter((c) => c.id !== id);
      setCryptos(next);
      persist(p, next);
      return;
    }
    if (p === "regions") {
      const next = regions.filter((r) => r.id !== id);
      setRegions(next);
      persist(p, next);
      return;
    }
    if (p === "sectors") {
      const next = sectors.filter((s) => s.id !== id);
      setSectors(next);
      persist(p, next);
      return;
    }
    if (p === "commodities") {
      const next = commodities.filter((c) => c.id !== id);
      setCommodities(next);
      persist(p, next);
      return;
    }
  };

  const updateItem = (p: Pillar, id: string, updated: any) => {
    if (p === "exchanges") {
      const next = exchanges.map((e) => (e.id === id ? updated : e));
      setExchanges(next);
      persist(p, next);
      return;
    }
    if (p === "currencies") {
      const next = currencies.map((c) => (c.code === id ? updated : c));
      setCurrencies(next);
      persist(p, next);
      return;
    }
    if (p === "cryptos") {
      const next = cryptos.map((c) => (c.id === id ? updated : c));
      setCryptos(next);
      persist(p, next);
      return;
    }
    if (p === "regions") {
      const next = regions.map((r) => (r.id === id ? updated : r));
      setRegions(next);
      persist(p, next);
      return;
    }
    if (p === "sectors") {
      const next = sectors.map((s) => (s.id === id ? updated : s));
      setSectors(next);
      persist(p, next);
      return;
    }
    if (p === "commodities") {
      const next = commodities.map((c) => (c.id === id ? updated : c));
      setCommodities(next);
      persist(p, next);
      return;
    }
  };

  // editing modal
  const [editingItem, setEditingItem] = React.useState<any | null>(null);
  const [editingPillar, setEditingPillar] = React.useState<Pillar | null>(null);
  const [editingText, setEditingText] = React.useState("");

  const openEditor = (p: Pillar, item: any) => {
    setEditingPillar(p);
    setEditingItem(item);
    setEditingText(JSON.stringify(item, null, 2));
  };

  const saveEditor = () => {
    if (!editingPillar || !editingItem) return;
    try {
      const parsed = JSON.parse(editingText);
      updateItem(editingPillar, editingItem.id ?? editingItem.code, parsed);
      setEditingItem(null);
      setEditingPillar(null);
    } catch (err) {
      alert("Invalid JSON: " + (err as Error).message);
    }
  };

  return (
    <div className="page admin-page">
      <div className="section-heading">
        <h1>Admin Console</h1>
        <p>Administrative dashboard — quick site controls and telemetry.</p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        {(["exchanges", "currencies", "cryptos", "regions", "sectors", "commodities"] as Pillar[]).map((p) => (
          <button key={p} onClick={() => setActive(p)} className={active === p ? "primary-action" : "secondary-action"}>
            {p}
          </button>
        ))}
      </div>

      <section>
        <div style={{ marginBottom: 8 }}>
          <button onClick={() => addItem(active)} className="primary-action">Add New</button>
          <button onClick={() => {
            // clear saved and reload defaults
            localStorage.removeItem(keyFor(active));
            loadInitial();
          }} className="secondary-action" style={{ marginLeft: 8 }}>Reset to defaults</button>
        </div>

        <div>
          {active === "exchanges" && (
            <div>
              <h3>Exchanges ({exchanges.length})</h3>
              <ul>
                {exchanges.map((e) => (
                  <li key={e.id} style={{ marginBottom: 6 }}>
                    <strong>{e.name}</strong> — {e.country} — {e.currency}
                    <div style={{ display: "inline-block", marginLeft: 8 }}>
                      <button onClick={() => openEditor("exchanges", e)} className="secondary-action">Edit</button>
                      <button onClick={() => removeItem("exchanges", e.id)} className="link-button" style={{ marginLeft: 6 }}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {active === "currencies" && (
            <div>
              <h3>Currencies ({currencies.length})</h3>
              <ul>
                {currencies.map((c) => (
                  <li key={c.code} style={{ marginBottom: 6 }}>
                    <strong>{c.code}</strong> — {c.name}
                    <div style={{ display: "inline-block", marginLeft: 8 }}>
                      <button onClick={() => openEditor("currencies", c)} className="secondary-action">Edit</button>
                      <button onClick={() => removeItem("currencies", c.code)} className="link-button" style={{ marginLeft: 6 }}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {active === "cryptos" && (
            <div>
              <h3>Cryptocurrencies ({cryptos.length})</h3>
              <ul>
                {cryptos.map((c) => (
                  <li key={c.id} style={{ marginBottom: 6 }}>
                    <strong>{c.name} ({c.symbol})</strong>
                    <div style={{ display: "inline-block", marginLeft: 8 }}>
                      <button onClick={() => openEditor("cryptos", c)} className="secondary-action">Edit</button>
                      <button onClick={() => removeItem("cryptos", c.id)} className="link-button" style={{ marginLeft: 6 }}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {active === "regions" && (
            <div>
              <h3>Regions ({regions.length})</h3>
              <ul>
                {regions.map((r) => (
                  <li key={r.id} style={{ marginBottom: 6 }}>
                    <strong>{r.name}</strong> — {r.group}
                    <div style={{ display: "inline-block", marginLeft: 8 }}>
                      <button onClick={() => openEditor("regions", r)} className="secondary-action">Edit</button>
                      <button onClick={() => removeItem("regions", r.id)} className="link-button" style={{ marginLeft: 6 }}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {active === "sectors" && (
            <div>
              <h3>Sectors ({sectors.length})</h3>
              <ul>
                {sectors.map((s) => (
                  <li key={s.id} style={{ marginBottom: 6 }}>
                    <strong>{s.name}</strong> — {s.category}
                    <div style={{ display: "inline-block", marginLeft: 8 }}>
                      <button onClick={() => openEditor("sectors", s)} className="secondary-action">Edit</button>
                      <button onClick={() => removeItem("sectors", s.id)} className="link-button" style={{ marginLeft: 6 }}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {active === "commodities" && (
            <div>
              <h3>Commodities ({commodities.length})</h3>
              <ul>
                {commodities.map((c) => (
                  <li key={c.id} style={{ marginBottom: 6 }}>
                    <strong>{c.name} ({c.symbol})</strong> — {c.category}
                    <div style={{ display: "inline-block", marginLeft: 8 }}>
                      <button onClick={() => openEditor("commodities", c)} className="secondary-action">Edit</button>
                      <button onClick={() => removeItem("commodities", c.id)} className="link-button" style={{ marginLeft: 6 }}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Editor modal */}
      {editingItem && (
        <div className="modal-overlay" onClick={() => setEditingItem(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 900 }}>
            <div className="modal-header">
              <h2>Edit {editingPillar}</h2>
            </div>
            <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} rows={20} style={{ width: "100%" }} />
            <div style={{ marginTop: 8 }}>
              <button onClick={saveEditor} className="primary-action">Save</button>
              <button onClick={() => setEditingItem(null)} className="secondary-action" style={{ marginLeft: 8 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
