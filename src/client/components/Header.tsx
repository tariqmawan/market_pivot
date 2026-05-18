import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useI18n, languages, type LanguageCode } from "../i18n";
import { useAuthStore } from "../stores/authStore";

const languageDisplayNames: Record<LanguageCode, string> = {
  en: "English",
  ar: "العربية",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  th: "ไทย",
  vi: "Tiếng Việt",
  it: "Italiano",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  pt: "Português",
  ru: "Русский",
  pl: "Polski",
  tr: "Türkçe",
};

const Header: React.FC = () => {
  const { t, language, setLanguage } = useI18n();
  const [currency, setCurrency] = React.useState(() => localStorage.getItem("mp_currency") ?? "JPY");
  const [theme, setTheme] = React.useState(() => localStorage.getItem("mp_theme") ?? "Light");

  const { openLoginModal, openSignupModal } = useAuthStore();

  React.useEffect(() => {
    document.body.classList.toggle("light", theme === "Light");
  }, [theme]);

  const onSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
  };

  const onCurrencyChange = (value: string) => {
    setCurrency(value);
    localStorage.setItem("mp_currency", value);
  };

  const onThemeChange = (value: string) => {
    setTheme(value);
    localStorage.setItem("mp_theme", value);
  };

  return (
    <div className="top-header">
      <div className="language-strip">
        <div className="language-title">
          <span>{t("preferredLanguage")}</span>
          <span aria-hidden="true">-&gt;</span>
        </div>

        <div className="language-scroll">
          <div className="languages">
            {languages.map((l) => (
              <button
                key={l.code}
                className={`lang ${l.code === language ? "active" : ""}`}
                onClick={() => onSelectLanguage(l.code)}
                type="button"
              >
                {languageDisplayNames[l.code]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="brand-row">
        <div className="brand-left">
          <Link to="/" className="logo-link">
            <img
              src="/logos/market_pivot-removebg-preview.png"
              alt="MarketsPivot"
              className="logo-img"
            />
          </Link>
        </div>

        <div className="brand-right">
          <Link to="/pricing" className="btn ghost">
            {t("pricing")}
          </Link>

          <button type="button" className="btn" onClick={openLoginModal}>
            {t("login")}
          </button>

          <button type="button" className="btn primary" onClick={openSignupModal}>
            {t("signUp")}
          </button>

          <label className="utility-select">
            <span className="sr-only">Currency</span>
            <select value={currency} onChange={(event) => onCurrencyChange(event.target.value)}>
              <option value="USD">USD</option>
              <option value="INR">INR</option>
              <option value="JPY">JPY</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>

          <label className="utility-select">
            <span className="sr-only">Theme</span>
            <select value={theme} onChange={(event) => onThemeChange(event.target.value)}>
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Header;
