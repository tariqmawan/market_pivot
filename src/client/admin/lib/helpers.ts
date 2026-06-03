// Shared helpers for admin pages: CSV export, deterministic IDs, search helpers.

export function toCsv<T extends Record<string, unknown>>(
  rows: T[],
  headers?: Array<{ key: keyof T & string; label: string }>
): string {
  if (rows.length === 0) return "";
  const cols =
    headers ??
    (Object.keys(rows[0]) as Array<keyof T & string>).map((k) => ({
      key: k,
      label: k,
    }));
  const escape = (cell: unknown): string => {
    if (cell == null) return "";
    if (Array.isArray(cell)) cell = cell.join("; ");
    const s = String(cell);
    if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const header = cols.map((c) => escape(c.label)).join(",");
  const body = rows
    .map((r) => cols.map((c) => escape(r[c.key])).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function matchesSearch(value: unknown, query: string): boolean {
  if (!query) return true;
  if (value == null) return false;
  return String(value).toLowerCase().includes(query.toLowerCase());
}

export function formatDateTime(ts: number | string | Date): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}
