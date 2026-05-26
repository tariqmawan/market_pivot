import React from "react";
import type { Currency, CurrencyPair } from "../../types";
import { useI18n } from "../i18n";

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
  const { t } = useI18n();
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "rates" | "converter" | "pairs" | "economic" | "news"
  >("overview");
  const [convertAmount, setConvertAmount] = React.useState<string>("1");
  const [convertTo, setConvertTo] = React.useState<string>("USD");

  return (
    <div className="currency-detail">
      {/* 1. Currency Overview Header */}
      <section className="overview-header">
        <div className="currency-info">
          <div className="currency-header">
            <img src={currency.logo} alt={currency.name} className="logo" />
            <div className="info">
              <h1>{currency.name}</h1>
              <p className="code">{currency.symbol} ({currency.code})</p>
              <p className="country">
                {currency.country} • {currency.region}
              </p>
              <p className="description">{currency.description}</p>
            </div>
          </div>

          <div className="key-metrics">
            <div className="metric">
              <label>{t("currencyType")}</label>
              <p className="value">{currency.type}</p>
            </div>
            <div className="metric">
              <label>{t("centralBank")}</label>
              <p className="value">{currency.centralBank}</p>
            </div>
            {exchangeRates["USD"] && (
              <div className="metric">
                <label>vs USD</label>
                <p className="value">1 {currency.code} = {exchangeRates["USD"].toFixed(4)} USD</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="tab-navigation">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          {t("overview")}
        </button>
        <button
          className={`tab ${activeTab === "rates" ? "active" : ""}`}
          onClick={() => setActiveTab("rates")}
        >
          {t("exchangeRates")}
        </button>
        <button
          className={`tab ${activeTab === "converter" ? "active" : ""}`}
          onClick={() => setActiveTab("converter")}
        >
          {t("converter")}
        </button>
        <button
          className={`tab ${activeTab === "pairs" ? "active" : ""}`}
          onClick={() => setActiveTab("pairs")}
        >
          {t("popularPairs")}
        </button>
        <button
          className={`tab ${activeTab === "economic" ? "active" : ""}`}
          onClick={() => setActiveTab("economic")}
        >
          {t("economicData")}
        </button>
        <button
          className={`tab ${activeTab === "news" ? "active" : ""}`}
          onClick={() => setActiveTab("news")}
        >
          {t("news")}
        </button>
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <section className="overview-section">
            <div className="info-grid">
              <div className="info-card">
                <h4>{t("code")}</h4>
                <p>{currency.code}</p>
              </div>
              <div className="info-card">
                <h4>{t("symbol")}</h4>
                <p>{currency.symbol}</p>
              </div>
              <div className="info-card">
                <h4>{t("country")}</h4>
                <p>{currency.country}</p>
              </div>
              <div className="info-card">
                <h4>{t("region")}</h4>
                <p>{currency.region}</p>
              </div>
              <div className="info-card">
                <h4>{t("type")}</h4>
                <p>{currency.type}</p>
              </div>
              <div className="info-card">
                <h4>{t("centralBank")}</h4>
                <p>{currency.centralBank}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "rates" && (
          <section className="rates-section">
            <h3>{t("exchangeRates")}</h3>
            <div className="rates-table">
              <table>
                <thead>
                  <tr>
                    <th>{t("currencies")}</th>
                    <th>{t("rate")}</th>
                    <th>{t("bid")}</th>
                    <th>{t("ask")}</th>
                    <th>{t("spread")}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(exchangeRates).map(([code, rate]) => (
                    <tr key={code}>
                      <td>{code}</td>
                      <td>{rate.toFixed(4)}</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {Object.keys(exchangeRates).length === 0 && (
                <p className="placeholder">{t("loadingRates")}</p>
              )}
            </div>
          </section>
        )}

        {activeTab === "converter" && (
          <section className="converter-section">
            <h3>{t("converter")}</h3>
            <div className="converter-box">
              <div className="converter-input-group">
                <label>{t("from")}</label>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  placeholder={t("amountPlaceholder")}
                />
                <span className="currency-code">{currency.code}</span>
              </div>

              <div className="converter-operator">
                <span>→</span>
              </div>

              <div className="converter-input-group">
                <label>{t("to")}</label>
                <select
                  value={convertTo}
                  onChange={(e) => setConvertTo(e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="AUD">AUD</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>

            <div className="converter-result">
              <p className="result-text">
                1 {currency.code} = {exchangeRates[convertTo]?.toFixed(4) || "0.0000"}{" "}
                {convertTo}
              </p>
              <p className="amount-text">
                {convertAmount} {currency.code} = {((parseFloat(convertAmount) * (exchangeRates[convertTo] || 0))).toFixed(2)} {convertTo}
              </p>
            </div>
          </section>
        )}

        {activeTab === "pairs" && (
          <section className="pairs-section">
            <h3>{t("popularPairs")}</h3>
            <div className="pairs-list">
              {popularPairs.length === 0 ? (
                <p className="placeholder">{t("loadingPairs")}</p>
              ) : (
                popularPairs.map((pair) => (
                  <div key={pair.pair} className="pair-card">
                    <div className="pair-header">
                      <h4>{pair.pair}</h4>
                      <span className="rate">{pair.rate.toFixed(4)}</span>
                    </div>
                    <div className="pair-details">
                      <div className="detail">
                        <label>{t("change24h")}</label>
                        <span
                          className={`value ${pair.change24h >= 0 ? "positive" : "negative"}`}
                        >
                          {pair.change24h >= 0 ? "+" : ""}{pair.change24h.toFixed(2)}%
                        </span>
                      </div>
                      <div className="detail">
                        <label>52w High</label>
                        <span className="value">{pair.high52w.toFixed(4)}</span>
                      </div>
                      <div className="detail">
                        <label>52w Low</label>
                        <span className="value">{pair.low52w.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {activeTab === "economic" && (
          <section className="economic-section">
            <h3>{t("economicIndicators")}</h3>
            <div className="economic-indicators">
              <div className="indicator-card">
                <h4>{t("interestRate")}</h4>
                <p className="value">
                  {economicData?.interestRate != null
                    ? `${economicData.interestRate}%`
                    : "-"}
                </p>
                <p className="last-updated">
                  {economicData?.lastUpdated
                    ? new Date(economicData.lastUpdated).toLocaleDateString()
                    : t("dataLoading")}
                </p>
              </div>
              <div className="indicator-card">
                <h4>{t("inflationRate")}</h4>
                <p className="value">
                  {economicData?.inflationRate != null
                    ? `${economicData.inflationRate}%`
                    : "-"}
                </p>
                <p className="last-updated">{t("annualRate")}</p>
              </div>
              <div className="indicator-card">
                <h4>{t("gdpGrowth")}</h4>
                <p className="value">
                  {economicData?.gdpGrowth != null
                    ? `${economicData.gdpGrowth}%`
                    : "-"}
                </p>
                <p className="last-updated">{t("quarterlyRate")}</p>
              </div>
              <div className="indicator-card">
                <h4>{t("centralBank")}</h4>
                <p className="value" style={{ fontSize: "0.85em" }}>
                  {currency.centralBank ?? "-"}
                </p>
                <p className="last-updated">{currency.country}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "news" && (
          <section className="news-section">
            <h3>{t("economicNews")}</h3>
            {news.length === 0 ? (
              <div className="news-placeholder">
                <p>{t("currencyNewsComing")} ({currency.code})</p>
                <p className="subtitle">{t("currencyNewsSubtitle")}</p>
              </div>
            ) : (
              <div className="news-list">
                {news.map((article: any) => (
                  <div key={article.id ?? article.url} className="news-card">
                    <div className="news-meta">
                      <span className="news-source">{article.source}</span>
                      <span className="news-date">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                    <h4 className="news-title">{article.title}</h4>
                    {article.description && (
                      <p className="news-desc">{article.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default CurrencyDetail;
