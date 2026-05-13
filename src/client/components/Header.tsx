import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  const languages = [
    "English",
    "العربية",
    "中文(简体)",
    "中文(繁體)",
    "日本語",
    "한국어",
    "हिन्दी",
    "ไทย",
    "Tiếng Việt",
    "Italiano",
    "Español",
    "Deutsch",
    "Français",
    "Português",
    "Русский",
  ];

  return (
    <div className="top-header">
      <div className="language-strip" aria-label="Preferred language">
        <div className="languages" role="list">
          {languages.map((l) => (
            <button key={l} className={`lang ${l === "English" ? "active" : ""}`} role="listitem" aria-pressed={l === "English"}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="brand-row">
        <div className="brand-left">
          <Link to="/" className="logo-link">
            <img src="/logos/market_pivot-removebg-preview.png" alt="MarketsPivot" className="logo-img" />
          </Link>
        </div>

        <div className="brand-right">
          <Link to="/pricing" className="btn ghost">Pricing</Link>
          <Link to="/user" className="btn">Login</Link>
          <Link to="/user" className="btn primary">Sign Up</Link>
          <div className="utility-select">JPY ▾</div>
          <div className="utility-select">Light</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
