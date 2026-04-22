import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Primary Photographic",
    template: "%s · Primary Photographic",
  },
  description:
    "Primary Photographic — film lab and gallery: developing, scanning, printing, and occasional events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--color-paper)] font-sans text-[var(--color-ink)]">
        {children}
      </body>
    </html>
  );
}
