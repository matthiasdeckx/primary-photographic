import type { SiteSettings } from "@/lib/site";

export function ServicesSection({ site }: { site: SiteSettings }) {
  const items = site.services ?? [];

  return (
    <section
      id="services"
      className="scroll-mt-24 border-t border-[var(--border)] bg-[var(--bg-elevated)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase text-[var(--accent)]">
            What we do
          </p>
          <h2 className="mt-3 font-display text-3xl text-[var(--text)] sm:text-4xl">
            Lab services
          </h2>
          <p className="mt-4 text-[var(--muted)]">
            Straightforward offerings — no endless menus. Tell us what you’re
            shooting and we’ll recommend a path.
          </p>
        </div>
        <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => (
            <li
              key={`${s.name}-${i}`}
              className="group border border-[var(--border)] bg-[var(--surface)] p-8 transition-colors hover:border-[var(--accent)]/35"
            >
              <span className="font-mono text-[11px] uppercase text-[var(--muted)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl text-[var(--text)]">
                {s.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {s.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
