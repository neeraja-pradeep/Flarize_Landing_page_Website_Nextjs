import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";

const BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-control border-0 font-semibold whitespace-nowrap transition-colors duration-[140ms] ease-in-out active:scale-[0.98] disabled:cursor-not-allowed";

const VARIANTS = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
} as const;

const SIZES = {
  header: "px-[18px] py-[11px] text-sm",
  md: "px-6 py-3.5 text-[15px]",
  sm: "px-[22px] py-[13px] text-sm",
  popup: "h-11 w-full text-sm",
  form: "h-[52px] w-full text-[15px]",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;
export type ButtonSize = keyof typeof SIZES;

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export function buttonClasses({ variant = "primary", size = "md", className }: ButtonStyleOptions = {}): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

export interface ButtonProps extends ComponentProps<"button">, ButtonStyleOptions {}

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}
