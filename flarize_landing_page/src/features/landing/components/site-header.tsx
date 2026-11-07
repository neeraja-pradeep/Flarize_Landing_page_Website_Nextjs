import Image from "next/image";
import { SITE_CONFIG } from "@/shared/config/site";
import { SECTION_IDS } from "../constants";
import { CtaButton } from "./cta-button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white shadow-header">
      <div className="mx-auto flex max-w-[1200px] items-center gap-6 px-gutter py-3">
        <a href={`#${SECTION_IDS.top}`} className="flex shrink-0 items-center">
          <Image src="/images/landing/flarize-logo.png" alt={SITE_CONFIG.name} width={256} height={55} priority className="block h-[34px] w-auto" />
        </a>
        <CtaButton location="header" size="header" className="ml-auto self-auto">
          <span className="xs:hidden">Free Consultation</span>
          <span className="hidden xs:inline">Get Your Free Consultation</span>
        </CtaButton>
      </div>
    </header>
  );
}
