import type { ReactNode } from "react";

import { PageShell } from "@/components/site/PageShell";
import { buildHomeFeatureSlides, firstHomeFeatureUtility } from "@/lib/homeFeatures";
import { getNavigation, getSiteSettings } from "@/sanity/lib/fetch";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, navigation] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
  ]);
  const homeSlides = buildHomeFeatureSlides(settings?.homeFeatures);
  const homeUtility = firstHomeFeatureUtility(homeSlides);

  return (
    <PageShell
      siteTitle={settings?.title}
      footerBody={settings?.footerBody}
      sendFilmPdfUrl={settings?.sendFilmPdfUrl}
      navigation={navigation}
      homeUtilityHref={homeUtility.href}
      homeUtilityPrimary={homeUtility.primary}
      homeUtilitySecondary={homeUtility.secondary}
      email={settings?.contactEmail}
      phone={settings?.contactPhone}
      addressGoogleMapsUrl={settings?.addressGoogleMapsUrl}
      footerAddressLeft={settings?.footerAddressLeft}
      footerAddressRight={settings?.footerAddressRight}
      hours={settings?.openingHours}
      labClockSchedule={settings?.labClockSchedule}
    >
      {children}
    </PageShell>
  );
}
