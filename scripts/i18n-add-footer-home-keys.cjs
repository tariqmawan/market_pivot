const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "src", "client", "i18n", "locales");

const commonValues = {
  en: { billing: "Billing", notifications: "Notifications" },
  hi: { billing: "बिलिंग", notifications: "सूचनाएं" },
  ar: { billing: "الفوترة", notifications: "الإشعارات" },
  de: { billing: "Abrechnung", notifications: "Benachrichtigungen" },
  es: { billing: "Facturación", notifications: "Notificaciones" },
  fr: { billing: "Facturation", notifications: "Notifications" },
  pt: { billing: "Faturamento", notifications: "Notificações" },
  zh: { billing: "账单", notifications: "通知" },
  ja: { billing: "請求", notifications: "通知" },
  ko: { billing: "청구", notifications: "알림" },
  ru: { billing: "Биллинг", notifications: "Уведомления" },
  th: { billing: "การเรียกเก็บเงิน", notifications: "การแจ้งเตือน" },
  vi: { billing: "Thanh toán", notifications: "Thông báo" },
  pl: { billing: "Rozliczenia", notifications: "Powiadomienia" },
  tr: { billing: "Faturalandırma", notifications: "Bildirimler" },
  id: { billing: "Penagihan", notifications: "Notifikasi" },
  ms: { billing: "Pengebilan", notifications: "Pemberitahuan" },
};

const marketsValues = {
  en: { commoditiesMeta: "Energy, metals, agriculture, and industrial inputs" },
  hi: { commoditiesMeta: "ऊर्जा, धातु, कृषि और औद्योगिक इनपुट" },
  ar: { commoditiesMeta: "الطاقة والمعادن والزراعة والمدخلات الصناعية" },
  de: { commoditiesMeta: "Energie, Metalle, Landwirtschaft und Industrieinputs" },
  es: { commoditiesMeta: "Energía, metales, agricultura e insumos industriales" },
  fr: { commoditiesMeta: "Énergie, métaux, agriculture et intrants industriels" },
  pt: { commoditiesMeta: "Energia, metais, agricultura e insumos industriais" },
  zh: { commoditiesMeta: "能源、金属、农业和工业投入" },
  ja: { commoditiesMeta: "エネルギー、金属、農業、産業投入" },
  ko: { commoditiesMeta: "에너지, 금속, 농업 및 산업 투입재" },
  ru: { commoditiesMeta: "Энергия, металлы, сельское хозяйство и промышленные ресурсы" },
  th: { commoditiesMeta: "พลังงาน โลหะ เกษตร และวัตถุดิบอุตสาหกรรม" },
  vi: { commoditiesMeta: "Năng lượng, kim loại, nông nghiệp và đầu vào công nghiệp" },
  pl: { commoditiesMeta: "Energia, metale, rolnictwo i surowce przemysłowe" },
  tr: { commoditiesMeta: "Enerji, metaller, tarım ve endüstriyel girdiler" },
  id: { commoditiesMeta: "Energi, logam, pertanian, dan input industri" },
  ms: { commoditiesMeta: "Tenaga, logam, pertanian dan input industri" },
};

for (const locale of fs.readdirSync(root)) {
  const commonFile = path.join(root, locale, "common.json");
  const marketsFile = path.join(root, locale, "markets.json");
  if (!fs.existsSync(commonFile) || !fs.existsSync(marketsFile)) continue;
  const common = JSON.parse(fs.readFileSync(commonFile, "utf8"));
  const markets = JSON.parse(fs.readFileSync(marketsFile, "utf8"));
  Object.assign(common, commonValues[locale] || commonValues.en);
  Object.assign(markets, marketsValues[locale] || marketsValues.en);
  fs.writeFileSync(commonFile, `${JSON.stringify(common, null, 2)}\n`, "utf8");
  fs.writeFileSync(marketsFile, `${JSON.stringify(markets, null, 2)}\n`, "utf8");
}

console.log("Added footer/home cleanup keys.");
