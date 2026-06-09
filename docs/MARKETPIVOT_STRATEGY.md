# MarketPivot — Product Strategy, APIs & Unique Value Proposition
> Version: June 2026 | For: Internal Product Planning

---

## 1. COMPETITOR ANALYSIS

### Yahoo Finance Screener (finance.yahoo.com/research-hub/screener)
| Feature | What They Have |
|---|---|
| Screener | 100+ filters, US-centric, real-time |
| Data | Free, ad-supported, limited fundamentals |
| Customization | Zero — fixed layout for everyone |
| Target User | Retail investors, beginners |
| Weakness | No personalization, no emerging markets depth, no API access for users |

### Bloomberg Enterprise (professional.bloomberg.com)
| Feature | What They Have |
|---|---|
| Data Quality | Best in world — 35,000+ securities |
| Pricing | $24,000–$40,000/year per terminal |
| Customization | Terminal only — not portable |
| Target User | Hedge funds, investment banks, institutions |
| Weakness | Unaffordable for 99% of professionals, no self-serve, no white-label |

---

## 2. THE GAP — Where MarketPivot Wins

```
Yahoo Finance       →  Free but generic, no customization, US-only depth
Bloomberg           →  Best data but $2,000/month, inaccessible
─────────────────────────────────────────────────────────────
MarketPivot         →  Professional-grade, affordable, CUSTOMIZABLE, Emerging Markets
```

**Target Users (The Underserved Middle):**
- Regional fund managers (Asia, Middle East, Africa, LatAm)
- Independent financial analysts and research firms
- Fintech startups needing embeddable market widgets
- Financial media companies needing data-powered content
- Wealth management firms wanting branded client portals

---

## 3. UNIQUE CONCEPTS — What Will Make Users Come To MarketPivot

### 🏆 CONCEPT 1: "Build Your Own Financial Portal"
**No platform offers this at an affordable price.**

Users drag-and-drop from a widget library to build their own dashboard:
- Watchlist widget
- Screener widget (pre-filtered)
- Heatmap widget
- Regional macro widget
- News feed widget (filtered by topic/region)
- Chart widget

**Then they can:**
- Save layout as "My APAC Morning Dashboard"
- Share it as a public URL: `marketpivot.com/dashboard/my-apac-brief`
- Embed widgets on their own website/app
- White-label it with their logo (paid tier)

**Why it wins:** Yahoo has no dashboard builder. Bloomberg costs $40K/year for less flexibility.

---

### 🏆 CONCEPT 2: "Regional Intelligence Hub" (Emerging Markets Focus)
**Yahoo Finance is US-centric. Bloomberg locks emerging markets behind $$$.**

MarketPivot becomes THE destination for:
- Asia-Pacific markets (India, China, Japan, Southeast Asia)
- MENA (UAE, Saudi Arabia, Egypt, Turkey)
- Africa (Nigeria, South Africa, Kenya, Egypt)
- Latin America (Brazil, Mexico, Argentina, Colombia)

Per-region data:
- GDP trajectory, inflation trends, interest rate history
- Political risk score
- Currency performance vs USD
- Top sectors performing in that region
- Upcoming economic events for that region

**Why it wins:** No major free platform provides emerging markets intelligence at this depth.

---

### 🏆 CONCEPT 3: "Smart Screener with AI Natural Language"
**"Show me undervalued tech stocks in Asia with P/E under 15 and dividend yield above 3%"**

User types in plain English → Screener auto-applies filters → Results shown.

Also:
- Save a screen → Name it → Share it as a URL
- "Alert me when new stocks match this screen" (email/push notification)
- Community screens: Most used screens by other professionals

**Why it wins:** Yahoo screener requires manual filter setup. Bloomberg requires learning terminal syntax.

---

### 🏆 CONCEPT 4: "AI Morning Brief" (Daily Personalized Intelligence)
Each user gets a daily AI-generated brief:

```
"Good morning, Amit. Here's your Asia-Pacific brief for June 9:
• Nikkei 225 up 1.2% — driven by semiconductor exports beat
• USD/INR at 83.4 — RBI intervention expected
• 3 stocks in your watchlist hit your RSI alert
• Today's key events: India CPI at 2pm, China trade balance at 4pm"
```

Personalized based on:
- User's saved watchlist
- User's saved screener
- User's preferred regions/sectors

**Why it wins:** Bloomberg has this but at $2K/month. No free platform offers personalized daily AI briefings.

---

### 🏆 CONCEPT 5: "Professional Tear Sheets" (PDF Export)
Generate professional one-page PDF reports:
- Single stock tear sheet: price chart, fundamentals, news, analyst estimates
- Sector report: performance, top movers, economic context
- Regional report: macro indicators, top exchanges, upcoming events

**Why it wins:** Analysts and fund managers need this daily. No platform provides free, clean PDF exports.

---

## 4. APIs TO INTEGRATE — Complete List with Purchase Links

---

### TIER 1: MUST HAVE (Core Data — Do First)

#### 1. Polygon.io — Real-Time US Stock Data
- **What it provides:** Real-time + historical stock prices, options, forex, crypto
- **Purchase:** https://polygon.io/dashboard/billing
- **Plans:**
  - Starter: $29/month — 5 years history, 5 API calls/min
  - Developer: $79/month — unlimited calls, WebSocket
  - **Recommended: Starter ($29/mo) to begin**
- **Use in project:** Stock Detail page, Screener live prices, Watchlist live refresh
- **Docs:** https://polygon.io/docs

#### 2. Financial Modeling Prep (FMP) — Fundamentals & Earnings
- **What it provides:** P/E ratio, EPS, revenue, earnings calendar, analyst ratings, DCF valuation
- **Purchase:** https://site.financialmodelingprep.com/developer/docs/pricing
- **Plans:**
  - Starter: $19/month — 300 calls/day, 5-year history
  - Professional: $79/month — unlimited, real-time
  - **Recommended: Starter ($19/mo) to begin**
- **Use in project:** Stock Detail fundamentals, Screener P/E filter, Earnings calendar
- **Docs:** https://site.financialmodelingprep.com/developer/docs

#### 3. Alpha Vantage — Backup Stock + Forex + Crypto
- **What it provides:** Global stocks (not just US), forex, crypto, technical indicators
- **Purchase:** https://www.alphavantage.co/premium/
- **Plans:**
  - Free: 25 calls/day (good to start testing)
  - Premium: $50/month — 75 calls/min
  - **Recommended: Free tier to start, upgrade when needed**
- **Use in project:** Global stocks outside US, Forex rates, Technical indicators (RSI, MACD)
- **Docs:** https://www.alphavantage.co/documentation/

#### 4. CoinGecko — Crypto Data
- **What it provides:** 10,000+ crypto prices, market cap, volume, trending coins
- **Purchase:** https://www.coingecko.com/en/api/pricing
- **Plans:**
  - Demo (Free): 30 calls/min — sufficient for most features
  - Analyst: $129/month — higher limits, OHLC data
  - **Recommended: Free tier to start**
- **Use in project:** Crypto page, trending coins, crypto screener
- **Docs:** https://docs.coingecko.com/

---

### TIER 2: GROWTH PHASE (Add after core is live)

#### 5. NewsAPI — Financial News Feed
- **What it provides:** Real-time news from 150,000 sources, filterable by keyword/topic
- **Purchase:** https://newsapi.org/pricing
- **Plans:**
  - Developer (Free): 100 calls/day, delayed 1 hour
  - Business: $449/month — real-time, unlimited
  - **Recommended: Start free, upgrade when users grow**
- **Use in project:** News page, stock detail news, regional news feed, AI brief
- **Docs:** https://newsapi.org/docs

#### 6. Benzinga Pro API — Premium Financial News
- **What it provides:** Real-time financial news, press releases, analyst upgrades/downgrades
- **Purchase:** https://www.benzinga.com/apis/
- **Plans:** Contact for pricing (~$200–$500/month)
- **Use in project:** Premium news tier for paid users
- **Docs:** https://docs.benzinga.io/

#### 7. Twelve Data — Technical Indicators
- **What it provides:** RSI, MACD, Bollinger Bands, 100+ indicators, global stocks
- **Purchase:** https://twelvedata.com/pricing
- **Plans:**
  - Free: 8 calls/min, 800/day
  - Basic: $29/month — 55 calls/min
  - **Recommended: Free to start, Basic when screener goes live**
- **Use in project:** Advanced Screener (RSI filter, SMA filter), Chart overlays
- **Docs:** https://twelvedata.com/docs

#### 8. Open Exchange Rates — Forex
- **What it provides:** 200+ currency pairs, real-time + historical
- **Purchase:** https://openexchangerates.org/signup
- **Plans:**
  - Free: 1,000 calls/month, hourly updates
  - Developer: $12/month — unlimited calls, real-time
  - **Recommended: Free to start**
- **Use in project:** Currencies page, portfolio FX conversion
- **Docs:** https://docs.openexchangerates.org/

---

### TIER 3: FREE GOVERNMENT/INSTITUTIONAL APIs (Use Immediately — No Cost)

#### 9. World Bank API — Global Macro Data
- **What it provides:** GDP, inflation, unemployment, population for 200+ countries
- **Purchase:** FREE — https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
- **Use in project:** Regions page macro data, country profiles, economic trends
- **Docs:** https://datahelpdesk.worldbank.org/

#### 10. FRED (Federal Reserve — St. Louis) — US Economic Indicators
- **What it provides:** Interest rates, CPI, unemployment, yield curve, 800,000+ series
- **Purchase:** FREE — https://fred.stlouisfed.org/docs/api/api_key.html
- **Use in project:** Economic Calendar, US macro section, bond yield data
- **Docs:** https://fred.stlouisfed.org/docs/api/fred/

#### 11. IMF Data API — Global Economic Data
- **What it provides:** Current account, reserves, fiscal data for all countries
- **Purchase:** FREE — https://www.imf.org/en/Data
- **Use in project:** Emerging markets deep data, regional intelligence section
- **Docs:** https://datahelp.imf.org/knowledgebase/articles/667681

#### 12. ECB (European Central Bank) API — Eurozone Data
- **What it provides:** EUR exchange rates, ECB rates, inflation
- **Purchase:** FREE — https://data.ecb.europa.eu/
- **Use in project:** Europe region page, EUR forex section
- **Docs:** https://data.ecb.europa.eu/help/api/data

---

### TIER 4: INTELLIGENCE LAYER (Differentiator Features)

#### 13. Anthropic Claude API — AI Market Briefs & Smart Screener
- **What it provides:** Natural language processing, text generation, data summarization
- **Purchase:** https://console.anthropic.com/
- **Plans:** Pay-per-use
  - Input: $3/million tokens (Sonnet 4.6)
  - Output: $15/million tokens
  - **Estimated cost: ~$50/month for 10,000 AI briefs**
- **Use in project:** AI Morning Brief, Natural Language Screener, Tear Sheet summaries
- **Docs:** https://docs.anthropic.com/

#### 14. Clearbit Logo API — Company Logos (Already Using)
- **What it provides:** Company logos by domain name
- **Purchase:** https://clearbit.com/pricing
- **Plans:** Free tier available (currently using)
- **Use in project:** Stock detail, screener results, watchlist

---

## 5. IMPLEMENTATION ROADMAP

### Phase 1 — Fix Foundation (2–3 Weeks) — CRITICAL
**Problem:** Screener and stock data currently use static JSON — not real data.

Tasks:
1. Integrate Polygon.io → Replace static stock data with live prices
2. Integrate FMP → Add fundamentals to Stock Detail page (P/E, EPS, revenue)
3. Integrate Twelve Data free tier → Make screener RSI/SMA filters real
4. Connect World Bank API → Power Regions page with real macro data (FREE)
5. Connect FRED API → Economic Calendar real events (FREE)

**Estimated API cost: $29/month (Polygon Starter) + $19/month (FMP) = $48/month**

---

### Phase 2 — Screener Power-Up (1 Week)
1. 50+ working filters with real data
2. Save screen → Name it → Share URL
3. Alert system: Email when stocks match saved screen
4. "Top Community Screens" section

---

### Phase 3 — Dashboard Builder (3–4 Weeks)
1. Widget library: 8 core widgets
2. Drag-and-drop layout builder (use react-grid-layout)
3. Save layout to user profile
4. Share dashboard as public URL
5. Embed code generator for widgets

---

### Phase 4 — AI Features (1–2 Weeks)
1. Daily AI Morning Brief (Claude API)
2. Natural language screener: type in English, get filters
3. Stock summary AI snippet on detail page
4. Regional intelligence AI summaries

---

### Phase 5 — B2B & White-Label (2 Weeks)
1. White-label pricing tier ($199/month)
2. Custom domain support for embedded portals
3. API access for Enterprise tier users
4. Reseller program for financial media

---

## 6. PRICING STRATEGY

| Plan | Price | Target User | Key Features |
|---|---|---|---|
| **Free** | $0/mo | Retail investors | Basic screener, 3 watchlist stocks, read-only dashboards |
| **Pro** | $29/mo | Analysts, active traders | Full screener, unlimited watchlist, save screens, alerts, AI brief |
| **Business** | $99/mo | Fund managers, research firms | All Pro + custom dashboard, PDF tear sheets, API access (500 calls/day) |
| **Enterprise** | $299/mo | Fintech, media, brokers | White-label, unlimited API, custom branding, SLA support |

**Key insight:** Bloomberg costs $2,000/month. Your Business plan at $99 is 20x cheaper with 80% of the features professionals actually need daily.

---

## 7. MONTHLY COST ESTIMATE (When Fully Running)

| API | Monthly Cost |
|---|---|
| Polygon.io Developer | $79 |
| Financial Modeling Prep Professional | $79 |
| Twelve Data Basic | $29 |
| NewsAPI Business | $449 |
| Open Exchange Rates Developer | $12 |
| CoinGecko Analyst | $129 |
| Claude API (AI Briefs) | ~$50 |
| World Bank / FRED / IMF | $0 |
| **Total** | **~$827/month** |

**Break-even:** 29 Pro users ($29/mo) OR 9 Business users ($99/mo) OR 3 Enterprise users ($299/mo)

---

## 8. QUICK WIN — Start Here This Week

1. Sign up for **Polygon.io free trial** → https://polygon.io → Connect to Screener
2. Sign up for **Alpha Vantage free key** → https://www.alphavantage.co/support/#api-key → Connect to Stock Detail
3. Get **World Bank API** (FREE) → Connect to Regions pages immediately
4. Get **FRED API key** (FREE) → https://fred.stlouisfed.org/docs/api/api_key.html → Economic Calendar
5. Get **CoinGecko free key** → https://www.coingecko.com/en/api/pricing → Crypto page

**These 5 steps cost $0 and immediately make your app real vs competitors.**

---

## 9. DOMAIN & SEO STRATEGY

To attract users organically:

1. **Content pages** (SEO goldmine):
   - `/stocks/apple-inc` — "Apple Inc Stock Price, Fundamentals, News"
   - `/regions/asia-pacific/india` — "India Stock Market Overview — BSE, NSE"
   - `/screener/dividend-stocks-asia` — "Top Dividend Stocks in Asia 2026"

2. **Free tools** (viral acquisition):
   - Currency converter
   - P/E ratio calculator
   - Compound interest calculator
   - Stock comparison tool

3. **Weekly regional reports** (email capture):
   - "Asia-Pacific Markets Weekly" newsletter
   - "MENA Market Pulse" newsletter

---

*Document prepared: June 2026 | MarketPivot Internal Strategy*
