import React from "react";
import { useI18n } from "../i18n";

const PrivacyPolicy: React.FC = () => {
  const { t } = useI18n();

  React.useEffect(() => {
    document.title = `${t("privacy")} — MarketsPivot`;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "MarketsPivot privacy policy and how we handle data.");
  }, [t]);

  return (
    <div className="page">
      <div className="section-heading">
        <p className="eyebrow">{t("privacy")}</p>
        <h1>{t("privacy")}</h1>
        <p>Last updated: 2026-01-01</p>
      </div>

      <div className="legal-content">
        <h2>Overview</h2>
        <p>
          This Privacy Policy explains how MarketsPivot (“we”, “our”, “us”) collects, uses, and
          shares information when you use our website and services.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>Account information (e.g., name, email) if you create an account.</li>
          <li>
            Usage information (e.g., pages viewed, interactions) to improve our services.
          </li>
          <li>
            Technical data (e.g., device/browser information, IP address) delivered by your
            browser.
          </li>
        </ul>

        <h2>How we use information</h2>
        <ul>
          <li>To provide, maintain, and improve the platform.</li>
          <li>To personalize content and user experience.</li>
          <li>To communicate with you (e.g., account-related notifications).</li>
          <li>To monitor security and prevent fraud.</li>
        </ul>

        <h2>Sharing</h2>
        <p>
          We may share information with service providers that help operate our platform, and
          where required by law.
        </p>

        <h2>Your choices</h2>
        <p>
          You can review and update certain account information, and you may contact us to
          request assistance regarding your data.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this Privacy Policy can be directed to support@marketspivot.example.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

