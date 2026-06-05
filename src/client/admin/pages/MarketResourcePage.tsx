import React from "react";
import { adminGet, adminPut } from "../api/client";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import { useI18n } from "../../i18n";



export default function MarketResourcePage({
  entity,
  title,
  subtitle,
}: {
  entity: string;
  title: string;
  subtitle: string;
}) {
  const { t } = useI18n();
  const [rows, setRows] = React.useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<Record<string, unknown> | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminGet<Record<string, unknown>[]>(`/market/${entity}`, { page: 1, limit: 50, search });
      setRows(res.data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [entity, search]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const idField = entity === "currencies" ? "code" : entity === "etfs" || entity === "indices" ? "symbol" : "id";

  const saveEdit = async () => {
    if (!editing) return;
    const id = editing[idField];
    try {
      await adminPut(`/market/${entity}/${id}`, {
        name: editing.name,
        description: editing.description,
        marketCap: editing.marketCap,
        website: editing.website,
      });
      setEditing(null);
      void load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  const cols = [
    { key: idField, label: "ID" },
    { key: "name", label: "Name" },
    {
      key: "actions",
      label: "",
      render: (r: Record<string, unknown>) => (
        <button type="button" className="mp-admin-link-btn" onClick={() => setEditing({ ...r })}>
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="mp-admin-content">
      <PageHeader title={title} subtitle={subtitle} />
      <div className="mp-admin-toolbar">
        <input className="mp-admin-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("src_client_admin_pages_marketresourcepage__l75__h0")} />
        <button type="button" className="mp-admin-action-btn" onClick={() => void load()}>{t("src_client_admin_pages_marketresourcepage__l76__h1")}</button>
      </div>
      {error ? <p className="mp-admin-error-text">{error}</p> : null}
      <DataTable columns={cols} rows={rows} loading={loading} keyField={idField} />

      {editing ? (
        <div className="mp-admin-modal-overlay" onClick={() => setEditing(null)}>
          <div className="mp-admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{t("src_client_admin_pages_marketresourcepage__l84__h2")}</h3>
            <label>{t("src_client_admin_pages_marketresourcepage__l85__h3")}<input value={String(editing.name ?? "")} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label>
            <div className="mp-admin-modal-actions">
              <button type="button" className="mp-admin-action-btn" onClick={() => void saveEdit()}>{t("src_client_admin_pages_marketresourcepage__l87__h4")}</button>
              <button type="button" className="mp-admin-link-btn" onClick={() => setEditing(null)}>{t("src_client_admin_pages_marketresourcepage__l88__h5")}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
