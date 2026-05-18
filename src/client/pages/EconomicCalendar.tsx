import React from "react";

type Impact = "High" | "Medium" | "Low";
type DateRange = "Today" | "Tomorrow" | "This Week";

interface EconomicEvent {
  time: string;
  country: string;
  impact: Impact;
  title: string;
  forecast: string;
  previous: string;
  actual?: string;
  date: DateRange;
}

const events: EconomicEvent[] = [
  { time: "08:30", country: "US", impact: "High", title: "CPI m/m", forecast: "0.3%", previous: "0.1%", actual: "0.4%", date: "Today" },
  { time: "10:00", country: "EU", impact: "Medium", title: "Retail Sales", forecast: "-0.2%", previous: "0.4%", actual: "-0.1%", date: "Today" },
  { time: "12:15", country: "India", impact: "Medium", title: "Industrial Production", forecast: "4.1%", previous: "3.8%", actual: "4.4%", date: "Today" },
  { time: "13:30", country: "UK", impact: "Low", title: "GDP q/q", forecast: "0.1%", previous: "0.0%", actual: "0.2%", date: "Tomorrow" },
  { time: "15:00", country: "Japan", impact: "High", title: "BoJ Rate Decision", forecast: "Unchanged", previous: "Unchanged", actual: "Pending", date: "This Week" },
  { time: "18:00", country: "US", impact: "High", title: "FOMC Minutes", forecast: "Hawkish", previous: "Neutral", actual: "Pending", date: "This Week" },
];

const countries = ["All", "US", "EU", "UK", "Japan", "India"];
const impacts: Array<Impact | "All"> = ["All", "High", "Medium", "Low"];
const dateRanges: DateRange[] = ["Today", "Tomorrow", "This Week"];

const EconomicCalendar: React.FC = () => {
  const [country, setCountry] = React.useState("All");
  const [impact, setImpact] = React.useState<Impact | "All">("All");
  const [dateRange, setDateRange] = React.useState<DateRange>("Today");

  const filtered = events.filter((event) => {
    const countryOk = country === "All" || event.country === country;
    const impactOk = impact === "All" || event.impact === impact;
    const dateOk = event.date === dateRange;
    return countryOk && impactOk && dateOk;
  });

  const highImpactCount = filtered.filter((event) => event.impact === "High").length;

  return (
    <div className="page tool-page economic-calendar-page">
      <section className="tool-hero calendar-hero">
        <div>
          <p className="eyebrow">Economic Calendar</p>
          <h1>Plan around market-moving macro events.</h1>
          <p>
            Track central banks, inflation releases, growth data, and policy events with a cleaner
            timeline built for fast scanning.
          </p>
        </div>
        <div className="tool-hero-panel">
          <span>High Impact</span>
          <strong>{highImpactCount}</strong>
          <em>{dateRange}</em>
        </div>
      </section>

      <section className="tool-metric-grid">
        {[
          ["Events", String(filtered.length), "In current view"],
          ["Regions", "5", "US, EU, UK, Japan, India"],
          ["Next", filtered[0]?.time ?? "--", filtered[0]?.title ?? "No events"],
          ["Risk", highImpactCount ? "Elevated" : "Quiet", "Macro volatility"],
        ].map(([label, value, meta]) => (
          <div className="tool-metric" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <em>{meta}</em>
          </div>
        ))}
      </section>

      <section className="calendar-shell">
        <aside className="tool-filter-card">
          <div className="tool-card-head">
            <div>
              <p className="eyebrow">Filters</p>
              <h2>Calendar view</h2>
            </div>
          </div>

          <div className="tool-segmented vertical" aria-label="Date range">
            {dateRanges.map((range) => (
              <button
                type="button"
                key={range}
                className={dateRange === range ? "active" : ""}
                onClick={() => setDateRange(range)}
              >
                {range}
              </button>
            ))}
          </div>

          <label className="tool-field">
            <span>Country</span>
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Countries" : item}
                </option>
              ))}
            </select>
          </label>

          <label className="tool-field">
            <span>Impact</span>
            <select value={impact} onChange={(e) => setImpact(e.target.value as Impact | "All")}>
              {impacts.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Impact" : item}
                </option>
              ))}
            </select>
          </label>
        </aside>

        <section className="calendar-timeline-card">
          <div className="tool-card-head">
            <div>
              <p className="eyebrow">Timeline</p>
              <h2>{dateRange}</h2>
            </div>
            <span className="tool-live-chip">Local time</span>
          </div>

          <div className="calendar-timeline">
            {filtered.length > 0 ? (
              filtered.map((event) => (
                <article className="calendar-event" key={`${event.time}-${event.title}`}>
                  <div className="calendar-time">
                    <strong>{event.time}</strong>
                    <span>{event.country}</span>
                  </div>
                  <div className="calendar-dot" />
                  <div className="calendar-event-main">
                    <div className="calendar-event-top">
                      <h3>{event.title}</h3>
                      <span className={`impact-badge impact-${event.impact.toLowerCase()}`}>{event.impact}</span>
                    </div>
                    <div className="calendar-values">
                      <span>Forecast <strong>{event.forecast}</strong></span>
                      <span>Previous <strong>{event.previous}</strong></span>
                      <span>Actual <strong>{event.actual ?? "Pending"}</strong></span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="tool-empty">No events found for these filters.</div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
};

export default EconomicCalendar;
