import React from "react";
import type { Currency, CurrencyPair } from "../../types";

interface CurrencyDetailProps {
  currency: Currency;
  exchangeRates?: Record<string, number>;
  popularPairs?: CurrencyPair[];
  isLoading?: boolean;
}

const CurrencyDetail: React.FC<CurrencyDetailProps> = ({
  currency,
  exchangeRates = {},
  popularPairs = [],
  isLoading = false,
}) => {
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
              <label>Currency Type</label>
              <p className="value">{currency.type}</p>
            </div>
            <div className="metric">
              <label>Central Bank</label>
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
          Overview
        </button>
        <button
          className={`tab ${activeTab === "rates" ? "active" : ""}`}
          onClick={() => setActiveTab("rates")}
        >
          Exchange Rates
        </button>
        <button
          className={`tab ${activeTab === "converter" ? "active" : ""}`}
          onClick={() => setActiveTab("converter")}
        >
          Converter
        </button>
        <button
          className={`tab ${activeTab === "pairs" ? "active" : ""}`}
          onClick={() => setActiveTab("pairs")}
        >
          Popular Pairs
        </button>
        <button
          className={`tab ${activeTab === "economic" ? "active" : ""}`}
          onClick={() => setActiveTab("economic")}
        >
          Economic Data
        </button>
        <button
          className={`tab ${activeTab === "news" ? "active" : ""}`}
          onClick={() => setActiveTab("news")}
        >
          News
        </button>
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <section className="overview-section">
            <div className="info-grid">
              <div className="info-card">
                <h4>Currency Code</h4>
                <p>{currency.code}</p>
              </div>
              <div className="info-card">
                <h4>Symbol</h4>
                <p>{currency.symbol}</p>
              </div>
              <div className="info-card">
                <h4>Country</h4>
                <p>{currency.country}</p>
              </div>
              <div className="info-card">
                <h4>Region</h4>
                <p>{currency.region}</p>
              </div>
              <div className="info-card">
                <h4>Type</h4>
                <p>{currency.type}</p>
              </div>
              <div className="info-card">
                <h4>Central Bank</h4>
                <p>{currency.centralBank}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "rates" && (
          <section className="rates-section">
            <h3>Exchange Rates</h3>
            <div className="rates-table">
              <table>
                <thead>
                  <tr>
                    <th>Currency</th>
                    <th>Rate</th>
                    <th>Bid</th>
                    <th>Ask</th>
                    <th>Spread</th>
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
                <p className="placeholder">Loading exchange rates...</p>
              )}
            </div>
          </section>
        )}

        {activeTab === "converter" && (
          <section className="converter-section">
            <h3>Currency Converter</h3>
            <div className="converter-box">
              <div className="converter-input-group">
                <label>From</label>
                <input
                  type="number"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  placeholder="Enter amount"
                />
                <span className="currency-code">{currency.code}</span>
              </div>

              <div className="converter-operator">
                <span>→</span>
              </div>

              <div className="converter-input-group">
                <label>To</label>
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
            <h3>Popular Currency Pairs</h3>
            <div className="pairs-list">
              {popularPairs.length === 0 ? (
                <p className="placeholder">Loading popular pairs...</p>
              ) : (
                popularPairs.map((pair) => (
                  <div key={pair.pair} className="pair-card">
                    <div className="pair-header">
                      <h4>{pair.pair}</h4>
                      <span className="rate">{pair.rate.toFixed(4)}</span>
                    </div>
                    <div className="pair-details">
                      <div className="detail">
                        <label>24h Change</label>
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
            <h3>Economic Indicators</h3>
            <div className="economic-indicators">
              <div className="indicator-card">
                <h4>Interest Rate</h4>
                <p className="value">-</p>
                <p className="last-updated">Data loading...</p>
              </div>
              <div className="indicator-card">
                <h4>Inflation Rate</h4>
                <p className="value">-</p>
                <p className="last-updated">Data loading...</p>
              </div>
              <div className="indicator-card">
                <h4>GDP Growth</h4>
                <p className="value">-</p>
                <p className="last-updated">Data loading...</p>
              </div>
              <div className="indicator-card">
                <h4>Employment</h4>
                <p className="value">-</p>
                <p className="last-updated">Data loading...</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "news" && (
          <section className="news-section">
            <h3>Economic News & Updates</h3>
            <div className="news-placeholder">
              <p>📰 Latest economic news for {currency.code} will display here</p>
              <p className="subtitle">Interest rate decisions, inflation reports, and more</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CurrencyDetail;
