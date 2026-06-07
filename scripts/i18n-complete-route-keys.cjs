const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LOCALES = path.join(ROOT, "src", "client", "i18n", "locales");

const langs = fs.readdirSync(LOCALES).filter((entry) =>
  fs.statSync(path.join(LOCALES, entry)).isDirectory()
);

const byLang = {
  en: {
    preMarket: "Pre-Market Overview",
    afterHours: "After-Hours Market Activity",
    heatmaps: "Global Market Heatmaps",
    movers: "Top Movers & Activity",
    volatility: "Volatility Index Dashboard",
    memeCoins: "Meme Coins",
    energyCommodities: "Energy Commodities",
    regionalNews: "Regional News",
    technology: "Technology",
    americas: "Americas",
    marketCap: "Market cap:",
    volume: "Volume:",
    pending: "Pending",
    today: "Today",
    expected: "Expected: {{time}}",
  },
  hi: {
    preMarket: "प्री-मार्केट अवलोकन",
    afterHours: "आफ्टर-आवर्स मार्केट गतिविधि",
    heatmaps: "वैश्विक मार्केट हीटमैप",
    movers: "शीर्ष मूवर्स और गतिविधि",
    volatility: "वोलैटिलिटी इंडेक्स डैशबोर्ड",
    memeCoins: "मीम कॉइन्स",
    energyCommodities: "ऊर्जा कमोडिटीज़",
    regionalNews: "क्षेत्रीय समाचार",
    technology: "तकनीक",
    americas: "अमेरिका",
    marketCap: "मार्केट कैप:",
    volume: "वॉल्यूम:",
    pending: "लंबित",
    today: "आज",
    expected: "अपेक्षित: {{time}}",
  },
  es: {
    preMarket: "Resumen premercado",
    afterHours: "Actividad fuera de horario",
    heatmaps: "Mapas de calor globales",
    movers: "Mayores movimientos y actividad",
    volatility: "Panel del índice de volatilidad",
    memeCoins: "Monedas meme",
    energyCommodities: "Materias primas energéticas",
    regionalNews: "Noticias regionales",
    technology: "Tecnología",
    americas: "Américas",
    marketCap: "Cap. de mercado:",
    volume: "Volumen:",
    pending: "Pendiente",
    today: "Hoy",
    expected: "Esperado: {{time}}",
  },
  fr: {
    preMarket: "Aperçu pré-marché",
    afterHours: "Activité après clôture",
    heatmaps: "Cartes thermiques mondiales",
    movers: "Principaux mouvements et activité",
    volatility: "Tableau de bord de volatilité",
    memeCoins: "Meme coins",
    energyCommodities: "Matières premières énergétiques",
    regionalNews: "Actualités régionales",
    technology: "Technologie",
    americas: "Amériques",
    marketCap: "Capitalisation:",
    volume: "Volume:",
    pending: "En attente",
    today: "Aujourd'hui",
    expected: "Attendu : {{time}}",
  },
  de: {
    preMarket: "Vorbörslicher Überblick",
    afterHours: "Nachbörsliche Marktaktivität",
    heatmaps: "Globale Markt-Heatmaps",
    movers: "Top-Beweger und Aktivität",
    volatility: "Volatilitätsindex-Dashboard",
    memeCoins: "Meme-Coins",
    energyCommodities: "Energie-Rohstoffe",
    regionalNews: "Regionale Nachrichten",
    technology: "Technologie",
    americas: "Amerika",
    marketCap: "Marktkapitalisierung:",
    volume: "Volumen:",
    pending: "Ausstehend",
    today: "Heute",
    expected: "Erwartet: {{time}}",
  },
  pt: {
    preMarket: "Visão pré-mercado",
    afterHours: "Atividade pós-fechamento",
    heatmaps: "Mapas de calor globais",
    movers: "Maiores movimentos e atividade",
    volatility: "Painel do índice de volatilidade",
    memeCoins: "Meme coins",
    energyCommodities: "Commodities de energia",
    regionalNews: "Notícias regionais",
    technology: "Tecnologia",
    americas: "Américas",
    marketCap: "Valor de mercado:",
    volume: "Volume:",
    pending: "Pendente",
    today: "Hoje",
    expected: "Esperado: {{time}}",
  },
  ru: {
    preMarket: "Обзор премаркета",
    afterHours: "Активность после закрытия",
    heatmaps: "Глобальные тепловые карты",
    movers: "Главные движения и активность",
    volatility: "Панель индекса волатильности",
    memeCoins: "Мем-коины",
    energyCommodities: "Энергетические товары",
    regionalNews: "Региональные новости",
    technology: "Технологии",
    americas: "Америка",
    marketCap: "Капитализация:",
    volume: "Объем:",
    pending: "Ожидается",
    today: "Сегодня",
    expected: "Ожидается: {{time}}",
  },
  zh: {
    preMarket: "盘前概览",
    afterHours: "盘后市场活动",
    heatmaps: "全球市场热力图",
    movers: "涨跌与活跃榜",
    volatility: "波动率指数仪表板",
    memeCoins: "迷因币",
    energyCommodities: "能源大宗商品",
    regionalNews: "区域新闻",
    technology: "科技",
    americas: "美洲",
    marketCap: "市值：",
    volume: "成交量：",
    pending: "待定",
    today: "今天",
    expected: "预期：{{time}}",
  },
  ja: {
    preMarket: "プレマーケット概要",
    afterHours: "時間外市場の動き",
    heatmaps: "グローバル市場ヒートマップ",
    movers: "主要な値動きと出来高",
    volatility: "ボラティリティ指数ダッシュボード",
    memeCoins: "ミームコイン",
    energyCommodities: "エネルギー商品",
    regionalNews: "地域ニュース",
    technology: "テクノロジー",
    americas: "米州",
    marketCap: "時価総額:",
    volume: "出来高:",
    pending: "保留中",
    today: "今日",
    expected: "予定: {{time}}",
  },
  ko: {
    preMarket: "프리마켓 개요",
    afterHours: "시간외 시장 활동",
    heatmaps: "글로벌 시장 히트맵",
    movers: "주요 변동 및 활동",
    volatility: "변동성 지수 대시보드",
    memeCoins: "밈 코인",
    energyCommodities: "에너지 원자재",
    regionalNews: "지역 뉴스",
    technology: "기술",
    americas: "아메리카",
    marketCap: "시가총액:",
    volume: "거래량:",
    pending: "대기 중",
    today: "오늘",
    expected: "예상: {{time}}",
  },
  ar: {
    preMarket: "نظرة ما قبل السوق",
    afterHours: "نشاط ما بعد الإغلاق",
    heatmaps: "خرائط حرارة الأسواق العالمية",
    movers: "أكبر التحركات والنشاط",
    volatility: "لوحة مؤشر التقلب",
    memeCoins: "عملات الميم",
    energyCommodities: "سلع الطاقة",
    regionalNews: "أخبار إقليمية",
    technology: "التكنولوجيا",
    americas: "الأمريكتان",
    marketCap: "القيمة السوقية:",
    volume: "الحجم:",
    pending: "قيد الانتظار",
    today: "اليوم",
    expected: "متوقع: {{time}}",
  },
  id: {
    preMarket: "Ikhtisar pra-pasar",
    afterHours: "Aktivitas setelah jam bursa",
    heatmaps: "Peta panas pasar global",
    movers: "Penggerak utama dan aktivitas",
    volatility: "Dasbor indeks volatilitas",
    memeCoins: "Koin meme",
    energyCommodities: "Komoditas energi",
    regionalNews: "Berita regional",
    technology: "Teknologi",
    americas: "Amerika",
    marketCap: "Kapitalisasi pasar:",
    volume: "Volume:",
    pending: "Tertunda",
    today: "Hari ini",
    expected: "Perkiraan: {{time}}",
  },
  ms: {
    preMarket: "Gambaran pra-pasaran",
    afterHours: "Aktiviti selepas waktu dagangan",
    heatmaps: "Peta haba pasaran global",
    movers: "Penggerak utama dan aktiviti",
    volatility: "Papan pemuka indeks volatiliti",
    memeCoins: "Syiling meme",
    energyCommodities: "Komoditi tenaga",
    regionalNews: "Berita serantau",
    technology: "Teknologi",
    americas: "Amerika",
    marketCap: "Modal pasaran:",
    volume: "Volum:",
    pending: "Belum selesai",
    today: "Hari ini",
    expected: "Dijangka: {{time}}",
  },
  tr: {
    preMarket: "Piyasa öncesi görünüm",
    afterHours: "Seans sonrası piyasa hareketi",
    heatmaps: "Küresel piyasa ısı haritaları",
    movers: "En çok hareket edenler ve aktivite",
    volatility: "Volatilite endeksi paneli",
    memeCoins: "Meme coinler",
    energyCommodities: "Enerji emtiaları",
    regionalNews: "Bölgesel haberler",
    technology: "Teknoloji",
    americas: "Amerika",
    marketCap: "Piyasa değeri:",
    volume: "Hacim:",
    pending: "Beklemede",
    today: "Bugün",
    expected: "Beklenen: {{time}}",
  },
  pl: {
    preMarket: "Przegląd przed sesją",
    afterHours: "Aktywność po sesji",
    heatmaps: "Globalne mapy cieplne rynku",
    movers: "Największe ruchy i aktywność",
    volatility: "Panel indeksu zmienności",
    memeCoins: "Meme coiny",
    energyCommodities: "Surowce energetyczne",
    regionalNews: "Wiadomości regionalne",
    technology: "Technologia",
    americas: "Ameryki",
    marketCap: "Kapitalizacja:",
    volume: "Wolumen:",
    pending: "Oczekuje",
    today: "Dzisiaj",
    expected: "Oczekiwane: {{time}}",
  },
  th: {
    preMarket: "ภาพรวมก่อนเปิดตลาด",
    afterHours: "กิจกรรมตลาดหลังเวลาทำการ",
    heatmaps: "ฮีตแมปตลาดโลก",
    movers: "หุ้นเคลื่อนไหวและกิจกรรมสูงสุด",
    volatility: "แดชบอร์ดดัชนีความผันผวน",
    memeCoins: "มีมคอยน์",
    energyCommodities: "สินค้าโภคภัณฑ์พลังงาน",
    regionalNews: "ข่าวภูมิภาค",
    technology: "เทคโนโลยี",
    americas: "อเมริกา",
    marketCap: "มูลค่าตลาด:",
    volume: "ปริมาณ:",
    pending: "รอดำเนินการ",
    today: "วันนี้",
    expected: "คาดการณ์: {{time}}",
  },
  vi: {
    preMarket: "Tổng quan trước giờ mở cửa",
    afterHours: "Hoạt động sau giờ giao dịch",
    heatmaps: "Bản đồ nhiệt thị trường toàn cầu",
    movers: "Biến động và hoạt động nổi bật",
    volatility: "Bảng điều khiển chỉ số biến động",
    memeCoins: "Đồng meme",
    energyCommodities: "Hàng hóa năng lượng",
    regionalNews: "Tin tức khu vực",
    technology: "Công nghệ",
    americas: "Châu Mỹ",
    marketCap: "Vốn hóa:",
    volume: "Khối lượng:",
    pending: "Đang chờ",
    today: "Hôm nay",
    expected: "Dự kiến: {{time}}",
  },
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function setPath(obj, dotted, value) {
  const parts = dotted.split(".");
  let cursor = obj;
  while (parts.length > 1) {
    const part = parts.shift();
    cursor[part] = cursor[part] && typeof cursor[part] === "object" && !Array.isArray(cursor[part])
      ? cursor[part]
      : {};
    cursor = cursor[part];
  }
  cursor[parts[0]] = value;
}

for (const lang of langs) {
  const tx = byLang[lang] ?? byLang.en;
  const commonPath = path.join(LOCALES, lang, "common.json");
  const marketsPath = path.join(LOCALES, lang, "markets.json");
  const navPath = path.join(LOCALES, lang, "nav.json");
  const common = readJson(commonPath);
  const markets = readJson(marketsPath);
  const nav = readJson(navPath);

  Object.assign(common, {
    src_client_pages_premarketpage__l94__h1: tx.preMarket,
    src_client_pages_afterhourspage__l35__h1: tx.afterHours,
    src_client_pages_heatmapspage__l160__h1: tx.heatmaps,
    src_client_pages_moverspage__l68__h1: tx.movers,
    src_client_pages_volatilityindexpage__l60__h1: tx.volatility,
  });

  setPath(common, "cryptoCategoryPages.meme_coins.title", tx.memeCoins);
  setPath(common, "categoryPages.commodities_energy.title", tx.energyCommodities);
  setPath(common, "categoryPages.news_regions.title", tx.regionalNews);

  Object.assign(nav, {
    technology: tx.technology,
    americas: tx.americas,
    memeCoins: tx.memeCoins,
    volatilityIndex: tx.volatility,
  });

  Object.assign(markets, {
    volumeShort: tx.volume,
    marketCap: tx.marketCap,
    viewMarketDashboard: lang === "hi" ? "मार्केट डैशबोर्ड देखें" : "View Market Dashboard",
    viewLatestEarningsNews: lang === "hi" ? "ताज़ा आय समाचार देखें" : "View Latest Earnings News",
    viewDashboard: lang === "hi" ? "डैशबोर्ड देखें" : "View Dashboard",
    launchScreener: lang === "hi" ? "स्क्रीनर खोलें" : "Launch Screener",
    launchAdvancedScreener: lang === "hi" ? "एडवांस्ड स्क्रीनर खोलें" : "Launch Advanced Screener",
    viewRiskDashboard: lang === "hi" ? "रिस्क डैशबोर्ड देखें" : "View Risk Dashboard",
    economicCalendar: lang === "hi" ? "आर्थिक कैलेंडर" : "Economic Calendar",
    equities: lang === "hi" ? "इक्विटी" : "Equities",
    expectedTime: tx.expected,
  });

  setPath(markets, "status.pending", tx.pending);
  setPath(markets, "status.today", tx.today);
  setPath(markets, "preMarket.futures", lang === "hi" ? "फ्यूचर्स" : "Futures");
  setPath(markets, "preMarket.volumeAboveAverage", lang === "hi" ? "20-दिन के औसत से ऊपर" : "Above 20-day average");
  setPath(markets, "preMarket.mixedSentiment", lang === "hi" ? "मिश्रित भावना" : "Mixed sentiment");
  setPath(markets, "preMarket.belowAverage", lang === "hi" ? "औसत से नीचे" : "Below average");
  setPath(markets, "preMarket.heavyBuying", lang === "hi" ? "मजबूत खरीदारी" : "Heavy buying");
  setPath(markets, "preMarket.sessionNote", lang === "hi" ? "NYSE और NASDAQ सुबह 9:30 ET पर खुलते हैं | प्री-मार्केट सत्र ओपन तक जारी रहता है" : "NYSE and NASDAQ open at 9:30 AM ET | Pre-market session continues until open");
  setPath(markets, "afterHours.extendedTradingDescription", lang === "hi" ? "विस्तारित ट्रेडिंग (4:00 PM - 8:00 PM ET) के दौरान महत्वपूर्ण मूल्य गतिविधि वाले शेयर" : "Stocks with significant price action during extended trading (4:00 PM - 8:00 PM ET)");
  setPath(markets, "heatmaps.tabs.globalExchanges", lang === "hi" ? "वैश्विक एक्सचेंज" : "Global Exchanges");
  setPath(markets, "heatmaps.tabs.sectorPerformance", lang === "hi" ? "सेक्टर प्रदर्शन" : "Sector Performance");
  setPath(markets, "heatmaps.tabs.regionalMarkets", lang === "hi" ? "क्षेत्रीय बाज़ार" : "Regional Markets");
  setPath(markets, "heatmaps.tabs.assetClasses", lang === "hi" ? "एसेट क्लास" : "Asset Classes");
  setPath(markets, "heatmaps.timePeriodSelection", lang === "hi" ? "समय अवधि चयन (1D, 1W, 1M, YTD, 1Y)" : "Time period selection (1D, 1W, 1M, YTD, 1Y)");
  setPath(markets, "heatmaps.ctaDescription", lang === "hi" ? "किसी भी बाजार, सेक्टर या क्षेत्र का विस्तृत विश्लेषण खोलने के लिए हीटमैप को शुरुआती बिंदु की तरह इस्तेमाल करें।" : "Use our heatmaps as a starting point to explore detailed breakdowns of any market, sector, or region. Click any cell to view comprehensive analysis.");
  setPath(markets, "movers.topGainersTab", lang === "hi" ? "शीर्ष बढ़ने वाले" : "Top Gainers");
  setPath(markets, "movers.topLosersTab", lang === "hi" ? "शीर्ष गिरने वाले" : "Top Losers");
  setPath(markets, "movers.mostActiveTab", lang === "hi" ? "सबसे सक्रिय" : "Most Active");
  setPath(markets, "volatility.currentSentiment", lang === "hi" ? "वर्तमान भावना" : "Current Sentiment");
  setPath(markets, "volatility.termStructureDescription", lang === "hi" ? "विभिन्न विकल्प समाप्ति तिथियों में निहित वोलैटिलिटी भविष्य की कीमतों के उतार-चढ़ाव की बाजार अपेक्षाएँ दिखाती है।" : "Implied volatility across different option expiration dates shows market expectations for future price swings.");
  setPath(markets, "volatility.ctaDescription", lang === "hi" ? "पोज़िशन साइजिंग और हेज रणनीतियों को समायोजित करने के लिए वोलैटिलिटी मीट्रिक्स का उपयोग करें।" : "Use volatility metrics to adjust position sizing and hedge strategies");
  setPath(markets, "volatility.metricDescriptions.vix", lang === "hi" ? "इक्विटी बाजार वोलैटिलिटी का डर सूचक" : "Fear gauge for equity market volatility");
  setPath(markets, "volatility.metricDescriptions.vxn", lang === "hi" ? "टेक सेक्टर वोलैटिलिटी माप" : "Tech sector volatility measure");
  setPath(markets, "volatility.metricDescriptions.rvx", lang === "hi" ? "स्मॉल-कैप शेयरों की वोलैटिलिटी" : "Small-cap stock volatility");
  setPath(markets, "volatility.metricDescriptions.move", lang === "hi" ? "ट्रेजरी बाजार वोलैटिलिटी" : "Treasury market volatility");
  setPath(markets, "volatility.regimes.low", lang === "hi" ? "कम (<15)" : "Low (<15)");
  setPath(markets, "volatility.regimes.normal", lang === "hi" ? "सामान्य (15-25)" : "Normal (15-25)");
  setPath(markets, "volatility.regimes.elevated", lang === "hi" ? "ऊँचा (25-35)" : "Elevated (25-35)");
  setPath(markets, "volatility.regimes.high", lang === "hi" ? "उच्च (>35)" : "High (>35)");
  setPath(markets, "volatility.regimeDescriptions.low", lang === "hi" ? "बाजार में आत्मसंतोष" : "Market complacency");
  setPath(markets, "volatility.regimeDescriptions.normal", lang === "hi" ? "स्वस्थ बाजार स्थितियाँ" : "Healthy market conditions");
  setPath(markets, "volatility.regimeDescriptions.elevated", lang === "hi" ? "बढ़ी हुई अनिश्चितता" : "Increased uncertainty");
  setPath(markets, "volatility.regimeDescriptions.high", lang === "hi" ? "अत्यधिक भय की स्थिति" : "Extreme fear conditions");
  setPath(markets, "volatility.periods.1w", lang === "hi" ? "1-सप्ताह IV" : "1-Week IV");
  setPath(markets, "volatility.periods.1m", lang === "hi" ? "1-माह IV" : "1-Month IV");
  setPath(markets, "volatility.periods.3m", lang === "hi" ? "3-माह IV" : "3-Month IV");
  setPath(markets, "volatility.periods.6m", lang === "hi" ? "6-माह IV" : "6-Month IV");
  setPath(markets, "volatility.periods.1y", lang === "hi" ? "1-वर्ष IV" : "1-Year IV");
  setPath(markets, "sectorCategories.technology", tx.technology);
  setPath(markets, "sectorCategories.financials", lang === "hi" ? "वित्तीय" : "Financials");
  setPath(markets, "sectorCategories.industrials", lang === "hi" ? "औद्योगिक" : "Industrials");
  setPath(markets, "sectorCategories.energy", lang === "hi" ? "ऊर्जा" : "Energy");
  setPath(markets, "sectorCategories.healthcare", lang === "hi" ? "स्वास्थ्य सेवा" : "Healthcare");

  writeJson(commonPath, common);
  writeJson(marketsPath, markets);
  writeJson(navPath, nav);
}
