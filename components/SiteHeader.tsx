import Link from "next/link";

const links = [
  { href: "#services", label: "Services" },
  { href: "#visit", label: "Visit" },
  { href: "/studio", label: "Edit content" },
];

export function SiteHeader({ title }: { title: string }) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="group">
          <span className="font-display text-lg text-[var(--text)] transition-colors group-hover:text-[var(--accent)]">
            {title}
          </span>
        </Link>
        <nav
          className="flex flex-wrap items-center justify-end gap-x-8 gap-y-2 text-sm text-[var(--muted)]"
          aria-label="Primary"
        >
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[var(--text)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
