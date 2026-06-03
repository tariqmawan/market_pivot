import React from "react";
import { BrowserRouter as Router, Link, Route, Routes, useLocation, useParams, Navigate } from "react-router-dom";
import commoditiesData from "../data/commodities.json";
import exchangesData from "../data/exchanges.json";
import currenciesData from "../data/currencies.json";
import cryptoData from "../data/cryptocurrencies.json";
import regionsData from "../data/regions.json";
import sectorsData from "../data/sectors.json";
import { SubscriptionProvider } from "./subscription";
import { GatedAdvancedScreener } from "./components/GatedAdvancedScreener";
import { InstallPrompt, OfflineIndicator } from "./pwa";
const IndicesPage     = React.lazy(() => import("./pages/IndicesPage"));
const EtfsPage        = React.lazy(() => import("./pages/EtfsPage"));
const BondsYieldsPage = React.lazy(() => import("./pages/BondsYieldsPage"));
const Pricing         = React.lazy(() => import("./pages/Pricing"));
import type {
  Commodity,
  CryptoPrice,
  Cryptocurrency,
  Currency,
  CurrencyPair,
  IndexSnapshot,
  MarketRegion,
  MarketMover,
  StockSector,
  StockExchange,
  TradingPair,
} from "../types";
import CryptoDetail from "./components/CryptoDetail";
import ErrorBoundary from "./components/ErrorBoundary";
import { useCryptoDetail } from "./hooks/useCryptoDetail";
import { fetchJson } from "./lib/apiClient";
import { normalizeCryptoPrice } from "./lib/normalize";
import CurrencyDetail from "./components/CurrencyDetail";
import ExchangeDetail from "./components/ExchangeDetail";
import { Layout } from "./components/Layout";
import PageLoader from "./components/PageLoader";
import ScrollToTop from "./components/ScrollToTop";
import { SkeletonStyles } from "./components/Skeleton";
import { useI18n } from "./i18n";
import { useAuthStore } from "./stores/authStore";
import SubMenuNav from "./components/SubMenuNav";
import "./styles/index.css";
import "./styles/rtl.css";
import "./styles/polish.css";
import "./styles/productization.css";
const AdminLogin        = React.lazy(() => import("./pages/AdminLogin"));
const AdminApp          = React.lazy(() => import("./admin/AdminApp"));
const NewsPage          = React.lazy(() => import("./pages/News"));
const ArticlePage       = React.lazy(() => import("./pages/Article"));
const PrivacyPolicy     = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService    = React.lazy(() => import("./pages/TermsOfService"));
const AboutMarketsPivot = React.lazy(() => import("./pages/AboutMarketsPivot"));
const BillingPolicy     = React.lazy(() => import("./pages/BillingPolicy"));
const Screener          = React.lazy(() => import("./pages/Screener"));
const EconomicCalendar  = React.lazy(() => import("./pages/EconomicCalendar"));
const HeatmapsPage      = React.lazy(() => import("./pages/HeatmapsPage"));
const PreMarketPage     = React.lazy(() => import("./pages/PreMarketPage"));
const AfterHoursPage    = React.lazy(() => import("./pages/AfterHoursPage"));
const MoversPage        = React.lazy(() => import("./pages/MoversPage"));
const VolatilityIndexPage = React.lazy(() => import("./pages/VolatilityIndexPage"));
const TrendingCoinsPage = React.lazy(() => import("./pages/TrendingCoinsPage"));
const CryptoCategoryPage = React.lazy(() => import("./pages/CryptoCategoryPage"));
const CategoryPage      = React.lazy(() => import("./pages/CategoryPage"));
const StockDetailPage   = React.lazy(() => import("./pages/StockDetailPage"));
const ForexPage         = React.lazy(() => import("./pages/ForexPage"));
const RegionsPageNew    = React.lazy(() => import("./pages/RegionsPageNew"));
const SectorsPageNew    = React.lazy(() => import("./pages/SectorsPageNew"));
const WatchlistPage     = React.lazy(() => import("./pages/WatchlistPage"));
const PortfolioPage     = React.lazy(() => import("./pages/PortfolioPage"));
const UserProfilePage   = React.lazy(() => import("./pages/UserProfilePage"));
const BillingPage       = React.lazy(() => import("./pages/BillingPage"));
const OfflinePage       = React.lazy(() => import("./pages/OfflinePage"));
const NotificationsPage = React.lazy(() => import("./notifications/NotificationsPage"));


const exchanges = exchangesData.exchanges as StockExchange[];
const currencies = currenciesData.currencies as Currency[];
const cryptocurrencies = cryptoData.cryptocurrencies as Cryptocurrency[];
const marketRegions = regionsData.regions as unknown as MarketRegion[];
const stockSectors = sectorsData.sectors as StockSector[];
const commodities = commoditiesData.commodities as Commodity[];


const formatMoney = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  return `$${value.toLocaleString()}`;
};

const formatSignedPercent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const buildIndexSnapshot = (exchange: StockExchange): IndexSnapshot => ({
  id: `${exchange.id}-snapshot`,
  exchangeId: exchange.id,
  symbol: exchange.mainIndex,
  name: exchange.mainIndexName,
  value: Math.max(900, exchange.marketCap / 1e10),
  previousClose: Math.max(900, exchange.marketCap / 1e10) * 0.992,
  change: Math.max(900, exchange.marketCap / 1e10) * 0.008,
  percentChange: 0.8,
  timestamp: new Date(),
  volume: exchange.avgDailyVolume,
  advancers: Math.round(exchange.listedCompanies * 0.54),
  decliners: Math.round(exchange.listedCompanies * 0.38),
});

const buildMovers = (exchange: StockExchange, direction: "up" | "down" | "active"): MarketMover[] =>
  ["ALPHA", "CORE", "NOVA", "PRIME", "VECTOR"].map((prefix, index) => {
    const sign = direction === "down" ? -1 : 1;
    const percentChange = direction === "active" ? (index % 2 === 0 ? 1.4 : -0.7) : sign * (2.4 + index);

    return {
      symbol: `${prefix}.${exchange.id}`,
      company: `${exchange.country} ${prefix} Holdings`,
      price: 24 + index * 18 + exchange.id.length,
      change: percentChange / 10,
      percentChange,
      volume: exchange.avgDailyVolume / (index + 8),
      marketCap: exchange.marketCap / (index + 20),
    };
  });

const findExchangeById = (id: string | undefined) =>
  exchanges.find(
    (exchange) =>
      exchange.id.toLowerCase() === id?.toLowerCase() ||
      exchange.mainIndex?.toLowerCase() === id?.toLowerCase()
  );

const resolveExchangeLookupId = (id: string | undefined) => {
  const match = findExchangeById(id);
  return match?.id ?? id;
};

const majorRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  JPY: 155,
  GBP: 0.79,
  CHF: 0.91,
  CNY: 7.24,
  HKD: 7.82,
  INR: 83.5,
  AUD: 1.52,
  SGD: 1.35,
  KRW: 1370,
  CAD: 1.37,
  BRL: 5.12,
  MXN: 16.8,
  CLP: 930,
  SEK: 10.7,
  NOK: 10.9,
  SAR: 3.75,
  AED: 3.67,
  ZAR: 18.4,
};

const getCurrencyRates = (code: string) =>
  Object.fromEntries(Object.entries(majorRates).map(([target, rate]) => [target, rate / majorRates[code]]));

const getPopularPairs = (code: string): CurrencyPair[] =>
  ["USD", "EUR", "JPY", "GBP", "AUD", "INR"]
    .filter((target) => target !== code)
    .slice(0, 5)
    .map((target, index) => ({
      pair: `${code}/${target}`,
      rate: getCurrencyRates(code)[target],
      change24h: index % 2 === 0 ? 0.18 + index / 10 : -0.12 - index / 10,
      high52w: getCurrencyRates(code)[target] * 1.08,
      low52w: getCurrencyRates(code)[target] * 0.91,
      volatility: 4 + index,
    }));

const getCryptoPrice = (crypto: Cryptocurrency, index: number): CryptoPrice => {
  const basePrices: Record<string, number> = {
    BTC: 65000,
    ETH: 3200,
    BNB: 590,
    SOL: 145,
    ADA: 0.48,
    AVAX: 35,
    DOT: 6.8,
    TRX: 0.12,
    USDT: 1,
    USDC: 1,
    DAI: 1,
    LINK: 14,
    MATIC: 0.72,
    UNI: 8.5,
    ATOM: 8.1,
    XRP: 0.54,
    LTC: 82,
    XLM: 0.11,
    TON: 6.2,
    ARB: 1.1,
  };
  const price = basePrices[crypto.symbol] ?? 10;

  return {
    id: crypto.id,
    symbol: crypto.symbol,
    name: crypto.name,
    price,
    marketCap: price * crypto.circulatingSupply,
    volume24h: price * crypto.circulatingSupply * (0.025 + index / 2000),
    change24h: price * (index % 2 === 0 ? 0.022 : -0.015),
    changePercent24h: index % 2 === 0 ? 2.2 + index / 10 : -1.5 - index / 12,
    ath: price * 1.65,
    atl: price * 0.08,
    circulatingSupply: crypto.circulatingSupply,
    rank: index + 1,
    timestamp: new Date(),
  };
};

const getTradingPairs = (crypto: Cryptocurrency): TradingPair[] =>
  ["USD", "USDT", "BTC", "EUR", "INR"].map((quote, index) => ({
    pair: `${crypto.symbol}/${quote}`,
    baseAsset: crypto.symbol,
    quoteAsset: quote,
    price: quote === "BTC" ? 0.05 + index / 100 : (getCryptoPrice(crypto, index).price || 1) * (1 + index / 100),
    volume24h: 400000000 - index * 52000000,
    exchange: ["Binance", "Coinbase", "Kraken", "OKX", "Bybit"][index],
  }));

const AssetCard: React.FC<{
  to: string;
  eyebrow: string;
  title: string;
  meta: string;
  metric: string;
}> = ({ to, eyebrow, title, meta, metric }) => (
  <Link to={to} className="asset-card">
    <span className="eyebrow">{eyebrow}</span>
    <h3>{title}</h3>
    <p>{meta}</p>
    <strong>{metric}</strong>
  </Link>
);

const MetricTile: React.FC<{ label: string; value: string; tone?: "positive" | "negative" | "neutral" }> = ({
  label,
  value,
  tone = "neutral",
}) => (
  <div className="metric-tile">
    <span>{label}</span>
    <strong className={tone === "neutral" ? "" : tone}>{value}</strong>
  </div>
);

const ChipList: React.FC<{ items: string[]; toPrefix?: string }> = ({ items, toPrefix }) => (
  <div className="chip-list">
    {items.map((item) =>
      toPrefix ? (
        <Link key={item} to={`${toPrefix}${item.toLowerCase()}`}>
          {item}
        </Link>
      ) : (
        <span key={item}>{item}</span>
      )
    )}
  </div>
);

const marketTape = [
  { label: "S&P 500", value: "5,420.18", move: "+0.82%" },
  { label: "US 10Y", value: "4.31%", move: "-3bp" },
  { label: "EUR/USD", value: "1.0872", move: "+0.14%" },
  { label: "Brent", value: "$82.40", move: "-0.42%" },
  { label: "BTC", value: "$65,000", move: "+2.20%" },
  { label: "VIX", value: "13.8", move: "-1.1" },
];

const assetCoverage = [
  { key: "equities", count: exchanges.length, metaKey: "exchangeDashboards", to: "/stocks" },
  { key: "regions", count: marketRegions.length, metaKey: "regionsMeta", to: "/regions" },
  { key: "fx", count: currencies.length, metaKey: "fxMeta", to: "/currencies" },
  { key: "sectors", count: stockSectors.length, metaKey: "sectorsMeta", to: "/sectors" },
  { key: "commodities", count: commodities.length, metaKey: "commoditiesMeta", to: "/commodities" },
  { key: "crypto", count: cryptocurrencies.length, metaKey: "cryptoMeta", to: "/crypto" },
] as const;

const HomePage = () => {
  const { t } = useI18n();

  return (
    <div className="page market-home bloomberg-shell">
      <section className="market-tape" aria-label={t("liveTape")}>
        {marketTape.map((item) => (
          <div key={item.label} className="tape-item">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <em className={item.move.startsWith("-") ? "negative" : "positive"}>{item.move}</em>
          </div>
        ))}
      </section>

      <section className="terminal-hero">
        <div className="hero-copy">
          <p className="eyebrow">{t("globalMarkets")}</p>
          <h1>{t("homeTitle")}</h1>
          <p>{t("homeCopy")}</p>
          <div className="hero-actions">
            <Link to="/dashboard" className="primary-action">{t("terminalView")}</Link>
            <Link to="/stocks" className="secondary-action">{t("assetCoverage")}</Link>
          </div>
        </div>
        <div className="terminal-panel">
          <div className="panel-header">
            <span>{t("marketBrief")}</span>
            <strong>LIVE</strong>
          </div>
          <div className="brief-grid">
            <div>
              <span>{t("openingBell")}</span>
              <strong>Asia closed mixed; Europe bid</strong>
            </div>
            <div>
              <span>{t("riskView")}</span>
              <strong>Crypto beta outperforming equities</strong>
            </div>
            <div>
              <span>{t("globalHeatmap")}</span>
              <strong>FX pressure: JPY, INR, ZAR watch</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="intelligence-band">
        <div>
          <p className="eyebrow">{t("assetCoverage")}</p>
          <h2>{t("intelligenceTitle")}</h2>
        </div>
        <p>{t("intelligenceCopy")}</p>
      </section>

      <section className="asset-class-grid">
        {assetCoverage.map((asset) => (
          <Link to={asset.to} className="asset-class-card" key={asset.key}>
            <span>{t(asset.key)}</span>
            <strong>{asset.count}</strong>
            <p>{t(asset.metaKey)}</p>
          </Link>
        ))}
      </section>

      <section className="dashboard-grid spotlight-grid">
        <AssetCard to="/stocks" eyebrow={t("equities")} title={`${exchanges.length} ${t("stockCount")}`} meta={t("exchangeDashboards")} metric={formatMoney(exchanges.reduce((sum, item) => sum + item.marketCap, 0))} />
        <AssetCard to="/currencies" eyebrow={t("fx")} title={`${currencies.length} ${t("currencyCount")}`} meta={t("fxMeta")} metric={t("usdBase")} />
        <AssetCard to="/crypto" eyebrow={t("crypto")} title={`${cryptocurrencies.length} ${t("crypto")}`} meta={t("cryptoMeta")} metric={t("cryptoLayer")} />
      </section>

      <section className="comparison-strip">
        <h2>{t("compareMarkets")}</h2>
        <p>{t("compareMarketsCopy")}</p>
        <div className="comparison-route">
          <span>NASDAQ</span>
          <span>BTC</span>
          <span>USD/INR</span>
          <span>US 10Y</span>
          <span>Brent</span>
        </div>
      </section>

      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">Regional Intelligence</p>
          <h2>Markets by geography</h2>
          <div className="mini-list">
            {marketRegions.map((region) => (
              <Link to={`/regions/${region.id}`} key={region.id}>
                <span>{region.name}</span>
                <strong>{region.countries.length} countries</strong>
              </Link>
            ))}
          </div>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Sector Intelligence</p>
          <h2>Equity themes and categories</h2>
          <div className="mini-list">
            {stockSectors.slice(0, 5).map((sector) => (
              <Link to={`/sectors/${sector.id}`} key={sector.id}>
                <span>{sector.name}</span>
                <strong>{formatSignedPercent(sector.performanceYtd)} YTD</strong>
              </Link>
            ))}
          </div>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Commodity Intelligence</p>
          <h2>Macro inputs and futures</h2>
          <div className="mini-list">
            {commodities.slice(0, 5).map((commodity) => (
              <Link to={`/commodities/${commodity.id}`} key={commodity.id}>
                <span>{commodity.name}</span>
                <strong>{formatMoney(commodity.spotPrice)}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

/**
 * Normalize a flat API exchange record (e.g. `tradingHours_open`,
 * `tradingHours_close`) into the nested shape used by the UI
 * (`tradingHours: { open, close, timezone }`). Falls back to the
 * original fields when the API already returns the nested shape.
 */
const normalizeExchange = (raw: Record<string, unknown> | null | undefined): StockExchange | null => {
  if (!raw) return null;
  const r = raw as Record<string, unknown> & {
    tradingHours?: { open: string; close: string; timezone?: string };
    tradingHours_open?: string;
    tradingHours_close?: string;
  };
  if (!r.tradingHours && (r.tradingHours_open || r.tradingHours_close)) {
    r.tradingHours = {
      open: r.tradingHours_open ?? "09:00",
      close: r.tradingHours_close ?? "17:00",
      timezone: (r.timezone as string) ?? "UTC",
    };
  }
  return r as unknown as StockExchange;
};

const StocksPage = () => {
  const { exchangeId } = useParams();
  const resolvedExchangeId = resolveExchangeLookupId(exchangeId?.toLowerCase());
  const { t } = useI18n();
  const location = useLocation();
  const isExchangesPath = location.pathname.startsWith("/exchanges");

  // Exchange list — pehle JSON se, phir DB se
  const [allExchanges, setAllExchanges] = React.useState<StockExchange[]>(exchanges);
  const [exchange, setExchange] = React.useState<StockExchange | null>(null);
  const [indexData, setIndexData] = React.useState<IndexSnapshot | null>(null);
  const [gainers, setGainers] = React.useState<MarketMover[]>([]);
  const [losers, setLosers] = React.useState<MarketMover[]>([]);
  const [mostActive, setMostActive] = React.useState<MarketMover[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // Single exchange detail — API se fetch karo
  React.useEffect(() => {
    if (!exchangeId) return;
    setIsLoading(true);

    const id = resolvedExchangeId;

    // Temporary instrumentation (root-cause tracing for NYSE/NASDAQ/LSE)
    // eslint-disable-next-line no-console
    console.debug("[StocksPage] exchange route clicked", {
      rawExchangeId: exchangeId,
      resolvedExchangeId,
      matchedByDatasetId: findExchangeById(resolvedExchangeId)?.id,
      pathname: location.pathname,
      isExchangesPath,
    });

    Promise.all([
      fetch(`${API_BASE}/exchanges/${id}`).then(r => r.json()).then((res) => {
        // eslint-disable-next-line no-console
        console.debug("[StocksPage] API /exchanges/:id response", { id, res });
        return res;
      }),
      fetch(`${API_BASE}/exchanges/${id}/summary`).then(r => r.json()).then((res) => {
        // eslint-disable-next-line no-console
        console.debug("[StocksPage] API /exchanges/:id/summary response", { id, res });
        return res;
      }),
    ])
      .then(([exchRes, summaryRes]) => {
        // eslint-disable-next-line no-console
        console.debug("[StocksPage] API responses success flags", {
          id,
          exchSuccess: !!exchRes?.success,
          summarySuccess: !!summaryRes?.success,
        });

        if (exchRes.success) {
          const normalized = normalizeExchange(exchRes.data);
          // eslint-disable-next-line no-console
          console.debug("[StocksPage] normalized exchange", { id, normalizedId: normalized?.id });
          if (normalized) setExchange(normalized);
        }

        if (summaryRes.success) {
          const s = summaryRes.data;
          // index snapshot
          if (s.index) setIndexData(s.index);

          // movers — fallback to buildMovers agar DB mein nahi hain
          const ex = exchRes.data ?? findExchangeById(resolvedExchangeId);
          // eslint-disable-next-line no-console
          console.debug("[StocksPage] movers fallback exchange selection", {
            id,
            exFromApi: !!exchRes?.data,
            exSelectedId: ex?.id,
          });

          setGainers(s.gainers?.length   ? s.gainers   : ex ? buildMovers(ex, "up")     : []);
          setLosers(s.losers?.length     ? s.losers    : ex ? buildMovers(ex, "down")   : []);
          setMostActive(s.mostActive?.length ? s.mostActive : ex ? buildMovers(ex, "active") : []);

          // agar index DB mein nahi hai toh JSON se banao
          if (!s.index?.value && ex) setIndexData(buildIndexSnapshot(ex));
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("[StocksPage] API fetch failed, using JSON fallback", { id, err });

        // API fail hone par JSON fallback
        const ex = findExchangeById(resolvedExchangeId);
        // eslint-disable-next-line no-console
        console.debug("[StocksPage] JSON fallback exchange lookup result", { id: resolvedExchangeId, exId: ex?.id });

        if (ex) {
          setExchange(ex);
          setIndexData(buildIndexSnapshot(ex));
          setGainers(buildMovers(ex, "up"));
          setLosers(buildMovers(ex, "down"));
          setMostActive(buildMovers(ex, "active"));
        }
      })
      .finally(() => setIsLoading(false));
  }, [exchangeId]);

  // All exchanges list — API se
  React.useEffect(() => {
    if (exchangeId) return; // detail page pe nahi chahiye
    fetch(`${API_BASE}/exchanges?limit=50`)
      .then(r => r.json())
      .then(res => { if (res.success && res.data?.length) setAllExchanges(res.data); })
      .catch(() => {}); // JSON fallback already set
  }, [exchangeId]);

  const exchangeFallback = exchange ?? findExchangeById(resolvedExchangeId);

  if (exchangeId) {
    if (exchangeFallback || isLoading) {
      return (
        <ExchangeDetail
          exchange={exchangeFallback ?? exchanges[0]}
          indexData={indexData ?? undefined}
          gainers={gainers}
          losers={losers}
          mostActive={mostActive}
          isLoading={isLoading || !exchangeFallback}
        />
      );
    }
    return (
      <div className="page">
        <p>Exchange not found: {exchangeId}</p>
      </div>
    );
  }

  return (
    <>
      {isExchangesPath ? (
        <SubMenuNav
          title="Exchange Network"
          items={[
            { label: "All Exchanges", path: "/exchanges" },
            { label: "Americas", path: "/exchanges/region/americas" },
            { label: "Europe", path: "/exchanges/region/europe" },
            { label: "Asia Pacific", path: "/exchanges/region/asia-pacific" },
            { label: "Middle East & Africa", path: "/exchanges/region/middle-east-africa" },
            { label: "Latin America", path: "/exchanges/region/latin-america" },
          ]}
        />
      ) : (
        <SubMenuNav
          title="Stock Exchanges"
          items={[
            { label: "All Exchanges", path: "/stocks" },
            { label: "Top Gainers", path: "/stocks/gainers" },
            { label: "Top Losers", path: "/stocks/losers" },
            { label: "Market Movers", path: "/markets/movers" },
            { label: "Advanced Screener", path: "/screener" },
          ]}
        />
      )}
      <div className="page">
        <div className="section-heading">
          <p className="eyebrow">{isExchangesPath ? "Exchange Network" : t("equities")}</p>
          <h1>{t("topGlobalExchanges")}</h1>
          <p>{t("exchangeIntro")}</p>
        </div>
        <div className="asset-grid">
          {allExchanges.map((item) => (
            <AssetCard
              key={item.id}
              to={`/stocks/${item.id}`}
              eyebrow={`${item.country} / ${item.currency}`}
              title={item.name}
              meta={`${item.mainIndexName} / ${item.tradingHours?.open ?? "09:00"}-${item.tradingHours?.close ?? "17:00"}`}
              metric={formatMoney(item.marketCap)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const EXCHANGE_REGION_MAP: Record<string, string[]> = {
  americas: ["North America", "Latin America"],
  "north-america": ["North America"],
  europe: ["Europe"],
  asia: ["Asia"],
  "asia-pacific": ["Asia", "Oceania"],
  oceania: ["Oceania"],
  "middle-east": ["Middle East"],
  africa: ["Africa"],
  "middle-east-africa": ["Middle East", "Africa"],
  "latin-america": ["Latin America"],
};

const EXCHANGE_REGION_LABEL: Record<string, string> = {
  americas: "Americas",
  "north-america": "North America",
  europe: "Europe",
  asia: "Asia",
  "asia-pacific": "Asia Pacific",
  oceania: "Oceania",
  "middle-east": "Middle East",
  africa: "Africa",
  "middle-east-africa": "Middle East & Africa",
  "latin-america": "Latin America",
};

const EXCHANGE_REGION_SUBMENU = [
  { label: "All Exchanges", path: "/exchanges" },
  { label: "Americas", path: "/exchanges/region/americas" },
  { label: "Europe", path: "/exchanges/region/europe" },
  { label: "Asia Pacific", path: "/exchanges/region/asia-pacific" },
  { label: "Middle East & Africa", path: "/exchanges/region/middle-east-africa" },
  { label: "Latin America", path: "/exchanges/region/latin-america" },
];

const ExchangesByRegionPage = () => {
  const { regionId } = useParams();
  const [allExchanges, setAllExchanges] = React.useState<StockExchange[]>(exchanges);

  React.useEffect(() => {
    fetch(`${API_BASE}/exchanges?limit=50`)
      .then((r) => r.json())
      .then((res) => { if (res.success && res.data?.length) setAllExchanges(res.data); })
      .catch(() => {});
  }, []);

  const key = regionId?.toLowerCase() ?? "";
  const dataRegions = EXCHANGE_REGION_MAP[key] ?? [];
  const filtered = dataRegions.length
    ? allExchanges.filter((ex) => dataRegions.includes(ex.region))
    : allExchanges;
  const label = EXCHANGE_REGION_LABEL[key] ?? "All Regions";

  return (
    <>
      <SubMenuNav title="Exchange Network" items={EXCHANGE_REGION_SUBMENU} />
      <div className="page">
        <div className="section-heading">
          <p className="eyebrow">Exchange Network</p>
          <h1>{label} Exchanges</h1>
          <p>Regional exchange dashboards — currency, timezone, trading hours, listed companies, main index, and market cap.</p>
        </div>
        {filtered.length > 0 ? (
          <div className="asset-grid">
            {filtered.map((item) => (
              <AssetCard
                key={item.id}
                to={`/stocks/${item.id}`}
                eyebrow={`${item.country} / ${item.currency}`}
                title={item.name}
                meta={`${item.mainIndexName} / ${item.tradingHours?.open ?? "09:00"}-${item.tradingHours?.close ?? "17:00"}`}
                metric={formatMoney(item.marketCap)}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: "#7a8c99", marginTop: "24px" }}>No exchanges found for this region.</p>
        )}
      </div>
    </>
  );
};

const CurrenciesPage = () => {
  const { code } = useParams();
  const { t } = useI18n();

  // List view state
  const [allCurrencies, setAllCurrencies] = React.useState<Currency[]>(currencies);
  const [liveRates, setLiveRates]         = React.useState<Record<string, number>>(majorRates);

  // Detail view state
  const [currency,      setCurrency]      = React.useState<Currency | null>(null);
  const [exchangeRates, setExchangeRates] = React.useState<Record<string, number>>({});
  const [popularPairs,  setPopularPairs]  = React.useState<CurrencyPair[]>([]);
  const [economicData,  setEconomicData]  = React.useState<any>(null);
  const [currencyNews,  setCurrencyNews]  = React.useState<any[]>([]);
  const [isLoading,     setIsLoading]     = React.useState(false);

  // ── Detail page — API se fetch ──────────────────────────────────────────
  React.useEffect(() => {
    if (!code) return;
    setIsLoading(true);
    const c = code.toUpperCase();

    Promise.all([
      fetch(`${API_BASE}/currencies/${c}`).then(r => r.json()),
      fetch(`${API_BASE}/currencies/${c}/rates`).then(r => r.json()),
      fetch(`${API_BASE}/currencies/${c}/pairs?limit=10`).then(r => r.json()),
      fetch(`${API_BASE}/currencies/${c}/economic-data`).then(r => r.json()),
      fetch(`${API_BASE}/currencies/${c}/news?limit=10`).then(r => r.json()),
    ])
      .then(([cRes, ratesRes, pairsRes, econRes, newsRes]) => {
        // Currency detail — DB ya JSON fallback
        if (cRes.success) {
          setCurrency(cRes.data);
        } else {
          const fallback = currencies.find(x => x.code.toLowerCase() === code.toLowerCase());
          if (fallback) setCurrency(fallback);
        }

        // Exchange rates — DB ya hardcoded fallback
        if (ratesRes.success && ratesRes.data?.rates?.length) {
          const rMap: Record<string, number> = {};
          ratesRes.data.rates.forEach((r: any) => { rMap[r.toCode] = Number(r.rate); });
          setExchangeRates(rMap);
        } else {
          setExchangeRates(getCurrencyRates(c));
        }

        // Popular pairs
        if (pairsRes.success && pairsRes.data?.length) {
          setPopularPairs(pairsRes.data);
        } else {
          setPopularPairs(getPopularPairs(c));
        }

        // Economic data
        if (econRes.success) setEconomicData(econRes.data);

        // News
        if (newsRes.success && newsRes.data?.length) setCurrencyNews(newsRes.data);
      })
      .catch(() => {
        // Full JSON fallback
        const fallback = currencies.find(x => x.code.toLowerCase() === code.toLowerCase());
        if (fallback) {
          setCurrency(fallback);
          setExchangeRates(getCurrencyRates(fallback.code));
          setPopularPairs(getPopularPairs(fallback.code));
        }
      })
      .finally(() => setIsLoading(false));
  }, [code]);

  // ── List page — currencies + live rates API se ──────────────────────────
  React.useEffect(() => {
    if (code) return;
    Promise.all([
      fetch(`${API_BASE}/currencies?limit=50`).then(r => r.json()),
      fetch(`${API_BASE}/currencies/USD/rates`).then(r => r.json()),
    ])
      .then(([listRes, usdRatesRes]) => {
        if (listRes.success && listRes.data?.length) setAllCurrencies(listRes.data);
        if (usdRatesRes.success && usdRatesRes.data?.rates?.length) {
          const rMap: Record<string, number> = { USD: 1 };
          usdRatesRes.data.rates.forEach((r: any) => { rMap[r.toCode] = Number(r.rate); });
          setLiveRates(rMap);
        }
      })
      .catch(() => {});
  }, [code]);

  // ── Detail page render ──────────────────────────────────────────────────
  if (code) {
    const displayCurrency = currency ?? currencies.find(x => x.code.toLowerCase() === code.toLowerCase());
    if (isLoading || displayCurrency) {
      return (
        <CurrencyDetail
          currency={displayCurrency ?? currencies[0]}
          exchangeRates={exchangeRates}
          popularPairs={popularPairs}
          economicData={economicData}
          news={currencyNews}
          isLoading={isLoading}
        />
      );
    }
    return <div className="page"><p>Currency not found: {code}</p></div>;
  }

  // ── List page render ────────────────────────────────────────────────────
  return (
    <div className="page">
      <div className="section-heading">
        <p className="eyebrow">{t("fx")}</p>
        <h1>{t("topCurrencies")}</h1>
        <p>{t("currencyIntro")}</p>
      </div>
      <div className="asset-grid compact">
        {allCurrencies.map((item) => {
          const rate = liveRates[item.code];
          const rateStr = rate
            ? `1 USD = ${rate.toFixed(item.code === "JPY" || item.code === "KRW" ? 0 : 2)} ${item.code}`
            : `${item.code}`;
          return (
            <AssetCard
              key={item.code}
              to={`/currencies/${item.code}`}
              eyebrow={item.region}
              title={`${item.code} - ${item.name}`}
              meta={`${item.country} / ${item.centralBank}`}
              metric={rateStr}
            />
          );
        })}
      </div>
    </div>
  );
};

const CoveragePage = () => {
  const { t } = useI18n();

  return (
    <div className="page intelligence-page">
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">{t("assetCoverage")}</p>
          <h1>{t("intelligenceTitle")}</h1>
          <p>{t("intelligenceCopy")}</p>
        </div>
        <div className="metric-strip">
          <MetricTile label={t("equities")} value={String(exchanges.length)} />
          <MetricTile label={t("fx")} value={String(currencies.length)} />
          <MetricTile label={t("crypto")} value={String(cryptocurrencies.length)} />
        </div>
      </section>

      <section className="asset-class-grid">
        {assetCoverage.map((asset) => (
          <Link to={asset.to} className="asset-class-card" key={asset.key}>
            <span>{t(asset.key)}</span>
            <strong>{asset.count}</strong>
            <p>{t(asset.metaKey)}</p>
          </Link>
        ))}
      </section>

      <section className="dashboard-grid spotlight-grid">
        <AssetCard
          to="/indices"
          eyebrow="Indices"
          title="Market Indices"
          meta="Global benchmark snapshots and index-level coverage"
          metric="Live-style"
        />
        <AssetCard
          to="/etfs"
          eyebrow="ETFs"
          title="ETF Coverage"
          meta="Sector ETFs, allocation context, and fund coverage"
          metric="Research"
        />
        <AssetCard
          to="/bonds-yields"
          eyebrow="Fixed Income"
          title="Bonds & Yields"
          meta="Yield curves, rates context, and macro coverage"
          metric="Macro"
        />
      </section>
    </div>
  );
};

const CryptoPage = () => {
  const { cryptoId } = useParams();
  const { t } = useI18n();

  const [allCryptos, setAllCryptos] = React.useState<Cryptocurrency[]>(cryptocurrencies);
  const [livePrices, setLivePrices] = React.useState<Record<string, CryptoPrice>>({});

  const detail = useCryptoDetail(cryptoId);

  React.useEffect(() => {
    if (cryptoId) return;
    Promise.all([
      fetchJson<Cryptocurrency[]>("/cryptos?limit=50"),
      fetchJson<{ gainers?: unknown[]; losers?: unknown[]; trending?: unknown[] }>(
        "/cryptos/market/overview"
      ),
    ])
      .then(([listRes, overviewRes]) => {
        if (listRes.data?.length) setAllCryptos(listRes.data);
        if (overviewRes.data) {
          const priceMap: Record<string, CryptoPrice> = {};
          const all = [
            ...(overviewRes.data.gainers ?? []),
            ...(overviewRes.data.losers ?? []),
            ...(overviewRes.data.trending ?? []),
          ];
          all.forEach((p) => {
            const row = p as Record<string, unknown>;
            const id = String(row.cryptoId ?? "");
            const normalized = normalizeCryptoPrice(row);
            if (id && normalized) priceMap[id] = normalized;
          });
          setLivePrices(priceMap);
        }
      })
      .catch(() => {});
  }, [cryptoId]);

  if (cryptoId) {
    const displayCrypto =
      detail.crypto ??
      cryptocurrencies.find(
        (x) =>
          x.id.toLowerCase() === cryptoId.toLowerCase() ||
          x.symbol.toLowerCase() === cryptoId.toLowerCase()
      );

    if (detail.error && !displayCrypto) {
      return (
        <div className="page">
          <p className="error">{detail.error}</p>
          <button type="button" onClick={detail.retry}>
            Retry
          </button>
        </div>
      );
    }

    if (detail.isLoading || displayCrypto) {
      return (
        <ErrorBoundary>
          <CryptoDetail
            crypto={displayCrypto ?? cryptocurrencies[0]}
            priceData={detail.priceData}
            tradingPairs={detail.tradingPairs}
            exchangeListings={detail.exchangeListings}
            news={detail.news as Array<{
              id?: number | string;
              title?: string;
              description?: string;
              source?: string;
              publishedAt?: string;
              url?: string;
            }>}
            isLoading={detail.isLoading}
          />
        </ErrorBoundary>
      );
    }
    return (
      <div className="page">
        <p>Crypto not found: {cryptoId}</p>
      </div>
    );
  }

  // ── List page render ────────────────────────────────────────────────────
  return (
    <>
      <SubMenuNav
        title="Cryptocurrency Categories"
        items={[
          { label: "📊 All Cryptocurrencies", path: "/crypto" },
          { label: "🔥 Trending", path: "/crypto/trending" },
          { label: "🎭 Meme Coins", path: "/crypto/meme-coins" },
          { label: "💰 DeFi", path: "/crypto/defi" },
          { label: "⛓️ Layer 1", path: "/crypto/layer-1" },
          { label: "💵 Stablecoins", path: "/crypto/stablecoins" },
        ]}
      />
      <div className="page">
        <div className="section-heading">
          <p className="eyebrow">{t("crypto")}</p>
          <h1>{t("topCryptos")}</h1>
          <p>{t("cryptoIntro")}</p>
        </div>
        <div className="asset-grid compact">
          {allCryptos.map((item, index) => {
            const live  = livePrices[item.id];
            const price = live ?? getCryptoPrice(item, index);
            return (
              <AssetCard
                key={item.id}
                to={`/crypto/${item.id}`}
                eyebrow={item.category}
                title={`${item.name} (${item.symbol})`}
                meta={`Rank #${price.rank} / ${item.consensusMechanism}`}
                metric={`${formatMoney(price.marketCap)} market cap`}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

const DashboardPage = () => {
  const { t } = useI18n();
  const leadingRegion = marketRegions[2];
  const leadingSector = stockSectors[0];
  const leadingCommodity = commodities[0];
  const topIndices = exchanges.slice(0, 5).map((exchange) => buildIndexSnapshot(exchange));
  const topGainers = buildMovers(exchanges[0], "up").slice(0, 4);
  const topLosers = buildMovers(exchanges[1], "down").slice(0, 4);
  const economicEvents = [
    ["08:30", "US CPI", "High"],
    ["10:00", "ECB policy remarks", "Medium"],
    ["13:00", "US 10Y auction", "Medium"],
    ["19:00", "FOMC minutes", "High"],
  ];
  const sentiment = [
    ["Equities", 64, "Risk-on breadth"],
    ["FX", 48, "USD mixed"],
    ["Crypto", 72, "Momentum bid"],
    ["Commodities", 41, "Energy softer"],
  ];

  return (
    <div className="page market-home">
      <section className="market-tape" aria-label={t("liveTape")}>
        {marketTape.map((item) => (
          <div key={item.label} className="tape-item">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <em className={item.move.startsWith("-") ? "negative" : "positive"}>{item.move}</em>
          </div>
        ))}
      </section>

      <div className="section-heading">
        <p className="eyebrow">{t("crossMarket")}</p>
        <h1>{t("heroTitle")}</h1>
        <p>{t("heroCopy")}</p>
      </div>

      <section className="dashboard-grid">
        <AssetCard to="/stocks/NYSE" eyebrow={t("topExchange")} title="New York Stock Exchange" meta="S&P 500 / USD / New York" metric={formatMoney(exchanges[0].marketCap)} />
        <AssetCard to="/currencies/USD" eyebrow={t("coreReserve")} title="United States Dollar" meta="Federal Reserve / global base" metric={t("primaryBase")} />
        <AssetCard to="/crypto/bitcoin" eyebrow={t("cryptoLeader")} title="Bitcoin" meta="BTC vs USD, FX, and equity risk" metric={formatMoney(getCryptoPrice(cryptocurrencies[0], 0).marketCap)} />
        <AssetCard to={`/regions/${leadingRegion.id}`} eyebrow="Region pulse" title={leadingRegion.name} meta={leadingRegion.newsThemes.join(" / ")} metric={`${leadingRegion.gdpGrowth.toFixed(1)}% GDP growth`} />
        <AssetCard to={`/sectors/${leadingSector.id}`} eyebrow="Sector pulse" title={leadingSector.name} meta={leadingSector.newsThemes.join(" / ")} metric={`${formatSignedPercent(leadingSector.performanceYtd)} YTD`} />
        <AssetCard to={`/commodities/${leadingCommodity.id}`} eyebrow="Commodity pulse" title={leadingCommodity.name} meta={leadingCommodity.economicImpact} metric={`${formatMoney(leadingCommodity.spotPrice)} / ${leadingCommodity.unit}`} />
      </section>

      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">{t("majorIndices")}</p>
          <h2>{t("worldSnapshot")}</h2>
          <div className="mini-list">
            {topIndices.map((index) => (
              <Link to={`/stocks/${index.exchangeId}`} key={index.id}>
                <span>{index.name}</span>
                <strong>{index.value.toFixed(2)} / {formatSignedPercent(index.percentChange)}</strong>
              </Link>
            ))}
          </div>
        </div>

        <div className="intelligence-panel">
          <p className="eyebrow">{t("marketMovers")}</p>
          <h2>{t("gainersAndLosers")}</h2>
          <div className="mini-list">
            {[...topGainers, ...topLosers].slice(0, 6).map((mover) => (
              <Link to="/stocks/gainers" key={mover.symbol}>
                <span>{mover.symbol}</span>
                <strong className={mover.percentChange >= 0 ? "positive" : "negative"}>{formatSignedPercent(mover.percentChange)}</strong>
              </Link>
            ))}
          </div>
        </div>

        <div className="intelligence-panel">
          <p className="eyebrow">{t("economicEventsToday")}</p>
          <h2>{t("macroCalendar")}</h2>
          <div className="mini-list">
            {economicEvents.map(([time, label, importance]) => (
              <Link to="/economic-calendar" key={`${time}-${label}`}>
                <span>{time} / {label}</span>
                <strong>{importance}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-grid spotlight-grid">
        {sentiment.map(([label, score, detail]) => (
          <div className="asset-card" key={label}>
            <span className="eyebrow">Market Sentiment</span>
            <h3>{label}</h3>
            <p>{detail}</p>
            <strong>{score}/100</strong>
          </div>
        ))}
      </section>

      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">{t("forexMiniCards")}</p>
          <h2>{t("currencyPulse")}</h2>
          <div className="mini-list">
            {["USD", "EUR", "JPY", "INR"].map((code) => (
              <Link to={`/currencies/${code}`} key={code}>
                <span>{code}</span>
                <strong>1 USD = {majorRates[code].toFixed(code === "JPY" || code === "INR" ? 2 : 4)}</strong>
              </Link>
            ))}
          </div>
        </div>

        <div className="intelligence-panel">
          <p className="eyebrow">{t("cryptoOverview")}</p>
          <h2>{t("marketCapLeaders")}</h2>
          <div className="mini-list">
            {cryptocurrencies.slice(0, 4).map((coin, index) => {
              const price = getCryptoPrice(coin, index);
              return (
                <Link to={`/crypto/${coin.id}`} key={coin.id}>
                  <span>{coin.name}</span>
                  <strong>{formatMoney(price.marketCap)}</strong>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="intelligence-panel">
          <p className="eyebrow">{t("commoditySnapshot")}</p>
          <h2>{t("spotAndFutures")}</h2>
          <div className="mini-list">
            {commodities.slice(0, 4).map((commodity) => (
              <Link to={`/commodities/${commodity.id}`} key={commodity.id}>
                <span>{commodity.name}</span>
                <strong>{formatMoney(commodity.spotPrice)} / {formatSignedPercent(commodity.changePercent24h)}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="comparison-strip">
        <h2>{t("watchlistPreview")}</h2>
        <p>{t("watchlistCopy")}</p>
        <div className="comparison-route">
          {userWatchlist.map((item) => (
            <span key={item.symbol}>{item.symbol} {item.move}</span>
          ))}
        </div>
      </section>
    </div>
  );
};

const moduleFeatures: Record<string, string[]> = {
  "markets/global-overview": ["Major indices widgets", "Top gainers and losers", "Heatmaps", "Market sentiment"],
  "markets/pre-market": ["Pre-market movers", "Index futures", "Volume spikes", "Opening watchlist"],
  "markets/after-hours": ["After-hours movers", "Earnings reactions", "Extended-session volume", "News catalysts"],
  "markets/heatmaps": ["Equity heatmaps", "Sector performance", "Regional breadth", "Asset-class comparison"],
  "markets/movers": ["Top gainers", "Top losers", "Most active", "Unusual volume"],
  "markets/volatility-index": ["VIX overview", "Fear and greed context", "Volatility term structure", "Risk dashboard"],
  "exchanges/region/americas": ["Country filters", "Exchange statistics", "Listed companies", "Regional news"],
  "stocks/gainers": ["Live gainers", "Volume filters", "Market cap filters", "Sector breakdown"],
  "stocks/losers": ["Live losers", "Risk alerts", "Index impact", "Watchlist actions"],
  "crypto/trending": ["Trending coins", "Market cap ranking", "Exchange listings", "Historical performance"],
  "crypto/meme-coins": ["Meme coin rankings", "Volume bursts", "Community momentum", "Risk flags"],
  "crypto/defi": ["DeFi ecosystem", "TVL metrics", "Protocol categories", "Token performance"],
  "crypto/layer-1": ["Layer 1 chains", "Consensus details", "Tokenomics", "Developer ecosystem"],
  "crypto/stablecoins": ["Stablecoin supply", "Peg monitoring", "Exchange liquidity", "Reserve context"],
  "commodities/energy": ["Spot prices", "Futures prices", "Supply-demand analysis", "Correlation analysis"],
  "commodities/metals": ["Precious metals", "Industrial metals", "Futures contracts", "Currency sensitivity"],
  "commodities/agriculture": ["Crop markets", "Weather impact", "Supply regions", "Seasonality"],
  "commodities/industrial": ["Industrial inputs", "Demand trends", "Manufacturing signals", "Regional supply"],
  "news/regions": ["Region-wise news", "Macro summaries", "Country filters", "Market alerts"],
  "news/sectors": ["Sector-wise news", "Theme tracking", "AI summaries", "ETF impact"],
  "news/crypto": ["Crypto news", "On-chain context", "Regulation updates", "Exchange developments"],
  "news/alerts": ["Market alerts", "Breaking catalysts", "Watchlist alerts", "Importance filters"],
};

const titleFromSlug = (slug: string) =>
  slug
    .split("/")
    .pop()
    ?.split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") ?? "Market Module";

const PublicModulePage: React.FC<{ slug: string; eyebrow: string; title?: string }> = ({ slug, eyebrow, title }) => {
  const features = moduleFeatures[slug] ?? ["Live market summary", "Filters", "Analytics widgets", "Related news"];

  return (
    <div className="page intelligence-page">
      <div className="section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title ?? titleFromSlug(slug)}</h1>
        <p>This workspace is part of the MarketsPivot global markets intelligence structure.</p>
      </div>
      <div className="asset-grid compact">
        {features.map((feature) => (
          <div key={feature} className="asset-card">
            <span className="eyebrow">Feature</span>
            <h3>{feature}</h3>
            <p>Ready for live APIs, filters, charts, and saved user workflows.</p>
            <strong>Planned</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

const RegionsPage = () => {
  const { regionId } = useParams();
  const region = marketRegions.find((item) => item.id.toLowerCase() === regionId?.toLowerCase());

  if (region) {
    return (
      <div className="page intelligence-page">
        <section className="coverage-hero">
          <div>
            <p className="eyebrow">Market Region</p>
            <h1>{region.name}</h1>
            <p>{region.summary}</p>
          </div>
          <div className="metric-strip">
            <MetricTile label="GDP Growth" value={`${region.gdpGrowth.toFixed(1)}%`} tone="positive" />
            <MetricTile label="Inflation" value={`${region.inflation.toFixed(1)}%`} />
            <MetricTile label="Countries" value={String(region.countries.length)} />
          </div>
        </section>

        <section className="detail-grid">
          <div className="detail-panel wide">
            <p className="eyebrow">Major Exchanges</p>
            <ChipList items={region.majorExchanges} toPrefix="/stocks/" />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">Currencies</p>
            <ChipList items={region.currencies} toPrefix="/currencies/" />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">Key Indices</p>
            <ChipList items={region.keyIndices} />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">Economic Calendar</p>
            <ChipList items={region.calendarFocus} />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">Sector Leaders</p>
            <ChipList items={region.sectorLeaders} />
          </div>
          <div className="detail-panel wide">
            <p className="eyebrow">Commodity Impact</p>
            <p>{region.commodityImpact}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page intelligence-page">
      <div className="section-heading">
        <p className="eyebrow">Regions</p>
        <h1>Global Market Regions</h1>
        <p>Regional indices, currencies, macro calendars, commodity exposure, exchange coverage, and sector leadership in one map.</p>
      </div>
      <div className="market-map-grid">
        {marketRegions.map((item) => (
          <AssetCard
            key={item.id}
            to={`/regions/${item.id}`}
            eyebrow={item.group}
            title={item.name}
            meta={`${item.countries.join(", ")} / ${item.currencies.join(", ")}`}
            metric={`${item.gdpGrowth.toFixed(1)}% GDP / ${item.inflation.toFixed(1)}% CPI`}
          />
        ))}
      </div>
    </div>
  );
};

const SectorsPage = () => {
  const { sectorId } = useParams();
  const sector = stockSectors.find((item) => item.id.toLowerCase() === sectorId?.toLowerCase());

  if (sector) {
    return (
      <div className="page intelligence-page">
        <section className="coverage-hero">
          <div>
            <p className="eyebrow">Stock Sector</p>
            <h1>{sector.name}</h1>
            <p>{sector.summary}</p>
          </div>
          <div className="metric-strip">
            <MetricTile label="Category" value={sector.category} />
            <MetricTile label="Sector PE" value={sector.peRatio.toFixed(1)} />
            <MetricTile label="YTD" value={formatSignedPercent(sector.performanceYtd)} tone={sector.performanceYtd >= 0 ? "positive" : "negative"} />
          </div>
        </section>

        <section className="detail-grid">
          <div className="detail-panel wide">
            <p className="eyebrow">Top Companies</p>
            <ChipList items={sector.topCompanies} />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">ETFs</p>
            <ChipList items={sector.etfs} />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">Trending Stocks</p>
            <ChipList items={sector.trendingStocks} />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">Dividend Leaders</p>
            <ChipList items={sector.dividendLeaders} />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">Related Regions</p>
            <ChipList items={sector.relatedRegions} toPrefix="/regions/" />
          </div>
          <div className="detail-panel wide">
            <p className="eyebrow">News Themes</p>
            <ChipList items={sector.newsThemes} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page intelligence-page">
      <div className="section-heading">
        <p className="eyebrow">Sectors</p>
        <h1>Stock Categories & Sector Intelligence</h1>
        <p>Technology, banking, AI, energy, healthcare, mining, real estate, semiconductor, and thematic equity coverage.</p>
      </div>
      <div className="asset-grid compact">
        {stockSectors.map((item) => (
          <AssetCard
            key={item.id}
            to={`/sectors/${item.id}`}
            eyebrow={item.category}
            title={item.name}
            meta={`${item.topCompanies.slice(0, 3).join(", ")} / ${item.etfs.join(", ")}`}
            metric={`${formatSignedPercent(item.performanceYtd)} YTD / ${item.peRatio.toFixed(1)} PE`}
          />
        ))}
      </div>
    </div>
  );
};




const CommoditiesPage = () => {
  const { commodityId } = useParams();
  const commodity = commodities.find(
    (item) => item.id.toLowerCase() === commodityId?.toLowerCase() || item.symbol.toLowerCase() === commodityId?.toLowerCase()
  );

  if (commodity) {
    return (
      <div className="page intelligence-page">
        <section className="coverage-hero">
          <div>
            <p className="eyebrow">Commodity</p>
            <h1>{commodity.name}</h1>
            <p>{commodity.economicImpact}</p>
          </div>
          <div className="metric-strip">
            <MetricTile label="Spot Price" value={`${formatMoney(commodity.spotPrice)} / ${commodity.unit}`} />
            <MetricTile label="24h Move" value={formatSignedPercent(commodity.changePercent24h)} tone={commodity.changePercent24h >= 0 ? "positive" : "negative"} />
            <MetricTile label="Futures" value={commodity.futuresContract} />
          </div>
        </section>

        <section className="detail-grid">
          <div className="detail-panel">
            <p className="eyebrow">Category</p>
            <strong>{commodity.category}</strong>
          </div>
          <div className="detail-panel">
            <p className="eyebrow">Supply Regions</p>
            <ChipList items={commodity.supplyRegions} />
          </div>
          <div className="detail-panel wide">
            <p className="eyebrow">Demand Trends</p>
            <ChipList items={commodity.demandTrends} />
          </div>
          <div className="detail-panel wide">
            <p className="eyebrow">Currency Correlation</p>
            <p>{commodity.currencyCorrelation}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <SubMenuNav
        title="Commodity Categories"
        items={[
          { label: "📊 All Commodities", path: "/commodities" },
          { label: "⚡ Energy", path: "/commodities/energy" },
          { label: "💎 Metals", path: "/commodities/metals" },
          { label: "🌾 Agriculture", path: "/commodities/agriculture" },
          { label: "🏭 Industrial", path: "/commodities/industrial" },
        ]}
      />
      <div className="page intelligence-page">
        <div className="section-heading">
          <p className="eyebrow">Commodities</p>
          <h1>Energy, Metals, Agriculture & Industrial Inputs</h1>
          <p>Spot prices, futures references, supply regions, demand trends, currency correlations, and macro impact.</p>
        </div>
        <div className="asset-grid compact">
          {commodities.map((item) => (
            <AssetCard
              key={item.id}
              to={`/commodities/${item.id}`}
              eyebrow={item.category}
              title={`${item.name} (${item.symbol})`}
              meta={`${item.futuresContract} / ${item.supplyRegions.join(", ")}`}
              metric={`${formatMoney(item.spotPrice)} / ${item.unit} (${formatSignedPercent(item.changePercent24h)})`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

const userWatchlist = [
  { symbol: "NYSE", name: "New York Stock Exchange", type: "Exchange", price: "S&P 500 5,420.18", move: "+0.82%", to: "/stocks/NYSE" },
  { symbol: "USD/INR", name: "US Dollar / Indian Rupee", type: "FX", price: "83.50", move: "+0.18%", to: "/currencies/INR" },
  { symbol: "BTC", name: "Bitcoin", type: "Crypto", price: "$65,000", move: "+2.20%", to: "/crypto/bitcoin" },
  { symbol: "ASX", name: "Australian Securities Exchange", type: "Exchange", price: "ASX 200 7,860.42", move: "-0.21%", to: "/stocks/ASX" },
];

const userActivities = [
  "Added Bitcoin to crypto watchlist",
  "Changed base currency from USD to INR",
  "Created alert for USD/JPY above 156.00",
  "Viewed National Stock Exchange of India",
];

const userAlerts = [
  { label: "BTC above $68,000", status: "Armed" },
  { label: "NSE market opens", status: "Daily" },
  { label: "USD/INR moves 1%", status: "Armed" },
];

const UserPanelPage = () => {
  const { t } = useI18n();
  const location = useLocation();
  const { user, isAuthenticated, logout, updateUser, openLoginModal, openSignupModal } = useAuthStore();
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(user?.name ?? "");
  const [email, setEmail] = React.useState(user?.email ?? "");
  const displayName = user?.name ?? "Guest";

  React.useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  React.useEffect(() => {
    const sectionTarget = location.pathname.endsWith("/watchlists")
      ? "user-watchlist-section"
      : location.pathname.endsWith("/portfolio")
      ? "user-portfolio-section"
      : location.pathname.endsWith("/alerts")
      ? "user-alert-section"
      : undefined;

    if (sectionTarget) {
      document.getElementById(sectionTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.pathname]);

  const saveProfile = () => {
    updateUser({ name, email });
    setEditing(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="page user-panel-page">
        <section className="user-hero user-auth-hero">
          <div>
            <p className="eyebrow">{t("userPanel")}</p>
            <h1>{t("userPanelTitle")}</h1>
            <p>{t("userPanelIntro")}</p>
            <div className="user-auth-actions">
              <button type="button" onClick={openLoginModal} className="primary-action">
                {t("login")}
              </button>
              <button type="button" onClick={openSignupModal} className="secondary-action">
                {t("signUp")}
              </button>
            </div>
          </div>
          <div className="user-profile-card">
            <span className="avatar">M</span>
            <div>
              <strong>Markets workspace</strong>
              <p>Sign in to unlock watchlists, alerts, preferences, and portfolio dashboard.</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page user-panel-page">
      <section className="user-hero">
        <div>
          <p className="eyebrow">{t("userPanel")}</p>
          <h1>Welcome, {displayName.split(" ")[0]}</h1>
          <p>Your watchlist, alerts, portfolio mix, and account preferences in one dashboard.</p>
        </div>
        <div className="user-profile-card">
          <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
          <div>
            {editing ? (
              <div>
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
                <div style={{ marginTop: 8 }}>
                  <button onClick={saveProfile} className="primary-action">Save</button>
                  <button onClick={() => setEditing(false)} className="secondary-action">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => setEditing(true)} className="secondary-action">Edit Profile</button>
                  <button onClick={logout} className="link-button">{t("logout")}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="user-stat-grid">
        {[
          { label: "Watchlist", value: String(userWatchlist.length), meta: "Saved markets", highlight: true },
          { label: "Alerts", value: String(userAlerts.length), meta: "Active signals" },
          { label: "Base FX", value: "USD", meta: "Default currency" },
          { label: "Risk", value: "Moderate", meta: "Profile mode" },
        ].map((item) => (
          <div key={item.label} className={`user-stat-card ${item.highlight ? "highlight" : ""}`}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <em>{item.meta}</em>
          </div>
        ))}
      </section>

      <section className="user-panel-layout">
        <div className="user-main-column">
          <div className="watchlist-table" id="user-watchlist-section">
            <div className="user-section-header user-card-header">
              <div>
                <p className="eyebrow">{t("watchlist")}</p>
                <h2>{t("savedMarkets")}</h2>
              </div>
              <Link to="/stocks" className="secondary-action">{t("addWatchlist")}</Link>
            </div>
            {userWatchlist.map((item) => (
              <Link to={item.to} className="watchlist-row" key={item.symbol}>
                <div>
                  <strong>{item.symbol}</strong>
                  <span>{item.name}</span>
                </div>
                <span>{item.type}</span>
                <span>{item.price}</span>
                <em className={item.move.startsWith("-") ? "negative" : "positive"}>{item.move}</em>
              </Link>
            ))}
          </div>

          <div className="allocation-card" id="user-portfolio-section">
            <div className="user-section-header">
              <div>
                <p className="eyebrow">{t("portfolioAllocation")}</p>
                <h2>Multi-asset mix</h2>
              </div>
            </div>
            <div className="allocation-bars">
              {[
                { label: t("equities"), value: 46 },
                { label: t("crypto"), value: 22 },
                { label: t("fx"), value: 18 },
                { label: t("bonds"), value: 14 },
              ].map((item) => (
                <div className="allocation-row" key={item.label}>
                  <span>{item.label}</span>
                  <div className="allocation-track">
                    <div style={{ width: `${item.value}%` }} />
                  </div>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="user-market-card">
            <div className="user-section-header">
              <div>
                <p className="eyebrow">Market Pulse</p>
                <h2>Today’s dashboard</h2>
              </div>
              <span className="user-live-pill">Live</span>
            </div>
            <div className="user-pulse-grid">
              {[
                ["S&P 500", "5,420.18", "+0.82%"],
                ["BTC", "$65,000", "+2.20%"],
                ["USD/INR", "83.50", "+0.18%"],
              ].map(([label, value, move]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <em className={move.startsWith("-") ? "negative" : "positive"}>{move}</em>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="user-side-column">
          <div className="quick-actions-card">
            <p className="eyebrow">{t("quickActions")}</p>
            <Link to="/stocks">{t("addWatchlist")}</Link>
            <Link to="/dashboard">{t("createAlert")}</Link>
            <Link to="/dashboard">{t("exportReport")}</Link>
            <Link to="/user">{t("accountSettings")}</Link>
          </div>

          <div className="preference-card">
            <p className="eyebrow">{t("preferences")}</p>
            <div><span>{t("baseCurrencyPreference")}</span><strong>USD</strong></div>
            <div><span>{t("defaultMarket")}</span><strong>Global</strong></div>
            <div><span>{t("notificationMode")}</span><strong>Email</strong></div>
            <div><span>{t("riskProfile")}</span><strong>{t("moderate")}</strong></div>
          </div>

          <div className="alert-card" id="user-alert-section">
            <p className="eyebrow">{t("alertCenter")}</p>
            {userAlerts.map((alert) => (
              <div className="alert-row" key={alert.label}>
                <span>{alert.label}</span>
                <strong>{alert.status}</strong>
              </div>
            ))}
          </div>

          <div className="activity-card">
            <p className="eyebrow">{t("recentActivity")}</p>
            {userActivities.map((activity) => (
              <span key={activity}>{activity}</span>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
};

function PageLoaderFallback() {
  return <PageLoader />;
}

const NotFoundPage = () => {
  return (
    <div className="page">
      <div className="section-heading" role="alert">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The requested page could not be found. Please check the URL or return to the home dashboard.</p>
        <Link to="/" className="primary-action" style={{ marginTop: "1rem" }}>← Go to home</Link>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <SubscriptionProvider>
        <ScrollToTop />
        <SkeletonStyles />
        <OfflineIndicator />
        <InstallPrompt />
        <React.Suspense fallback={<PageLoaderFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="index.html" element={<HomePage />} />
            <Route path="stocks" element={<StocksPage />} />
            <Route path="stocks/watchlists" element={<WatchlistPage />} />
            <Route path="stocks/portfolio" element={<PortfolioPage />} />
            <Route path="stocks/alerts" element={<UserPanelPage />} />
            <Route path="stocks/gainers" element={<PublicModulePage slug="stocks/gainers" eyebrow="Stocks" title="Top Gainers" />} />
            <Route path="stocks/losers" element={<PublicModulePage slug="stocks/losers" eyebrow="Stocks" title="Top Losers" />} />
            <Route path="stocks/symbol/:symbol" element={<StockDetailPage />} />
            <Route path="stocks/:exchangeId" element={<StocksPage />} />
            <Route path="coverage" element={<CoveragePage />} />
            <Route path="currencies" element={<CurrenciesPage />} />
            <Route path="currencies/:code" element={<CurrenciesPage />} />
            <Route path="crypto" element={<CryptoPage />} />
            <Route path="crypto/:cryptoId" element={<CryptoPage />} />
            <Route path="regions" element={<RegionsPageNew />} />
            <Route path="regions/:regionId" element={<RegionsPageNew />} />
            <Route path="sectors" element={<SectorsPageNew />} />
            <Route path="sectors/:sectorId" element={<SectorsPageNew />} />
            <Route path="commodities" element={<CommoditiesPage />} />
            <Route path="commodities/:commodityId" element={<CommoditiesPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="markets" element={<DashboardPage />} />
            <Route path="markets/global-overview" element={<DashboardPage />} />
            <Route path="markets/pre-market" element={<PreMarketPage />} />
            <Route path="markets/after-hours" element={<AfterHoursPage />} />
            <Route path="markets/heatmaps" element={<HeatmapsPage />} />
            <Route path="markets/movers" element={<MoversPage />} />
            <Route path="markets/volatility-index" element={<VolatilityIndexPage />} />
            <Route path="exchanges" element={<StocksPage />} />
            <Route path="exchanges/region/:regionId" element={<ExchangesByRegionPage />} />
            <Route path="forex" element={<ForexPage />} />
            <Route path="forex/:code" element={<ForexPage />} />
            <Route path="crypto/trending" element={<TrendingCoinsPage />} />
            <Route path="crypto/meme-coins" element={<CryptoCategoryPage />} />
            <Route path="crypto/defi" element={<CryptoCategoryPage />} />
            <Route path="crypto/layer-1" element={<CryptoCategoryPage />} />
            <Route path="crypto/stablecoins" element={<CryptoCategoryPage />} />
            <Route path="commodities/energy" element={<CategoryPage />} />
            <Route path="commodities/metals" element={<CategoryPage />} />
            <Route path="commodities/agriculture" element={<CategoryPage />} />
            <Route path="commodities/industrial" element={<CategoryPage />} />

            <Route path="indices" element={<IndicesPage />} />
            <Route path="etfs" element={<EtfsPage />} />
            <Route path="bonds-yields" element={<BondsYieldsPage />} />

            <Route path="pricing" element={<Pricing />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="news/regions" element={<CategoryPage />} />
            <Route path="news/sectors" element={<CategoryPage />} />
            <Route path="news/crypto" element={<CategoryPage />} />
            <Route path="news/alerts" element={<CategoryPage />} />
            <Route path="news/:id" element={<ArticlePage />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
            <Route path="billing-policy" element={<BillingPolicy />} />
            <Route path="about" element={<AboutMarketsPivot />} />

            <Route path="screener" element={<GatedAdvancedScreener />} />
            <Route path="screener-legacy" element={<Screener />} />
            <Route path="economic-calendar" element={<EconomicCalendar />} />
            <Route path="calendar" element={<EconomicCalendar />} />

            <Route path="watchlists" element={<WatchlistPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="user" element={<UserPanelPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="offline" element={<OfflinePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
        </React.Suspense>
      </SubscriptionProvider>
    </Router>
  );
};

export default App;
