import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiArrowTrendingUp,
  HiArrowTrendingDown,
  HiArrowUpRight,
  HiChartBar,
  HiShieldCheck,
  HiLightBulb,
  HiFire,
} from "react-icons/hi2";
import cryptoData from "../../data/cryptocurrencies.json";
import type { Cryptocurrency } from "../../types";
import { useI18n } from "../i18n";
import "./TrendingCoinsPage.css";

const cryptocurrencies = (cryptoData as any).cryptocurrencies as Cryptocurrency[];

const formatMoney = (v: number) => {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  return `$${v.toLocaleString()}`;
};

const formatPrice = (v: number) =>
  v >= 1000 ? `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : `$${v.toFixed(2)}`;

const seededChange = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return parseFloat(((x - Math.floor(x)) * 24 - 6).toFixed(2));
};

const SENTIMENT = ["Hot", "Rising", "Active", "Strong"] as const;
type Sentiment = typeof SENTIMENT[number];

const SENTIMENT_CLASS: Record<Sentiment, string> = {
  Hot: "sentiment-hot",
  Rising: "sentiment-rising",
  Active: "sentiment-active",
  Strong: "sentiment-strong",
};

const SENTIMENT_ICON: Record<Sentiment, string> = {
  Hot: "🔥",
  Rising: "📈",
  Active: "⚡",
  Strong: "💯",
};

const SENTIMENT_KEY: Record<Sentiment, string> = {
  Hot: "crypto:trendingCoins.sentiment.hot",
  Rising: "crypto:trendingCoins.sentiment.rising",
  Active: "crypto:trendingCoins.sentiment.active",
  Strong: "crypto:trendingCoins.sentiment.strong",
};

type Category = "All" | "Layer 1" | "Layer 2" | "DeFi" | "Meme" | "Stablecoin" | "Payments" | "Infrastructure";

const CATEGORY_FILTERS: Category[] = [
  "All",
  "Layer 1",
  "DeFi",
  "Meme",
  "Stablecoin",
  "Payments",
  "Layer 2",
  "Infrastructure",
];

const CATEGORY_LABEL_KEY: Record<Category, string> = {
  All: "crypto:trendingCoins.categories.all",
  "Layer 1": "crypto:trendingCoins.categories.layer1",
  "Layer 2": "crypto:trendingCoins.categories.layer2",
  DeFi: "crypto:trendingCoins.categories.defi",
  Meme: "crypto:trendingCoins.categories.meme",
  Stablecoin: "crypto:trendingCoins.categories.stablecoin",
  Payments: "crypto:trendingCoins.categories.payments",
  Infrastructure: "crypto:trendingCoins.categories.infrastructure",
};

const RANK_MEDAL = ["🥇", "🥈", "🥉"];

const TrendingCoinsPage: React.FC = () => {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const categoryLabel = (category: Category | string) =>
    t(CATEGORY_LABEL_KEY[category as Category] ?? "", category);

  const coins = useMemo(() =>
    cryptocurrencies.slice(0, 20).map((coin, idx) => {
      const change24h = seededChange(idx * 7.3);
      return {
        ...coin,
        rank: idx + 1,
        price: idx === 0 ? 67800 : idx === 1 ? 3540 : 8000 - idx * 220,
        change24h,
        volume24h: coin.circulatingSupply * (Math.abs(Math.sin(idx + 2)) * 80 + 30),
        sentiment: SENTIMENT[idx % 4],
        volPct: 20 + (idx % 5) * 16,
      };
    }), []
  );

  const filteredCoins = activeCategory === "All"
    ? coins
    : coins.filter((c) => c.category === activeCategory);

  const podium = filteredCoins.slice(0, 3);
  const rest = filteredCoins.slice(3);

  const countFor = (cat: Category) =>
    cat === "All" ? coins.length : coins.filter((c) => c.category === cat).length;

  const totalVolume = coins.reduce((sum, c) => sum + c.volume24h, 0);
  const gainers = coins.filter((c) => c.change24h > 0).length;
  const topGain = Math.max(...coins.map((c) => c.change24h));

  return (
    <div className="page trending-page">
      <section className="trending-hero">
        <div className="trending-hero-copy">
          <p className="eyebrow">
            <span className="trending-live-dot" /> {t("crypto:trendingCoins.eyebrow")}
          </p>
          <h1>
            <span>{t("crypto:trendingCoins.titleAccent")}</span> {t("crypto:trendingCoins.titleRest")}
          </h1>
          <p>{t("crypto:trendingCoins.subtitle")}</p>
        </div>
        <div className="trending-metric-strip">
          <div className="trending-metric-tile accent">
            <span>{t("crypto:trendingCoins.metrics.tracked")}</span>
            <strong>{cryptocurrencies.length}</strong>
          </div>
          <div className="trending-metric-tile">
            <span>{t("crypto:volume24h")}</span>
            <strong>{formatMoney(totalVolume)}</strong>
          </div>
          <div className="trending-metric-tile positive">
            <span>{t("crypto:trendingCoins.metrics.gainers")}</span>
            <strong>{gainers} / {coins.length}</strong>
          </div>
          <div className="trending-metric-tile positive">
            <span>{t("crypto:trendingCoins.metrics.topGain24h")}</span>
            <strong>+{topGain.toFixed(1)}%</strong>
          </div>
        </div>
      </section>

      <div className="trending-filters">
        {CATEGORY_FILTERS.map((cat) => {
          const count = countFor(cat);
          return count > 0 ? (
            <button
              key={cat}
              type="button"
              className={`trending-filter-tab${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {categoryLabel(cat)}
              <span className="trending-filter-count">{count}</span>
            </button>
          ) : null;
        })}
      </div>

      {podium.length > 0 && (
        <div className="trending-podium">
          {podium.map((coin, i) => (
            <Link to={`/crypto/${coin.id}`} key={coin.id} className={`podium-card rank-${i + 1}`}>
              <span className="podium-category-chip">{categoryLabel(coin.category)}</span>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="podium-rank-badge">{RANK_MEDAL[i] ?? `#${coin.rank}`}</span>
                <div>
                  <p className="podium-name">{coin.name}</p>
                  <p className="podium-symbol">{coin.symbol}</p>
                </div>
              </div>

              <div>
                <p className="podium-price">{formatPrice(coin.price)}</p>
                <span className={`podium-change ${coin.change24h >= 0 ? "up" : "down"}`}>
                  {coin.change24h >= 0 ? <HiArrowTrendingUp /> : <HiArrowTrendingDown />}
                  {coin.change24h >= 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
                </span>
              </div>

              <div className="podium-stats">
                <div className="podium-stat">
                  <span>{t("crypto:trendingCoins.metrics.volumeShort")}</span>
                  <strong>{formatMoney(coin.volume24h)}</strong>
                </div>
                <div className="podium-stat">
                  <span>{t("crypto:trendingCoins.metrics.supply")}</span>
                  <strong>{(coin.circulatingSupply / 1e6).toFixed(0)}M</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <>
          <div className="trending-grid-header">
            <h2>{t("crypto:trendingCoins.moreTitle")}</h2>
          </div>
          <div className="trending-grid">
            {rest.map((coin) => {
              const s = coin.sentiment as Sentiment;
              return (
                <Link to={`/crypto/${coin.id}`} key={coin.id} className="trending-card">
                  <div className="trending-card-header">
                    <span className="trending-card-rank">#{coin.rank}</span>
                    <div className="trending-card-identity">
                      <p className="trending-card-name">{coin.name}</p>
                      <p className="trending-card-symbol">{coin.symbol}</p>
                    </div>
                    <span className={`trending-sentiment-badge ${SENTIMENT_CLASS[s]}`}>
                      <span aria-hidden="true">{SENTIMENT_ICON[s]}</span> {t(SENTIMENT_KEY[s])}
                    </span>
                  </div>

                  <div className="trending-card-price">
                    <span className="trending-card-price-value">{formatPrice(coin.price)}</span>
                    <span className={`trending-card-change ${coin.change24h >= 0 ? "up" : "down"}`}>
                      {coin.change24h >= 0 ? <HiArrowTrendingUp style={{ width: 12, height: 12 }} /> : <HiArrowTrendingDown style={{ width: 12, height: 12 }} />}
                      {coin.change24h >= 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
                    </span>
                  </div>

                  <div className="trending-card-footer">
                    <div className="trending-card-stat">
                      <span>{t("crypto:volume24h")}</span>
                      <strong>{formatMoney(coin.volume24h)}</strong>
                      <div className="trending-card-vol-bar">
                        <div className="trending-card-vol-fill" style={{ width: `${coin.volPct}%` }} />
                      </div>
                    </div>
                    <div className="trending-card-stat">
                      <span>{t("crypto:category")}</span>
                      <strong>{categoryLabel(coin.category)}</strong>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {filteredCoins.length === 0 && (
        <div style={{ textAlign: "center", padding: "64px 0", color: "#94a3b8" }}>
          <HiFire style={{ width: 40, height: 40, margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
          <p>{t("crypto:trendingCoins.emptyCategory")}</p>
        </div>
      )}

      <div className="trending-insights">
        <div className="trending-insight-card">
          <div className="trending-insight-icon" style={{ background: "#fff7ed", color: "#c2410c" }}>
            <HiFire />
          </div>
          <p className="eyebrow">{t("crypto:trendingCoins.insights.trending.eyebrow")}</p>
          <h3>{t("crypto:trendingCoins.insights.trending.title")}</h3>
          <ul className="trending-insight-list">
            <li>{t("crypto:trendingCoins.insights.trending.items.socialMentions")}</li>
            <li>{t("crypto:trendingCoins.insights.trending.items.exchangeFlows")}</li>
            <li>{t("crypto:trendingCoins.insights.trending.items.developerActivity")}</li>
            <li>{t("crypto:trendingCoins.insights.trending.items.onChainVolume")}</li>
            <li>{t("crypto:trendingCoins.insights.trending.items.volumeBreakouts")}</li>
          </ul>
        </div>

        <div className="trending-insight-card">
          <div className="trending-insight-icon" style={{ background: "#fef2f2", color: "#dc2626" }}>
            <HiShieldCheck />
          </div>
          <p className="eyebrow">{t("crypto:trendingCoins.insights.risk.eyebrow")}</p>
          <h3>{t("crypto:trendingCoins.insights.risk.title")}</h3>
          <ul className="trending-insight-list">
            <li>{t("crypto:trendingCoins.insights.risk.items.volatility")}</li>
            <li>{t("crypto:trendingCoins.insights.risk.items.liquidity")}</li>
            <li>{t("crypto:trendingCoins.insights.risk.items.manipulation")}</li>
            <li>{t("crypto:trendingCoins.insights.risk.items.regulation")}</li>
            <li>{t("crypto:trendingCoins.insights.risk.items.techRisk")}</li>
          </ul>
        </div>

        <div className="trending-insight-card">
          <div className="trending-insight-icon" style={{ background: "#f0fdf4", color: "#15803d" }}>
            <HiLightBulb />
          </div>
          <p className="eyebrow">{t("crypto:trendingCoins.insights.tips.eyebrow")}</p>
          <h3>{t("crypto:trendingCoins.insights.tips.title")}</h3>
          <ul className="trending-insight-list">
            <li>{t("crypto:trendingCoins.insights.tips.items.onChainValidation")}</li>
            <li>{t("crypto:trendingCoins.insights.tips.items.githubActivity")}</li>
            <li>{t("crypto:trendingCoins.insights.tips.items.divergence")}</li>
            <li>{t("crypto:trendingCoins.insights.tips.items.positionSizing")}</li>
            <li>{t("crypto:trendingCoins.insights.tips.items.stopLosses")}</li>
          </ul>
        </div>
      </div>

      <section className="trending-cta">
        <p className="eyebrow">{t("crypto:trendingCoins.cta.eyebrow")}</p>
        <h3>{t("crypto:trendingCoins.cta.title")}</h3>
        <p>{t("crypto:trendingCoins.cta.description")}</p>
        <Link to="/crypto" className="trending-cta-btn">
          <HiChartBar style={{ width: 16, height: 16 }} />
          {t("crypto:viewAllCryptocurrencies")}
          <HiArrowUpRight style={{ width: 14, height: 14 }} />
        </Link>
      </section>
    </div>
  );
};

export default TrendingCoinsPage;
