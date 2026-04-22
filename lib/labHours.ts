/** Lab open/closed uses America/New_York for both clock display and schedule matching. */

const TZ = "America/New_York";

export type DayScheduleConfig = {
  closed?: boolean | null;
  openTime?: string | null;
  closeTime?: string | null;
};

export type LabClockSchedule = {
  monday?: DayScheduleConfig | null;
  tuesday?: DayScheduleConfig | null;
  wednesday?: DayScheduleConfig | null;
  thursday?: DayScheduleConfig | null;
  friday?: DayScheduleConfig | null;
  saturday?: DayScheduleConfig | null;
  sunday?: DayScheduleConfig | null;
};

function nyWeekdayShort(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
  })
    .format(date)
    .toLowerCase();
}

/** Which schedule key matches the current calendar day in New York. */
function nyWeekdayScheduleKey(
  date: Date,
): keyof LabClockSchedule {
  const wd = nyWeekdayShort(date);
  if (wd.startsWith("sun")) return "sunday";
  if (wd.startsWith("mon")) return "monday";
  if (wd.startsWith("tue")) return "tuesday";
  if (wd.startsWith("wed")) return "wednesday";
  if (wd.startsWith("thu")) return "thursday";
  if (wd.startsWith("fri")) return "friday";
  return "saturday";
}

function nyTimeParts(date: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      hour: "numeric",
      hour12: false,
    }).format(date),
  );
  const minute = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      minute: "numeric",
    }).format(date),
  );
  return { hour, minute };
}

function minutesSinceMidnight(hour: number, minute: number) {
  return hour * 60 + minute;
}

/** Parses "9:30", "09:30" → minutes from midnight; invalid → null */
function parseTimeToMinutes(value: string | null | undefined): number | null {
  if (!value?.trim()) return null;
  const m = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (Number.isNaN(h) || Number.isNaN(min) || h > 23 || min > 59) return null;
  return minutesSinceMidnight(h, min);
}

/**
 * True if the lab is open at `date` per the CMS weekly schedule (interpreted in New York).
 * Missing schedule or missing day config → closed.
 */
export function isLabOpenNow(
  date: Date,
  schedule: LabClockSchedule | null | undefined,
): boolean {
  if (!schedule) return false;

  const key = nyWeekdayScheduleKey(date);
  const day = schedule[key];
  if (!day) return false;
  if (day.closed) return false;

  const openM = parseTimeToMinutes(day.openTime);
  const closeM = parseTimeToMinutes(day.closeTime);
  if (openM == null || closeM == null) return false;
  if (openM >= closeM) return false;

  const { hour, minute } = nyTimeParts(date);
  const now = minutesSinceMidnight(hour, minute);

  return now >= openM && now < closeM;
}

export function formatNyClock(date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

/** EST or EDT (or similar) for the given instant in New York. */
export function formatNyTimeZoneAbbrev(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    timeZoneName: "short",
  }).formatToParts(date);
  const name = parts.find((p) => p.type === "timeZoneName")?.value ?? "ET";
  return name;
}
