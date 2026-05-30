import { useState } from "react";
import "./pricing.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type BillingMode = "monthly" | "annual";

interface Feature {
  text: string;
  muted?: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  cta: string;
  ctaVariant: "default" | "primary" | "dark";
  popular?: boolean;
  featuresLabel: string;
  features: Feature[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    description:
      "Explore global markets with essential tools. No credit card required.",
    monthlyPrice: 0,
    annualPrice: 0,
    cta: "Get started free",
    ctaVariant: "default",
    featuresLabel: "What's included",
    features: [
      { text: "Global market overview dashboard" },
      { text: "Major indices & sector heatmaps" },
      { text: "Forex major pairs" },
      { text: "Top 50 crypto by market cap" },
      { text: "Economic calendar (basic)" },
      { text: "1 watchlist (10 symbols)", muted: true },
      { text: "Delayed data (15-min lag)", muted: true },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description:
      "Full market intelligence for serious traders and analysts.",
    monthlyPrice: 29,
    annualPrice: 20,
    cta: "Start 7-day free trial",
    ctaVariant: "primary",
    popular: true,
    featuresLabel: "Everything in Free, plus",
    features: [
      { text: "Real-time data across all markets" },
      { text: "Advanced stock screener" },
      { text: "Full exchange data (50+ exchanges)" },
      { text: "Insider trading & analyst ratings" },
      { text: "AI-powered news summaries" },
      { text: "10 watchlists, unlimited symbols" },
      { text: "Portfolio tracker & price alerts" },
      { text: "Sector & DeFi deep dives" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "Institutional-grade intelligence for teams and funds.",
    monthlyPrice: 99,
    annualPrice: 69,
    cta: "Contact sales",
    ctaVariant: "dark",
    featuresLabel: "Everything in Pro, plus",
    features: [
      { text: "API access (500k calls/month)" },
      { text: "Institutional dashboards" },
      { text: "AI market prediction engine" },
      { text: "AI-generated research reports" },
      { text: "Sentiment analysis engine" },
      { text: "Dedicated account manager" },
      { text: "SSO & team seats (up to 20)" },
      { text: "SLA & priority 24/7 support" },
    ],
  },
];

const GUARANTEES = [
  { icon: "ti-shield-check", label: "14-day money-back guarantee" },
  { icon: "ti-lock", label: "No credit card for Free plan" },
  { icon: "ti-refresh", label: "Cancel anytime" },
  { icon: "ti-headset", label: "24/7 support" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function PriceDisplay({
  plan,
  mode,
}: {
  plan: Plan;
  mode: BillingMode;
}) {
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
  return (
    <div
      className={`pricing-card${plan.popular ? " pricing-card--popular" : ""}`}
    >
      {plan.popular && (
        <div className="pricing-popular-badge" aria-label="Most popular plan">
          Most Popular
        </div>
      )}

      <div className="pricing-plan-name">{plan.name}</div>
      <p className="pricing-plan-desc">{plan.description}</p>

      <PriceDisplay plan={plan} mode={mode} />

      <button
        className={`pricing-cta pricing-cta--${plan.ctaVariant}`}
        type="button"
        onClick={() => {
          /* navigate to signup / contact */
        }}
      >
        {plan.cta}
      </button>

      <hr className="pricing-divider" />

      <div className="pricing-features-label">{plan.featuresLabel}</div>
      <ul className="pricing-feature-list" role="list">
        {plan.features.map((f, i) => (
          <li
            key={i}
            className={`pricing-feature-item${f.muted ? " pricing-feature-item--muted" : ""}`}
          >
            <CheckIcon muted={f.muted} />
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Pricing() {
  const [mode, setMode] = useState<BillingMode>("monthly");

  return (
    <section className="pricing-section" aria-labelledby="pricing-heading">
      {/* Header */}
      <div className="pricing-header">
        <span className="pricing-eyebrow">Pricing</span>
        <h2 id="pricing-heading" className="pricing-title">
          Start free. Scale as you grow.
        </h2>
        <p className="pricing-subtitle">
          Get real-time global markets data, analytics, and intelligence tools.
          No hidden fees.
        </p>

        {/* Billing toggle */}
        <div className="pricing-billing-toggle" role="group" aria-label="Billing period">
          <button
            className={`pricing-toggle-btn${mode === "monthly" ? " pricing-toggle-btn--active" : ""}`}
            onClick={() => setMode("monthly")}
            aria-pressed={mode === "monthly"}
          >
            Monthly
          </button>
          <button
            className={`pricing-toggle-btn${mode === "annual" ? " pricing-toggle-btn--active" : ""}`}
            onClick={() => setMode("annual")}
            aria-pressed={mode === "annual"}
          >
            Annual{" "}
            <span className="pricing-save-badge">Save 30%</span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="pricing-grid">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} mode={mode} />
        ))}
      </div>

      {/* Trust strip */}
      <ul className="pricing-guarantee-strip" role="list">
        {GUARANTEES.map((g, i) => (
          <li key={i} className="pricing-guarantee-item">
            <i className={`ti ${g.icon}`} aria-hidden="true" />
            {g.label}
          </li>
        ))}
      </ul>

      {/* Footer note */}
      <p className="pricing-footer-note">
        Have questions?{" "}
        <a href="/faq" className="pricing-link">Read the FAQ</a>
        {" "}or{" "}
        <a href="/contact" className="pricing-link">talk to our team</a>
        . All plans include access to 150+ global exchanges, real-time forex,
        commodities, and crypto data.
      </p>
    </section>
  );
}
