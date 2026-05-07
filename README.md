# MarketsPivot - Bloomberg-Style Financial Market Platform

A comprehensive, Bloomberg-inspired multi-asset financial market platform built with React, TypeScript, Node.js, and Express.

## 📊 Project Overview

MarketsPivot provides real-time market data and analysis across three major asset classes:

### 🏦 Stock Exchanges (30 Global)
- **North America**: NYSE, NASDAQ
- **Europe**: LSE, Euronext, Deutsche Börse, SIX, BME, Borsa Italiana
- **Asia**: TSE, HKEX, NSE, BSE, KRX, TWSE, SGX, IDX, SET, BM
- **Emerging**: Saudi Exchange, DFM, ADX, JSE
- **Americas**: B3, BMV, BCS

### 💱 Currencies (Top 20)
USD, EUR, JPY, GBP, CHF, CNY, HKD, INR, AUD, SGD, KRW, CAD, BRL, MXN, CLP, SEK, NOK, SAR, AED, ZAR

### 🪙 Cryptocurrencies (Top 20)
Bitcoin, Ethereum, BNB, Solana, Cardano, Avalanche, Polkadot, TRON, Tether, USD Coin, Dai, Chainlink, Polygon, Uniswap, Cosmos, XRP, Litecoin, Stellar, Toncoin, Arbitrum

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Charting**: Recharts
- **HTTP Client**: Axios
- **Styling**: Custom CSS with dark/light theme support

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM/Migrations**: Knex.js
- **API Style**: RESTful

## 📁 Project Structure

```
market_pivot/
├── src/
│   ├── client/               # React frontend
│   │   ├── components/       # React components
│   │   │   ├── Layout.tsx                 # Main layout wrapper
│   │   │   ├── ExchangeDetail.tsx         # Stock exchange pages
│   │   │   ├── CurrencyDetail.tsx         # Currency pages
│   │   │   └── CryptoDetail.tsx           # Cryptocurrency pages
│   │   ├── styles/
│   │   │   └── index.css                  # Global styles
│   │   ├── App.tsx           # Main app with routing
│   │   └── main.tsx          # React entry point
│   │
│   ├── server/               # Express backend
│   │   ├── routes/           # API endpoints
│   │   │   ├── exchanges.ts               # Exchange endpoints
│   │   │   ├── currencies.ts              # Currency endpoints
│   │   │   └── cryptocurrencies.ts        # Crypto endpoints
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   │   └── 001_initial_schema.ts  # Database schema
│   │   │   └── seeds/                     # Data seeding (future)
│   │   └── index.ts          # Express app setup
│   │
│   ├── types/                # Shared TypeScript types
│   │   └── index.ts          # All type definitions
│   │
│   └── data/                 # Static data
│       ├── exchanges.json    # 30 stock exchanges
│       ├── currencies.json   # 20 currencies
│       └── cryptocurrencies.json  # 20 cryptos
│
├── Configuration Files
│   ├── package.json
│   ├── tsconfig.json              # Client TS config
│   ├── tsconfig.server.json        # Server TS config
│   ├── vite.config.ts
│   ├── .env.example
│   └── index.html
│
└── README.md (this file)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- PostgreSQL 12+

### Installation

1. **Clone and setup**
```bash
cd market_pivot
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Setup database**
```bash
npm run db:migrate
npm run db:seed
```

4. **Start development**
```bash
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## 📚 API Endpoints

### Stock Exchanges
```
GET    /api/exchanges              # Get all exchanges
GET    /api/exchanges/:id          # Get exchange details
GET    /api/exchanges/:id/summary  # Get market summary
GET    /api/exchanges/:id/chart    # Get index chart data
GET    /api/exchanges/:id/sectors  # Get sector breakdown
GET    /api/exchanges/:id/top-movers  # Get gainers/losers
GET    /api/exchanges/:id/news     # Get exchange news
```

### Currencies
```
GET    /api/currencies             # Get all currencies
GET    /api/currencies/:code       # Get currency details
GET    /api/currencies/:code/rates # Get exchange rates
GET    /api/currencies/:from/:to   # Get single rate
POST   /api/currencies/convert/amount  # Convert amounts
GET    /api/currencies/:code/chart # Get historical chart
GET    /api/currencies/:code/pairs # Get currency pairs
GET    /api/currencies/:code/economic-data  # Economic indicators
```

### Cryptocurrencies
```
GET    /api/cryptos                # Get all cryptos
GET    /api/cryptos/:id            # Get crypto details
GET    /api/cryptos/:id/price      # Get current price
GET    /api/cryptos/market/overview     # Market overview
GET    /api/cryptos/:id/chart      # Price chart
GET    /api/cryptos/:id/pairs      # Trading pairs
GET    /api/cryptos/:id/exchanges  # Where to trade
GET    /api/cryptos/:id/on-chain   # On-chain metrics
GET    /api/cryptos/:id/news       # Crypto news
```

### Global
```
GET    /api/dashboard              # User dashboard
GET    /api/global                 # Global market data
GET    /api/search?q=...           # Global search
GET    /health                     # Health check
```

## 🎨 Features by Asset Class

### Stock Exchanges
- ✅ Exchange overview (market cap, companies, trading hours)
- ✅ Live index snapshot with breadth
- ✅ Top movers (gainers, losers, most active)
- ✅ Sector performance breakdown
- ✅ Interactive price charts
- ✅ Market news and analysis
- ✅ Company search and ranking

### Currencies
- ✅ Currency overview and metadata
- ✅ Exchange rates with bid/ask spreads
- ✅ Currency converter
- ✅ Popular currency pairs
- ✅ Historical exchange rate charts
- ✅ Economic indicators (interest rates, inflation, GDP)
- ✅ Economic news integration
- ✅ Currency-to-market linking

### Cryptocurrencies
- ✅ Crypto price and market metrics
- ✅ 24h volume and price change
- ✅ ATH/ATL tracking
- ✅ Market cap and dominance
- ✅ Trading pairs across exchanges
- ✅ Exchange listings
- ✅ Price charts with multiple timeframes
- ✅ On-chain metrics (advanced)
- ✅ News and project updates
- ✅ Category filtering (Layer 1, DeFi, Stablecoins, etc.)

## 📊 Data Structure

### Complete Exchange Schema
```typescript
interface StockExchange {
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
}
```

### Complete Currency Schema
```typescript
interface Currency {
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
}
```

### Complete Cryptocurrency Schema
```typescript
interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  category: string;
  description: string;
  launched: number;
  founder: string;
  maxSupply: number | null;
  circulatingSupply: number;
  consensusMechanism: string;
  blockTime: number | null;
  logo: string;
}
```

## 🔄 Data Flow

### Real-Time Updates Strategy
1. **WebSocket connections** for price updates (future)
2. **Scheduled jobs** for batch updates
3. **API caching** with Redis (future)
4. **Database polling** for fallback

### External Data Sources (To Integrate)
- **Stocks**: Alpha Vantage, Yahoo Finance API, IEX Cloud
- **Crypto**: CoinGecko API, CoinMarketCap
- **Forex**: OANDA, Twelve Data
- **News**: NewsAPI, CoinDesk, Reuters

## 🎯 Key Features

### Multi-Asset Dashboard
- View all market types in one interface
- Real-time data with customizable refresh rates
- Cross-asset correlation analysis

### Bloomberg-Style Design
- Dark/light theme support
- Professional typography and spacing
- Responsive grid layouts
- Smooth animations and transitions
- Consistent color scheme

### User Preferences
- Favorite exchanges, currencies, cryptos
- Base currency selection (automatic conversion)
- Custom dashboard layout
- Theme preference persistence

### Global Search
- Search across all asset types
- Auto-complete suggestions
- Result grouping by type
- Quick navigation

## 🔐 Security (To Implement)

- [ ] JWT authentication
- [ ] Rate limiting on API endpoints
- [ ] CORS configuration
- [ ] Input validation and sanitization
- [ ] Database query parameterization
- [ ] Environment variable protection

## 📈 Performance Optimizations

- [ ] Code splitting by route
- [ ] Lazy loading of components
- [ ] Image optimization and CDN
- [ ] Database query optimization with indexes
- [ ] API response caching
- [ ] Compression (gzip/brotli)

## 🧪 Testing (To Implement)

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start both server and client

# Server
npm run server:dev       # Start server with hot reload
npm run build:server     # Build server for production

# Client
npm run client:dev       # Start Vite dev server
npm run build:client     # Build client for production

# Database
npm run db:migrate       # Run pending migrations
npm run db:seed          # Seed database with initial data

# Production
npm run build            # Build both server and client
npm run start            # Run production build
```

## 🚢 Deployment

### Docker Setup (Recommended)
```dockerfile
# Build and run with Docker Compose
docker-compose up --build
```

### Heroku Deployment
```bash
git push heroku main
```

### AWS/GCP/Azure
- Use managed databases for PostgreSQL
- Deploy server to compute platform (Lambda, Cloud Run, App Engine)
- Host frontend on CDN (CloudFront, Cloud CDN, Azure CDN)

## 📚 Documentation

### Type Definitions
All types are in `src/types/index.ts`:
- Asset types (Exchange, Currency, Crypto)
- Market data types (Price, Chart, News)
- API response types

### Database Schema
See `src/server/database/migrations/001_initial_schema.ts`

### Component Documentation
Each React component has:
- Props interface definition
- JSDoc comments
- Usage examples

## 🔄 Next Steps / Roadmap

- [ ] **Data Integration**: Connect to live API providers
- [ ] **WebSocket**: Real-time price updates
- [ ] **Advanced Charts**: TradingView Lightweight Charts
- [ ] **Watchlists**: User favorites and alerts
- [ ] **Technical Analysis**: Additional indicators
- [ ] **News Integration**: Multi-source news aggregation
- [ ] **Mobile App**: React Native version
- [ ] **API Documentation**: Swagger/OpenAPI
- [ ] **Admin Dashboard**: Content management
- [ ] **Premium Features**: Advanced analytics, custom alerts

## 📞 Support & Contact

For questions or issues, please refer to the documentation or create an issue in the repository.

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ following Bloomberg's financial platform patterns**
