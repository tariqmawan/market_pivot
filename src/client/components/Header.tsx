import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Bitcoin,
  BriefcaseBusiness,
  CalendarDays,
  Coins,
  Crown,
  Factory,
  Globe2,
  Landmark,
  Newspaper,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import "./Header.css";
import { useI18n, SUPPORTED_LANGUAGES, type SupportedLang as LanguageCode } from "../i18n";
import { useAuthStore } from "../stores/authStore";
import navigationItems from "./navigationData";


type SubmenuPanelLink = {
  label: string;
  path: string;
};

type SubmenuPanelGroup = {
  title: string;
  links: SubmenuPanelLink[];
};

type SubmenuPanelData = {
  icon: React.ReactNode;
  title: string;
  eyebrow: string;
  groups: SubmenuPanelGroup[];
  featured: SubmenuPanelLink[];
  recent: SubmenuPanelLink[];
};

const panelIconSize = 18;
const headerNavigationItems = navigationItems.filter(
  (item) => item.path !== "/dashboard" && item.path !== "/user" && !(item as any).adminOnly
);

const getLanguageDisplayName = (lang: (typeof SUPPORTED_LANGUAGES)[number]) =>
  lang.nativeLabel === lang.label ? lang.nativeLabel : `${lang.nativeLabel} / ${lang.label}`;

const submenuPanels: Record<string, SubmenuPanelData> = {
  "/markets": {
    icon: <Globe2 size={panelIconSize} />,
    title: "Markets",
    eyebrow: "Global Market Desk",
    groups: [
      {
        title: "Market pulse",
        links: [
          { label: "Global Overview", path: "/markets/global-overview" },
          { label: "Pre-Market Movers", path: "/markets/pre-market" },
          { label: "After Hours", path: "/markets/after-hours" },
          { label: "Market Movers", path: "/markets/movers" },
        ],
      },
      {
        title: "Asset classes",
        links: [
          { label: "Equities", path: "/stocks" },
          { label: "ETFs", path: "/etfs" },
          { label: "Bonds", path: "/bonds-yields" },
          { label: "Commodities", path: "/commodities" },
        ],
      },
      {
        title: "Tools",
        links: [
          { label: "Heatmaps", path: "/markets/heatmaps" },
          { label: "Volatility Index", path: "/markets/volatility-index" },
          { label: "Advanced Screener", path: "/screener" },
          { label: "Economic Calendar", path: "/economic-calendar" },
        ],
      },
    ],
    featured: [
      { label: "Equities", path: "/stocks" },
      { label: "Futures", path: "/markets/movers" },
      { label: "ETFs", path: "/etfs" },
      { label: "Bonds", path: "/bonds-yields" },
    ],
    recent: [
      { label: "Pre-Market Movers", path: "/markets/pre-market" },
      { label: "Heatmaps", path: "/markets/heatmaps" },
    ],
  },
  "/coverage": {
    icon: <BarChart3 size={panelIconSize} />,
    title: "Coverage",
    eyebrow: "Asset Coverage",
    groups: [
      {
        title: "Research universe",
        links: [
          { label: "Market Indices", path: "/indices" },
          { label: "ETFs & Funds", path: "/etfs" },
          { label: "Bonds & Yields", path: "/bonds-yields" },
          { label: "Currencies", path: "/forex" },
        ],
      },
      {
        title: "Institutional views",
        links: [
          { label: "Regions", path: "/regions" },
          { label: "Sectors", path: "/sectors" },
          { label: "Exchanges", path: "/exchanges" },
          { label: "Calendar", path: "/economic-calendar" },
        ],
      },
    ],
    featured: [
      { label: "Indices", path: "/indices" },
      { label: "Sector ETFs", path: "/etfs" },
      { label: "Yield Curves", path: "/bonds-yields" },
    ],
    recent: [
      { label: "ETF Coverage", path: "/etfs" },
      { label: "Yield Curve Snapshots", path: "/bonds-yields" },
    ],
  },
  "/exchanges": {
    icon: <Landmark size={panelIconSize} />,
    title: "Exchanges",
    eyebrow: "Exchange Network",
    groups: [
      {
        title: "Major venues",
        links: [
          { label: "NYSE", path: "/stocks/NYSE" },
          { label: "NASDAQ", path: "/stocks/NASDAQ" },
          { label: "London Stock Exchange", path: "/stocks/LSE" },
          { label: "Tokyo Stock Exchange", path: "/stocks/TSE" },
        ],
      },
      {
        title: "Explore by region",
        links: [
          { label: "All Exchanges", path: "/exchanges" },
          { label: "Americas", path: "/exchanges/region/americas" },
          { label: "Europe", path: "/exchanges/region/europe" },
          { label: "Asia Pacific", path: "/exchanges/region/asia-pacific" },
        ],
      },
    ],
    featured: [
      { label: "NYSE", path: "/stocks/NYSE" },
      { label: "NASDAQ", path: "/stocks/NASDAQ" },
      { label: "London Stock Exchange", path: "/stocks/LSE" },
    ],
    recent: [
      { label: "Americas", path: "/exchanges/region/americas" },
      { label: "Asia Pacific", path: "/exchanges/region/asia-pacific" },
    ],
  },
  "/stocks": {
    icon: <TrendingUp size={panelIconSize} />,
    title: "Stock Exchanges",
    eyebrow: "Equities Workspace",
    groups: [
      {
        title: "Screening",
        links: [
          { label: "Advanced Screener", path: "/screener" },
          { label: "Top Gainers", path: "/stocks/gainers" },
          { label: "Top Losers", path: "/stocks/losers" },
          { label: "Market Movers", path: "/markets/movers" },
        ],
      },
      {
        title: "Portfolio tools",
        links: [
          { label: "Watchlists", path: "/stocks/watchlists" },
          { label: "Portfolio Tracker", path: "/stocks/portfolio" },
          { label: "Alerts", path: "/stocks/alerts" },
          { label: "ETF Coverage", path: "/etfs" },
        ],
      },
    ],
    featured: [
      { label: "Advanced Screener", path: "/screener" },
      { label: "Top Gainers", path: "/stocks/gainers" },
      { label: "Watchlists", path: "/stocks/watchlists" },
    ],
    recent: [
      { label: "Top Gainers", path: "/stocks/gainers" },
      { label: "Advanced Screener", path: "/screener" },
    ],
  },
  "/forex": {
    icon: <Coins size={panelIconSize} />,
    title: "FX",
    eyebrow: "Currency Desk",
    groups: [
      {
        title: "Major pairs",
        links: [
          { label: "USD", path: "/currencies/USD" },
          { label: "EUR", path: "/currencies/EUR" },
          { label: "GBP", path: "/currencies/GBP" },
          { label: "JPY", path: "/currencies/JPY" },
        ],
      },
      {
        title: "Macro context",
        links: [
          { label: "INR", path: "/currencies/INR" },
          { label: "CNY", path: "/currencies/CNY" },
          { label: "CHF", path: "/currencies/CHF" },
          { label: "Economic Calendar", path: "/economic-calendar" },
        ],
      },
      {
        title: "Tools",
        links: [
          { label: "FX Heatmap", path: "/forex" },
          { label: "Central Banks", path: "/economic-calendar" },
          { label: "Inflation Events", path: "/economic-calendar" },
          { label: "Market Alerts", path: "/news/alerts" },
        ],
      },
    ],
    featured: [
      { label: "Major Pairs", path: "/currencies/USD" },
      { label: "Central Banks", path: "/economic-calendar" },
      { label: "FX Heatmap", path: "/forex" },
    ],
    recent: [
      { label: "USD", path: "/currencies/USD" },
      { label: "EUR", path: "/currencies/EUR" },
    ],
  },
  "/crypto": {
    icon: <Bitcoin size={panelIconSize} />,
    title: "Cryptocurrencies",
    eyebrow: "Digital Assets",
    groups: [
      {
        title: "Markets",
        links: [
          { label: "BTC", path: "/crypto/bitcoin" },
          { label: "ETH", path: "/crypto/ethereum" },
          { label: "SOL", path: "/crypto/solana" },
          { label: "XRP", path: "/crypto/xrp" },
        ],
      },
      {
        title: "Sectors",
        links: [
          { label: "Meme Coins", path: "/crypto/meme-coins" },
          { label: "DeFi", path: "/crypto/defi" },
          { label: "AI Tokens", path: "/crypto/ai-tokens" },
          { label: "Layer 1", path: "/crypto/layer-1" },
        ],
      },
      {
        title: "Infrastructure",
        links: [
          { label: "Stablecoins", path: "/crypto/stablecoins" },
          { label: "On-chain Metrics", path: "/crypto/trending" },
          { label: "Exchanges", path: "/crypto/exchanges" },
          { label: "Wallets", path: "/crypto/wallets" },
        ],
      },
      {
        title: "Tools",
        links: [
          { label: "Heatmaps", path: "/markets/heatmaps" },
          { label: "Market Movers", path: "/markets/movers" },
          { label: "Funding Rates", path: "/crypto/funding-rates" },
          { label: "Liquidations", path: "/crypto/liquidations" },
        ],
      },
    ],
    featured: [
      { label: "BTC", path: "/crypto/bitcoin" },
      { label: "ETH", path: "/crypto/ethereum" },
      { label: "Stablecoins", path: "/crypto/stablecoins" },
      { label: "On-chain Metrics", path: "/crypto/trending" },
    ],
    recent: [
      { label: "Trending Coins", path: "/crypto/trending" },
      { label: "Stablecoins", path: "/crypto/stablecoins" },
    ],
  },
  "/commodities": {
    icon: <Factory size={panelIconSize} />,
    title: "Commodities",
    eyebrow: "Physical Markets",
    groups: [
      {
        title: "Complexes",
        links: [
          { label: "Energy", path: "/commodities/energy" },
          { label: "Metals", path: "/commodities/metals" },
          { label: "Agriculture", path: "/commodities/agriculture" },
          { label: "Industrial", path: "/commodities/industrial" },
        ],
      },
      {
        title: "Benchmarks",
        links: [
          { label: "Oil & Gas", path: "/commodities/energy" },
          { label: "Gold", path: "/commodities/metals" },
          { label: "Copper", path: "/commodities/industrial" },
          { label: "Grains", path: "/commodities/agriculture" },
        ],
      },
      {
        title: "Tools",
        links: [
          { label: "Heatmaps", path: "/markets/heatmaps" },
          { label: "Market Movers", path: "/markets/movers" },
          { label: "Economic Calendar", path: "/economic-calendar" },
          { label: "Market Alerts", path: "/news/alerts" },
        ],
      },
    ],
    featured: [
      { label: "Oil & Gas", path: "/commodities/energy" },
      { label: "Gold & Metals", path: "/commodities/metals" },
      { label: "Agriculture", path: "/commodities/agriculture" },
    ],
    recent: [
      { label: "Energy", path: "/commodities/energy" },
      { label: "Metals", path: "/commodities/metals" },
    ],
  },
  "/regions": {
    icon: <Globe2 size={panelIconSize} />,
    title: "Regions",
    eyebrow: "Macro Regions",
    groups: [
      {
        title: "Regional desks",
        links: [
          { label: "Americas", path: "/regions/americas" },
          { label: "Europe", path: "/regions/europe" },
          { label: "Asia Pacific", path: "/regions/asia-pacific" },
          { label: "Middle East & Africa", path: "/regions/middle-east-africa" },
        ],
      },
      {
        title: "Regional context",
        links: [
          { label: "Exchange Network", path: "/exchanges" },
          { label: "Region-wise News", path: "/news/regions" },
          { label: "Economic Calendar", path: "/economic-calendar" },
          { label: "Market Indices", path: "/indices" },
        ],
      },
    ],
    featured: [
      { label: "Americas", path: "/regions/americas" },
      { label: "Europe", path: "/regions/europe" },
      { label: "Asia Pacific", path: "/regions/asia-pacific" },
    ],
    recent: [
      { label: "Americas", path: "/regions/americas" },
      { label: "Europe", path: "/regions/europe" },
    ],
  },
  "/sectors": {
    icon: <BriefcaseBusiness size={panelIconSize} />,
    title: "Sectors",
    eyebrow: "Industry Intelligence",
    groups: [
      {
        title: "Core sectors",
        links: [
          { label: "Technology", path: "/sectors/technology" },
          { label: "Banking", path: "/sectors/banking" },
          { label: "AI", path: "/sectors/ai" },
          { label: "Semiconductor", path: "/sectors/semiconductor" },
        ],
      },
      {
        title: "Themes",
        links: [
          { label: "Electric Vehicles", path: "/sectors/electric-vehicles" },
          { label: "Defence", path: "/sectors/defence" },
          { label: "Sector ETFs", path: "/etfs" },
          { label: "Sector-wise News", path: "/news/sectors" },
        ],
      },
    ],
    featured: [
      { label: "Technology", path: "/sectors/technology" },
      { label: "AI", path: "/sectors/ai" },
      { label: "Semiconductors", path: "/sectors/semiconductor" },
    ],
    recent: [
      { label: "Technology", path: "/sectors/technology" },
      { label: "Banking", path: "/sectors/banking" },
    ],
  },
  "/news": {
    icon: <Newspaper size={panelIconSize} />,
    title: "News",
    eyebrow: "Market Newsroom",
    groups: [
      {
        title: "News desks",
        links: [
          { label: "Global News", path: "/news" },
          { label: "Region-wise News", path: "/news/regions" },
          { label: "Sector-wise News", path: "/news/sectors" },
          { label: "Crypto News", path: "/news/crypto" },
        ],
      },
      {
        title: "Alerts",
        links: [
          { label: "Market Alerts", path: "/news/alerts" },
          { label: "Pre-Market Movers", path: "/markets/pre-market" },
          { label: "After Hours", path: "/markets/after-hours" },
          { label: "Economic Calendar", path: "/economic-calendar" },
        ],
      },
    ],
    featured: [
      { label: "Global News", path: "/news" },
      { label: "Market Alerts", path: "/news/alerts" },
      { label: "Crypto News", path: "/news/crypto" },
    ],
    recent: [
      { label: "Global News", path: "/news" },
      { label: "Market Alerts", path: "/news/alerts" },
    ],
  },
  "/economic-calendar": {
    icon: <CalendarDays size={panelIconSize} />,
    title: "Calendar",
    eyebrow: "Macro Events",
    groups: [
      {
        title: "Event workflow",
        links: [
          { label: "Economic Calendar", path: "/economic-calendar" },
          { label: "Central Banks", path: "/economic-calendar" },
          { label: "Inflation Events", path: "/economic-calendar" },
          { label: "GDP / CPI", path: "/economic-calendar" },
        ],
      },
      {
        title: "Market context",
        links: [
          { label: "FX Desk", path: "/forex" },
          { label: "Bonds & Yields", path: "/bonds-yields" },
          { label: "Market Alerts", path: "/news/alerts" },
          { label: "Global Overview", path: "/markets/global-overview" },
        ],
      },
    ],
    featured: [
      { label: "Today", path: "/economic-calendar" },
      { label: "Central Banks", path: "/economic-calendar" },
      { label: "GDP / CPI", path: "/economic-calendar" },
    ],
    recent: [
      { label: "Economic Calendar", path: "/economic-calendar" },
      { label: "Central Banks", path: "/economic-calendar" },
    ],
  },
};



type HeaderProps = {
  selectedCategory?: string;
  onSelectCategory?: (path: string) => void;
  isSidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
};

const Header: React.FC<HeaderProps> = ({
   selectedCategory,
   onSelectCategory,
   isSidebarCollapsed = false,
   onSidebarToggle,
 }) => {
   const { t, language, setLanguage } = useI18n();
   const [currency, setCurrency] = React.useState(() => localStorage.getItem("mp_currency") ?? "JPY");
   const [theme, setTheme] = React.useState(() => localStorage.getItem("mp_theme") ?? "Light");
   const [isScrolled, setIsScrolled] = React.useState(false);
   const [isDragging, setIsDragging] = React.useState(false);
   const [dragStart, setDragStart] = React.useState(0);
   const [scrollStart, setScrollStart] = React.useState(0);
   const languageScrollRef = React.useRef<HTMLDivElement>(null);

const { openLoginModal, openSignupModal, isAuthenticated, user } = useAuthStore();

   const isAdmin = user?.isAdmin || user?.role === "admin" || user?.role === "super_admin";
   const showAdminLink = isAuthenticated && isAdmin;

   React.useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "Light");
    document.documentElement.classList.toggle("dark", theme === "Dark");
  }, [theme]);

  React.useEffect(() => {
    const syncScrolled = () => setIsScrolled(window.scrollY > 8);

    syncScrolled();
    window.addEventListener("scroll", syncScrolled, { passive: true });

    return () => window.removeEventListener("scroll", syncScrolled);
  }, []);

  // Mouse wheel horizontal scrolling for language strip
  React.useEffect(() => {
    const scrollContainer = languageScrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      // Only handle if scrolling vertically
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener("wheel", handleWheel);
  }, []);

  // Touch swipe horizontal scrolling for language strip
  React.useEffect(() => {
    const scrollContainer = languageScrollRef.current;
    if (!scrollContainer) return;

    const handleTouchStart = (e: TouchEvent) => {
      setIsDragging(true);
      setDragStart(e.touches[0].clientX);
      setScrollStart(scrollContainer.scrollLeft);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const delta = e.touches[0].clientX - dragStart;
      scrollContainer.scrollLeft = scrollStart - delta;
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    scrollContainer.addEventListener("touchstart", handleTouchStart, false);
    scrollContainer.addEventListener("touchmove", handleTouchMove, { passive: true });
    scrollContainer.addEventListener("touchend", handleTouchEnd, false);

    return () => {
      scrollContainer.removeEventListener("touchstart", handleTouchStart);
      scrollContainer.removeEventListener("touchmove", handleTouchMove);
      scrollContainer.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, dragStart, scrollStart]);

  const onSelectLanguage = (code: LanguageCode) => {
    setLanguage(code);
  };

  const onCurrencyChange = (value: string) => {
    setCurrency(value);
    localStorage.setItem("mp_currency", value);
  };

  const onThemeChange = (value: string) => {
    setTheme(value);
    localStorage.setItem("mp_theme", value);
  };

  const onHeaderNavClick = (path: string) => {
    onSelectCategory?.(path);
  };

  return (
    <div className={`top-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="language-strip">
        <div className="language-title">
          <span>{t("preferredLanguage")}</span>
          <span aria-hidden="true">-&gt;</span>
        </div>

        <div className="language-scroll" ref={languageScrollRef}>
          <div className="languages">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                className={`lang ${l.code === language ? "active" : ""}`}
                onClick={() => onSelectLanguage(l.code as LanguageCode)}
                type="button"
              >
                <span className="lang-name">{getLanguageDisplayName(l)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="main-header">
        <button
          type="button"
          className={`sidebar-menu-toggle ${isSidebarCollapsed ? "collapsed" : ""}`}
          onClick={onSidebarToggle}
          aria-label={isSidebarCollapsed ? t("openNavigationSidebar") : t("collapseNavigationSidebar")}
          aria-expanded={!isSidebarCollapsed}
        >
          <span className="hamburger-lines" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <div className="brand-left">
          <Link to="/" className="logo-link">
            <img src="/logos/marketpivot.jpeg" alt={t("header.h0")} className="logo-icon" />
          </Link>
        </div>

        <nav className="header-center-nav" role="navigation" aria-label={t("header.h1")}>
          <div className="header-center-inner">
            {headerNavigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`header-nav-link ${selectedCategory === item.path ? "active" : ""}`}
                onClick={() => onHeaderNavClick(item.path)}
                aria-haspopup={submenuPanels[item.path] ? "true" : undefined}
                aria-expanded={submenuPanels[item.path] ? selectedCategory === item.path : undefined}
              >
                {t(item.label as any) ?? item.label}
              </Link>
            ))}
          </div>
        </nav>

<div className="brand-right">
           <Link to="/pricing" className="btn-pricing">
             <Crown size={18} strokeWidth={2.25} aria-hidden />
             <span>{t("pricing").toUpperCase()}</span>
           </Link>

           {showAdminLink && (
             <Link to="/admin" className="btn admin-btn" style={{ background: "rgba(162, 120, 65, 0.15)", borderColor: "rgba(162, 120, 65, 0.4)" }}>
               {t("adminPanel") ?? "Admin"}
             </Link>
           )}

           <button type="button" className="btn" onClick={openLoginModal}>
             {t("login")}
           </button>

           <button type="button" className="btn primary" onClick={openSignupModal}>
             {t("signUp")}
           </button>
         </div>
       </div>

     </div>
   );
 };

export default Header;
