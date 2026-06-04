import { useState } from "react";
import { useI18n } from "../i18n";
import { HiGift, HiUser, HiUsers, HiBuildingOffice2, HiLockClosed, HiBolt, HiClock } from "react-icons/hi2";
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
  icon: string;
  iconBg: string;
  cardBg: string;
  userBadge: string;
  popular?: boolean;
  featuresLabelKey: string;
  features: Feature[];
  featureTags?: string[];
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    descriptionKey: "starterPlanDescription",
    monthlyPrice: 0,
    annualPrice: 0,
    ctaKey: "starterCta",
    icon: "🎁",
    iconBg: "#3B82F6",
    cardBg: "rgba(59, 130, 246, 0.05)",
    userBadge: "1+",
    featuresLabelKey: "starterFeaturesLabel",
    features: [
      { textKey: "starterFeature1" },
      { textKey: "starterFeature2" },
      { textKey: "starterFeature3" },
      { textKey: "starterFeature4" },
      { textKey: "starterFeature5" },
    ],
    featureTags: ["5 eSignsPerMonth", "Self & Multi"],
  },
  {
    id: "professional",
    name: "Professional",
    descriptionKey: "professionalPlanDescription",
    monthlyPrice: 7,
    annualPrice: 7,
    ctaKey: "professionalCta",
    icon: "👤",
    iconBg: "#EC4899",
    cardBg: "rgba(236, 72, 153, 0.05)",
    userBadge: "1+",
    popular: true,
    featuresLabelKey: "professionalFeaturesLabel",
    features: [
      { textKey: "professionalFeature1" },
      { textKey: "professionalFeature2" },
      { textKey: "professionalFeature3" },
      { textKey: "professionalFeature4" },
      { textKey: "professionalFeature5" },
    ],
    featureTags: ["25 eSignsPerMonth", "Self & Multi"],
  },
  {
    id: "business",
    name: "Business",
    descriptionKey: "businessPlanDescription",
    monthlyPrice: 9,
    annualPrice: 9,
    ctaKey: "businessCta",
    icon: "👥",
    iconBg: "#10B981",
    cardBg: "rgba(16, 185, 129, 0.05)",
    userBadge: "1+",
    popular: true,
    featuresLabelKey: "businessFeaturesLabel",
    features: [
      { textKey: "businessFeature1" },
      { textKey: "businessFeature2" },
      { textKey: "businessFeature3" },
      { textKey: "businessFeature4" },
      { textKey: "businessFeature5" },
    ],
    featureTags: ["Unlimited eSign", "Self & Multi"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    descriptionKey: "enterprisePlanDescription",
    monthlyPrice: null,
    annualPrice: null,
    ctaKey: "enterpriseCta",
    icon: "🏢",
    iconBg: "#A855F7",
    cardBg: "rgba(168, 85, 247, 0.05)",
    userBadge: "25+",
    featuresLabelKey: "enterpriseFeaturesLabel",
    features: [
      { textKey: "enterpriseFeature1" },
      { textKey: "enterpriseFeature2" },
      { textKey: "enterpriseFeature3" },
      { textKey: "enterpriseFeature4" },
      { textKey: "enterpriseFeature5" },
    ],
    featureTags: ["Unlimited eSign", "Self & Multi"],
  },
];

function PlanIcon({ planId }: { planId: string }) {
  const icons: Record<string, React.ReactNode> = {
    starter: <HiGift size={30} color="white" />,
    professional: <HiUser size={30} color="white" />,
    business: <HiUsers size={30} color="white" />,
    enterprise: <HiBuildingOffice2 size={30} color="white" />,
  };
  return icons[planId] || null;
}

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

function PriceDisplay({ plan, mode }: { plan: Plan; mode: BillingMode }) {
  const price = mode === "annual" ? plan.annualPrice : plan.monthlyPrice;

  if (price === null) {
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
  const [quantity, setQuantity] = useState(1);

  return (
    <div
      className="pricing-card"
      style={{ backgroundColor: plan.cardBg } as React.CSSProperties}
    >
      {plan.popular && (
        <div className="pricing-popular-badge" aria-label={t("mostPopular")}>
          ⭐ {t("mostPopular")}
        </div>
      )}

      <div className="pricing-card-header">
        <div
          className="pricing-icon"
          style={{ backgroundColor: plan.iconBg }}
        >
          <PlanIcon planId={plan.id} />
        </div>
        <div className="pricing-header-info">
          <div className="pricing-plan-name">{plan.name}</div>
          <div className="pricing-user-badge">👥 {plan.userBadge}</div>
        </div>
      </div>

      <p className="pricing-plan-desc">{t(plan.descriptionKey)}</p>

      <PriceDisplay plan={plan} mode={mode} />

      {plan.featureTags && (
        <div className="pricing-feature-tags">
          {plan.featureTags.map((tag, i) => (
            <span key={i} className="pricing-tag">
              ✨ {tag}
            </span>
          ))}
        </div>
      )}

      <button
        className="pricing-cta"
        style={{ backgroundColor: plan.iconBg }}
        type="button"
        onClick={() => {
          /* navigate to signup / contact */
        }}
      >
        {plan.monthlyPrice === null ? t("contactSales") : t(plan.ctaKey)}
      </button>

      {plan.id !== "enterprise" && plan.monthlyPrice !== null && (
        <div className="pricing-quantity-section">
          <div className="pricing-quantity-label">How many users? (Unlimited)</div>
          <div className="pricing-quantity-controls">
            <button
              className="pricing-qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <div className="pricing-qty-display">{quantity}</div>
            <button
              className="pricing-qty-btn"
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {plan.monthlyPrice > 0 && (
            <div className="pricing-seat-price">${(plan.monthlyPrice * quantity).toFixed(2)}/seat/mo</div>
          )}
        </div>
      )}

      {plan.id === "enterprise" && (
        <div className="pricing-quantity-section">
          <button className="pricing-contact-sales" style={{ borderColor: plan.iconBg }}>
            Contact Sales
          </button>
        </div>
      )}

      <hr className="pricing-divider" />

      <div className="pricing-features-label">{t(plan.featuresLabelKey)}</div>
      <ul className="pricing-feature-list" role="list">
        {plan.features.map((f, i) => (
          <li key={i} className="pricing-feature-item">
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

      <div className="pricing-benefit-cards">
        <div className="benefit-card benefit-card--blue">
          <div className="benefit-icon"><HiLockClosed size={40} color="white" /></div>
          <h3 className="benefit-title">Secure & Private</h3>
          <p className="benefit-text">Your files are encrypted and automatically deleted after processing.</p>
        </div>
        <div className="benefit-card benefit-card--green">
          <div className="benefit-icon"><HiBolt size={40} color="white" /></div>
          <h3 className="benefit-title">Lightning Fast</h3>
          <p className="benefit-text">Process files in seconds with our optimized cloud infrastructure.</p>
        </div>
        <div className="benefit-card benefit-card--purple">
          <div className="benefit-icon"><HiClock size={40} color="white" /></div>
          <h3 className="benefit-title">24/7 Availability</h3>
          <p className="benefit-text">Access your tools anytime, anywhere, on any device.</p>
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