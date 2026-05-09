/**
 * Enhanced API Routes for Global Markets Intelligence Platform
 * 
 * These routes expose the comprehensive six-pillar architecture
 * supporting 100+ investable asset classes
 */

// ============================================================================
// 1. EXCHANGES - 30+ Global Stock Exchanges
// ============================================================================

// GET /api/exchanges
// Returns all exchanges with market cap, trading hours, indices
// Optional query: region, country, timezone

// GET /api/exchanges/:id
// Returns single exchange with:
// - Top gainers/losers
// - Economic snapshot (GDP, inflation, unemployment)
// - Sector breakdown
// - Live indices

// GET /api/exchanges/region/:regionId
// Returns exchanges grouped by geographic region
// e.g., /api/exchanges/region/americas

// GET /api/exchanges/:id/top-gainers
// Returns top gaining stocks on an exchange

// GET /api/exchanges/:id/top-losers
// Returns top losing stocks on an exchange

// GET /api/exchanges/:id/sector-breakdown
// Returns percentage allocation by sector

// ============================================================================
// 2. CURRENCIES - 20+ Global Currencies
// ============================================================================

// GET /api/currencies
// Returns all currencies with:
// - Central bank and interest rates
// - Inflation and economic indicators
// - Forex pairs
// - Strength index
// - Trade balance

// GET /api/currencies/:code
// Single currency with full economic profile

// GET /api/currencies/pairs
// Returns major forex pairs (EURUSD, GBPUSD, USDJPY, etc.)

// GET /api/currencies/:code/economic-indicators
// Returns detailed economic data:
// - Interest rate
// - Inflation rate
// - GDP growth
// - Trade balance
// - Unemployment

// GET /api/currencies/:code/strength
// Returns currency strength index vs basket

// ============================================================================
// 3. CRYPTOCURRENCIES - 20 Cryptocurrencies
// ============================================================================

// GET /api/crypto
// Returns all cryptocurrencies with market cap, volume, price

// GET /api/crypto/layer1
// Layer 1 blockchains

// GET /api/crypto/stablecoins
// Stablecoins (USDT, USDC, DAI)

// GET /api/crypto/defi
// DeFi protocols and tokens

// GET /api/crypto/:symbol
// Single crypto with full details

// ============================================================================
// 4. REGIONS - 4 Macro Regions + Sub-Regions
// ============================================================================

// GET /api/regions
// Returns all 4 macro regions with sub-regions

// GET /api/regions/:id
// Single region with:
// - Countries and sub-regions
// - Major exchanges
// - Currencies
// - Key indices
// - Economic data (GDP growth, inflation)
// - Commodity impact
// - Regional news
// - Sector leaders

// GET /api/regions/:id/exchanges
// Exchanges in a specific region

// GET /api/regions/:id/economic-calendar
// Economic events for region

// GET /api/regions/:id/sector-leaders
// Top performing sectors in region

// Supported region IDs:
// - americas (+ sub: north-america, latin-america)
// - europe (+ sub: uk-switzerland, eurozone, nordic)
// - asia-pacific (+ sub: north-asia, south-asia, southeast-asia, oceania)
// - middle-east-africa (+ sub: gulf, africa)

// ============================================================================
// 5. SECTORS - 11 Sectors + Thematic Themes
// ============================================================================

// GET /api/sectors
// Returns all 11 sectors with market data

// GET /api/sectors/:id
// Single sector with:
// - Market cap and PE ratio
// - Performance (YTD, 52-week)
// - Dividend yield
// - Top companies
// - ETF listings
// - Top gainers/losers
// - Related regions
// - News themes
// - Volatility profile

// GET /api/sectors/:id/top-companies
// Top companies in sector by market cap

// GET /api/sectors/:id/etfs
// ETFs that track this sector

// GET /api/sectors/:id/performance
// Historical performance data

// Sector IDs:
// - technology, banking, ai, energy, healthcare, mining
// - semiconductor, real-estate, electric-vehicles, defence, retail

// ============================================================================
// 6. COMMODITIES - 17 Commodities (4 Categories)
// ============================================================================

// GET /api/commodities
// Returns all commodities with prices

// GET /api/commodities/:id
// Single commodity with:
// - Spot price and futures contract
// - Supply regions and major producers
// - Demand trends
// - Currency correlations
// - Economic impact
// - Supply chain risks
// - Demand drivers
// - 52-week performance

// GET /api/commodities/category/:category
// Commodities by category:
// - energy (oil, gas, LNG)
// - metals (gold, silver, copper, platinum, rare-earths)
// - agriculture (wheat, corn, soybeans, coffee, sugar)
// - industrial (lithium, uranium, steel)

// GET /api/commodities/:id/price-history
// Historical price data for charting

// GET /api/commodities/:id/supply-analysis
// Supply region breakdown and major producers

// ============================================================================
// COMPOSITE & INTELLIGENCE ENDPOINTS
// ============================================================================

// GET /api/markets/global-snapshot
// Global market overview across all asset classes

// GET /api/regions/:id/complete-analysis
// Complete region analysis with all interconnected data:
// - Regional indices performance
// - Currency performance
// - Commodity impact
// - Sector leaders
// - Economic calendar
// - News feed

// GET /api/intelligence/region-vs-global
// Compare a region's performance to global

// GET /api/intelligence/sector-by-region
// Sector performance broken down by region

// GET /api/intelligence/commodity-impact/:commodityId
// Which regions/sectors are most affected by this commodity

// ============================================================================
// SEARCH & DISCOVERY ENDPOINTS
// ============================================================================

// GET /api/search
// Query: q, type (exchange|currency|crypto|region|sector|commodity)
// Universal search across all asset classes

// GET /api/featured
// Featured markets, trending sectors, top movers

// GET /api/watchlist
// User's saved watchlist (requires auth)

// POST /api/watchlist
// Add item to watchlist

// DELETE /api/watchlist/:id
// Remove item from watchlist

// ============================================================================
// IMPLEMENTATION NOTES
// ============================================================================

/**
 * Authentication:
 * - Public endpoints: No auth required
 * - User features (watchlist, alerts): Bearer token required
 * - Premium data: Subscription check
 * 
 * Data Sources:
 * - Static data: JSON files in src/data/
 * - Live prices: Third-party APIs (Alpha Vantage, CoinGecko, Twelve Data)
 * - Economic data: Central bank APIs, trading economics
 * - News: NewsAPI, CoinDesk, sector-specific sources
 * 
 * Caching Strategy:
 * - Static metadata: Cache 24h
 * - Prices: Cache 5-15 minutes (depends on tier)
 * - Economic calendar: Cache 1 hour
 * - News: Cache 30 minutes
 * 
 * Response Format:
 * All endpoints return:
 * {
 *   data: { ... },
 *   meta: {
 *     timestamp: ISO timestamp,
 *     source: "Markets Pivot",
 *     cacheAge: seconds
 *   }
 * }
 */

export const API_ENDPOINTS = {
  // Exchanges
  exchanges: '/api/exchanges',
  exchangeDetail: '/api/exchanges/:id',
  exchangesByRegion: '/api/exchanges/region/:regionId',
  exchangeTopGainers: '/api/exchanges/:id/top-gainers',
  exchangeTopLosers: '/api/exchanges/:id/top-losers',
  exchangeSectorBreakdown: '/api/exchanges/:id/sector-breakdown',

  // Currencies
  currencies: '/api/currencies',
  currencyDetail: '/api/currencies/:code',
  currencyPairs: '/api/currencies/pairs',
  currencyEconomicIndicators: '/api/currencies/:code/economic-indicators',
  currencyStrength: '/api/currencies/:code/strength',

  // Crypto
  crypto: '/api/crypto',
  cryptoLayer1: '/api/crypto/layer1',
  cryptoStablecoins: '/api/crypto/stablecoins',
  cryptoDefi: '/api/crypto/defi',
  cryptoDetail: '/api/crypto/:symbol',

  // Regions
  regions: '/api/regions',
  regionDetail: '/api/regions/:id',
  regionExchanges: '/api/regions/:id/exchanges',
  regionEconomicCalendar: '/api/regions/:id/economic-calendar',
  regionSectorLeaders: '/api/regions/:id/sector-leaders',

  // Sectors
  sectors: '/api/sectors',
  sectorDetail: '/api/sectors/:id',
  sectorTopCompanies: '/api/sectors/:id/top-companies',
  sectorEtfs: '/api/sectors/:id/etfs',
  sectorPerformance: '/api/sectors/:id/performance',

  // Commodities
  commodities: '/api/commodities',
  commodityDetail: '/api/commodities/:id',
  commoditiesByCategory: '/api/commodities/category/:category',
  commodityPriceHistory: '/api/commodities/:id/price-history',
  commoditySupplyAnalysis: '/api/commodities/:id/supply-analysis',

  // Intelligence
  globalSnapshot: '/api/markets/global-snapshot',
  regionCompleteAnalysis: '/api/regions/:id/complete-analysis',
  regionVsGlobal: '/api/intelligence/region-vs-global',
  sectorByRegion: '/api/intelligence/sector-by-region',
  commodityImpact: '/api/intelligence/commodity-impact/:commodityId',

  // Search & Discovery
  search: '/api/search',
  featured: '/api/featured',
  watchlist: '/api/watchlist',
};
