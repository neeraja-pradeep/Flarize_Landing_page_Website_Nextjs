import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

const TONES = {
  default: "",
  muted: "bg-gray-50",
  dark: "bg-brand-900 text-white",
} as const;

export interface SectionProps {
  id?: string;
  tone?: keyof typeof TONES;
  /** Inner container max width: wide = 1200px, narrow = 860px. */
  width?: "wide" | "narrow";
  paddingClassName?: string;
  gapClassName?: string;
  children: ReactNode;
}

export function Section({
  id,
  tone = "default",
  width = "wide",
  paddingClassName = "py-section",
  gapClassName = "gap-9",
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-16", TONES[tone])}>
      <div
        className={cn(
          "mx-auto flex flex-col px-gutter",
          width === "wide" ? "max-w-[1200px]" : "max-w-[860px]",
          paddingClassName,
          gapClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
