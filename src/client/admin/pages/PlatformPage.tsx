import React from "react";
import { adminGet } from "../api/client";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";

export default function PlatformPage({ tab }: { tab: "api" | "seo" | "ads" | "audit" }) {
  const [rows, setRows] = React.useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = React.useState(true);

  const config = {
    api: { title: "API Management", path: "/platform/api-keys", subtitle: "Keys, rate limits, usage" },
    seo: { title: "SEO Management", path: "/platform/seo", subtitle: "Meta tags and canonical URLs" },
    ads: { title: "Advertisements", path: "/platform/ads", subtitle: "Campaigns and placements" },
    audit: { title: "Audit Logs", path: "/audit-logs", subtitle: "Admin action trail" },
  }[tab];

  React.useEffect(() => {
    (async () => {
      try {
        const res = await adminGet<Record<string, unknown>[]>(config.path, tab === "audit" ? { page: 1, limit: 50 } : undefined);
        setRows(res.data);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [config.path, tab]);

  return (
    <div className="mp-admin-content">
      <PageHeader title={config.title} subtitle={config.subtitle} />
      <DataTable loading={loading} rows={rows} columns={
        tab === "audit"
          ? [
              { key: "action", label: "Action" },
              { key: "resource", label: "Resource" },
              { key: "actorEmail", label: "Actor" },
              { key: "created_at", label: "When", render: (r) => new Date(String(r.created_at)).toLocaleString() },
            ]
          : [
              { key: "name", label: "Name" },
              { key: "id", label: "ID" },
            ]
      } />
    </div>
  );
}
