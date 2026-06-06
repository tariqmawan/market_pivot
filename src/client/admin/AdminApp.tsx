import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useI18n } from "../i18n";
import AdminErrorBoundary from "./components/AdminErrorBoundary";
import AdminLayout from "./layout/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import NewsPage from "./pages/NewsPage";
import BillingPage from "./pages/BillingPage";
import PlatformPage from "./pages/PlatformPage";
import ExchangeAdminPage from "./pages/ExchangeAdminPage";
import StockAdminPage from "./pages/StockAdminPage";
import ForexAdminPage from "./pages/ForexAdminPage";
import CryptoAdminPage from "./pages/CryptoAdminPage";
import CommodityAdminPage from "./pages/CommodityAdminPage";
import RegionAdminPage from "./pages/RegionAdminPage";
import SectorAdminPage from "./pages/SectorAdminPage";
import SeoAdminPage from "./pages/SeoAdminPage";
import ApiKeyAdminPage from "./pages/ApiKeyAdminPage";
import AdvertisementAdminPage from "./pages/AdvertisementAdminPage";
import EconomicCalendarAdminPage from "./pages/EconomicCalendarAdminPage";
import PricingAdminPage from "./pages/PricingAdminPage";
import ForbiddenPage from "../components/ForbiddenPage";
import { useAuthStore } from "../stores/authStore";
import { canAccessAdmin } from "./permissions";

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, hydrateSession } = useAuthStore();

  React.useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  // Not authenticated — bounce to login (preserves the existing UX).
  if (!isAuthenticated || !user) {
    return <Navigate to="/admin/login" replace />;
  }
  // Authenticated but not allowed — show a real 403, not a silent redirect.
  if (!canAccessAdmin(user.role)) {
    return <ForbiddenPage message="Your account does not have admin access." />;
  }
  return <>{children}</>;
}

export default function AdminApp() {
  const { t } = useI18n();
  return (
    <RequireAdmin>
      <AdminErrorBoundary>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="exchanges" element={<ExchangeAdminPage />} />
            <Route path="stocks" element={<StockAdminPage />} />
            <Route path="forex" element={<ForexAdminPage />} />
            <Route path="crypto" element={<CryptoAdminPage />} />
            <Route path="commodities" element={<CommodityAdminPage />} />
            <Route path="regions" element={<RegionAdminPage />} />
            <Route path="sectors" element={<SectorAdminPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="pricing" element={<PricingAdminPage />} />
            <Route path="api" element={<ApiKeyAdminPage />} />
            <Route path="api-keys" element={<ApiKeyAdminPage />} />
            <Route path="seo" element={<SeoAdminPage />} />
            <Route path="ads" element={<AdvertisementAdminPage />} />
            <Route path="advertisements" element={<AdvertisementAdminPage />} />
            <Route path="economic-calendar" element={<EconomicCalendarAdminPage />} />
            <Route path="audit" element={<PlatformPage tab="audit" />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </AdminErrorBoundary>
    </RequireAdmin>
  );
}
