import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Bitcoin,
  BriefcaseBusiness,
  CalendarDays,
  Coins,
  Gauge,
  Factory,
  Globe2,
  Landmark,
  LineChart,
  Search,
  TrendingUp,
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
    label: "Global Markets",
    path: "/markets",
    icon: <Globe2 size={iconSize} />,
    description: "World heatmaps, capital flows, clocks, calendars, risk, breadth, and AI daily briefings",
    submenu: [
      { label: "Global Dashboard", path: "/dashboard", icon: <Gauge size={iconSize} /> },
      { label: "World Heatmap", path: "/markets/heatmaps", icon: <BarChart3 size={iconSize} /> },
      { label: "Open/Close Clocks", path: "/markets/global-overview", icon: <CalendarDays size={iconSize} /> },
      { label: "Market Movers", path: "/markets/movers", icon: <TrendingUp size={iconSize} /> },
      { label: "Volatility Tracker", path: "/markets/volatility-index", icon: <LineChart size={iconSize} /> },
      { label: "Economic Calendar", path: "/economic-calendar", icon: <CalendarDays size={iconSize} /> },
    ],
  },
  {
    label: "Stocks & Equities",
    path: "/stocks",
    icon: <TrendingUp size={iconSize} />,
    description: "Top 30 exchanges, stock dashboards, movers, screeners, fundamentals, and institutional analytics",
    submenu: [
      { label: "All Exchanges", path: "/stocks", icon: <Landmark size={iconSize} /> },
      { label: "NYSE", path: "/stocks/NYSE", icon: <Landmark size={iconSize} /> },
      { label: "NASDAQ", path: "/stocks/NASDAQ", icon: <Landmark size={iconSize} /> },
      { label: "London Stock Exchange", path: "/stocks/LSE", icon: <Landmark size={iconSize} /> },
      { label: "Advanced Screener", path: "/screener", icon: <Search size={iconSize} /> },
      { label: "Top Gainers", path: "/stocks/gainers", icon: <TrendingUp size={iconSize} /> },
    ],
  },
  {
    label: "Forex & Currencies",
    path: "/forex",
    icon: <Coins size={iconSize} />,
    description: "Top 20 currencies, converters, strength meters, central banks, rates, and macro impact",
    submenu: [
      { label: "All Currencies", path: "/currencies", icon: <Coins size={iconSize} /> },
      { label: "USD", path: "/currencies/USD", icon: <Coins size={iconSize} /> },
      { label: "EUR", path: "/currencies/EUR", icon: <Coins size={iconSize} /> },
      { label: "JPY", path: "/currencies/JPY", icon: <Coins size={iconSize} /> },
      { label: "INR", path: "/currencies/INR", icon: <Coins size={iconSize} /> },
      { label: "Currency Strength", path: "/forex/strength", icon: <BarChart3 size={iconSize} /> },
    ],
  },
  {
    label: "Commodities",
    path: "/commodities",
    icon: <Factory size={iconSize} />,
    description: "Energy, metals, agriculture, futures, supply-demand, inventory, and inflation impact",
    submenu: [
      { label: "All Commodities", path: "/commodities", icon: <Factory size={iconSize} /> },
      { label: "Energy", path: "/commodities/energy", icon: <Factory size={iconSize} /> },
      { label: "Metals", path: "/commodities/metals", icon: <Coins size={iconSize} /> },
      { label: "Agriculture", path: "/commodities/agriculture", icon: <Globe2 size={iconSize} /> },
      { label: "Industrial", path: "/commodities/industrial", icon: <Factory size={iconSize} /> },
    ],
  },
  {
    label: "Cryptocurrency",
    path: "/crypto",
    icon: <Bitcoin size={iconSize} />,
    description: "Top 20 crypto assets, on-chain intelligence, exchanges, pairs, liquidation and funding analytics",
    submenu: [
      { label: "All Coins", path: "/crypto", icon: <Bitcoin size={iconSize} /> },
      { label: "Trending Coins", path: "/crypto/trending", icon: <TrendingUp size={iconSize} /> },
      { label: "DeFi", path: "/crypto/defi", icon: <Coins size={iconSize} /> },
      { label: "Layer 1", path: "/crypto/layer-1", icon: <Globe2 size={iconSize} /> },
      { label: "Stablecoins", path: "/crypto/stablecoins", icon: <Coins size={iconSize} /> },
    ],
  },
  {
    label: "Economy & Policy",
    path: "/economy-policy",
    icon: <CalendarDays size={iconSize} />,
    description: "GDP, inflation, jobs, central banks, fiscal policy, debt, yield curve, and AI macro forecasting",
    submenu: [
      { label: "Macro Dashboard", path: "/economy-policy", icon: <Gauge size={iconSize} /> },
      { label: "Economic Calendar", path: "/economic-calendar", icon: <CalendarDays size={iconSize} /> },
      { label: "Central Banks", path: "/economy-policy/central-banks", icon: <Landmark size={iconSize} /> },
      { label: "Inflation Tracker", path: "/economy-policy/inflation", icon: <LineChart size={iconSize} /> },
      { label: "Recession Risk", path: "/economy-policy/recession-risk", icon: <BarChart3 size={iconSize} /> },
    ],
  },
  {
    label: "ETFs & Funds",
    path: "/etfs",
    icon: <BriefcaseBusiness size={iconSize} />,
    description: "ETF screeners, holdings, flows, expense ratios, overlap, smart beta, and portfolio balancing",
  },
  {
    label: "Bonds & Yields",
    path: "/bonds-yields",
    icon: <Landmark size={iconSize} />,
    description: "Government bonds, corporate credit, yield curves, auctions, duration, spreads, and rate forecasts",
  },
  {
    label: "Indices & Futures",
    path: "/indices",
    icon: <BarChart3 size={iconSize} />,
    description: "Global indices, equity futures, commodity futures, market breadth, positioning, and premarket indicators",
    submenu: [
      { label: "Global Indices", path: "/indices", icon: <BarChart3 size={iconSize} /> },
      { label: "Futures Markets", path: "/markets/pre-market", icon: <LineChart size={iconSize} /> },
      { label: "Premarket Indicators", path: "/markets/pre-market", icon: <TrendingUp size={iconSize} /> },
      { label: "Commitment of Traders", path: "/indices/cot", icon: <BriefcaseBusiness size={iconSize} /> },
    ],
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
