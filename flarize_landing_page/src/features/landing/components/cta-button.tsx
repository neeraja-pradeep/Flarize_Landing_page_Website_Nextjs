"use client";

import type { ReactNode } from "react";
import { Button, type ButtonSize } from "@/ui/button";
import { cn } from "@/shared/lib/cn";
import type { CtaLocation } from "../constants";
import { openLeadForm } from "../lib/open-lead-form";

export interface CtaButtonProps {
  location: CtaLocation;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

/** Interactive leaf: every "Get a consultation" button scrolls to and focuses the lead form. */
export function CtaButton({ location, size = "md", className, children }: CtaButtonProps) {
  const handleClick = () => openLeadForm(location);
  return (
    <Button size={size} className={cn("self-start", className)} onClick={handleClick}>
      {children}
    </Button>
  );
}
