import React, { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import "./Navigation.css";

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  description?: string;
  submenu?: NavigationItem[];
}

const iconSize = 16;

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <BarChart3 size={iconSize} />,
    description: "Global overview, market sentiment, news, and watchlist preview",
  },
  {
    label: "Markets",
    path: "/markets",
    icon: <Globe2 size={iconSize} />,
    description: "Live market summary, heatmaps, movers, and volatility",
    submenu: [
      { label: "Global Overview", path: "/markets/global-overview", icon: <Globe2 size={iconSize} /> },
      { label: "Pre-market", path: "/markets/pre-market", icon: <TrendingUp size={iconSize} /> },
      { label: "After-hours", path: "/markets/after-hours", icon: <LineChart size={iconSize} /> },
      { label: "Heatmaps", path: "/markets/heatmaps", icon: <BarChart3 size={iconSize} /> },
      { label: "Market Movers", path: "/markets/movers", icon: <TrendingUp size={iconSize} /> },
      { label: "Volatility Index", path: "/markets/volatility-index", icon: <LineChart size={iconSize} /> },
    ],
  },
  {
    label: "Market Coverage",
    path: "/coverage",
    icon: <BarChart3 size={iconSize} />,
    description: "Indices, ETFs, and Bonds/Yields coverage",
    submenu: [
      { label: "Indices", path: "/indices", icon: <BarChart3 size={iconSize} /> },
      { label: "ETFs & Funds", path: "/etfs", icon: <BriefcaseBusiness size={iconSize} /> },
      { label: "Bonds & Yields", path: "/bonds-yields", icon: <CalendarDays size={iconSize} /> },
    ],
  },
  {
    label: "Exchanges",
    path: "/exchanges",
    icon: <Landmark size={iconSize} />,
    description: "Exchange status, trading hours, listed companies, and statistics",
    submenu: [
      { label: "NYSE", path: "/stocks/NYSE", icon: <Landmark size={iconSize} /> },
      { label: "NASDAQ", path: "/stocks/NASDAQ", icon: <Landmark size={iconSize} /> },
      { label: "London Stock Exchange", path: "/stocks/LSE", icon: <Landmark size={iconSize} /> },
      { label: "By Region", path: "/exchanges/region/americas", icon: <Globe2 size={iconSize} /> },
    ],
  },
  {
    label: "Stocks",
    path: "/stocks",
    icon: <TrendingUp size={iconSize} />,
    description: "Stock detail pages, screeners, portfolios, alerts, and analytics",
    submenu: [
      { label: "Advanced Screener", path: "/screener", icon: <Search size={iconSize} /> },
      { label: "Top Gainers", path: "/stocks/gainers", icon: <TrendingUp size={iconSize} /> },
      { label: "Top Losers", path: "/stocks/losers", icon: <LineChart size={iconSize} /> },
      { label: "Watchlists", path: "/user", icon: <UserCircle size={iconSize} /> },
      { label: "Portfolio Tracker", path: "/user", icon: <BriefcaseBusiness size={iconSize} /> },
      { label: "Alerts", path: "/user", icon: <CalendarDays size={iconSize} /> },
    ],
  },
  {
    label: "Forex",
    path: "/forex",
    icon: <Coins size={iconSize} />,
    description: "Currency strength, central bank data, rates, and live FX charts",
    submenu: [
      { label: "USD", path: "/currencies/USD", icon: <Coins size={iconSize} /> },
      { label: "EUR", path: "/currencies/EUR", icon: <Coins size={iconSize} /> },
      { label: "GBP", path: "/currencies/GBP", icon: <Coins size={iconSize} /> },
      { label: "JPY", path: "/currencies/JPY", icon: <Coins size={iconSize} /> },
      { label: "INR", path: "/currencies/INR", icon: <Coins size={iconSize} /> },
      { label: "Economic Indicators", path: "/economic-calendar", icon: <CalendarDays size={iconSize} /> },
    ],
  },
  {
    label: "Crypto",
    path: "/crypto",
    icon: <Bitcoin size={iconSize} />,
    description: "Coins, chains, tokenomics, rankings, and on-chain metrics",
    submenu: [
      { label: "Trending Coins", path: "/crypto/trending", icon: <TrendingUp size={iconSize} /> },
      { label: "Meme Coins", path: "/crypto/meme-coins", icon: <Bitcoin size={iconSize} /> },
      { label: "DeFi", path: "/crypto/defi", icon: <Coins size={iconSize} /> },
      { label: "Layer 1", path: "/crypto/layer-1", icon: <Globe2 size={iconSize} /> },
      { label: "Stablecoins", path: "/crypto/stablecoins", icon: <Coins size={iconSize} /> },
    ],
  },
  {
    label: "Commodities",
    path: "/commodities",
    icon: <Factory size={iconSize} />,
    description: "Spot prices, futures, supply-demand analysis, and heatmaps",
    submenu: [
      { label: "Energy", path: "/commodities/energy", icon: <Factory size={iconSize} /> },
      { label: "Metals", path: "/commodities/metals", icon: <Coins size={iconSize} /> },
      { label: "Agriculture", path: "/commodities/agriculture", icon: <Globe2 size={iconSize} /> },
      { label: "Industrial", path: "/commodities/industrial", icon: <Factory size={iconSize} /> },
    ],
  },
  {
    label: "Regions",
    path: "/regions",
    icon: <Globe2 size={iconSize} />,
    description: "Regional indices, macro data, currencies, and economic outlook",
    submenu: [
      { label: "Americas", path: "/regions/americas", icon: <Globe2 size={iconSize} /> },
      { label: "Europe", path: "/regions/europe", icon: <Globe2 size={iconSize} /> },
      { label: "Asia-Pacific", path: "/regions/asia-pacific", icon: <Globe2 size={iconSize} /> },
      { label: "Middle East & Africa", path: "/regions/middle-east-africa", icon: <Globe2 size={iconSize} /> },
    ],
  },
  {
    label: "Sectors",
    path: "/sectors",
    icon: <BriefcaseBusiness size={iconSize} />,
    description: "Sector performance, ETFs, PE ratios, and comparison views",
    submenu: [
      { label: "Technology", path: "/sectors/technology", icon: <BriefcaseBusiness size={iconSize} /> },
      { label: "Banking", path: "/sectors/banking", icon: <Landmark size={iconSize} /> },
      { label: "AI", path: "/sectors/ai", icon: <BarChart3 size={iconSize} /> },
      { label: "EV", path: "/sectors/electric-vehicles", icon: <TrendingUp size={iconSize} /> },
      { label: "Semiconductor", path: "/sectors/semiconductor", icon: <Factory size={iconSize} /> },
      { label: "Defence", path: "/sectors/defence", icon: <BriefcaseBusiness size={iconSize} /> },
    ],
  },
  {
    label: "News",
    path: "/news",
    icon: <Newspaper size={iconSize} />,
    description: "Global, regional, sector, exchange, and crypto market news",
    submenu: [
      { label: "Global News", path: "/news", icon: <Newspaper size={iconSize} /> },
      { label: "Region-wise News", path: "/news/regions", icon: <Globe2 size={iconSize} /> },
      { label: "Sector-wise News", path: "/news/sectors", icon: <BriefcaseBusiness size={iconSize} /> },
      { label: "Crypto News", path: "/news/crypto", icon: <Bitcoin size={iconSize} /> },
      { label: "Market Alerts", path: "/news/alerts", icon: <CalendarDays size={iconSize} /> },
    ],
  },
  {
    label: "Calendar",
    path: "/economic-calendar",
    icon: <CalendarDays size={iconSize} />,
    description: "Central banks, CPI, GDP, employment, and FOMC events",
  },
  {
    label: "Account",
    path: "/user",
    icon: <UserCircle size={iconSize} />,
    description: "Watchlists, portfolio, alerts, billing, profile, and API access",
  },
];

const Navigation: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(e.target as Node)) return;
      setOpenMenu(null);
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <nav className="enhanced-navigation" ref={rootRef}>
      <div className="nav-items">
        {navigationItems.map((item) => (
          <div
            key={item.path}
            className={`nav-item-wrapper ${openMenu === item.path ? "open" : ""}`}
            onMouseEnter={() => setOpenMenu(item.path)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link to={item.path} className="nav-item">
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>

            {item.submenu && openMenu === item.path && (
              <div className="nav-submenu" role="menu">
                <div className="submenu-header">
                  <h3>{item.label}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="submenu-grid">
                  {item.submenu.map((subitem) => (
                    <Link key={subitem.path} to={subitem.path} className="submenu-item">
                      <span className="submenu-icon">{subitem.icon}</span>
                      <span className="submenu-label">{subitem.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
