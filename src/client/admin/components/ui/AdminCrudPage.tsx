import React from "react";
import PageHeader from "./PageHeader";
import AdminSearch from "./AdminSearch";
import AdminFilters, { type AdminFilterDef } from "./AdminFilters";
import AdminTable, { type AdminColumn } from "./AdminTable";
import AdminBulkActions, { type BulkAction } from "./AdminBulkActions";
import AdminCrudModal from "./AdminCrudModal";
import AdminFormBuilder, { type FormFieldDef } from "./AdminFormBuilder";
import AdminAnalyticsCards, {
  type AdminAnalyticsCard,
} from "./AdminAnalyticsCards";
import { downloadCsv, toCsv, matchesSearch } from "../../lib/helpers";
import type { CrudStoreState, CrudEntity } from "../../lib/createCrudStore";

export interface AdminCrudPageProps<T extends CrudEntity> {
  title: string;
  subtitle: string;
  useStore: () => CrudStoreState<T>;
  /** Columns shown in the listing table */
  columns: AdminColumn<T>[];
  /** Form fields for the create/edit modal */
  formFields: FormFieldDef<T & Record<string, unknown>>[];
  /** Filter definitions (key → option list / placeholder) */
  filters?: AdminFilterDef[];
  /** Analytic summary cards rendered above the table */
  analytics?: (items: T[]) => AdminAnalyticsCard[];
  /** Default values for new entries (used to seed the create modal) */
  defaultEntry: Omit<T, "id" | "createdAt" | "updatedAt">;
  /** Fields applied to the search filter (free-text) */
  searchKeys: Array<keyof T & string>;
  /** Optional extra row actions (rendered after Edit / Delete) */
  rowExtraActions?: (row: T) => React.ReactNode;
  /** Optional additional filter logic */
  filterFn?: (row: T, filters: Record<string, string>) => boolean;
  /** Optional ID prefix for export filename */
  exportName?: string;
  /** Optional custom bulk actions */
  extraBulkActions?: BulkAction[];
  /** Optional validation hook for the form */
  validate?: (entry: T) => Partial<Record<keyof T, string>>;
}

export default function AdminCrudPage<T extends CrudEntity>({
  title,
  subtitle,
  useStore,
  columns,
  formFields,
  filters,
  analytics,
  defaultEntry,
  searchKeys,
  rowExtraActions,
  filterFn,
  exportName,
  extraBulkActions,
  validate,
}: AdminCrudPageProps<T>) {
  const store = useStore();
  const [search, setSearch] = React.useState("");
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<T | null>(null);
  const [draft, setDraft] = React.useState<T>(
    () => ({ ...defaultEntry, id: "", createdAt: 0, updatedAt: 0 } as T)
  );
  const [formErrors, setFormErrors] = React.useState<Partial<Record<keyof T, string>>>({});

  const openCreate = () => {
    setEditing(null);
    setDraft({ ...defaultEntry, id: "", createdAt: 0, updatedAt: 0 } as T);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (row: T) => {
    setEditing(row);
    setDraft({ ...row });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = () => {
    if (validate) {
      const errs = validate(draft);
      if (Object.keys(errs).length > 0) {
        setFormErrors(errs);
        return;
      }
    }
    if (editing) {
      store.update(editing.id, draft);
    } else {
      const { id: _id, createdAt: _ca, updatedAt: _ua, ...payload } = draft as Record<
        string,
        unknown
      >;
      void _id;
      void _ca;
      void _ua;
      store.add(payload as Omit<T, "id" | "createdAt" | "updatedAt">);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;
    store.remove(id);
  };

  const filtered = React.useMemo(() => {
    return store.items.filter((row) => {
      const rec = row as unknown as Record<string, unknown>;
      // search
      if (search) {
        const hit = searchKeys.some((k) => matchesSearch(rec[k as string], search));
        if (!hit) return false;
      }
      // built-in equality filters
      for (const [key, val] of Object.entries(filterValues)) {
        if (!val) continue;
        if (filterFn) continue; // custom filter handles it
        if (String(rec[key] ?? "") !== val) return false;
      }
      // custom filter
      if (filterFn && !filterFn(row, filterValues)) return false;
      return true;
    });
  }, [store.items, search, filterValues, searchKeys, filterFn]);

  const handleExport = () => {
    const csv = toCsv(
      filtered as unknown as Record<string, unknown>[],
      columns
        .filter((c) => c.key !== "actions")
        .map((c) => ({ key: String(c.key), label: c.label }))
    );
    downloadCsv(
      `${exportName ?? title.replace(/\s+/g, "-").toLowerCase()}-${new Date()
        .toISOString()
        .split("T")[0]}.csv`,
      csv
    );
  };

  const cards = analytics?.(filtered) ?? [];

  return (
    <div className="mp-admin-content">
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <>
            <button
              type="button"
              className="mp-admin-link-btn"
              onClick={handleExport}
            >
              📥 Export CSV
            </button>
            <button
              type="button"
              className="mp-admin-action-btn"
              onClick={openCreate}
            >
              + New
            </button>
          </>
        }
      />

      {cards.length > 0 && <AdminAnalyticsCards cards={cards} columns={Math.min(cards.length, 5) as 2 | 3 | 4 | 5} />}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          alignItems: "flex-end",
          marginBottom: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 220 }}>
          <AdminSearch
            value={search}
            onChange={setSearch}
            placeholder={`Search ${title.toLowerCase()}…`}
          />
        </div>
        {filters && filters.length > 0 && (
          <AdminFilters
            filters={filters}
            value={filterValues}
            onChange={(k, v) => setFilterValues((prev) => ({ ...prev, [k]: v }))}
            onReset={() => setFilterValues({})}
          />
        )}
      </div>

      <AdminBulkActions
        selection={store.selection}
        total={filtered.length}
        actions={[
          {
            label: `Delete (${store.selection.length})`,
            destructive: true,
            confirm: `Delete ${store.selection.length} selected records?`,
            onRun: (ids) => store.removeMany(ids),
          },
          ...(extraBulkActions ?? []),
        ]}
        onClear={() => store.clearSelection()}
      />

      <AdminTable
        columns={columns}
        rows={filtered}
        selection={store.selection}
        onToggleSelect={(id) => store.toggleSelection(id)}
        onToggleAll={(pageRows) => {
          const ids = pageRows.map((r) => r.id);
          const allOn = ids.every((id) => store.selection.includes(id));
          store.setSelection(
            allOn
              ? store.selection.filter((id) => !ids.includes(id))
              : Array.from(new Set([...store.selection, ...ids]))
          );
        }}
        rowActions={(row) => (
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              className="mp-admin-link-btn"
              onClick={() => openEdit(row)}
            >
              Edit
            </button>
            <button
              type="button"
              className="mp-admin-link-btn"
              onClick={() => handleDelete(row.id)}
              style={{ color: "#ff9090" }}
            >
              Delete
            </button>
            {rowExtraActions?.(row)}
          </div>
        )}
        emptyMessage={`No ${title.toLowerCase()} yet. Click "+ New" to create one.`}
      />

      <AdminCrudModal
        open={modalOpen}
        title={editing ? `Edit ${title.replace(/s$/i, "")}` : `New ${title.replace(/s$/i, "")}`}
        subtitle={editing ? `ID: ${editing.id}` : subtitle}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        saveLabel={editing ? "Save changes" : "Create"}
      >
        <AdminFormBuilder
          fields={formFields}
          value={draft as unknown as Record<string, unknown>}
          errors={formErrors as Partial<Record<string, string>>}
          onChange={(k, v) =>
            setDraft((prev) => ({ ...prev, [k as keyof T]: v as never }))
          }
        />
      </AdminCrudModal>
    </div>
  );
}
