"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { openListingFromHash } from "@/lib/openListingFromHash";

type Props = {
  rootSelector?: string;
};

export function ListingHashNavigation({ rootSelector }: Props) {
  const pathname = usePathname();

  useEffect(() => {
    const apply = () => openListingFromHash(rootSelector);
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [pathname, rootSelector]);

  return null;
}
