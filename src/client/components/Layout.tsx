import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Mail, ShieldCheck } from "lucide-react";
import Header from "./Header";
import Navigation from "./Navigation";
import { useI18n } from "../i18n";
import navigationItems from "./navigationData";
import LoginModal from "./LoginModal";
import "./Layout.css";
import { useAuthStore } from "../stores/authStore";
import AdminSidebar from "./admin/AdminSidebar";
import AdminHeader from "./admin/AdminHeader";




const getSelectedCategoryPath = (path: string) => {
  if (path === "/indices" || path === "/etfs" || path === "/bonds-yields") return "/coverage";
  if (path.startsWith("/currencies")) return "/forex";

  const matched = [...navigationItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) => path === item.path || path.startsWith(`${item.path}/`));

  return matched ? matched.path : navigationItems[0]?.path ?? "/dashboard";
};

const Layout: React.FC = () => {
  const { t } = useI18n();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  const path = location.pathname;
  const sidebarRef = React.useRef<HTMLElement | null>(null);
  const [isSidebarPinnedOpen, setIsSidebarPinnedOpen] = React.useState(false);
  const [isSidebarPreviewOpen, setIsSidebarPreviewOpen] = React.useState(false);
  const [isHoverSuppressed, setIsHoverSuppressed] = React.useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isMobileViewport, setIsMobileViewport] = React.useState(false);
  const isSidebarExpanded = isMobileViewport || isSidebarPinnedOpen || isSidebarPreviewOpen;

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const syncViewport = () => setIsMobileViewport(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  React.useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [path]);

  React.useEffect(() => {
    document.body.classList.toggle("sidebar-drawer-open", isMobileSidebarOpen);
    return () => document.body.classList.remove("sidebar-drawer-open");
  }, [isMobileSidebarOpen]);

  React.useEffect(() => {
    if (!isMobileViewport) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobileViewport]);

  React.useEffect(() => {
    if (!isMobileSidebarOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileSidebarOpen]);

  const handleSidebarToggle = React.useCallback(() => {
    if (isMobileViewport) {
      setIsMobileSidebarOpen((open) => !open);
      return;
    }

    setIsSidebarPinnedOpen((open) => !open);
    setIsSidebarPreviewOpen(false);
    setIsHoverSuppressed(false);
  }, [isMobileViewport]);

  const closeMobileSidebar = React.useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  const openSidebarPreview = React.useCallback(() => {
    if (!isMobileViewport && !isSidebarPinnedOpen && !isHoverSuppressed) {
      setIsSidebarPreviewOpen(true);
    }
  }, [isHoverSuppressed, isMobileViewport, isSidebarPinnedOpen]);

  const closeSidebarPreview = React.useCallback(() => {
    setIsSidebarPreviewOpen(false);
    setIsHoverSuppressed(false);
  }, []);

  const handleSidebarFocus = React.useCallback(() => {
    if (!isMobileViewport && !isSidebarPinnedOpen) {
      setIsSidebarPreviewOpen(true);
    }
  }, [isMobileViewport, isSidebarPinnedOpen]);

  const handleSidebarBlur = React.useCallback((event: React.FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      closeSidebarPreview();
    }
  }, [closeSidebarPreview]);

  const handleParentActivate = React.useCallback(() => {
    if (!isMobileViewport && !isSidebarPinnedOpen) {
      setIsHoverSuppressed(false);
      setIsSidebarPreviewOpen(true);
    }
  }, [isMobileViewport, isSidebarPinnedOpen]);

  const handleHeaderCategorySelect = React.useCallback((categoryPath: string) => {
    setSelectedCategory(categoryPath);
    setIsHoverSuppressed(false);

    if (isMobileViewport) {
      setIsMobileSidebarOpen(true);
      return;
    }

    setIsSidebarPinnedOpen(true);
    setIsSidebarPreviewOpen(false);
  }, [isMobileViewport]);

  const closeSidebarFromContent = React.useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.target instanceof HTMLElement && event.target.closest('a, button, input, textarea, select, label')) {
      return;
    }

    if (isMobileViewport) {
      setIsMobileSidebarOpen(false);
      return;
    }

    if (!isSidebarPinnedOpen && !isSidebarPreviewOpen && isHoverSuppressed) {
      return;
    }

    setIsSidebarPinnedOpen(false);
    setIsSidebarPreviewOpen(false);
    setIsHoverSuppressed(true);
  }, [isMobileViewport, isSidebarPinnedOpen, isSidebarPreviewOpen, isHoverSuppressed]);

  const handleLeafNavigate = React.useCallback(() => {
    if (isMobileViewport) {
      setIsMobileSidebarOpen(false);
      return;
    }

    setIsSidebarPinnedOpen(false);
    setIsSidebarPreviewOpen(false);
    setIsHoverSuppressed(true);
  }, [isMobileViewport]);

  const isAdminConsole = path === "/admin" || path.startsWith("/admin/");

  // Admin sidebar/header require props for mobile toggle.
  // Default to "closed" since we don't have a mobile drawer implementation here.
  const mobileOpen = false;
  const onMobileToggle = React.useCallback(() => {
    // no-op (prevents layout from crashing due to missing required props)
  }, []);

  const [selectedCategory, setSelectedCategory] = React.useState<string>(() => {
    return getSelectedCategoryPath(path);
  });

  React.useEffect(() => {
    setSelectedCategory(getSelectedCategoryPath(path));
  }, [path]);

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">{t("layout.h0")}</a>
      {isAdminConsole ? (
        <div className="admin-console">
          <AdminHeader onMobileToggle={onMobileToggle} />
          <div className="admin-body">
            <AdminSidebar mobileOpen={mobileOpen} onMobileToggle={onMobileToggle} />
            <main className="admin-main" id="main-content" tabIndex={-1}>
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
            <Header
              selectedCategory={selectedCategory}
              onSelectCategory={handleHeaderCategorySelect}
              isSidebarCollapsed={isMobileViewport ? !isMobileSidebarOpen : !isSidebarPinnedOpen}
              onSidebarToggle={handleSidebarToggle}
            />
          </header>

          <div
            className={`app-layout-body ${isSidebarPinnedOpen ? "sidebar-pinned" : ""} ${
              isSidebarPreviewOpen ? "sidebar-preview" : ""
            } ${isSidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"} ${
              isMobileSidebarOpen ? "sidebar-open" : ""
            }`}
          >
            <button
              type="button"
              className={`sidebar-backdrop ${isMobileSidebarOpen ? "visible" : ""}`}
              aria-label={t("layout.h1")}
              onClick={closeMobileSidebar}
            />

            <aside
              ref={sidebarRef}
              className={`site-sidebar ${isMobileSidebarOpen ? "open" : ""}`}
              aria-label={t("layout.h3")}
              onMouseEnter={openSidebarPreview}
              onMouseLeave={closeSidebarPreview}
              onFocus={handleSidebarFocus}
              onBlur={handleSidebarBlur}
            >
              <Navigation
                collapsed={!isSidebarExpanded}
                mobileOpen={isMobileSidebarOpen}
                selectedCategoryPath={selectedCategory}
                onNavigate={handleLeafNavigate}
                onParentActivate={handleParentActivate}
              />
            </aside>

            <div className="app-layout-main" onPointerDown={closeSidebarFromContent}>
              <main className="site-main" id="main-content" tabIndex={-1}>
                <Outlet />
              </main>

              <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-top">
                <div className="footer-brand">
                  <Link to="/" className="footer-logo-card" aria-label={t("layout.h5")}>
                    <img src="/logos/marketpivot.jpeg" alt={t("layout.h7")} />
                  </Link>
                  <p>{t("globalMarkets")}</p>
                  <div className="footer-socials" aria-label={t("layout.h8")}>
                    <a href="https://x.com" aria-label="X">
                      <span>X</span>
                    </a>
                    <a href="mailto:support@marketspivot.com" aria-label={t("layout.h10")}>
                      <Mail size={22} />
                    </a>
                    <a href="https://facebook.com" aria-label={t("layout.h12")}>
                      <span>f</span>
                    </a>
                    <a href="https://instagram.com" aria-label={t("layout.h14")}>
                      <span>◎</span>
                    </a>
                    <a href="https://tiktok.com" aria-label={t("layout.h16")}>
                      <span>♪</span>
                    </a>
                    <a href="https://linkedin.com" aria-label={t("layout.h18")}>
                      <span>{t("layout.h20")}</span>
                    </a>
                  </div>
                </div>

                <div className="footer-column">
                  <h3>{t("ourProducts")}</h3>
                  <Link to="/markets">{t("markets") + ' ' + t("terminal")}</Link>
                  <Link to="/screener">{t("advancedScreener")}</Link>
                  <Link to="/economic-calendar">{t("calendar")}</Link>
                  <Link to="/pricing">{t("pricing")}</Link>
                  <Link to="/billing">{t("layout.h21")}</Link>
                  <Link to="/notifications">{t("layout.h22")}</Link>
                </div>

                <div className="footer-column">
                  <h3>{t("legal")}</h3>
                  <Link to="/privacy">{t("privacyPolicy")}</Link>
                  <Link to="/terms">{t("terms")}</Link>
                  <Link to="/billing-policy">{t("billingPolicy")}</Link>
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
                <div className="footer-copy">{t("layout.h23")}</div>
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

export { Layout };
