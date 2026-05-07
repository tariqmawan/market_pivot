# Quick Start Guide - MarketsPivot

Get MarketsPivot running in 5 minutes! ⚡

## Prerequisites Check
```bash
# Check Node.js version (need 16+)
node --version

# Check npm version (need 8+)
npm --version
```

## Installation (2 minutes)

```bash
# 1. Navigate to project directory
cd market_pivot

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. (OPTIONAL) Setup PostgreSQL database
# If you have PostgreSQL installed locally:
# - Create database: createdb marketpivot
# - Edit .env with your DB credentials
# - Run migrations: npm run db:migrate
```

## Start Development Server (1 minute)

```bash
# Start both frontend and backend
npm run dev
```

You'll see output like:
```
MarketsPivot API Server running on http://localhost:3000
VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## Test It Out (2 minutes)

### 1. Open Frontend
- Go to: `http://localhost:5173`
- You should see the MarketsPivot homepage

### 2. Test API
```bash
# In a new terminal, test an endpoint
curl http://localhost:3000/health
# Response: {"status":"OK","timestamp":"..."}

# Get all exchanges
curl http://localhost:3000/api/exchanges

# Get specific exchange
curl http://localhost:3000/api/exchanges/NYSE

# Get currencies
curl http://localhost:3000/api/currencies

# Get cryptos
curl http://localhost:3000/api/cryptos
```

### 3. Test Frontend Navigation
- Click "Stock Exchanges" link
- Click "Currencies" link
- Click "Cryptocurrencies" link
- Try the currency selector dropdown
- Try the theme toggle button

## Project Structure at a Glance

```
market_pivot/
├── src/
│   ├── client/        👈 React frontend (port 5173)
│   ├── server/        👈 Express API (port 3000)
│   ├── types/         👈 Shared TypeScript types
│   └── data/          👈 Exchange, currency, crypto data
├── package.json       👈 Dependencies & scripts
├── vite.config.ts     👈 Frontend build config
├── tsconfig.json      👈 TypeScript config
└── README.md          👈 Full documentation
```

## Available Commands

```bash
# Development
npm run dev               # Start frontend + backend

# Server only
npm run server:dev       # Start backend with hot reload
npm run build:server     # Build server for production

# Client only
npm run client:dev       # Start frontend dev server
npm run build:client     # Build frontend for production

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with data

# Production
npm run build            # Build both frontend & backend
npm run start            # Run production build
```

## What You Get

### 📊 Stock Exchanges (30 Global)
- Full details for exchanges in US, Europe, Asia, Middle East, Africa, Americas
- Markets covered: NYSE, NASDAQ, LSE, Tokyo SE, Shanghai SE, Hong Kong SE, etc.

### 💱 Currencies (20 Global)
- All major currencies and regional important ones
- Includes USD, EUR, JPY, GBP, CHF, CNY, INR, AUD, CAD, BRL, etc.

### 🪙 Cryptocurrencies (20 Major)
- Bitcoin, Ethereum, BNB, Solana, Cardano, Polkadot, and 14 others
- Includes different categories: Layer 1, DeFi, Stablecoins, Payments

## File Highlights

### Frontend
- **`src/client/components/ExchangeDetail.tsx`** - Stock exchange page template
- **`src/client/components/CurrencyDetail.tsx`** - Currency page template  
- **`src/client/components/CryptoDetail.tsx`** - Cryptocurrency page template
- **`src/client/styles/index.css`** - Bloomberg-style dark theme CSS

### Backend
- **`src/server/routes/exchanges.ts`** - 10+ exchange endpoints
- **`src/server/routes/currencies.ts`** - 10+ currency endpoints
- **`src/server/routes/cryptocurrencies.ts`** - 12+ crypto endpoints
- **`src/server/index.ts`** - Main Express server setup

### Data
- **`src/data/exchanges.json`** - All 30 exchanges with complete metadata
- **`src/data/currencies.json`** - All 20 currencies with metadata
- **`src/data/cryptocurrencies.json`** - All 20 cryptos with metadata

## API Endpoints Ready

All these endpoints are ready to implement:

**Exchanges:**
- `GET /api/exchanges` - List all
- `GET /api/exchanges/:id` - Get details
- `GET /api/exchanges/:id/summary` - Market summary
- `GET /api/exchanges/:id/top-movers` - Gainers/losers
- `GET /api/exchanges/:id/chart` - Price chart
- `GET /api/exchanges/:id/sectors` - Sector breakdown

**Currencies:**
- `GET /api/currencies` - List all
- `GET /api/currencies/:code` - Get details
- `GET /api/currencies/:code/rates` - Exchange rates
- `POST /api/currencies/convert/amount` - Convert money
- `GET /api/currencies/:code/chart` - Historical chart
- `GET /api/currencies/:code/pairs` - Popular pairs

**Cryptocurrencies:**
- `GET /api/cryptos` - List all
- `GET /api/cryptos/:id` - Get details
- `GET /api/cryptos/:id/price` - Current price
- `GET /api/cryptos/market/overview` - Market overview
- `GET /api/cryptos/:id/chart` - Price chart
- `GET /api/cryptos/:id/exchanges` - Where to trade

See **`API_DOCUMENTATION.md`** for complete reference!

## Next Steps

### To Connect Real Data:
1. Edit `src/server/routes/exchanges.ts`
2. Add API calls to your data provider
3. Examples provided in `DEVELOPMENT_GUIDE.md`

### To Customize Styling:
1. Edit `src/client/styles/index.css`
2. Change CSS variables at the top
3. Modify component classes

### To Add More Features:
1. Follow patterns in existing components
2. Read `DEVELOPMENT_GUIDE.md` for details
3. Check `README.md` for architecture

## Troubleshooting

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env
echo "PORT=3001" >> .env
```

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Database connection error"
```bash
# Option 1: Disable database (skip migrations)
# Routes will return mock data

# Option 2: Set up PostgreSQL
# See README.md for database setup
```

### Frontend won't load
```bash
# Check if Vite server is running
# Should see "VITE v4.x.x ready in xxx ms"

# Try clearing cache
rm -rf .vite node_modules/.vite
npm run client:dev
```

## File Sizes

- **Frontend bundle**: ~200KB (minified)
- **Backend**: ~50KB (minified)
- **CSS**: ~25KB
- **Data files**: ~100KB total

## Performance Tips

- Dark theme by default (lower power usage)
- Responsive design (works on mobile)
- Lazy-loaded components
- Optimized CSS with no unused styles

## Documentation

- **`README.md`** - Complete project overview
- **`API_DOCUMENTATION.md`** - Full API reference with examples
- **`DEVELOPMENT_GUIDE.md`** - How to extend the platform
- **`QUICK_START.md`** - This file

## What's Next?

1. **Run it**: `npm run dev`
2. **Explore**: Check the different pages
3. **Check API**: View routes in browser
4. **Customize**: Edit colors in CSS
5. **Integrate**: Add real data providers
6. **Deploy**: Follow deployment guide in README

## Support

- Questions? Check `README.md` section "Next Steps"
- API issues? See `API_DOCUMENTATION.md`
- Extension help? Read `DEVELOPMENT_GUIDE.md`
- Stuck? Check `Troubleshooting` section above

---

**You're all set! Run `npm run dev` and enjoy MarketsPivot! 🚀**
