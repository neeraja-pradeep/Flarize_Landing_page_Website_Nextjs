"use client";

import { SITE_CONFIG } from "@/shared/config/site";
import { cn } from "@/shared/lib/cn";
import { PhoneIcon, WhatsAppIcon } from "@/ui/icons";
import { useLeadUiStore } from "../store";
import { ContactLink } from "./contact-link";

/** Phone-only sticky call/WhatsApp bar; hidden while a form field is focused. */
export function MobileContactBar() {
  const isFormFocused = useLeadUiStore((s) => s.isFormFocused);
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[45] grid grid-cols-2 gap-2 bg-white px-3 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] shadow-bar tablet:hidden",
        isFormFocused && "hidden",
      )}
    >
      <ContactLink
        href={SITE_CONFIG.phone.href}
        kind="call"
        location="mobile_bar"
        className="flex h-12 items-center justify-center gap-2 rounded-control border border-gray-200 text-[15px] font-semibold text-brand-900"
      >
        <PhoneIcon size={18} />
        Call
      </ContactLink>
      <ContactLink
        href={SITE_CONFIG.whatsapp.href}
        kind="whatsapp"
        location="mobile_bar"
        className="flex h-12 items-center justify-center gap-2 rounded-control bg-whatsapp text-[15px] font-semibold text-white transition-colors hover:text-white"
      >
        <WhatsAppIcon size={20} />
        WhatsApp
      </ContactLink>
    </div>
  );
}
