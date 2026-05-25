import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminErrorBoundary from "./components/AdminErrorBoundary";
import AdminLayout from "./layout/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import NewsPage from "./pages/NewsPage";
import MarketResourcePage from "./pages/MarketResourcePage";
import BillingPage from "./pages/BillingPage";
import PlatformPage from "./pages/PlatformPage";
import { useAuthStore } from "../stores/authStore";
import { canAccessAdmin } from "./permissions";

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, hydrateSession } = useAuthStore();

  React.useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  if (!isAuthenticated || !user || !canAccessAdmin(user.role)) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

export default function AdminApp() {
  return (
    <RequireAdmin>
      <AdminErrorBoundary>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="exchanges" element={<MarketResourcePage entity="exchanges" title="Exchanges" subtitle="Trading venues, sessions, metadata" />} />
            <Route path="stocks" element={<MarketResourcePage entity="exchanges" title="Stocks" subtitle="Exchange listings (companies module next)" />} />
            <Route path="forex" element={<MarketResourcePage entity="currencies" title="Forex" subtitle="Currencies and central bank metadata" />} />
            <Route path="crypto" element={<MarketResourcePage entity="cryptos" title="Crypto" subtitle="Coin listings and tokenomics" />} />
            <Route path="commodities" element={<MarketResourcePage entity="commodities" title="Commodities" subtitle="Spot prices and categories" />} />
            <Route path="regions" element={<MarketResourcePage entity="regions" title="Regions" subtitle="Macro regions and GDP" />} />
            <Route path="sectors" element={<MarketResourcePage entity="sectors" title="Sectors" subtitle="Industry sectors and performance" />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="api" element={<PlatformPage tab="api" />} />
            <Route path="seo" element={<PlatformPage tab="seo" />} />
            <Route path="ads" element={<PlatformPage tab="ads" />} />
            <Route path="audit" element={<PlatformPage tab="audit" />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </AdminErrorBoundary>
    </RequireAdmin>
  );
}
