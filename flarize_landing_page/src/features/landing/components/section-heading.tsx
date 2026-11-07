import { cn } from "@/shared/lib/cn";

export interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  isDark?: boolean;
  isCentered?: boolean;
  /** Tailwind max-width class for the block. */
  maxWidthClassName?: string;
  /** Balanced line breaks for long titles. */
  isBalanced?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  isDark = false,
  isCentered = false,
  maxWidthClassName = "max-w-[680px]",
  isBalanced = true,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-2.5", isCentered ? "items-center text-center" : maxWidthClassName)}>
      <span
        className={cn(
          "text-[13px] font-semibold tracking-[0.06em] uppercase",
          isDark ? "text-accent" : "text-brand-600",
        )}
      >
        {eyebrow}
      </span>
      <h2
        className={cn(
          "text-section font-bold",
          isDark ? "text-white" : "text-brand-900",
          isBalanced && "text-balance",
        )}
      >
        {title}
      </h2>
    </div>
  );
}
