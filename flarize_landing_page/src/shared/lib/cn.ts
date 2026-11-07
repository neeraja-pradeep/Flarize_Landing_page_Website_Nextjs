import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/** Teaches tailwind-merge our custom theme tokens (see `@theme` in globals.css). */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["hero", "section", "stat"] }],
      shadow: [{ shadow: ["header", "card", "form", "popup", "float", "float-strong", "bar"] }],
      rounded: [{ rounded: ["control", "card", "field"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
