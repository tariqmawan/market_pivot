import React from "react";
import { Link } from "react-router-dom";
import stocksData from "../../data/stocks.json";
import cryptocurrenciesData from "../../data/cryptocurrencies.json";
import currenciesData from "../../data/currencies.json";
import sectorsData from "../../data/sectors.json";
import { useActivityStore } from "../stores/activityStore";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { formatMoney, formatSignedPercent, formatVolume } from "../lib/chartSeries";
import "./AdvancedScreenerPage.css";
import { useI18n } from "../i18n";



type AssetType = "stock" | "forex" | "crypto" | "etf";

type ScreenResult = {
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  eps: number;
  dividendYield: number;
  beta: number;
  rsi: number;
  sma50: number;
  sma200: number;
  momentum: number;
  volatility: number;
  sector: string;
  country: string;
  exchange: string;
};

type Filters = {
  query: string;
  assetType: AssetType | "all";
  exchange: string;
  sector: string;
  country: string;
  priceMin: string;
  priceMax: string;
  marketCapMin: string;
  marketCapMax: string;
  volumeMin: string;
  peMin: string;
  peMax: string;
  dividendMin: string;
  betaMin: string;
  betaMax: string;
  rsiMin: string;
  rsiMax: string;
  momentumMin: string;
  volatilityMax: string;
  performanceMin: string;
  performanceMax: string;
  aboveSma50: boolean;
  aboveSma200: boolean;
};

const DEFAULT_FILTERS: Filters = {
  query: "",
  assetType: "all",
  exchange: "all",
  sector: "all",
  country: "all",
  priceMin: "",
  priceMax: "",
  marketCapMin: "",
  marketCapMax: "",
  volumeMin: "",
  peMin: "",
  peMax: "",
  dividendMin: "",
  betaMin: "",
  betaMax: "",
  rsiMin: "",
  rsiMax: "",
  momentumMin: "",
  volatilityMax: "",
  performanceMin: "",
  performanceMax: "",
  aboveSma50: false,
  aboveSma200: false,
};

const hashString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const stocks = (stocksData as { stocks: Array<{ symbol: string; name: string; exchange: string; sector: string; industry: string; price: number; change: number; changePercent: number; volume: number; avgVolume: number; marketCap: number; pe: number; eps: number; beta: number; dividendYield: number; sharesOutstanding: number; revenue: number; netIncome: number; quarterlyRevenueGrowth: number; nextEarningsDate: string; relatedCompanies: string[]; tags: string[] }> }).stocks;
const cryptos = (cryptocurrenciesData as { cryptocurrencies: Array<{ id: string; symbol: string; name: string; category: string; circulatingSupply: number; consensusMechanism: string; founder: string; launched: number }> }).cryptocurrencies;
const currencies = (currenciesData as { currencies: Array<{ code: string; name: string; country: string; countryCode: string; region: string; centralBank: string; type: string; interestRate?: number; inflation?: number; gdpGrowth?: number; strengthIndex?: number; logo: string }> }).currencies;
const sectors = (sectorsData as { sectors: Array<{ id: string; name: string; category: string }> }).sectors;

const CRYPTO_BASE_PRICES: Record<string, number> = {
  BTC: 65000, ETH: 3200, BNB: 590, SOL: 145, ADA: 0.48, AVAX: 35, DOT: 6.8, TRX: 0.12,
  USDT: 1, USDC: 1, DAI: 1, LINK: 14, MATIC: 0.72, UNI: 8.5, ATOM: 8.1, XRP: 0.54,
  LTC: 82, XLM: 0.11, TON: 6.2, ARB: 1.1,
};

const ETF_UNIVERSE: ScreenResult[] = [
  { symbol: "SPY", name: "SPDR S&P 500 ETF", type: "etf", price: 542.18, change: 4.42, changePercent: 0.82, volume: 78500000, marketCap: 540000000000, pe: 25.4, eps: 0, dividendYield: 1.3, beta: 1.0, rsi: 62, sma50: 528, sma200: 488, momentum: 2.5, volatility: 12, sector: "Diversified", country: "USA", exchange: "NYSE" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", type: "etf", price: 480.30, change: 5.85, changePercent: 1.23, volume: 52200000, marketCap: 290000000000, pe: 32.1, eps: 0, dividendYield: 0.5, beta: 1.05, rsi: 68, sma50: 462, sma200: 415, momentum: 4.0, volatility: 16, sector: "Technology", country: "USA", exchange: "NASDAQ" },
  { symbol: "VTI", name: "Vanguard Total Stock Market", type: "etf", price: 256.42, change: 2.05, changePercent: 0.81, volume: 5800000, marketCap: 380000000000, pe: 24.5, eps: 0, dividendYield: 1.4, beta: 1.0, rsi: 60, sma50: 248, sma200: 222, momentum: 2.4, volatility: 13, sector: "Diversified", country: "USA", exchange: "NYSE" },
  { symbol: "XLK", name: "Technology Select Sector SPDR", type: "etf", price: 222.10, change: 2.95, changePercent: 1.34, volume: 8200000, marketCap: 75000000000, pe: 31.4, eps: 0, dividendYield: 0.7, beta: 1.18, rsi: 70, sma50: 212, sma200: 184, momentum: 4.8, volatility: 18, sector: "Technology", country: "USA", exchange: "NYSE" },
  { symbol: "XLF", name: "Financial Select Sector SPDR", type: "etf", price: 42.18, change: 0.45, changePercent: 1.08, volume: 38500000, marketCap: 40000000000, pe: 12.8, eps: 0, dividendYield: 1.7, beta: 1.05, rsi: 56, sma50: 41.20, sma200: 38.50, momentum: 1.5, volatility: 14, sector: "Financials", country: "USA", exchange: "NYSE" },
  { symbol: "XLE", name: "Energy Select Sector SPDR", type: "etf", price: 92.30, change: -0.85, changePercent: -0.91, volume: 22000000, marketCap: 38000000000, pe: 11.5, eps: 0, dividendYield: 3.2, beta: 1.15, rsi: 48, sma50: 95.10, sma200: 91.40, momentum: -1.2, volatility: 20, sector: "Energy", country: "USA", exchange: "NYSE" },
  { symbol: "XLV", name: "Health Care Select SPDR", type: "etf", price: 148.50, change: 0.65, changePercent: 0.44, volume: 9500000, marketCap: 41000000000, pe: 22.5, eps: 0, dividendYield: 1.5, beta: 0.65, rsi: 55, sma50: 146, sma200: 140, momentum: 1.0, volatility: 11, sector: "Healthcare", country: "USA", exchange: "NYSE" },
  { symbol: "ARKK", name: "ARK Innovation ETF", type: "etf", price: 55.20, change: 1.85, changePercent: 3.47, volume: 12000000, marketCap: 7000000000, pe: 0, eps: 0, dividendYield: 0, beta: 1.85, rsi: 58, sma50: 52, sma200: 48, momentum: 6.2, volatility: 32, sector: "Thematic", country: "USA", exchange: "NYSE" },
  { symbol: "VEA", name: "Vanguard FTSE Developed Markets", type: "etf", price: 50.40, change: 0.30, changePercent: 0.60, volume: 12500000, marketCap: 105000000000, pe: 14.5, eps: 0, dividendYield: 3.1, beta: 0.95, rsi: 55, sma50: 49.50, sma200: 47.20, momentum: 1.4, volatility: 13, sector: "International", country: "USA", exchange: "NYSE" },
  { symbol: "VWO", name: "Vanguard FTSE Emerging Markets", type: "etf", price: 45.20, change: 0.15, changePercent: 0.33, volume: 14200000, marketCap: 85000000000, pe: 13.2, eps: 0, dividendYield: 2.4, beta: 1.0, rsi: 52, sma50: 44.80, sma200: 43.10, momentum: 0.6, volatility: 15, sector: "Emerging", country: "USA", exchange: "NYSE" },
  { symbol: "GLD", name: "SPDR Gold Shares", type: "etf", price: 215.40, change: 1.20, changePercent: 0.56, volume: 6500000, marketCap: 68000000000, pe: 0, eps: 0, dividendYield: 0, beta: 0.20, rsi: 60, sma50: 210, sma200: 192, momentum: 2.0, volatility: 10, sector: "Commodities", country: "USA", exchange: "NYSE" },
  { symbol: "TLT", name: "iShares 20+ Year Treasury Bond", type: "etf", price: 95.50, change: -0.40, changePercent: -0.42, volume: 28000000, marketCap: 48000000000, pe: 0, eps: 0, dividendYield: 4.5, beta: -0.15, rsi: 40, sma50: 98, sma200: 102, momentum: -1.5, volatility: 12, sector: "Bonds", country: "USA", exchange: "NASDAQ" },
  { symbol: "BTC-ETF", name: "Bitcoin Spot ETF (avg)", type: "etf", price: 65.20, change: 1.45, changePercent: 2.27, volume: 8500000, marketCap: 12000000000, pe: 0, eps: 0, dividendYield: 0, beta: 1.65, rsi: 64, sma50: 62, sma200: 55, momentum: 5.5, volatility: 45, sector: "Crypto", country: "USA", exchange: "NYSE" },
];

const buildStockResults = (): ScreenResult[] => stocks.map((s) => {
  const seed = hashString(s.symbol);
  const rsi = 30 + (seed % 50);
  const sma50 = s.price * (0.95 + ((seed % 10) / 100));
  const sma200 = s.price * (0.85 + ((seed % 15) / 100));
  const momentum = ((seed % 200) - 100) / 10;
  const volatility = 10 + (seed % 25);
  return {
    symbol: s.symbol,
    name: s.name,
    type: "stock" as AssetType,
    price: s.price,
    change: s.change,
    changePercent: s.changePercent,
    volume: s.volume,
    marketCap: s.marketCap,
    pe: s.pe,
    eps: s.eps,
    dividendYield: s.dividendYield,
    beta: s.beta,
    rsi,
    sma50,
    sma200,
    momentum,
    volatility,
    sector: s.sector,
    country: "USA",
    exchange: s.exchange,
  };
});

const buildCryptoResults = (): ScreenResult[] => cryptos.map((c) => {
  const basePrice = CRYPTO_BASE_PRICES[c.symbol] ?? 10;
  const marketCap = basePrice * c.circulatingSupply;
  const seed = hashString(c.symbol);
  const changePct = ((seed % 200) - 100) / 10;
  return {
    symbol: c.symbol,
    name: c.name,
    type: "crypto" as AssetType,
    price: basePrice,
    change: basePrice * (changePct / 100),
    changePercent: changePct,
    volume: marketCap * 0.04,
    marketCap,
    pe: 0,
    eps: 0,
    dividendYield: 0,
    beta: 1.4 + (seed % 100) / 100,
    rsi: 40 + (seed % 30),
    sma50: basePrice * 0.95,
    sma200: basePrice * 0.80,
    momentum: ((seed % 200) - 100) / 10,
    volatility: 40 + (seed % 50),
    sector: c.category,
    country: c.symbol === "BTC" || c.symbol === "ETH" ? "Global" : c.symbol === "ADA" || c.symbol === "TRX" ? "International" : "Global",
    exchange: c.symbol === "BTC" || c.symbol === "ETH" || c.symbol === "SOL" ? "Multiple" : "Crypto",
  };
});

const buildForexResults = (): ScreenResult[] => currencies.filter((c) => c.type === "fiat").map((c) => {
  const seed = hashString(c.code);
  const rate = c.code === "USD" ? 1 : c.code === "JPY" ? 155 : c.code === "INR" ? 83.5 : c.code === "EUR" ? 0.92 : c.code === "GBP" ? 0.79 : 1.5;
  const changePct = ((seed % 200) - 100) / 100;
  return {
    symbol: c.code,
    name: c.name,
    type: "forex" as AssetType,
    price: rate,
    change: rate * (changePct / 100),
    changePercent: changePct,
    volume: 5000000000 + (seed % 10000000000),
    marketCap: 0,
    pe: 0,
    eps: 0,
    dividendYield: c.interestRate ?? 0,
    beta: 0.5 + (seed % 100) / 100,
    rsi: 45 + (seed % 25),
    sma50: rate * 0.98,
    sma200: rate * 0.95,
    momentum: ((seed % 200) - 100) / 20,
    volatility: 3 + (seed % 8),
    sector: c.region,
    country: c.country,
    exchange: "FX",
  };
});

const SCREENER_UNIVERSE: ScreenResult[] = [
  ...buildStockResults(),
  ...buildCryptoResults(),
  ...buildForexResults(),
  ...ETF_UNIVERSE,
];

interface ScreenPreset {
  id: string;
  name: string;
  description: string;
  filters: Partial<Filters>;
  isDefault?: boolean;
  createdAt: number;
}

interface ScreenState {
  presets: ScreenPreset[];
  savePreset: (name: string, description: string, filters: Partial<Filters>) => void;
  deletePreset: (id: string) => void;
}

const useScreenStore = create<ScreenState>()(
  persist(
    (set) => ({
      presets: [
        { id: "default-mega", name: "Mega Cap Tech", description: "Top technology leaders", filters: { assetType: "stock", sector: "Technology", marketCapMin: "500000000000" }, isDefault: true, createdAt: Date.now() },
        { id: "default-div", name: "Dividend Aristocrats", description: "High-quality dividend payers", filters: { assetType: "stock", dividendMin: "2.0" }, isDefault: true, createdAt: Date.now() },
        { id: "default-btc", name: "Crypto Leaders", description: "Top 20 cryptocurrencies by market cap", filters: { assetType: "crypto" }, isDefault: true, createdAt: Date.now() },
        { id: "default-value", name: "Value Stocks", description: "Low PE, high dividend", filters: { assetType: "stock", peMax: "20", dividendMin: "1.5" }, isDefault: true, createdAt: Date.now() },
        { id: "default-oversold", name: "Oversold Bounce", description: "RSI below 35, potential reversal", filters: { rsiMax: "35" }, isDefault: true, createdAt: Date.now() },
      ],
      savePreset: (name, description, filters) =>
        set((state) => ({
          presets: [
            ...state.presets.filter((p) => !p.isDefault),
            { id: `screen-${Date.now()}`, name, description, filters, createdAt: Date.now() },
          ],
        })),
      deletePreset: (id) =>
        set((state) => ({ presets: state.presets.filter((p) => p.id !== id) })),
    }),
    { name: "markets-pivot-screens", storage: createJSONStorage(() => localStorage) }
  )
);

const AdvancedScreenerPage: React.FC = () => {
  const { t } = useI18n();
  const { presets, savePreset, deletePreset } = useScreenStore();
  const { log } = useActivityStore();
  const [filters, setFilters] = React.useState<Filters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = React.useState<keyof ScreenResult>("marketCap");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [presetName, setPresetName] = React.useState("");
  const [presetDesc, setPresetDesc] = React.useState("");

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const applyPreset = (preset: ScreenPreset) => {
    setFilters((f) => ({ ...f, ...preset.filters }));
    log("screener_run", `Applied preset: ${preset.name}`);
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const runScreen = () => {
    log("screener_run", `Ran screen with ${filtered.length} matches`);
  };

  const filtered = React.useMemo(() => {
    return SCREENER_UNIVERSE.filter((r) => {
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (!`${r.symbol} ${r.name}`.toLowerCase().includes(q)) return false;
      }
      if (filters.assetType !== "all" && r.type !== filters.assetType) return false;
      if (filters.exchange !== "all" && r.exchange !== filters.exchange) return false;
      if (filters.sector !== "all" && r.sector !== filters.sector) return false;
      if (filters.country !== "all" && r.country !== filters.country) return false;
      if (filters.priceMin && r.price < Number(filters.priceMin)) return false;
      if (filters.priceMax && r.price > Number(filters.priceMax)) return false;
      if (filters.marketCapMin && r.marketCap < Number(filters.marketCapMin)) return false;
      if (filters.marketCapMax && r.marketCap > Number(filters.marketCapMax)) return false;
      if (filters.volumeMin && r.volume < Number(filters.volumeMin)) return false;
      if (filters.peMin && r.pe < Number(filters.peMin)) return false;
      if (filters.peMax && r.pe > Number(filters.peMax)) return false;
      if (filters.dividendMin && r.dividendYield < Number(filters.dividendMin)) return false;
      if (filters.betaMin && r.beta < Number(filters.betaMin)) return false;
      if (filters.betaMax && r.beta > Number(filters.betaMax)) return false;
      if (filters.rsiMin && r.rsi < Number(filters.rsiMin)) return false;
      if (filters.rsiMax && r.rsi > Number(filters.rsiMax)) return false;
      if (filters.momentumMin && r.momentum < Number(filters.momentumMin)) return false;
      if (filters.volatilityMax && r.volatility > Number(filters.volatilityMax)) return false;
      if (filters.performanceMin && r.changePercent < Number(filters.performanceMin)) return false;
      if (filters.performanceMax && r.changePercent > Number(filters.performanceMax)) return false;
      if (filters.aboveSma50 && r.price < r.sma50) return false;
      if (filters.aboveSma200 && r.price < r.sma200) return false;
      return true;
    }).sort((a, b) => {
      const aVal = a[sortBy] as number | string;
      const bVal = b[sortBy] as number | string;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [filters, sortBy, sortDir]);

  const handleSave = () => {
    if (!presetName.trim()) return;
    savePreset(presetName.trim(), presetDesc.trim(), filters);
    log("screen_save", `Saved screen: ${presetName.trim()}`);
    setPresetName("");
    setPresetDesc("");
    setShowSaveModal(false);
  };

  const handleExport = () => {
    const headers = ["Symbol", "Name", "Type", "Price", "Change %", "Volume", "Market Cap", "PE", "Div Yield", "Beta", "RSI", "SMA50", "SMA200", "Momentum", "Volatility", "Sector", "Country", "Exchange"];
    const rows = filtered.map((r) => [
      r.symbol, r.name, r.type, r.price.toFixed(2), r.changePercent.toFixed(2), formatVolume(r.volume),
      formatMoney(r.marketCap), r.pe.toFixed(1), r.dividendYield.toFixed(2), r.beta.toFixed(2),
      r.rsi.toString(), r.sma50.toFixed(2), r.sma200.toFixed(2), r.momentum.toFixed(2),
      r.volatility.toFixed(1), r.sector, r.country, r.exchange
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c) => String(c).includes(",") ? `"${c}"` : c).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `screener-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uniqueExchanges = Array.from(new Set(SCREENER_UNIVERSE.map((r) => r.exchange)));
  const uniqueSectors = Array.from(new Set(SCREENER_UNIVERSE.map((r) => r.sector)));
  const uniqueCountries = Array.from(new Set(SCREENER_UNIVERSE.map((r) => r.country)));

  return (
    <div className="page screener-page-new">
      <section className="coverage-hero screener-hero">
        <div>
          <p className="eyebrow">{t("src_client_pages_advancedscreenerpage__l361__h0")}</p>
          <h1>{t("src_client_pages_advancedscreenerpage__l362__h1")}</h1>
          <p>{t("src_client_pages_advancedscreenerpage__l367_h0")}</p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile"><span>{t("src_client_pages_advancedscreenerpage__l366__h3")}</span><strong>{SCREENER_UNIVERSE.length}</strong></div>
          <div className="metric-tile"><span>{t("src_client_pages_advancedscreenerpage__l367__h4")}</span><strong className="positive">{filtered.length}</strong></div>
          <div className="metric-tile"><span>{t("src_client_pages_advancedscreenerpage__l368__h5")}</span><strong>{Object.values(filters).filter((v) => v !== "" && v !== "all" && v !== false).length}</strong></div>
        </div>
      </section>

      <div className="screener-layout">
        <aside className="screener-filters">
          <div className="filter-header">
            <h3>{t("src_client_pages_advancedscreenerpage__l375__h6")}</h3>
            <button onClick={resetFilters} type="button" className="reset-btn">{t("src_client_pages_advancedscreenerpage__l376__h7")}</button>
          </div>

          <div className="filter-section">
            <h4>{t("src_client_pages_advancedscreenerpage__l380__h8")}</h4>
            <select value={filters.assetType} onChange={(e) => updateFilter("assetType", e.target.value as Filters["assetType"])}>
              <option value="all">{t("src_client_pages_advancedscreenerpage__l382__h9")}</option>
              <option value="stock">{t("src_client_pages_advancedscreenerpage__l383__h10")}</option>
              <option value="forex">{t("src_client_pages_advancedscreenerpage__l384__h11")}</option>
              <option value="crypto">{t("src_client_pages_advancedscreenerpage__l385__h12")}</option>
              <option value="etf">{t("src_client_pages_advancedscreenerpage__l386__h13")}</option>
            </select>
          </div>

          <div className="filter-section">
            <h4>{t("src_client_pages_advancedscreenerpage__l391__h14")}</h4>
            <input value={filters.query} onChange={(e) => updateFilter("query", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l392__h15")} />
          </div>

          <div className="filter-section">
            <h4>{t("src_client_pages_advancedscreenerpage__l396__h16")}</h4>
            <select value={filters.exchange} onChange={(e) => updateFilter("exchange", e.target.value)}>
              <option value="all">{t("src_client_pages_advancedscreenerpage__l398__h17")}</option>
              {uniqueExchanges.map((ex) => <option key={ex} value={ex}>{ex}</option>)}
            </select>
          </div>

          <div className="filter-section">
            <h4>{t("src_client_pages_advancedscreenerpage__l404__h18")}</h4>
            <select value={filters.sector} onChange={(e) => updateFilter("sector", e.target.value)}>
              <option value="all">{t("src_client_pages_advancedscreenerpage__l406__h19")}</option>
              {uniqueSectors.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="filter-section">
            <h4>{t("src_client_pages_advancedscreenerpage__l412__h20")}</h4>
            <select value={filters.country} onChange={(e) => updateFilter("country", e.target.value)}>
              <option value="all">{t("src_client_pages_advancedscreenerpage__l414__h21")}</option>
              {uniqueCountries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="filter-section">
            <h4>{t("src_client_pages_advancedscreenerpage__l420__h22")}</h4>
            <div className="dual-input">
              <input type="number" value={filters.priceMin} onChange={(e) => updateFilter("priceMin", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l422__h23")} />
              <input type="number" value={filters.priceMax} onChange={(e) => updateFilter("priceMax", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l423__h24")} />
            </div>
          </div>

          <div className="filter-section">
            <h4>{t("src_client_pages_advancedscreenerpage__l428__h25")}</h4>
            <div className="dual-input">
              <input type="number" value={filters.marketCapMin} onChange={(e) => updateFilter("marketCapMin", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l434_h0")} />
              <input type="number" value={filters.marketCapMax} onChange={(e) => updateFilter("marketCapMax", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l435_h1")} />
            </div>
          </div>

          <div className="filter-section">
            <h4>Volume (min)</h4>
            <input type="number" value={filters.volumeMin} onChange={(e) => updateFilter("volumeMin", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l437__h26")} />
          </div>

          <div className="filter-section">
            <h4>{t("src_client_pages_advancedscreenerpage__l441__h27")}</h4>
            <div className="dual-input">
              <input type="number" value={filters.peMin} onChange={(e) => updateFilter("peMin", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l443__h28")} />
              <input type="number" value={filters.peMax} onChange={(e) => updateFilter("peMax", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l444__h29")} />
            </div>
          </div>

          <div className="filter-section">
            <h4>Dividend Yield (min %)</h4>
            <input type="number" step="0.1" value={filters.dividendMin} onChange={(e) => updateFilter("dividendMin", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l450__h30")} />
          </div>

          <div className="filter-section">
            <h4>{t("src_client_pages_advancedscreenerpage__l454__h31")}</h4>
            <div className="dual-input">
              <input type="number" step="0.1" value={filters.betaMin} onChange={(e) => updateFilter("betaMin", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l456__h32")} />
              <input type="number" step="0.1" value={filters.betaMax} onChange={(e) => updateFilter("betaMax", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l457__h33")} />
            </div>
          </div>

          <div className="filter-section">
            <h4>{t("src_client_pages_advancedscreenerpage__l462__h34")}</h4>
            <div className="dual-input">
              <input type="number" value={filters.rsiMin} onChange={(e) => updateFilter("rsiMin", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l464__h35")} />
              <input type="number" value={filters.rsiMax} onChange={(e) => updateFilter("rsiMax", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l465__h36")} />
            </div>
          </div>

          <div className="filter-section">
            <h4>Momentum (min)</h4>
            <input type="number" step="0.1" value={filters.momentumMin} onChange={(e) => updateFilter("momentumMin", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l471__h37")} />
          </div>

          <div className="filter-section">
            <h4>Volatility (max)</h4>
            <input type="number" step="0.1" value={filters.volatilityMax} onChange={(e) => updateFilter("volatilityMax", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l476__h38")} />
          </div>

          <div className="filter-section">
            <h4>{t("src_client_pages_advancedscreenerpage__l480__h39")}</h4>
            <div className="dual-input">
              <input type="number" step="0.1" value={filters.performanceMin} onChange={(e) => updateFilter("performanceMin", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l482__h40")} />
              <input type="number" step="0.1" value={filters.performanceMax} onChange={(e) => updateFilter("performanceMax", e.target.value)} placeholder={t("src_client_pages_advancedscreenerpage__l483__h41")} />
            </div>
          </div>

          <div className="filter-section">
            <h4>{t("src_client_pages_advancedscreenerpage__l488__h42")}</h4>
            <label className="checkbox-row">
              <input type="checkbox" checked={filters.aboveSma50} onChange={(e) => updateFilter("aboveSma50", e.target.checked)} />
              <span>{t("src_client_pages_advancedscreenerpage__l491__h43")}</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={filters.aboveSma200} onChange={(e) => updateFilter("aboveSma200", e.target.checked)} />
              <span>{t("src_client_pages_advancedscreenerpage__l495__h44")}</span>
            </label>
          </div>

          <button type="button" onClick={runScreen} className="run-btn">{t("src_client_pages_advancedscreenerpage__l499__h45")}</button>
        </aside>

        <main className="screener-main">
          <div className="screener-toolbar">
            <div className="toolbar-summary">
              <strong>{filtered.length}</strong> of <strong>{SCREENER_UNIVERSE.length}</strong> symbols match
            </div>
            <div className="toolbar-actions">
              <button type="button" onClick={() => setShowSaveModal(true)} className="secondary-action-sm">{t("src_client_pages_advancedscreenerpage__l508__h47")}</button>
              <button type="button" onClick={handleExport} className="secondary-action-sm">{t("src_client_pages_advancedscreenerpage__l509__h48")}</button>
            </div>
          </div>

          <div className="screener-presets">
            <h4>{t("src_client_pages_advancedscreenerpage__l514__h49")}</h4>
            <div className="presets-grid">
              {presets.map((preset) => (
                <div key={preset.id} className="preset-card">
                  <div className="preset-info">
                    <strong>{preset.name}</strong>
                    <span>{preset.description}</span>
                  </div>
                  <div className="preset-actions">
                    <button type="button" onClick={() => applyPreset(preset)} className="preset-btn">{t("src_client_pages_advancedscreenerpage__l523__h50")}</button>
                    {!preset.isDefault && (
                      <button type="button" onClick={() => deletePreset(preset.id)} className="preset-btn-delete">✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showSaveModal && (
            <div className="save-modal">
              <div className="modal-content">
                <h3>{t("src_client_pages_advancedscreenerpage__l536__h51")}</h3>
                <input type="text" placeholder={t("src_client_pages_advancedscreenerpage__l537__h52")} value={presetName} onChange={(e) => setPresetName(e.target.value)} autoFocus />
                <input type="text" placeholder={t("src_client_pages_advancedscreenerpage__l542_h2")} value={presetDesc} onChange={(e) => setPresetDesc(e.target.value)} />
                <div className="modal-actions">
                  <button onClick={handleSave} type="button" className="primary-action-sm">{t("src_client_pages_advancedscreenerpage__l540__h53")}</button>
                  <button onClick={() => { setShowSaveModal(false); setPresetName(""); setPresetDesc(""); }} type="button" className="secondary-action-sm">{t("src_client_pages_advancedscreenerpage__l541__h54")}</button>
                </div>
              </div>
            </div>
          )}

          <div className="screener-table-wrap">
            <table className="screener-table">
              <thead>
                <tr>
                  <th onClick={() => { setSortBy("symbol"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>{t("src_client_pages_advancedscreenerpage__l551__h55")}</th>
                  <th>{t("src_client_pages_advancedscreenerpage__l552__h56")}</th>
                  <th>{t("src_client_pages_advancedscreenerpage__l553__h57")}</th>
                  <th className="text-right" onClick={() => { setSortBy("price"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>{t("src_client_pages_advancedscreenerpage__l554__h58")}</th>
                  <th className="text-right" onClick={() => { setSortBy("changePercent"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>{t("src_client_pages_advancedscreenerpage__l555__h59")}</th>
                  <th className="text-right" onClick={() => { setSortBy("volume"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>{t("src_client_pages_advancedscreenerpage__l556__h60")}</th>
                  <th className="text-right" onClick={() => { setSortBy("marketCap"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>{t("src_client_pages_advancedscreenerpage__l557__h61")}</th>
                  <th className="text-right" onClick={() => { setSortBy("pe"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>{t("src_client_pages_advancedscreenerpage__l558__h62")}</th>
                  <th className="text-right" onClick={() => { setSortBy("dividendYield"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>{t("src_client_pages_advancedscreenerpage__l559__h63")}</th>
                  <th className="text-right" onClick={() => { setSortBy("beta"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>{t("src_client_pages_advancedscreenerpage__l560__h64")}</th>
                  <th className="text-right" onClick={() => { setSortBy("rsi"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>{t("src_client_pages_advancedscreenerpage__l561__h65")}</th>
                  <th className="text-right" onClick={() => { setSortBy("momentum"); setSortDir(sortDir === "asc" ? "desc" : "asc"); }}>{t("src_client_pages_advancedscreenerpage__l562__h66")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={12} className="empty-state">{t("src_client_pages_advancedscreenerpage__l567__h67")}</td></tr>
                ) : filtered.slice(0, 100).map((r) => (
                  <tr key={`${r.type}-${r.symbol}`}>
                    <td>
                      <Link to={
                        r.type === "stock" ? `/stocks/${r.symbol}` :
                        r.type === "crypto" ? `/crypto/${r.symbol.toLowerCase()}` :
                        r.type === "forex" ? `/currencies/${r.symbol}` :
                        `/screener`
                      }>
                        <strong>{r.symbol}</strong>
                      </Link>
                      <span className="screener-name">{r.name}</span>
                    </td>
                    <td><span className={`type-pill type-${r.type}`}>{r.type}</span></td>
                    <td><span className="screener-sector">{r.sector}</span></td>
                    <td className="text-right"><strong>${r.price.toFixed(2)}</strong></td>
                    <td className={`text-right ${r.changePercent >= 0 ? "positive" : "negative"}`}>
                      <strong>{formatSignedPercent(r.changePercent)}</strong>
                    </td>
                    <td className="text-right">{formatVolume(r.volume)}</td>
                    <td className="text-right">{r.marketCap > 0 ? formatMoney(r.marketCap) : "—"}</td>
                    <td className="text-right">{r.pe > 0 ? r.pe.toFixed(1) : "—"}</td>
                    <td className="text-right">{r.dividendYield > 0 ? `${r.dividendYield.toFixed(2)}%` : "—"}</td>
                    <td className="text-right">{r.beta.toFixed(2)}</td>
                    <td className="text-right">
                      <span className={`rsi-badge ${r.rsi < 30 ? "oversold" : r.rsi > 70 ? "overbought" : ""}`}>
                        {r.rsi.toFixed(0)}
                      </span>
                    </td>
                    <td className={`text-right ${r.momentum >= 0 ? "positive" : "negative"}`}>
                      {r.momentum >= 0 ? "+" : ""}{r.momentum.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 100 && (
              <p className="more-results">Showing first 100 of {filtered.length} matches. Refine filters to see more specific results.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdvancedScreenerPage;
