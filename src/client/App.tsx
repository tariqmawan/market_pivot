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

const HomePage = () => (
  <div className="page market-home">
    <section className="terminal-hero">
      <div>
        <p className="eyebrow">Global multi-asset markets</p>
        <h1>MarketsPivot</h1>
        <p>
          Bloomberg-style coverage across equities, fixed income context, FX, commodities, derivatives,
          and crypto-ready market views.
        </p>
      </div>
      <div className="hero-tape">
        <span>NYSE +0.8%</span>
        <span>USD/JPY 155.00</span>
        <span>BTC +2.2%</span>
        <span>Gold Watch</span>
      </div>
    </section>

    <section className="dashboard-grid">
      <AssetCard to="/stocks" eyebrow="Equities" title={`${exchanges.length} stock exchanges`} meta="Global exchange dashboards" metric={formatMoney(exchanges.reduce((sum, item) => sum + item.marketCap, 0))} />
      <AssetCard to="/currencies" eyebrow="FX" title={`${currencies.length} currencies`} meta="Reserve, trade, and emerging FX" metric="USD base strategy" />
      <AssetCard to="/crypto" eyebrow="Crypto" title={`${cryptocurrencies.length} cryptocurrencies`} meta="Leaders, stablecoins, DeFi, payments" metric="24/7 market layer" />
    </section>
  </div>
);

const StocksPage = () => {
  const { exchangeId } = useParams();
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
        <p className="eyebrow">Equities</p>
        <h1>Top Global Stock Exchanges</h1>
        <p>Regional coverage with currency, timezone, trading hours, listings, main index, and market cap context.</p>
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
  const currency = currencies.find((item) => item.code.toLowerCase() === code?.toLowerCase());

  if (currency) {
    return <CurrencyDetail currency={currency} exchangeRates={getCurrencyRates(currency.code)} popularPairs={getPopularPairs(currency.code)} />;
  }

  return (
    <div className="page">
      <div className="section-heading">
        <p className="eyebrow">FX</p>
        <h1>Top 20 Global Currencies</h1>
        <p>Major reserves, Asia-Pacific trade currencies, Americas, Europe, Middle East, and Africa coverage.</p>
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
        <p className="eyebrow">Crypto</p>
        <h1>Top 20 Cryptocurrencies</h1>
        <p>Core leaders, smart-contract platforms, stablecoins, infrastructure, DeFi, payments, and growth assets.</p>
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

const DashboardPage = () => (
  <div className="page">
    <div className="section-heading">
      <p className="eyebrow">Cross-market view</p>
      <h1>Global Dashboard</h1>
      <p>Stocks, FX, and crypto in one workspace, ready for future live data, news, charts, and comparison modules.</p>
    </div>
    <section className="dashboard-grid">
      <AssetCard to="/stocks/NYSE" eyebrow="Top exchange" title="New York Stock Exchange" meta="S&P 500 / USD / New York" metric={formatMoney(exchanges[0].marketCap)} />
      <AssetCard to="/currencies/USD" eyebrow="Core reserve" title="United States Dollar" meta="Federal Reserve / global base" metric="Primary conversion base" />
      <AssetCard to="/crypto/bitcoin" eyebrow="Crypto leader" title="Bitcoin" meta="BTC vs USD, FX, and equity risk" metric={formatMoney(getCryptoPrice(cryptocurrencies[0], 0).marketCap)} />
    </section>
  </div>
);

const App: React.FC = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stocks" element={<StocksPage />} />
        <Route path="/stocks/:exchangeId" element={<StocksPage />} />
        <Route path="/currencies" element={<CurrenciesPage />} />
        <Route path="/currencies/:code" element={<CurrenciesPage />} />
        <Route path="/crypto" element={<CryptoPage />} />
        <Route path="/crypto/:cryptoId" element={<CryptoPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
