import { useState } from "react";
import "./Pricing.css";
import { useI18n } from "../i18n";


type BillingMode = "monthly" | "annual";

interface Feature {
  textKey: string;
  muted?: boolean;
}

interface Plan {
  id: string;
  name: string;
  descriptionKey: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  ctaKey: string;
  ctaVariant: "default" | "primary" | "dark";
  popular?: boolean;
  featuresLabelKey: string;
  features: Feature[];
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    descriptionKey: "freePlanDescription",
    monthlyPrice: 0,
    annualPrice: 0,
    ctaKey: "freeCta",
    ctaVariant: "default",
    featuresLabelKey: "freeFeaturesLabel",
    features: [
      { textKey: "freeFeature1" },
      { textKey: "freeFeature2" },
      { textKey: "freeFeature3" },
      { textKey: "freeFeature4" },
      { textKey: "freeFeature5" },
      { textKey: "freeFeature6", muted: true },
      { textKey: "freeFeature7", muted: true },
      { textKey: "freeFeature8" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    descriptionKey: "proPlanDescription",
    monthlyPrice: 29,
    annualPrice: 20,
    ctaKey: "proCta",
    ctaVariant: "primary",
    popular: true,
    featuresLabelKey: "proFeaturesLabel",
    features: [
      { textKey: "proFeature1" },
      { textKey: "proFeature2" },
      { textKey: "proFeature3" },
      { textKey: "proFeature4" },
      { textKey: "proFeature5" },
      { textKey: "proFeature6" },
      { textKey: "proFeature7" },
      { textKey: "proFeature8" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    descriptionKey: "enterprisePlanDescription",
    monthlyPrice: 99,
    annualPrice: 69,
    ctaKey: "enterpriseCta",
    ctaVariant: "dark",
    featuresLabelKey: "enterpriseFeaturesLabel",
    features: [
      { textKey: "enterpriseFeature1" },
      { textKey: "enterpriseFeature2" },
      { textKey: "enterpriseFeature3" },
      { textKey: "enterpriseFeature4" },
      { textKey: "enterpriseFeature5" },
      { textKey: "enterpriseFeature6" },
      { textKey: "enterpriseFeature7" },
      { textKey: "enterpriseFeature8" },
    ],
  },
];

function CheckIcon({ muted }: { muted?: boolean }) {
  return (
    <span className={`pricing-check${muted ? " pricing-check--muted" : ""}`}>
      <svg viewBox="0 0 10 10" aria-hidden="true">
        <path
          d="M2 5.5l2 2 4-4"
          stroke={muted ? "var(--color-text-secondary)" : "#1D9E75"}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

// ─── 6 icons for the "What's Included" grid ─────────────────────────
const INCLUDED_ICONS = [
  // Real-time data
  <svg key="i1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 17l5-5 4 4 8-9" />
    <path d="M14 7h6v6" />
  </svg>,
  // Multi-asset coverage
  <svg key="i2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>,
  // AI insights
  <svg key="i3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    <circle cx="12" cy="12" r="4" />
  </svg>,
  // Multi-device
  <svg key="i4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="5" width="14" height="11" rx="1.5" />
    <rect x="14" y="9" width="8" height="12" rx="1.5" />
    <path d="M5 19h7" />
  </svg>,
  // Alerts
  <svg key="i5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 8a6 6 0 0 1 12 0c0 6 3 7 3 7H3s3-1 3-7" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>,
  // Security
  <svg key="i6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
];

// ─── Collapsible FAQ item ─────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`pricing-faq-item${open ? " pricing-faq-item--open" : ""}`}>
      <button
        type="button"
        className="pricing-faq-q"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{question}</span>
        <span className="pricing-faq-chev" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </span>
      </button>
      <div className="pricing-faq-a" hidden={!open}>
        <p>{answer}</p>
      </div>
    </div>
  );
}

function PriceDisplay({ plan, mode }: { plan: Plan; mode: BillingMode }) {
  const { t } = useI18n();
  const price = mode === "annual" ? plan.annualPrice : plan.monthlyPrice;

  if (price === null) {
    return (
      <div className="pricing-price-row">
        <span className="pricing-price-amount">{t("src_client_pages_pricing__l172__h0")}</span>
      </div>
    );
  }

  const monthly = plan.monthlyPrice ?? 0;
  const annual = plan.annualPrice ?? 0;
  const yearlySavings = (monthly - annual) * 12;

  return (
    <>
      <div className="pricing-price-row">
        {price > 0 && <span className="pricing-price-currency">$</span>}
        <span className="pricing-price-amount">{price === 0 ? "Free" : price}</span>
        {price > 0 && <span className="pricing-price-period">/mo</span>}
      </div>
      <div className="pricing-price-billed">
        {mode === "annual" && price > 0 && yearlySavings > 0 ? (
          <>
            <span className="pricing-price-original">${monthly}/mo</span>
            <span className="pricing-price-savings"> · Save ${yearlySavings}/yr</span>
          </>
        ) : (
          <span>&nbsp;</span>
        )}
      </div>
    </>
  );
}

function PlanCard({ plan, mode }: { plan: Plan; mode: BillingMode }) {
  const { t } = useI18n();

  return (
    <div
      className={`pricing-card${plan.popular ? " pricing-card--popular" : ""}`}
    >
      {plan.popular && (
        <div className="pricing-popular-badge" aria-label={t("mostPopular")}>
          {t("mostPopular")}
        </div>
      )}

      <div className="pricing-plan-name">{plan.name}</div>
      <p className="pricing-plan-desc">{t(plan.descriptionKey)}</p>

      <PriceDisplay plan={plan} mode={mode} />

      <button
        className={`pricing-cta pricing-cta--${plan.ctaVariant}`}
        type="button"
        onClick={() => {
          /* navigate to signup / contact */
        }}
      >
        {t(plan.ctaKey)}
      </button>

      <hr className="pricing-divider" />

      <div className="pricing-features-label">{t(plan.featuresLabelKey)}</div>
      <ul className="pricing-feature-list" role="list">
        {plan.features.map((f, i) => (
          <li
            key={i}
            className={`pricing-feature-item${f.muted ? " pricing-feature-item--muted" : ""}`}
          >
            <CheckIcon muted={f.muted} />
            <span>{t(f.textKey)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Pricing() {
  const { t } = useI18n();
  const [mode, setMode] = useState<BillingMode>("monthly");

  return (
    <section className="pricing-section" aria-labelledby="pricing-heading">
      <div className="pricing-header">
        <span className="pricing-eyebrow">{t("pricing")}</span>
        <h2 id="pricing-heading" className="pricing-title">
          {t("pricingTitle")}
        </h2>
        <p className="pricing-subtitle">
          {t("pricingSubtitle")}
        </p>

        <div className="pricing-billing-toggle" role="group" aria-label={t("billingPeriod")}>
          <button
            className={`pricing-toggle-btn${mode === "monthly" ? " pricing-toggle-btn--active" : ""}`}
            onClick={() => setMode("monthly")}
            aria-pressed={mode === "monthly"}
          >
            {t("monthly")}
          </button>
          <button
            className={`pricing-toggle-btn${mode === "annual" ? " pricing-toggle-btn--active" : ""}`}
            onClick={() => setMode("annual")}
            aria-pressed={mode === "annual"}
          >
            {t("annual")}{" "}
            <span className="pricing-save-badge">{t("save30Percent")}</span>
          </button>
        </div>
      </div>

      <div className="pricing-grid">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} mode={mode} />
        ))}
      </div>

      <div className="pricing-guarantee-cards">
        <div className="guarantee-card">
          <div className="guarantee-icon">{t("src_client_pages_pricing__l290__h1")}</div>
          <div className="guarantee-text">{t("guaranteeMoneyBack")}</div>
        </div>
        <div className="guarantee-card">
          <div className="guarantee-icon">{t("src_client_pages_pricing__l294__h2")}</div>
          <div className="guarantee-text">{t("guaranteeNoCreditCard")}</div>
        </div>
        <div className="guarantee-card">
          <div className="guarantee-icon">↻</div>
          <div className="guarantee-text">{t("guaranteeCancelAnytime")}</div>
        </div>
        <div className="guarantee-card">
          <div className="guarantee-icon">{t("src_client_pages_pricing__l302__h3")}</div>
          <div className="guarantee-text">{t("guarantee247Support")}</div>
        </div>
      </div>

      <p className="pricing-footer-note">
        {t("pricingHaveQuestions")}{" "}
        <a href="/faq" className="pricing-link">{t("pricingReadFaq")}</a>
        {" "}{t("pricingOr")}{" "}
        <a href="/contact" className="pricing-link">{t("pricingTalkToTeam")}</a>
        . {t("pricingAllPlansInclude")}
      </p>

      {/* ─── 3. What's Included Section ─────────────────────────────── */}
      <div className="pricing-included">
        <div className="pricing-included-header">
          <span className="pricing-eyebrow">{t("includedTitle")}</span>
          <h3 className="pricing-included-title">{t("includedTitle")}</h3>
          <p className="pricing-included-subtitle">{t("includedSubtitle")}</p>
        </div>
        <div className="pricing-included-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="pricing-included-card">
              <div className="pricing-included-icon" aria-hidden="true">
                {INCLUDED_ICONS[i - 1]}
              </div>
              <h4 className="pricing-included-card-title">
                {t(`included${i}Title`)}
              </h4>
              <p className="pricing-included-card-desc">
                {t(`included${i}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 4. Feature Breakdown Section ────────────────────────────── */}
      <div className="pricing-breakdown">
        <div className="pricing-breakdown-header">
          <span className="pricing-eyebrow">{t("breakdownTitle")}</span>
          <h3 className="pricing-breakdown-title">{t("breakdownTitle")}</h3>
          <p className="pricing-breakdown-subtitle">{t("breakdownSubtitle")}</p>
        </div>
        <div className="pricing-breakdown-list">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="pricing-breakdown-row">
              <div className="pricing-breakdown-left">
                <div className="pricing-breakdown-num">{String(i).padStart(2, "0")}</div>
                <h4 className="pricing-breakdown-row-title">
                  {t(`breakdown${i}Title`)}
                </h4>
              </div>
              <div className="pricing-breakdown-right">
                <p className="pricing-breakdown-row-desc">
                  {t(`breakdown${i}Desc`)}
                </p>
                <p className="pricing-breakdown-row-more">
                  {t(`breakdown${i}More`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 5. Full Comparison Table ────────────────────────────────── */}
      <div className="pricing-compare">
        <div className="pricing-compare-header">
          <span className="pricing-eyebrow">{t("compareTitle")}</span>
          <h3 className="pricing-compare-title">{t("compareTitle")}</h3>
          <p className="pricing-compare-subtitle">{t("compareSubtitle")}</p>
        </div>

        <div className="pricing-compare-table-wrap">
          <table className="pricing-compare-table">
            <thead>
              <tr>
                <th scope="col" className="pricing-compare-th-feature">
                  {t("compareColFeature")}
                </th>
                <th scope="col" className="pricing-compare-th-plan">
                  {t("compareColStarter")}
                </th>
                <th scope="col" className="pricing-compare-th-plan pricing-compare-th-plan--popular">
                  {t("compareColPro")}
                </th>
                <th scope="col" className="pricing-compare-th-plan">
                  {t("compareColEnterprise")}
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { row: "compareRowPrice",      s: "compareStarterPrice",      p: "compareProPrice",      e: "compareEnterprisePrice" },
                { row: "compareRowUsers",      s: "compareStarterUsers",      p: "compareProUsers",      e: "compareEnterpriseUsers" },
                { row: "compareRowMarketAccess", s: "compareStarterMarket",  p: "compareProMarket",     e: "compareEnterpriseMarket" },
                { row: "compareRowAIFeatures",  s: "compareStarterAI",         p: "compareProAI",         e: "compareEnterpriseAI" },
                { row: "compareRowAlerts",     s: "compareStarterAlerts",     p: "compareProAlerts",     e: "compareEnterpriseAlerts" },
                { row: "compareRowAPI",        s: "compareStarterAPI",        p: "compareProAPI",        e: "compareEnterpriseAPI" },
                { row: "compareRowSupport",    s: "compareStarterSupport",    p: "compareProSupport",    e: "compareEnterpriseSupport" },
                { row: "compareRowSecurity",   s: "compareStarterSecurity",   p: "compareProSecurity",   e: "compareEnterpriseSecurity" },
              ].map((r) => (
                <tr key={r.row}>
                  <th scope="row" className="pricing-compare-row-label">
                    {t(r.row)}
                  </th>
                  <td className="pricing-compare-cell">{t(r.s)}</td>
                  <td className="pricing-compare-cell pricing-compare-cell--popular">{t(r.p)}</td>
                  <td className="pricing-compare-cell">{t(r.e)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 6. FAQ Section ──────────────────────────────────────────── */}
      <div className="pricing-faq">
        <div className="pricing-faq-header">
          <span className="pricing-eyebrow">{t("faqTitle")}</span>
          <h3 className="pricing-faq-title">{t("faqTitle")}</h3>
          <p className="pricing-faq-subtitle">{t("faqSubtitle")}</p>
        </div>
        <div className="pricing-faq-list">
          {[1, 2, 3, 4, 5].map((i) => (
            <FaqItem
              key={i}
              question={t(`faq${i}Q`)}
              answer={t(`faq${i}A`)}
            />
          ))}
        </div>
      </div>

      {/* ─── 7. Final CTA Section ────────────────────────────────────── */}
      <div className="pricing-final-cta">
        <h3 className="pricing-final-cta-title">{t("finalCtaTitle")}</h3>
        <p className="pricing-final-cta-subtitle">{t("finalCtaSubtitle")}</p>
        <div className="pricing-final-cta-actions">
          <button
            type="button"
            className="pricing-cta pricing-cta--primary pricing-final-cta-btn"
            onClick={() => { /* navigate to signup */ }}
          >
            {t("finalCtaPrimary")}
          </button>
          <button
            type="button"
            className="pricing-cta pricing-cta--dark pricing-final-cta-btn"
            onClick={() => { /* navigate to contact */ }}
          >
            {t("finalCtaSecondary")}
          </button>
        </div>
      </div>
    </section>
  );
}