import React from "react";
import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const [baseCurrency, setBaseCurrency] = React.useState<string>("USD");
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  return (
    <div className={`layout ${theme}`}>
      {/* Navigation Header */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <h1>MarketsPivot</h1>
            <span className="subtitle">Bloomberg-Style Financial Markets</span>
          </div>

          <nav className="nav-links">
            <Link to="/stocks">Stock Exchanges</Link>
            <Link to="/currencies">Currencies</Link>
            <Link to="/crypto">Cryptocurrencies</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>

          <div className="header-controls">
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
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">{children}</main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Stock Exchanges</h4>
            <p>30+ global exchanges covering major markets worldwide</p>
          </div>
          <div className="footer-section">
            <h4>Currencies</h4>
            <p>20 global currencies with real-time rates and analysis</p>
          </div>
          <div className="footer-section">
            <h4>Cryptocurrencies</h4>
            <p>20 major cryptocurrencies with detailed metrics</p>
          </div>
          <div className="footer-section">
            <h4>About</h4>
            <ul>
              <li>
                <Link to="/">About MarketsPivot</Link>
              </li>
              <li>
                <Link to="/">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/">Terms of Service</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 MarketsPivot. Market data updated in real-time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
