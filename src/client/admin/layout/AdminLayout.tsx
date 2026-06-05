import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useAuthStore } from "../../stores/authStore";
import { useI18n } from "../../i18n";

export default function AdminLayout() {
  const { t } = useI18n();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="mp-admin-shell">
      <AdminSidebar mobileOpen={mobileOpen} onMobileToggle={() => setMobileOpen((o) => !o)} />
      <div className="mp-admin-main">
        <AdminHeader
          userName={user?.name ?? "Admin"}
          userEmail={user?.email}
          onMobileToggle={() => setMobileOpen((o) => !o)}
          onLogout={() => void logout()}
        />
        <Outlet />
      </div>
    </div>
  );
}
