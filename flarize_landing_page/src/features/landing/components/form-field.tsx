import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export const FIELD_BASE =
  "h-12 w-full rounded-field border bg-field-bg px-3.5 text-[15px] text-ink outline-none focus:border-brand-600 focus:bg-white";

export function fieldBorder(hasError: boolean): string {
  return hasError ? "border-danger-border" : "border-field-border";
}

export interface FormFieldProps {
  label: string;
  errorId: string;
  error?: string;
  children: ReactNode;
}

/** Label + control + inline error. The control must reference `errorId` via aria-describedby. */
export function FormField({ label, errorId, error, children }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-medium text-gray-700">
      {label}
      {children}
      {error ? (
        <span id={errorId} role="alert" className={cn("text-xs font-normal text-danger")}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
