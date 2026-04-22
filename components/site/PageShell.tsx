import type { PortableTextBlock } from "@portabletext/types";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import type { LabClockSchedule } from "@/lib/labHours";
import type { NavigationPayload } from "@/types/navigation";

type Props = {
  children: ReactNode;
  siteTitle?: string | null;
  footerBody?: PortableTextBlock[] | null;
  sendFilmUrl?: string | null;
  navigation?: NavigationPayload | null;
  homeUtilityHref?: string | null;
  homeUtilityPrimary?: string | null;
  homeUtilitySecondary?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  footerAddressLeft?: string | null;
  footerAddressRight?: string | null;
  hours?: string | null;
  labClockSchedule?: LabClockSchedule | null;
};

export function PageShell({
  children,
  siteTitle,
  footerBody,
  sendFilmUrl,
  navigation,
  homeUtilityHref,
  homeUtilityPrimary,
  homeUtilitySecondary,
  email,
  phone,
  address,
  footerAddressLeft,
  footerAddressRight,
  hours,
  labClockSchedule,
}: Props) {
  return (
    <>
      <SiteHeader
        siteTitle={siteTitle}
        sendFilmUrl={sendFilmUrl}
        navigation={navigation}
        homeUtilityHref={homeUtilityHref}
        homeUtilityPrimary={homeUtilityPrimary}
        homeUtilitySecondary={homeUtilitySecondary}
      />
      <div
        className="w-full px-4"
        style={{
          paddingTop: "calc(var(--site-header-height, 280px) + 2.5rem)",
          paddingBottom: "calc(var(--site-footer-height, 260px) + 1rem)",
        }}
      >
        <div className="mx-auto w-full max-w-site flex-1">
          {children}
        </div>
      </div>
      <SiteFooter
        siteTitle={siteTitle}
        footerBody={footerBody}
        email={email}
        phone={phone}
        address={address}
        footerAddressLeft={footerAddressLeft}
        footerAddressRight={footerAddressRight}
        hours={hours}
        labClockSchedule={labClockSchedule}
      />
    </>
  );
}
