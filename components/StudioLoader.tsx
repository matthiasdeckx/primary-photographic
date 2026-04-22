"use client";

import dynamic from "next/dynamic";

const Studio = dynamic(() => import("@/components/Studio"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#0c0c0c] text-[#a3a3a3]">
      Loading Studio…
    </div>
  ),
});

export function StudioLoader() {
  return <Studio />;
}
