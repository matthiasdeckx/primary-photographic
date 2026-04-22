import { defineArrayMember, defineField, defineType } from "sanity";

export const navigation = defineType({
  name: "navigation",
  title: "Menu",
  type: "document",
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
                ],
                layout: "radio",
                direction: "horizontal",
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "internalPath",
              title: "Path",
              type: "string",
              description: "Must start with / (e.g. /services).",
              hidden: ({ parent }) => parent?.linkType !== "internal",
              validation: (Rule) =>
                Rule.custom((val, context) => {
                  const parent = context.parent as { linkType?: string };
                  if (parent?.linkType !== "internal") return true;
                  if (!val || typeof val !== "string")
                    return "Required for internal links";
                  if (!val.startsWith("/")) return "Path must start with /";
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
          ],
          preview: {
            select: {
              title: "label",
              linkType: "linkType",
              internalPath: "internalPath",
              externalUrl: "externalUrl",
            },
            prepare({ title, linkType, internalPath, externalUrl }) {
              return {
                title: title || "Link",
                subtitle:
                  linkType === "external" ? externalUrl || "" : internalPath || "",
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
