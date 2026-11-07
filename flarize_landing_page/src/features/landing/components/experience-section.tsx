import type { LandingContent } from "../schemas/landing-content.schema";
import { SECTION_IDS } from "../constants";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

export interface ExperienceSectionProps {
  content: LandingContent["experience"];
}

export function ExperienceSection({ content }: ExperienceSectionProps) {
  return (
    <Section id={SECTION_IDS.experience} tone="dark" paddingClassName="py-[clamp(56px,8vw,88px)]" gapClassName="gap-10">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} isDark isBalanced={false} />
      <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-px overflow-hidden rounded-card bg-white/14">
        {content.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1.5 bg-brand-900 p-6">
            <dt className="text-xs font-medium tracking-[0.06em] text-white/70">{stat.label}</dt>
            <dd className="m-0 text-stat font-bold text-accent">{stat.value}</dd>
            <dd className="m-0 text-[13px] text-white/80">{stat.caption}</dd>
          </div>
        ))}
      </dl>
      <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-5">
        {content.timeline.map((item) => (
          <li key={item.year} className="flex flex-col gap-1.5 border-t-2 border-accent/60 pt-3.5">
            <span className="text-sm font-bold text-accent">{item.year}</span>
            <span className="text-sm font-semibold">{item.title}</span>
            <span className="text-[13px] leading-normal text-white/75">{item.description}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
