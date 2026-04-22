"use client";

import type { PortableTextBlock } from "@portabletext/types";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";

import { PortableBody } from "@/components/content/PortableBody";
import { LabClock } from "@/components/site/LabClock";
import type { LabClockSchedule } from "@/lib/labHours";

type Props = {
  siteTitle?: string | null;
  footerBody?: PortableTextBlock[] | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  footerAddressLeft?: string | null;
  footerAddressRight?: string | null;
  hours?: string | null;
  labClockSchedule?: LabClockSchedule | null;
};

export function SiteFooter({
  siteTitle,
  footerBody,
  email,
  phone,
  address,
  footerAddressLeft,
  footerAddressRight,
  hours,
  labClockSchedule,
}: Props) {
  const name = (siteTitle?.trim() || "PRIMARY PHOTOGRAPHIC").toUpperCase();
  const footerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!el || typeof document === "undefined") return;

    const publishHeight = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty(
        "--site-footer-height",
        `${h}px`,
      );
    };

    publishHeight();

    const ro = new ResizeObserver(publishHeight);
    ro.observe(el);
    window.addEventListener("resize", publishHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", publishHeight);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="fixed inset-x-0 bottom-0 z-40"
      data-site-footer
    >
      <div className="relative w-full px-4 pb-4 pt-10">
        <div className="pointer-events-none absolute inset-x-0 bottom-4 grid grid-cols-[1fr_auto] items-end px-4">
          <div className="pointer-events-auto justify-self-start">
            <LabClock schedule={labClockSchedule} />
          </div>
          <div className="pointer-events-auto justify-self-end text-[length:var(--text-small)] uppercase leading-[1.2em] text-right">
            <div className="flex items-baseline gap-4">
              <a className="text-[var(--color-ink)] hover:opacity-80" href={email ? `mailto:${email}` : "#"}>
                Email address
              </a>
              <a className="text-[var(--color-ink)] hover:opacity-80" href="#">
                Subscribe
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-site pb-4 text-justify">
            {footerBody?.length ? (
              <div className="mx-auto max-w-3xl text-[length:var(--text-small)] leading-[1.2em] text-[var(--color-muted)] [&_a]:!text-[var(--color-ink)] [&_li]:!text-[var(--color-muted)] [&_p]:!text-[var(--color-muted)] [&_strong]:!text-[var(--color-ink)]">
                <PortableBody
                  compact
                  value={footerBody}
                  className="!max-w-none text-justify"
                />
              </div>
            ) : (
              <p className="mx-auto max-w-3xl text-[length:var(--text-small)] leading-[1.2em] text-[var(--color-muted)]">
                <Link href="/" className="font-medium text-[var(--color-ink)] underline decoration-[var(--color-ink)] underline-offset-2 hover:opacity-80">
                  {name}
                </Link>{" "}
                is a high-end
                photographic film lab that works with professionals and amateurs
                alike.
                {address ? (
                  <>
                    {" "}
                    Located at{" "}
                    <strong className="font-medium whitespace-pre-line">
                      {address}
                    </strong>
                    .
                  </>
                ) : null}
                {hours ? (
                  <>
                    {" "}
                    <span className="whitespace-pre-line">{hours}</span>
                  </>
                ) : (
                  <>
                    {" "}
                    Our New York space is open Mon–Fri 9:30–6:30 and Sat 10–6.
                  </>
                )}
                {email ? (
                  <>
                    {" "}
                    Contact us at{" "}
                    <a
                      className="font-medium text-[var(--color-ink)] underline decoration-[var(--color-ink)] underline-offset-2"
                      href={`mailto:${email}`}
                    >
                      {email}
                    </a>
                  </>
                ) : null}
                {phone ? (
                  <>
                    {" "}
                    or{" "}
                    <a
                      className="font-medium text-[var(--color-ink)] underline decoration-[var(--color-ink)] underline-offset-2"
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                    >
                      {phone}
                    </a>
                    .
                  </>
                ) : null}{" "}
                Follow us on Instagram for updates, and check our FAQ for film
                submission details.
              </p>
            )}
        </div>

        {(footerAddressLeft || footerAddressRight) && (
          <div className="mx-auto mt-0 w-full max-w-site">
            <div className="mx-auto w-full max-w-3xl">
              <div className="grid w-full gap-3 text-[length:var(--text-small)] font-medium uppercase leading-[1.2em] text-[var(--color-ink)] sm:grid-cols-2">
                <p className="text-left">{footerAddressLeft || "\u00a0"}</p>
                <p className="text-left sm:text-right">{footerAddressRight || "\u00a0"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
