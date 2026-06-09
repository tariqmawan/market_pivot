#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const thDir = path.join(__dirname, '../src/client/i18n/locales/th');
const thFiles = fs.readdirSync(thDir).filter(f => f.endsWith('.json'));

const skipTerms = /^(USD|EUR|GBP|JPY|CNY|ETF|RSI|SMA|P\/E|EV|FCF|ROE|GDP|BOJ|FOMC|API|SSO|SLA|SOC|GDPR|CSV|JSON|PDF|JWT|2FA|VPN|SSL|AUM|PEG|P\/B|P\/S|AAPL|NYSE|NASDAQ|LSE|TSE|MarketsPivot|DeFi|AI|S&P|INR|ZAR|ECB|RBA|B3|BME|BMV|BSE|DFM|Euronext|HKEX|IDX|JSE|KRX|NSE|OMX|SET|SGX|SIX|SSE|SZSE|TSX|TWSE|XETRA|EN|ES|FR|LIVE|ET|CPI|BoJ|FOMC|DPA|OPEC|GPU|REIT|CRM|CEO|CFO|COO|CTO|ETFs|ISIN|CUSIP|YTD|MTD|52W|Starter|Professional|Business|Enterprise)$/i;

function countEnglish(obj, prefix = '') {
  let results = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? prefix + '.' + k : k;
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      results.push(...countEnglish(v, fullKey));
    } else if (typeof v === 'string' && v.length > 3 && !skipTerms.test(v)) {
      if (/^[a-zA-Z0-9\s\-_,.!?@#%&()+=/:'"\\|;<>~`$^*\[\]{}]+$/.test(v)) {
        results.push({ key: fullKey, value: v });
      }
    }
  }
  return results;
}

for (const file of thFiles) {
  const data = JSON.parse(fs.readFileSync(path.join(thDir, file), 'utf8'));
  const english = countEnglish(data);
  if (english.length > 0) {
    console.log('=== ' + file + ' (' + english.length + ' English values) ===');
    english.forEach(e => console.log('  ' + e.key + ' | ' + e.value.substring(0, 80)));
    console.log('');
  }
}
