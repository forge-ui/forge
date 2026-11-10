// Export the rows a demo table currently shows. Only primitive fields are written; nested objects are skipped.
export function downloadCsv<T extends object>(filename: string, rows: T[]) {
  const records = rows as Record<string, unknown>[];
  const columns = Object.keys(records[0] ?? {}).filter((key) => records.every((row) => row[key] === undefined || ["string", "number", "boolean"].includes(typeof row[key])));
  const escape = (value: unknown) => {
    const text = value === undefined || value === null ? "" : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const csv = [columns.join(","), ...records.map((row) => columns.map((column) => escape(row[column])).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: filename });
  link.click();
  URL.revokeObjectURL(url);
}
