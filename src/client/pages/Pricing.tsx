import { useState } from "react";
import { useI18n } from "../i18n";
import "./pricing.css";

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

function PriceDisplay({ plan, mode, quantity }: { plan: Plan; mode: BillingMode; quantity?: number }) {
  const basePrice = mode === "annual" ? plan.annualPrice : plan.monthlyPrice;
  const price = quantity && basePrice !== null ? basePrice * quantity : basePrice;

  if (basePrice === null) {
    return (
      <div className="pricing-price-row">
        <span className="pricing-price-amount">Custom</span>
      </div>
    );
  }

  const monthly = plan.monthlyPrice ?? 0;
  const annual = plan.annualPrice ?? 0;
  const yearlySavings = (monthly - annual) * 12;

  return (
    <>
      <div className="pricing-price-row">
        {price !== null && price > 0 && <span className="pricing-price-currency">$</span>}
        <span className="pricing-price-amount">{price === 0 ? "Free" : price}</span>
        {price !== null && price > 0 && <span className="pricing-price-period">/mo</span>}
      </div>
      <div className="pricing-price-billed">
        {mode === "annual" && price !== null && price > 0 && yearlySavings > 0 ? (
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

  const defaultQuantity = 1;
  const minQuantity = 1;
  const showQuantitySelector = plan.id !== "free";

  const [quantity, setQuantity] = useState(defaultQuantity);

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

      <PriceDisplay plan={plan} mode={mode} quantity={showQuantitySelector ? quantity : undefined} />

      {showQuantitySelector && (
        <div className="pricing-users-section">
          <div className="pricing-users-label">
            How many users? (Unlimited)
          </div>

          <div className="pricing-quantity-row">
            <button
              type="button"
              className="pricing-qty-btn"
              onClick={() =>
                setQuantity(prev => Math.max(minQuantity, prev - 1))
              }
            >
              -
            </button>

            <div className="pricing-qty-display">
              {quantity}
            </div>

            <button
              type="button"
              className="pricing-qty-btn"
              onClick={() =>
                setQuantity(prev => prev + 1)
              }
            >
              +
            </button>
          </div>

          <div className="pricing-seat-price">
            ${plan.monthlyPrice}/seat/mo
          </div>
        </div>
      )}

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
  const [mode, setMode] = useState<BillingMode>("monthly");
  const { t } = useI18n();

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
          <div className="guarantee-icon">🛡️</div>
          <div className="guarantee-text">{t("guaranteeMoneyBack")}</div>
        </div>
        <div className="guarantee-card">
          <div className="guarantee-icon">🔒</div>
          <div className="guarantee-text">{t("guaranteeNoCreditCard")}</div>
        </div>
        <div className="guarantee-card">
          <div className="guarantee-icon">↻</div>
          <div className="guarantee-text">{t("guaranteeCancelAnytime")}</div>
        </div>
        <div className="guarantee-card">
          <div className="guarantee-icon">🎧</div>
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
    </section>
  );
}