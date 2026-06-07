import React from "react";
import type { Currency, CurrencyPair } from "../../types";
import { useI18n } from "../i18n";
import { translateStatic } from "../i18n/translate";



interface CurrencyDetailProps {
  currency: Currency;
  exchangeRates?: Record<string, number>;
  popularPairs?: CurrencyPair[];
  economicData?: {
    interestRate?: number;
    inflationRate?: number;
    gdpGrowth?: number;
    lastUpdated?: string;
  } | null;
  news?: any[];
  isLoading?: boolean;
}

const CurrencyDetail: React.FC<CurrencyDetailProps> = ({
  currency,
  exchangeRates = {},
  popularPairs = [],
  economicData = null,
  news = [],
  isLoading = false,
}) => {
  const { t: _t } = useI18n();
  const t = _t as (key: string) => string | undefined;
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "rates" | "converter" | "pairs" | "economic" | "news"
  >("overview");
  const [convertAmount, setConvertAmount] = React.useState<string>("1");
  const [convertTo, setConvertTo] = React.useState<string>("USD");
  const [imageError, setImageError] = React.useState(false);
  const currencyName = translateStatic(t, currency.nameKey, currency.name);
  const currencyCountry = translateStatic(t, currency.countryKey, currency.country);
  const currencyDescription = translateStatic(t, currency.descriptionKey, currency.description);
  const currencyType = translateStatic(t, `forex.currencyTypes.${currency.type}`, currency.type);
  const currencyRegion = translateStatic(
    t,
    `forex.regions.${currency.region.toLowerCase().replace(/[^a-z0-9]+/g, "")}`,
    currency.region
  );
  const currencyCentralBank = translateStatic(
    t,
    `forex.centralBanks.${currency.centralBank.toLowerCase().replace(/[^a-z0-9]+/g, "")}`,
    currency.centralBank
  );

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh", paddingTop: "24px" }}>
      {/* Modern Header */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "32px" }}>
          {/* Currency Symbol/Badge */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "12px",
              backgroundColor: "#A27841",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 700,
              color: "#ffffff",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(162, 120, 65, 0.2)",
            }}
          >
            {currency.logo && !imageError ? (
              <img
                src={currency.logo}
                alt={currencyName}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "12px",
                  objectFit: "cover",
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              currency.symbol.charAt(0).toUpperCase()
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: "8px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0", color: "#0f172a" }}>
                {currencyName}
              </h1>
              <p style={{ fontSize: "13px", color: "#7a8c99", margin: "4px 0 0 0", fontWeight: 500 }}>
                {currency.code} • {currencyCountry}
              </p>
            </div>
            <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.5", margin: "12px 0 0 0", maxWidth: "500px" }}>
              {currencyDescription}
            </p>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginTop: "20px" }}>
              <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <p style={{ fontSize: "11px", color: "#7a8c99", margin: "0 0 6px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {t("forex:symbol")}
                </p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a", margin: "0" }}>
                  {currency.symbol}
                </p>
              </div>
              <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <p style={{ fontSize: "11px", color: "#7a8c99", margin: "0 0 6px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {t("forex:currencyType") ?? t("forex:type")}
                </p>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#0f172a", margin: "0" }}>
                  {currencyType}
                </p>
              </div>
              <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                <p style={{ fontSize: "11px", color: "#7a8c99", margin: "0 0 6px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {t("forex:centralBank")}
                </p>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", margin: "0" }}>
                  {currencyCentralBank}
                </p>
              </div>
              {exchangeRates["USD"] && (
                <div style={{ padding: "12px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                  <p style={{ fontSize: "11px", color: "#7a8c99", margin: "0 0 6px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {t("forex:vsUsd")}
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: 700, color: "#A27841", margin: "0" }}>
                    {exchangeRates["USD"].toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "2px", borderBottom: "1px solid #e2e8f0", paddingBottom: "0" }}>
          {[
            { id: "overview", label: t("markets:overview") },
            { id: "rates", label: t("forex:exchangeRates") },
            { id: "converter", label: t("forex:converter") },
            { id: "pairs", label: t("forex:popularPairs") },
            { id: "economic", label: t("forex:economicIndicators") },
            { id: "news", label: t("markets:news") },
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
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", paddingBottom: "60px" }}>
        {activeTab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            {[
              { label: t("forex:code"), value: currency.code },
              { label: t("forex:symbol"), value: currency.symbol },
              { label: t("forex:country"), value: currencyCountry },
              { label: t("forex:region"), value: currencyRegion },
              { label: t("forex:currencyType") ?? t("forex:type"), value: currencyType },
              { label: t("forex:centralBank"), value: currencyCentralBank },
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

        {activeTab === "rates" && (
          <div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                    <th style={{ padding: "14px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#7a8c99", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t("currencydetail.h0")}</th>
                    <th style={{ padding: "14px", textAlign: "right", fontSize: "12px", fontWeight: 600, color: "#7a8c99", textTransform: "uppercase", letterSpacing: "0.5px" }}>{t("currencydetail.h1")}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(exchangeRates).map(([code, rate], idx) => (
                    <tr
                      key={code}
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                      }}
                    >
                      <td style={{ padding: "14px", fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>{code}</td>
                      <td style={{ padding: "14px", textAlign: "right", fontSize: "14px", fontWeight: 600, color: "#A27841" }}>
                        {rate.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "converter" && (
          <div style={{ maxWidth: "600px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "16px", alignItems: "flex-end", marginBottom: "32px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#7a8c99", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {t("common:from")}
                </label>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                />
                <p style={{ fontSize: "11px", color: "#7a8c99", margin: "8px 0 0 0" }}>{currency.code}</p>
              </div>
              <div style={{ fontSize: "18px", color: "#7a8c99", paddingBottom: "2px" }}>→</div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#7a8c99", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {t("common:to")}
                </label>
                <select
                  value={convertTo}
                  onChange={(e) => setConvertTo(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                    backgroundColor: "#ffffff",
                  }}
                >
                  {["USD", "EUR", "GBP", "JPY", "INR", "AUD"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <p style={{ fontSize: "12px", color: "#7a8c99", margin: "0 0 8px 0", fontWeight: 600 }}>{t("currencydetail.h2")}</p>
              <p style={{ fontSize: "24px", fontWeight: 700, color: "#0f172a", margin: "0" }}>
                {convertAmount} {currency.code} = <span style={{ color: "#A27841" }}>
                  {((parseFloat(convertAmount) * (exchangeRates[convertTo] || 0))).toFixed(2)} {convertTo}
                </span>
              </p>
              <p style={{ fontSize: "12px", color: "#7a8c99", margin: "8px 0 0 0" }}>
                1 {currency.code} = {exchangeRates[convertTo]?.toFixed(4) || "0.0000"} {convertTo}
              </p>
            </div>
          </div>
        )}

        {activeTab === "pairs" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
            {popularPairs.length === 0 ? (
              <p style={{ fontSize: "14px", color: "#7a8c99" }}>{t("currencydetail.h3")}</p>
            ) : (
              popularPairs.map((pair) => (
                <div
                  key={pair.pair}
                  style={{
                    padding: "20px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    backgroundColor: "#fafbfc",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", margin: "0" }}>
                      {pair.pair}
                    </h4>
                    <p style={{ fontSize: "18px", fontWeight: 700, color: "#A27841", margin: "0" }}>
                      {pair.rate.toFixed(4)}
                    </p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    <div>
                      <p style={{ fontSize: "11px", color: "#7a8c99", margin: "0 0 4px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t("currencydetail.h4")}</p>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: pair.change24h >= 0 ? "#059669" : "#dc2626", margin: "0" }}>
                        {pair.change24h >= 0 ? "+" : ""}{pair.change24h.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: "11px", color: "#7a8c99", margin: "0 0 4px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t("currencydetail.h5")}</p>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", margin: "0" }}>
                        {pair.high52w.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: "11px", color: "#7a8c99", margin: "0 0 4px 0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t("currencydetail.h6")}</p>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a", margin: "0" }}>
                        {pair.low52w.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "economic" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            {[
              { label: t("forex:interestRate"), value: economicData?.interestRate ? `${economicData.interestRate}%` : "-" },
              { label: t("forex:inflationRate"), value: economicData?.inflationRate ? `${economicData.inflationRate}%` : "-" },
              { label: t("forex:gdpGrowth"), value: economicData?.gdpGrowth ? `${economicData.gdpGrowth}%` : "-" },
              { label: t("forex:centralBank"), value: currencyCentralBank },
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
                <p style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: "0" }}>
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
                  {t("markets:noNewsAvailable")} {currency.code}
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "12px" }}>
                {news.map((article: any) => (
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

export default CurrencyDetail;
