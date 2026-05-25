import React from "react";
import { adminGet } from "../api/client";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";

export default function BillingPage() {
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
        setPlans(p.data);
        setSubs(s.data);
      } catch {
        /* tables may be empty before seed */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mp-admin-content">
      <PageHeader title="Billing & Subscriptions" subtitle="Plans, active subscriptions, revenue lifecycle" />
      <h3>Plans</h3>
      <DataTable loading={loading} rows={plans} columns={[
        { key: "name", label: "Plan" },
        { key: "slug", label: "Slug" },
        { key: "priceMonthly", label: "Monthly" },
        { key: "isActive", label: "Active" },
      ]} emptyMessage="No plans — run db:migrate and seed subscription plans" />
      <h3 style={{ marginTop: 24 }}>Active subscriptions</h3>
      <DataTable loading={loading} rows={subs} columns={[
        { key: "email", label: "User" },
        { key: "planName", label: "Plan" },
        { key: "status", label: "Status" },
      ]} />
    </div>
  );
}
