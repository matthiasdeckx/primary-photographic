import { client } from "@/sanity/lib/client";
import {
  aboutPageQuery,
  commissionItemsQuery,
  eventItemsQuery,
  navigationQuery,
  sendUsFilmPageQuery,
  servicesPageQuery,
  siteSettingsQuery,
  technicalInfoPageQuery,
} from "@/sanity/lib/queries";
import type { NavigationPayload } from "@/types/navigation";

const fetchOptions = { next: { revalidate: 60 } } as const;

export async function getSiteSettings() {
  if (!client) return null;
  return client.fetch(siteSettingsQuery, {}, fetchOptions);
}

export async function getServicesPage() {
  if (!client) return null;
  return client.fetch(servicesPageQuery, {}, fetchOptions);
}

export async function getNavigation(): Promise<NavigationPayload | null> {
  if (!client) return null;
  return client.fetch(navigationQuery, {}, fetchOptions);
}

export async function getTechnicalInfoPage() {
  if (!client) return null;
  return client.fetch(technicalInfoPageQuery, {}, fetchOptions);
}

export async function getAboutPage() {
  if (!client) return null;
  return client.fetch(aboutPageQuery, {}, fetchOptions);
}

export async function getSendUsFilmPage() {
  if (!client) return null;
  return client.fetch(sendUsFilmPageQuery, {}, fetchOptions);
}

export async function getEventItems() {
  if (!client) return [];
  return client.fetch(eventItemsQuery, {}, fetchOptions);
}

export async function getCommissionItems() {
  if (!client) return [];
  return client.fetch(commissionItemsQuery, {}, fetchOptions);
}
