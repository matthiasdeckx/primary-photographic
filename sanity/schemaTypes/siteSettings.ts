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
      name: "sendFilmPdf",
      title: "Send film PDF",
      type: "file",
      options: {
        accept: "application/pdf",
      },
    }),
    defineField({
      name: "homeFeatures",
      title: "Homepage features",
      type: "array",
      description:
        "Homepage slides in order. Each feature is either custom content or linked to an event/commission.",
      of: [{ type: "homeFeature" }],
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
      name: "addressGoogleMapsUrl",
      title: "Google Maps link (address)",
      type: "url",
      description:
        "Optional. Opens when visitors tap the address in the footer (main paragraph and bottom address row). Paste a Google Maps place or directions URL.",
    }),
    defineField({
      name: "footerAddressLeft",
      title: "Footer address row — left",
      type: "string",
      description: "Small uppercase line shown beneath the footer paragraph.",
    }),
    defineField({
      name: "footerAddressRight",
      title: "Footer address row — right",
      type: "string",
      description: "Small uppercase line shown beneath the footer paragraph.",
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
