import React, { useCallback, useEffect, useState } from "react";
import GlassCard from "../../components/admin/GlassCard";
import PageHeader from "../components/ui/PageHeader";
import { adminGet, adminPost, adminPut, adminDelete } from "../api/client";

// ── Types ────────────────────────────────────────────────────────────────────
interface Plan {
  id: number;
  slug: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: string[];
  isActive: boolean;
}

const EMPTY_PLAN: Omit<Plan, "id"> = {
  slug: "",
  name: "",
  description: "",
  priceMonthly: 0,
  priceYearly: 0,
  currency: "USD",
  features: [],
  isActive: true,
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const C_GOLD = "#d1aa72";
const C_MUTED = "rgba(248,250,252,0.45)";
const C_DANGER = "#ff6b6b";
const C_SUCCESS = "#6ee7b7";

function Badge({ active }: { active: boolean }) {
  return (
    <span style={{
      padding: "2px 9px",
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 700,
      background: active ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.12)",
      color: active ? C_SUCCESS : C_DANGER,
      border: `1px solid ${active ? "#6ee7b733" : "#ff6b6b33"}`,
    }}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

// ── Plan Modal ───────────────────────────────────────────────────────────────
function PlanModal({
  plan,
  onClose,
  onSave,
}: {
  plan: Partial<Plan> | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const isNew = !plan?.id;
  const [form, setForm] = useState<Omit<Plan, "id">>({
    ...EMPTY_PLAN,
    ...(plan ?? {}),
    features: Array.isArray(plan?.features)
      ? plan!.features
      : typeof plan?.features === "string"
        ? JSON.parse(plan!.features as unknown as string)
        : [],
  });
  const [featuresText, setFeaturesText] = useState(
    (Array.isArray(plan?.features)
      ? plan!.features
      : typeof plan?.features === "string"
        ? JSON.parse(plan!.features as unknown as string)
        : []
    ).join("\n")
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const field = (key: keyof typeof form, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      setError("Name and slug are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
        priceMonthly: Number(form.priceMonthly),
        priceYearly: Number(form.priceYearly),
      };
      if (isNew) {
        await adminPost("/billing/plans", payload);
      } else {
        await adminPut(`/billing/plans/${plan!.id}`, payload);
      }
      onSave();
      onClose();
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "8px 12px",
    color: "#f8fafc",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    color: C_MUTED,
    marginBottom: 5,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        background: "#0f1823",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: "28px",
        width: "100%",
        maxWidth: 560,
        maxHeight: "90vh",
        overflowY: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ color: "#f8fafc", fontSize: 17, fontWeight: 900, margin: 0 }}>
            {isNew ? "Add Pricing Plan" : "Edit Pricing Plan"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C_MUTED, cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Plan Name *</label>
            <input style={inputStyle} value={form.name} onChange={(e) => field("name", e.target.value)} placeholder="e.g. Professional" />
          </div>

          <div>
            <label style={labelStyle}>Slug *</label>
            <input style={inputStyle} value={form.slug}
              onChange={(e) => field("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              placeholder="e.g. professional" />
          </div>

          <div>
            <label style={labelStyle}>Currency</label>
            <input style={inputStyle} value={form.currency} onChange={(e) => field("currency", e.target.value)} placeholder="USD" maxLength={3} />
          </div>

          <div>
            <label style={labelStyle}>Monthly Price ($)</label>
            <input style={inputStyle} type="number" min={0} step={0.01}
              value={form.priceMonthly} onChange={(e) => field("priceMonthly", e.target.value)} />
          </div>

          <div>
            <label style={labelStyle}>Yearly Price ($)</label>
            <input style={inputStyle} type="number" min={0} step={0.01}
              value={form.priceYearly} onChange={(e) => field("priceYearly", e.target.value)} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
              value={form.description} onChange={(e) => field("description", e.target.value)}
              placeholder="Short plan description shown on pricing page" />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Features (one per line)</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 110, fontFamily: "monospace", fontSize: 12 }}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder={"Real-time market data\nAdvanced screener\nCustom alerts"}
            />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10 }}>
            <label style={{ ...labelStyle, margin: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => field("isActive", e.target.checked)}
                style={{ width: 16, height: 16, cursor: "pointer" }} />
              <span>Active (visible on pricing page)</span>
            </label>
          </div>
        </div>

        {error && (
          <p style={{ color: C_DANGER, fontSize: 13, marginTop: 12, marginBottom: 0 }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
          <button onClick={onClose} style={{
            padding: "8px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.12)",
            background: "transparent", color: "#f8fafc", fontSize: 13, cursor: "pointer",
          }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            padding: "8px 24px", borderRadius: 8, border: "none",
            background: C_GOLD, color: "#0a0e14", fontSize: 13, fontWeight: 900, cursor: "pointer",
            opacity: saving ? 0.7 : 1,
          }}>
            {saving ? "Saving…" : isNew ? "Create Plan" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function PricingAdminPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalPlan, setModalPlan] = useState<Partial<Plan> | null | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminGet<Plan[]>("/billing/plans");
      setPlans(Array.isArray(res.data) ? res.data : []);
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchPlans(); }, [fetchPlans]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete plan "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await adminDelete(`/billing/plans/${id}`);
      setPlans((p) => p.filter((plan) => plan.id !== id));
    } catch {
      alert("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (plan: Plan) => {
    try {
      await adminPut(`/billing/plans/${plan.id}`, { ...plan, isActive: !plan.isActive });
      setPlans((p) => p.map((pp) => pp.id === plan.id ? { ...pp, isActive: !pp.isActive } : pp));
    } catch {
      alert("Update failed.");
    }
  };

  const parsedFeatures = (plan: Plan): string[] => {
    if (Array.isArray(plan.features)) return plan.features;
    try { return JSON.parse(plan.features as unknown as string); } catch { return []; }
  };

  const totalMonthlyRevenue = plans.reduce((s, p) => s + Number(p.priceMonthly), 0);
  const activePlans = plans.filter((p) => p.isActive).length;

  return (
    <div className="mp-admin-content">
      <PageHeader
        title="Pricing Plans"
        subtitle="Manage subscription plans shown on the public pricing page"
        actions={
          <button
            onClick={() => setModalPlan(null)}
            style={{
              padding: "8px 20px", borderRadius: 8, border: "none",
              background: C_GOLD, color: "#0a0e14", fontSize: 13, fontWeight: 900,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            + Add Plan
          </button>
        }
      />

      {/* KPI strip */}
      <section className="mp-admin-grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: "Total Plans", value: loading ? "…" : String(plans.length) },
          { label: "Active Plans", value: loading ? "…" : String(activePlans) },
          { label: "Price Range", value: loading ? "…" : plans.length ? `$0 – $${Math.max(...plans.map((p) => Number(p.priceMonthly)))} /mo` : "—" },
          { label: "Avg Monthly Price", value: loading || !plans.length ? "…" : `$${(totalMonthlyRevenue / plans.length).toFixed(2)}` },
        ].map((kpi) => (
          <GlassCard key={kpi.label}>
            <span className="mp-admin-kpi-label">{kpi.label}</span>
            <strong className="mp-admin-kpi-value" style={{ color: C_GOLD, fontSize: 26, display: "block", marginTop: 6 }}>
              {kpi.value}
            </strong>
          </GlassCard>
        ))}
      </section>

      {/* Plans table */}
      <GlassCard>
        <div className="mp-admin-card-head">
          <h3 style={{ color: "#f8fafc", fontSize: 15, fontWeight: 900, margin: 0 }}>Plans</h3>
          <button onClick={() => setModalPlan(null)} style={{
            padding: "5px 14px", borderRadius: 6, border: `1px solid ${C_GOLD}55`,
            background: `${C_GOLD}18`, color: C_GOLD, fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>
            + New Plan
          </button>
        </div>

        {loading ? (
          <p className="mp-admin-muted" style={{ padding: "24px 0", textAlign: "center" }}>Loading plans…</p>
        ) : plans.length === 0 ? (
          <div style={{ padding: "36px 0", textAlign: "center" }}>
            <p className="mp-admin-muted" style={{ marginBottom: 14 }}>No pricing plans yet.</p>
            <button onClick={() => setModalPlan(null)} style={{
              padding: "8px 22px", borderRadius: 8, border: "none",
              background: C_GOLD, color: "#0a0e14", fontSize: 13, fontWeight: 900, cursor: "pointer",
            }}>
              Create First Plan
            </button>
          </div>
        ) : (
          <div className="mp-admin-table-wrap">
            <table className="mp-admin-table">
              <thead>
                <tr>
                  {["Plan", "Slug", "Monthly", "Yearly", "Features", "Status", "Actions"].map((h) => (
                    <th key={h} style={h === "Actions" ? { textAlign: "right" } : undefined}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td>
                      <span style={{ fontWeight: 900, color: "#f8fafc" }}>{plan.name}</span>
                      {plan.description && (
                        <div style={{ fontSize: 11, color: C_MUTED, marginTop: 2, maxWidth: 200 }}>{plan.description}</div>
                      )}
                    </td>
                    <td>
                      <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 7px", borderRadius: 4, fontSize: 11, color: C_GOLD }}>
                        {plan.slug}
                      </code>
                    </td>
                    <td style={{ fontWeight: 900, color: C_GOLD }}>
                      {Number(plan.priceMonthly) === 0 ? "Free" : `$${Number(plan.priceMonthly).toFixed(2)}`}
                    </td>
                    <td style={{ color: C_GOLD }}>
                      {Number(plan.priceYearly) === 0 ? "Free" : `$${Number(plan.priceYearly).toFixed(2)}`}
                    </td>
                    <td>
                      <span style={{ color: C_MUTED, fontSize: 12 }}>
                        {parsedFeatures(plan).length} features
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleActive(plan)}
                        title="Click to toggle"
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        <Badge active={plan.isActive} />
                      </button>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button
                          onClick={() => setModalPlan(plan)}
                          style={{
                            padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                            color: "#f8fafc", cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id, plan.name)}
                          disabled={deletingId === plan.id}
                          style={{
                            padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                            background: "rgba(239,68,68,0.10)", border: "1px solid #ff6b6b33",
                            color: C_DANGER, cursor: "pointer",
                            opacity: deletingId === plan.id ? 0.6 : 1,
                          }}
                        >
                          {deletingId === plan.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Features preview cards */}
      {plans.length > 0 && (
        <GlassCard style={{ marginTop: 16 }}>
          <div className="mp-admin-card-head">
            <h3 style={{ color: "#f8fafc", fontSize: 15, fontWeight: 900, margin: 0 }}>Plan Features Preview</h3>
            <span className="mp-admin-muted" style={{ fontSize: 12 }}>As shown on public pricing page</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, marginTop: 4 }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: "14px 16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontWeight: 900, color: "#f8fafc", fontSize: 13 }}>{plan.name}</span>
                  <span style={{ color: C_GOLD, fontWeight: 700, fontSize: 13 }}>
                    {Number(plan.priceMonthly) === 0 ? "Free" : `$${Number(plan.priceMonthly)}/mo`}
                  </span>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {parsedFeatures(plan).slice(0, 5).map((f, i) => (
                    <li key={i} style={{ fontSize: 11, color: C_MUTED, padding: "2px 0", display: "flex", gap: 6, alignItems: "flex-start" }}>
                      <span style={{ color: "#6ee7b7", marginTop: 1, flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                  {parsedFeatures(plan).length > 5 && (
                    <li style={{ fontSize: 11, color: C_MUTED, paddingTop: 4 }}>
                      +{parsedFeatures(plan).length - 5} more…
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Modal */}
      {modalPlan !== undefined && (
        <PlanModal
          plan={modalPlan}
          onClose={() => setModalPlan(undefined)}
          onSave={fetchPlans}
        />
      )}
    </div>
  );
}
