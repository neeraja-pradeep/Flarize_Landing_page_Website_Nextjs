import { SITE_CONFIG } from "@/shared/config/site";
import { PhoneIcon, WhatsAppIcon } from "@/ui/icons";
import type { LandingContent } from "../schemas/landing-content.schema";
import { ContactLink } from "./contact-link";
import { CtaButton } from "./cta-button";

export interface FinalCtaSectionProps {
  content: LandingContent["finalCta"];
}

export function FinalCtaSection({ content }: FinalCtaSectionProps) {
  return (
    <section className="px-gutter py-[clamp(40px,6vw,72px)]">
      <div className="mx-auto flex max-w-[1136px] flex-col items-start gap-5 rounded-card bg-brand-gradient p-[clamp(28px,5vw,56px)] text-white">
        <h2 className="max-w-[640px] text-section font-bold text-balance">{content.title}</h2>
        <p className="max-w-[620px] text-base leading-[1.6] text-white/88">{content.description}</p>
        <div className="flex flex-wrap gap-3">
          <CtaButton location="final">{content.ctaLabel}</CtaButton>
          <ContactLink
            href={SITE_CONFIG.whatsapp.href}
            kind="whatsapp"
            location="final"
            className="flex items-center gap-2 rounded-control bg-white px-5 py-3.5 text-[15px] font-medium text-brand-900 transition-colors hover:bg-gray-50"
          >
            <WhatsAppIcon size={18} className="text-whatsapp" />
            WhatsApp Us
          </ContactLink>
          <ContactLink
            href={SITE_CONFIG.phone.href}
            kind="call"
            location="final"
            className="flex items-center gap-2 rounded-control border border-white/40 px-5 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-white/8"
          >
            <PhoneIcon size={18} />
            Call Us
          </ContactLink>
        </div>
      </div>
    </section>
  );
}
