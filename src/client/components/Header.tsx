import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <div className="top-header">
      <div className="language-strip">
        <div className="languages">
          <span className="lang active">English</span>
          <span className="lang">العربية</span>
          <span className="lang">中文(简体)</span>
          <span className="lang">日本語</span>
          <span className="lang">한국어</span>
          <span className="lang">ไทย</span>
          <span className="lang">Tiếng Việt</span>
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
