/** Formats Sanity `date` strings (YYYY-MM-DD) as `JAN 22, 2026`. */
export function formatEventDate(isoDate: string | undefined | null): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return "";
  const date = new Date(Date.UTC(y, m - 1, d));
  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();
}

export function formatEventDateRange(
  fromIso: string | undefined | null,
  toIso: string | undefined | null,
): string {
  const from = formatEventDate(fromIso);
  if (!from) return "";
  const to = formatEventDate(toIso);
  if (!to || to === from) return from;
  return `${from} — ${to}`;
}
