import React from "react";
import { useSEO } from "../lib/useSEO";
import { useI18n } from "../i18n";



const GOLD = "#C9A87B";
const DARK = "#0f172a";
const MUTED = "#6b7280";

const plans = [
  { name: "Free", price: "$0", period: "forever", features: ["Market overviews", "Basic charts", "5 watchlist items", "Community support"] },
  { name: "Pro", price: "$19", period: "per month", features: ["Everything in Free", "Real-time data", "Unlimited watchlists", "Advanced screener", "Priority support"], highlight: true },
  { name: "Enterprise", price: "Custom", period: "contact us", features: ["Everything in Pro", "API access", "Dedicated account manager", "Custom integrations", "SLA guarantee"] },
];

const sections = [
  {
    title: "Subscription Plans",
    content: `MarketsPivot offers three subscription tiers to match your needs. All paid plans are billed in advance and renew automatically unless cancelled.`,
  },
  {
    title: "Billing Cycles",
    items: [
      "Monthly billing: charged on the same date each month.",
      "Annual billing: charged once per year at a discounted rate (save up to 20%).",
      "Billing date is set to the date you first subscribe.",
      "Invoices are sent to the email address on your account.",
    ],
  },
  {
    title: "Payment Methods",
    items: [
      "Credit and debit cards (Visa, Mastercard, American Express).",
      "PayPal (where available).",
      "Bank transfer for Enterprise plans (contact us).",
      "All transactions are processed securely via our payment processor.",
    ],
  },
  {
    title: "Free Trial",
    content: `New Pro subscribers receive a 14-day free trial. No credit card is required to start a trial. If you do not cancel before the trial ends, you will be charged for the first billing period.`,
  },
  {
    title: "Upgrades & Downgrades",
    content: `You may upgrade your plan at any time — the price difference for the remaining billing period is prorated and charged immediately. Downgrades take effect at the end of the current billing period with no partial refund.`,
  },
  {
    title: "Cancellation",
    content: `You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period. You retain full access to paid features until then.`,
  },
  {
    title: "Refund Policy",
    items: [
      "Free trial periods: no charges, no refund needed.",
      "Monthly plans: no refunds for partial months.",
      "Annual plans: refunds within 14 days of renewal if you have not used the service.",
      "Refund requests beyond 14 days are reviewed on a case-by-case basis.",
      "Contact support@marketspivot.example to initiate a refund request.",
    ],
  },
  {
    title: "Failed Payments",
    content: `If a payment fails, we will retry the charge up to 3 times over 7 days. During this period your account remains active. If payment is not resolved, your account will be downgraded to the Free plan and your data will be retained for 30 days.`,
  },
  {
    title: "Taxes",
    content: `Prices displayed are exclusive of taxes unless otherwise stated. Applicable VAT, GST, or other taxes will be added at checkout based on your billing location.`,
  },
  {
    title: "Changes to Pricing",
    content: `We reserve the right to change subscription prices. Existing subscribers will receive at least 30 days' notice before any price change takes effect. You may cancel before the new price applies.`,
  },
  {
    title: "Contact",
    content: `For billing questions, invoices, or refund requests: support@marketspivot.example`,
  },
];

const BillingPolicy: React.FC = () => {
  const { t } = useI18n();
  useSEO({ title: "Billing Policy", description: "MarketsPivot billing policy — plans, refunds, cancellation and payment terms.", canonical: "https://marketspivot.com/billing-policy", noindex: true });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: DARK }}>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #0f1e2e 0%, #0d1a26 55%, #162030 100%)",
        padding: "64px 5vw 56px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 40%, rgba(201,168,123,0.09) 0%, transparent 55%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 760, position: "relative" }}>
          <div style={{ display: "inline-block", padding: "4px 12px", marginBottom: 20, border: `1px solid rgba(201,168,123,0.35)`, background: "rgba(201,168,123,0.08)", color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Legal
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#ffffff", lineHeight: 1.1, marginBottom: 14 }}>
            Billing Policy
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600 }}>{t("src_client_pages_billingpolicy__l96__h0")}</p>
        </div>
      </section>

      {/* Plans overview */}
      <section style={{ background: "#f8f9fa", borderBottom: "1px solid #e5e7eb", padding: "48px 5vw" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>{t("src_client_pages_billingpolicy__l104__h1")}</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: DARK }}>{t("src_client_pages_billingpolicy__l105__h2")}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#e5e7eb", border: "1px solid #e5e7eb" }}>
            {plans.map((plan) => (
              <div key={plan.name} style={{
                background: plan.highlight ? `linear-gradient(160deg, #0f1e2e, #162030)` : "#ffffff",
                padding: "28px 24px",
                position: "relative",
              }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: GOLD }} />
                )}
                <div style={{ fontSize: 11, fontWeight: 800, color: plan.highlight ? GOLD : MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{plan.name}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: plan.highlight ? "#ffffff" : DARK, lineHeight: 1 }}>{plan.price}</div>
                <div style={{ fontSize: 12, color: plan.highlight ? "rgba(255,255,255,0.5)" : MUTED, marginBottom: 20, marginTop: 4 }}>{plan.period}</div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 8 }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.8)" : "#374151" }}>
                      <span style={{ color: GOLD, flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy content */}
      <section style={{ background: "#f8f9fa", padding: "0 5vw 80px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto", display: "grid", gridTemplateColumns: "200px 1fr", gap: 48, paddingTop: 48 }}>

          {/* TOC */}
          <aside style={{ position: "sticky", top: 80, alignSelf: "start" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{t("src_client_pages_billingpolicy__l139__h3")}</div>
            <nav style={{ display: "grid", gap: 2 }}>
              {sections.map((s) => (
                <a key={s.title} href={`#${s.title.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{ color: MUTED, fontSize: 13, fontWeight: 600, textDecoration: "none", padding: "5px 0 5px 10px", borderLeft: `2px solid #e5e7eb`, transition: "color 0.2s, border-color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.borderLeftColor = GOLD; }}
                  onMouseLeave={e => { e.currentTarget.style.color = MUTED; e.currentTarget.style.borderLeftColor = "#e5e7eb"; }}
                >{s.title}</a>
              ))}
            </nav>
            <div style={{ marginTop: 32, padding: "14px 16px", background: "#ffffff", border: `1px solid #e5e7eb`, borderLeft: `3px solid ${GOLD}` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: MUTED, textTransform: "uppercase", marginBottom: 8 }}>{t("src_client_pages_billingpolicy__l150__h4")}</div>
              <div style={{ display: "grid", gap: 6 }}>
                <a href="/privacy" style={{ color: GOLD, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>{t("src_client_pages_billingpolicy__l152__h5")}</a>
                <a href="/terms" style={{ color: GOLD, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>{t("src_client_pages_billingpolicy__l153__h6")}</a>
                <a href="/pricing" style={{ color: GOLD, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>{t("src_client_pages_billingpolicy__l154__h7")}</a>
              </div>
            </div>
          </aside>

          {/* Sections */}
          <div style={{ display: "grid", gap: 40 }}>
            {sections.map((s, i) => (
              <div key={i} id={s.title.toLowerCase().replace(/\s+/g, "-")}
                style={{ paddingBottom: 40, borderBottom: i < sections.length - 1 ? "1px solid #e5e7eb" : "none" }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: DARK, marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ width: 4, height: 18, background: GOLD, display: "inline-block", flexShrink: 0 }} />
                  {s.title}
                </h2>
                {s.content && <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75 }}>{s.content}</p>}
                {s.items && (
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
                    {s.items.map((item, j) => (
                      <li key={j} style={{ display: "flex", gap: 10, fontSize: 15, color: "#374151", lineHeight: 1.65 }}>
                        <span style={{ color: GOLD, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>→</span>{item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <div style={{ padding: "20px 24px", background: "#ffffff", borderLeft: `4px solid ${GOLD}`, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: 0 }}>
                Billing questions?{" "}
                <a href="mailto:support@marketspivot.example" style={{ color: GOLD, fontWeight: 700 }}>{t("src_client_pages_billingpolicy__l183__h8")}</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BillingPolicy;
