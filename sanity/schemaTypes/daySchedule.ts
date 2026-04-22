import { defineField, defineType } from "sanity";

/** One weekday — used for the lab open/closed clock (times are interpreted in New York). */
export const daySchedule = defineType({
  name: "daySchedule",
  title: "Day",
  type: "object",
  fields: [
    defineField({
      name: "closed",
      title: "Closed all day",
      type: "boolean",
      description: "When enabled, the lab is closed for this weekday.",
      initialValue: false,
    }),
    defineField({
      name: "openTime",
      title: "Opens",
      type: "string",
      placeholder: "09:30",
      description: "24-hour time, New York (e.g. 09:30).",
    }),
    defineField({
      name: "closeTime",
      title: "Closes",
      type: "string",
      placeholder: "18:30",
      description: "24-hour time, New York. Closing minute is exclusive (last open minute is one before).",
    }),
  ],
  validation: (Rule) =>
    Rule.custom((val) => {
      if (!val || typeof val !== "object") return true;
      const v = val as { closed?: boolean; openTime?: string; closeTime?: string };
      if (v.closed) return true;
      const o = v.openTime?.trim();
      const c = v.closeTime?.trim();
      if (!o || !c) {
        return "Set open and close times, or enable Closed all day.";
      }
      return true;
    }),
});
