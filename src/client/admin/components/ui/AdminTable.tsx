import React from "react";
import { SkeletonTable } from "../../../components/Skeleton";
import EmptyState from "../../../components/EmptyState";
import { useI18n } from "../../../i18n";



export type SortDir = "asc" | "desc";

export interface AdminColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
  /** Accessor used for sorting and CSV export when render is custom */
  value?: (row: T) => string | number | boolean | null | undefined;
}

export interface AdminTableProps<T extends { id: string }> {
  columns: AdminColumn<T>[];
  rows: T[];
  loading?: boolean;
  emptyMessage?: string;
  pageSize?: number;
  selection?: string[];
  onToggleSelect?: (id: string) => void;
  onToggleAll?: (allOnPage: T[]) => void;
  onRowClick?: (row: T) => void;
  rowActions?: (row: T) => React.ReactNode;
  initialSort?: { key: keyof T | string; dir: SortDir };
}

export default function AdminTable<T extends { id: string }>({
  columns,
  rows,
  loading,
  emptyMessage = "No records found",
  pageSize = 25,
  selection,
  onToggleSelect,
  onToggleAll,
  onRowClick,
  rowActions,
  initialSort,
}: AdminTableProps<T>) {
  const { t } = useI18n();
  const [page, setPage] = React.useState(1);
  const [sortKey, setSortKey] = React.useState<keyof T | string | null>(
    initialSort?.key ?? null
  );
  const [sortDir, setSortDir] = React.useState<SortDir>(initialSort?.dir ?? "asc");

  const sorted = React.useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    const accessor = (row: T) => {
      if (col?.value) return col.value(row);
      const raw = (row as Record<string, unknown>)[String(sortKey)];
      return raw as string | number | boolean | null | undefined;
    };
    return [...rows].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [rows, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const handleSort = (key: keyof T | string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const allSelected =
    selection != null &&
    pageRows.length > 0 &&
    pageRows.every((r) => selection.includes(r.id));

  if (loading) {
    return (
      <div style={{ padding: 12 }}>
        <SkeletonTable rows={6} columns={Math.max(3, columns.length)} />
      </div>
    );
  }
  if (!rows.length) {
    return (
      <EmptyState
        compact
        icon="📭"
        title={emptyMessage}
      />
    );
  }

  return (
    <div className="mp-admin-table-wrap">
      <table className="mp-admin-table">
        <thead>
          <tr>
            {selection != null && onToggleSelect && (
              <th style={{ width: 36 }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onToggleAll?.(pageRows)}
                  aria-label={t("src_client_admin_components_ui_admintable__l124__h0")}
                />
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sortKey === col.key;
              const sortable = col.sortable ?? true;
              return (
                <th
                  key={String(col.key)}
                  style={{
                    width: col.width,
                    textAlign: col.align ?? "left",
                    cursor: sortable ? "pointer" : "default",
                    userSelect: "none",
                  }}
                  onClick={sortable ? () => handleSort(col.key) : undefined}
                  aria-sort={
                    isSorted ? (sortDir === "asc" ? "ascending" : "descending") : "none"
                  }
                >
                  {col.label}
                  {isSorted && (
                    <span style={{ marginLeft: 6, opacity: 0.7 }}>
                      {sortDir === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              );
            })}
            {rowActions && <th style={{ width: 1 }} />}
          </tr>
        </thead>
        <tbody>
          {pageRows.map((row) => {
            const isSelected = selection?.includes(row.id) ?? false;
            return (
              <tr
                key={row.id}
                className={onRowClick ? "mp-admin-table-row-click" : undefined}
                style={isSelected ? { background: "rgba(209,170,114,0.08)" } : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {selection != null && onToggleSelect && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(row.id)}
                      aria-label={t("adminTable.selectRow", { id: row.id })}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={String(col.key)} style={{ textAlign: col.align ?? "left" }}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[String(col.key)] ?? "—")}
                  </td>
                ))}
                {rowActions && (
                  <td onClick={(e) => e.stopPropagation()} style={{ whiteSpace: "nowrap" }}>
                    {rowActions(row)}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div
          className="mp-admin-table-pager"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 12px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(248,250,252,0.65)",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span>
            {t("adminTable.showingRange", {
              from: (safePage - 1) * pageSize + 1,
              to: Math.min(safePage * pageSize, sorted.length),
              total: sorted.length,
            })}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              className="mp-admin-link-btn"
              onClick={() => setPage(1)}
              disabled={safePage === 1}
            >
              «
            </button>
            <button
              type="button"
              className="mp-admin-link-btn"
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 1}
            >
              ‹
            </button>
            <span style={{ padding: "0 8px" }}>
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              className="mp-admin-link-btn"
              onClick={() => setPage(safePage + 1)}
              disabled={safePage === totalPages}
            >
              ›
            </button>
            <button
              type="button"
              className="mp-admin-link-btn"
              onClick={() => setPage(totalPages)}
              disabled={safePage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
