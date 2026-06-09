const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "src", "client", "i18n", "locales");
const values = {
  en: "Current Admin",
  hi: "वर्तमान एडमिन",
  ar: "المشرف الحالي",
  de: "Aktueller Admin",
  es: "Admin actual",
  fr: "Admin actuel",
  pt: "Admin atual",
  zh: "当前管理员",
  ja: "現在の管理者",
  ko: "현재 관리자",
  ru: "Текущий администратор",
  th: "ผู้ดูแลปัจจุบัน",
  vi: "Quản trị viên hiện tại",
  pl: "Bieżący administrator",
  tr: "Geçerli yönetici",
  id: "Admin saat ini",
  ms: "Pentadbir semasa",
};

for (const locale of fs.readdirSync(root)) {
  const file = path.join(root, locale, "common.json");
  if (!fs.existsSync(file)) continue;
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  data.currentAdmin = values[locale] || values.en;
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

console.log("Added currentAdmin key.");
