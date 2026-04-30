import { defineField, defineType } from "sanity";

export const sendUsFilmPage = defineType({
  name: "sendUsFilmPage",
  title: "Send us film page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      initialValue: "Send us film",
    }),
    defineField({
      name: "body",
      title: "Text",
      type: "blockContent",
      description: "Main page copy.",
    }),
    defineField({
      name: "buttonLabel",
      title: "Button label",
      type: "string",
      initialValue: "Download form",
    }),
    defineField({
      name: "buttonFile",
      title: "Button file",
      type: "file",
      options: {
        accept: "application/pdf",
      },
      description: "Preferred file linked by the page button.",
    }),
    defineField({
      name: "buttonUrl",
      title: "Button URL (fallback)",
      type: "url",
      description: "Used when no file is uploaded.",
    }),
  ],
});

