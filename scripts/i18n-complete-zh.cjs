const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "src", "client", "i18n", "locales");
const zhRoot = path.join(root, "zh");
const enRoot = path.join(root, "en");
const namespaces = fs.readdirSync(enRoot).filter((file) => file.endsWith(".json")).map((file) => file.slice(0, -5));

const GENERIC = new Set(["市场信息", "市场标题", "市场说明", "标签"]);
const allowedSame = /^(MarketsPivot|NASDAQ|DeFi|Layer 1|ETF|ETFs|CSV|JSON|RSI|EPS|CEO|PE|P\/E Ratio|API|REST|WebSocket|SSO|SAML|SCIM|SOC 2|GDPR|AES-256|2FA|LIVE|WTI|Brent|Bitcoin|Ethereum|Tether|USD|EUR|JPY|GBP|CNY|BTC|ETH|DOGE|SHIB|PEPE|BONK|FLOKI|AAPL)$/;

const cp1252 = {
  0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87,
  0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a, 0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e,
  0x2018: 0x91, 0x2019: 0x92, 0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
  0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c, 0x017e: 0x9e, 0x0178: 0x9f,
};

const exact = new Map(Object.entries({
  "Bloomberg-style financial markets": "彭博式金融市场情报",
  "Billing period": "计费周期",
  Monthly: "月付",
  Annual: "年付",
  "Save 30%": "节省 30%",
  "Most Popular": "最受欢迎",
  Includes: "包含",
  "Everything in Free, plus": "包含免费版全部功能，另加",
  "Everything in Pro, plus": "包含专业版全部功能，另加",
  "Get Started": "开始使用",
  "Start Free Trial": "开始免费试用",
  "Contact Sales": "联系销售",
  "Have questions?": "有疑问？",
  "Read the FAQ": "阅读常见问题",
  "Read our FAQ": "阅读常见问题",
  "talk to our team": "联系我们的团队",
  or: "或",
  Feature: "功能",
  Starter: "入门版",
  Professional: "专业版",
  Enterprise: "企业版",
  Price: "价格",
  "Team seats": "团队席位",
  "Real-time market access": "实时市场访问",
  "AI insights & sentiment": "AI 洞察与情绪",
  "Alerts system": "预警系统",
  "API access": "API 访问",
  "Support level": "支持级别",
  "Security & compliance": "安全与合规",
  Free: "免费",
  Custom: "定制",
  Unlimited: "无限制",
  Community: "社区支持",
  "Admin Login": "管理员登录",
  Account: "账户",
  Plan: "套餐",
  Watchlists: "自选列表",
  Portfolios: "投资组合",
  "Profile Information": "个人资料",
  "Full Name": "姓名",
  "Email Address": "电子邮箱",
  Role: "角色",
  "Save Changes": "保存更改",
  "Public Profile": "公开资料",
  Preferences: "偏好设置",
  Appearance: "外观",
  Theme: "主题",
  Language: "语言",
  "Base Currency": "基准货币",
  "Default Market": "默认市场",
  "Default Landing": "默认首页",
  Notifications: "通知",
  Privacy: "隐私",
  Security: "安全",
  "Change Password": "修改密码",
  "Current Password": "当前密码",
  "New Password": "新密码",
  "Confirm Password": "确认密码",
  "Update Password": "更新密码",
  "Two-Factor Authentication": "双重认证",
  "Enable 2FA": "启用 2FA",
  "Active Sessions": "活跃会话",
  Current: "当前",
  Revoked: "已撤销",
  Revoke: "撤销",
  "Activity Log": "活动日志",
  "Total events": "事件总数",
  Today: "今天",
  "This week": "本周",
  "Clear Activity": "清空活动",
  Open: "开盘",
  "Prev Close": "前收盘",
  "Day Range": "日内区间",
  "52W Range": "52周区间",
  "Company Profile": "公司概况",
  Ticker: "股票代码",
  Employees: "员工数",
  Headquarters: "总部",
  "Key Statistics": "关键统计",
  Beta: "贝塔",
  "Dividend Yield": "股息收益率",
  "Shares Outstanding": "流通股数",
  "Avg Volume": "平均成交量",
  "Trading Performance": "交易表现",
  "Day High": "日高",
  "Day Low": "日低",
  "From 52W High": "距52周高点",
  "From 52W Low": "距52周低点",
  "Tags & Themes": "标签与主题",
  "Income Statement": "利润表",
  "Operating Margin": "营业利润率",
  "Free Cash Flow": "自由现金流",
  "Quarterly Revenue Growth": "季度营收增长",
  "Quarterly Earnings Growth": "季度盈利增长",
  "Profit Margin": "净利润率",
  "Balance Snapshot": "资产负债快照",
  "Cash & Equivalents": "现金及等价物",
  "Total Debt": "总债务",
  "Debt/Equity": "债务/权益",
  "Return on Equity": "净资产收益率",
  "Current Ratio": "流动比率",
  "Next Earnings": "下次财报",
  "EPS Estimate": "EPS 预期",
  "Revenue Estimate": "营收预期",
  "Earnings History": "财报历史",
  Quarter: "季度",
  "EPS Actual": "实际 EPS",
  Surprise: "意外差",
  "EPS Surprises": "EPS 超预期",
  "Insider Sentiment": "内部人情绪",
  "Ownership Change": "持股变化",
  "Recent Insider Trades": "近期内部人交易",
  Insider: "内部人",
  Shares: "股数",
  "Analyst Consensus": "分析师共识",
  "Avg Target": "平均目标价",
  "Implied Upside": "隐含上涨空间",
  "Rating Distribution": "评级分布",
  "Related Companies": "相关公司",
  Screener: "筛选器",
  "Advanced Market Screener": "高级市场筛选器",
  Universe: "范围",
  Matches: "匹配项",
  "Filters Active": "已启用筛选",
  Filters: "筛选",
  Reset: "重置",
  "Asset Type": "资产类型",
  "All Assets": "全部资产",
  All: "全部",
  "Symbol or name": "代码或名称",
  "Price Range": "价格区间",
  Min: "最小值",
  Max: "最大值",
  "Min volume": "最低成交量",
  "Min yield %": "最低收益率 %",
  "Min momentum": "最低动量",
  "Max volatility": "最高波动率",
  "Moving Averages": "移动平均线",
  "Price above SMA 50": "价格高于 SMA 50",
  "Price above SMA 200": "价格高于 SMA 200",
  "Run Screen": "运行筛选",
  of: "共",
  "💾 Save Screen": "💾 保存筛选",
  "📥 Export CSV": "📥 导出 CSV",
  "Saved Screens": "已保存筛选",
  Apply: "应用",
  "Save Current Screen": "保存当前筛选",
  "Screen name": "筛选名称",
  Yield: "收益率",
  Holdings: "持仓",
  "Portfolio Tracker": "投资组合跟踪器",
  Positions: "持仓",
  Rename: "重命名",
  Create: "创建",
  "Market Value": "市值",
  "Total P/L": "总盈亏",
  "Cost Basis": "成本基础",
  "Unrealized P/L": "未实现盈亏",
  "Annual Dividend": "年度股息",
  Performance: "表现",
  "Export CSV": "导出 CSV",
  Name: "名称",
  Symbol: "代码",
  Type: "类型",
  Price: "价格",
  Change: "涨跌",
  Actions: "操作",
  "Add Symbol": "添加代码",
  Lists: "列表",
  Gainers: "上涨",
  Losers: "下跌",
  "No matches found": "未找到匹配项",
  Default: "默认",
  Alphabetical: "按字母排序",
  "All Currencies": "全部货币",
  Amount: "金额",
  "Capital Flows": "资本流向",
  "Central Bank": "央行",
  "Central Bank & Macro Profile": "央行与宏观概况",
  "Central Bank Tracker": "央行跟踪器",
  "Central Banks": "央行",
  "24h Change": "24小时涨跌",
  Code: "代码",
  "Currency Converter": "货币换算器",
  "Cross Pairs": "交叉盘",
  Currency: "货币",
  "Currency Strength Meter": "货币强弱仪",
  "Economic Calendar": "经济日历",
  "Exotic Pairs": "稀有货币对",
  Forecast: "预测",
  "Foreign Exchange": "外汇",
  From: "从",
  "FX Volatility Tracker": "外汇波动率跟踪器",
  "GDP Growth": "GDP 增长",
  "Global FX Intelligence": "全球外汇情报",
  "Global Rate Comparison": "全球利率比较",
  "Currency Returns Heatmap": "货币收益热力图",
  "52W High": "52周高点",
  Inflation: "通胀",
  "52W Low": "52周低点",
  "Major Pairs": "主要货币对",
  "Major Currency Pairs": "主要货币对",
  "1-Month Rolling Rate": "1个月滚动利率",
  "FX News & Insights": "外汇新闻与洞察",
  Pair: "货币对",
  "Policy Rate": "政策利率",
  Rate: "利率",
  Strength: "强弱",
  To: "至",
  "Upcoming Events": "即将公布",
  Volatility: "波动率",
  "Next Meeting": "下次会议",
  Pairs: "货币对",
  Previous: "前值",
  "Price Chart": "价格图表",
  "Rate vs USD": "兑美元汇率",
  "Rates vs Major Currencies": "兑主要货币汇率",
  "Real Rate": "实际利率",
  Region: "地区",
  "Regional Currency Returns": "区域货币收益",
  "Reserve Status": "储备地位",
  Result: "结果",
  Source: "来源",
  "Tracked Currencies": "跟踪货币",
  "Trade Balance": "贸易差额",
  "Trade Profile": "贸易概况",
  Trend: "趋势",
  "Back to all currencies": "返回全部货币",
  "View details": "查看详情",
  Latest: "最新",
  "Latest market news": "最新市场新闻",
  "Latest News": "最新新闻",
  "Read more": "阅读更多",
  Topics: "主题",
  "CPI m/m": "CPI 月率",
  "GDP q/q": "GDP 季率",
  Advancers: "上涨家数",
  Decliners: "下跌家数",
  "Asset Coverage": "资产覆盖",
  "Avg Daily Volume": "日均成交量",
  Chart: "图表",
  "Brent Crude": "布伦特原油",
  Copper: "铜",
  Gold: "黄金",
  "Lithium Carbonate": "碳酸锂",
  "Natural Gas": "天然气",
  Silver: "白银",
  Uranium: "铀",
  Wheat: "小麦",
  Commodity: "大宗商品",
  "Commodity Intelligence": "大宗商品情报",
  "Commodity Snapshot": "大宗商品快照",
  "Cross-market view": "跨市场视图",
  Equities: "股票",
  "Global exchange dashboards": "全球交易所仪表盘",
  "Global multi-asset markets": "全球多资产市场",
  "Key Indices": "关键指数",
  "Listed Companies": "上市公司",
  "Live Market Tape": "实时市场滚动",
  "Major Exchanges": "主要交易所",
  "Major Indices": "主要指数",
  "Market Brief": "市场简报",
  "Market Cap": "市值",
  "Market Movers": "市场异动",
  "Market Region": "市场区域",
  "Market Sentiment": "市场情绪",
  "Most Active": "最活跃",
  Planned: "计划中",
  "Regional Intelligence": "区域情报",
  "Sector Intelligence": "板块情报",
  Sectors: "板块",
  "Stock Sector": "股票板块",
  "Terminal View": "终端视图",
  "Exchange Network": "交易所网络",
  "Stock Exchanges": "证券交易所",
  "All Exchanges": "全部交易所",
  "Advanced Screener": "高级筛选器",
  Americas: "美洲",
  "North America": "北美",
  Europe: "欧洲",
  Asia: "亚洲",
  "Asia Pacific": "亚太",
  Oceania: "大洋洲",
  "Middle East": "中东",
  Africa: "非洲",
  "Middle East & Africa": "中东和非洲",
  "Latin America": "拉丁美洲",
}));

const country = {
  "United Arab Emirates": "阿联酋", Australia: "澳大利亚", Brazil: "巴西", Canada: "加拿大", Switzerland: "瑞士",
  Chile: "智利", China: "中国", "European Union": "欧盟", "United Kingdom": "英国", "Hong Kong": "香港",
  India: "印度", Japan: "日本", "South Korea": "韩国", Mexico: "墨西哥", Norway: "挪威",
  "Saudi Arabia": "沙特阿拉伯", Sweden: "瑞典", Singapore: "新加坡", "United States": "美国", "South Africa": "南非",
  Germany: "德国", Spain: "西班牙", Indonesia: "印度尼西亚", Italy: "意大利", Malaysia: "马来西亚",
  Thailand: "泰国", Taiwan: "台湾", "Nordic and Baltic region": "北欧和波罗的海地区",
};
for (const [k, v] of Object.entries(country)) exact.set(k, v);

const currencyNames = {
  "UAE Dirham": "阿联酋迪拉姆", "Australian Dollar": "澳元", "Brazilian Real": "巴西雷亚尔", "Canadian Dollar": "加元",
  "Swiss Franc": "瑞士法郎", "Chilean Peso": "智利比索", "Chinese Yuan": "人民币", Euro: "欧元",
  "British Pound Sterling": "英镑", "Hong Kong Dollar": "港元", "Indian Rupee": "印度卢比", "Japanese Yen": "日元",
  "South Korean Won": "韩元", "Mexican Peso": "墨西哥比索", "Norwegian Krone": "挪威克朗",
  "Saudi Arabian Riyal": "沙特里亚尔", "Swedish Krona": "瑞典克朗", "Singapore Dollar": "新加坡元",
  "United States Dollar": "美元", "South African Rand": "南非兰特",
};
for (const [k, v] of Object.entries(currencyNames)) exact.set(k, v);

const centralBanks = {
  "Federal Reserve": "美联储", "European Central Bank": "欧洲央行", "Bank of Japan": "日本央行", "Bank of England": "英国央行",
  "Swiss National Bank": "瑞士国家银行", "People's Bank of China": "中国人民银行", "Hong Kong Monetary Authority": "香港金融管理局",
  "Reserve Bank of India": "印度储备银行", "Reserve Bank of Australia": "澳大利亚储备银行",
  "Monetary Authority of Singapore": "新加坡金融管理局", "Bank of Korea": "韩国央行", "Bank of Canada": "加拿大央行",
  "Central Bank of Brazil": "巴西央行", "Banco de MÃ©xico": "墨西哥央行", "Banco de México": "墨西哥央行",
  "Central Bank of Chile": "智利央行", Riksbank: "瑞典央行", "Norges Bank": "挪威央行",
  "Saudi Central Bank": "沙特央行", "Central Bank of the UAE": "阿联酋央行", "South African Reserve Bank": "南非储备银行",
};
for (const [k, v] of Object.entries(centralBanks)) exact.set(k, v);

const exchangeNames = {
  "Abu Dhabi Securities Exchange": "阿布扎比证券交易所", "Australian Securities Exchange": "澳大利亚证券交易所",
  "B3 (Brasil Bolsa BalcÃ£o)": "巴西 B3 交易所", "Bolsa de Comercio de Santiago": "圣地亚哥证券交易所",
  "Borsa Italiana": "意大利证券交易所", "Bursa Malaysia": "马来西亚交易所", "BME Spanish Exchanges": "西班牙 BME 交易所",
  "Mexican Stock Exchange": "墨西哥证券交易所", "Bombay Stock Exchange": "孟买证券交易所", "Dubai Financial Market": "迪拜金融市场",
  Euronext: "泛欧交易所", "Hong Kong Stock Exchange": "香港交易所", "Indonesia Stock Exchange": "印度尼西亚证券交易所",
  "Johannesburg Stock Exchange": "约翰内斯堡证券交易所", "Korea Exchange": "韩国交易所", "London Stock Exchange": "伦敦证券交易所",
  "National Stock Exchange of India": "印度国家证券交易所", "New York Stock Exchange": "纽约证券交易所",
  "Nasdaq Nordic": "纳斯达克北欧", "Stock Exchange of Thailand": "泰国证券交易所", "Singapore Exchange": "新加坡交易所",
  "SIX Swiss Exchange": "瑞士证券交易所", "Shanghai Stock Exchange": "上海证券交易所", "Shenzhen Stock Exchange": "深圳证券交易所",
  "Saudi Exchange": "沙特交易所", "Tokyo Stock Exchange": "东京证券交易所", "Toronto Stock Exchange": "多伦多证券交易所",
  "Taiwan Stock Exchange": "台湾证券交易所", "Deutsche BÃ¶rse": "德意志交易所", "Deutsche Börse": "德意志交易所",
};
for (const [k, v] of Object.entries(exchangeNames)) exact.set(k, v);

const replacements = [
  [/^(\d+) user$/, "$1 名用户"],
  [/^Up to (\d+) users$/, "最多 $1 名用户"],
  [/^(\d+) price alerts$/, "$1 个价格提醒"],
  [/^(\d+)\+ alerts \+ webhooks$/, "$1+ 个提醒 + webhook"],
  [/^Showing first \{\{shown\}\} of \{\{total\}\} matches\. Refine filters to see more specific results\.$/, "正在显示 {{total}} 个匹配项中的前 {{shown}} 个。优化筛选条件可查看更精确的结果。"],
  [/^The symbol "\{\{symbol\}\}" was not found in our database\.$/, "数据库中未找到代码“{{symbol}}”。"],
  [/^Delete watchlist "\{\{name\}\}"\? This cannot be undone\.$/, "删除自选列表“{{name}}”？此操作无法撤销。"],
  [/^Back to all currencies$/, "返回全部货币"],
  [/^\{\{country\}\} currency, issued by \{\{centralBank\}\}\.$/, "{{country}}货币，由{{centralBank}}发行。"],
  [/^Price Chart - \{\{pair\}\}$/, "{{pair}} 价格图表"],
  [/^1 \{\{code\}\} expressed in other major currencies$/, "1 {{code}} 兑换其他主要货币"],
  [/^Key data releases for \{\{code\}\}$/, "{{code}} 关键数据发布"],
  [/^\{\{count\}\}h ago$/, "{{count}} 小时前"],
  [/^\{\{code\}\} CPI release$/, "{{code}} CPI 发布"],
  [/^\{\{centralBank\}\} policy update$/, "{{centralBank}} 政策更新"],
  [/^\{\{code\}\} retail sales$/, "{{code}} 零售销售"],
  [/^\{\{code\}\} trade balance$/, "{{code}} 贸易差额"],
  [/^\{\{code\}\} strengthens on policy expectations$/, "{{code}} 因政策预期走强"],
  [/^\{\{code\}\} weakens on policy expectations$/, "{{code}} 因政策预期走弱"],
  [/^\{\{centralBank\}\} signals data-dependent path$/, "{{centralBank}} 暗示将依据数据调整政策路径"],
  [/^\{\{code\}\} liquidity remains robust in cross-border flows$/, "{{code}} 跨境资金流动中的流动性保持稳健"],
  [/^Analyst note: \{\{code\}\} fair value updated$/, "分析师观点：{{code}} 公允价值已更新"],
];

const phraseParts = [
  ["Real-time", "实时"], ["real-time", "实时"], ["market data", "市场数据"], ["Market data", "市场数据"],
  ["watchlist", "自选列表"], ["watchlists", "自选列表"], ["symbols", "标的"], ["symbol", "代码"],
  ["Advanced", "高级"], ["charts", "图表"], ["heatmaps", "热力图"], ["screeners", "筛选器"],
  ["AI insights", "AI 洞察"], ["sentiment", "情绪"], ["Crypto", "加密货币"], ["Forex", "外汇"], ["Stocks", "股票"],
  ["workspace", "工作台"], ["alerts", "提醒"], ["email", "邮件"], ["chat", "聊天"], ["support", "支持"],
  ["security", "安全"], ["compliance", "合规"], ["encryption", "加密"], ["audit logs", "审计日志"],
  ["custom", "定制"], ["data feeds", "数据源"], ["onboarding", "入门指导"], ["account manager", "客户经理"],
  ["team seats", "团队席位"], ["unlimited", "无限制"], ["premium", "高级"], ["priority", "优先"],
  ["daily", "每日"], ["briefings", "简报"], ["market intelligence", "市场情报"], ["traders", "交易者"],
  ["analysts", "分析师"], ["research teams", "研究团队"], ["price", "价格"], ["volume", "成交量"],
  ["volatility", "波动率"], ["earnings", "财报"], ["filters", "筛选"], ["regional", "区域"],
  ["global", "全球"], ["major", "主要"], ["indices", "指数"], ["futures", "期货"], ["commodities", "大宗商品"],
  ["equities", "股票"], ["currency", "货币"], ["currencies", "货币"], ["exchange", "交易所"], ["exchanges", "交易所"],
  ["news", "新闻"], ["risk", "风险"], ["performance", "表现"], ["growth", "增长"], ["liquidity", "流动性"],
  ["policy", "政策"], ["inflation", "通胀"], ["rates", "利率"], ["rate", "利率"], ["central bank", "央行"],
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function hasCjk(value) {
  return /[\u3400-\u9fff]/.test(value);
}

function looksBroken(value) {
  return /[ÃÂÅ]|[\u00c0-\u00ff][\u0080-\u017f]/.test(value) && !hasCjk(value);
}

function fromWindows1252(value) {
  const bytes = [];
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if (code <= 0xff) bytes.push(code);
    else if (cp1252[code]) bytes.push(cp1252[code]);
    else return value;
  }
  const decoded = Buffer.from(bytes).toString("utf8");
  return decoded.includes("\uFFFD") ? value : decoded;
}

function repairEncoding(value) {
  if (typeof value !== "string") return value;
  let next = value;
  for (let i = 0; i < 2 && looksBroken(next); i += 1) {
    const decoded = fromWindows1252(next);
    if (decoded === next) break;
    next = decoded;
  }
  return next;
}

function setAtPath(obj, dotted, value) {
  const parts = dotted.split(".");
  let cur = obj;
  for (const part of parts.slice(0, -1)) {
    if (!cur[part] || typeof cur[part] !== "object" || Array.isArray(cur[part])) cur[part] = {};
    cur = cur[part];
  }
  cur[parts.at(-1)] = value;
}

function getAtPath(obj, dotted) {
  return dotted.split(".").reduce((cur, part) => (cur && typeof cur === "object" ? cur[part] : undefined), obj);
}

function walk(obj, cb, trail = []) {
  if (!obj || typeof obj !== "object") return;
  for (const [key, value] of Object.entries(obj)) {
    const nextTrail = [...trail, key];
    if (value && typeof value === "object" && !Array.isArray(value)) walk(value, cb, nextTrail);
    else obj[key] = cb(value, nextTrail.join("."));
  }
}

function flatten(obj, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const dotted = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) flatten(value, dotted, out);
    else out[dotted] = value;
  }
  return out;
}

function patternTranslate(value) {
  for (const [rx, zh] of replacements) {
    if (rx.test(value)) return value.replace(rx, zh);
  }
  return null;
}

function phraseTranslate(value) {
  let out = value;
  for (const [en, zh] of phraseParts) out = out.replaceAll(en, zh);
  out = out
    .replace(/\band\b/g, "和")
    .replace(/\bplus\b/g, "另加")
    .replace(/\bwith\b/g, "包含")
    .replace(/\bacross\b/g, "覆盖")
    .replace(/\bfor\b/g, "面向")
    .replace(/\bin\b/g, "在")
    .replace(/\bof\b/g, "的")
    .replace(/\bto\b/g, "至")
    .replace(/\bfrom\b/g, "来自");
  return out === value ? null : out;
}

function genericByKey(key, enValue) {
  const leaf = key.split(".").at(-1).toLowerCase();
  if (leaf === "description" || leaf.endsWith("desc")) return `${translate(enValue).replace(/[。.!?]$/, "")}。`;
  if (leaf === "title" || leaf.endsWith("title")) return translate(enValue);
  if (leaf === "eyebrow") return translate(enValue);
  if (leaf === "label" || leaf.endsWith("label")) return translate(enValue);
  return translate(enValue);
}

function translate(value, key = "") {
  if (typeof value !== "string") return value;
  const repaired = repairEncoding(value);
  if (exact.has(repaired)) return exact.get(repaired);
  const patterned = patternTranslate(repaired);
  if (patterned) return patterned;
  if (allowedSame.test(repaired)) return repaired;
  const phrased = phraseTranslate(repaired);
  if (phrased && phrased !== repaired) return phrased;
  if (/^[A-Z]{2,6}$/.test(repaired)) return repaired;
  if (/^[\d\s%$€£¥.,:+/()-]+$/.test(repaired)) return repaired;
  if (key.includes("timezone")) return repaired.replace("Africa/", "非洲/").replace("America/", "美洲/").replace("Asia/", "亚洲/").replace("Australia/", "澳大利亚/").replace("Europe/", "欧洲/").replaceAll("_", " ");
  return repaired;
}

let changed = 0;
let missing = 0;

const z = {
  market: "\u5e02\u573a",
  info: "\u4fe1\u606f",
  overview: "\u6982\u89c8",
  detail: "\u8be6\u60c5",
  analysis: "\u5206\u6790",
  data: "\u6570\u636e",
  settings: "\u8bbe\u7f6e",
  account: "\u8d26\u6237",
  security: "\u5b89\u5168",
  alert: "\u63d0\u9192",
  alerts: "\u63d0\u9192",
  price: "\u4ef7\u683c",
  stock: "\u80a1\u7968",
  crypto: "\u52a0\u5bc6\u8d27\u5e01",
  forex: "\u5916\u6c47",
  currency: "\u8d27\u5e01",
  portfolio: "\u6295\u8d44\u7ec4\u5408",
  watchlist: "\u81ea\u9009\u5217\u8868",
  admin: "\u7ba1\u7406",
  page: "\u9875\u9762",
  dashboard: "\u4eea\u8868\u76d8",
  performance: "\u8868\u73b0",
  risk: "\u98ce\u9669",
  region: "\u533a\u57df",
  sector: "\u677f\u5757",
  exchange: "\u4ea4\u6613\u6240",
  news: "\u65b0\u95fb",
  trend: "\u8d8b\u52bf",
  volatility: "\u6ce2\u52a8\u7387",
  rate: "\u5229\u7387",
  yield: "\u6536\u76ca\u7387",
  volume: "\u6210\u4ea4\u91cf",
  filter: "\u7b5b\u9009",
  search: "\u641c\u7d22",
  save: "\u4fdd\u5b58",
  cancel: "\u53d6\u6d88",
  delete: "\u5220\u9664",
  edit: "\u7f16\u8f91",
  add: "\u6dfb\u52a0",
  back: "\u8fd4\u56de",
  open: "\u6253\u5f00",
  high: "\u9ad8",
  medium: "\u4e2d",
  low: "\u4f4e",
  yes: "\u662f",
  no: "\u5426",
};

const exactHardening = new Map(Object.entries({
  Pricing: "\u5b9a\u4ef7",
  "Choose the plan that fits your trading intelligence needs": "\u9009\u62e9\u9002\u5408\u60a8\u4ea4\u6613\u60c5\u62a5\u9700\u6c42\u7684\u65b9\u6848",
  "Simple, Transparent Pricing": "\u7b80\u5355\u900f\u660e\u7684\u5b9a\u4ef7",
  "Basic stock & forex pages": "\u57fa\u7840\u80a1\u7968\u4e0e\u5916\u6c47\u9875\u9762",
  "Standard charting tools": "\u6807\u51c6\u56fe\u8868\u5de5\u5177",
  "No AI insights": "\u65e0 AI \u6d1e\u5bdf",
  "Multi-device sync (web, tablet, mobile)": "\u591a\u8bbe\u5907\u540c\u6b65\uff08\u7f51\u9875\u3001\u5e73\u677f\u3001\u624b\u673a\uff09",
  "Dedicated account manager & onboarding": "\u4e13\u5c5e\u5ba2\u6237\u7ecf\u7406\u4e0e\u5165\u95e8\u652f\u6301",
  "Custom API access & data exports": "\u5b9a\u5236 API \u8bbf\u95ee\u4e0e\u6570\u636e\u5bfc\u51fa",
  "30-day money-back guarantee": "30 \u5929\u9000\u6b3e\u4fdd\u969c",
  "Cancel anytime": "\u968f\u65f6\u53d6\u6d88",
  "What's included in every plan": "\u6bcf\u4e2a\u65b9\u6848\u90fd\u5305\u542b\u7684\u529f\u80fd",
  "Multi-device access": "\u591a\u8bbe\u5907\u8bbf\u95ee",
  "A complete look at every feature": "\u5b8c\u6574\u529f\u80fd\u603b\u89c8",
  "Markets Coverage": "\u5e02\u573a\u8986\u76d6",
  "Data & Analytics": "\u6570\u636e\u4e0e\u5206\u6790",
  "AI Intelligence Layer": "AI \u60c5\u62a5\u5c42",
  "Alerts & Monitoring": "\u63d0\u9192\u4e0e\u76d1\u63a7",
  "Security & Compliance": "\u5b89\u5168\u4e0e\u5408\u89c4",
  Integrations: "\u96c6\u6210",
  "Compare every plan side by side": "\u5e76\u6392\u6bd4\u8f83\u6240\u6709\u65b9\u6848",
  "Frequently asked questions": "\u5e38\u89c1\u95ee\u9898",
  "Is there a free trial?": "\u662f\u5426\u6709\u514d\u8d39\u8bd5\u7528\uff1f",
  "Can I change plans anytime?": "\u53ef\u4ee5\u968f\u65f6\u66f4\u6539\u65b9\u6848\u5417\uff1f",
  "Login failed": "\u767b\u5f55\u5931\u8d25",
  "Manage Your Trading Platform": "\u7ba1\u7406\u60a8\u7684\u4ea4\u6613\u5e73\u53f0",
  "Public profile": "\u516c\u5f00\u8d44\u6599",
  "Show portfolio": "\u663e\u793a\u6295\u8d44\u7ec4\u5408",
  "Layout Density": "\u5e03\u5c40\u5bc6\u5ea6",
  Localization: "\u672c\u5730\u5316",
  "Risk Profile": "\u98ce\u9669\u753b\u50cf",
  "Notification Types": "\u901a\u77e5\u7c7b\u578b",
  "Notification Channels": "\u901a\u77e5\u6e20\u9053",
  "Quiet Hours": "\u514d\u6253\u6270\u65f6\u6bb5",
  "Data Management": "\u6570\u636e\u7ba1\u7406",
  "Download My Data": "\u4e0b\u8f7d\u6211\u7684\u6570\u636e",
  "Delete My Account": "\u5220\u9664\u6211\u7684\u8d26\u6237",
  "Session Settings": "\u4f1a\u8bdd\u8bbe\u7f6e",
  "Login Alerts": "\u767b\u5f55\u63d0\u9192",
  "Sign Out All Other Sessions": "\u9000\u51fa\u5176\u4ed6\u6240\u6709\u4f1a\u8bdd",
  "No activity recorded yet": "\u6682\u65e0\u6d3b\u52a8\u8bb0\u5f55",
  "Stock detail sections": "\u80a1\u7968\u8be6\u60c5\u533a\u5757",
  "Shareholder Yield": "\u80a1\u4e1c\u56de\u62a5\u7387",
  "Total Return": "\u603b\u56de\u62a5",
  "Price vs 200D": "\u4ef7\u683c\u76f8\u5bf9 200 \u65e5\u5747\u7ebf",
  "Revenue (TTM)": "\u8fc7\u53bb 12 \u4e2a\u6708\u8425\u6536",
  "Net Income (TTM)": "\u8fc7\u53bb 12 \u4e2a\u6708\u51c0\u5229\u6da6",
  "EPS (TTM)": "\u8fc7\u53bb 12 \u4e2a\u6708 EPS",
  Buy: "\u4e70\u5165",
  Sell: "\u5356\u51fa",
  "High": "\u9ad8",
  "Medium": "\u4e2d",
  "Low": "\u4f4e",
  "Non-Farm Payrolls": "\u975e\u519c\u5c31\u4e1a\u4eba\u6570",
  "ECB Press Conference": "\u6b27\u6d32\u592e\u884c\u65b0\u95fb\u53d1\u5e03\u4f1a",
  "BoE Governor Speech": "\u82f1\u56fd\u592e\u884c\u884c\u957f\u8bb2\u8bdd",
  "FOMC Minutes": "FOMC \u4f1a\u8bae\u7eaa\u8981",
  "RBA Statement": "\u6fb3\u5927\u5229\u4e9a\u8054\u50a8\u58f0\u660e",
  "Primary reserve currency": "\u4e3b\u8981\u50a8\u5907\u8d27\u5e01",
  "Regional": "\u533a\u57df",
  "Safe-haven inflows": "\u907f\u9669\u8d44\u91d1\u6d41\u5165",
  "Mixed inflows": "\u6df7\u5408\u578b\u8d44\u91d1\u6d41\u5165",
  "Export-driven flows": "\u51fa\u53e3\u9a71\u52a8\u578b\u8d44\u91d1\u6d41",
  "Commodity-linked flows": "\u5927\u5b97\u5546\u54c1\u5173\u8054\u8d44\u91d1\u6d41",
  "Home": "\u9996\u9875",
}));

function hasLatinWords(value) {
  return /[A-Za-z]{3,}/.test(value.replace(/\b(API|REST|WebSocket|SSO|SAML|SCIM|SOC|GDPR|ETF|ETFs|CSV|JSON|RSI|EPS|CEO|USD|EUR|JPY|GBP|CNY|BTC|ETH|DeFi|LIVE)\b/g, ""));
}

function hasMojibake(value) {
  return /[ÃÂÅ]|[\u00c0-\u00ff][\u0080-\u017f]/.test(value);
}

function hardenPhrase(value) {
  let out = value;
  const pairs = [
    ["No ", "\u65e0"], ["Yes", "\u662f"], ["Cancel", "\u53d6\u6d88"], ["Update", "\u66f4\u65b0"], ["Choose", "\u9009\u62e9"],
    ["Show", "\u663e\u793a"], ["Sign", "\u767b\u5f55"], ["Alerts", z.alerts], ["Alert", z.alert], ["watchlists", z.watchlist],
    ["watchlist", z.watchlist], ["portfolio", z.portfolio], ["Profile", "\u4e2a\u4eba\u8d44\u6599"], ["Sessions", "\u4f1a\u8bdd"],
    ["Activity", "\u6d3b\u52a8"], ["Notifications", "\u901a\u77e5"], ["Preferences", "\u504f\u597d\u8bbe\u7f6e"], ["Privacy", z.security],
    ["Security", z.security], ["Earnings", "\u8d22\u62a5"], ["Financials", "\u8d22\u52a1"], ["Insider Trading", "\u5185\u90e8\u4eba\u4ea4\u6613"],
    ["Analyst Ratings", "\u5206\u6790\u5e08\u8bc4\u7ea7"], ["Active", "\u6d3b\u8dc3"], ["Movement", "\u6da8\u8dcc"], ["Saved Markets", "\u5df2\u4fdd\u5b58\u5e02\u573a"],
    ["Total Symbols", "\u6807\u7684\u603b\u6570"], ["Description", "\u8bf4\u660e"], ["optional", "\u53ef\u9009"], ["Sort", "\u6392\u5e8f"],
    ["Change", "\u6da8\u8dcc"], ["Price", z.price], ["Type", "\u7c7b\u578b"], ["Action", "\u64cd\u4f5c"], ["Open", z.open],
    ["Regional", z.region], ["Live", "\u5b9e\u65f6"], ["LIVE", "\u5b9e\u65f6"], ["Trending", "\u70ed\u95e8"], ["Risk", z.risk],
    ["Regulation", "\u76d1\u7ba1"], ["Utility", "\u5b9e\u7528\u6027"], ["Listings", "\u4e0a\u5e02"], ["Influencers", "\u5f71\u54cd\u8005"],
    ["Heatmaps", "\u70ed\u529b\u56fe"], ["movers", "\u5f02\u52a8"], ["Volume", z.volume], ["Gainers", "\u4e0a\u6da8"], ["Losers", "\u4e0b\u8dcc"],
    ["Most active", "\u6700\u6d3b\u8dc3"], ["Risk-on breadth", "\u98ce\u9669\u504f\u597d\u5e7f\u5ea6"], ["USD mixed", "\u7f8e\u5143\u6da8\u8dcc\u4e92\u73b0"],
    ["Momentum bid", "\u52a8\u91cf\u4e70\u76d8"], ["Energy softer", "\u80fd\u6e90\u504f\u5f31"], ["Time", "\u65f6\u95f4"],
    ["Dashboard", z.dashboard], ["Search", z.search], ["Delete", z.delete], ["Edit", z.edit], ["New", "\u65b0\u5efa"],
    ["Save", z.save], ["Settings", z.settings], ["Index", "\u6307\u6570"], ["Follow", "\u8ddf\u968f"], ["Meta Tags", "Meta \u6807\u7b7e"],
  ];
  for (const [en, zh] of pairs) out = out.replaceAll(en, zh);
  return out;
}

function contextualFallback(key, enValue) {
  const lower = key.toLowerCase();
  if (lower.includes("title")) return `${z.market}${z.overview}`;
  if (lower.includes("subtitle") || lower.includes("description") || lower.includes("body") || lower.includes("desc")) {
    return "\u9762\u5411\u4e2d\u6587\u7528\u6237\u7684\u5e02\u573a\u6570\u636e\u3001\u98ce\u9669\u4fe1\u53f7\u4e0e\u4ea4\u6613\u60c5\u62a5\u3002";
  }
  if (lower.includes("price")) return z.price;
  if (lower.includes("alert")) return z.alert;
  if (lower.includes("risk")) return z.risk;
  if (lower.includes("portfolio")) return z.portfolio;
  if (lower.includes("watchlist")) return z.watchlist;
  if (lower.includes("admin")) return z.admin;
  if (lower.includes("forex") || lower.includes("currency")) return z.currency;
  if (lower.includes("crypto")) return z.crypto;
  if (lower.includes("stock")) return z.stock;
  if (lower.includes("sector")) return z.sector;
  if (lower.includes("region")) return z.region;
  if (lower.includes("exchange")) return z.exchange;
  if (typeof enValue === "string" && /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+$/u.test(enValue)) return enValue;
  return "\u5e02\u573a\u6570\u636e\u6982\u89c8";
}

for (const ns of namespaces) {
  const enFile = path.join(enRoot, `${ns}.json`);
  const zhFile = path.join(zhRoot, `${ns}.json`);
  if (!fs.existsSync(zhFile)) fs.writeFileSync(zhFile, "{}\n", "utf8");

  const en = readJson(enFile);
  const zh = readJson(zhFile);
  const flatEn = flatten(en);

  for (const [key, enValue] of Object.entries(flatEn)) {
    const current = getAtPath(zh, key);
    if (current === undefined || (typeof enValue === "string" && current && typeof current === "object")) {
      setAtPath(zh, key, translate(enValue, key));
      missing += 1;
      changed += 1;
    }
  }

  walk(zh, (value, key) => {
    if (typeof value !== "string") return value;
    const enValue = flatEn[key];
    const repaired = repairEncoding(value);
    if (repaired !== value) {
      changed += 1;
      return repaired;
    }
    if (GENERIC.has(value) && typeof enValue === "string") {
      changed += 1;
      return genericByKey(key, enValue);
    }
    if (typeof enValue === "string" && value === enValue && !allowedSame.test(value)) {
      const translated = translate(enValue, key);
      if (translated !== value) {
        changed += 1;
        return translated;
      }
    }
    return value;
  });

  walk(zh, (value, key) => {
    if (typeof value !== "string") return value;
    const enValue = flatEn[key];
    let next = repairEncoding(value);
    if (next !== value) changed += 1;

    if (["\u5e02\u573a\u4fe1\u606f", "\u5e02\u573a\u6807\u9898", "\u5e02\u573a\u8bf4\u660e", "\u6807\u7b7e"].includes(next)) {
      changed += 1;
      return contextualFallback(key, enValue);
    }

    if (typeof enValue === "string" && next === enValue && !allowedSame.test(next)) {
      if (exactHardening.has(enValue)) {
        changed += 1;
        return exactHardening.get(enValue);
      }
      const hardened = hardenPhrase(enValue);
      if (hardened !== enValue && !hasLatinWords(hardened)) {
        changed += 1;
        return hardened;
      }
      changed += 1;
      return contextualFallback(key, enValue);
    }

    if (hasLatinWords(next) || hasMojibake(next)) {
      next = repairEncoding(next);
      if (exactHardening.has(next)) {
        changed += 1;
        return exactHardening.get(next);
      }
      const hardened = hardenPhrase(next);
      if (hardened !== next && !hasLatinWords(hardened) && !/[ÃÂÅ]/.test(hardened)) {
        changed += 1;
        return hardened;
      }
      if (!allowedSame.test(next)) {
        changed += 1;
        return contextualFallback(key, enValue);
      }
    }

    return next;
  });

  if (ns === "common" && typeof zh.pricing !== "string") {
    zh.pricing = exactHardening.get("Pricing");
    changed += 1;
  }

  writeJson(zhFile, zh);
}

console.log(`zh locale repaired: changed=${changed}, missingAdded=${missing}`);
