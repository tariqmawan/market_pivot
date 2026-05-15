import React from "react";
import { useI18n } from "../i18n";

type Impact = "High" | "Medium" | "Low";

interface EconomicEvent {
  time: string;
  country: string;
  impact: Impact;
  title: string;
  forecast: string;
  previous: string;
  actual?: string;
  date: "Today" | "Tomorrow" | "This Week";
}

const EconomicCalendar: React.FC = () => {
  const { t } = useI18n();

  const [country, setCountry] = React.useState("All");

  const [impact, setImpact] = React.useState<
    Impact | "All"
  >("All");

  const [dateRange, setDateRange] = React.useState<
    "Today" | "Tomorrow" | "This Week"
  >("Today");

  const events: EconomicEvent[] = [
    {
      time: "08:30",
      country: "US",
      impact: "High",
      title: "CPI m/m",
      forecast: "0.3%",
      previous: "0.1%",
      actual: "0.4%",
      date: "Today",
    },
    {
      time: "10:00",
      country: "EU",
      impact: "Medium",
      title: "Retail Sales",
      forecast: "-0.2%",
      previous: "0.4%",
      actual: "-0.1%",
      date: "Today",
    },
    {
      time: "13:30",
      country: "UK",
      impact: "Low",
      title: "GDP q/q",
      forecast: "0.1%",
      previous: "0.0%",
      actual: "0.2%",
      date: "Tomorrow",
    },
    {
      time: "15:00",
      country: "Japan",
      impact: "High",
      title: "BoJ Rate Decision",
      forecast: "Unchanged",
      previous: "Unchanged",
      actual: "Unchanged",
      date: "This Week",
    },
  ];

  const filtered = events.filter((e) => {
    const countryOk =
      country === "All" || e.country === country;

    const impactOk =
      impact === "All" || e.impact === impact;

    const dateOk = e.date === dateRange;

    return countryOk && impactOk && dateOk;
  });

  const getImpactClass = (value: Impact) => {
    switch (value) {
      case "High":
        return "impact-high";

      case "Medium":
        return "impact-medium";

      case "Low":
        return "impact-low";

      default:
        return "";
    }
  };

  return (
    <div className="page economic-calendar-page">
      <div className="section-heading">
        <p className="eyebrow">
          Economic Calendar
        </p>

        <h1>Economic Calendar</h1>

        <p>
          Track major economic events, central bank
          decisions, inflation reports, GDP releases,
          and market-moving announcements.
        </p>
      </div>

      <section className="card economic-calendar-card">
        <div className="form-grid economic-calendar-filters">

          {/* Country */}
          <label className="field">
            <span>Country</span>

            <select
              value={country}
              onChange={(e) =>
                setCountry(e.target.value)
              }
            >
              <option value="All">All</option>
              <option value="US">United States</option>
              <option value="EU">Europe</option>
              <option value="UK">United Kingdom</option>
              <option value="Japan">Japan</option>
            </select>
          </label>

          {/* Impact */}
          <label className="field">
            <span>Impact</span>

            <select
              value={impact}
              onChange={(e) =>
                setImpact(
                  e.target.value as Impact | "All"
                )
              }
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </label>

          {/* Date */}
          <label className="field">
            <span>Date Range</span>

            <select
              value={dateRange}
              onChange={(e) =>
                setDateRange(
                  e.target.value as
                    | "Today"
                    | "Tomorrow"
                    | "This Week"
                )
              }
            >
              <option value="Today">Today</option>
              <option value="Tomorrow">
                Tomorrow
              </option>
              <option value="This Week">
                This Week
              </option>
            </select>
          </label>
        </div>

        {/* Table */}
        <div className="economic-calendar-table-wrapper">
          <table className="economic-calendar-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Country</th>
                <th>Impact</th>
                <th>Event</th>
                <th>Forecast</th>
                <th>Previous</th>
                <th>Actual</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((event, index) => (
                  <tr key={index}>
                    <td>{event.time}</td>

                    <td>{event.country}</td>

                    <td>
                      <span
                        className={`impact-badge ${getImpactClass(
                          event.impact
                        )}`}
                      >
                        {event.impact}
                      </span>
                    </td>

                    <td className="event-title">
                      {event.title}
                    </td>

                    <td>{event.forecast}</td>

                    <td>{event.previous}</td>

                    <td>{event.actual}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="empty-state"
                  >
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default EconomicCalendar;