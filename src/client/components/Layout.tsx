import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
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
              <div className="footer-links">
                <Link to="/about">About MarketsPivot</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/terms">Terms of Service</Link>
              </div>
              <div className="footer-copy">© MarketsPivot</div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Layout;
export { Layout };
