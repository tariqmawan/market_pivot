import React from "react";
import { adminDelete, adminGet, adminPost } from "../api/client";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import { useI18n } from "../../i18n";



interface NewsRow {
  id: number;
  title: string;
  source: string;
  category: string;
  publishedAt: string;
  url: string;
}

export default function NewsPage() {
  const { t } = useI18n();
  const [rows, setRows] = React.useState<NewsRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ title: "", source: "", url: "", category: "Markets" });

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminGet<NewsRow[]>("/news", { page: 1, limit: 30 });
      setRows(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { void load(); }, [load]);

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminPost("/news", { ...form, content: form.title, description: form.title });
      setForm({ title: "", source: "", url: "", category: "Markets" });
      void load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete article?")) return;
    await adminDelete(`/news/${id}`);
    void load();
  };

  return (
    <div className="mp-admin-content">
      <PageHeader title={t("admin/newspage.h0")} subtitle="Publish, draft workflow, and article management" />

      <form className="mp-admin-form-card" onSubmit={publish}>
        <h3>{t("admin/newspage.h1")}</h3>
        <div className="mp-admin-form-grid">
          <input placeholder={t("admin/newspage.h2")} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input placeholder={t("admin/newspage.h3")} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} required />
          <input placeholder={t("admin/newspage.h4")} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
          <input placeholder={t("admin/newspage.h5")} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        </div>
        <button type="submit" className="mp-admin-action-btn">{t("admin/newspage.h6")}</button>
      </form>

      {error ? <p className="mp-admin-error-text">{error}</p> : null}

      <DataTable<NewsRow>
        loading={loading}
        rows={rows}
        columns={[
          { key: "title", label: "Title" },
          { key: "source", label: "Source" },
          { key: "category", label: "Category" },
          { key: "publishedAt", label: "Published", render: (r) => new Date(r.publishedAt).toLocaleString() },
          { key: "del", label: "", render: (r) => (
            <button type="button" className="mp-admin-link-btn" onClick={() => void remove(r.id)}>{t("admin/newspage.h7")}</button>
          )},
        ]}
      />
    </div>
  );
}
