import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SeoHead, buildProductOfferSchema } from "../seo";
import { useI18n } from "../i18n";
import {
  PLAN_ORDER,
  PLANS,
  PlanBadge,
  type BillingInterval,
  type PlanId,
} from "../subscription";
import { useSubscription } from "../subscription/hooks";


const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const formatAmount = (cents: number, currency = "USD"): string => {
  if (cents === 0) return "Free";
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cents);
};

const BillingPage: React.FC = () => {
  const { t } = useI18n();
  const {
    subscription,
    invoices,
    paymentMethods,
    usage,
    isLoading,
    isTrialing,
    isCanceled,
    daysUntilRenewal,
    currentPlan,
    changePlan,
    startTrial,
    cancelSubscription,
    resumeSubscription,
  } = useSubscription();

  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const planName = PLANS[currentPlan]?.name ?? "Free";

  const handleChangePlan = async (plan: PlanId) => {
    setIsMutating(true);
    setPendingPlan(plan);
    try {
      await changePlan(plan, interval);
    } finally {
      setPendingPlan(null);
      setIsMutating(false);
    }
  };

  const handleStartTrial = async () => {
    setIsMutating(true);
    try {
      await startTrial("pro", interval);
    } finally {
      setIsMutating(false);
    }
  };

  const handleCancel = async () => {
    if (typeof window !== "undefined" && !window.confirm("Cancel at end of period?")) return;
    setIsMutating(true);
    try {
      await cancelSubscription();
    } finally {
      setIsMutating(false);
    }
  };

  const handleResume = async () => {
    setIsMutating(true);
    try {
      await resumeSubscription();
    } finally {
      setIsMutating(false);
    }
  };

  const jsonLd = useMemo(
    () =>
      PLAN_ORDER.map((id) =>
        buildProductOfferSchema({
          name: PLANS[id].name,
          description: PLANS[id].tagline,
          price: PLANS[id].price.monthly,
          priceCurrency: "USD",
          url: "/pricing",
        })
      ),
    []
  );

  return (
    <>
      <SeoHead
        title={t("billingpage.h0")}
        description={t("billingpage.h1")}
        canonical="/billing"
        jsonLd={jsonLd}
      />
      <div className="page billing-page">
        <section className="coverage-hero">
          <div>
            <p className="eyebrow">{t("billingpage.h2")}</p>
            <h1>{t("billingpage.h3")}</h1>
            <p>
              You’re on the <strong>{planName}</strong> plan.{" "}
              {isTrialing && "Your 14-day Pro trial is active — enjoy the upgrade."}{" "}
              {isCanceled && "Auto-renew is off — your access continues until the period ends."}
            </p>
          </div>
          <div className="metric-strip">
            <div className="metric-tile">
              <span>{t("billingpage.h4")}</span>
              <strong>
                <PlanBadge plan={planName} /> {planName}
              </strong>
            </div>
            <div className="metric-tile">
              <span>{isCanceled ? "Access ends" : "Renews in"}</span>
              <strong>
                {isCanceled
                  ? formatDate(subscription?.currentPeriodEnd)
                  : `${daysUntilRenewal} day${daysUntilRenewal === 1 ? "" : "s"}`}
              </strong>
            </div>
            <div className="metric-tile">
              <span>{t("billingpage.h5")}</span>
              <strong>
                {isTrialing ? "Trialing" : isCanceled ? "Canceling" : "Active"}
              </strong>
            </div>
          </div>
        </section>

        <section className="billing-card">
          <header>
            <h2>{t("billingpage.h6")}</h2>
            <div className="billing-interval">
              {(["monthly", "yearly"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setInterval(value)}
                  className={interval === value ? "primary-action-sm" : "secondary-action-sm"}
                >
                  {value === "yearly" ? "Yearly (save ~17%)" : "Monthly"}
                </button>
              ))}
            </div>
          </header>

          <div className="billing-plan-grid">
            {PLAN_ORDER.map((id) => {
              const plan = PLANS[id];
              const isCurrent = id === currentPlan;
              const isPending = pendingPlan === id;
              return (
                <article
                  key={id}
                  className={`billing-plan ${isCurrent ? "is-current" : ""} ${plan.badge ? "is-featured" : ""}`}
                >
                  {plan.badge && <span className="billing-plan-badge">{plan.badge}</span>}
                  <h3>{plan.name}</h3>
                  <p className="billing-plan-tagline">{plan.tagline}</p>
                  <p className="billing-plan-price">
                    {formatAmount(plan.price[interval])}
                    <span> / {interval === "yearly" ? "year" : "month"}</span>
                  </p>
                  <ul>
                    {plan.features.slice(0, 6).map((feature) => (
                      <li key={feature.key}>✓ {feature.label}</li>
                    ))}
                  </ul>
                  <div className="billing-plan-actions">
                    {isCurrent ? (
                      <button type="button" className="secondary-action" disabled>
                        Current plan
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="primary-action"
                        onClick={() => handleChangePlan(id)}
                        disabled={isMutating}
                      >
                        {isPending ? "Switching…" : `Switch to ${plan.name}`}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {!isTrialing && currentPlan === "free" && (
            <div className="billing-trial-cta">
              <div>
                <strong>{t("billingpage.h7")}</strong>
                <p>{t("billingpage.h8")}</p>
              </div>
              <button
                type="button"
                className="primary-action"
                onClick={handleStartTrial}
                disabled={isMutating}
              >
                Start trial
              </button>
            </div>
          )}
        </section>

        <section className="billing-card">
          <header>
            <h2>{t("billingpage.h9")}</h2>
          </header>
          {isLoading ? (
            <p>{t("billingpage.h10")}</p>
          ) : (
            <div className="billing-usage-grid">
              {usage.map((metric) => {
                const pct =
                  metric.limit === Infinity
                    ? 0
                    : metric.limit === 0
                    ? 100
                    : Math.min(100, Math.round((metric.used / metric.limit) * 100));
                return (
                  <div key={metric.key} className="billing-usage-tile">
                    <p className="eyebrow">{metric.label}</p>
                    <strong>
                      {metric.used}
                      {metric.limit === Infinity ? "" : ` / ${metric.limit}`}
                      {metric.limit === 0 ? " (locked)" : ""}
                      {metric.unit ? ` ${metric.unit}` : ""}
                    </strong>
                    <div className="billing-usage-bar">
                      <div
                        style={{
                          width:
                            metric.limit === Infinity
                              ? "100%"
                              : `${Math.min(100, pct)}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="billing-card">
          <header>
            <h2>{t("billingpage.h11")}</h2>
          </header>
          {paymentMethods.length === 0 ? (
            <p>No payment method on file. (Free plan)</p>
          ) : (
            <ul className="billing-payment-list">
              {paymentMethods.map((pm) => (
                <li key={pm.id}>
                  <span className="billing-card-brand">{pm.brand.toUpperCase()}</span>
                  <span>•••• {pm.last4}</span>
                  <span>
                    Expires {String(pm.expMonth).padStart(2, "0")}/{pm.expYear}
                  </span>
                  {pm.isDefault && <span className="billing-card-default">{t("billingpage.h12")}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="billing-card">
          <header>
            <h2>{t("billingpage.h13")}</h2>
          </header>
          {invoices.length === 0 ? (
            <p>{t("billingpage.h14")}</p>
          ) : (
            <table className="billing-invoice-table">
              <thead>
                <tr>
                  <th scope="col">{t("billingpage.h15")}</th>
                  <th scope="col">{t("billingpage.h16")}</th>
                  <th scope="col">{t("billingpage.h17")}</th>
                  <th scope="col">{t("billingpage.h18")}</th>
                  <th scope="col">{t("billingpage.h19")}</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{formatDate(invoice.date)}</td>
                    <td>{invoice.description}</td>
                    <td>{formatAmount(invoice.amount, invoice.currency)}</td>
                    <td>
                      <span className={`billing-status billing-status--${invoice.status}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>
                      <a href={invoice.url}>{t("billingpage.h20")}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="billing-card billing-danger-zone">
          <header>
            <h2>{t("billingpage.h21")}</h2>
          </header>
          {isCanceled ? (
            <div>
              <p>
                Your subscription is set to end on <strong>{formatDate(subscription?.currentPeriodEnd)}</strong>.
                Resume anytime to keep access.
              </p>
              <button type="button" className="primary-action" onClick={handleResume} disabled={isMutating}>
                Resume subscription
              </button>
            </div>
          ) : currentPlan === "free" ? (
            <p>{t("billingpage.h22")}</p>
          ) : (
            <div>
              <p>
                Cancel at the end of the current period. You’ll keep access until{" "}
                <strong>{formatDate(subscription?.currentPeriodEnd)}</strong>.
              </p>
              <button type="button" className="secondary-action" onClick={handleCancel} disabled={isMutating}>
                Cancel at period end
              </button>
            </div>
          )}
        </section>

        <p style={{ opacity: 0.7, fontSize: 13 }}>
          Need help? <Link to="/about">{t("billingpage.h23")}</Link> · <Link to="/billing-policy">{t("billingpage.h24")}</Link>
        </p>
      </div>
    </>
  );
};

export default BillingPage;
