import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Mail, ShieldCheck } from "lucide-react";
import Header from "./Header";
import Navigation from "./Navigation";
import LoginModal from "./LoginModal";
import { useAuthStore } from "../stores/authStore";
import AdminSidebar from "./admin/AdminSidebar";
import AdminHeader from "./admin/AdminHeader";

const Layout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  const path = location.pathname;

  const isAdminConsole = path === "/admin" || path === "/admin/login" || path.startsWith("/admin?");

  // Admin sidebar/header require props for mobile toggle.
  // Default to "closed" since we don't have a mobile drawer implementation here.
  const mobileOpen = false;
  const onMobileToggle = React.useCallback(() => {
    // no-op (prevents layout from crashing due to missing required props)
  }, []);

  return (
    <div className="app-shell">
      {isAdminConsole ? (
        <div className="admin-console">
          <AdminHeader onMobileToggle={onMobileToggle} />
          <div className="admin-body">
            <AdminSidebar mobileOpen={mobileOpen} onMobileToggle={onMobileToggle} />
            <main className="admin-main">
              <Outlet />
            </main>
          </div>

          {isAuthenticated && user ? (
            <div style={{ padding: 12, opacity: 0.85 }}>
              <div style={{ marginBottom: 8 }}>
                Current Admin: <strong>{user.email}</strong>
              </div>
              <button onClick={logout} className="secondary-action">
                Logout
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <header className="site-header">
            <Header />
            <Navigation />
          </header>

          <main className="site-main">
            <Outlet />
          </main>

          <LoginModal />

          <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-top">
                <div className="footer-brand">
                  <Link to="/" className="footer-logo-card" aria-label="MarketsPivot home">
                    <img src="/logos/market_pivot-removebg-preview.png" alt="MarketsPivot" />
                  </Link>
                  <p>Global markets intelligence for equities, forex, crypto, commodities, regions, sectors, and economic events.</p>
                  <div className="footer-socials" aria-label="Social links">
                    <a href="https://x.com" aria-label="X">
                      <span>X</span>
                    </a>
                    <a href="mailto:support@marketspivot.com" aria-label="Email">
                      <Mail size={22} />
                    </a>
                    <a href="https://facebook.com" aria-label="Facebook">
                      <span>f</span>
                    </a>
                    <a href="https://instagram.com" aria-label="Instagram">
                      <span>◎</span>
                    </a>
                    <a href="https://tiktok.com" aria-label="TikTok">
                      <span>♪</span>
                    </a>
                    <a href="https://linkedin.com" aria-label="LinkedIn">
                      <span>in</span>
                    </a>
                  </div>
                </div>

                <div className="footer-column">
                  <h3>Our Products</h3>
                  <Link to="/markets">Markets Terminal</Link>
                  <Link to="/screener">Advanced Screener</Link>
                  <Link to="/economic-calendar">Economic Calendar</Link>
                  <Link to="/pricing">API Subscriptions</Link>
                </div>

                <div className="footer-column">
                  <h3>Legal</h3>
                  <Link to="/privacy">Privacy Policy</Link>
                  <Link to="/terms">Terms & Conditions</Link>
                  <Link to="/pricing">Billing Policy</Link>
                  <Link to="/about">Data Disclaimer</Link>
                </div>

                <div className="footer-column">
                  <h3>Company</h3>
                  <Link to="/about">About Us</Link>
                  <Link to="/news">Market News</Link>
                  <Link to="/user">User Account</Link>
                  <a href="mailto:support@marketspivot.com">Email Us</a>
                </div>
              </div>

              <div className="footer-newsletter">
                <div>
                  <h3>Stay In The Loop</h3>
                  <p>Get market briefs, product updates, and investment intelligence delivered to your inbox.</p>
                </div>
                <form onSubmit={(event) => event.preventDefault()}>
                  <input type="email" placeholder="Enter your email" aria-label="Email address" />
                  <button type="submit">Subscribe</button>
                </form>
              </div>

              <div className="footer-bottom">
                <div className="footer-copy">© 2026 MarketsPivot. All rights reserved.</div>
                <div className="footer-secure">
                  <ShieldCheck size={18} />
                  <span>256-bit SSL · GDPR compliant · Market data protected</span>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Layout;
export { Layout };
