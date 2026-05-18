import React from "react";
import { Link, useLocation } from "react-router-dom";
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
      { label: "Overview", href: "/admin", icon: <LayoutDashboard size={18} /> },
      { label: "API Usage", href: "/admin?tab=api-usage", icon: <BarChart3 size={18} />, badge: "Live" },
      { label: "Data Sync Status", href: "/admin?tab=data-sync", icon: <Settings size={18} /> },
      { label: "News Ingestion", href: "/admin?tab=news-ingestion", icon: <Bell size={18} /> },
    ],
  },
  {
    label: "Market Data",
    icon: <BarChart3 size={18} />,
    items: [
      { label: "Exchanges", href: "/admin?tab=exchanges", icon: <LayoutDashboard size={18} /> },
      { label: "Stocks", href: "/admin?tab=stocks", icon: <BarChart3 size={18} /> },
      { label: "Forex", href: "/admin?tab=forex", icon: <DollarSign size={18} /> },
      { label: "Crypto", href: "/admin?tab=crypto", icon: <CreditCard size={18} /> },
      { label: "Commodities", href: "/admin?tab=commodities", icon: <Settings size={18} /> },
      { label: "Regions", href: "/admin?tab=regions", icon: <LayoutDashboard size={18} /> },
      { label: "Sectors", href: "/admin?tab=sectors", icon: <BarChart3 size={18} /> },
    ],
  },
  {
    label: "Content",
    icon: <Bell size={18} />,
    items: [
      { label: "News CMS", href: "/admin?tab=news-cms", icon: <Bell size={18} /> },
      { label: "Economic Calendar", href: "/admin?tab=economic-calendar", icon: <LayoutDashboard size={18} /> },
      { label: "SEO Management", href: "/admin?tab=seo", icon: <Settings size={18} /> },
      { label: "Advertisements", href: "/admin?tab=ads", icon: <BarChart3 size={18} /> },
    ],
  },
  {
    label: "Users & Revenue",
    icon: <Users size={18} />,
    items: [
      { label: "Users", href: "/admin?tab=customers", icon: <Users size={18} /> },
      { label: "Roles", href: "/admin?tab=roles", icon: <Shield size={18} /> },
      { label: "Subscriptions", href: "/admin?tab=billing", icon: <CreditCard size={18} /> },
      { label: "Revenue", href: "/admin?tab=revenue", icon: <DollarSign size={18} /> },
      { label: "Payouts", href: "/admin?tab=payouts", icon: <DollarSign size={18} /> },
    ],
  },
  {
    label: "Platform",
    icon: <Shield size={18} />,
    items: [
      { label: "API Management", href: "/admin?tab=api-management", icon: <BarChart3 size={18} /> },
      { label: "AI & Analytics", href: "/admin?tab=ai-analytics", icon: <BarChart3 size={18} />, badge: "Future" },
      { label: "Settings", href: "/admin?tab=settings", icon: <Settings size={18} /> },
    ],
  },
];

function getTabFromHref(href: string | undefined) {
  if (!href) return false;
  const query = href.split("?")[1] ?? "";
  return new URLSearchParams(query).get("tab") ?? "";
}

function isActiveHref(href: string | undefined, pathname: string, activeTab: string) {
  if (!href) return false;
  const [hrefPath] = href.split("?");
  if (hrefPath !== pathname) return false;
  return getTabFromHref(href) === activeTab;
}

export default function AdminSidebar({
  mobileOpen,
  onMobileToggle,
}: {
  mobileOpen: boolean;
  onMobileToggle: () => void;
}) {
  const location = useLocation();
  const activeTab = new URLSearchParams(location.search).get("tab") ?? "";
  const activeGroups = React.useMemo(
    () =>
      groups.reduce<Record<string, boolean>>((acc, group) => {
        acc[group.label] = group.items.some((item) => isActiveHref(item.href, location.pathname, activeTab));
        return acc;
      }, {}),
    [activeTab, location.pathname]
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
        aria-label="Close admin menu"
        onClick={onMobileToggle}
      />

      <aside
        className={`mp-admin-sidebar ${mobileOpen ? "open" : ""}`}
        aria-label="Admin navigation"
      >
        <div className="mp-admin-sidebar-inner">
        <div className="mp-admin-sidebar-header">
          <div className="mp-admin-logo">
            <div className="mp-admin-logo-mark" aria-hidden="true">
              <BarChart3 size={18} />
            </div>
            <div className="mp-admin-logo-text">
              <div className="mp-admin-logo-title">Markets</div>
              <div className="mp-admin-logo-sub">Admin Console</div>
            </div>
          </div>

          <button
            type="button"
            className="mp-admin-mobile-close"
            onClick={onMobileToggle}
            aria-label="Close menu"
          >
            <Menu size={18} />
          </button>
        </div>

        <nav className="mp-admin-nav">
          {groups.map((group) => (
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
                  const active = isActiveHref(item.href, location.pathname, activeTab);
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
            <span>System nominal</span>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}

