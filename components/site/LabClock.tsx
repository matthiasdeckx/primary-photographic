"use client";

import { useEffect, useState } from "react";

import {
  type LabClockSchedule,
  formatNyClock,
  formatNyTimeZoneAbbrev,
  isLabOpenNow,
} from "@/lib/labHours";

type Props = {
  schedule?: LabClockSchedule | null;
};

export function LabClock({ schedule }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const open = now ? isLabOpenNow(now, schedule) : false;
  const time = now ? formatNyClock(now) : "—";
  const tz = now ? formatNyTimeZoneAbbrev(now) : "ET";

  return (
    <p className="flex w-full items-baseline text-[length:var(--text-small)] font-medium uppercase leading-[1.2em] text-[var(--color-ink)] lg:block">
      <span className="tabular-nums">{time}</span>{" "}
      <span>{tz}</span>
      <span className="ml-auto text-right lg:ml-4 lg:text-left">
        {open ? "OPEN NOW" : "CLOSED"}
      </span>
    </p>
  );
}
