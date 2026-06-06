import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { hasPermission, PERMISSIONS } from "../../admin/permissions";
import type { Permission } from "../../admin/types";
import { useI18n } from "../../i18n";


// Local lightweight icon set (no external lucide-react dependency)
function Icon({ children }: { children: React.ReactNode }) {
  return <span className="mp-admin-icon">{children}</span>;
}

const BarChart3 = (props: { size?: number }) => (
  <Icon>
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 15V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 15V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M17 15V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </Icon>
);

const CreditCard = (props: { size?: number }) => (
  <Icon>
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 7h18v10H3V7Z" stroke="currentColor" strokeWidth="2" />
      <path d="M7 11h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </Icon>
);

const DollarSign = (props: { size?: number }) => (
  <Icon>
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M17 6.5c0-1.7-2.2-3-5-3-2.8 0-5 1.3-5 3s2.2 3 5 3c2.8 0 5 1.3 5 3s-2.2 3-5 3-5-1.3-5-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </Icon>
);

const LayoutDashboard = (props: { size?: number }) => (
  <Icon>
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 13h6V4H4v9Z" stroke="currentColor" strokeWidth="2" />
      <path d="M14 20h6V11h-6v9Z" stroke="currentColor" strokeWidth="2" />
      <path d="M14 9h6V4h-6v5Z" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20h6v-5H4v5Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  </Icon>
);

const Users = (props: { size?: number }) => (
  <Icon>
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </Icon>
);

const ChevronDown = (props: { className?: string; size?: number }) => (
  <span className={props.className} aria-hidden="true">
    <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

const Settings = (props: { size?: number }) => (
  <Icon>
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1a2 2 0 0 1-1.4 3.4h-.3a1.8 1.8 0 0 0-2 .4 1.8 1.8 0 0 0-.5 2.1 2 2 0 0 1-3.8 0 1.8 1.8 0 0 0-.5-2.1 1.8 1.8 0 0 0-2-.4h-.3A2 2 0 0 1 2.5 17l.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.8-1.2 2 2 0 0 1 0-4 1.8 1.8 0 0 0 1.8-1.2 1.8 1.8 0 0 0-.4-2l-.1-.1A2 2 0 0 1 3.6 2.6h.3a1.8 1.8 0 0 0 2-.4 1.8 1.8 0 0 0 .5-2.1 2 2 0 0 1 3.8 0 1.8 1.8 0 0 0 .5 2.1 1.8 1.8 0 0 0 2 .4h.3A2 2 0 0 1 21.5 7l-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.8 1.2 2 2 0 0 1 0 4 1.8 1.8 0 0 0-1.8 1.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Icon>
);

const Menu = (props: { size?: number }) => (
  <Icon>
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </Icon>
);

const Shield = (props: { size?: number }) => (
  <Icon>
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Icon>
);

const Bell = (props: { size?: number }) => (
  <Icon>
    <svg width={props.size ?? 18} height={props.size ?? 18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </Icon>
);


type NavItem = {
  label: string;
  href?: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string;
  permission?: Permission;
};

type NavGroup = {
  label: string;
  icon: React.ReactNode;
  items: Array<NavItem>;
};

const groups: NavGroup[] = [
  {
    label: "Dashboard",
    icon: <BarChart3 size={18} />,
    items: [
      { label: "Overview", href: "/admin", icon: <LayoutDashboard size={18} />, permission: PERMISSIONS.DASHBOARD_VIEW },
      { label: "Audit Logs", href: "/admin/audit", icon: <Shield size={18} />, permission: PERMISSIONS.AUDIT_VIEW },
    ],
  },
  {
    label: "Market Data",
    icon: <BarChart3 size={18} />,
    items: [
      { label: "Exchanges", href: "/admin/exchanges", icon: <LayoutDashboard size={18} />, permission: PERMISSIONS.MARKET_VIEW },
      { label: "Stocks", href: "/admin/stocks", icon: <BarChart3 size={18} />, permission: PERMISSIONS.MARKET_VIEW },
      { label: "Forex", href: "/admin/forex", icon: <DollarSign size={18} />, permission: PERMISSIONS.MARKET_VIEW },
      { label: "Crypto", href: "/admin/crypto", icon: <CreditCard size={18} />, permission: PERMISSIONS.MARKET_VIEW },
      { label: "Commodities", href: "/admin/commodities", icon: <Settings size={18} />, permission: PERMISSIONS.MARKET_VIEW },
      { label: "Regions", href: "/admin/regions", icon: <LayoutDashboard size={18} />, permission: PERMISSIONS.MARKET_VIEW },
      { label: "Sectors", href: "/admin/sectors", icon: <BarChart3 size={18} />, permission: PERMISSIONS.MARKET_VIEW },
    ],
  },
  {
    label: "Content",
    icon: <Bell size={18} />,
    items: [
      { label: "News CMS", href: "/admin/news", icon: <Bell size={18} />, permission: PERMISSIONS.NEWS_VIEW },
      { label: "Economic Calendar", href: "/admin/economic-calendar", icon: <BarChart3 size={18} />, permission: PERMISSIONS.CALENDAR_VIEW },
      { label: "SEO", href: "/admin/seo", icon: <Settings size={18} />, permission: PERMISSIONS.SEO_EDIT },
      { label: "Advertisements", href: "/admin/ads", icon: <BarChart3 size={18} />, permission: PERMISSIONS.ADS_EDIT },
    ],
  },
  {
    label: "Users & Revenue",
    icon: <Users size={18} />,
    items: [
      { label: "Users", href: "/admin/users", icon: <Users size={18} />, permission: PERMISSIONS.USERS_VIEW },
      { label: "Pricing Plans", href: "/admin/pricing", icon: <DollarSign size={18} />, permission: PERMISSIONS.BILLING_EDIT },
      { label: "Subscriptions", href: "/admin/billing", icon: <CreditCard size={18} />, permission: PERMISSIONS.BILLING_VIEW },
    ],
  },
  {
    label: "Platform",
    icon: <Shield size={18} />,
    items: [
      { label: "API Keys", href: "/admin/api", icon: <BarChart3 size={18} />, permission: PERMISSIONS.API_VIEW },
    ],
  },
];

function isActiveHref(href: string | undefined, pathname: string) {
  if (!href) return false;
  if (href === "/admin") return pathname === "/admin" || pathname === "/admin/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AdminSidebar({
  mobileOpen,
  onMobileToggle,
}: {
  mobileOpen: boolean;
  onMobileToggle: () => void;
}) {
  const { t } = useI18n();
  const location = useLocation();
  const role = useAuthStore((s) => s.user?.role ?? "user");

  const visibleGroups = React.useMemo(
    () =>
      groups
        .map((g) => ({
          ...g,
          items: g.items.filter((item) => !item.permission || hasPermission(role, item.permission)),
        }))
        .filter((g) => g.items.length > 0),
    [role]
  );

  const activeGroups = React.useMemo(
    () =>
      visibleGroups.reduce<Record<string, boolean>>((acc, group) => {
        acc[group.label] = group.items.some((item) => isActiveHref(item.href, location.pathname));
        return acc;
      }, {}),
    [location.pathname, visibleGroups]
  );
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    setExpandedGroups((current) => ({ ...current, ...activeGroups }));
  }, [activeGroups]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((current) => ({ ...current, [label]: !(current[label] ?? activeGroups[label]) }));
  };

  return (
    <>
      <button
        type="button"
        className={`mp-admin-sidebar-backdrop ${mobileOpen ? "open" : ""}`}
        aria-label={t("src_client_components_admin_adminsidebar__l247__h0")}
        onClick={onMobileToggle}
      />

      <aside
        className={`mp-admin-sidebar ${mobileOpen ? "open" : ""}`}
        aria-label={t("src_client_components_admin_adminsidebar__l253__h2")}
      >
        <div className="mp-admin-sidebar-inner">
        <div className="mp-admin-sidebar-header">
          <div className="mp-admin-logo">
            <div className="mp-admin-logo-mark" aria-hidden="true">
              <BarChart3 size={18} />
            </div>
            <div className="mp-admin-logo-text">
              <div className="mp-admin-logo-title">{t("src_client_components_admin_adminsidebar__l262__h4")}</div>
              <div className="mp-admin-logo-sub">{t("src_client_components_admin_adminsidebar__l263__h5")}</div>
            </div>
          </div>

          <button
            type="button"
            className="mp-admin-mobile-close"
            onClick={onMobileToggle}
            aria-label={t("src_client_components_admin_adminsidebar__l271__h6")}
          >
            <Menu size={18} />
          </button>
        </div>

        <nav className="mp-admin-nav">
          {visibleGroups.map((group) => (
            <div key={group.label} className="mp-admin-nav-group">
              <button
                type="button"
                className="mp-admin-nav-group-head"
                onClick={() => toggleGroup(group.label)}
                aria-expanded={expandedGroups[group.label] ?? activeGroups[group.label]}
              >
                <span className="mp-admin-nav-group-icon">{group.icon}</span>
                <span className="mp-admin-nav-group-label">{group.label}</span>
                <ChevronDown
                  className={`mp-admin-nav-group-chevron ${
                    expandedGroups[group.label] ?? activeGroups[group.label] ? "open" : ""
                  }`}
                  size={16}
                />
              </button>

              <div className={`mp-admin-nav-items ${expandedGroups[group.label] ?? activeGroups[group.label] ? "open" : ""}`}>
                {group.items.map((item) => {
                  const active = isActiveHref(item.href, location.pathname);
                  return (
                    <Link
                      key={item.label}
                      to={item.href ?? "#"}
                      className={`mp-admin-nav-link ${active ? "active" : ""}`}
                      onClick={() => {
                        if (mobileOpen) onMobileToggle();
                      }}
                    >
                      <span className="mp-admin-nav-link-icon">{item.icon}</span>
                      <span className="mp-admin-nav-link-label">{item.label}</span>
                      {item.badge ? <span className="mp-admin-badge">{item.badge}</span> : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mp-admin-sidebar-footer">
          <div className="mp-admin-sidebar-footer-chip">
            <Bell size={16} />
            <span>{t("src_client_components_admin_adminsidebar__l322__h8")}</span>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}

