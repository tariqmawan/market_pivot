import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Mail, ShieldCheck } from "lucide-react";
import Header from "./Header";
import Navigation from "./Navigation";
import navigationItems from "./navigationData";
import LoginModal from "./LoginModal";
import "./Layout.css";
import { useAuthStore } from "../stores/authStore";
import AdminSidebar from "./admin/AdminSidebar";
import AdminHeader from "./admin/AdminHeader";
import { useI18n } from "../i18n";

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

  const [selectedCategory, setSelectedCategory] = React.useState<string>(() => {
    const matched = navigationItems.find((i) => path.startsWith(i.path));
    return matched ? matched.path : navigationItems[0]?.path ?? "/dashboard";
  });
  const { t } = useI18n();

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
            <Header selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </header>

          <div className="app-layout-body">
            <aside className="site-sidebar" aria-label="Main navigation">
              <Navigation selectedCategory={selectedCategory} />
            </aside>

            <div className="app-layout-main">
              <main className="site-main">
                <Outlet />
              </main>

              <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-top">
                <div className="footer-brand">
                  <Link to="/" className="footer-logo-card" aria-label={"MarketsPivot home"}>
                    <img src="/logos/marketpivot.jpeg" alt="MarketsPivot" />
                  </Link>
                  <p>{t("globalMarkets")}</p>
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
                  <h3>{t("ourProducts")}</h3>
                  <Link to="/markets">{t("markets") + ' ' + t("terminal")}</Link>
                  <Link to="/screener">{t("advancedScreener")}</Link>
                  <Link to="/economic-calendar">{t("calendar")}</Link>
                  <Link to="/pricing">{t("pricing")}</Link>
                </div>

                <div className="footer-column">
                  <h3>{t("legal")}</h3>
                  <Link to="/privacy">{t("privacyPolicy")}</Link>
                  <Link to="/terms">{t("andTerms")}</Link>
                  <Link to="/pricing">{t("billingPolicy")}</Link>
                  <Link to="/about">{t("aboutMarket")}</Link>
                </div>

                <div className="footer-column">
                  <h3>{t("company")}</h3>
                  <Link to="/about">{t("about")}</Link>
                  <Link to="/news">{t("news")}</Link>
                  <Link to="/user">{t("userPanel")}</Link>
                  <a href="mailto:support@marketspivot.com">{t("emailUs")}</a>
                </div>
              </div>

              <div className="footer-newsletter">
                <div>
                  <h3>{t("stayInTheLoop")}</h3>
                  <p>{t("newsletterCopy")}</p>
                </div>
                <form onSubmit={(event) => event.preventDefault()}>
                  <input type="email" placeholder={t("newsletterPlaceholder")} aria-label={t("email") ?? "Email address"} />
                  <button type="submit">{t("subscribe")}</button>
                </form>
              </div>

              <div className="footer-bottom">
                <div className="footer-copy">© 2026 MarketsPivot. All rights reserved.</div>
                <div className="footer-secure">
                  <ShieldCheck size={18} />
                  <span>{t("footerSecure")}</span>
                </div>
              </div>
            </div>
              </footer>
            </div>
          </div>

          <LoginModal />
        </>
      )}
    </div>
  );
};

export default Layout;
export { Layout };
