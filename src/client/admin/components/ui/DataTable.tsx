import React from "react";
import { SkeletonTable } from "../../../components/Skeleton";
import EmptyState from "../../../components/EmptyState";

export type Column<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T extends Record<string, any>>({
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
    return (
      <div style={{ padding: 12 }}>
        <SkeletonTable rows={6} columns={Math.max(3, columns.length)} />
      </div>
    );
  }

  if (!rows.length) {
    return <EmptyState compact icon="📭" title={emptyMessage} />;
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
