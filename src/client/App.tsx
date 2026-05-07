import React from "react";
import { BrowserRouter as Router, Link, Route, Routes, useParams } from "react-router-dom";
import exchangesData from "../data/exchanges.json";
import currenciesData from "../data/currencies.json";
import cryptoData from "../data/cryptocurrencies.json";
import type {
  CryptoPrice,
  Cryptocurrency,
  Currency,
  CurrencyPair,
  IndexSnapshot,
  MarketMover,
  StockExchange,
  TradingPair,
} from "../types";
import CryptoDetail from "./components/CryptoDetail";
import CurrencyDetail from "./components/CurrencyDetail";
import ExchangeDetail from "./components/ExchangeDetail";
import Layout from "./components/Layout";
import { I18nProvider, useI18n } from "./i18n";
import "./styles/index.css";

const exchanges = exchangesData.exchanges as StockExchange[];
const currencies = currenciesData.currencies as Currency[];
const cryptocurrencies = cryptoData.cryptocurrencies as Cryptocurrency[];

const formatMoney = (value: number) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  return `$${value.toLocaleString()}`;
};

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
  { key: "bonds", count: 12, metaKey: "fixedIncomeMeta", to: "/dashboard" },
  { key: "fx", count: currencies.length, metaKey: "fxMeta", to: "/currencies" },
  { key: "commodities", count: 18, metaKey: "commoditiesMeta", to: "/dashboard" },
  { key: "derivatives", count: 9, metaKey: "derivativesMeta", to: "/dashboard" },
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
      </section>
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

  return (
    <div className="page user-panel-page">
      <section className="user-hero">
        <div>
          <p className="eyebrow">{t("userPanel")}</p>
          <h1>{t("userPanelTitle")}</h1>
          <p>{t("userPanelIntro")}</p>
        </div>
        <div className="user-profile-card">
          <span className="avatar">AM</span>
          <div>
            <strong>Amit Market Desk</strong>
            <p>Premium trial / USD base / Asia focus</p>
          </div>
        </div>
      </section>

      <section className="user-stat-grid">
        <div className="user-stat-card highlight">
          <span>{t("portfolioValue")}</span>
          <strong>$128,420</strong>
          <em className="positive">+1.84%</em>
        </div>
        <div className="user-stat-card">
          <span>{t("watchlist")}</span>
          <strong>18</strong>
          <em>{t("marketsFollowed")}</em>
        </div>
        <div className="user-stat-card">
          <span>{t("activeAlerts")}</span>
          <strong>7</strong>
          <em>{t("enabled")}</em>
        </div>
        <div className="user-stat-card">
          <span>{t("todayPnl")}</span>
          <strong>$2,318</strong>
          <em className="positive">+0.94%</em>
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

const App: React.FC = () => (
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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/user" element={<UserPanelPage />} />
        </Routes>
      </Layout>
    </Router>
  </I18nProvider>
);

export default App;
