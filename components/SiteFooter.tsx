export function SiteFooter({ title }: { title: string }) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-sm text-[var(--muted)]">
          © {new Date().getFullYear()} {title}
        </p>
        <p className="text-xs text-[var(--muted)]">
          Film processing · Scanning · Printing · Gallery
        </p>
      </div>
    </footer>
  );
}
