type SiteLogoProps = {
  className?: string;
};

export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <img
      src="/logo.svg"
      alt=""
      width={530}
      height={51}
      decoding="async"
      className={["block h-auto w-full max-w-full", className].filter(Boolean).join(" ")}
    />
  );
}
