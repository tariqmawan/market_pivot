import React from "react";
import { adminGet } from "../api/client";
import GlassCard from "../../components/admin/GlassCard";
import PageHeader from "../components/ui/PageHeader";
import { useI18n } from "../../i18n";



const C_GOLD = "#d1aa72";
const C_MUTED = "rgba(248,250,252,0.55)";

function Badge({ children, color = "rgba(16,185,129,0.15)", text = "#6ee7b7" }: { children: React.ReactNode; color?: string; text?: string }) {
  return (
    <span style={{ padding: "3px 10px", background: color, color: text, fontWeight: 800, fontSize: 11, border: `1px solid ${text}33` }}>
      {children}
    </span>
  );
}

export default function BillingPage() {
  const { t } = useI18n();
  const [plans, setPlans] = React.useState<Record<string, unknown>[]>([]);
  const [subs, setSubs] = React.useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const [p, s] = await Promise.all([
          adminGet<Record<string, unknown>[]>("/billing/plans"),
          adminGet<Record<string, unknown>[]>("/billing/subscriptions"),
        ]);
        setPlans(Array.isArray(p.data) ? p.data : []);
        setSubs(Array.isArray(s.data) ? s.data : []);
      } catch { /* tables may be empty */ }
      finally { setLoading(false); }
    })();
  }, []);

  const totalMRR = subs.reduce((sum, s) => sum + (Number(s.priceMonthly) || 0), 0);
  const activeSubs = subs.filter((s) => s.status === "active").length;

  return (
    <div className="mp-admin-content">
      <PageHeader title={t("admin/billingpage.h0_l41")} subtitle={t("adminBillingSubtitle")} />

      {/* KPI strip */}
      <section className="mp-admin-grid-4">
        {[
          { label: t("adminBillingKpiPlansAvailable"), value: loading ? "…" : String(plans.length) },
          { label: t("adminBillingKpiActiveSubscriptions"), value: loading ? "…" : String(activeSubs) },
          { label: t("adminBillingKpiTotalSubscriptions"), value: loading ? "…" : String(subs.length) },
          { label: t("adminBillingKpiMrrEstimate"), value: loading ? "…" : `$${totalMRR.toFixed(2)}` },
        ].map((kpi) => (
          <GlassCard key={kpi.label}>
            <span className="mp-admin-kpi-label">{kpi.label}</span>
            <strong className="mp-admin-kpi-value" style={{ color: C_GOLD, fontSize: 26, display: "block", marginTop: 6 }}>
              {kpi.value}
            </strong>
          </GlassCard>
        ))}
      </section>

      {/* Plans */}
      <GlassCard style={{ marginTop: 18 }}>
        <div className="mp-admin-card-head">
          <h3 style={{ color: "#f8fafc", fontSize: 15, fontWeight: 900 }}>{t("admin/billingpage.h1")}</h3>
          <span className="mp-admin-muted">{t("adminBillingPlansConfigured", { count: plans.length })}</span>
        </div>

        {loading ? (
          <p className="mp-admin-muted">{t("admin/billingpage.h2")}</p>
        ) : plans.length === 0 ? (
          <div style={{ padding: "24px 0", textAlign: "center" }}>
            <p className="mp-admin-muted" style={{ marginBottom: 12 }}>{t("admin/billingpage.h0_l75")} <code style={{ background: "rgba(255,255,255,0.08)", padding: "2px 6px" }}>{t("admin/billingpage.h4")}</code> {t("adminBillingToSeed")}</p>
          </div>
        ) : (
          <div className="mp-admin-table-wrap">
            <table className="mp-admin-table">
              <thead>
                <tr>
                  {[t("adminBillingThPlan"), t("adminBillingThSlug"), t("adminBillingThMonthly"), t("adminBillingThAnnual"), t("adminBillingThStatus")].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 900 }}>{String(plan.name ?? "—")}</td>
                    <td><code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", fontSize: 11 }}>{String(plan.slug ?? "—")}</code></td>
                    <td style={{ color: C_GOLD, fontWeight: 900 }}>${String(plan.priceMonthly ?? "0")}</td>
                    <td style={{ color: C_GOLD }}>${String(plan.priceAnnual ?? "0")}</td>
                    <td>
                      {plan.isActive
                        ? <Badge>{t("admin/billingpage.h6")}</Badge>
                        : <Badge color="rgba(239,68,68,0.12)" text="#ff7070">{t("admin/billingpage.h7")}</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Subscriptions */}
      <GlassCard style={{ marginTop: 14 }}>
        <div className="mp-admin-card-head">
          <h3 style={{ color: "#f8fafc", fontSize: 15, fontWeight: 900 }}>{t("admin/billingpage.h8")}</h3>
          <span className="mp-admin-muted">{t("adminBillingSubsTotal", { count: subs.length })}</span>
        </div>

        {loading ? (
          <p className="mp-admin-muted">{t("admin/billingpage.h9")}</p>
        ) : subs.length === 0 ? (
          <div style={{ padding: "24px 0", textAlign: "center" }}>
            <p className="mp-admin-muted">{t("admin/billingpage.h10")}</p>
          </div>
        ) : (
          <div className="mp-admin-table-wrap">
            <table className="mp-admin-table">
              <thead>
                <tr>
                  {[t("adminBillingThUser"), t("adminBillingThPlan"), t("adminBillingThStatus"), t("adminBillingThStarted"), t("adminBillingThRenews")].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.map((sub, i) => {
                  const status = String(sub.status ?? "");
                  return (
                    <tr key={i}>
                      <td>{String(sub.email ?? sub.userId ?? "—")}</td>
                      <td style={{ color: C_GOLD, fontWeight: 800 }}>{String(sub.planName ?? sub.plan ?? "—")}</td>
                      <td>
                        {status === "active"
                          ? <Badge>{t("admin/billingpage.h11")}</Badge>
                          : status === "cancelled"
                            ? <Badge color="rgba(239,68,68,0.12)" text="#ff7070">{t("admin/billingpage.h12")}</Badge>
                            : <Badge color="rgba(234,179,8,0.12)" text="#fbbf24">{status || t("adminBillingUnknown")}</Badge>}
                      </td>
                      <td style={{ color: C_MUTED, fontSize: 12 }}>
                        {sub.startedAt ? new Date(String(sub.startedAt)).toLocaleDateString() : "—"}
                      </td>
                      <td style={{ color: C_MUTED, fontSize: 12 }}>
                        {sub.currentPeriodEnd ? new Date(String(sub.currentPeriodEnd)).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
