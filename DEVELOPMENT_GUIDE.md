# Development Guide - MarketsPivot

## Project Structure Overview

This is a full-stack TypeScript application with clear separation between frontend and backend.

## 🗂️ Directory Organization

```
src/
├── client/                          # React Frontend (Vite)
│   ├── components/
│   │   ├── Layout.tsx               # Main layout with navbar/footer
│   │   ├── ExchangeDetail.tsx        # Stock exchange page component
│   │   ├── CurrencyDetail.tsx        # Currency page component
│   │   └── CryptoDetail.tsx          # Cryptocurrency page component
│   ├── styles/
│   │   └── index.css                # Global Bloomberg-style CSS
│   ├── App.tsx                      # React Router setup
│   └── main.tsx                     # React entry point
│
├── server/                          # Express Backend
│   ├── routes/
│   │   ├── exchanges.ts             # GET/POST for stock exchanges
│   │   ├── currencies.ts            # GET/POST for currencies
│   │   └── cryptocurrencies.ts      # GET/POST for cryptos
│   ├── database/
│   │   ├── migrations/
│   │   │   └── 001_initial_schema.ts # Schema definition
│   │   └── seeds/                   # Data seeding
│   └── index.ts                     # Express app & server
│
├── types/                           # Shared TypeScript Interfaces
│   └── index.ts                     # All type definitions
│
└── data/                            # Static Configuration Data
    ├── exchanges.json               # 30 exchanges
    ├── currencies.json              # 20 currencies
    └── cryptocurrencies.json        # 20 cryptos
```

## 🔧 How to Extend the Platform

### Adding a New Stock Exchange

1. **Add to `src/data/exchanges.json`**:
```json
{
  "id": "NEWEX",
  "name": "New Exchange Name",
  "country": "Country",
  "countryCode": "XX",
  "region": "Region",
  "timezone": "Timezone/String",
  "currency": "CUR",
  "tradingHours": { "open": "HH:MM", "close": "HH:MM" },
  "mainIndex": "INDEX_ID",
  "mainIndexName": "Index Name",
  "description": "Description",
  "founded": 1900,
  "website": "https://example.com",
  "logo": "/logos/exchanges/newex.svg",
  "marketCap": 1000000000000,
  "listedCompanies": 1000,
  "avgDailyVolume": 1000000000
}
```

2. **Create migration** to add to database (auto-seeded from JSON)

3. **Add routes** in `src/server/routes/exchanges.ts` if needed

### Adding a New Currency

1. **Add to `src/data/currencies.json`**:
```json
{
  "code": "XXX",
  "name": "Currency Name",
  "symbol": "symbol",
  "country": "Country",
  "countryCode": "XX",
  "region": "Region",
  "type": "fiat",
  "centralBank": "Bank Name",
  "description": "Description",
  "logo": "/logos/currencies/xxx.svg"
}
```

2. **Create logo file** in `/public/logos/currencies/`

### Adding a New Cryptocurrency

1. **Add to `src/data/cryptocurrencies.json`**:
```json
{
  "id": "new-crypto",
  "symbol": "NEW",
  "name": "New Cryptocurrency",
  "category": "Layer 1",
  "description": "Description",
  "launched": 2024,
  "founder": "Founder Name",
  "maxSupply": 1000000000,
  "circulatingSupply": 500000000,
  "consensusMechanism": "Proof of Work",
  "blockTime": 10,
  "logo": "/logos/crypto/new.svg"
}
```

### Creating a New API Endpoint

1. **Create route handler** in appropriate file under `src/server/routes/`
2. **Add router.get()** or **router.post()** with proper types
3. **Import in `src/server/index.ts`** and register with `app.use()`

Example:
```typescript
router.get("/:id/new-feature", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Implement logic
    res.json({
      success: true,
      data: {},
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch data",
      timestamp: new Date(),
    });
  }
});
```

### Creating a New React Component

1. **Create component file** in `src/client/components/`
2. **Define props interface** with TypeScript
3. **Follow naming convention**: PascalCase.tsx

Example:
```typescript
import React from "react";

interface MyComponentProps {
  title: string;
  children: React.ReactNode;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, children }) => {
  return (
    <div className="my-component">
      <h1>{title}</h1>
      {children}
    </div>
  );
};

export default MyComponent;
```

### Adding New Styles

Global styles go in `src/client/styles/index.css`

Follow the existing structure:
- Root CSS variables for colors
- Component-specific classes
- Media queries at the end
- BEM naming convention

## 📊 Database Operations

### Running Migrations

```bash
# Create new migration
npx knex migrate:make migration_name

# Run all pending migrations
npm run db:migrate

# Rollback last batch
npx knex migrate:rollback

# Rollback all migrations
npx knex migrate:rollback --all
```

### Seeding Data

```bash
# Create seed file
npx knex seed:make seed_name

# Run all seeds
npm run db:seed
```

## 🔌 Integrating External APIs

### For Stock Data (Add to routes)
```typescript
// Example: Alpha Vantage
const response = await axios.get(`https://www.alphavantage.co/query`, {
  params: {
    function: "GLOBAL_QUOTE",
    symbol: "AAPL",
    apikey: process.env.ALPHA_VANTAGE_KEY,
  },
});
```

### For Crypto Data (Add to routes)
```typescript
// Example: CoinGecko (free API)
const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
  params: {
    ids: "bitcoin,ethereum",
    vs_currencies: "usd",
    include_market_cap: true,
    include_24hr_vol: true,
  },
});
```

### For Currency Rates (Add to routes)
```typescript
// Example: Twelve Data
const response = await axios.get(`https://api.twelvedata.com/currency_conversion`, {
  params: {
    symbol: "USD/EUR",
    apikey: process.env.TWELVE_DATA_KEY,
  },
});
```

## 🧪 Testing Structure (To Implement)

```
tests/
├── unit/
│   ├── components/
│   ├── utils/
│   └── types/
├── integration/
│   ├── api/
│   └── routes/
└── e2e/
    └── flows/
```

## 🏗️ Adding Features

### Feature Checklist
- [ ] Add type definitions in `src/types/index.ts`
- [ ] Add database schema changes in migrations
- [ ] Add API routes in `src/server/routes/`
- [ ] Add React components in `src/client/components/`
- [ ] Add CSS styles in `src/client/styles/index.css`
- [ ] Update routing in `src/client/App.tsx`
- [ ] Add tests in `tests/`
- [ ] Update documentation

## 📝 Code Style Guide

### TypeScript
- Strict mode enabled
- Always define interfaces for props
- Use explicit return types
- Prefer const over let/var

### React
- Functional components only
- Use React.FC<Props> for typing
- Keep components small and focused
- Use descriptive prop names

### CSS
- Mobile-first responsive design
- Use CSS variables for colors
- Follow BEM for class naming
- Group related styles together

## 🔒 Environment Variables

Required:
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://...
```

Optional:
```
ALPHA_VANTAGE_KEY=...
RAPID_API_KEY=...
COINGECKO_API_KEY=...
NEWS_API_KEY=...
```

## 🚀 Performance Tips

1. **Database**: Add indexes for frequently queried fields
2. **API**: Implement caching with Redis
3. **Frontend**: Use React.memo() for expensive components
4. **Charts**: Lazy load chart libraries
5. **Images**: Use SVG for logos, compress other images

## 🐛 Debugging

### Server Debugging
```bash
# Run with debug output
DEBUG=* npm run server:dev

# Use VS Code debugger
# Add breakpoints and press F5
```

### Client Debugging
```bash
# Use React DevTools browser extension
# Use Redux DevTools (when state management grows)
```

### Database Debugging
```bash
# View database
psql marketpivot

# Check migrations
npx knex migrate:status

# View table structure
\d exchanges
```

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Knex.js Query Builder](http://knexjs.org)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Test locally
4. Commit: `git commit -am 'Add my feature'`
5. Push: `git push origin feature/my-feature`
6. Create a Pull Request

## 📞 Getting Help

- Check existing code examples
- Review API documentation
- Search GitHub issues
- Check TypeScript errors for hints

---

**Ready to build? Start by running `npm run dev`!**
