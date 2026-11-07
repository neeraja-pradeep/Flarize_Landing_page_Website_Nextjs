"use client";

import { SITE_CONFIG } from "@/shared/config/site";
import { cn } from "@/shared/lib/cn";
import { PhoneIcon, WhatsAppIcon } from "@/ui/icons";
import { useLeadUiStore } from "../store";
import { ContactLink } from "./contact-link";

/** Desktop-only call/WhatsApp buttons; hidden while the form is on screen below the float breakpoint. */
export function FloatingActions() {
  const isFormInView = useLeadUiStore((s) => s.isFormInView);
  return (
    <div className={cn("fixed right-6 bottom-6 z-[45] hidden flex-col gap-3 tablet:flex", isFormInView && "float:max-float:hidden max-float:hidden")}>
      <ContactLink
        href={SITE_CONFIG.phone.href}
        kind="call"
        location="floating"
        aria-label="Call Flarize"
        className="flex size-[52px] items-center justify-center rounded-full bg-white text-brand-600 shadow-float transition-colors hover:bg-brand-50 hover:text-brand-700"
      >
        <PhoneIcon size={22} />
      </ContactLink>
      <ContactLink
        href={SITE_CONFIG.whatsapp.href}
        kind="whatsapp"
        location="floating"
        aria-label="Chat with Flarize on WhatsApp"
        className="flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-float-strong"
      >
        <WhatsAppIcon size={28} />
      </ContactLink>
    </div>
  );
}
