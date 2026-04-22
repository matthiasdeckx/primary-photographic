import { getServicesPage } from "@/sanity/lib/fetch";
import { SideRailImages } from "@/components/content/SideRailImages";

export const metadata = {
  title: "Services",
};

/** One row in the price list (new nested shape). */
type ServiceLine = {
  label?: string | null;
  price?: string | null;
  description?: string | null;
  spaceAbove?: boolean | null;
};

/** New: section with multiple lines. Legacy: flat single row with `name` instead of `lines`. */
type ServiceSection = {
  sectionHeading?: string | null;
  lines?: ServiceLine[] | null;
  /** @deprecated old flat row — migrated at render time */
  name?: string | null;
  price?: string | null;
  description?: string | null;
};

function linesForSection(section: ServiceSection): ServiceLine[] {
  if (section.lines && section.lines.length > 0) {
    return section.lines;
  }
  /* Legacy: one line stored on the section object */
  const label = section.name?.trim();
  if (!label) return [];
  return [
    {
      label,
      price: section.price,
      description: section.description,
    },
  ];
}

export default async function ServicesPage() {
  const page = await getServicesPage();
  const sections = page?.services as ServiceSection[] | undefined;
  const pdf = page?.servicesPdfUrl?.trim();

  const hasContent =
    sections?.some((s) => linesForSection(s).length > 0) ?? false;

  return (
    <div className="relative">
      <SideRailImages images={page?.sideImages} contentMaxWidth="36rem" />
      <div className="relative z-10 space-y-12">
        <h1 className="sr-only">Services</h1>

        {hasContent && sections?.length ? (
          <div className="mx-auto max-w-xl space-y-10">
            {sections.map((section, i) => {
              const lines = linesForSection(section);
              if (!lines.length) return null;

              return (
                <div key={`section-${i}`}>
                  {section.sectionHeading?.trim() ? (
                    <h2 className="mb-6 text-center text-[length:var(--text-body)] font-medium uppercase leading-[1.2em] text-[var(--color-ink)]">
                      {section.sectionHeading.trim()}
                    </h2>
                  ) : null}

                  <div className="flex flex-col">
                    {lines.map((line, j) => (
                      <div
                        key={`${line.label}-${j}`}
                        className={line.spaceAbove ? "mt-6" : undefined}
                      >
                        <div className="flex items-baseline justify-between gap-6 text-[length:var(--text-body)] uppercase leading-[1.2em]">
                          <span className="font-medium text-[var(--color-ink)]">
                            {line.label}
                          </span>
                          {line.price?.trim() ? (
                            <span className="tabular-nums text-[var(--color-ink)]">
                              {line.price.trim()}
                            </span>
                          ) : null}
                        </div>
                        {line.description?.trim() ? (
                          <p className="mt-2 text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-ink)]">
                            {line.description.trim()}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
            Add your price list in Sanity under Services page.
          </p>
        )}

        {pdf ? (
          <div className="flex justify-center">
            <a
              className="inline-flex w-full max-w-md items-center justify-center bg-[var(--color-ink)] py-3 text-[length:var(--text-small)] font-medium uppercase leading-[1.2em] text-white"
              href={pdf}
              target="_blank"
              rel="noreferrer"
            >
              Download PDF
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
