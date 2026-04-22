import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Breaks out of the main `max-w-site` column to span the viewport width (with horizontal padding). */
export function FullBleed({ children, className = "" }: Props) {
  return (
    <div
      className={`box-border w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] px-4 sm:px-4 ${className}`}
    >
      {children}
    </div>
  );
}
