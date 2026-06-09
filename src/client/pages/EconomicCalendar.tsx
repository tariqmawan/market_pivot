import React from "react";
import { useI18n } from "../i18n";

type Impact = "High" | "Medium" | "Low";
type DateRange = "today" | "tomorrow" | "thisWeek";

type CountryCode = "US" | "EU" | "UK" | "Japan" | "India";

interface EconomicEvent {
  id: string;
  time: string;
  country: CountryCode;
  impact: Impact;
  titleKey: string;
  forecast: string; // numeric-like (e.g. 0.3%) or i18n label key
  previous: string; // numeric-like or i18n label key
  actual?: string; // numeric-like or i18n label key
  date: DateRange;
  forecastIsKey?: boolean;
  previousIsKey?: boolean;
  actualIsKey?: boolean;
}

const events: EconomicEvent[] = [
  {
    id: "cpi",
    time: "08:30",
    country: "US",
    impact: "High",
    titleKey: "economiccalendar.eventTitles.cpi_m_m",
    forecast: "0.3%",
    previous: "0.1%",
    actual: "0.4%",
    date: "today",
  },
  {
    id: "retail-sales",
    time: "10:00",
    country: "EU",
    impact: "Medium",
    titleKey: "economiccalendar.eventTitles.retail_sales",
    forecast: "-0.2%",
    previous: "0.4%",
    actual: "-0.1%",
    date: "today",
  },
  {
    id: "ind-prod",
    time: "12:15",
    country: "India",
    impact: "Medium",
    titleKey: "economiccalendar.eventTitles.industrial_production",
    forecast: "4.1%",
    previous: "3.8%",
    actual: "4.4%",
    date: "today",
  },
  {
    id: "gdp-qq",
    time: "13:30",
    country: "UK",
    impact: "Low",
    titleKey: "economiccalendar.eventTitles.gdp_q_q",
    forecast: "0.1%",
    previous: "0.0%",
    actual: "0.2%",
    date: "tomorrow",
  },
  {
    id: "boj",
    time: "15:00",
    country: "Japan",
    impact: "High",
    titleKey: "economiccalendar.eventTitles.boj_rate_decision",
    forecast: "economiccalendar.eventValues.unchanged",
    previous: "economiccalendar.eventValues.unchanged",
    actual: "economiccalendar.eventValues.pending",
    date: "thisWeek",
    forecastIsKey: true,
    previousIsKey: true,
    actualIsKey: true,
  },
  {
    id: "fomc",
    time: "18:00",
    country: "US",
    impact: "High",
    titleKey: "economiccalendar.eventTitles.fomc_minutes",
    forecast: "economiccalendar.eventValues.hawkish",
    previous: "economiccalendar.eventValues.neutral",
    actual: "economiccalendar.eventValues.pending",
    date: "thisWeek",
    forecastIsKey: true,
    previousIsKey: true,
    actualIsKey: true,
  },
];

const countries: Array<"All" | CountryCode> = ["All", "US", "EU", "UK", "Japan", "India"];
const impacts: Array<"All" | Impact> = ["All", "High", "Medium", "Low"];
const dateRanges: DateRange[] = ["today", "tomorrow", "thisWeek"];

const EconomicCalendar: React.FC = () => {
  const { t } = useI18n();
  const [country, setCountry] = React.useState<"All" | CountryCode>("All");
  const [impact, setImpact] = React.useState<"All" | Impact>("All");
  const [dateRange, setDateRange] = React.useState<DateRange>("today");

  const filtered = events.filter((event) => {
    const countryOk = country === "All" || event.country === country;
    const impactOk = impact === "All" || event.impact === impact;
    const dateOk = event.date === dateRange;
    return countryOk && impactOk && dateOk;
  });

  const highImpactCount = filtered.filter((event) => event.impact === "High").length;

  const dateRangeLabel = t(`economiccalendar.dateRanges.${dateRange}`);

  return (
    <div className="page tool-page economic-calendar-page">
      <section className="tool-hero calendar-hero">
        <div>
          <p className="eyebrow">{t("economiccalendar.hero.eyebrow")}</p>
          <h1>{t("economiccalendar.hero.title")}</h1>
          <p>{t("economiccalendar.hero.description")}</p>
        </div>
        <div className="tool-hero-panel">
          <span>{t("economiccalendar.hero.panelLabel")}</span>
          <strong>{highImpactCount}</strong>
          <em>{dateRangeLabel}</em>
        </div>
      </section>

      <section className="tool-metric-grid">
        {[
          ["economiccalendar.metrics.events", String(filtered.length), "economiccalendar.metrics.currentView"],
          ["economiccalendar.metrics.regions", "5", "economiccalendar.metrics.regionsMeta"],
          [
            "economiccalendar.metrics.next",
            filtered[0]?.time ?? "--",
            filtered[0] ? filtered[0].titleKey : "economiccalendar.metrics.noEvents",
          ],
          [
            "economiccalendar.metrics.risk",
            highImpactCount ? t("economiccalendar.risk.elevated") : t("economiccalendar.risk.quiet"),
            "economiccalendar.metrics.riskMeta",
          ],
        ].map(([labelKey, value, metaOrKey]) => (
          <div className="tool-metric" key={labelKey}>
            <span>{t(labelKey)}</span>
            <strong>{value}</strong>
            <em>{metaOrKey.startsWith("economiccalendar.") ? t(metaOrKey) : metaOrKey}</em>
          </div>
        ))}
      </section>

      <section className="calendar-shell">
        <aside className="tool-filter-card">
          <div className="tool-card-head">
            <div>
              <p className="eyebrow">{t("economiccalendar.filters.eyebrow")}</p>
              <h2>{t("economiccalendar.filters.title")}</h2>
            </div>
          </div>

          <div className="tool-segmented vertical" aria-label={t("economiccalendar.filters.dateRangeLabel")}>
            {dateRanges.map((range) => (
              <button
                type="button"
                key={range}
                className={dateRange === range ? "active" : ""}
                onClick={() => setDateRange(range)}
              >
                {t(`economiccalendar.dateRanges.${range}`)}
              </button>
            ))}
          </div>

          <label className="tool-field">
            <span>{t("economiccalendar.filters.countryLabel")}</span>
            <select value={country} onChange={(e) => setCountry(e.target.value as "All" | CountryCode)}>
              {countries.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? t("economiccalendar.filters.allCountries") : t(`economiccalendar.countries.${item}`)}
                </option>
              ))}
            </select>
          </label>

          <label className="tool-field">
            <span>{t("economiccalendar.filters.impactLabel")}</span>
            <select value={impact} onChange={(e) => setImpact(e.target.value as "All" | Impact)}>
              {impacts.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? t("economiccalendar.filters.allImpact") : t(`economiccalendar.filters.impacts.${item}`)}
                </option>
              ))}
            </select>
          </label>
        </aside>

        <section className="calendar-timeline-card">
          <div className="tool-card-head">
            <div>
              <p className="eyebrow">{t("economiccalendar.timeline.eyebrow")}</p>
              <h2>{dateRangeLabel}</h2>
            </div>
            <span className="tool-live-chip">{t("economiccalendar.timeline.liveChip")}</span>
          </div>

          <div className="calendar-timeline">
            {filtered.length > 0 ? (
              filtered.map((event) => {
                const forecastText = event.forecastIsKey ? t(event.forecast) : event.forecast;
                const previousText = event.previousIsKey ? t(event.previous) : event.previous;
                const actualText = event.actualIsKey
                  ? t(event.actual ?? "economiccalendar.eventValues.pending")
                  : event.actual ?? t("economiccalendar.eventValues.pending");

                return (
                  <article className="calendar-event" key={event.id}>
                    <div className="calendar-time">
                      <strong>{event.time}</strong>
                      <span>{t(`economiccalendar.countries.${event.country}`)}</span>
                    </div>
                    <div className="calendar-dot" />
                    <div className="calendar-event-main">
                      <div className="calendar-event-top">
                        <h3>{t(event.titleKey)}</h3>
                        <span
                          className={`impact-badge impact-${event.impact.toLowerCase()}`}
                        >
                          {t(`economiccalendar.filters.impacts.${event.impact}`)}
                        </span>
                      </div>
                      <div className="calendar-values">
                        <span>
                          {t("economiccalendar.values.forecast")} <strong>{forecastText}</strong>
                        </span>
                        <span>
                          {t("economiccalendar.values.previous")} <strong>{previousText}</strong>
                        </span>
                        <span>
                          {t("economiccalendar.values.actual")} <strong>{actualText}</strong>
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="tool-empty">{t("economiccalendar.empty")}</div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
};

export default EconomicCalendar;
