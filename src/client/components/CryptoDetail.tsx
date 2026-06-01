import React from "react";
import type { Cryptocurrency, CryptoPrice, TradingPair } from "../../types";
import { useI18n } from "../i18n";
import LineChart from "./LineChart";
import ChartJSLine from "./ChartJSLine";
import {
  formatCompactUsd,
  formatPercent,
  formatPrice,
  formatSupply,
  formatUsd,
  toNumber,
} from "../lib/format";

interface CryptoDetailProps {
  crypto: Cryptocurrency;
  priceData?: CryptoPrice | null;
  tradingPairs?: TradingPair[];
  exchangeListings?: Array<{ exchange: string; totalVolume: number }>;
  news?: Array<{
    id?: number | string;
    title?: string;
    description?: string;
    source?: string;
    publishedAt?: string;
    url?: string;
  }>;
  isLoading?: boolean;
}

const safePrice = (data?: CryptoPrice | null): number =>
  typeof data?.price === "number" ? data.price : toNumber(data?.price);

const DetailSkeleton: React.FC = () => (
  <div style={{ minHeight: "100vh", padding: "24px", backgroundColor: "#ffffff" }}>
    <div style={{ height: 120, marginBottom: 16, backgroundColor: "#f0f0f0", borderRadius: "8px" }} />
    <div style={{ height: 40, marginBottom: 24, backgroundColor: "#f0f0f0", borderRadius: "8px" }} />
    <div style={{ height: 280, backgroundColor: "#f0f0f0", borderRadius: "8px" }} />
  </div>
);

const CryptoDetail: React.FC<CryptoDetailProps> = ({
  crypto,
  priceData,
  tradingPairs = [],
  exchangeListings = [],
  news = [],
  isLoading = false,
}) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "price" | "pairs" | "exchanges" | "charts" | "on-chain" | "news"
  >("price");
  const [imageError, setImageError] = React.useState(false);

  const price = safePrice(priceData);
  const changePct = toNumber(priceData?.changePercent24h);
  const change24h = toNumber(priceData?.change24h);

  const chartSeries = React.useMemo(() => {
    const base = price > 0 ? price : 100;
    const series: number[] = [];
    let value = base;
    for (let i = 0; i < 50; i++) {
      const delta = (Math.random() - 0.5) * base * 0.03;
      value = Math.max(0, value + delta);
      series.push(Number(value.toFixed(2)));
    }
    return series;
  }, [price]);

  if (isLoading && !priceData) {
    return <DetailSkeleton />;
  }

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", paddingTop: "24px" }}>
      {/* Modern Header */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "32px" }}>
          {/* Crypto Symbol Badge */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #A27841 0%, #c89b5e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: 700,
              color: "#ffffff",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(162, 120, 65, 0.3)",
            }}
          >
            {crypto.logo && !imageError ? (
              <img
                src={crypto.logo}
                alt={crypto.name}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "16px",
                  objectFit: "cover",
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              crypto.symbol.charAt(0).toUpperCase()
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "8px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0", color: "#0f172a" }}>
                {crypto.symbol}
              </h1>
              <p style={{ fontSize: "13px", color: "#7a8c99", margin: "4px 0 0 0", fontWeight: 500 }}>
                {crypto.name} • Rank #{priceData?.rank || "—"}
              </p>
            </div>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.5", margin: "12px 0 0 0", maxWidth: "500px" }}>
              {crypto.description}
            </p>

            {/* Price & Key Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginTop: "20px" }}>
              <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <p style={{ fontSize: "11px", color: "#7a8c99", margin: "0 0 6px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Price
                </p>
                <p style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: "0" }}>
                  {formatUsd(price)}
                </p>
              </div>
              <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <p style={{ fontSize: "11px", color: "#7a8c99", margin: "0 0 6px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  24h Change
                </p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: changePct >= 0 ? "#059669" : "#dc2626", margin: "0" }}>
                  {changePct >= 0 ? "+" : ""}{formatPercent(changePct)}
                </p>
              </div>
              <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <p style={{ fontSize: "11px", color: "#7a8c99", margin: "0 0 6px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Market Cap
                </p>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#A27841", margin: "0" }}>
                  {formatCompactUsd(priceData?.marketCap || 0)}
                </p>
              </div>
              <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <p style={{ fontSize: "11px", color: "#7a8c99", margin: "0 0 6px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  24h Volume
                </p>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: "0" }}>
                  {formatCompactUsd(priceData?.volume24h || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "2px", borderBottom: "1px solid #e2e8f0", paddingBottom: "0", overflowX: "auto" }}>
          {[
            { id: "price", label: "💰 Price & Metrics" },
            { id: "charts", label: "📊 Charts" },
            { id: "pairs", label: "🔀 Trading Pairs" },
            { id: "exchanges", label: "🏪 Exchanges" },
            { id: "overview", label: "ℹ️ Overview" },
            { id: "on-chain", label: "⛓️ On-Chain" },
            { id: "news", label: "📰 News" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "14px 20px",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? "#A27841" : "#7a8c99",
                borderBottom: activeTab === tab.id ? "2px solid #A27841" : "none",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", paddingBottom: "60px" }}>
        {activeTab === "price" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {[
              { label: "Current Price", value: formatUsd(price), color: "#A27841" },
              { label: "24h Change", value: formatPercent(changePct), color: changePct >= 0 ? "#059669" : "#dc2626" },
              { label: "Market Cap", value: formatCompactUsd(priceData?.marketCap || 0), color: "#0f172a" },
              { label: "24h Volume", value: formatCompactUsd(priceData?.volume24h || 0), color: "#0f172a" },
              { label: "All-Time High", value: formatUsd(priceData?.ath || 0), color: "#0f172a" },
              { label: "All-Time Low", value: formatUsd(priceData?.atl || 0), color: "#0f172a" },
              { label: "Circulating Supply", value: formatSupply(priceData?.circulatingSupply || 0), color: "#0f172a" },
              { label: "Market Rank", value: `#${priceData?.rank || "—"}`, color: "#0f172a" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "20px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  backgroundColor: "#fafbfc",
                }}
              >
                <p style={{ fontSize: "12px", color: "#7a8c99", margin: "0 0 8px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: "20px", fontWeight: 700, color: item.color, margin: "0" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "charts" && (
          <div style={{ backgroundColor: "#fafbfc", padding: "24px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
            <p style={{ fontSize: "12px", color: "#7a8c99", margin: "0 0 16px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Price Chart
            </p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
              {["1H", "24H", "7D", "1M", "1Y", "ALL"].map((tf) => (
                <button
                  key={tf}
                  style={{
                    padding: "8px 16px",
                    border: tf === "7D" ? "2px solid #A27841" : "1px solid #e2e8f0",
                    borderRadius: "6px",
                    backgroundColor: tf === "7D" ? "rgba(162, 120, 65, 0.1)" : "#ffffff",
                    color: tf === "7D" ? "#A27841" : "#7a8c99",
                    fontSize: "12px",
                    fontWeight: tf === "7D" ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
            <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px", minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {priceData && price > 0 ? (
                (window as Window & { Chart?: unknown }).Chart ? (
                  <ChartJSLine data={chartSeries} width={820} height={300} />
                ) : (
                  <LineChart data={chartSeries} width={820} height={300} />
                )
              ) : (
                <p style={{ color: "#7a8c99", fontSize: "14px" }}>Loading chart...</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {[
              { label: "Symbol", value: crypto.symbol },
              { label: "Category", value: crypto.category },
              { label: "Founded", value: crypto.launched },
              { label: "Founder", value: crypto.founder },
              { label: "Consensus Mechanism", value: crypto.consensusMechanism },
              { label: "Block Time", value: crypto.blockTime ? `${crypto.blockTime} seconds` : "—" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "20px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  backgroundColor: "#fafbfc",
                }}
              >
                <p style={{ fontSize: "12px", color: "#7a8c99", margin: "0 0 8px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", margin: "0" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "pairs" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                  <th style={{ padding: "14px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#7a8c99", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pair</th>
                  <th style={{ padding: "14px", textAlign: "right", fontSize: "12px", fontWeight: 600, color: "#7a8c99", textTransform: "uppercase", letterSpacing: "0.5px" }}>Price</th>
                  <th style={{ padding: "14px", textAlign: "right", fontSize: "12px", fontWeight: 600, color: "#7a8c99", textTransform: "uppercase", letterSpacing: "0.5px" }}>24h Volume</th>
                  <th style={{ padding: "14px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#7a8c99", textTransform: "uppercase", letterSpacing: "0.5px" }}>Exchange</th>
                </tr>
              </thead>
              <tbody>
                {tradingPairs.slice(0, 10).map((pair, idx) => (
                  <tr
                    key={`${pair.pair}-${pair.exchange}`}
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                      backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                  >
                    <td style={{ padding: "14px", fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{pair.pair}</td>
                    <td style={{ padding: "14px", textAlign: "right", fontSize: "14px", fontWeight: 600, color: "#A27841" }}>{formatUsd(pair.price)}</td>
                    <td style={{ padding: "14px", textAlign: "right", fontSize: "13px", color: "#475569" }}>{formatCompactUsd(pair.volume24h)}</td>
                    <td style={{ padding: "14px", fontSize: "13px", fontWeight: 600, color: "#475569" }}>{pair.exchange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "exchanges" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {exchangeListings.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", gridColumn: "1 / -1" }}>
                <p style={{ fontSize: "14px", color: "#7a8c99", margin: "0" }}>
                  Exchange listings for {crypto.symbol} coming soon
                </p>
              </div>
            ) : (
              exchangeListings.map((ex, i) => (
                <div
                  key={ex.exchange}
                  style={{
                    padding: "20px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    backgroundColor: "#fafbfc",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "18px", fontWeight: 700, color: "#A27841" }}>#{i + 1}</span>
                    <strong style={{ fontSize: "15px", color: "#0f172a" }}>{ex.exchange}</strong>
                  </div>
                  <p style={{ fontSize: "12px", color: "#7a8c99", margin: "0" }}>
                    Volume: <strong style={{ color: "#0f172a" }}>{formatCompactUsd(ex.totalVolume)}</strong>
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "on-chain" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {[
              { label: "Transactions Per Day", value: crypto.id === "bitcoin" ? "450K" : crypto.id === "ethereum" ? "1.1M" : "—" },
              { label: "Active Addresses", value: crypto.id === "bitcoin" ? "1.2M" : crypto.id === "ethereum" ? "580K" : "—" },
              { label: "Network Fees Avg", value: crypto.id === "bitcoin" ? "$2.1" : crypto.id === "ethereum" ? "$4.8" : "—" },
              { label: "Circulating Supply", value: crypto.circulatingSupply ? `${formatSupply(crypto.circulatingSupply)} ${crypto.symbol}` : "—" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "20px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  backgroundColor: "#fafbfc",
                }}
              >
                <p style={{ fontSize: "12px", color: "#7a8c99", margin: "0 0 8px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: "0" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "news" && (
          <div>
            {news.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <p style={{ fontSize: "14px", color: "#7a8c99", margin: "0" }}>
                  No news available for {crypto.symbol}
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {news.map((article) => (
                  <div
                    key={article.id ?? article.url}
                    style={{
                      padding: "16px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      backgroundColor: "#fafbfc",
                    }}
                  >
                    <div style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", color: "#7a8c99", fontWeight: 600 }}>
                        {article.source}
                      </span>
                      <span style={{ fontSize: "11px", color: "#ccc" }}>•</span>
                      <span style={{ fontSize: "11px", color: "#7a8c99" }}>
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <h4 style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", margin: "0 0 6px 0" }}>
                      {article.title}
                    </h4>
                    {article.description && (
                      <p style={{ fontSize: "13px", color: "#475569", margin: "0", lineHeight: "1.4" }}>
                        {article.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CryptoDetail);
