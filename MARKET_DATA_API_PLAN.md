# MarketsPivot Market Data API Plan

This document defines the recommended API stack for MarketsPivot, including free options, paid upgrade costs, usage purpose, and rollout strategy.

## 1. Product Data Requirements

MarketsPivot is planned as a Bloomberg-style multi-asset market platform covering:

- Stock exchanges and equities
- Bonds and fixed income context
- FX and currencies
- Commodities
- Derivatives
- Cryptocurrencies
- Market news
- Macro and economic indicators
- Instrument identifiers and mapping

## 2. Recommended API Stack Summary

| Area | Recommended API | Free Plan | Paid Starting Cost | Use In MarketsPivot |
|---|---|---:|---:|---|
| Stocks, FX, crypto, commodities | Twelve Data | Free, 800/day | Grow $79/mo | Main multi-asset market data |
| Global stocks/exchanges backup | Marketstack | Free, 100/mo | Basic $9.99/mo | Exchange metadata, EOD prices |
| Crypto | CoinGecko | Demo, 10k calls/mo | Basic $35/mo, Analyst $129/mo | Crypto price, market cap, volume, pairs |
| FX conversion | ExchangeRate-API | Free 1.5k/mo | Pro $10/mo | Currency conversion and base currency |
| News | NewsAPI | Free dev only, 100/day | Business $449/mo | Market and economic news |
| Macro data | FRED API | Free | Free | Interest rates, inflation, yields |
| Instrument mapping | OpenFIGI | Free limited | Free API key for higher limits | FIGI, ticker, ISIN-style mapping |
| Premium US real-time | Polygon.io | Free 5 calls/min | Stocks $29-$79/mo, FX/Crypto $49/mo | Optional premium real-time upgrade |
| Fundamentals | Financial Modeling Prep | Free 250/day | Starter $22/mo billed annually | Company fundamentals, financials |

## 3. Best Free MVP Stack

Use this stack while validating the product.

| API | Cost | Purpose |
|---|---:|---|
| Twelve Data Free | $0/mo | Stocks, FX, crypto, commodities testing |
| CoinGecko Demo | $0/mo | Crypto dashboard |
| ExchangeRate-API Free | $0/mo | Currency conversion |
| FRED API | $0/mo | Macro and rates |
| OpenFIGI | $0/mo | Instrument mapping |
| NewsAPI Developer | $0/mo | Development-only news testing |

Estimated monthly cost:

```text
$0/mo
```

Important limitation:

- Free plans are good for development and MVP demos.
- Free plans usually have low limits, delayed data, or non-commercial restrictions.
- Do not rely on free news APIs for production unless their terms clearly allow it.

## 4. Recommended Low-Cost Production Stack

This is the practical first paid stack.

| API | Plan | Monthly Cost |
|---|---|---:|
| Twelve Data | Grow | $79/mo |
| CoinGecko | Analyst | $129/mo |
| ExchangeRate-API | Pro | $10/mo |
| FRED | Free | $0/mo |
| OpenFIGI | Free/API key | $0/mo |

Estimated monthly cost:

```text
$218/mo
```

This stack is enough for:

- Global exchange pages
- FX conversion
- Top 20 currencies
- Top 20 crypto pages
- Price snapshots
- Basic charts
- Market cards
- Dashboard widgets

## 5. Production Stack With News

If MarketsPivot needs live market news in production:

| API | Plan | Monthly Cost |
|---|---|---:|
| Low-cost production stack | Mixed | $218/mo |
| NewsAPI | Business | $449/mo |

Estimated monthly cost:

```text
$667/mo
```

Alternative:

- Start with RSS feeds from official sources.
- Add paid NewsAPI later.
- For macro news, use official central bank feeds where possible.

## 6. Advanced Premium Stack

Use this only after traffic and revenue justify it.

| API | Use | Approx Cost |
|---|---|---:|
| Polygon.io Stocks Developer | Real-time US stocks | $79/mo |
| Polygon.io Currencies Starter | Forex + crypto real-time | $49/mo |
| Twelve Data Pro | More markets and fixed income | $229/mo |
| CoinGecko Lite | High-volume crypto | $499/mo |
| NewsAPI Business | Production news | $449/mo |

Estimated advanced cost:

```text
$1,000+/mo
```

## 7. API Usage By Feature

### Stock Exchange Pages

Required data:

- Exchange name
- Country
- Timezone
- Currency
- Trading hours
- Main index
- Market cap
- Listed companies
- Index snapshot
- Top gainers
- Top losers
- Most active
- Sector performance
- Historical chart

Recommended APIs:

- Twelve Data
- Marketstack
- OpenFIGI
- FMP later for fundamentals

### Currency Pages

Required data:

- Currency name and code
- Symbol
- Country or region
- Central bank
- Exchange rates
- Currency converter
- Popular FX pairs
- Historical FX chart
- Economic indicators

Recommended APIs:

- ExchangeRate-API
- Twelve Data FX
- FRED for macro

### Crypto Pages

Required data:

- Name and symbol
- Current price
- 24h change
- Market cap
- Rank
- Volume
- ATH / ATL
- Circulating supply
- Trading pairs
- Exchanges
- Chart data

Recommended APIs:

- CoinGecko
- Twelve Data crypto as backup
- Polygon.io optional for real-time crypto

### Bonds / Fixed Income

Required data:

- Treasury yields
- Yield curve
- Central bank rates
- Sovereign bond references
- Spread indicators

Recommended APIs:

- FRED for US data
- Twelve Data paid tiers for fixed income
- Trading Economics later for global macro

### Commodities

Required data:

- Gold
- Silver
- Oil
- Natural gas
- Agriculture prices
- Commodity charts

Recommended APIs:

- Twelve Data
- ExchangeRate-API for precious metals if supported
- Polygon.io or Nasdaq Data Link later

### Derivatives

Required data:

- Options chains
- Futures contracts
- Implied volatility
- Open interest
- Volume

Recommended APIs:

- Polygon.io for US options
- Twelve Data for supported derivatives/technical views
- Exchange-specific feeds later

## 8. Caching Strategy

Caching is very important to reduce API cost.

Recommended cache timing:

| Data Type | Cache Duration |
|---|---:|
| Exchange metadata | 24 hours |
| Currency metadata | 24 hours |
| Crypto metadata | 6-24 hours |
| FX rates | 5-60 minutes |
| Stock snapshots | 1-5 minutes |
| Crypto prices | 30-120 seconds |
| Market news | 10-30 minutes |
| Macro data | 12-24 hours |
| Charts | 5-60 minutes depending on timeframe |

Recommended implementation:

- Store API responses in PostgreSQL.
- Add Redis later for faster live dashboard caching.
- Never call third-party APIs directly from frontend.
- Always route through backend endpoints.

## 9. Backend Environment Variables

Add these keys later in `.env`:

```env
TWELVE_DATA_API_KEY=
COINGECKO_API_KEY=
EXCHANGE_RATE_API_KEY=
NEWS_API_KEY=
FRED_API_KEY=
OPENFIGI_API_KEY=
POLYGON_API_KEY=
FMP_API_KEY=
```

## 10. Suggested Rollout Plan

### Phase 1: Free MVP

- Use Twelve Data Free
- Use CoinGecko Demo
- Use ExchangeRate-API Free
- Use FRED Free
- Use OpenFIGI Free
- Use mock/news placeholders

Cost:

```text
$0/mo
```

### Phase 2: First Production Version

- Upgrade Twelve Data to Grow
- Upgrade CoinGecko to Analyst
- Upgrade ExchangeRate-API to Pro
- Keep FRED and OpenFIGI free
- Add backend caching

Cost:

```text
~$218/mo
```

### Phase 3: Production News

- Add NewsAPI Business or another production news provider

Cost:

```text
~$667/mo total
```

### Phase 4: Premium Real-Time

- Add Polygon.io for real-time US stocks/options/forex/crypto
- Add deeper fixed income and derivatives data

Cost:

```text
$1,000+/mo depending on selected feeds
```

## 11. Final Recommendation

Start with:

```text
Twelve Data Free
CoinGecko Demo
ExchangeRate-API Free
FRED Free
OpenFIGI Free
```

Then upgrade to:

```text
Twelve Data Grow
CoinGecko Analyst
ExchangeRate-API Pro
```

Do not buy expensive news or real-time derivatives feeds until the platform has users.

## 12. Source Links

- Twelve Data Pricing: https://twelvedata.com/pricing
- Marketstack Pricing: https://marketstack.com/pricing
- CoinGecko Pricing: https://www.coingecko.com/api/pricing
- ExchangeRate-API Free Docs: https://www.exchangerate-api.com/docs/free
- NewsAPI Pricing: https://newsapi.org/pricing
- OpenFIGI API Docs: https://www.openfigi.com/api/documentation
- Polygon Pricing: https://polygon.io/pricing
- FMP Pricing: https://site.financialmodelingprep.com/pricing-plans
