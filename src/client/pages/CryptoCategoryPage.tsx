import React from "react";
import { Link, useLocation } from "react-router-dom";
import cryptoData from "../../data/cryptocurrencies.json";
import type { Cryptocurrency } from "../../types";
import "../styles/index.css";
import { useI18n } from "../i18n";
import { translateSourceText, translateStatic } from "../i18n/translate";



const cryptocurrencies = (cryptoData as any).cryptocurrencies as Cryptocurrency[];

// ── Static mock market data (stable across renders) ──────────────────────────

const MEME_PRICES: Record<string, { price: number; change: number; marketCap: number; volume: number; community: string }> = {
  DOGE: { price: 0.1623,      change: +4.72,  marketCap: 23.2e9,  volume: 1.8e9,  community: "Original OG" },
  SHIB: { price: 0.00001815,  change: +7.14,  marketCap: 10.7e9,  volume: 612e6,  community: "ShibArmy" },
  PEPE: { price: 0.00001342,  change: +12.38, marketCap: 5.64e9,  volume: 980e6,  community: "Pepe Nation" },
  BONK: { price: 0.00002450,  change: -3.21,  marketCap: 1.64e9,  volume: 230e6,  community: "Solana Memes" },
  FLOKI: { price: 0.0001723,  change: +2.55,  marketCap: 1.66e9,  volume: 195e6,  community: "Viking Army" },
};

const STABLE_PRICES: Record<string, { price: number; change: number; marketCap: number; volume: number; pegType: string; backing: string }> = {
  USDT: { price: 1.0001, change: +0.01, marketCap: 95e9,  volume: 62e9,  pegType: "Fiat-Backed",       backing: "USD Reserves" },
  USDC: { price: 0.9999, change: -0.01, marketCap: 33e9,  volume: 8.4e9, pegType: "Fiat-Backed",       backing: "USD + T-Bills" },
  DAI:  { price: 1.0002, change: +0.02, marketCap: 5.5e9, volume: 412e6, pegType: "Crypto-Collateral", backing: "ETH / RWA" },
};

const DEFI_PRICES: Record<string, { price: number; change: number; marketCap: number; volume: number; protocol: string; tvl: string }> = {
  UNI:  { price: 7.82,    change: +3.24, marketCap: 5.31e9,  volume: 210e6, protocol: "DEX",          tvl: "$4.2B" },
  AAVE: { price: 156.40,  change: +5.81, marketCap: 2.32e9,  volume: 185e6, protocol: "Lending",      tvl: "$12.8B" },
  COMP: { price: 48.20,   change: -1.42, marketCap: 425e6,   volume: 52e6,  protocol: "Lending",      tvl: "$2.1B" },
  MKR:  { price: 1842.50, change: +2.07, marketCap: 1.65e9,  volume: 78e6,  protocol: "Governance",   tvl: "$8.4B" },
  CRV:  { price: 0.3821,  change: +8.73, marketCap: 523e6,   volume: 135e6, protocol: "DEX / AMM",    tvl: "$1.9B" },
};

const LAYER1_PRICES: Record<string, { price: number; change: number; marketCap: number; volume: number; tps: string; consensus: string }> = {
  BTC:  { price: 65234,   change: +2.14,  marketCap: 1.29e12, volume: 28.4e9, tps: "7",      consensus: "Proof of Work" },
  ETH:  { price: 3412,    change: +3.52,  marketCap: 410e9,   volume: 15.2e9, tps: "15",     consensus: "Proof of Stake" },
  BNB:  { price: 585,     change: +1.83,  marketCap: 85e9,    volume: 1.9e9,  tps: "300",    consensus: "Proof of Authority" },
  SOL:  { price: 142,     change: +5.21,  marketCap: 60.4e9,  volume: 3.1e9,  tps: "65,000", consensus: "Proof of History" },
  ADA:  { price: 0.4521,  change: -0.84,  marketCap: 14.9e9,  volume: 420e6,  tps: "250",    consensus: "Proof of Stake" },
  AVAX: { price: 32.40,   change: +4.12,  marketCap: 13.2e9,  volume: 680e6,  tps: "4,500",  consensus: "Proof of Stake" },
  DOT:  { price: 6.82,    change: -2.31,  marketCap: 7.9e9,   volume: 310e6,  tps: "1,000",  consensus: "Proof of Stake" },
  TRX:  { price: 0.1124,  change: +0.94,  marketCap: 9.7e9,   volume: 485e6,  tps: "2,000",  consensus: "Delegated PoS" },
  ATOM: { price: 8.34,    change: +3.71,  marketCap: 3.2e9,   volume: 210e6,  tps: "10,000", consensus: "Proof of Stake" },
  TON:  { price: 6.12,    change: +6.84,  marketCap: 30.6e9,  volume: 890e6,  tps: "100,000",consensus: "Proof of Stake" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (v: number) => {
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9)  return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6)  return `$${(v / 1e6).toFixed(2)}M`;
  return `$${v.toLocaleString()}`;
};

const fmtPrice = (p: number) =>
  p < 0.001 ? `$${p.toFixed(8)}` : p < 1 ? `$${p.toFixed(4)}` : `$${p.toFixed(4)}`;

const translatedCoinName = (t: ReturnType<typeof useI18n>["t"], coin: Cryptocurrency) => {
  const translated = translateStatic(t, coin.nameKey, coin.name);
  return translated.trim().toLowerCase() === "name" ? coin.name : translated;
};

// ── Page ──────────────────────────────────────────────────────────────────────

const CryptoCategoryPage: React.FC = () => {
  const location = useLocation();
  const { t } = useI18n();
  const tx = (value: string) => translateSourceText(t, value);
  const category = location.pathname.split("/").filter(Boolean).pop();

  if (category === "meme-coins") return <MemeCoinsPage />;
  if (category === "stablecoins") return <StablecoinsPage />;
  if (category === "defi") return <DeFiPage />;
  if (category === "layer-1") return <Layer1Page />;

  return (
    <div className="page intelligence-page">
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">{t("crypto:cryptocurrency")}</p>
          <h1>{t("crypto:categoryNotFound")}</h1>
          <p>{t("crypto:categoryNotFoundDescription")}</p>
        </div>
      </section>
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <Link to="/crypto" className="primary-action" style={{ textDecoration: "none" }}>
          {t("crypto:viewAllCryptocurrencies")}
        </Link>
      </div>
    </div>
  );
};

// ── Meme Coins ────────────────────────────────────────────────────────────────

const MemeCoinsPage: React.FC = () => {
  const { t } = useI18n();
  const coins = cryptocurrencies.filter(c => c.category === "Meme");
  const totalMCap = Object.values(MEME_PRICES).reduce((s, d) => s + d.marketCap, 0);
  const topGainer = Object.entries(MEME_PRICES).reduce((a, b) => b[1].change > a[1].change ? b : a);
  const mt = (key: string) => t(`crypto:categoryPages.meme.${key}`);
  const ct = (key: string) => t(`crypto:categoryPages.common.${key}`);

  return (
    <div className="page intelligence-page">
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">{mt("eyebrow")}</p>
          <h1>{mt("title")}</h1>
          <p>
            {mt("body")}
          </p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>{mt("metrics.coinsListed")}</span>
            <strong>{coins.length}</strong>
          </div>
          <div className="metric-tile">
            <span>{ct("combinedMarketCap")}</span>
            <strong>{fmt(totalMCap)}</strong>
          </div>
          <div className="metric-tile">
            <span>{ct("topGainer24h")}</span>
            <strong style={{ color: "#059669" }}>
              {topGainer[0]} +{topGainer[1].change.toFixed(2)}%
            </strong>
          </div>
        </div>
      </section>

      {/* Coin Table */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p className="eyebrow">{ct("marketOverview")}</p>
          <h2>{mt("rankingsTitle")}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", background: "rgba(162,120,65,0.05)" }}>
                {[
                  { id: "rank", label: "#", align: "left" },
                  { id: "name", label: ct("name"), align: "left" },
                  { id: "price", label: ct("price"), align: "right" },
                  { id: "change24h", label: ct("change24h"), align: "right" },
                  { id: "marketCap", label: ct("marketCap"), align: "right" },
                  { id: "volume24h", label: ct("volume24h"), align: "right" },
                  { id: "community", label: mt("table.community"), align: "right" },
                ].map(h => (
                  <th key={h.id} style={{ padding: "12px 16px", textAlign: h.align as "left" | "right", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b", whiteSpace: "nowrap" }}>
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, idx) => {
                const d = MEME_PRICES[coin.symbol];
                if (!d) return null;
                return (
                  <tr
                    key={coin.id}
                    style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(162,120,65,0.04)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#94a3b8" }}>#{idx + 1}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <Link to={`/crypto/${coin.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(162,120,65,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#A27841", flexShrink: 0 }}>
                            {coin.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <strong style={{ display: "block", fontSize: "14px" }}>{translatedCoinName(t, coin)}</strong>
                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>{coin.symbol}</span>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600, fontFamily: "monospace" }}>
                      {fmtPrice(d.price)}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 700, color: d.change >= 0 ? "#059669" : "#dc2626" }}>
                      {d.change >= 0 ? "+" : ""}{d.change.toFixed(2)}%
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", color: "#475569" }}>{fmt(d.marketCap)}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", color: "#475569" }}>{fmt(d.volume)}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 8px", background: "rgba(162,120,65,0.1)", color: "#A27841", borderRadius: "12px", whiteSpace: "nowrap" }}>
                        {mt(`communities.${coin.symbol}`)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Insight Panels */}
      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">{mt("insights.origins.eyebrow")}</p>
          <h3>{mt("insights.origins.title")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>{mt("insights.origins.items.dogecoin")}</li>
            <li>{mt("insights.origins.items.elon")}</li>
            <li>{mt("insights.origins.items.pumps")}</li>
            <li>{mt("insights.origins.items.shiba")}</li>
            <li>{mt("insights.origins.items.pepe")}</li>
            <li>{mt("insights.origins.items.bonk")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{ct("riskProfile")}</p>
          <h3>{mt("insights.risk.title")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>{mt("insights.risk.items.sentiment")}</li>
            <li>{mt("insights.risk.items.pumpDump")}</li>
            <li>{mt("insights.risk.items.utility")}</li>
            <li>{mt("insights.risk.items.volatility")}</li>
            <li>{mt("insights.risk.items.rugPull")}</li>
            <li>{mt("insights.risk.items.viralCycles")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{mt("insights.signals.eyebrow")}</p>
          <h3>{mt("insights.signals.title")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>{mt("insights.signals.items.twitter")}</li>
            <li>{mt("insights.signals.items.reddit")}</li>
            <li>{mt("insights.signals.items.whales")}</li>
            <li>{mt("insights.signals.items.listings")}</li>
            <li>{mt("insights.signals.items.google")}</li>
            <li>{mt("insights.signals.items.influencers")}</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section style={{ marginTop: "48px", padding: "32px", backgroundColor: "rgba(162,120,65,0.08)", borderRadius: "8px", border: "1px solid rgba(162,120,65,0.2)", textAlign: "center" }}>
        <p className="eyebrow">{ct("fullCryptoMarket")}</p>
        <h3>{ct("exploreAllCryptocurrencies")}</h3>
        <p style={{ color: "#475569", marginTop: "8px", marginBottom: "20px", maxWidth: "480px", margin: "8px auto 20px" }}>{mt("cta.description")}</p>
        <Link to="/crypto" className="primary-action" style={{ textDecoration: "none" }}>
          {t("crypto:viewAllCryptocurrencies")}
        </Link>
      </section>
    </div>
  );
};

// ── Stablecoins ───────────────────────────────────────────────────────────────

const StablecoinsPage: React.FC = () => {
  const { t } = useI18n();
  const tx = (value: string) => translateSourceText(t, value);
  const coins = cryptocurrencies.filter(c => c.category === "Stablecoin");
  const totalSupply = coins.reduce((s, c) => s + (c.circulatingSupply ?? 0), 0);
  const avgDev = 0.012;

  return (
    <div className="page intelligence-page">
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">{translateStatic(t, "pages.cryptoCategory.stableEyebrow", "Price Stability")}</p>
          <h1>{translateStatic(t, "pages.cryptoCategory.stableTitle", "Stablecoins")}</h1>
          <p>
            {translateStatic(t, "pages.cryptoCategory.stableBody", "Cryptocurrencies pegged to fiat currencies or real-world assets, providing stability for trading, DeFi liquidity, cross-border payments, and hedging against market volatility.")}
          </p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>{tx("Stablecoins Listed")}</span>
            <strong>{coins.length}</strong>
          </div>
          <div className="metric-tile">
            <span>{tx("Total Supply")}</span>
            <strong>{fmt(totalSupply)}</strong>
          </div>
          <div className="metric-tile">
            <span>{tx("Avg Peg Deviation")}</span>
            <strong style={{ color: "#059669" }}>±{avgDev}%</strong>
          </div>
        </div>
      </section>

      {/* Coin Table */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p className="eyebrow">{tx("Market Overview")}</p>
          <h2>{tx("Stablecoin Rankings")}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", background: "rgba(162,120,65,0.05)" }}>
                {["#", "Name", "Price", "24h Change", "Peg Type", "Backing", "Market Cap", "24h Volume"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: h === "#" || h === "Name" ? "left" : "right", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b", whiteSpace: "nowrap" }}>
                    {h === "#" ? h : tx(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, idx) => {
                const d = STABLE_PRICES[coin.symbol];
                if (!d) return null;
                const deviation = Math.abs(d.price - 1.0);
                const isPegged = deviation < 0.002;
                return (
                  <tr
                    key={coin.id}
                    style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(162,120,65,0.04)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#94a3b8" }}>#{idx + 1}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <Link to={`/crypto/${coin.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(5,150,105,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#059669", flexShrink: 0 }}>
                            {coin.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <strong style={{ display: "block", fontSize: "14px" }}>{translateStatic(t, coin.nameKey, coin.name)}</strong>
                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>{coin.symbol}</span>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600, fontFamily: "monospace" }}>
                      ${d.price.toFixed(4)}
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 700, color: d.change >= 0 ? "#059669" : "#dc2626" }}>
                      {d.change >= 0 ? "+" : ""}{d.change.toFixed(2)}%
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 8px", background: "rgba(59,130,246,0.1)", color: "#3b82f6", borderRadius: "12px", whiteSpace: "nowrap" }}>
                        {d.pegType}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", color: "#475569" }}>{d.backing}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", color: "#475569" }}>{fmt(d.marketCap)}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <span style={{ color: "#475569" }}>{fmt(d.volume)}</span>
                      {isPegged && (
                        <span style={{ display: "block", fontSize: "10px", color: "#059669", fontWeight: 600 }}>{tx("Peg ?")}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Insight Panels */}
      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">{tx("How They Work")}</p>
          <h3>{tx("Peg Mechanisms")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li><strong>{tx("Fiat-backed")}</strong>{tx(" — 1:1 reserves in USD (USDT, USDC)")}</li>
            <li><strong>{tx("Crypto-collateralised")}</strong>{tx(" — Over-collateralised with ETH/RWA (DAI)")}</li>
            <li><strong>{tx("Algorithmic")}</strong>{tx(" — Smart contract supply management")}</li>
            <li>{tx("Audits & attestations maintain trust")}</li>
            <li>{tx("Reserve transparency varies by issuer")}</li>
            <li>{tx("Redemption mechanisms protect the peg")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{tx("Regulation")}</p>
          <h3>{tx("Global Regulatory Landscape")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>{tx("EU MiCA framework — live since 2024")}</li>
            <li>{tx("US GENIUS Act — stablecoin reserve rules")}</li>
            <li>{tx("UK FCA stablecoin licensing regime")}</li>
            <li>{tx("Hong Kong HKMA licensing pilot")}</li>
            <li>{tx("Singapore MAS Payment Services Act")}</li>
            <li>{tx("FATF travel rule applies globally")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{tx("Use Cases")}</p>
          <h3>{tx("Why Stablecoins Matter")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>{tx("DeFi liquidity pools & yield farming")}</li>
            <li>{tx("Cross-border remittances at low cost")}</li>
            <li>{tx("Crypto trading pairs on all exchanges")}</li>
            <li>{tx("Hedging against volatile crypto assets")}</li>
            <li>{tx("On-chain payroll & business payments")}</li>
            <li>{tx("Collateral in lending protocols")}</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section style={{ marginTop: "48px", padding: "32px", backgroundColor: "rgba(162,120,65,0.08)", borderRadius: "8px", border: "1px solid rgba(162,120,65,0.2)", textAlign: "center" }}>
        <p className="eyebrow">{tx("Full Crypto Market")}</p>
        <h3>{tx("Explore All Cryptocurrencies")}</h3>
        <p style={{ color: "#475569", marginTop: "8px", marginBottom: "20px", maxWidth: "480px", margin: "8px auto 20px" }}>{tx("Compare stablecoins against volatile assets, DeFi protocols, and layer-1 blockchains.")}</p>
        <Link to="/crypto" className="primary-action" style={{ textDecoration: "none" }}>
          {t("crypto:viewAllCryptocurrencies")}
        </Link>
      </section>
    </div>
  );
};

// ── DeFi ─────────────────────────────────────────────────────────────────────

const DeFiPage: React.FC = () => {
  const { t } = useI18n();
  const tx = (value: string) => translateSourceText(t, value);
  const coins = cryptocurrencies.filter(c => c.category === "DeFi");
  const totalTVL = 29.4e9;
  const totalMCap = Object.values(DEFI_PRICES).reduce((s, d) => s + d.marketCap, 0);
  const topGainer = Object.entries(DEFI_PRICES).reduce((a, b) => b[1].change > a[1].change ? b : a);

  return (
    <div className="page intelligence-page">
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">{translateStatic(t, "pages.cryptoCategory.defiEyebrow", "Decentralised Finance")}</p>
          <h1>{translateStatic(t, "pages.cryptoCategory.defiTitle", "DeFi Ecosystem")}</h1>
          <p>
            {t("pages.cryptoCategory.defiBody", "Open financial protocols built on blockchain — enabling permissionless lending, borrowing, trading, and yield generation without intermediaries.")}
          </p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>{tx("Protocols Listed")}</span>
            <strong>{coins.length}</strong>
          </div>
          <div className="metric-tile">
            <span>{tx("Total Value Locked")}</span>
            <strong>{fmt(totalTVL)}</strong>
          </div>
          <div className="metric-tile">
            <span>{tx("Top Gainer (24h)")}</span>
            <strong style={{ color: "#059669" }}>{topGainer[0]} +{topGainer[1].change.toFixed(2)}%</strong>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p className="eyebrow">{tx("Market Overview")}</p>
          <h2>{tx("DeFi Protocol Rankings")}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", background: "rgba(162,120,65,0.05)" }}>
                {["#", "Protocol", "Price", "24h Change", "Type", "TVL", "Market Cap", "24h Volume"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: h === "#" || h === "Protocol" ? "left" : "right", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b", whiteSpace: "nowrap" }}>
                    {h === "#" ? h : tx(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, idx) => {
                const d = DEFI_PRICES[coin.symbol];
                if (!d) return null;
                return (
                  <tr key={coin.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(162,120,65,0.04)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#94a3b8" }}>#{idx + 1}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <Link to={`/crypto/${coin.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#6366f1", flexShrink: 0 }}>
                            {coin.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <strong style={{ display: "block", fontSize: "14px" }}>{translateStatic(t, coin.nameKey, coin.name)}</strong>
                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>{coin.symbol}</span>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600, fontFamily: "monospace" }}>{fmtPrice(d.price)}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 700, color: d.change >= 0 ? "#059669" : "#dc2626" }}>
                      {d.change >= 0 ? "+" : ""}{d.change.toFixed(2)}%
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 8px", background: "rgba(99,102,241,0.1)", color: "#6366f1", borderRadius: "12px", whiteSpace: "nowrap" }}>
                        {d.protocol}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600, color: "#059669" }}>{d.tvl}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", color: "#475569" }}>{fmt(d.marketCap)}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", color: "#475569" }}>{fmt(d.volume)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">{tx("Core Primitives")}</p>
          <h3>{tx("How DeFi Works")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li><strong>{tx("AMMs")}</strong>{tx(" — Automated market makers replace order books")}</li>
            <li><strong>{tx("Lending")}</strong>{tx(" — Overcollateralised loans via smart contracts")}</li>
            <li><strong>{tx("Yield farming")}</strong>{tx(" — Earn rewards by providing liquidity")}</li>
            <li><strong>{tx("Governance")}</strong>{tx(" — Token holders vote on protocol changes")}</li>
            <li><strong>{tx("Flash loans")}</strong>{tx(" — Uncollateralised single-transaction loans")}</li>
            <li><strong>{tx("Derivatives")}</strong>{tx(" — Synthetic assets and perpetual futures")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{tx("Risk Profile")}</p>
          <h3>{tx("DeFi-Specific Risks")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>{tx("Smart contract exploits & audit failures")}</li>
            <li>{tx("Oracle manipulation attacks")}</li>
            <li>{tx("Impermanent loss for liquidity providers")}</li>
            <li>{tx("Liquidation cascades in bear markets")}</li>
            <li>{tx("Governance token centralisation")}</li>
            <li>{tx("Regulatory scrutiny on unlicensed lending")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{tx("Key Metrics")}</p>
          <h3>{tx("What to Track")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>{tx("Total Value Locked (TVL) per protocol")}</li>
            <li>{tx("Protocol revenue & fee generation")}</li>
            <li>{tx("Active wallet addresses")}</li>
            <li>{tx("Liquidation volumes & health factors")}</li>
            <li>{tx("Token distribution & whale concentration")}</li>
            <li>{tx("Audit status & bug bounty coverage")}</li>
          </ul>
        </div>
      </section>

      <section style={{ marginTop: "48px", padding: "32px", backgroundColor: "rgba(162,120,65,0.08)", borderRadius: "8px", border: "1px solid rgba(162,120,65,0.2)", textAlign: "center" }}>
        <p className="eyebrow">{tx("Full Crypto Market")}</p>
        <h3>{tx("Explore All Cryptocurrencies")}</h3>
        <p style={{ color: "#475569", marginTop: "8px", marginBottom: "20px", maxWidth: "480px", margin: "8px auto 20px" }}>{tx("Compare DeFi protocols against layer-1 blockchains, stablecoins, and meme coins.")}</p>
        <Link to="/crypto" className="primary-action" style={{ textDecoration: "none" }}>{tx("View All Coins")}</Link>
      </section>
    </div>
  );
};

// ── Layer 1 ───────────────────────────────────────────────────────────────────

const Layer1Page: React.FC = () => {
  const { t } = useI18n();
  const tx = (value: string) => translateSourceText(t, value);
  const coins = cryptocurrencies.filter(c => c.category === "Layer 1");
  const totalMCap = Object.values(LAYER1_PRICES).reduce((s, d) => s + d.marketCap, 0);
  const topGainer = Object.entries(LAYER1_PRICES).reduce((a, b) => b[1].change > a[1].change ? b : a);

  return (
    <div className="page intelligence-page">
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">{translateStatic(t, "pages.cryptoCategory.layer1Eyebrow", "Blockchain Infrastructure")}</p>
          <h1>{translateStatic(t, "pages.cryptoCategory.layer1Title", "Layer 1 Blockchains")}</h1>
          <p>
            {t("pages.cryptoCategory.layer1Body", "The foundational settlement layers of the crypto ecosystem — independent blockchain networks competing on speed, security, decentralisation, and developer adoption.")}
          </p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>{tx("Chains Listed")}</span>
            <strong>{coins.length}</strong>
          </div>
          <div className="metric-tile">
            <span>{tx("Combined Market Cap")}</span>
            <strong>{fmt(totalMCap)}</strong>
          </div>
          <div className="metric-tile">
            <span>{tx("Top Gainer (24h)")}</span>
            <strong style={{ color: "#059669" }}>{topGainer[0]} +{topGainer[1].change.toFixed(2)}%</strong>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p className="eyebrow">{tx("Market Overview")}</p>
          <h2>{tx("Layer 1 Rankings")}</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", background: "rgba(162,120,65,0.05)" }}>
                {["#", "Chain", "Price", "24h Change", "Consensus", "Max TPS", "Market Cap", "24h Volume"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: h === "#" || h === "Chain" ? "left" : "right", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b", whiteSpace: "nowrap" }}>
                    {h === "#" ? h : tx(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coins.map((coin, idx) => {
                const d = LAYER1_PRICES[coin.symbol];
                if (!d) return null;
                return (
                  <tr key={coin.id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(162,120,65,0.04)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#94a3b8" }}>#{idx + 1}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <Link to={`/crypto/${coin.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(162,120,65,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#A27841", flexShrink: 0 }}>
                            {coin.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <strong style={{ display: "block", fontSize: "14px" }}>{translateStatic(t, coin.nameKey, coin.name)}</strong>
                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>{coin.symbol}</span>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600, fontFamily: "monospace" }}>{fmtPrice(d.price)}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 700, color: d.change >= 0 ? "#059669" : "#dc2626" }}>
                      {d.change >= 0 ? "+" : ""}{d.change.toFixed(2)}%
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", color: "#475569" }}>{d.consensus}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontWeight: 600, color: "#A27841" }}>{d.tps}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", color: "#475569" }}>{fmt(d.marketCap)}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right", color: "#475569" }}>{fmt(d.volume)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="intelligence-grid">
        <div className="intelligence-panel">
          <p className="eyebrow">{tx("The Trilemma")}</p>
          <h3>{tx("Security · Scalability · Decentralisation")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>{tx("Bitcoin prioritises security & decentralisation")}</li>
            <li>{tx("Solana prioritises speed & scalability")}</li>
            <li>{tx("Ethereum balances all three post-Merge")}</li>
            <li>{tx("PoW vs PoS energy trade-offs")}</li>
            <li>{tx("Validator count drives decentralisation")}</li>
            <li>{tx("Sharding & rollups extend base-layer capacity")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{tx("Developer Ecosystem")}</p>
          <h3>{tx("Where Builders Are Going")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>{tx("Ethereum — largest dApp & DeFi ecosystem")}</li>
            <li>{tx("Solana — high-frequency trading & gaming")}</li>
            <li>{tx("BNB Chain — retail DeFi & low-fee swaps")}</li>
            <li>{tx("Cosmos — IBC cross-chain interoperability")}</li>
            <li>{tx("Polkadot — parachain specialisation model")}</li>
            <li>{tx("TON — Telegram's 900M user base integration")}</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">{tx("Investment Lens")}</p>
          <h3>{tx("What to Evaluate")}</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>{tx("Active developer count & GitHub commits")}</li>
            <li>{tx("Daily active addresses & transaction volume")}</li>
            <li>{tx("Staking yield & validator economics")}</li>
            <li>{tx("Tokenomics — inflation rate & supply schedule")}</li>
            <li>{tx("Ecosystem TVL & dApp diversity")}</li>
            <li>{tx("Institutional custody & ETF availability")}</li>
          </ul>
        </div>
      </section>

      <section style={{ marginTop: "48px", padding: "32px", backgroundColor: "rgba(162,120,65,0.08)", borderRadius: "8px", border: "1px solid rgba(162,120,65,0.2)", textAlign: "center" }}>
        <p className="eyebrow">{tx("Full Crypto Market")}</p>
        <h3>{tx("Explore All Cryptocurrencies")}</h3>
        <p style={{ color: "#475569", marginTop: "8px", marginBottom: "20px", maxWidth: "480px", margin: "8px auto 20px" }}>{tx("Compare layer-1 blockchains against DeFi protocols, stablecoins, and meme coins.")}</p>
        <Link to="/crypto" className="primary-action" style={{ textDecoration: "none" }}>{tx("View All Coins")}</Link>
      </section>
    </div>
  );
};

export default CryptoCategoryPage;
