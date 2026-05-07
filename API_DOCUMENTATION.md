# MarketsPivot API Documentation

## Base URL
```
http://localhost:3000
```

## Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "data": {},
  "timestamp": "2024-05-07T12:00:00Z"
}
```

---

## 🏦 Stock Exchanges Endpoints

### 1. List All Exchanges
**GET** `/api/exchanges`

Query Parameters:
- `region` (optional): Filter by region (e.g., "North America", "Europe", "Asia")
- `country` (optional): Filter by country code (e.g., "US", "GB")
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Example Request:**
```bash
GET /api/exchanges?region=North America&page=1&limit=20
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "NYSE",
      "name": "New York Stock Exchange",
      "country": "United States",
      "marketCap": 33000000000000,
      "listedCompanies": 2900,
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 30,
    "pages": 2
  }
}
```

### 2. Get Exchange Details
**GET** `/api/exchanges/:id`

**Example Request:**
```bash
GET /api/exchanges/NYSE
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "NYSE",
    "name": "New York Stock Exchange",
    "country": "United States",
    "currency": "USD",
    "timezone": "America/New_York",
    "tradingHours": {
      "open": "09:30",
      "close": "16:00"
    },
    "mainIndex": "SPX",
    "mainIndexName": "S&P 500",
    "marketCap": 33000000000000,
    "listedCompanies": 2900
  }
}
```

### 3. Get Market Summary
**GET** `/api/exchanges/:id/summary`

**Example Request:**
```bash
GET /api/exchanges/NASDAQ/summary
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "index": {
      "symbol": "CCMP",
      "name": "NASDAQ Composite",
      "value": 15234.50,
      "percentChange": 1.25,
      "advancers": 2400,
      "decliners": 1200
    },
    "gainers": [...],
    "losers": [...],
    "sectors": [...]
  }
}
```

### 4. Get Top Movers
**GET** `/api/exchanges/:id/top-movers`

Query Parameters:
- `type`: "gainers" | "losers" | "active" (required)
- `limit`: Number of results (default: 20)

**Example Request:**
```bash
GET /api/exchanges/NYSE/top-movers?type=gainers&limit=10
```

### 5. Get Index Chart Data
**GET** `/api/exchanges/:id/chart`

Query Parameters:
- `timeframe`: "1D" | "1W" | "1M" | "1Y" (default: "1D")
- `resolution`: "1m" | "5m" | "15m" | "1h" | "1d" (default: "1h")

**Example Request:**
```bash
GET /api/exchanges/ASX/chart?timeframe=1M&resolution=1d
```

### 6. Get Sector Performance
**GET** `/api/exchanges/:id/sectors`

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Technology",
      "performance": 2.34,
      "companies": 450,
      "marketCap": 12000000000000
    },
    {
      "name": "Finance",
      "performance": 0.45,
      "companies": 320,
      "marketCap": 8500000000000
    }
  ]
}
```

### 7. Get Exchange News
**GET** `/api/exchanges/:id/news`

Query Parameters:
- `limit`: Results per page (default: 20)
- `page`: Page number (default: 1)

---

## 💱 Currencies Endpoints

### 1. List All Currencies
**GET** `/api/currencies`

**Example Request:**
```bash
GET /api/currencies?region=Asia&limit=10
```

### 2. Get Currency Details
**GET** `/api/currencies/:code`

**Example Request:**
```bash
GET /api/currencies/EUR
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "code": "EUR",
    "name": "Euro",
    "symbol": "€",
    "country": "European Union",
    "type": "fiat",
    "centralBank": "European Central Bank",
    "description": "Currency of the Eurozone"
  }
}
```

### 3. Get Exchange Rates
**GET** `/api/currencies/:code/rates`

**Example Request:**
```bash
GET /api/currencies/USD/rates
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "baseCurrency": "USD",
    "rates": {
      "EUR": 0.92,
      "GBP": 0.79,
      "JPY": 155.00,
      "AUD": 1.52
    },
    "timestamp": "2024-05-07T12:00:00Z"
  }
}
```

### 4. Get Rate Between Two Currencies
**GET** `/api/currencies/:from/:to`

**Example Request:**
```bash
GET /api/currencies/USD/EUR
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "from": "USD",
    "to": "EUR",
    "rate": 0.92,
    "bid": 0.919,
    "ask": 0.921,
    "spread": 0.002
  }
}
```

### 5. Convert Amount
**POST** `/api/currencies/convert/amount`

**Request Body:**
```json
{
  "fromCode": "USD",
  "toCode": "EUR",
  "amount": 100
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "fromCode": "USD",
    "fromAmount": 100,
    "toCode": "EUR",
    "toAmount": 92.00,
    "rate": 0.92,
    "timestamp": "2024-05-07T12:00:00Z"
  }
}
```

### 6. Get Currency Chart
**GET** `/api/currencies/:code/chart`

Query Parameters:
- `against`: Base currency (default: "USD")
- `timeframe`: "1D" | "1W" | "1M" | "1Y" (default: "1M")

**Example Request:**
```bash
GET /api/currencies/EUR/chart?against=USD&timeframe=1Y
```

### 7. Get Popular Pairs
**GET** `/api/currencies/:code/pairs`

**Example Request:**
```bash
GET /api/currencies/USD/pairs?limit=10
```

### 8. Get Economic Data
**GET** `/api/currencies/:code/economic-data`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "currency": "USD",
    "interestRate": 5.25,
    "inflationRate": 3.4,
    "gdpGrowth": 2.5,
    "employment": 3.9,
    "lastUpdated": "2024-05-07T12:00:00Z"
  }
}
```

### 9. Get Linked Markets
**GET** `/api/currencies/:code/linked-markets`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "exchanges": ["NYSE", "NASDAQ"],
    "cryptoPairs": ["BTC/USD", "ETH/USD"]
  }
}
```

---

## 🪙 Cryptocurrencies Endpoints

### 1. List All Cryptocurrencies
**GET** `/api/cryptos`

Query Parameters:
- `category`: "Layer 1" | "Layer 2" | "DeFi" | "Stablecoin" | etc.
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)

**Example Request:**
```bash
GET /api/cryptos?category=Layer%201&limit=10
```

### 2. Get Crypto Details
**GET** `/api/cryptos/:id`

**Example Request:**
```bash
GET /api/cryptos/bitcoin
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "bitcoin",
    "symbol": "BTC",
    "name": "Bitcoin",
    "category": "Layer 1",
    "launched": 2009,
    "founder": "Satoshi Nakamoto",
    "maxSupply": 21000000,
    "circulatingSupply": 21000000,
    "consensusMechanism": "Proof of Work"
  }
}
```

### 3. Get Current Price
**GET** `/api/cryptos/:id/price`

Query Parameters:
- `vs_currency`: Currency code (default: "USD")

**Example Request:**
```bash
GET /api/cryptos/ethereum/price?vs_currency=USD
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "ethereum",
    "symbol": "ETH",
    "price": 2850.50,
    "marketCap": 342000000000,
    "volume24h": 18500000000,
    "change24h": 125.30,
    "changePercent24h": 4.62,
    "ath": 4891.70,
    "atl": 0.50,
    "rank": 2
  }
}
```

### 4. Get Market Overview
**GET** `/api/cryptos/market/overview`

Query Parameters:
- `vs_currency`: Currency code (default: "USD")

**Example Response:**
```json
{
  "success": true,
  "data": {
    "gainers": [
      {
        "symbol": "SOL",
        "price": 142.50,
        "changePercent24h": 8.34
      }
    ],
    "losers": [...],
    "trending": [...],
    "marketStats": {
      "totalMarketCap": 1250000000000,
      "btcDominance": 45.2,
      "ethDominance": 18.5,
      "fear_and_greed_index": 68
    }
  }
}
```

### 5. Get Top Gainers
**GET** `/api/cryptos/market/top-gainers`

### 6. Get Top Losers
**GET** `/api/cryptos/market/top-losers`

### 7. Get Price Chart
**GET** `/api/cryptos/:id/chart`

Query Parameters:
- `vs_currency`: Currency (default: "USD")
- `timeframe`: "1h" | "24h" | "7d" | "30d" | "1y" | "all"

**Example Request:**
```bash
GET /api/cryptos/bitcoin/chart?vs_currency=USD&timeframe=7d
```

### 8. Get Trading Pairs
**GET** `/api/cryptos/:id/pairs`

Query Parameters:
- `limit`: Number of pairs (default: 20)

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "pair": "BTC/USD",
      "price": 67890.50,
      "volume24h": 45000000000,
      "exchange": "Binance"
    },
    {
      "pair": "BTC/USDT",
      "price": 67889.75,
      "volume24h": 42000000000,
      "exchange": "Binance"
    }
  ]
}
```

### 9. Get Exchanges Listing
**GET** `/api/cryptos/:id/exchanges`

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "exchange": "Binance",
      "volume24h": 45000000000,
      "volumePercent": 32.5
    },
    {
      "exchange": "Coinbase",
      "volume24h": 28000000000,
      "volumePercent": 20.1
    }
  ]
}
```

### 10. Get Crypto News
**GET** `/api/cryptos/:id/news`

Query Parameters:
- `limit`: Results per page (default: 20)
- `page`: Page number (default: 1)

### 11. Get On-Chain Metrics
**GET** `/api/cryptos/:id/on-chain`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "bitcoin",
    "transactionsPerDay": 450000,
    "activeAddresses": 980000,
    "networkFees": 125000,
    "supplyMetrics": {
      "circulatingSupply": 21000000,
      "activeSupply": 19800000
    }
  }
}
```

### 12. Compare Assets
**GET** `/api/cryptos/:id/compare`

Query Parameters:
- `asset`: Asset to compare with (e.g., "SP500", "GOLD")
- `timeframe`: "1m" | "3m" | "6m" | "1y"

**Example Request:**
```bash
GET /api/cryptos/bitcoin/compare?asset=SP500&timeframe=1y
```

### 13. Get By Category
**GET** `/api/cryptos/category/:category`

---

## 🌍 Global Endpoints

### 1. Dashboard
**GET** `/api/dashboard`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "stocks": {
      "topExchanges": [...],
      "gainers": [...],
      "losers": [...]
    },
    "currencies": {
      "topPairs": [...],
      "gainers": [...],
      "losers": [...]
    },
    "crypto": {
      "topCryptos": [...],
      "gainers": [...],
      "losers": [...]
    },
    "news": [...]
  }
}
```

### 2. Global Market Data
**GET** `/api/global`

### 3. Global Search
**GET** `/api/search?q=search_term&type=exchange|currency|crypto`

**Example Request:**
```bash
GET /api/search?q=bitcoin
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "crypto",
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "BTC"
    },
    {
      "type": "crypto",
      "id": "bitcoin-cash",
      "name": "Bitcoin Cash",
      "symbol": "BCH"
    }
  ]
}
```

### 4. Health Check
**GET** `/health`

**Example Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-05-07T12:00:00Z"
}
```

---

## Error Handling

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "timestamp": "2024-05-07T12:00:00Z"
}
```

### Common HTTP Status Codes
- `200 OK`: Successful request
- `400 Bad Request`: Invalid parameters
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Rate Limiting (Future)
- **Free tier**: 100 requests/minute
- **Pro tier**: 1000 requests/minute
- **Enterprise**: Custom limits

---

## Data Update Frequency
- **Stock Data**: Every 1 minute (during trading hours)
- **Crypto Data**: Every 1 minute (24/7)
- **Currency Data**: Every 5 minutes
- **News**: Every 30 minutes

---

## Pagination

All list endpoints support pagination:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

For more information, see the main [README.md](./README.md)
