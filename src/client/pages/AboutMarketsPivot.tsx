import React from "react";
import { useI18n } from "../i18n";

const AboutMarketsPivot: React.FC = () => {
  const { t } = useI18n();

  React.useEffect(() => {
    document.title = `About — MarketsPivot`;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Learn about MarketsPivot, our mission, and how the platform helps you explore markets.");
  }, []);

  return (
    <div className="page">
      <div className="section-heading">
        <p className="eyebrow">{t("about") ?? "About"}</p>
        <h1>About MarketsPivot</h1>
        <p>A modern marketplace intelligence platform for exploring markets with clarity.</p>
      </div>

      <div className="legal-content">
        <h2>Our mission</h2>
        <p>
          MarketsPivot helps individuals and teams discover actionable insights across equities, FX,
          crypto, commodities, regions, and sectors—organized into a clean, navigable experience.
        </p>

        <h2>What you can do on the platform</h2>
        <ul>
          <li>Explore market dashboards for major exchanges, currencies, and crypto assets.</li>
          <li>Browse regional and sector intelligence to understand themes and coverage.</li>
          <li>Review pricing information and compare categories in one place.</li>
        </ul>

        <h2>Data and information</h2>
        <p>
          Content on MarketsPivot is for general informational purposes and may include indicative
          data. It is not investment advice.
        </p>

        <h2>Contact</h2>
        <p>Questions can be directed to support@marketspivot.example.</p>
      </div>
    </div>
  );
};

export default AboutMarketsPivot;

