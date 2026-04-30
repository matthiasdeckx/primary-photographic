"use client";

import type { PortableTextBlock } from "@portabletext/types";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
  const newsletterInputRef = useRef<HTMLInputElement>(null);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletterState, setNewsletterState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

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

  useEffect(() => {
    if (!newsletterOpen) return;
    newsletterInputRef.current?.focus();
  }, [newsletterOpen]);

  const submitNewsletter = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newsletterState === "submitting") return;

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("EMAIL") || "").trim();
    if (!email) {
      setNewsletterState("error");
      setNewsletterMessage("Please enter an email address.");
      return;
    }

    setNewsletterState("submitting");
    setNewsletterMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (response.ok && data.ok) {
        setNewsletterState("success");
        setNewsletterMessage("Thank you for subscribing.");
        return;
      }

      setNewsletterState("error");
      setNewsletterMessage(data.message || "Subscription failed. Please try again.");
    } catch {
      setNewsletterState("error");
      setNewsletterMessage("Subscription failed. Please try again.");
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative z-40 lg:fixed lg:inset-x-0 lg:bottom-0"
      data-site-footer
    >
      <div
        className="relative w-full px-4 lg:pt-10"
        style={{
          paddingTop: "calc(1rem * var(--space-scale, 1))",
          paddingBottom: "calc(1rem * var(--space-scale, 1))",
        }}
      >
        <div className="mx-auto w-full max-w-site lg:max-w-none">
          <div className="mx-auto w-full max-w-3xl lg:max-w-none">
            <div
              className="pointer-events-none mb-4 grid w-full grid-cols-1 items-end gap-y-2 lg:absolute lg:inset-x-0 lg:bottom-4 lg:mb-0 lg:grid-cols-[1fr_auto] lg:gap-y-0 lg:px-4"
              style={{
                gap: "calc(1rem * var(--space-scale, 1))",
              }}
            >
              <div className="pointer-events-auto w-full justify-self-start">
                <LabClock schedule={labClockSchedule} />
              </div>
              <div className="pointer-events-auto w-full justify-self-end text-[length:var(--text-small)] uppercase leading-[1.2em] text-left lg:w-auto lg:text-right">
                <div className="lg:hidden">
              <form
                className="flex w-full items-baseline"
                style={{ gap: "calc(1rem * var(--space-scale, 1))" }}
                onSubmit={submitNewsletter}
              >
                <input
                  type="email"
                  name="EMAIL"
                  required
                  placeholder="Email Address"
                  aria-label="Email Address"
                  className="w-full bg-transparent text-[length:var(--text-small)] leading-[1.2em] text-[var(--color-ink)] placeholder:uppercase placeholder:text-[var(--color-muted)] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={newsletterState === "submitting"}
                  className="cursor-pointer whitespace-nowrap uppercase text-[var(--color-ink)] hover:opacity-60 disabled:opacity-40"
                >
                  {newsletterState === "submitting" ? "Submitting" : "Subscribe"}
                </button>
              </form>
              {newsletterState !== "idle" && newsletterMessage ? (
                <p className="mt-1 normal-case text-[var(--color-muted)]">
                  {newsletterMessage}
                </p>
              ) : null}
                </div>
                <div className="hidden lg:block">
                  {newsletterOpen && newsletterState === "success" ? (
                    <p className="text-[var(--color-ink)]">{newsletterMessage}</p>
                  ) : newsletterOpen ? (
                    <form
                      className="flex items-baseline"
                      style={{ gap: "calc(1rem * var(--space-scale, 1))" }}
                      onSubmit={submitNewsletter}
                    >
                      <input
                        ref={newsletterInputRef}
                        type="email"
                        name="EMAIL"
                        required
                        placeholder="Email Address"
                        aria-label="Email Address"
                        className="w-[11rem] bg-transparent text-[length:var(--text-small)] leading-[1.2em] text-[var(--color-ink)] placeholder:uppercase placeholder:text-[var(--color-muted)] focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={newsletterState === "submitting"}
                        className="cursor-pointer uppercase text-[var(--color-ink)] hover:opacity-60 disabled:opacity-40"
                      >
                        {newsletterState === "submitting" ? "Submitting" : "Subscribe"}
                      </button>
                      {newsletterState === "error" && newsletterMessage ? (
                        <p className="normal-case text-[var(--color-muted)]">
                          {newsletterMessage}
                        </p>
                      ) : null}
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setNewsletterOpen(true)}
                      className="cursor-pointer uppercase text-[var(--color-ink)] hover:opacity-60"
                    >
                      Newsletter
                    </button>
                  )}
                </div>
              </div>
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
                <Link href="/" className="font-medium text-[var(--color-ink)] underline decoration-[var(--color-ink)] underline-offset-2 hover:opacity-60">
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
              <div
                className="flex w-full items-baseline justify-between text-[length:var(--text-small)] font-medium uppercase leading-[1.2em] text-[var(--color-ink)]"
                style={{ gap: "calc(1rem * var(--space-scale, 1))" }}
              >
                <p className="text-left">{footerAddressLeft || "\u00a0"}</p>
                <p className="text-right">{footerAddressRight || "\u00a0"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
