import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  padded?: boolean;
};

/** Breaks out of the main `max-w-site` column to span the viewport width (with horizontal padding). */
export function FullBleed({ children, className = "", padded = true }: Props) {
  return (
    <div
      className={`box-border w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] ${padded ? "px-[var(--site-gutter-x)]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
