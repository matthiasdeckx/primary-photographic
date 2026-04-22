import type { PortableTextBlock } from "@portabletext/types";

import { PortableBody } from "@/components/content/PortableBody";

export type ContentSection = {
  sectionTitle?: string | null;
  body?: PortableTextBlock[] | null;
};

type Props = {
  sections?: ContentSection[] | null;
  emptyMessage: string;
};

const headingBase =
  "mb-[calc(2em*var(--leading))] text-center text-[length:var(--text-body)] font-medium uppercase leading-[1.2em] text-[var(--color-ink)]";

export function PageSections({ sections, emptyMessage }: Props) {
  if (!sections?.length) {
    return (
      <p className="text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div>
      {sections.map((section, i) => (
        <section key={i}>
          {section.sectionTitle?.trim() ? (
            <h2
              className={`${headingBase} ${i > 0 ? "mt-[calc(3em*var(--leading))]" : "mt-0"}`}
            >
              {section.sectionTitle.trim()}
            </h2>
          ) : null}
          <PortableBody value={section.body} />
        </section>
      ))}
    </div>
  );
}
