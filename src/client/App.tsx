import React from "react";
import { BrowserRouter as Router, Link, Route, Routes, useParams } from "react-router-dom";
import commoditiesData from "../data/commodities.json";
import exchangesData from "../data/exchanges.json";
import currenciesData from "../data/currencies.json";
import cryptoData from "../data/cryptocurrencies.json";
import regionsData from "../data/regions.json";
import sectorsData from "../data/sectors.json";
import Pricing from "./pages/Pricing";
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
import CurrencyDetail from "./components/CurrencyDetail";
import ExchangeDetail from "./components/ExchangeDetail";
import Layout from "./components/Layout";
import { I18nProvider, useI18n } from "./i18n";
import { useAuthStore } from "./stores/authStore";
import "./styles/index.css";
import AdminPanel from "./pages/AdminPanel";
import NewsPage from "./pages/News";
import ArticlePage from "./pages/Article";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AboutMarketsPivot from "./pages/AboutMarketsPivot";

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

const StocksPage = () => {
  const { exchangeId } = useParams();
  const { t } = useI18n();
  const exchange = exchanges.find((item) => item.id.toLowerCase() === exchangeId?.toLowerCase());

  if (exchange) {
    return (
      <ExchangeDetail
        exchange={exchange}
        indexData={buildIndexSnapshot(exchange)}
        gainers={buildMovers(exchange, "up")}
        losers={buildMovers(exchange, "down")}
        mostActive={buildMovers(exchange, "active")}
      />
    );
  }

  return (
    <div className="page">
      <div className="section-heading">
        <p className="eyebrow">{t("equities")}</p>
        <h1>{t("topGlobalExchanges")}</h1>
        <p>{t("exchangeIntro")}</p>
      </div>
      <div className="asset-grid">
        {exchanges.map((item) => (
          <AssetCard
            key={item.id}
            to={`/stocks/${item.id}`}
            eyebrow={`${item.country} / ${item.currency}`}
            title={item.name}
            meta={`${item.mainIndexName} / ${item.tradingHours.open}-${item.tradingHours.close}`}
            metric={formatMoney(item.marketCap)}
          />
        ))}
      </div>
    </div>
  );
};

const CurrenciesPage = () => {
  const { code } = useParams();
  const { t } = useI18n();
  const currency = currencies.find((item) => item.code.toLowerCase() === code?.toLowerCase());

  if (currency) {
    return <CurrencyDetail currency={currency} exchangeRates={getCurrencyRates(currency.code)} popularPairs={getPopularPairs(currency.code)} />;
  }

  return (
    <div className="page">
      <div className="section-heading">
        <p className="eyebrow">{t("fx")}</p>
        <h1>{t("topCurrencies")}</h1>
        <p>{t("currencyIntro")}</p>
      </div>
      <div className="asset-grid compact">
        {currencies.map((item) => (
          <AssetCard
            key={item.code}
            to={`/currencies/${item.code}`}
            eyebrow={item.region}
            title={`${item.code} - ${item.name}`}
            meta={`${item.country} / ${item.centralBank}`}
            metric={`1 USD = ${majorRates[item.code].toFixed(item.code === "JPY" || item.code === "KRW" ? 0 : 2)} ${item.code}`}
          />
        ))}
      </div>
    </div>
  );
};

const CryptoPage = () => {
  const { cryptoId } = useParams();
  const { t } = useI18n();
  const crypto = cryptocurrencies.find(
    (item) => item.id.toLowerCase() === cryptoId?.toLowerCase() || item.symbol.toLowerCase() === cryptoId?.toLowerCase()
  );

  if (crypto) {
    const index = cryptocurrencies.findIndex((item) => item.id === crypto.id);
    return <CryptoDetail crypto={crypto} priceData={getCryptoPrice(crypto, index)} tradingPairs={getTradingPairs(crypto)} />;
  }

  return (
    <div className="page">
      <div className="section-heading">
        <p className="eyebrow">{t("crypto")}</p>
        <h1>{t("topCryptos")}</h1>
        <p>{t("cryptoIntro")}</p>
      </div>
      <div className="asset-grid compact">
        {cryptocurrencies.map((item, index) => {
          const price = getCryptoPrice(item, index);
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
  );
};

const DashboardPage = () => {
  const { t } = useI18n();
  const leadingRegion = marketRegions[2];
  const leadingSector = stockSectors[0];
  const leadingCommodity = commodities[0];

  return (
    <div className="page">
      <div className="section-heading">
        <p className="eyebrow">{t("crossMarket")}</p>
        <h1>{t("dashboardTitle")}</h1>
        <p>{t("dashboardIntro")}</p>
      </div>
      <section className="dashboard-grid">
        <AssetCard to="/stocks/NYSE" eyebrow={t("topExchange")} title="New York Stock Exchange" meta="S&P 500 / USD / New York" metric={formatMoney(exchanges[0].marketCap)} />
        <AssetCard to="/currencies/USD" eyebrow={t("coreReserve")} title="United States Dollar" meta="Federal Reserve / global base" metric={t("primaryBase")} />
        <AssetCard to="/crypto/bitcoin" eyebrow={t("cryptoLeader")} title="Bitcoin" meta="BTC vs USD, FX, and equity risk" metric={formatMoney(getCryptoPrice(cryptocurrencies[0], 0).marketCap)} />
        <AssetCard to={`/regions/${leadingRegion.id}`} eyebrow="Region pulse" title={leadingRegion.name} meta={leadingRegion.newsThemes.join(" / ")} metric={`${leadingRegion.gdpGrowth.toFixed(1)}% GDP growth`} />
        <AssetCard to={`/sectors/${leadingSector.id}`} eyebrow="Sector pulse" title={leadingSector.name} meta={leadingSector.newsThemes.join(" / ")} metric={`${formatSignedPercent(leadingSector.performanceYtd)} YTD`} />
        <AssetCard to={`/commodities/${leadingCommodity.id}`} eyebrow="Commodity pulse" title={leadingCommodity.name} meta={leadingCommodity.economicImpact} metric={`${formatMoney(leadingCommodity.spotPrice)} / ${leadingCommodity.unit}`} />
      </section>
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
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(user?.name ?? "");
  const [email, setEmail] = React.useState(user?.email ?? "");

  React.useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  const saveProfile = () => {
    updateUser({ name, email });
    setEditing(false);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="page user-panel-page">
        <div className="section-heading">
          <p className="eyebrow">{t("userPanel")}</p>
          <h1>{t("userPanelTitle")}</h1>
          <p>{t("userPanelIntro")}</p>
        </div>
        <div className="centered">
          <p>{t("loginTitle")}</p>
          <button onClick={() => window.scrollTo(0, 0)} className="primary-action">
            {t("login")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page user-panel-page">
      <section className="user-hero">
        <div>
          <p className="eyebrow">{t("userPanel")}</p>
          <h1>{t("userPanelTitle")}</h1>
          <p>{t("userPanelIntro")}</p>
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

      <section className="user-panel-layout">
        <div className="user-main-column">
          <div className="user-section-header">
            <div>
              <p className="eyebrow">{t("watchlist")}</p>
              <h2>{t("savedMarkets")}</h2>
            </div>
            <Link to="/stocks" className="secondary-action">{t("addWatchlist")}</Link>
          </div>

          <div className="watchlist-table">
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

          <div className="allocation-card">
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

          <div className="alert-card">
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

const App: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <I18nProvider>
      <Router>
        <Layout>
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/index.html" element={<HomePage />} />
          <Route path="/stocks" element={<StocksPage />} />
          <Route path="/stocks/:exchangeId" element={<StocksPage />} />
          <Route path="/currencies" element={<CurrenciesPage />} />
          <Route path="/currencies/:code" element={<CurrenciesPage />} />
          <Route path="/crypto" element={<CryptoPage />} />
          <Route path="/crypto/:cryptoId" element={<CryptoPage />} />
          <Route path="/regions" element={<RegionsPage />} />
          <Route path="/regions/:regionId" element={<RegionsPage />} />
          <Route path="/sectors" element={<SectorsPage />} />
          <Route path="/sectors/:sectorId" element={<SectorsPage />} />
          <Route path="/commodities" element={<CommoditiesPage />} />
          <Route path="/commodities/:commodityId" element={<CommoditiesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<ArticlePage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/about" element={<AboutMarketsPivot />} />

          <Route
            path="/admin"
            element={
              isAuthenticated && user?.isAdmin ? (
                <AdminPanel />
              ) : !isAuthenticated ? (
                <div className="page">
                  <div className="section-heading">
                    <h1>Sign in required</h1>
                    <p>Please sign in as an administrator to access this page.</p>
                  </div>
                </div>
              ) : (
                <div className="page">
                  <div className="section-heading">
                    <h1>403 — Forbidden</h1>
                    <p>Admin access required.</p>
                  </div>
                </div>
              )
            }
          />
          <Route path="/user" element={<UserPanelPage />} />
          </Routes>
        </Layout>
      </Router>
    </I18nProvider>
  );
};

export default App;
