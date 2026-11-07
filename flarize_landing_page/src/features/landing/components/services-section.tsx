import { CheckIcon } from "@/ui/icons";
import type { LandingContent } from "../schemas/landing-content.schema";
import { SECTION_IDS } from "../constants";
import { CtaButton } from "./cta-button";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

export interface ServicesSectionProps {
  content: LandingContent["services"];
}

export function ServicesSection({ content }: ServicesSectionProps) {
  const { featured, others } = content;
  return (
    <Section id={SECTION_IDS.services} tone="muted">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-stretch gap-5">
        <div className="flex flex-col gap-4 rounded-card border border-brand-600/20 bg-white p-[clamp(24px,3vw,32px)] shadow-card">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[56px] leading-none font-bold text-brand-600">{featured.number}</span>
            <span className="rounded-full bg-accent-soft px-2.5 py-[3px] text-xs font-semibold text-accent-darker">{featured.pill}</span>
          </div>
          <h3 className="text-[clamp(20px,2.2vw,24px)] font-bold text-brand-900">{featured.title}</h3>
          <p className="text-[15px] leading-[1.6] text-gray-700">{featured.description}</p>
          <ul className="flex flex-col gap-2 text-sm text-ink">
            {featured.points.map((point) => (
              <li key={point} className="flex gap-2">
                <CheckIcon size={16} className="mt-[3px] shrink-0 text-brand-600" />
                {point}
              </li>
            ))}
          </ul>
          <CtaButton location="services" size="sm" className="mt-auto">
            {featured.ctaLabel}
          </CtaButton>
        </div>
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] content-start gap-x-6">
          {others.map((service) => (
            <li key={service.number} className="flex gap-4 border-t border-gray-200 py-5">
              <span className="min-w-10 text-[28px] leading-none font-bold text-accent">{service.number}</span>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-semibold text-ink">{service.title}</h3>
                <p className="text-sm leading-[1.55] text-gray-500">{service.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
