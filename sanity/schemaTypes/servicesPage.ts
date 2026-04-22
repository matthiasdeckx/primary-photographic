import { defineField, defineType } from "sanity";

const serviceLineFields = [
  defineField({
    name: "label",
    title: "Label",
    type: "string",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "price",
    title: "Price",
    type: "string",
    description: "Optional — shown right-aligned on the same row.",
  }),
  defineField({
    name: "description",
    title: "Notes",
    type: "text",
    rows: 3,
  }),
  defineField({
    name: "spaceAbove",
    title: "Extra space above",
    type: "boolean",
    description:
      "Turn on to add a line break / vertical space before this line (e.g. to separate groups).",
    initialValue: false,
  }),
];

export const servicesPage = defineType({
  name: "servicesPage",
  title: "Services page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      initialValue: "Services",
    }),
    defineField({
      name: "servicesPdfUrl",
      title: "Price PDF",
      type: "url",
      description: "Optional link for “Download PDF” on the site.",
    }),
    defineField({
      name: "services",
      title: "Services sections",
      type: "array",
      description:
        "Each item is one section. Add multiple lines inside a section (label + optional price per line).",
      of: [
        {
          type: "object",
          name: "serviceSection",
          fields: [
            defineField({
              name: "sectionHeading",
              title: "Section heading",
              type: "string",
              description: "Optional — e.g. PROCESSING.",
            }),
            defineField({
              name: "lines",
              title: "Lines",
              type: "array",
              validation: (Rule) =>
                Rule.required().min(1).error("Add at least one line in this section."),
              of: [
                {
                  type: "object",
                  name: "serviceLine",
                  fields: serviceLineFields,
                  preview: {
                    select: {
                      title: "label",
                      subtitle: "price",
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              heading: "sectionHeading",
              lines: "lines",
            },
            prepare({ heading, lines }) {
              const n = Array.isArray(lines) ? lines.length : 0;
              return {
                title: heading?.trim() || "Section",
                subtitle: n ? `${n} line${n === 1 ? "" : "s"}` : "No lines",
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "sideImages",
      title: "Side images",
      type: "array",
      description:
        "Optional decorative images shown in the left/right whitespace on wide screens (1 to 5).",
      validation: (Rule) => Rule.max(5),
      of: [
        defineField({
          name: "sideImage",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
});
