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
import { translateStatic } from "./i18n/translate";
import { useAuthStore } from "./stores/authStore";
import SubMenuNav from "./components/SubMenuNav";
import {
  HiSquares2X2, HiArrowTrendingUp, HiFaceSmile,
  HiCircleStack, HiServerStack, HiShieldCheck,
  HiBolt, HiCube, HiSun, HiWrench, HiSparkles,
} from "react-icons/hi2";
import "./styles/index.css";
import "./styles/rtl.css";
import "./styles/polish.css";
import "./styles/productization.css";
import "./styles/CoveragePage.css";
const AdminPanel        = React.lazy(() => import("./pages/AdminPanel"));
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
              <strong>{t("markets:asiaClosed")}</strong>
            </div>
            <div>
              <span>{t("riskView")}</span>
              <strong>{t("markets:cryptoBetaOutperform")}</strong>
            </div>
            <div>
              <span>{t("globalHeatmap")}</span>
              <strong>{t("markets:fxPressure")}</strong>
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
          <p className="eyebrow">{t("markets:regionIntelligence")}</p>
          <h2>{t("markets:marketsByGeography")}</h2>
          <div className="mini-list">
            {marketRegions.map((region) => (
              <Link to={`/regions/${region.id}`} key={region.id}>
                <span>{translateStatic(t, region.nameKey, region.name)}</span>
                <strong>{region.countries.length} {t("common:regionspagenew.h4")}</strong>
              </Link>
            ))}
          </div>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{t("markets:sectorIntelligence")}</p>
          <h2>{t("markets:equityThemes")}</h2>
          <div className="mini-list">
            {stockSectors.slice(0, 5).map((sector) => (
              <Link to={`/sectors/${sector.id}`} key={sector.id}>
                <span>{translateStatic(t, sector.nameKey, sector.name)}</span>
                <strong>{formatSignedPercent(sector.performanceYtd)} YTD</strong>
              </Link>
            ))}
          </div>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{t("markets:commodityIntelligence")}</p>
          <h2>{t("markets:macroInputs")}</h2>
          <div className="mini-list">
            {commodities.slice(0, 5).map((commodity) => (
              <Link to={`/commodities/${commodity.id}`} key={commodity.id}>
                <span>{translateStatic(t, commodity.nameKey, commodity.name)}</span>
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
        <p>{t("common:categorypage.h0")}: {exchangeId}</p>
      </div>
    );
  }

  return (
    <>
      {isExchangesPath ? (
        <SubMenuNav
          title="Exchange Network"
          titleKey="markets.exchangeNetwork"
          items={[
            { label: "All Exchanges", labelKey: "markets.allExchanges", path: "/exchanges" },
            { label: "Americas", labelKey: "markets.exchangeRegions.americas", path: "/exchanges/region/americas" },
            { label: "Europe", labelKey: "markets.exchangeRegions.europe", path: "/exchanges/region/europe" },
            { label: "Asia Pacific", labelKey: "markets.exchangeRegions.asiaPacific", path: "/exchanges/region/asia-pacific" },
            { label: "Middle East & Africa", labelKey: "markets.exchangeRegions.middleEastAfrica", path: "/exchanges/region/middle-east-africa" },
            { label: "Latin America", labelKey: "markets.exchangeRegions.latinAmerica", path: "/exchanges/region/latin-america" },
          ]}
        />
      ) : (
        <SubMenuNav
          title="Stock Exchanges"
          titleKey="markets.stockExchanges"
          items={[
            { label: "All Exchanges", labelKey: "markets.allExchanges", path: "/stocks" },
            { label: "Top Gainers", labelKey: "markets.topGainers", path: "/stocks/gainers" },
            { label: "Top Losers", labelKey: "markets.topLosers", path: "/stocks/losers" },
            { label: "Market Movers", labelKey: "markets.marketMovers", path: "/markets/movers" },
            { label: "Advanced Screener", labelKey: "markets.advancedScreener", path: "/screener" },
          ]}
        />
      )}
      <div className="page">
        <div className="section-heading">
          <p className="eyebrow">{isExchangesPath ? t("markets:exchangeNetwork") : t("equities")}</p>
          <h1>{t("topGlobalExchanges")}</h1>
          <p>{t("exchangeIntro")}</p>
        </div>
        <div className="asset-grid">
          {allExchanges.map((item) => (
            <AssetCard
              key={item.id}
              to={`/stocks/${item.id}`}
              eyebrow={`${translateStatic(t, item.countryKey, item.country)} / ${item.currency}`}
              title={translateStatic(t, item.nameKey, item.name)}
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

const EXCHANGE_REGION_LABEL_KEY: Record<string, string> = {
  americas: "markets.exchangeRegions.americas",
  "north-america": "markets.exchangeRegions.northAmerica",
  europe: "markets.exchangeRegions.europe",
  asia: "markets.exchangeRegions.asia",
  "asia-pacific": "markets.exchangeRegions.asiaPacific",
  oceania: "markets.exchangeRegions.oceania",
  "middle-east": "markets.exchangeRegions.middleEast",
  africa: "markets.exchangeRegions.africa",
  "middle-east-africa": "markets.exchangeRegions.middleEastAfrica",
  "latin-america": "markets.exchangeRegions.latinAmerica",
};

const EXCHANGE_REGION_SUBMENU = [
  { label: "All Exchanges", labelKey: "markets.allExchanges", path: "/exchanges" },
  { label: "Americas", labelKey: "markets.exchangeRegions.americas", path: "/exchanges/region/americas" },
  { label: "Europe", labelKey: "markets.exchangeRegions.europe", path: "/exchanges/region/europe" },
  { label: "Asia Pacific", labelKey: "markets.exchangeRegions.asiaPacific", path: "/exchanges/region/asia-pacific" },
  { label: "Middle East & Africa", labelKey: "markets.exchangeRegions.middleEastAfrica", path: "/exchanges/region/middle-east-africa" },
  { label: "Latin America", labelKey: "markets.exchangeRegions.latinAmerica", path: "/exchanges/region/latin-america" },
];

const ExchangesByRegionPage = () => {
  const { regionId } = useParams();
  const { t } = useI18n();
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
  const label = translateStatic(t, EXCHANGE_REGION_LABEL_KEY[key], EXCHANGE_REGION_LABEL[key] ?? "All Regions");

  return (
    <>
      <SubMenuNav title="Exchange Network" titleKey="markets.exchangeNetwork" items={EXCHANGE_REGION_SUBMENU} />
      <div className="page">
        <div className="section-heading">
          <p className="eyebrow">{t("markets:exchangeNetwork")}</p>
          <h1>{t("markets:regionExchangesTitle", { region: label })}</h1>
          <p>{t("markets:regionalExchangeDashboards")}</p>
        </div>
        {filtered.length > 0 ? (
          <div className="asset-grid">
            {filtered.map((item) => (
              <AssetCard
                key={item.id}
                to={`/stocks/${item.id}`}
                eyebrow={`${translateStatic(t, item.countryKey, item.country)} / ${item.currency}`}
                title={translateStatic(t, item.nameKey, item.name)}
                meta={`${item.mainIndexName} / ${item.tradingHours?.open ?? "09:00"}-${item.tradingHours?.close ?? "17:00"}`}
                metric={formatMoney(item.marketCap)}
              />
            ))}
          </div>
        ) : (
          <p style={{ color: "#7a8c99", marginTop: "24px" }}>{t("markets:noExchangesForRegion")}</p>
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
    return <div className="page"><p>{t("common:categorypage.h0")}: {code}</p></div>;
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
              title={`${item.code} - ${translateStatic(t, item.nameKey, item.name)}`}
              meta={`${translateStatic(t, item.countryKey, item.country)} / ${item.centralBank}`}
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
    <div className="coverage-page">
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
          eyebrow={t("common:watchlistpage.h13")}
          title={t("common:indicespage.h1")}
          meta={t("common:indicespage.h2")}
          metric={t("common:categorypage.h5")}
        />
        <AssetCard
          to="/etfs"
          eyebrow={t("common:etfspage.h0")}
          title={t("common:etfspage.h1")}
          meta={t("common:etfspage.h2")}
          metric={t("common:cryptocategorypage.h34")}
        />
        <AssetCard
          to="/bonds-yields"
          eyebrow={t("common:bondsyieldspage.h0")}
          title={t("common:bondsyieldspage.h1")}
          meta={t("common:bondsyieldspage.h2")}
          metric={t("markets:macroCalendar")}
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
            {t("common:tryAgain")}
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
        <p>{t("crypto:categoryNotFound")}: {cryptoId}</p>
      </div>
    );
  }

  // ── List page render ────────────────────────────────────────────────────
  return (
    <>
      <SubMenuNav
        title="Cryptocurrency Categories"
        titleKey="crypto:cryptocurrencyCategories"
        items={[
          { label: "All Cryptocurrencies", labelKey: "crypto:allCryptocurrencies", path: "/crypto", icon: <HiSquares2X2 size={14} /> },
          { label: "Trending", labelKey: "crypto:trending", path: "/crypto/trending", icon: <HiArrowTrendingUp size={14} /> },
          { label: "Meme Coins", labelKey: "crypto:categories.meme.name", path: "/crypto/meme-coins", icon: <HiFaceSmile size={14} /> },
          { label: "DeFi", labelKey: "crypto:categories.defi.name", path: "/crypto/defi", icon: <HiCircleStack size={14} /> },
          { label: "Layer 1", labelKey: "crypto:categories.layer1.name", path: "/crypto/layer-1", icon: <HiServerStack size={14} /> },
          { label: "Stablecoins", labelKey: "crypto:categories.stablecoin.name", path: "/crypto/stablecoins", icon: <HiShieldCheck size={14} /> },
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
                eyebrow={translateStatic(t, item.categoryKey, item.category)}
                title={`${translateStatic(t, item.nameKey, item.name)} (${item.symbol})`}
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
    { time: "08:30", labelKey: "dashboard:economicEvents.usCpi", importanceKey: "dashboard:importance.high" },
    { time: "10:00", labelKey: "dashboard:economicEvents.ecbRemarks", importanceKey: "dashboard:importance.medium" },
    { time: "13:00", labelKey: "dashboard:economicEvents.us10yAuction", importanceKey: "dashboard:importance.medium" },
    { time: "19:00", labelKey: "dashboard:economicEvents.fomcMinutes", importanceKey: "dashboard:importance.high" },
  ];
  const sentiment = [
    { key: "equities", score: 64 },
    { key: "fx", score: 48 },
    { key: "crypto", score: 72 },
    { key: "commodities", score: 41 },
  ];

  return (
    <div className="page market-home">
      <section className="market-tape" aria-label={t("dashboard:liveTapeLabel")}>
        {marketTape.map((item) => (
          <div key={item.label} className="tape-item">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <em className={item.move.startsWith("-") ? "negative" : "positive"}>{item.move}</em>
          </div>
        ))}
      </section>

      <div className="section-heading">
        <p className="eyebrow">{t("dashboard:crossMarket")}</p>
        <h1>{t("dashboard:title")}</h1>
        <p>{t("dashboard:intro")}</p>
      </div>

      <section className="dashboard-grid">
        <AssetCard to="/stocks/NYSE" eyebrow={t("dashboard:topExchange")} title={t("markets:exchanges.nyse.name")} meta={t("markets:dashboardCards.nyseMeta")} metric={formatMoney(exchanges[0].marketCap)} />
        <AssetCard to="/currencies/USD" eyebrow={t("dashboard:coreReserve")} title={t("forex:currencies.usd.name")} meta={t("markets:dashboardCards.usdMeta")} metric={t("dashboard:primaryBase")} />
        <AssetCard to="/crypto/bitcoin" eyebrow={t("dashboard:cryptoLeader")} title={t("crypto:cryptocurrencies.bitcoin.name")} meta={t("markets:dashboardCards.bitcoinMeta")} metric={formatMoney(getCryptoPrice(cryptocurrencies[0], 0).marketCap)} />
        <AssetCard to={`/regions/${leadingRegion.id}`} eyebrow={t("dashboard:regionPulse")} title={t("markets:regions.asiaPacific.name")} meta={t("markets:dashboardCards.regionMeta")} metric={`${leadingRegion.gdpGrowth.toFixed(1)}% ${t("markets:gdpGrowthShort")}`} />
        <AssetCard to={`/sectors/${leadingSector.id}`} eyebrow={t("dashboard:sectorPulse")} title={t("markets:sectors.technology.name")} meta={t("markets:dashboardCards.sectorMeta")} metric={`${formatSignedPercent(leadingSector.performanceYtd)} ${t("markets:ytdShort")}`} />
        <AssetCard to={`/commodities/${leadingCommodity.id}`} eyebrow={t("dashboard:commodityPulse")} title={t("markets:commodities.crudeOil.name")} meta={t("markets:dashboardCards.commodityMeta")} metric={`${formatMoney(leadingCommodity.spotPrice)} / ${leadingCommodity.unit}`} />
      </section>

      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">{t("dashboard:majorIndices")}</p>
          <h2>{t("dashboard:worldSnapshot")}</h2>
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
          <p className="eyebrow">{t("dashboard:marketMovers")}</p>
          <h2>{t("dashboard:gainersAndLosers")}</h2>
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
          <p className="eyebrow">{t("dashboard:economicEventsToday")}</p>
          <h2>{t("dashboard:macroCalendar")}</h2>
          <div className="mini-list">
            {economicEvents.map((event) => (
              <Link to="/economic-calendar" key={`${event.time}-${event.labelKey}`}>
                <span>{event.time} / {t(event.labelKey)}</span>
                <strong>{t(event.importanceKey)}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-grid spotlight-grid">
        {sentiment.map((item) => (
          <div className="asset-card" key={item.key}>
            <span className="eyebrow">{t("dashboard:marketSentiment")}</span>
            <h3>{t(`dashboard:sentiment.${item.key}.label`)}</h3>
            <p>{t(`dashboard:sentiment.${item.key}.detail`)}</p>
            <strong>{item.score}/100</strong>
          </div>
        ))}
      </section>

      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">{t("dashboard:forexMiniCards")}</p>
          <h2>{t("dashboard:currencyPulse")}</h2>
          <div className="mini-list">
            {["USD", "EUR", "JPY", "INR"].map((code) => (
              <Link to={`/currencies/${code}`} key={code}>
                <span>{code}</span>
                <strong>{t("dashboard:currencyRate", { base: "USD", quote: code, rate: majorRates[code].toFixed(code === "JPY" || code === "INR" ? 2 : 4) })}</strong>
              </Link>
            ))}
          </div>
        </div>

        <div className="intelligence-panel">
          <p className="eyebrow">{t("dashboard:cryptoOverview")}</p>
          <h2>{t("dashboard:marketCapLeaders")}</h2>
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
          <p className="eyebrow">{t("dashboard:commoditySnapshot")}</p>
          <h2>{t("dashboard:spotAndFutures")}</h2>
          <div className="mini-list">
            {commodities.slice(0, 4).map((commodity) => (
              <Link to={`/commodities/${commodity.id}`} key={commodity.id}>
                <span>{translateStatic(t, commodity.nameKey, commodity.name)}</span>
                <strong>{formatMoney(commodity.spotPrice)} / {formatSignedPercent(commodity.changePercent24h)}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="comparison-strip">
        <h2>{t("dashboard:watchlistPreview")}</h2>
        <p>{t("dashboard:watchlistCopy")}</p>
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
  "markets/global-overview": ["majorIndicesWidgets", "topGainersLosers", "heatmaps", "marketSentiment"],
  "markets/pre-market": ["preMarketMovers", "indexFutures", "volumeSpikes", "openingWatchlist"],
  "markets/after-hours": ["afterHoursMovers", "earningsReactions", "extendedSessionVolume", "newsCatalysts"],
  "markets/heatmaps": ["equityHeatmaps", "sectorPerformance", "regionalBreadth", "assetClassComparison"],
  "markets/movers": ["topGainers", "topLosers", "mostActive", "unusualVolume"],
  "markets/volatility-index": ["vixOverview", "fearGreedContext", "volatilityTermStructure", "riskDashboard"],
  "exchanges/region/americas": ["countryFilters", "exchangeStatistics", "listedCompanies", "regionalNews"],
  "stocks/gainers": ["liveGainers", "volumeFilters", "marketCapFilters", "sectorBreakdown"],
  "stocks/losers": ["liveLosers", "riskAlerts", "indexImpact", "watchlistActions"],
  "crypto/trending": ["trendingCoins", "marketCapRanking", "exchangeListings", "historicalPerformance"],
  "crypto/meme-coins": ["memeCoinRankings", "volumeBursts", "communityMomentum", "riskFlags"],
  "crypto/defi": ["defiEcosystem", "tvlMetrics", "protocolCategories", "tokenPerformance"],
  "crypto/layer-1": ["layer1Chains", "consensusDetails", "tokenomics", "developerEcosystem"],
  "crypto/stablecoins": ["stablecoinSupply", "pegMonitoring", "exchangeLiquidity", "reserveContext"],
  "commodities/energy": ["spotPrices", "futuresPrices", "supplyDemandAnalysis", "correlationAnalysis"],
  "commodities/metals": ["preciousMetals", "industrialMetals", "futuresContracts", "currencySensitivity"],
  "commodities/agriculture": ["cropMarkets", "weatherImpact", "supplyRegions", "seasonality"],
  "commodities/industrial": ["industrialInputs", "demandTrends", "manufacturingSignals", "regionalSupply"],
  "news/regions": ["regionWiseNews", "macroSummaries", "countryFilters", "marketAlerts"],
  "news/sectors": ["sectorWiseNews", "themeTracking", "aiSummaries", "etfImpact"],
  "news/crypto": ["cryptoNews", "onChainContext", "regulationUpdates", "exchangeDevelopments"],
  "news/alerts": ["marketAlerts", "breakingCatalysts", "watchlistAlerts", "importanceFilters"],
};

const titleFromSlug = (slug: string) =>
  slug
    .split("/")
    .pop()
    ?.split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") ?? "Market Module";

const PublicModulePage: React.FC<{ slug: string; eyebrow: string; title?: string }> = ({ slug, eyebrow, title }) => {
  const { t } = useI18n();
  const features = moduleFeatures[slug] ?? ["liveMarketSummary", "filters", "analyticsWidgets", "relatedNews"];

  return (
    <div className="page intelligence-page">
      <div className="section-heading">
        <p className="eyebrow">{t(eyebrow)}</p>
        <h1>{title ? t(title) : titleFromSlug(slug)}</h1>
        <p>{t("markets:moduleWorkspaceCopy")}</p>
      </div>
      <div className="asset-grid compact">
        {features.map((feature) => (
          <div key={feature} className="asset-card">
            <span className="eyebrow">{t("markets:feature")}</span>
            <h3>{t(`markets:moduleFeatures.${feature}`)}</h3>
            <p>{t("markets:moduleFeatureReady")}</p>
            <strong>{t("markets:planned")}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

const RegionsPage = () => {
  const { t } = useI18n();
  const { regionId } = useParams();
  const region = marketRegions.find((item) => item.id.toLowerCase() === regionId?.toLowerCase());

  if (region) {
    return (
      <div className="page intelligence-page">
        <section className="coverage-hero">
          <div>
            <p className="eyebrow">{t("markets:marketRegion")}</p>
            <h1>{translateStatic(t, region.nameKey, region.name)}</h1>
            <p>{region.summary}</p>
          </div>
          <div className="metric-strip">
            <MetricTile label={t("markets:gdpGrowthShort")} value={`${region.gdpGrowth.toFixed(1)}%`} tone="positive" />
            <MetricTile label={t("markets:inflation")} value={`${region.inflation.toFixed(1)}%`} />
            <MetricTile label={t("common:regionspagenew.h4")} value={String(region.countries.length)} />
          </div>
        </section>

        <section className="detail-grid">
          <div className="detail-panel wide">
            <p className="eyebrow">{t("markets:majorExchanges")}</p>
            <ChipList items={region.majorExchanges} toPrefix="/stocks/" />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">{t("markets:currencyCount")}</p>
            <ChipList items={region.currencies} toPrefix="/currencies/" />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">{t("markets:keyIndices")}</p>
            <ChipList items={region.keyIndices} />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">{t("markets:economicCalendar")}</p>
            <ChipList items={region.calendarFocus} />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">{t("markets:sectorLeaders")}</p>
            <ChipList items={region.sectorLeaders} />
          </div>
          <div className="detail-panel wide">
            <p className="eyebrow">{t("markets:commodityImpact")}</p>
            <p>{region.commodityImpact}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page intelligence-page">
      <div className="section-heading">
        <p className="eyebrow">{t("markets:regionsTitle")}</p>
        <h1>{t("markets:regionsHeading")}</h1>
        <p>{t("markets:regionsIntro")}</p>
      </div>
      <div className="market-map-grid">
        {marketRegions.map((item) => (
          <AssetCard
            key={item.id}
            to={`/regions/${item.id}`}
            eyebrow={item.group}
            title={translateStatic(t, item.nameKey, item.name)}
            meta={`${item.countries.join(", ")} / ${item.currencies.join(", ")}`}
            metric={`${item.gdpGrowth.toFixed(1)}% GDP / ${item.inflation.toFixed(1)}% CPI`}
          />
        ))}
      </div>
    </div>
  );
};

const SectorsPage = () => {
  const { t } = useI18n();
  const { sectorId } = useParams();
  const sector = stockSectors.find((item) => item.id.toLowerCase() === sectorId?.toLowerCase());

  if (sector) {
    return (
      <div className="page intelligence-page">
        <section className="coverage-hero">
          <div>
            <p className="eyebrow">{t("markets:stockSector")}</p>
            <h1>{translateStatic(t, sector.nameKey, sector.name)}</h1>
            <p>{sector.summary}</p>
          </div>
          <div className="metric-strip">
            <MetricTile label={t("crypto:category")} value={sector.category} />
            <MetricTile label={t("common:sectorspagenew.h23")} value={sector.peRatio.toFixed(1)} />
            <MetricTile label="YTD" value={formatSignedPercent(sector.performanceYtd)} tone={sector.performanceYtd >= 0 ? "positive" : "negative"} />
          </div>
        </section>

        <section className="detail-grid">
          <div className="detail-panel wide">
            <p className="eyebrow">{t("common:sectorspagenew.h17")}</p>
            <ChipList items={sector.topCompanies} />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">{t("nav:etfs")}</p>
            <ChipList items={sector.etfs} />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">{t("markets:trendingStocks")}</p>
            <ChipList items={sector.trendingStocks} />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">{t("markets:dividendLeaders")}</p>
            <ChipList items={sector.dividendLeaders} />
          </div>
          <div className="detail-panel">
            <p className="eyebrow">{t("markets:relatedRegions")}</p>
            <ChipList items={sector.relatedRegions} toPrefix="/regions/" />
          </div>
          <div className="detail-panel wide">
            <p className="eyebrow">{t("markets:newsThemes")}</p>
            <ChipList items={sector.newsThemes} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page intelligence-page">
      <div className="section-heading">
        <p className="eyebrow">{t("markets:sectorsTitle")}</p>
        <h1>{t("markets:sectorsHeading")}</h1>
        <p>{t("markets:sectorsIntro")}</p>
      </div>
      <div className="asset-grid compact">
        {stockSectors.map((item) => (
          <AssetCard
            key={item.id}
            to={`/sectors/${item.id}`}
            eyebrow={item.category}
            title={translateStatic(t, item.nameKey, item.name)}
            meta={`${item.topCompanies.slice(0, 3).join(", ")} / ${item.etfs.join(", ")}`}
            metric={`${formatSignedPercent(item.performanceYtd)} YTD / ${item.peRatio.toFixed(1)} PE`}
          />
        ))}
      </div>
    </div>
  );
};




const COMMODITY_CATEGORIES = [
  {
    id: "energy",
    labelKey: "nav:energy",
    descKey: "pages:category.commoditiesEnergy.description",
    path: "/commodities/energy",
    icon: <HiBolt size={28} />,
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    id: "metals",
    labelKey: "nav:metals",
    descKey: "pages:category.commoditiesMetals.description",
    path: "/commodities/metals",
    icon: <HiCube size={28} />,
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    id: "agriculture",
    labelKey: "nav:agriculture",
    descKey: "pages:category.commoditiesAgriculture.description",
    path: "/commodities/agriculture",
    icon: <HiSun size={28} />,
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    id: "industrial",
    labelKey: "nav:industrial",
    descKey: "pages:category.commoditiesIndustrial.description",
    path: "/commodities/industrial",
    icon: <HiWrench size={28} />,
    color: "#0ea5e9",
    bg: "#f0f9ff",
  },
];

const CommoditiesPage = () => {
  const { t } = useI18n();
  const { commodityId } = useParams();
  const commodity = commodities.find(
    (item) => item.id.toLowerCase() === commodityId?.toLowerCase() || item.symbol.toLowerCase() === commodityId?.toLowerCase()
  );

  if (commodity) {
    return (
      <div className="page intelligence-page">
        <section className="coverage-hero">
          <div>
            <p className="eyebrow">{t("markets:commodity")}</p>
            <h1>{translateStatic(t, commodity.nameKey, commodity.name)}</h1>
            <p>{commodity.economicImpact}</p>
          </div>
          <div className="metric-strip">
            <MetricTile label={t("markets:spotAndFutures")} value={`${formatMoney(commodity.spotPrice)} / ${commodity.unit}`} />
            <MetricTile label={t("common:watchlistpage.h18")} value={formatSignedPercent(commodity.changePercent24h)} tone={commodity.changePercent24h >= 0 ? "positive" : "negative"} />
            <MetricTile label={t("common:premarketpage.h3")} value={commodity.futuresContract} />
          </div>
        </section>

        <section className="detail-grid">
          <div className="detail-panel">
            <p className="eyebrow">{t("crypto:category")}</p>
            <strong>{commodity.category}</strong>
          </div>
          <div className="detail-panel">
            <p className="eyebrow">{t("markets:supplyRegions")}</p>
            <ChipList items={commodity.supplyRegions} />
          </div>
          <div className="detail-panel wide">
            <p className="eyebrow">{t("markets:demandTrends")}</p>
            <ChipList items={commodity.demandTrends} />
          </div>
          <div className="detail-panel wide">
            <p className="eyebrow">{t("markets:currencyCorrelation")}</p>
            <p>{commodity.currencyCorrelation}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <SubMenuNav
        title={t("common:watchlistpage.h12")}
        titleKey="common:watchlistpage.h12"
        items={[
          { label: "All Commodities", labelKey: "common:watchlistpage.h12", path: "/commodities" },
          { label: "Energy", labelKey: "nav:energy", path: "/commodities/energy" },
          { label: "Metals", labelKey: "nav:metals", path: "/commodities/metals" },
          { label: "Agriculture", labelKey: "nav:agriculture", path: "/commodities/agriculture" },
          { label: "Industrial", labelKey: "nav:industrial", path: "/commodities/industrial" },
        ]}
      />
      <div className="page intelligence-page">
        <div className="section-heading">
          <p className="eyebrow">{t("common:watchlistpage.h12")}</p>
          <h1>{t("markets:commoditiesHeading")}</h1>
          <p>{t("markets:commoditiesIntro")}</p>
        </div>

        <div className="commodity-categories-grid">
          {COMMODITY_CATEGORIES.map((cat) => {
            const count = commodities.filter(
              (c) => c.category.toLowerCase() === cat.id
            ).length;
            return (
              <Link key={cat.id} to={cat.path} className="commodity-category-card">
                <div
                  className="commodity-category-icon"
                  style={{ color: cat.color, background: cat.bg }}
                >
                  {cat.icon}
                </div>
                <div className="commodity-category-info">
                  <strong>{t(cat.labelKey)}</strong>
                  <span>{t(cat.descKey)}</span>
                  <span className="commodity-category-count">{count} {t("common:categorypage.h3")}</span>
                </div>
                <HiSparkles size={14} className="commodity-category-arrow" style={{ color: cat.color }} />
              </Link>
            );
          })}
        </div>

        <div className="asset-grid compact">
          {commodities.map((item) => (
            <AssetCard
              key={item.id}
              to={`/commodities/${item.id}`}
              eyebrow={item.category}
              title={`${translateStatic(t, item.nameKey, item.name)} (${item.symbol})`}
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
              <strong>{t("dashboard:userPanelTitle")}</strong>
              <p>{t("dashboard:userPanelIntro")}</p>
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
          <h1>{t("auth:loginTitle")}, {displayName.split(" ")[0]}</h1>
          <p>{t("dashboard:userPanelIntro")}</p>
        </div>
        <div className="user-profile-card">
          <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
          <div>
            {editing ? (
              <div>
                <input value={name} onChange={(e) => setName(e.target.value)} />
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
                <div style={{ marginTop: 8 }}>
                  <button onClick={saveProfile} className="primary-action">{t("common:save")}</button>
                  <button onClick={() => setEditing(false)} className="secondary-action">{t("common:cancel")}</button>
                </div>
              </div>
            ) : (
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => setEditing(true)} className="secondary-action">{t("common:portfoliopage.h26")}</button>
                  <button onClick={logout} className="link-button">{t("logout")}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="user-stat-grid">
        {[
          { label: t("dashboard:watchlist"), value: String(userWatchlist.length), meta: t("dashboard:savedMarkets"), highlight: true },
          { label: t("nav:alerts"), value: String(userAlerts.length), meta: t("dashboard:alertCenter") },
          { label: t("dashboard:baseCurrencyPreference"), value: "USD", meta: t("dashboard:defaultMarket") },
          { label: t("dashboard:riskProfile"), value: t("dashboard:moderate"), meta: t("dashboard:preferences") },
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
                <h2>{t("common:portfoliopage.h31")}</h2>
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
                <p className="eyebrow">{t("markets:marketBrief")}</p>
                <h2>{t("dashboard:title")}</h2>
              </div>
              <span className="user-live-pill">{t("common:live")}</span>
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
            <div><span>{t("defaultMarket")}</span><strong>{t("common:categorypage.h7")}</strong></div>
            <div><span>{t("notificationMode")}</span><strong>{t("common:layout.h10")}</strong></div>
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
  const { t } = useI18n();
  return (
    <div className="page">
      <div className="section-heading" role="alert">
        <p className="eyebrow">404</p>
        <h1>{t("common:categorypage.h0")}</h1>
        <p>{t("common:categorypage.h2")}</p>
        <Link to="/" className="primary-action" style={{ marginTop: "1rem" }}>{t("common:back")} {t("nav:dashboard")}</Link>
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
            <Route path="stocks/gainers" element={<PublicModulePage slug="stocks/gainers" eyebrow="nav:stocks" title="markets:topGainers" />} />
            <Route path="stocks/losers" element={<PublicModulePage slug="stocks/losers" eyebrow="nav:stocks" title="markets:topLosers" />} />
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
