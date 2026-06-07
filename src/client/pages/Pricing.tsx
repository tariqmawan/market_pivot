import { useState } from "react";
import "./Pricing.css";
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
        <span className="pricing-price-amount">{t("pricing.h0")}</span>
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