"use client";

import type { ComponentProps } from "react";
import { track } from "@/shared/lib/analytics";
import { ANALYTICS_EVENTS, type CtaLocation } from "../constants";

export interface ContactLinkProps extends Omit<ComponentProps<"a">, "href"> {
  href: string;
  kind: "call" | "whatsapp";
  location: CtaLocation;
}

/** Anchor that records a call / WhatsApp click. WhatsApp opens in a new tab. */
export function ContactLink({ href, kind, location, onClick, ...props }: ContactLinkProps) {
  const isWhatsApp = kind === "whatsapp";
  const handleClick: ComponentProps<"a">["onClick"] = (event) => {
    track(isWhatsApp ? ANALYTICS_EVENTS.whatsappClick : ANALYTICS_EVENTS.callClick, { location });
    onClick?.(event);
  };
  return (
    <a
      href={href}
      onClick={handleClick}
      {...(isWhatsApp ? { target: "_blank", rel: "noopener" } : {})}
      {...props}
    />
  );
}
