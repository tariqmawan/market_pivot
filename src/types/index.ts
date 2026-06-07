// Exchange Types
export interface TradingHours {
  open: string;
  close: string;
  timezone: string;
}

export interface StockExchange {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  timezone: string;
  currency: string;
  tradingHours: TradingHours;
  mainIndex: string;
  mainIndexName: string;
  description: string;
  founded: number;
  website: string;
  logo: string;
  marketCap: number;
  listedCompanies: number;
  avgDailyVolume: number;
  /** Translation key for the exchange display name. e.g. "markets.exchanges.nyse.name". */
  nameKey?: string;
  /** Translation key for the country label. e.g. "markets.countries.us". */
  countryKey?: string;
  /** Translation key for the timezone label. e.g. "markets.timezones.americaNewYork". */
  timezoneKey?: string;
  /** Translation key for static exchange description. e.g. "markets.exchanges.nyse.description". */
  descriptionKey?: string;
}

// Market Summary Types
export interface IndexSnapshot {
  id: string;
  exchangeId: string;
  symbol: string;
  name: string;
  value: number;
  previousClose: number;
  change: number;
  percentChange: number;
  timestamp: Date;
  volume: number;
  advancers: number;
  decliners: number;
}

export interface MarketMover {
  symbol: string;
  company: string;
  price: number;
  change: number;
  percentChange: number;
  volume: number;
  marketCap?: number;
  signals?: any;
}

// Sector Data
export interface SectorPerformance {
  name: string;
  symbols: string[];
  performance: number;
  companies: number;
  marketCap: number;
}

export interface MarketRegion {
  id: string;
  name: string;
  group: "Americas" | "Europe" | "Asia-Pacific" | "Middle East & Africa";
  summary: string;
  countries: string[];
  majorExchanges: string[];
  currencies: string[];
  keyIndices: string[];
  gdpGrowth: number;
  inflation: number;
  commodityImpact: string;
  calendarFocus: string[];
  sectorLeaders: string[];
  newsThemes: string[];
  /** Translation key for the region display name. e.g. "markets.regions.americas.name". */
  nameKey?: string;
}

export interface StockSector {
  id: string;
  name: string;
  category: "Growth" | "Cyclical" | "Defensive" | "Thematic" | "Income";
  summary: string;
  topCompanies: string[];
  etfs: string[];
  peRatio: number;
  performanceYtd: number;
  trendingStocks: string[];
  dividendLeaders: string[];
  relatedRegions: string[];
  newsThemes: string[];
  /** Translation key for the sector display name. e.g. "markets.sectors.technology.name". */
  nameKey?: string;
}

export interface Commodity {
  id: string;
  name: string;
  symbol: string;
  category: "Energy" | "Metals" | "Agriculture" | "Industrial";
  unit: string;
  spotPrice: number;
  changePercent24h: number;
  futuresContract: string;
  supplyRegions: string[];
  demandTrends: string[];
  currencyCorrelation: string;
  economicImpact: string;
  /** Translation key for the commodity display name. e.g. "markets.commodities.crudeOil.name". */
  nameKey?: string;
}

// Currency Types
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  country: string;
  countryCode: string;
  region: string;
  type: "fiat" | "commodity" | "crypto";
  centralBank: string;
  description: string;
  logo: string;
  /** Translation key for the currency display name. e.g. "forex.currencies.usd.name". */
  nameKey?: string;
  /** Translation key for the country label. e.g. "forex.countries.us". */
  countryKey?: string;
  /** Translation key for static currency description. e.g. "forex.currencies.usd.description". */
  descriptionKey?: string;
}

export interface ExchangeRate {
  fromCode: string;
  toCode: string;
  rate: number;
  timestamp: Date;
  bid?: number;
  ask?: number;
  spread?: number;
}

export interface CurrencyPair {
  pair: string; // e.g., "USD/EUR"
  rate: number;
  change24h: number;
  high52w: number;
  low52w: number;
  volatility?: number;
}

// Cryptocurrency Types
export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  category:
    | "Layer 1"
    | "Layer 2"
    | "DeFi"
    | "Stablecoin"
    | "Infrastructure"
    | "Payments"
    | "Meme"
    | "Emerging/Growth";
  description: string;
  launched: number;
  founder: string;
  maxSupply: number | null;
  circulatingSupply: number;
  consensusMechanism: string;
  blockTime: number | null;
  logo: string;
  /** Translation key for the crypto display name. e.g. "crypto.cryptocurrencies.bitcoin.name". */
  nameKey?: string;
  /** Translation key for the category label. e.g. "crypto.categories.layer1". */
  categoryKey?: string;
  /** Translation key for static crypto description. e.g. "crypto.cryptocurrencies.bitcoin.description". */
  descriptionKey?: string;
}

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  changePercent24h: number;
  ath: number;
  atl: number;
  circulatingSupply: number;
  rank: number;
  timestamp: Date;
}

export interface TradingPair {
  pair: string; // e.g., "BTC/USD"
  baseAsset: string;
  quoteAsset: string;
  price: number;
  volume24h: number;
  exchange: string;
}

// News Types
export interface MarketNews {
  id: string;
  title: string;
  description: string;
  content: string;
  source: string;
  imageUrl?: string;
  url: string;
  publishedAt: Date;
  category: "market" | "company" | "economic" | "regulatory";
  relevantAssets: string[]; // Exchange IDs, Currency codes, or Crypto symbols
}

// Chart Data
export interface ChartDataPoint {
  timestamp: Date;
  value: number;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
  close?: number;
}

export interface ChartData {
  assetId: string;
  assetType: "exchange" | "currency" | "crypto" | "region" | "sector" | "commodity";
  timeframe: "1H" | "24H" | "7D" | "1M" | "1Y" | "ALL";
  data: ChartDataPoint[];
}

// Dashboard Types
export interface DashboardWidget {
  id: string;
  type: string;
  position: number;
  config: Record<string, any>;
}

export interface UserPreferences {
  baseCurrency: string;
  favoriteExchanges: string[];
  favoriteCryptocurrencies: string[];
  favoriteCurrencies: string[];
  theme: "light" | "dark";
  layout: "grid" | "list";
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  timestamp: Date;
}
