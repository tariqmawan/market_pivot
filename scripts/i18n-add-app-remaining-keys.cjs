const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "src", "client", "i18n", "locales");

const common = {
  en: {
    marketsWorkspace: "Markets workspace",
    signInToUnlock: "Sign in to unlock watchlists, alerts, preferences, and portfolio dashboard.",
    welcomeUser: "Welcome, {{name}}",
    userDashboardIntro: "Your watchlist, alerts, portfolio mix, and account preferences in one dashboard.",
    activeSignals: "Active signals",
    baseFx: "Base FX",
    defaultCurrency: "Default currency",
    risk: "Risk",
    profileMode: "Profile mode",
    multiAssetMix: "Multi-asset mix",
    marketPulse: "Market Pulse",
    todaysDashboard: "Today's dashboard",
    global: "Global",
    email: "Email",
    editProfile: "Edit Profile",
    pageNotFound: "Page not found",
    pageNotFoundBody: "The requested page could not be found. Please check the URL or return to the home dashboard.",
    goHome: "Go to home",
  },
  hi: {
    marketsWorkspace: "मार्केट वर्कस्पेस",
    signInToUnlock: "वॉचलिस्ट, अलर्ट, प्राथमिकताएं और पोर्टफोलियो डैशबोर्ड अनलॉक करने के लिए साइन इन करें।",
    welcomeUser: "स्वागत है, {{name}}",
    userDashboardIntro: "आपकी वॉचलिस्ट, अलर्ट, पोर्टफोलियो मिक्स और खाता प्राथमिकताएं एक ही डैशबोर्ड में।",
    activeSignals: "सक्रिय सिग्नल",
    baseFx: "बेस FX",
    defaultCurrency: "डिफॉल्ट मुद्रा",
    risk: "जोखिम",
    profileMode: "प्रोफाइल मोड",
    multiAssetMix: "मल्टी-एसेट मिक्स",
    marketPulse: "मार्केट पल्स",
    todaysDashboard: "आज का डैशबोर्ड",
    global: "वैश्विक",
    email: "ईमेल",
    editProfile: "प्रोफाइल संपादित करें",
    pageNotFound: "पेज नहीं मिला",
    pageNotFoundBody: "मांगा गया पेज नहीं मिला। कृपया URL जांचें या होम डैशबोर्ड पर लौटें।",
    goHome: "होम पर जाएं",
  },
  ar: {
    marketsWorkspace: "مساحة عمل الأسواق",
    signInToUnlock: "سجّل الدخول لفتح قوائم المتابعة والتنبيهات والتفضيلات ولوحة المحفظة.",
    welcomeUser: "مرحبًا، {{name}}",
    userDashboardIntro: "قوائم المتابعة والتنبيهات ومزيج المحفظة وتفضيلات الحساب في لوحة واحدة.",
    activeSignals: "إشارات نشطة",
    baseFx: "FX الأساسي",
    defaultCurrency: "العملة الافتراضية",
    risk: "المخاطر",
    profileMode: "وضع الملف",
    multiAssetMix: "مزيج أصول متعدد",
    marketPulse: "نبض السوق",
    todaysDashboard: "لوحة اليوم",
    global: "عالمي",
    email: "البريد الإلكتروني",
    editProfile: "تعديل الملف",
    pageNotFound: "الصفحة غير موجودة",
    pageNotFoundBody: "تعذر العثور على الصفحة المطلوبة. تحقق من الرابط أو عُد إلى لوحة البداية.",
    goHome: "العودة إلى الرئيسية",
  },
};

const fallback = {
  de: {
    marketsWorkspace: "Markt-Arbeitsbereich", signInToUnlock: "Melden Sie sich an, um Watchlists, Alarme, Einstellungen und Portfolio-Dashboard freizuschalten.", welcomeUser: "Willkommen, {{name}}", userDashboardIntro: "Watchlist, Alarme, Portfolio-Mix und Kontoeinstellungen in einem Dashboard.", activeSignals: "Aktive Signale", baseFx: "Basis-FX", defaultCurrency: "Standardwährung", risk: "Risiko", profileMode: "Profilmodus", multiAssetMix: "Multi-Asset-Mix", marketPulse: "Marktpuls", todaysDashboard: "Heutiges Dashboard", global: "Global", email: "E-Mail", editProfile: "Profil bearbeiten", pageNotFound: "Seite nicht gefunden", pageNotFoundBody: "Die angeforderte Seite wurde nicht gefunden. Prüfen Sie die URL oder kehren Sie zum Home-Dashboard zurück.", goHome: "Zur Startseite"
  },
  es: {
    marketsWorkspace: "Espacio de mercados", signInToUnlock: "Inicia sesión para desbloquear listas, alertas, preferencias y panel de cartera.", welcomeUser: "Bienvenido, {{name}}", userDashboardIntro: "Tu lista, alertas, mezcla de cartera y preferencias en un panel.", activeSignals: "Señales activas", baseFx: "FX base", defaultCurrency: "Moneda predeterminada", risk: "Riesgo", profileMode: "Modo de perfil", multiAssetMix: "Mezcla multiactivo", marketPulse: "Pulso del mercado", todaysDashboard: "Panel de hoy", global: "Global", email: "Email", editProfile: "Editar perfil", pageNotFound: "Página no encontrada", pageNotFoundBody: "No se encontró la página solicitada. Revisa la URL o vuelve al panel principal.", goHome: "Ir al inicio"
  },
  fr: {
    marketsWorkspace: "Espace marchés", signInToUnlock: "Connectez-vous pour débloquer listes, alertes, préférences et tableau de portefeuille.", welcomeUser: "Bienvenue, {{name}}", userDashboardIntro: "Votre liste, vos alertes, votre allocation et vos préférences dans un tableau.", activeSignals: "Signaux actifs", baseFx: "FX de base", defaultCurrency: "Devise par défaut", risk: "Risque", profileMode: "Mode profil", multiAssetMix: "Mix multi-actifs", marketPulse: "Pouls du marché", todaysDashboard: "Tableau du jour", global: "Global", email: "E-mail", editProfile: "Modifier le profil", pageNotFound: "Page introuvable", pageNotFoundBody: "La page demandée est introuvable. Vérifiez l'URL ou revenez au tableau d'accueil.", goHome: "Retour à l'accueil"
  },
  pt: {
    marketsWorkspace: "Área de mercados", signInToUnlock: "Entre para liberar watchlists, alertas, preferências e painel de portfólio.", welcomeUser: "Bem-vindo, {{name}}", userDashboardIntro: "Watchlist, alertas, mix de portfólio e preferências em um painel.", activeSignals: "Sinais ativos", baseFx: "FX base", defaultCurrency: "Moeda padrão", risk: "Risco", profileMode: "Modo de perfil", multiAssetMix: "Mix multiativos", marketPulse: "Pulso do mercado", todaysDashboard: "Painel de hoje", global: "Global", email: "E-mail", editProfile: "Editar perfil", pageNotFound: "Página não encontrada", pageNotFoundBody: "A página solicitada não foi encontrada. Verifique a URL ou volte ao painel inicial.", goHome: "Ir para início"
  },
  zh: {
    marketsWorkspace: "市场工作区", signInToUnlock: "登录以解锁自选列表、提醒、偏好和投资组合仪表板。", welcomeUser: "欢迎，{{name}}", userDashboardIntro: "自选列表、提醒、资产组合和账户偏好集中在一个仪表板。", activeSignals: "活跃信号", baseFx: "基础外汇", defaultCurrency: "默认货币", risk: "风险", profileMode: "资料模式", multiAssetMix: "多资产组合", marketPulse: "市场脉搏", todaysDashboard: "今日仪表板", global: "全球", email: "电子邮件", editProfile: "编辑资料", pageNotFound: "页面未找到", pageNotFoundBody: "找不到请求的页面。请检查 URL 或返回主页仪表板。", goHome: "返回首页"
  },
};

const markets = {
  en: {
    category: "Category",
    topCompanies: "Top Companies",
    etfs: "ETFs",
    spotPrice: "Spot Price",
    commodityCategories: "Commodity Categories",
    allCommodities: "All Commodities",
    energy: "Energy",
    metals: "Metals",
    agriculture: "Agriculture",
    industrial: "Industrial",
    assets: "assets",
  },
  hi: {
    category: "श्रेणी",
    topCompanies: "शीर्ष कंपनियां",
    etfs: "ETFs",
    spotPrice: "स्पॉट मूल्य",
    commodityCategories: "कमोडिटी श्रेणियां",
    allCommodities: "सभी कमोडिटी",
    energy: "ऊर्जा",
    metals: "धातु",
    agriculture: "कृषि",
    industrial: "औद्योगिक",
    assets: "एसेट",
  },
  ar: {
    category: "الفئة",
    topCompanies: "أهم الشركات",
    etfs: "صناديق ETF",
    spotPrice: "السعر الفوري",
    commodityCategories: "فئات السلع",
    allCommodities: "كل السلع",
    energy: "الطاقة",
    metals: "المعادن",
    agriculture: "الزراعة",
    industrial: "الصناعية",
    assets: "أصول",
  },
};

const allLocales = fs.readdirSync(root).filter((name) => fs.statSync(path.join(root, name)).isDirectory());

for (const locale of allLocales) {
  const commonFile = path.join(root, locale, "common.json");
  const marketsFile = path.join(root, locale, "markets.json");
  const commonData = JSON.parse(fs.readFileSync(commonFile, "utf8"));
  const marketsData = JSON.parse(fs.readFileSync(marketsFile, "utf8"));

  Object.assign(commonData, common.en, fallback[locale] || {}, common[locale] || {});
  Object.assign(marketsData, markets.en, markets[locale] || {});

  fs.writeFileSync(commonFile, `${JSON.stringify(commonData, null, 2)}\n`, "utf8");
  fs.writeFileSync(marketsFile, `${JSON.stringify(marketsData, null, 2)}\n`, "utf8");
}

console.log(`Added remaining App UI keys to ${allLocales.length} locales.`);
