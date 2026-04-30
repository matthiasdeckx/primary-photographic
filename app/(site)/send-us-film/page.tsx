import { PortableBody } from "@/components/content/PortableBody";
import { getSendUsFilmPage } from "@/sanity/lib/fetch";

export const metadata = {
  title: "Send us film",
};

export default async function SendUsFilmPage() {
  const page = await getSendUsFilmPage();
  const buttonHref = page?.buttonFileUrl?.trim() || page?.buttonUrl?.trim();
  const buttonLabel = page?.buttonLabel?.trim() || "Download form";

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <h1 className="sr-only">{page?.title || "Send us film"}</h1>

      {page?.body?.length ? (
        <PortableBody value={page.body} alignBlockHeadings="left" />
      ) : (
        <p className="text-[length:var(--text-body)] leading-[1.2em] text-[var(--color-muted)]">
          Add copy in Sanity under Send us film page.
        </p>
      )}

      {buttonHref ? (
        <a
          className="inline-flex h-[58px] w-full max-w-site items-center justify-center bg-[var(--color-ink)] text-[length:var(--text-body)] font-medium uppercase leading-[1.2em] text-white"
          href={buttonHref}
          target="_blank"
          rel="noreferrer"
        >
          {buttonLabel}
        </a>
      ) : null}
    </div>
  );
}

