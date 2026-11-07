import type { LandingContent } from "../schemas/landing-content.schema";
import { SECTION_IDS } from "../constants";
import { ComponentsIcon, GuidanceIcon, WrenchIcon, type IconProps } from "@/ui/icons";
import type { ComponentType } from "react";
import { CtaButton } from "./cta-button";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

const WHY_ICON_MAP: Record<NonNullable<LandingContent["why"]["items"][number]["icon"]>, ComponentType<IconProps>> = {
  components: ComponentsIcon,
  guidance: GuidanceIcon,
  wrench: WrenchIcon,
};

export interface WhySectionProps {
  content: LandingContent["why"];
}

export function WhySection({ content }: WhySectionProps) {
  const { highlight, items } = content;
  return (
    <Section id={SECTION_IDS.why} tone="muted">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} maxWidthClassName="max-w-[720px]" />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
        <div className="col-span-full grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-center gap-5 rounded-card bg-brand-gradient p-[clamp(24px,3.5vw,36px)] text-white">
          <div className="flex flex-col gap-3">
            <span className="self-start rounded-full bg-accent px-3 py-1 text-xs font-semibold text-on-accent">{highlight.pill}</span>
            <h3 className="text-[clamp(22px,2.6vw,28px)] leading-tight font-bold">{highlight.title}</h3>
          </div>
          <p className="text-[15px] leading-[1.65] text-pretty text-white/88">{highlight.description}</p>
        </div>
        {items.map((item) => {
          const Icon = item.icon ? WHY_ICON_MAP[item.icon] : null;
          return (
            <div key={item.title} className="flex flex-col gap-2.5 rounded-card border border-gray-200/80 bg-white p-6 shadow-card">
              {item.stat ? <span className="text-[28px] leading-none font-bold text-brand-600">{item.stat}</span> : null}
              {Icon ? <Icon size={28} className="text-brand-600" /> : null}
              <h3 className="text-[17px] font-semibold">{item.title}</h3>
              <p className="text-sm leading-[1.6] text-gray-500">{item.description}</p>
            </div>
          );
        })}
      </div>
      <CtaButton location="why_flarize">{content.ctaLabel}</CtaButton>
    </Section>
  );
}
