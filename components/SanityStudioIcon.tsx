const studioIconOrigin =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")) ||
  "https://www.primaryphotographic.com";

export function SanityStudioIcon() {
  const src = `${studioIconOrigin}/icon.png`;

  return (
    <img
      alt=""
      height={25}
      src={src}
      style={{
        borderRadius: 4,
        display: "block",
        height: 25,
        objectFit: "cover",
        width: 25,
      }}
      width={25}
    />
  );
}
