import React from "react";
import { Link, useLocation } from "react-router-dom";
import cryptoData from "../../data/cryptocurrencies.json";
import type { Cryptocurrency } from "../../types";
import "../styles/index.css";
import { useI18n } from "../i18n";



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

// ── Page ──────────────────────────────────────────────────────────────────────

const CryptoCategoryPage: React.FC = () => {
  const location = useLocation();
  const category = location.pathname.split("/").filter(Boolean).pop();

  if (category === "meme-coins") return <MemeCoinsPage />;
  if (category === "stablecoins") return <StablecoinsPage />;
  if (category === "defi") return <DeFiPage />;
  if (category === "layer-1") return <Layer1Page />;

  return (
    <div className="page intelligence-page">
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">Cryptocurrency</p>
          <h1>Category Not Found</h1>
          <p>This category doesn't exist. Browse all cryptocurrencies below.</p>
        </div>
      </section>
      <div style={{ textAlign: "center", padding: "48px 0" }}>
        <Link to="/crypto" className="primary-action" style={{ textDecoration: "none" }}>
          View All Cryptocurrencies
        </Link>
      </div>
    </div>
  );
};

// ── Meme Coins ────────────────────────────────────────────────────────────────

const MemeCoinsPage: React.FC = () => {
  const coins = cryptocurrencies.filter(c => c.category === "Meme");
  const totalMCap = Object.values(MEME_PRICES).reduce((s, d) => s + d.marketCap, 0);
  const topGainer = Object.entries(MEME_PRICES).reduce((a, b) => b[1].change > a[1].change ? b : a);

  return (
    <div className="page intelligence-page">
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">Community Tokens</p>
          <h1>Meme Coins</h1>
          <p>
            Community-driven cryptocurrencies fuelled by viral culture, social momentum, and cult followings.
            High-risk, high-reward assets where sentiment rules the market.
          </p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>Coins Listed</span>
            <strong>{coins.length}</strong>
          </div>
          <div className="metric-tile">
            <span>Combined Market Cap</span>
            <strong>{fmt(totalMCap)}</strong>
          </div>
          <div className="metric-tile">
            <span>Top Gainer (24h)</span>
            <strong style={{ color: "#059669" }}>
              {topGainer[0]} +{topGainer[1].change.toFixed(2)}%
            </strong>
          </div>
        </div>
      </section>

      {/* Coin Table */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p className="eyebrow">Market Overview</p>
          <h2>Meme Coin Rankings</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", background: "rgba(162,120,65,0.05)" }}>
                {["#", "Name", "Price", "24h Change", "Market Cap", "24h Volume", "Community"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: h === "#" || h === "Name" ? "left" : "right", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b", whiteSpace: "nowrap" }}>
                    {h}
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
                            <strong style={{ display: "block", fontSize: "14px" }}>{coin.name}</strong>
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
                        {d.community}
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
          <p className="eyebrow">Origins</p>
          <h3>The Meme Coin Story</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>Dogecoin (2013) — the original internet joke coin</li>
            <li>Elon Musk tweets as price catalysts</li>
            <li>WallStreetBets-style coordinated pumps</li>
            <li>Shiba Inu launched as a "DOGE killer"</li>
            <li>2023 PEPE boom revived the meme cycle</li>
            <li>BONK airdropped life into Solana DeFi</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Risk Profile</p>
          <h3>What Investors Should Know</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>Prices driven almost entirely by sentiment</li>
            <li>Susceptible to pump-and-dump schemes</li>
            <li>Minimal or no underlying utility</li>
            <li>Extreme volatility — 50%+ swings common</li>
            <li>Rug-pull risk in newer, unaudited coins</li>
            <li>High correlation with viral media cycles</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Community Signals</p>
          <h3>How to Track Momentum</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>Twitter/X mentions & trending hashtags</li>
            <li>Reddit activity on r/CryptoCurrency</li>
            <li>Whale wallet alerts & large transfers</li>
            <li>Exchange listing announcements</li>
            <li>Google Trends search volume spikes</li>
            <li>Influencer social media activity</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section style={{ marginTop: "48px", padding: "32px", backgroundColor: "rgba(162,120,65,0.08)", borderRadius: "8px", border: "1px solid rgba(162,120,65,0.2)", textAlign: "center" }}>
        <p className="eyebrow">Full Crypto Market</p>
        <h3>Explore All Cryptocurrencies</h3>
        <p style={{ color: "#475569", marginTop: "8px", marginBottom: "20px", maxWidth: "480px", margin: "8px auto 20px" }}>
          Compare meme coins against blue-chip assets, DeFi protocols, and layer-1 blockchains.
        </p>
        <Link to="/crypto" className="primary-action" style={{ textDecoration: "none" }}>
          View All Coins
        </Link>
      </section>
    </div>
  );
};

// ── Stablecoins ───────────────────────────────────────────────────────────────

const StablecoinsPage: React.FC = () => {
  const coins = cryptocurrencies.filter(c => c.category === "Stablecoin");
  const totalSupply = coins.reduce((s, c) => s + (c.circulatingSupply ?? 0), 0);
  const avgDev = 0.012;

  return (
    <div className="page intelligence-page">
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">Price Stability</p>
          <h1>Stablecoins</h1>
          <p>
            Cryptocurrencies pegged to fiat currencies or real-world assets, providing stability for trading,
            DeFi liquidity, cross-border payments, and hedging against market volatility.
          </p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>Stablecoins Listed</span>
            <strong>{coins.length}</strong>
          </div>
          <div className="metric-tile">
            <span>Total Supply</span>
            <strong>{fmt(totalSupply)}</strong>
          </div>
          <div className="metric-tile">
            <span>Avg Peg Deviation</span>
            <strong style={{ color: "#059669" }}>±{avgDev}%</strong>
          </div>
        </div>
      </section>

      {/* Coin Table */}
      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p className="eyebrow">Market Overview</p>
          <h2>Stablecoin Rankings</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", background: "rgba(162,120,65,0.05)" }}>
                {["#", "Name", "Price", "24h Change", "Peg Type", "Backing", "Market Cap", "24h Volume"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: h === "#" || h === "Name" ? "left" : "right", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b", whiteSpace: "nowrap" }}>
                    {h}
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
                            <strong style={{ display: "block", fontSize: "14px" }}>{coin.name}</strong>
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
                        <span style={{ display: "block", fontSize: "10px", color: "#059669", fontWeight: 600 }}>Peg ✓</span>
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
          <p className="eyebrow">How They Work</p>
          <h3>Peg Mechanisms</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li><strong>Fiat-backed</strong> — 1:1 reserves in USD (USDT, USDC)</li>
            <li><strong>Crypto-collateralised</strong> — Over-collateralised with ETH/RWA (DAI)</li>
            <li><strong>Algorithmic</strong> — Smart contract supply management</li>
            <li>Audits & attestations maintain trust</li>
            <li>Reserve transparency varies by issuer</li>
            <li>Redemption mechanisms protect the peg</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Regulation</p>
          <h3>Global Regulatory Landscape</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>EU MiCA framework — live since 2024</li>
            <li>US GENIUS Act — stablecoin reserve rules</li>
            <li>UK FCA stablecoin licensing regime</li>
            <li>Hong Kong HKMA licensing pilot</li>
            <li>Singapore MAS Payment Services Act</li>
            <li>FATF travel rule applies globally</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Use Cases</p>
          <h3>Why Stablecoins Matter</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>DeFi liquidity pools & yield farming</li>
            <li>Cross-border remittances at low cost</li>
            <li>Crypto trading pairs on all exchanges</li>
            <li>Hedging against volatile crypto assets</li>
            <li>On-chain payroll & business payments</li>
            <li>Collateral in lending protocols</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section style={{ marginTop: "48px", padding: "32px", backgroundColor: "rgba(162,120,65,0.08)", borderRadius: "8px", border: "1px solid rgba(162,120,65,0.2)", textAlign: "center" }}>
        <p className="eyebrow">Full Crypto Market</p>
        <h3>Explore All Cryptocurrencies</h3>
        <p style={{ color: "#475569", marginTop: "8px", marginBottom: "20px", maxWidth: "480px", margin: "8px auto 20px" }}>
          Compare stablecoins against volatile assets, DeFi protocols, and layer-1 blockchains.
        </p>
        <Link to="/crypto" className="primary-action" style={{ textDecoration: "none" }}>
          View All Coins
        </Link>
      </section>
    </div>
  );
};

// ── DeFi ─────────────────────────────────────────────────────────────────────

const DeFiPage: React.FC = () => {
  const coins = cryptocurrencies.filter(c => c.category === "DeFi");
  const totalTVL = 29.4e9;
  const totalMCap = Object.values(DEFI_PRICES).reduce((s, d) => s + d.marketCap, 0);
  const topGainer = Object.entries(DEFI_PRICES).reduce((a, b) => b[1].change > a[1].change ? b : a);

  return (
    <div className="page intelligence-page">
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">Decentralised Finance</p>
          <h1>DeFi Ecosystem</h1>
          <p>
            Open financial protocols built on blockchain — enabling permissionless lending, borrowing,
            trading, and yield generation without intermediaries.
          </p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>Protocols Listed</span>
            <strong>{coins.length}</strong>
          </div>
          <div className="metric-tile">
            <span>Total Value Locked</span>
            <strong>{fmt(totalTVL)}</strong>
          </div>
          <div className="metric-tile">
            <span>Top Gainer (24h)</span>
            <strong style={{ color: "#059669" }}>{topGainer[0]} +{topGainer[1].change.toFixed(2)}%</strong>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p className="eyebrow">Market Overview</p>
          <h2>DeFi Protocol Rankings</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", background: "rgba(162,120,65,0.05)" }}>
                {["#", "Protocol", "Price", "24h Change", "Type", "TVL", "Market Cap", "24h Volume"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: h === "#" || h === "Protocol" ? "left" : "right", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b", whiteSpace: "nowrap" }}>
                    {h}
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
                            <strong style={{ display: "block", fontSize: "14px" }}>{coin.name}</strong>
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
          <p className="eyebrow">Core Primitives</p>
          <h3>How DeFi Works</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li><strong>AMMs</strong> — Automated market makers replace order books</li>
            <li><strong>Lending</strong> — Overcollateralised loans via smart contracts</li>
            <li><strong>Yield farming</strong> — Earn rewards by providing liquidity</li>
            <li><strong>Governance</strong> — Token holders vote on protocol changes</li>
            <li><strong>Flash loans</strong> — Uncollateralised single-transaction loans</li>
            <li><strong>Derivatives</strong> — Synthetic assets and perpetual futures</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Risk Profile</p>
          <h3>DeFi-Specific Risks</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>Smart contract exploits & audit failures</li>
            <li>Oracle manipulation attacks</li>
            <li>Impermanent loss for liquidity providers</li>
            <li>Liquidation cascades in bear markets</li>
            <li>Governance token centralisation</li>
            <li>Regulatory scrutiny on unlicensed lending</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Key Metrics</p>
          <h3>What to Track</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>Total Value Locked (TVL) per protocol</li>
            <li>Protocol revenue & fee generation</li>
            <li>Active wallet addresses</li>
            <li>Liquidation volumes & health factors</li>
            <li>Token distribution & whale concentration</li>
            <li>Audit status & bug bounty coverage</li>
          </ul>
        </div>
      </section>

      <section style={{ marginTop: "48px", padding: "32px", backgroundColor: "rgba(162,120,65,0.08)", borderRadius: "8px", border: "1px solid rgba(162,120,65,0.2)", textAlign: "center" }}>
        <p className="eyebrow">Full Crypto Market</p>
        <h3>Explore All Cryptocurrencies</h3>
        <p style={{ color: "#475569", marginTop: "8px", marginBottom: "20px", maxWidth: "480px", margin: "8px auto 20px" }}>
          Compare DeFi protocols against layer-1 blockchains, stablecoins, and meme coins.
        </p>
        <Link to="/crypto" className="primary-action" style={{ textDecoration: "none" }}>View All Coins</Link>
      </section>
    </div>
  );
};

// ── Layer 1 ───────────────────────────────────────────────────────────────────

const Layer1Page: React.FC = () => {
  const coins = cryptocurrencies.filter(c => c.category === "Layer 1");
  const totalMCap = Object.values(LAYER1_PRICES).reduce((s, d) => s + d.marketCap, 0);
  const topGainer = Object.entries(LAYER1_PRICES).reduce((a, b) => b[1].change > a[1].change ? b : a);

  return (
    <div className="page intelligence-page">
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">Blockchain Infrastructure</p>
          <h1>Layer 1 Blockchains</h1>
          <p>
            The foundational settlement layers of the crypto ecosystem — independent blockchain networks
            competing on speed, security, decentralisation, and developer adoption.
          </p>
        </div>
        <div className="metric-strip">
          <div className="metric-tile">
            <span>Chains Listed</span>
            <strong>{coins.length}</strong>
          </div>
          <div className="metric-tile">
            <span>Combined Market Cap</span>
            <strong>{fmt(totalMCap)}</strong>
          </div>
          <div className="metric-tile">
            <span>Top Gainer (24h)</span>
            <strong style={{ color: "#059669" }}>{topGainer[0]} +{topGainer[1].change.toFixed(2)}%</strong>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "20px" }}>
          <p className="eyebrow">Market Overview</p>
          <h2>Layer 1 Rankings</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", background: "rgba(162,120,65,0.05)" }}>
                {["#", "Chain", "Price", "24h Change", "Consensus", "Max TPS", "Market Cap", "24h Volume"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: h === "#" || h === "Chain" ? "left" : "right", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#64748b", whiteSpace: "nowrap" }}>
                    {h}
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
                            <strong style={{ display: "block", fontSize: "14px" }}>{coin.name}</strong>
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
          <p className="eyebrow">The Trilemma</p>
          <h3>Security · Scalability · Decentralisation</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>Bitcoin prioritises security & decentralisation</li>
            <li>Solana prioritises speed & scalability</li>
            <li>Ethereum balances all three post-Merge</li>
            <li>PoW vs PoS energy trade-offs</li>
            <li>Validator count drives decentralisation</li>
            <li>Sharding & rollups extend base-layer capacity</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Developer Ecosystem</p>
          <h3>Where Builders Are Going</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>Ethereum — largest dApp & DeFi ecosystem</li>
            <li>Solana — high-frequency trading & gaming</li>
            <li>BNB Chain — retail DeFi & low-fee swaps</li>
            <li>Cosmos — IBC cross-chain interoperability</li>
            <li>Polkadot — parachain specialisation model</li>
            <li>TON — Telegram's 900M user base integration</li>
          </ul>
        </div>
        <div className="intelligence-panel">
          <p className="eyebrow">Investment Lens</p>
          <h3>What to Evaluate</h3>
          <ul style={{ fontSize: "14px", lineHeight: "1.8", color: "#475569", paddingLeft: "20px", marginTop: "12px" }}>
            <li>Active developer count & GitHub commits</li>
            <li>Daily active addresses & transaction volume</li>
            <li>Staking yield & validator economics</li>
            <li>Tokenomics — inflation rate & supply schedule</li>
            <li>Ecosystem TVL & dApp diversity</li>
            <li>Institutional custody & ETF availability</li>
          </ul>
        </div>
      </section>

      <section style={{ marginTop: "48px", padding: "32px", backgroundColor: "rgba(162,120,65,0.08)", borderRadius: "8px", border: "1px solid rgba(162,120,65,0.2)", textAlign: "center" }}>
        <p className="eyebrow">Full Crypto Market</p>
        <h3>Explore All Cryptocurrencies</h3>
        <p style={{ color: "#475569", marginTop: "8px", marginBottom: "20px", maxWidth: "480px", margin: "8px auto 20px" }}>
          Compare layer-1 blockchains against DeFi protocols, stablecoins, and meme coins.
        </p>
        <Link to="/crypto" className="primary-action" style={{ textDecoration: "none" }}>View All Coins</Link>
      </section>
    </div>
  );
};

export default CryptoCategoryPage;
