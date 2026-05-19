/** Formats Sanity `date` strings (YYYY-MM-DD) as `MM.DD.YYYY` (US order, dot separators). */
export function formatEventDate(isoDate: string | undefined | null): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return "";
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${mm}.${dd}.${y}`;
}

function parseIsoDateParts(isoDate: string | undefined | null) {
  if (!isoDate) return null;
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return null;
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return {
    year: y,
    monthDay: `${mm}.${dd}`,
  };
}

export function formatEventDateRange(
  fromIso: string | undefined | null,
  toIso: string | undefined | null,
): string {
  const from = parseIsoDateParts(fromIso);
  if (!from) return "";
  const to = parseIsoDateParts(toIso);
  if (!to) return `${from.monthDay}.${from.year}`;
  if (to.monthDay === from.monthDay && to.year === from.year) {
    return `${from.monthDay}.${from.year}`;
  }
  if (to.year === from.year) {
    return `${from.monthDay}–${to.monthDay}.${from.year}`;
  }
  return `${from.monthDay}.${from.year}–${to.monthDay}.${to.year}`;
}
