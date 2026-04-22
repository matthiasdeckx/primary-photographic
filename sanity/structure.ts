import type { StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.listItem()
        .title("Menu")
        .id("navigation")
        .child(S.document().schemaType("navigation").documentId("navigation")),
      S.listItem()
        .title("Technical info page")
        .id("technicalInfoPage")
        .child(
          S.document()
            .schemaType("technicalInfoPage")
            .documentId("technicalInfoPage"),
        ),
      S.listItem()
        .title("Services page")
        .id("servicesPage")
        .child(
          S.document().schemaType("servicesPage").documentId("servicesPage"),
        ),
      S.listItem()
        .title("About page")
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.divider(),
      S.listItem()
        .title("Events")
        .id("eventItem")
        .child(
          S.documentTypeList("eventItem")
            .title("Events")
            .defaultOrdering([
              { field: "eventDateFrom", direction: "asc" },
              { field: "_createdAt", direction: "desc" },
            ]),
        ),
      orderableDocumentListDeskItem({
        type: "commissionItem",
        title: "Commissions (drag to sort)",
        S,
        context,
      }),
    ]);
