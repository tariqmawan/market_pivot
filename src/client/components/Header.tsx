import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useI18n, languages, type LanguageCode } from "../i18n";

const Header: React.FC = () => {
  const { t, language, setLanguage } = useI18n();

  const onSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
  };

  return (
    <div className="top-header">
  <div className="language-strip">

  <div className="language-title">
    <span>Preferred Language</span>
    <span>→</span>
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
          {l.label}
        </button>
      ))}
    </div>
  </div>

</div>

      <div className="brand-row">
        <div className="brand-left">
          <Link to="/" className="logo-link">
            <img src="/logos/market_pivot-removebg-preview.png" alt="MarketsPivot" className="logo-img" />
          </Link>
        </div>

        <div className="brand-right">
          <Link to="/pricing" className="btn ghost">
            Pricing
          </Link>
          <Link to="/user" className="btn">
            {t("login")}
          </Link>
          <Link to="/user" className="btn primary">
            {t("signUp")}
          </Link>

          <div className="utility-select">JPY ▾</div>
          <div className="utility-select">Light</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
