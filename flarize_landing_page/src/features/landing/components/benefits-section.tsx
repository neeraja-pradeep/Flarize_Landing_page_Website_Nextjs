import type { LandingContent } from "../schemas/landing-content.schema";
import { SECTION_IDS } from "../constants";
import { CheckIcon } from "@/ui/icons";
import { BenefitComparison } from "./benefit-comparison";
import { CtaButton } from "./cta-button";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

const BAR_HEIGHTS = [
  { height: 14, opacity: 0.45 },
  { height: 22, opacity: 0.6 },
  { height: 30, opacity: 0.75 },
  { height: 38, opacity: 0.9 },
  { height: 44, opacity: 1 },
] as const;

export interface BenefitsSectionProps {
  content: LandingContent["benefits"];
}

export function BenefitsSection({ content }: BenefitsSectionProps) {
  const { feature, longTerm, informed, options } = content;
  return (
    <Section id={SECTION_IDS.benefits}>
      <SectionHeading eyebrow={content.eyebrow} title={content.title} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bento:grid-cols-[1.25fr_1fr_1fr]">
        <div className="flex flex-col justify-between gap-6 rounded-card bg-brand-gradient-tilt p-[clamp(24px,3vw,32px)] text-white sm:col-span-2 bento:col-span-1 bento:col-start-1 bento:row-span-2 bento:row-start-1">
          <div className="flex flex-col gap-3">
            <span className="self-start rounded-full bg-accent/18 px-3 py-1 text-xs font-semibold text-accent">{feature.pill}</span>
            <h3 className="text-[clamp(22px,2.4vw,28px)] leading-tight font-bold">{feature.title}</h3>
            <p className="text-[15px] leading-[1.65] text-white/86">{feature.description}</p>
          </div>
          <BenefitComparison feature={feature} />
        </div>

        <div className="flex flex-col gap-3 rounded-card border border-accent/35 bg-accent-soft p-6 bento:col-start-2 bento:row-start-1">
          <div className="flex h-11 items-end gap-1" aria-hidden="true">
            {BAR_HEIGHTS.map((bar) => (
              <span key={bar.height} className="w-2.5 rounded-[3px] bg-accent" style={{ height: bar.height, opacity: bar.opacity }} />
            ))}
          </div>
          <h3 className="text-lg font-semibold text-brand-900">{longTerm.title}</h3>
          <p className="text-sm leading-[1.6] text-gray-700">{longTerm.description}</p>
        </div>

        <div className="flex flex-col gap-3 rounded-card border border-gray-200 bg-white p-6 shadow-card bento:col-start-3 bento:row-start-1">
          <h3 className="text-lg font-semibold text-brand-900">{informed.title}</h3>
          <p className="text-sm leading-[1.6] text-gray-500">{informed.description}</p>
          <ul className="flex flex-col gap-2 text-sm text-ink">
            {informed.points.map((point) => (
              <li key={point} className="flex gap-2">
                <CheckIcon size={16} className="mt-[3px] shrink-0 text-brand-600" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] items-center gap-x-6 gap-y-4 rounded-card border border-brand-600/20 bg-brand-50 p-6 sm:col-span-2 bento:col-span-2 bento:col-start-2 bento:row-start-2">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-brand-900">{options.title}</h3>
            <p className="text-sm leading-[1.6] text-gray-700">{options.description}</p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {options.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-white px-3.5 py-[7px] text-[13px] font-medium text-brand-600">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <CtaButton location="benefits">{content.ctaLabel}</CtaButton>
    </Section>
  );
}
