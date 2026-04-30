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
      description: "Legacy fallback. Prefer uploading the PDF below.",
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
      name: "homeFeaturedItems",
      title: "Homepage featured source documents",
      type: "array",
      description:
        "Select one or more Events/Commissions. Used when no custom homepage features are defined below.",
      validation: (Rule) => Rule.min(1).warning("Select at least one featured item."),
      of: [
        defineField({
          name: "homeFeaturedRef",
          title: "Homepage featured reference",
          type: "reference",
          to: [{ type: "eventItem" }, { type: "commissionItem" }],
        }),
      ],
    }),
    defineField({
      name: "homeCustomFeatures",
      title: "Homepage custom features",
      type: "array",
      description:
        "Optional manual homepage slides. If set, these are used instead of Homepage featured source documents.",
      of: [
        defineField({
          name: "homeCustomFeature",
          title: "Homepage custom feature",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "meta",
              title: "Meta text",
              type: "string",
              description: "Small secondary text shown next to title in top-left utility.",
            }),
            defineField({
              name: "href",
              title: "Link URL",
              type: "string",
              description: "Optional target for top-left click (e.g. /events or external URL).",
            }),
            defineField({
              name: "images",
              title: "Images",
              type: "array",
              validation: (Rule) => Rule.max(5).warning("Use up to 5 images."),
              of: [
                defineField({
                  name: "featureImage",
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
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "meta",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Custom feature",
                subtitle: subtitle || "",
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "homeSpotlightLeft",
      title: "Home spotlight — left",
      type: "string",
      description: "Legacy fallback. Prefer ‘Homepage featured source documents’.",
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
      hidden: true,
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alternative text" }),
      ],
    }),
    defineField({
      name: "heroImageRight",
      title: "Home — right image",
      type: "image",
      hidden: true,
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
