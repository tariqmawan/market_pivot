import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import "./Navigation.css";

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  description?: string;
  submenu?: NavigationItem[];
}

const Navigation: React.FC = () => {
  const { t } = useI18n();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const navigationItems: NavigationItem[] = [
    {
      label: "Markets",
      path: "/markets",
      icon: "📊",
      description: "Global market overview",
      submenu: [
        { label: "Exchanges", path: "/markets/exchanges", icon: "🏛️" },
        { label: "Stocks", path: "/markets/stocks", icon: "📈" },
        { label: "Indices", path: "/markets/indices", icon: "📉" }
      ]
    },
    {
      label: "Exchanges",
      path: "/exchanges",
      icon: "🏛️",
      description: "30+ global stock exchanges",
      submenu: [
        { label: "North America", path: "/exchanges/region/americas", icon: "🇺🇸" },
        { label: "Europe", path: "/exchanges/region/europe", icon: "🇪🇺" },
        { label: "Asia-Pacific", path: "/exchanges/region/asia-pacific", icon: "🇯🇵" },
        { label: "Middle East & Africa", path: "/exchanges/region/mea", icon: "🇸🇦" }
      ]
    },
    {
      label: "Stocks",
      path: "/stocks",
      icon: "📈",
      description: "Global equities and sectors",
      submenu: [
        { label: "Top Gainers", path: "/stocks/gainers", icon: "📈" },
        { label: "Top Losers", path: "/stocks/losers", icon: "📉" },
        { label: "Most Active", path: "/stocks/active", icon: "⚡" },
        { label: "Screener", path: "/stocks/screener", icon: "🔍" }
      ]
    },
    {
      label: "Forex",
      path: "/forex",
      icon: "💱",
      description: "20+ global currencies",
      submenu: [
        { label: "Currency Pairs", path: "/forex/pairs", icon: "⚖️" },
        { label: "Strength Index", path: "/forex/strength", icon: "💪" },
        { label: "Economic Calendar", path: "/forex/calendar", icon: "📅" },
        { label: "Converter", path: "/forex/converter", icon: "🔄" }
      ]
    },
    {
      label: "Crypto",
      path: "/crypto",
      icon: "₿",
      description: "20+ cryptocurrencies",
      submenu: [
        { label: "Overview", path: "/crypto/overview", icon: "📊" },
        { label: "Layer 1", path: "/crypto/layer1", icon: "⛓️" },
        { label: "DeFi", path: "/crypto/defi", icon: "🏦" },
        { label: "Stablecoins", path: "/crypto/stablecoins", icon: "💵" }
      ]
    },
    {
      label: "Commodities",
      path: "/commodities",
      icon: "⚒️",
      description: "Energy, metals & agriculture",
      submenu: [
        { label: "Energy", path: "/commodities/energy", icon: "⛽" },
        { label: "Metals", path: "/commodities/metals", icon: "🥇" },
        { label: "Agriculture", path: "/commodities/agriculture", icon: "🌾" },
        { label: "Industrial", path: "/commodities/industrial", icon: "⚙️" }
      ]
    },
    {
      label: "Regions",
      path: "/regions",
      icon: "🌍",
      description: "4 macro regions + sub-regions",
      submenu: [
        { label: "Americas", path: "/regions/americas", icon: "🌎" },
        { label: "Europe", path: "/regions/europe", icon: "🇪🇺" },
        { label: "Asia-Pacific", path: "/regions/asia-pacific", icon: "🌏" },
        { label: "Middle East & Africa", path: "/regions/mea", icon: "🌍" }
      ]
    },
    {
      label: "Sectors",
      path: "/sectors",
      icon: "🏢",
      description: "11 sectors and thematic themes",
      submenu: [
        { label: "Technology", path: "/sectors/technology", icon: "💻" },
        { label: "Healthcare", path: "/sectors/healthcare", icon: "💊" },
        { label: "Finance", path: "/sectors/banking", icon: "🏦" },
        { label: "Energy", path: "/sectors/energy", icon: "⚡" },
        { label: "AI & Semiconductors", path: "/sectors/ai", icon: "🤖" },
        { label: "EV & Transition", path: "/sectors/electric-vehicles", icon: "🔋" }
      ]
    },
    {
      label: "News",
      path: "/news",
      icon: "📰",
      description: "Global market news & analysis",
      submenu: [
        { label: "Market News", path: "/news/market", icon: "📰" },
        { label: "Economic Calendar", path: "/economic-calendar", icon: "📅" },
        { label: "Analysis", path: "/news/analysis", icon: "📊" },
        { label: "Views", path: "/news/views", icon: "👁️" }
      ]
    },
    {
      label: "Screener",
      path: "/screener",
      icon: "🔍",
      description: "Advanced stock screener"
    },
    {
      label: "Economic Calendar",
      path: "/economic-calendar",
      icon: "📅",
      description: "Upcoming macro releases"
    }
  ];

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(e.target as Node)) return;
      setOpenMenu(null);
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleItemClick = (item: NavigationItem, e: React.MouseEvent) => {
    if (item.submenu) {
      e.preventDefault();
      setOpenMenu((prev) => (prev === item.path ? null : item.path));
    }
  };

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
            {/* removed submenu toggle arrow per design request */}

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
