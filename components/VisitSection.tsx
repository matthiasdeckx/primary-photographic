import type { SiteSettings } from "@/lib/site";

function linebreaks(text: string) {
  return text.split("\n").map((line, i) => (
    <span key={i}>
      {i > 0 ? <br /> : null}
      {line}
    </span>
  ));
}

export function VisitSection({ site }: { site: SiteSettings }) {
  const email = site.contactEmail;
  const phone = site.contactPhone;

  return (
    <section id="visit" className="scroll-mt-24 border-t border-[var(--border)]">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 sm:grid-cols-2 sm:py-28">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--accent)]">
            Visit
          </p>
          <h2 className="mt-3 font-display text-3xl text-[var(--text)] sm:text-4xl">
            Hours & contact
          </h2>
          <div className="mt-8 space-y-6 text-[var(--muted)]">
            {email ? (
              <p>
                <span className="block text-xs uppercase text-[var(--text)]">
                  Email
                </span>
                <a
                  href={`mailto:${email}`}
                  className="mt-1 inline-block border-b border-[var(--accent)]/50 text-[var(--text)] transition-colors hover:border-[var(--accent)]"
                >
                  {email}
                </a>
              </p>
            ) : null}
            {phone ? (
              <p>
                <span className="block text-xs uppercase text-[var(--text)]">
                  Phone
                </span>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="mt-1 inline-block text-[var(--text)] transition-colors hover:text-[var(--accent)]"
                >
                  {phone}
                </a>
              </p>
            ) : null}
          </div>
        </div>
        <div className="space-y-10">
          {site.address ? (
            <div>
              <h3 className="font-mono text-xs uppercase text-[var(--text)]">
                Address
              </h3>
              <p className="mt-3 text-[var(--muted)] leading-relaxed">
                {linebreaks(site.address)}
              </p>
            </div>
          ) : null}
          {site.openingHours ? (
            <div>
              <h3 className="font-mono text-xs uppercase text-[var(--text)]">
                Opening hours
              </h3>
              <p className="mt-3 text-[var(--muted)] leading-relaxed">
                {linebreaks(site.openingHours)}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
