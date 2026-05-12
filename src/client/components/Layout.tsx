import React from "react";
import { Link } from "react-router-dom";
import { languages, useI18n, type LanguageCode } from "../i18n";
import { useAuthStore } from "../stores/authStore";
import LoginModal from "./LoginModal";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const [baseCurrency, setBaseCurrency] = React.useState<string>("USD");
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");
  const { language, setLanguage, t } = useI18n();
  const { openLoginModal, openSignupModal, isAuthenticated, user, logout } = useAuthStore();
  const isAdminConsole = typeof window !== "undefined" && window.location.pathname === "/admin";

  return (
    <div className={`layout ${theme}`}>
      <header className="navbar">
        <div className="language-bar">
          <div className="language-bar-label">
            <span>{t("preferredLanguage")}</span>
            <span aria-hidden="true">-&gt;</span>
          </div>
          <div className="language-options" role="list" aria-label={t("preferredLanguage")}>
            {languages.map((item) => (
              <button
                key={item.code}
                className={`language-pill ${language === item.code ? "active" : ""}`}
                onClick={() => setLanguage(item.code as LanguageCode)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="navbar-container">
          <Link to="/" className="brand-lockup">
            <img 
              src="/logos/market_pivot-removebg-preview.png" 
              alt="Markets Pivot" 
              className="brand-logo"
            />
          </Link>

          <nav className="nav-links">
            <Link to="/dashboard">{t("markets")}</Link>
            <Link to="/stocks">{t("stocks")}</Link>
            <Link to="/currencies">{t("currencies")}</Link>
            <Link to="/crypto">{t("crypto")}</Link>
            <Link to="/commodities">{t("commodities")}</Link>
            <Link to="/regions">{t("regions")}</Link>
            <Link to="/sectors">{t("sectors")}</Link>
            <Link to="/news">{t("news")}</Link>
            <Link to="/user">{t("userPanel")}</Link>
            {isAuthenticated && user?.isAdmin && <Link to="/admin">Admin</Link>}
          </nav>

          <div className="header-controls">
           <Link to="/pricing" className="pricing-button">
            {t("pricing")}
          </Link>

            {isAuthenticated && user ? (
              <div className="user-menu">
                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.name}</span>
                <button onClick={logout} className="logout-button">{t("logout")}</button>
              </div>
            ) : (
              <>
                <button type="button" className="login-button" onClick={openLoginModal}>
                  {t("login")}
                </button>
                <button type="button" className="signup-button" onClick={openSignupModal}>
                  {t("signUp")}
                </button>
              </>
            )}

            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="currency-selector"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="AUD">AUD</option>
            </select>

            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? t("light") : t("dark")}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="main-content"
        data-layout="public"
        style={{ gridArea: "main" }}
      >{children}</main>


      {/* Login/Signup Modal */}
      <LoginModal />

      {/* Footer (hidden on admin console) */}
      <footer className="footer" style={{ display: isAdminConsole ? "none" : "block" }} >

        <div className="footer-content">
          <div className="footer-section">
            <h4>{t("stocks")}</h4>
            <p>{t("footerStocks")}</p>
          </div>
          <div className="footer-section">
            <h4>{t("currencies")}</h4>
            <p>{t("footerCurrencies")}</p>
          </div>
          <div className="footer-section">
            <h4>{t("crypto")}</h4>
            <p>{t("footerCrypto")}</p>
          </div>
          <div className="footer-section">
            <h4>{t("commodities")}</h4>
            <p>{t("commoditiesMeta")}</p>
          </div>
          <div className="footer-section">
            <h4>{t("regions")}</h4>
            <p>{t("regionsMeta")}</p>
          </div>
          <div className="footer-section">
            <h4>{t("about")}</h4>
            <ul>
              <li>
                <Link to="/about">{t("aboutMarket")}</Link>
              </li>

              <li>
                <Link to="/privacy">{t("privacy")}</Link>
              </li>
              <li>
                <Link to="/terms">{t("terms")}</Link>
              </li>

            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 MarketsPivot. {t("copyright")}</p>
        </div>
      </footer>
    </div>
  );
};


export default Layout;
