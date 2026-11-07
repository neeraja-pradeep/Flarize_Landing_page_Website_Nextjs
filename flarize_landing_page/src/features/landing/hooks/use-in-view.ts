"use client";

import { useEffect, type RefObject } from "react";

/** Calls `onChange` whenever the element enters or leaves the viewport. */
export function useInView(ref: RefObject<Element | null>, onChange: (isInView: boolean) => void, threshold = 0.05): void {
  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => onChange(entries[0]?.isIntersecting ?? false), { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, onChange, threshold]);
}
