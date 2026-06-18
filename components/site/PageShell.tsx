import type { PortableTextBlock } from "@portabletext/types";
import type { ReactNode } from "react";

import { PageShellMain } from "@/components/site/PageShellMain";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { LabClockSchedule } from "@/lib/labHours";
import type { NavigationPayload } from "@/types/navigation";

type Props = {
  children: ReactNode;
  siteTitle?: string | null;
  footerBody?: PortableTextBlock[] | null;
  sendFilmPdfUrl?: string | null;
  navigation?: NavigationPayload | null;
  homeUtilityHref?: string | null;
  homeUtilityPrimary?: string | null;
  homeUtilitySecondary?: string | null;
  email?: string | null;
  phone?: string | null;
  addressGoogleMapsUrl?: string | null;
  footerAddressLeft?: string | null;
  footerAddressRight?: string | null;
  hours?: string | null;
  labClockSchedule?: LabClockSchedule | null;
};

export function PageShell({
  children,
  siteTitle,
  footerBody,
  sendFilmPdfUrl,
  navigation,
  homeUtilityHref,
  homeUtilityPrimary,
  homeUtilitySecondary,
  email,
  phone,
  addressGoogleMapsUrl,
  footerAddressLeft,
  footerAddressRight,
  hours,
  labClockSchedule,
}: Props) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader
        siteTitle={siteTitle}
        sendFilmPdfUrl={sendFilmPdfUrl}
        navigation={navigation}
        homeUtilityHref={homeUtilityHref}
        homeUtilityPrimary={homeUtilityPrimary}
        homeUtilitySecondary={homeUtilitySecondary}
      />
      <PageShellMain>{children}</PageShellMain>
      <SiteFooter
        siteTitle={siteTitle}
        footerBody={footerBody}
        email={email}
        phone={phone}
        addressGoogleMapsUrl={addressGoogleMapsUrl}
        footerAddressLeft={footerAddressLeft}
        footerAddressRight={footerAddressRight}
        hours={hours}
        labClockSchedule={labClockSchedule}
      />
    </div>
  );
}
