/** Formats Sanity `date` strings (YYYY-MM-DD) as `DD.MM.YYYY`. */
export function formatEventDate(isoDate: string | undefined | null): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return "";
  const dd = String(d).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${dd}.${mm}.${y}`;
}

function parseIsoDateParts(isoDate: string | undefined | null) {
  if (!isoDate) return null;
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return null;
  const dd = String(d).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return {
    year: y,
    monthDay: `${dd}.${mm}`,
  };
}

export function formatEventDateRange(
  fromIso: string | undefined | null,
  toIso: string | undefined | null,
): string {
  const from = parseIsoDateParts(fromIso);
  if (!from) return "";
  const to = parseIsoDateParts(toIso);
  if (!to) return `${from.monthDay} ${from.year}`;
  if (to.monthDay === from.monthDay && to.year === from.year) {
    return `${from.monthDay} ${from.year}`;
  }
  if (to.year === from.year) {
    return `${from.monthDay}–${to.monthDay}.${from.year}`;
  }
  return `${from.monthDay}.${from.year}–${to.monthDay}.${to.year}`;
}
