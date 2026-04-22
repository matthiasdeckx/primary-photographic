import Image from "next/image";

import { urlForImage } from "@/sanity/lib/image";
import type { SiteSettings } from "@/lib/site";

export function Hero({ site }: { site: SiteSettings }) {
  const img = site.heroImage;
  const url = img ? urlForImage(img)?.width(2400).height(1400).quality(90).url() : null;
  const alt = img?.alt || `${site.title} — hero`;

  return (
    <section className="relative min-h-[min(85vh,920px)] overflow-hidden">
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(201,169,98,0.18),transparent_55%),radial-gradient(ellipse_at_80%_70%,rgba(120,90,50,0.12),transparent_50%),linear-gradient(165deg,#0a0908_0%,#12100e_45%,#1a1612_100%)]"
          aria-hidden
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/75 to-transparent" />
      <div className="relative mx-auto flex min-h-[min(85vh,920px)] max-w-6xl flex-col justify-end px-6 pb-20 pt-32 sm:pb-28">
        <p className="mb-3 font-mono text-xs uppercase text-[var(--accent)]">
          {site.tagline}
        </p>
        <h1 className="font-display max-w-3xl text-4xl leading-[1.08] text-[var(--text)] sm:text-5xl md:text-6xl">
          {site.heroHeadline}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
          {site.heroSubline}
        </p>
      </div>
    </section>
  );
}
