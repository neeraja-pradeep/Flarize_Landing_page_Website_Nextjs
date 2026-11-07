import type { ComponentType } from "react";
import { SITE_CONFIG, type SocialId } from "@/shared/config/site";
import { FacebookIcon, InstagramIcon, LinkedInIcon, LocationIcon, PhoneIcon, WhatsAppIcon, YouTubeIcon, type IconProps } from "@/ui/icons";
import { ContactLink } from "./contact-link";

const SOCIAL_ICONS: Record<SocialId, ComponentType<IconProps>> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  linkedin: LinkedInIcon,
};

const CONTACT_LINK_CLASS = "flex items-center gap-2.5 text-gray-700 transition-colors hover:text-brand-600";

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-start justify-between gap-x-10 gap-y-5 px-gutter py-7 text-[13px] text-gray-500">
        <address className="flex min-w-0 flex-col gap-3 not-italic">
          <span className="flex items-start gap-2.5 leading-[1.55] text-gray-700">
            <LocationIcon size={18} className="mt-px shrink-0" />
            <span>{SITE_CONFIG.address}</span>
          </span>
          <span className="flex flex-wrap gap-x-6 gap-y-2.5">
            <ContactLink href={SITE_CONFIG.phone.href} kind="call" location="footer" className={CONTACT_LINK_CLASS}>
              <PhoneIcon size={18} className="shrink-0" />
              {SITE_CONFIG.phone.display}
            </ContactLink>
            <ContactLink href={SITE_CONFIG.whatsapp.href} kind="whatsapp" location="footer" className={CONTACT_LINK_CLASS}>
              <WhatsAppIcon size={18} className="shrink-0" />
              {SITE_CONFIG.whatsapp.display}
            </ContactLink>
          </span>
        </address>
        <nav aria-label="Flarize on social media" className="flex gap-2.5">
          {SITE_CONFIG.socials.map((social) => {
            const Icon = SOCIAL_ICONS[social.id];
            return (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener"
                aria-label={`Flarize on ${social.label}`}
                className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
