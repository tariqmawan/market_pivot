import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Bitcoin,
  BriefcaseBusiness,
  CalendarDays,
  Coins,
  Factory,
  Globe2,
  Landmark,
  LineChart,
  Newspaper,
  Search,
  TrendingUp,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import "./Navigation.css";
import { useI18n } from "../i18n";

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  description?: string;
  submenu?: NavigationItem[];
}

type NavigationProps = {
  collapsed?: boolean;
  mobileOpen?: boolean;
  selectedCategoryPath?: string;
  onNavigate?: () => void;
  onParentActivate?: () => void;
};

const iconSize = 16;

const navigationItems: NavigationItem[] = [
  {
    label: "dashboard",
    path: "/dashboard",
    icon: <BarChart3 size={iconSize} />,
    description: "Global overview, market sentiment, news, and watchlist preview",
  },
  {
    label: "markets",
    path: "/markets",
    icon: <Globe2 size={iconSize} />,
    description: "Live market summary, heatmaps, movers, and volatility",
    submenu: [
      { label: "overview", path: "/markets/global-overview", icon: <Globe2 size={iconSize} /> },
      { label: "preMarket", path: "/markets/pre-market", icon: <TrendingUp size={iconSize} /> },
      { label: "afterHours", path: "/markets/after-hours", icon: <LineChart size={iconSize} /> },
      { label: "heatmaps", path: "/markets/heatmaps", icon: <BarChart3 size={iconSize} /> },
      { label: "marketMovers", path: "/markets/movers", icon: <TrendingUp size={iconSize} /> },
      { label: "volatilityIndex", path: "/markets/volatility-index", icon: <LineChart size={iconSize} /> },
    ],
  },
  {
    label: "assetCoverage",
    path: "/coverage",
    icon: <BarChart3 size={iconSize} />,
    description: "Indices, ETFs, and Bonds/Yields coverage",
    submenu: [
      { label: "indices", path: "/indices", icon: <BarChart3 size={iconSize} /> },
      { label: "etfsFunds", path: "/etfs", icon: <BriefcaseBusiness size={iconSize} /> },
      { label: "bondsAndYields", path: "/bonds-yields", icon: <CalendarDays size={iconSize} /> },
    ],
  },
  {
    label: "exchanges",
    path: "/exchanges",
    icon: <Landmark size={iconSize} />,
    description: "Exchange status, trading hours, listed companies, and statistics",
    submenu: [
      { label: "nyse", path: "/stocks/NYSE", icon: <Landmark size={iconSize} /> },
      { label: "nasdaq", path: "/stocks/NASDAQ", icon: <Landmark size={iconSize} /> },
      { label: "lse", path: "/stocks/LSE", icon: <Landmark size={iconSize} /> },
      { label: "byRegion", path: "/exchanges/region/americas", icon: <Globe2 size={iconSize} /> },
    ],
  },
  {
    label: "stocks",
    path: "/stocks",
    icon: <TrendingUp size={iconSize} />,
    description: "Stock detail pages, screeners, portfolios, alerts, and analytics",
    submenu: [
      { label: "advancedScreener", path: "/screener", icon: <Search size={iconSize} /> },
      { label: "topGainers", path: "/stocks/gainers", icon: <TrendingUp size={iconSize} /> },
      { label: "topLosers", path: "/stocks/losers", icon: <LineChart size={iconSize} /> },
      { label: "watchlists", path: "/stocks/watchlists", icon: <UserCircle size={iconSize} /> },
      { label: "portfolioTracker", path: "/stocks/portfolio", icon: <BriefcaseBusiness size={iconSize} /> },
      { label: "alerts", path: "/stocks/alerts", icon: <CalendarDays size={iconSize} /> },
    ],
  },
  {
    label: "fx",
    path: "/forex",
    icon: <Coins size={iconSize} />,
    description: "Currency strength, central bank data, rates, and live FX charts",
    submenu: [
      { label: "usd", path: "/currencies/USD", icon: <Coins size={iconSize} /> },
      { label: "eur", path: "/currencies/EUR", icon: <Coins size={iconSize} /> },
      { label: "gbp", path: "/currencies/GBP", icon: <Coins size={iconSize} /> },
      { label: "jpy", path: "/currencies/JPY", icon: <Coins size={iconSize} /> },
      { label: "inr", path: "/currencies/INR", icon: <Coins size={iconSize} /> },
    ],
  },
  {
    label: "crypto",
    path: "/crypto",
    icon: <Bitcoin size={iconSize} />,
    description: "Coins, chains, tokenomics, rankings, and on-chain metrics",
    submenu: [
      { label: "trendingCoins", path: "/crypto/trending", icon: <TrendingUp size={iconSize} /> },
      { label: "memeCoins", path: "/crypto/meme-coins", icon: <Bitcoin size={iconSize} /> },
      { label: "defi", path: "/crypto/defi", icon: <Coins size={iconSize} /> },
      { label: "layer1", path: "/crypto/layer-1", icon: <Globe2 size={iconSize} /> },
      { label: "stablecoins", path: "/crypto/stablecoins", icon: <Coins size={iconSize} /> },
    ],
  },
  {
    label: "commodities",
    path: "/commodities",
    icon: <Factory size={iconSize} />,
    description: "Spot prices, futures, supply-demand analysis, and heatmaps",
    submenu: [
      { label: "energy", path: "/commodities/energy", icon: <Factory size={iconSize} /> },
      { label: "metals", path: "/commodities/metals", icon: <Coins size={iconSize} /> },
      { label: "agriculture", path: "/commodities/agriculture", icon: <Globe2 size={iconSize} /> },
      { label: "industrial", path: "/commodities/industrial", icon: <Factory size={iconSize} /> },
    ],
  },
  {
    label: "regions",
    path: "/regions",
    icon: <Globe2 size={iconSize} />,
    description: "Regional indices, macro data, currencies, and economic outlook",
    submenu: [
      { label: "americas", path: "/regions/americas", icon: <Globe2 size={iconSize} /> },
      { label: "europe", path: "/regions/europe", icon: <Globe2 size={iconSize} /> },
      { label: "asiaPacific", path: "/regions/asia-pacific", icon: <Globe2 size={iconSize} /> },
      { label: "middleEastAfrica", path: "/regions/middle-east-africa", icon: <Globe2 size={iconSize} /> },
    ],
  },
  {
    label: "sectors",
    path: "/sectors",
    icon: <BriefcaseBusiness size={iconSize} />,
    description: "Sector performance, ETFs, PE ratios, and comparison views",
    submenu: [
      { label: "technology", path: "/sectors/technology", icon: <BriefcaseBusiness size={iconSize} /> },
      { label: "banking", path: "/sectors/banking", icon: <Landmark size={iconSize} /> },
      { label: "ai", path: "/sectors/ai", icon: <BarChart3 size={iconSize} /> },
      { label: "ev", path: "/sectors/electric-vehicles", icon: <TrendingUp size={iconSize} /> },
      { label: "semiconductor", path: "/sectors/semiconductor", icon: <Factory size={iconSize} /> },
      { label: "defence", path: "/sectors/defence", icon: <BriefcaseBusiness size={iconSize} /> },
    ],
  },
  {
    label: "news",
    path: "/news",
    icon: <Newspaper size={iconSize} />,
    description: "Global, regional, sector, exchange, and crypto market news",
    submenu: [
      { label: "globalNews", path: "/news", icon: <Newspaper size={iconSize} /> },
      { label: "regionNews", path: "/news/regions", icon: <Globe2 size={iconSize} /> },
      { label: "sectorNews", path: "/news/sectors", icon: <BriefcaseBusiness size={iconSize} /> },
      { label: "cryptoNews", path: "/news/crypto", icon: <Bitcoin size={iconSize} /> },
      { label: "marketAlerts", path: "/news/alerts", icon: <CalendarDays size={iconSize} /> },
    ],
  },
  {
    label: "calendar",
    path: "/economic-calendar",
    icon: <CalendarDays size={iconSize} />,
    description: "Central banks, CPI, GDP, employment, and FOMC events",
  },
  {
    label: "userPanel",
    path: "/user",
    icon: <UserCircle size={iconSize} />,
    description: "Watchlists, portfolio, alerts, billing, profile, and API access",
  },
];

const Navigation: React.FC<NavigationProps> = ({
  collapsed = false,
  mobileOpen = false,
  selectedCategoryPath,
  onNavigate,
  onParentActivate,
}) => {
  const location = useLocation();
  const { t: _t } = useI18n();
  const t = _t as (key: string) => string | undefined;
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navigationItems.forEach((item) => {
      if (item.submenu) {
        const hasActiveChild = item.submenu.some((sub) => location.pathname.startsWith(sub.path));
        if (hasActiveChild || location.pathname === item.path) {
          initial[item.path] = true;
        }
      }
    });
    return initial;
  });

  React.useEffect(() => {
    const nextState: Record<string, boolean> = {};

    navigationItems.forEach((item) => {
      if (item.submenu) {
        const isActiveParent =
          location.pathname === item.path ||
          item.submenu.some((sub) => location.pathname.startsWith(sub.path));

        if (isActiveParent) {
          nextState[item.path] = true;
        }
      }
    });

    setExpandedMenus(nextState);
  }, [location.pathname]);

  React.useEffect(() => {
    if (!selectedCategoryPath) return;

    const selectedItem = navigationItems.find((item) => item.path === selectedCategoryPath);
    if (!selectedItem?.submenu) {
      setExpandedMenus({});
      return;
    }

    setExpandedMenus({ [selectedCategoryPath]: true });
  }, [selectedCategoryPath]);

  const openMenu = (path: string) => {
    setExpandedMenus({ [path]: true });
    onParentActivate?.();
  };

  const toggleMenu = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedMenus((prev) => {
      const isCurrentlyOpen = !!prev[path];
      return isCurrentlyOpen ? {} : { [path]: true };
    });
    onParentActivate?.();
  };

  const pathKeyMap: Record<string, string> = {
    "/dashboard": "dashboard",
    "/markets": "markets",
    "/coverage": "assetCoverage",
    "/exchanges": "exchanges",
    "/stocks": "stocks",
    "/forex": "fx",
    "/crypto": "crypto",
    "/commodities": "commodities",
    "/regions": "regions",
    "/sectors": "sectors",
    "/news": "news",
    "/economic-calendar": "calendar",
    "/user": "userPanel",
    "/markets/global-overview": "overview",
    "/markets/pre-market": "preMarket",
    "/markets/after-hours": "afterHours",
    "/markets/heatmaps": "heatmaps",
    "/markets/movers": "marketMovers",
    "/markets/volatility-index": "volatilityIndex",
    "/screener": "advancedScreener",
    "/etfs": "etfsFunds",
    "/bonds-yields": "bondsAndYields",
    "/stocks/NYSE": "nyse",
    "/stocks/NASDAQ": "nasdaq",
    "/stocks/LSE": "lse",
    "/exchanges/region/americas": "byRegion",
    "/stocks/gainers": "topGainers",
    "/stocks/losers": "topLosers",
    "/stocks/watchlists": "watchlists",
    "/stocks/portfolio": "portfolioTracker",
    "/stocks/alerts": "alerts",
    "/currencies/USD": "usd",
    "/currencies/EUR": "eur",
    "/currencies/GBP": "gbp",
    "/currencies/JPY": "jpy",
    "/currencies/INR": "inr",
    "/crypto/trending": "trendingCoins",
    "/crypto/meme-coins": "memeCoins",
    "/crypto/defi": "defi",
    "/crypto/layer-1": "layer1",
    "/crypto/stablecoins": "stablecoins",
    "/commodities/energy": "energy",
    "/commodities/metals": "metals",
    "/commodities/agriculture": "agriculture",
    "/commodities/industrial": "industrial",
    "/regions/americas": "americas",
    "/regions/europe": "europe",
    "/regions/asia-pacific": "asiaPacific",
    "/regions/middle-east-africa": "middleEastAfrica",
    "/sectors/technology": "technology",
    "/sectors/banking": "banking",
    "/sectors/ai": "ai",
    "/sectors/electric-vehicles": "ev",
    "/sectors/semiconductor": "semiconductor",
    "/sectors/defence": "defence",
    "/news/regions": "regionNews",
    "/news/sectors": "sectorNews",
    "/news/crypto": "cryptoNews",
    "/news/alerts": "marketAlerts",
  };

  const translateLabel = (path: string | undefined, fallback: string) => {
    if (!path) return fallback;
    const key = pathKeyMap[path] ?? fallback;
    return t(key as any) || fallback;
  };

  return (
    <nav
      className={`enhanced-navigation ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      aria-label="Main navigation"
    >
      <div className="nav-items">
        {navigationItems.map((item) => {
          const hasSubmenu = !!item.submenu;
          const isExpanded = !!expandedMenus[item.path];
          const isParentActive = location.pathname === item.path || (item.submenu?.some((sub) => location.pathname === sub.path) ?? false);

          return (
            <div key={item.path} className={`nav-item-group ${isExpanded ? "expanded" : ""}`}>
              <div className={`nav-parent-row ${isParentActive ? "active" : ""}`}>
                {hasSubmenu ? (
                  <button
                    type="button"
                    className="nav-item nav-category-button"
                    data-tooltip={translateLabel(item.path, item.label)}
                    title={collapsed ? translateLabel(item.path, item.label) : undefined}
                    onClick={() => openMenu(item.path)}
                    aria-expanded={isExpanded}
                    aria-controls={`nav-submenu-${item.path.replace(/[^a-z0-9]/gi, "-")}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{translateLabel(item.path, item.label)}</span>
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className="nav-item"
                    data-tooltip={translateLabel(item.path, item.label)}
                    title={collapsed ? translateLabel(item.path, item.label) : undefined}
                    onClick={onNavigate}
                    aria-current={isParentActive ? "page" : undefined}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{translateLabel(item.path, item.label)}</span>
                  </Link>
                )}
                {hasSubmenu && (
                  <button
                    type="button"
                    className="submenu-toggle-btn"
                    onClick={(e) => toggleMenu(item.path, e)}
                    aria-label={t(`${item.label}`) ? `Toggle ${t(`${item.label}`)} submenu` : `Toggle ${item.label} submenu`}
                    aria-expanded={isExpanded}
                    aria-controls={`nav-submenu-${item.path.replace(/[^a-z0-9]/gi, "-")}`}
                  >
                    <ChevronDown size={14} className={`chevron-icon ${isExpanded ? "rotated" : ""}`} />
                  </button>
                )}
              </div>

              {hasSubmenu && (
                <div
                  id={`nav-submenu-${item.path.replace(/[^a-z0-9]/gi, "-")}`}
                  className={`nav-submenu-accordion ${isExpanded ? "open" : ""}`}
                  aria-hidden={collapsed || !isExpanded}
                >
                  {item.submenu!.map((subitem) => {
                    const isSubitemActive = location.pathname === subitem.path;
                    return (
                      <Link
                        key={subitem.path}
                        to={subitem.path}
                        className={`submenu-item ${isSubitemActive ? "active" : ""}`}
                        onClick={onNavigate}
                        aria-current={isSubitemActive ? "page" : undefined}
                      >
                        <span className="submenu-icon">{subitem.icon}</span>
                        <span className="submenu-label">{translateLabel(subitem.path, subitem.label)}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
