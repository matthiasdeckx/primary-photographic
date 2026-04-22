import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Optional; small label (most layouts use fixed branding).",
    }),
    defineField({
      name: "sendFilmUrl",
      title: "Send film URL",
      type: "url",
    }),
    defineField({
      name: "cartUrl",
      title: "Cart URL",
      type: "url",
    }),
    defineField({
      name: "homeSpotlightLeft",
      title: "Home spotlight — left",
      type: "string",
      description: "e.g. artist name (left column of the hero row).",
    }),
    defineField({
      name: "homeSpotlightRight",
      title: "Home spotlight — right",
      type: "string",
      description: "e.g. “Until 06 Apr, 2026” (right column).",
    }),
    defineField({
      name: "heroImageLeft",
      title: "Home — left image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alternative text" }),
      ],
    }),
    defineField({
      name: "heroImageRight",
      title: "Home — right image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alternative text" }),
      ],
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "string",
    }),
    defineField({
      name: "heroSubline",
      title: "Hero introduction",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "heroImage",
      title: "Hero image (single banner)",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
        }),
      ],
    }),
    defineField({
      name: "footerBody",
      title: "Footer text",
      type: "blockContent",
      description: "Centered paragraph; use bold for emphasis on links and key terms.",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
    }),
    defineField({
      name: "contactPhone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "labClockSchedule",
      title: "Lab clock schedule (New York time)",
      type: "object",
      description:
        "Sets OPEN NOW vs CLOSED next to the clock. Times are interpreted in America/New_York (Eastern), matching the clock display.",
      fields: [
        defineField({
          name: "monday",
          title: "Monday",
          type: "daySchedule",
        }),
        defineField({
          name: "tuesday",
          title: "Tuesday",
          type: "daySchedule",
        }),
        defineField({
          name: "wednesday",
          title: "Wednesday",
          type: "daySchedule",
        }),
        defineField({
          name: "thursday",
          title: "Thursday",
          type: "daySchedule",
        }),
        defineField({
          name: "friday",
          title: "Friday",
          type: "daySchedule",
        }),
        defineField({
          name: "saturday",
          title: "Saturday",
          type: "daySchedule",
        }),
        defineField({
          name: "sunday",
          title: "Sunday",
          type: "daySchedule",
        }),
      ],
    }),
    defineField({
      name: "openingHours",
      title: "Opening hours (display text)",
      type: "text",
      rows: 5,
      description:
        "Shown in the footer and elsewhere as readable copy. The clock uses “Lab clock schedule” above.",
    }),
  ],
});
