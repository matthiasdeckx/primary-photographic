import type { SchemaTypeDefinition } from "sanity";

import { aboutPage } from "@/sanity/schemaTypes/aboutPage";
import { blockContent } from "@/sanity/schemaTypes/blockContent";
import { daySchedule } from "@/sanity/schemaTypes/daySchedule";
import { commissionItem } from "@/sanity/schemaTypes/commissionItem";
import { eventItem } from "@/sanity/schemaTypes/eventItem";
import { siteSettings } from "@/sanity/schemaTypes/siteSettings";
import { navigation } from "@/sanity/schemaTypes/navigation";
import { pageSection } from "@/sanity/schemaTypes/pageSection";
import { technicalInfoPage } from "@/sanity/schemaTypes/technicalInfoPage";
import { servicesPage } from "@/sanity/schemaTypes/servicesPage";
import { sendUsFilmPage } from "@/sanity/schemaTypes/sendUsFilmPage";

export const schemaTypes: SchemaTypeDefinition[] = [
  blockContent,
  pageSection,
  daySchedule,
  siteSettings,
  navigation,
  technicalInfoPage,
  servicesPage,
  sendUsFilmPage,
  aboutPage,
  eventItem,
  commissionItem,
];
