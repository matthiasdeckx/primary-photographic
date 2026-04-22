import type { PortableTextBlock } from "@portabletext/types";

import { PortableBody } from "@/components/content/PortableBody";
import { LabClock } from "@/components/site/LabClock";
import type { LabClockSchedule } from "@/lib/labHours";

type Props = {
  siteTitle?: string | null;
  footerBody?: PortableTextBlock[] | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  hours?: string | null;
  labClockSchedule?: LabClockSchedule | null;
};

export function SiteFooter({
  siteTitle,
  footerBody,
  email,
  phone,
  address,
  hours,
  labClockSchedule,
}: Props) {
  const name = (siteTitle?.trim() || "PRIMARY PHOTOGRAPHIC").toUpperCase();

  return (
    <footer className="mt-auto">
      <div className="w-full px-4 py-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
          <div className="justify-self-start lg:flex lg:justify-start">
            <LabClock schedule={labClockSchedule} />
          </div>

          <div className="min-w-0 w-full max-w-site justify-self-center text-justify">
            {footerBody?.length ? (
              <div className="mx-auto max-w-3xl text-[length:var(--text-small)] leading-[1.2em] text-[var(--color-ink)]">
                <PortableBody
                  compact
                  value={footerBody}
                  className="!max-w-none text-justify"
                />
              </div>
            ) : (
              <p className="mx-auto max-w-3xl text-[length:var(--text-small)] leading-[1.2em] text-[var(--color-ink)]">
                <strong className="font-medium">{name}</strong> is a high-end
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
                      className="font-medium underline decoration-[var(--color-ink)] underline-offset-2"
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
                      className="font-medium underline decoration-[var(--color-ink)] underline-offset-2"
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

          <div className="justify-self-end text-[length:var(--text-small)] uppercase leading-[1.2em] lg:text-right">
            <div className="flex items-baseline gap-4 text-[var(--color-muted)]">
              <p>Email address</p>
              <p className="text-[var(--color-ink)]">Subscribe</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
