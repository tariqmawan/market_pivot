import React from "react";
import { Link } from "react-router-dom";
import { Crown } from "lucide-react";
import "./Header.css";
import { useI18n, languages, type LanguageCode } from "../i18n";
import { useAuthStore } from "../stores/authStore";
import navigationItems from "./navigationData";

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

type HeaderProps = {
  selectedCategory?: string;
  onSelectCategory?: (path: string) => void;
};

const Header: React.FC<HeaderProps> = ({ selectedCategory, onSelectCategory }) => {
  const { t, language, setLanguage } = useI18n();
  const [currency, setCurrency] = React.useState(() => localStorage.getItem("mp_currency") ?? "JPY");
  const [theme, setTheme] = React.useState(() => localStorage.getItem("mp_theme") ?? "Light");

  const { openLoginModal, openSignupModal } = useAuthStore();

  React.useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "Light");
    document.documentElement.classList.toggle("dark", theme === "Dark");
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

      <div className="main-header">
        <div className="brand-left">
          <Link to="/" className="logo-link">
            <img src="/logos/marketpivot.jpeg" alt="MarketsPivot" className="logo-icon" />
          </Link>
        </div>

        <nav className="header-center-nav" role="navigation" aria-label="Primary navigation">
          <div className="header-center-inner">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`header-nav-link ${selectedCategory === item.path ? "active" : ""}`}
                onClick={() => onSelectCategory?.(item.path)}
              >
                {t(item.label as any) ?? item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="brand-right">
          <Link to="/pricing" className="btn-pricing">
            <Crown size={18} strokeWidth={2.25} aria-hidden />
            <span>{t("pricing").toUpperCase()}</span>
          </Link>

          <button type="button" className="btn" onClick={openLoginModal}>
            {t("login")}
          </button>

          <button type="button" className="btn primary" onClick={openSignupModal}>
            {t("signUp")}
          </button>
          {/*remove theme and currency drop down*/}
        </div>
      </div>
    </div>
  );
};

export default Header;