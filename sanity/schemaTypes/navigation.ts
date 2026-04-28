import { defineArrayMember, defineField, defineType } from "sanity";

const INTERNAL_ROUTE_OPTIONS = [
  { title: "Home (/)", value: "/" },
  { title: "About (/about)", value: "/about" },
  { title: "Services (/services)", value: "/services" },
  { title: "Events (/events)", value: "/events" },
  { title: "Commissions (/commissions)", value: "/commissions" },
  { title: "Technical info (/technical-info)", value: "/technical-info" },
];

export const navigation = defineType({
  name: "navigation",
  title: "Menu",
  type: "document",
  preview: {
    prepare() {
      return {
        title: "Menu",
        subtitle: "Primary site navigation",
      };
    },
  },
  fields: [
    defineField({
      name: "items",
      title: "Menu links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "menuLink",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "linkType",
              title: "Link type",
              type: "string",
              initialValue: "internal",
              options: {
                list: [
                  { title: "Page on this site", value: "internal" },
                  { title: "External URL", value: "external" },
                  { title: "Uploaded file", value: "file" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "internalPath",
              title: "Page",
              type: "string",
              description: "Select a page on this site.",
              options: {
                list: INTERNAL_ROUTE_OPTIONS,
              },
              hidden: ({ parent }) => parent?.linkType !== "internal",
              validation: (Rule) =>
                Rule.custom((val, context) => {
                  const parent = context.parent as { linkType?: string };
                  if (parent?.linkType !== "internal") return true;
                  if (!val || typeof val !== "string")
                    return "Select a page";
                  if (!INTERNAL_ROUTE_OPTIONS.some((route) => route.value === val)) {
                    return "Select one of the available pages";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "externalUrl",
              title: "URL",
              type: "url",
              hidden: ({ parent }) => parent?.linkType !== "external",
              validation: (Rule) =>
                Rule.custom((val, context) => {
                  const parent = context.parent as { linkType?: string };
                  if (parent?.linkType !== "external") return true;
                  return val ? true : "Required for external links";
                }),
            }),
            defineField({
              name: "file",
              title: "File",
              type: "file",
              hidden: ({ parent }) => parent?.linkType !== "file",
              validation: (Rule) =>
                Rule.custom((val, context) => {
                  const parent = context.parent as { linkType?: string };
                  if (parent?.linkType !== "file") return true;
                  return val ? true : "Required for file links";
                }),
            }),
          ],
          preview: {
            select: {
              title: "label",
              linkType: "linkType",
              internalPath: "internalPath",
              externalUrl: "externalUrl",
              fileUrl: "file.asset.url",
            },
            prepare({ title, linkType, internalPath, externalUrl, fileUrl }) {
              return {
                title: title || "Link",
                subtitle:
                  linkType === "external"
                    ? externalUrl || ""
                    : linkType === "file"
                      ? fileUrl || ""
                      : internalPath || "",
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "bottomLink",
      title: "Bottom link",
      type: "object",
      description: "Optional (e.g. Rectangle Room). Opens in a new tab.",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
        }),
        defineField({
          name: "url",
          title: "URL",
          type: "url",
          validation: (Rule) =>
            Rule.uri({ allowRelative: false, scheme: ["http", "https"] }),
        }),
      ],
    }),
  ],
});
