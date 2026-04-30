import type { ReactNode } from "react";

import { listingAnchorId } from "@/lib/listingAnchors";
import { PageShell } from "@/components/site/PageShell";
import { formatEventDateRange } from "@/lib/formatEventDate";
import { getNavigation, getSiteSettings } from "@/sanity/lib/fetch";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, navigation] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
  ]);
  const customFeatures = Array.isArray(settings?.homeCustomFeatures)
    ? settings.homeCustomFeatures
    : [];
  const firstCustom = customFeatures[0] as
    | {
        title?: string | null;
        meta?: string | null;
        href?: string | null;
      }
    | undefined;
  const featuredItems = Array.isArray(settings?.homeFeaturedItems)
    ? settings.homeFeaturedItems
    : [];
  const selected = featuredItems[0] as
    | {
        _id?: string;
        _type?: "eventItem" | "commissionItem";
        title?: string | null;
        eyebrow?: string | null;
        eventType?: string | null;
        eventDateFrom?: string | null;
        eventDateTo?: string | null;
        eventDate?: string | null;
        category?: string | null;
      }
    | undefined;
  const selectedAnchorId = listingAnchorId(selected?._id || undefined);
  const sourceUtilityHref = selected?._type
    ? selected._type === "eventItem"
      ? `/events#${selectedAnchorId}`
      : `/commissions#${selectedAnchorId}`
    : "/";
  const sourceUtilityPrimary =
    selected?.title?.trim() || settings?.homeSpotlightLeft?.trim() || "";
  const sourceUtilitySecondary =
    (selected?._type === "eventItem"
      ? formatEventDateRange(selected.eventDateFrom, selected.eventDateTo) ||
        (selected.eventDateFrom || selected.eventDate
          ? formatEventDateRange(selected.eventDateFrom || selected.eventDate, null)
          : "") ||
        selected.eventType?.trim()
      : selected?.category?.trim() || selected?.eyebrow?.trim()) ||
    settings?.homeSpotlightRight?.trim() ||
    "";
  const homeUtilityHref = firstCustom?.href?.trim() || sourceUtilityHref;
  const homeUtilityPrimary = firstCustom?.title?.trim() || sourceUtilityPrimary;
  const homeUtilitySecondary = firstCustom?.meta?.trim() || sourceUtilitySecondary;

  return (
    <PageShell
      siteTitle={settings?.title}
      footerBody={settings?.footerBody}
      sendFilmUrl={settings?.sendFilmUrl}
      sendFilmPdfUrl={settings?.sendFilmPdfUrl}
      navigation={navigation}
      homeUtilityHref={homeUtilityHref}
      homeUtilityPrimary={homeUtilityPrimary}
      homeUtilitySecondary={homeUtilitySecondary}
      email={settings?.contactEmail}
      phone={settings?.contactPhone}
      address={settings?.address}
      footerAddressLeft={settings?.footerAddressLeft}
      footerAddressRight={settings?.footerAddressRight}
      hours={settings?.openingHours}
      labClockSchedule={settings?.labClockSchedule}
    >
      {children}
    </PageShell>
  );
}
