import React from "react";
import { useI18n } from "../i18n";

const TermsOfService: React.FC = () => {
  const { t } = useI18n();

  React.useEffect(() => {
    document.title = `${t("terms")} — MarketsPivot`;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "MarketsPivot terms of service and acceptable use.");
  }, [t]);

  return (
    <div className="page">
      <div className="section-heading">
        <p className="eyebrow">{t("terms")}</p>
        <h1>{t("terms")}</h1>
        <p>Last updated: 2026-01-01</p>
      </div>

      <div className="legal-content">
        <h2>Acceptance of terms</h2>
        <p>
          By accessing or using MarketsPivot, you agree to be bound by these Terms of Service.
        </p>

        <h2>Use of the service</h2>
        <p>
          You agree to use the service for lawful purposes and not to interfere with or disrupt
          the platform.
        </p>

        <h2>Market data disclaimer</h2>
        <p>
          Information on MarketsPivot is provided for general informational purposes only and is
          not investment advice.
        </p>

        <h2>Accounts</h2>
        <p>
          Where accounts are available, you are responsible for maintaining the confidentiality of
          your login credentials.
        </p>

        <h2>Termination</h2>
        <p>
          We may suspend or terminate access to the service if we believe you have violated these
          Terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms can be directed to support@marketspivot.example.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;

