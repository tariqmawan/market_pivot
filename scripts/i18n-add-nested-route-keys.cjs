const fs = require("fs");
const path = require("path");

const localeRoot = path.join(__dirname, "..", "src", "client", "i18n", "locales");
const langs = fs.readdirSync(localeRoot).filter((name) => fs.statSync(path.join(localeRoot, name)).isDirectory());

const enNav = {
  assetCoverage: "Asset Coverage",
  fx: "FX",
  etfsFunds: "ETFs & Funds",
  bondsAndYields: "Bonds & Yields",
  advancedScreener: "Advanced Screener",
  usd: "USD",
  eur: "EUR",
  gbp: "GBP",
  jpy: "JPY",
  inr: "INR",
  adminPanel: "Admin Panel",
  toggleSubmenu: "Toggle {{label}} submenu",
};

const hiNav = {
  assetCoverage: "एसेट कवरेज",
  fx: "एफएक्स",
  etfsFunds: "ईटीएफ और फंड",
  bondsAndYields: "बॉन्ड और यील्ड",
  advancedScreener: "एडवांस्ड स्क्रीनर",
  usd: "USD",
  eur: "EUR",
  gbp: "GBP",
  jpy: "JPY",
  inr: "INR",
  adminPanel: "एडमिन पैनल",
  toggleSubmenu: "{{label}} सबमेनू टॉगल करें",
};

const moduleFeatures = {
  markets_global_overview: {
    eyebrow: "Markets",
    title: "Global Overview",
    features: ["Major indices widgets", "Top gainers and losers", "Heatmaps", "Market sentiment"],
  },
  markets_pre_market: {
    eyebrow: "Markets",
    title: "Pre-Market",
    features: ["Pre-market movers", "Index futures", "Volume spikes", "Opening watchlist"],
  },
  markets_after_hours: {
    eyebrow: "Markets",
    title: "After Hours",
    features: ["After-hours movers", "Earnings reactions", "Extended-session volume", "News catalysts"],
  },
  markets_heatmaps: {
    eyebrow: "Markets",
    title: "Heatmaps",
    features: ["Equity heatmaps", "Sector performance", "Regional breadth", "Asset-class comparison"],
  },
  markets_movers: {
    eyebrow: "Markets",
    title: "Market Movers",
    features: ["Top gainers", "Top losers", "Most active", "Unusual volume"],
  },
  markets_volatility_index: {
    eyebrow: "Markets",
    title: "Volatility Index",
    features: ["VIX overview", "Fear and greed context", "Volatility term structure", "Risk dashboard"],
  },
  exchanges_region_americas: {
    eyebrow: "Exchanges",
    title: "By Region",
    features: ["Country filters", "Exchange statistics", "Listed companies", "Regional news"],
  },
  stocks_gainers: {
    eyebrow: "Stocks",
    title: "Top Gainers",
    features: ["Live gainers", "Volume filters", "Market cap filters", "Sector breakdown"],
  },
  stocks_losers: {
    eyebrow: "Stocks",
    title: "Top Losers",
    features: ["Live losers", "Risk alerts", "Index impact", "Watchlist actions"],
  },
  crypto_trending: {
    eyebrow: "Crypto",
    title: "Trending Coins",
    features: ["Trending coins", "Market cap ranking", "Exchange listings", "Historical performance"],
  },
  crypto_meme_coins: {
    eyebrow: "Crypto",
    title: "Meme Coins",
    features: ["Meme coin rankings", "Volume bursts", "Community momentum", "Risk flags"],
  },
  crypto_defi: {
    eyebrow: "Crypto",
    title: "DeFi",
    features: ["DeFi ecosystem", "TVL metrics", "Protocol categories", "Token performance"],
  },
  crypto_layer_1: {
    eyebrow: "Crypto",
    title: "Layer 1",
    features: ["Layer 1 chains", "Consensus details", "Tokenomics", "Developer ecosystem"],
  },
  crypto_stablecoins: {
    eyebrow: "Crypto",
    title: "Stablecoins",
    features: ["Stablecoin supply", "Peg monitoring", "Exchange liquidity", "Reserve context"],
  },
  commodities_energy: {
    eyebrow: "Commodities",
    title: "Energy",
    features: ["Spot prices", "Futures prices", "Supply-demand analysis", "Correlation analysis"],
  },
  commodities_metals: {
    eyebrow: "Commodities",
    title: "Metals",
    features: ["Precious metals", "Industrial metals", "Futures contracts", "Currency sensitivity"],
  },
  commodities_agriculture: {
    eyebrow: "Commodities",
    title: "Agriculture",
    features: ["Crop markets", "Weather impact", "Supply regions", "Seasonality"],
  },
  commodities_industrial: {
    eyebrow: "Commodities",
    title: "Industrial",
    features: ["Industrial inputs", "Demand trends", "Manufacturing signals", "Regional supply"],
  },
  news_regions: {
    eyebrow: "News",
    title: "Regional News",
    features: ["Region-wise news", "Macro summaries", "Country filters", "Market alerts"],
  },
  news_sectors: {
    eyebrow: "News",
    title: "Sector News",
    features: ["Sector-wise news", "Theme tracking", "AI summaries", "ETF impact"],
  },
  news_crypto: {
    eyebrow: "News",
    title: "Crypto News",
    features: ["Crypto news", "On-chain context", "Regulation updates", "Exchange developments"],
  },
  news_alerts: {
    eyebrow: "News",
    title: "Market Alerts",
    features: ["Market alerts", "Breaking catalysts", "Watchlist alerts", "Importance filters"],
  },
};

const hiModulePages = {
  markets_global_overview: { eyebrow: "बाज़ार", title: "वैश्विक अवलोकन", features: ["प्रमुख इंडेक्स विजेट", "शीर्ष बढ़ने और गिरने वाले", "हीटमैप", "मार्केट सेंटिमेंट"] },
  markets_pre_market: { eyebrow: "बाज़ार", title: "प्री-मार्केट", features: ["प्री-मार्केट मूवर्स", "इंडेक्स फ्यूचर्स", "वॉल्यूम स्पाइक", "ओपनिंग वॉचलिस्ट"] },
  markets_after_hours: { eyebrow: "बाज़ार", title: "आफ्टर-आवर्स", features: ["आफ्टर-आवर्स मूवर्स", "अर्निंग्स प्रतिक्रियाएं", "एक्सटेंडेड-सेशन वॉल्यूम", "समाचार कैटेलिस्ट"] },
  markets_heatmaps: { eyebrow: "बाज़ार", title: "हीटमैप", features: ["इक्विटी हीटमैप", "सेक्टर प्रदर्शन", "क्षेत्रीय ब्रेड्थ", "एसेट-क्लास तुलना"] },
  markets_movers: { eyebrow: "बाज़ार", title: "मार्केट मूवर्स", features: ["शीर्ष बढ़ने वाले", "शीर्ष गिरने वाले", "सबसे सक्रिय", "असामान्य वॉल्यूम"] },
  markets_volatility_index: { eyebrow: "बाज़ार", title: "वोलैटिलिटी इंडेक्स", features: ["VIX अवलोकन", "फियर और ग्रीड संदर्भ", "वोलैटिलिटी टर्म स्ट्रक्चर", "रिस्क डैशबोर्ड"] },
  stocks_gainers: { eyebrow: "शेयर", title: "शीर्ष बढ़ने वाले", features: ["लाइव गेनर्स", "वॉल्यूम फिल्टर", "मार्केट कैप फिल्टर", "सेक्टर ब्रेकडाउन"] },
  stocks_losers: { eyebrow: "शेयर", title: "शीर्ष गिरने वाले", features: ["लाइव लूज़र्स", "रिस्क अलर्ट", "इंडेक्स प्रभाव", "वॉचलिस्ट एक्शन"] },
  crypto_trending: { eyebrow: "क्रिप्टो", title: "ट्रेंडिंग कॉइन्स", features: ["ट्रेंडिंग कॉइन्स", "मार्केट कैप रैंकिंग", "एक्सचेंज लिस्टिंग", "ऐतिहासिक प्रदर्शन"] },
  crypto_meme_coins: { eyebrow: "क्रिप्टो", title: "मीम कॉइन्स", features: ["मीम कॉइन रैंकिंग", "वॉल्यूम बर्स्ट", "कम्युनिटी मोमेंटम", "रिस्क फ्लैग"] },
  crypto_defi: { eyebrow: "क्रिप्टो", title: "DeFi", features: ["DeFi इकोसिस्टम", "TVL मेट्रिक्स", "प्रोटोकॉल कैटेगरी", "टोकन प्रदर्शन"] },
  crypto_layer_1: { eyebrow: "क्रिप्टो", title: "लेयर 1", features: ["लेयर 1 चेन", "कंसेंसस विवरण", "टोकनोमिक्स", "डेवलपर इकोसिस्टम"] },
  crypto_stablecoins: { eyebrow: "क्रिप्टो", title: "स्टेबलकॉइन्स", features: ["स्टेबलकॉइन सप्लाई", "पेग मॉनिटरिंग", "एक्सचेंज लिक्विडिटी", "रिज़र्व संदर्भ"] },
  commodities_energy: { eyebrow: "वस्तुएं", title: "ऊर्जा", features: ["स्पॉट कीमतें", "फ्यूचर्स कीमतें", "सप्लाई-डिमांड विश्लेषण", "कोरिलेशन विश्लेषण"] },
  commodities_metals: { eyebrow: "वस्तुएं", title: "धातु", features: ["कीमती धातु", "औद्योगिक धातु", "फ्यूचर्स कॉन्ट्रैक्ट", "करेंसी संवेदनशीलता"] },
  commodities_agriculture: { eyebrow: "वस्तुएं", title: "कृषि", features: ["फसल बाज़ार", "मौसम प्रभाव", "सप्लाई क्षेत्र", "सीज़नैलिटी"] },
  commodities_industrial: { eyebrow: "वस्तुएं", title: "औद्योगिक", features: ["औद्योगिक इनपुट", "डिमांड ट्रेंड", "मैन्युफैक्चरिंग संकेत", "क्षेत्रीय सप्लाई"] },
  news_regions: { eyebrow: "समाचार", title: "क्षेत्रीय समाचार", features: ["क्षेत्रवार समाचार", "मैक्रो सारांश", "देश फिल्टर", "मार्केट अलर्ट"] },
  news_sectors: { eyebrow: "समाचार", title: "सेक्टर समाचार", features: ["सेक्टरवार समाचार", "थीम ट्रैकिंग", "AI सारांश", "ETF प्रभाव"] },
  news_crypto: { eyebrow: "समाचार", title: "क्रिप्टो समाचार", features: ["क्रिप्टो समाचार", "ऑन-चेन संदर्भ", "रेगुलेशन अपडेट", "एक्सचेंज विकास"] },
  news_alerts: { eyebrow: "समाचार", title: "मार्केट अलर्ट", features: ["मार्केट अलर्ट", "ब्रेकिंग कैटेलिस्ट", "वॉचलिस्ट अलर्ट", "इम्पोर्टेंस फिल्टर"] },
};

const categoryPages = {
  commodities_energy: {
    eyebrow: "Energy Markets",
    title: "Energy Commodities",
    description: "Oil, natural gas, coal, and renewable energy commodity prices and futures.",
    items: { WTI_Crude: "WTI Crude", Brent_Crude: "Brent Crude", Natural_Gas: "Natural Gas", Coal: "Coal" },
    features: ["Spot prices", "Futures contracts", "Supply-demand analysis", "Geopolitical impacts"],
    insights: ["OPEC decisions", "US inventory data", "Global demand trends", "Seasonal patterns"],
  },
  commodities_metals: {
    eyebrow: "Precious & Industrial",
    title: "Metals Market",
    description: "Gold, silver, copper, and industrial metal prices with hedging strategies.",
    items: { Gold: "Gold", Silver: "Silver", Copper: "Copper", Platinum: "Platinum" },
    features: ["Precious metals", "Industrial metals", "Futures pricing", "Safe-haven flows"],
    insights: ["USD strength", "Fed policy impact", "Industrial demand", "Inflation hedge"],
  },
  commodities_agriculture: {
    eyebrow: "Agri Commodities",
    title: "Agriculture Markets",
    description: "Crop commodities including wheat, corn, soybeans, and sugar futures.",
    items: { Wheat: "Wheat", Corn: "Corn", Soybeans: "Soybeans", Sugar: "Sugar" },
    features: ["Crop cycles", "Weather impacts", "Supply estimates", "Seasonal trends"],
    insights: ["Harvest reports", "Weather patterns", "Global supply", "Demand shifts"],
  },
  commodities_industrial: {
    eyebrow: "Industrial Inputs",
    title: "Industrial Commodities",
    description: "Industrial materials like lithium, rare earths, and construction commodities.",
    items: { Lithium: "Lithium", Steel: "Steel", Aluminum: "Aluminum", Uranium: "Uranium" },
    features: ["Energy transition", "Manufacturing demand", "EV demand", "Tech usage"],
    insights: ["Green transition", "Supply chain", "Demand cycle", "Technology trends"],
  },
  news_regions: {
    eyebrow: "Global Markets",
    title: "Regional News",
    description: "Market news and analysis categorized by geographic regions and trading blocs.",
    items: {},
    features: ["Americas news", "Europe coverage", "Asia-Pacific", "EMEA updates"],
    insights: ["Regional GDP", "Earnings season", "Central banks", "Trade policies"],
  },
  news_sectors: {
    eyebrow: "Equity Markets",
    title: "Sector News",
    description: "Sector-specific news including earnings, M&A, and thematic trends.",
    items: {},
    features: ["Tech coverage", "Financial news", "Healthcare updates", "Energy sector"],
    insights: ["Earnings reports", "Industry trends", "M&A activity", "Regulatory news"],
  },
  news_crypto: {
    eyebrow: "Digital Assets",
    title: "Crypto News",
    description: "Cryptocurrency market news, regulation updates, and on-chain analysis.",
    items: {},
    features: ["Price movements", "Regulation", "On-chain data", "Exchange news"],
    insights: ["Regulatory updates", "Protocol news", "Market sentiment", "Developer activity"],
  },
  news_alerts: {
    eyebrow: "Real-Time Updates",
    title: "Market Alerts",
    description: "Breaking news, critical events, and market-moving catalysts in real-time.",
    items: {},
    features: ["Breaking news", "Market moving", "Critical alerts", "Watchlist alerts"],
    insights: ["Earnings surprises", "Economic data", "Policy changes", "Macro events"],
  },
};

const hiCategoryPages = {
  commodities_energy: { eyebrow: "ऊर्जा बाज़ार", title: "ऊर्जा कमोडिटीज़", description: "तेल, प्राकृतिक गैस, कोयला और नवीकरणीय ऊर्जा कमोडिटी कीमतें व फ्यूचर्स।", items: { WTI_Crude: "WTI क्रूड", Brent_Crude: "ब्रेंट क्रूड", Natural_Gas: "प्राकृतिक गैस", Coal: "कोयला" }, features: ["स्पॉट कीमतें", "फ्यूचर्स कॉन्ट्रैक्ट", "सप्लाई-डिमांड विश्लेषण", "भू-राजनीतिक प्रभाव"], insights: ["OPEC फैसले", "US इन्वेंटरी डेटा", "वैश्विक मांग ट्रेंड", "मौसमी पैटर्न"] },
  commodities_metals: { eyebrow: "कीमती और औद्योगिक", title: "धातु बाज़ार", description: "सोना, चांदी, कॉपर और औद्योगिक धातु कीमतें हेजिंग रणनीतियों के साथ।", items: { Gold: "सोना", Silver: "चांदी", Copper: "कॉपर", Platinum: "प्लैटिनम" }, features: ["कीमती धातु", "औद्योगिक धातु", "फ्यूचर्स प्राइसिंग", "सेफ-हेवन फ्लो"], insights: ["USD मजबूती", "Fed नीति प्रभाव", "औद्योगिक मांग", "महंगाई हेज"] },
  commodities_agriculture: { eyebrow: "कृषि कमोडिटीज़", title: "कृषि बाज़ार", description: "गेहूं, मक्का, सोयाबीन और चीनी सहित फसल कमोडिटी फ्यूचर्स।", items: { Wheat: "गेहूं", Corn: "मक्का", Soybeans: "सोयाबीन", Sugar: "चीनी" }, features: ["फसल चक्र", "मौसम प्रभाव", "सप्लाई अनुमान", "मौसमी ट्रेंड"], insights: ["हार्वेस्ट रिपोर्ट", "मौसम पैटर्न", "वैश्विक सप्लाई", "मांग बदलाव"] },
  commodities_industrial: { eyebrow: "औद्योगिक इनपुट", title: "औद्योगिक कमोडिटीज़", description: "लिथियम, रेयर अर्थ और निर्माण सामग्री जैसी औद्योगिक वस्तुएं।", items: { Lithium: "लिथियम", Steel: "स्टील", Aluminum: "एल्युमिनियम", Uranium: "यूरेनियम" }, features: ["ऊर्जा संक्रमण", "मैन्युफैक्चरिंग मांग", "EV मांग", "टेक उपयोग"], insights: ["ग्रीन ट्रांज़िशन", "सप्लाई चेन", "डिमांड साइकिल", "टेक्नोलॉजी ट्रेंड"] },
  news_regions: { eyebrow: "वैश्विक बाज़ार", title: "क्षेत्रीय समाचार", description: "भौगोलिक क्षेत्रों और ट्रेडिंग ब्लॉक्स के अनुसार बाज़ार समाचार और विश्लेषण।", items: {}, features: ["अमेरिका समाचार", "यूरोप कवरेज", "एशिया-पैसिफिक", "EMEA अपडेट"], insights: ["क्षेत्रीय GDP", "अर्निंग्स सीज़न", "सेंट्रल बैंक", "ट्रेड नीतियां"] },
  news_sectors: { eyebrow: "इक्विटी बाज़ार", title: "सेक्टर समाचार", description: "अर्निंग्स, M&A और थीमैटिक ट्रेंड सहित सेक्टर-विशिष्ट समाचार।", items: {}, features: ["टेक कवरेज", "वित्तीय समाचार", "हेल्थकेयर अपडेट", "ऊर्जा सेक्टर"], insights: ["अर्निंग्स रिपोर्ट", "इंडस्ट्री ट्रेंड", "M&A गतिविधि", "रेगुलेटरी समाचार"] },
  news_crypto: { eyebrow: "डिजिटल एसेट्स", title: "क्रिप्टो समाचार", description: "क्रिप्टोकरेंसी बाज़ार समाचार, रेगुलेशन अपडेट और ऑन-चेन विश्लेषण।", items: {}, features: ["कीमत मूवमेंट", "रेगुलेशन", "ऑन-चेन डेटा", "एक्सचेंज समाचार"], insights: ["रेगुलेटरी अपडेट", "प्रोटोकॉल समाचार", "मार्केट सेंटिमेंट", "डेवलपर गतिविधि"] },
  news_alerts: { eyebrow: "रीयल-टाइम अपडेट", title: "मार्केट अलर्ट", description: "ब्रेकिंग न्यूज़, महत्वपूर्ण घटनाएं और रीयल-टाइम मार्केट-मूविंग कैटेलिस्ट।", items: {}, features: ["ब्रेकिंग न्यूज़", "मार्केट मूविंग", "महत्वपूर्ण अलर्ट", "वॉचलिस्ट अलर्ट"], insights: ["अर्निंग्स सरप्राइज़", "आर्थिक डेटा", "नीति बदलाव", "मैक्रो घटनाएं"] },
};

const enCommon = {
  backToDashboard: "Back to Dashboard",
  itemsTracked: "Items tracked",
  multiple: "Multiple",
  updatesDaily: "Updates daily",
  realTime: "Real-time",
  liveData: "Live data",
  marketOverview: "Market Overview",
  whatsIncluded: "What's Included",
  keyDrivers: "Key Drivers",
  whatToWatch: "What to Watch",
  exploreMore: "Explore More",
  stayUpdated: "Stay Updated",
  comprehensiveTrackingIncluded: "Comprehensive tracking and analysis included",
  monitorMarketImpact: "Monitor for market impact and opportunities",
  subscribeCategoryAlerts: "Subscribe to alerts and get real-time notifications for this category",
  manageAlerts: "Manage Alerts",
};

const hiCommon = {
  backToDashboard: "डैशबोर्ड पर वापस जाएं",
  itemsTracked: "ट्रैक किए गए आइटम",
  multiple: "कई",
  updatesDaily: "दैनिक अपडेट",
  realTime: "रीयल-टाइम",
  liveData: "लाइव डेटा",
  marketOverview: "मार्केट अवलोकन",
  whatsIncluded: "क्या शामिल है",
  keyDrivers: "मुख्य ड्राइवर",
  whatToWatch: "क्या देखें",
  exploreMore: "और देखें",
  stayUpdated: "अपडेट रहें",
  comprehensiveTrackingIncluded: "व्यापक ट्रैकिंग और विश्लेषण शामिल है",
  monitorMarketImpact: "बाज़ार प्रभाव और अवसरों के लिए मॉनिटर करें",
  subscribeCategoryAlerts: "इस कैटेगरी के लिए रीयल-टाइम नोटिफिकेशन पाने हेतु अलर्ट सब्सक्राइब करें",
  manageAlerts: "अलर्ट प्रबंधित करें",
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      target[key] = deepMerge(target[key] && typeof target[key] === "object" ? target[key] : {}, value);
    } else if (target[key] === undefined || target[key] === key || String(target[key]).startsWith("अनुवाद:")) {
      target[key] = value;
    }
  }
  return target;
}

for (const lang of langs) {
  const navFile = path.join(localeRoot, lang, "nav.json");
  const commonFile = path.join(localeRoot, lang, "common.json");
  const nav = readJson(navFile);
  const common = readJson(commonFile);

  deepMerge(nav, lang === "hi" ? hiNav : enNav);
  deepMerge(common, {
    ...(lang === "hi" ? hiCommon : enCommon),
    modulePages: lang === "hi" ? { ...moduleFeatures, ...hiModulePages } : moduleFeatures,
    categoryPages: lang === "hi" ? hiCategoryPages : categoryPages,
  });

  writeJson(navFile, nav);
  writeJson(commonFile, common);
}

console.log(`Added nested route i18n keys for ${langs.length} locales.`);
