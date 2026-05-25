import React from "react";

export type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
};

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  keyField = "id",
  loading,
  emptyMessage = "No records found",
  onRowClick,
}: {
  columns: Column<T>[];
  rows: T[];
  keyField?: string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}) {
  if (loading) {
    return <div className="mp-admin-table-loading">Loading…</div>;
  }

  if (!rows.length) {
    return <div className="mp-admin-table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="mp-admin-table-wrap">
      <table className="mp-admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={String(row[keyField] ?? row.id ?? row.code)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? "mp-admin-table-row-click" : undefined}
            >
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : String(row[col.key] ?? "—")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
