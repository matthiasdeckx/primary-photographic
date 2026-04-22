import type { ReactNode } from "react";

import { PageShell } from "@/components/site/PageShell";
import { getNavigation, getSiteSettings } from "@/sanity/lib/fetch";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, navigation] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
  ]);

  return (
    <PageShell
      siteTitle={settings?.title}
      footerBody={settings?.footerBody}
      sendFilmUrl={settings?.sendFilmUrl}
      cartUrl={settings?.cartUrl}
      navigation={navigation}
      email={settings?.contactEmail}
      phone={settings?.contactPhone}
      address={settings?.address}
      hours={settings?.openingHours}
      labClockSchedule={settings?.labClockSchedule}
    >
      {children}
    </PageShell>
  );
}
