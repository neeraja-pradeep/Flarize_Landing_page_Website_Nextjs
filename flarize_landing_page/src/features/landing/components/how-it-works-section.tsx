import { cn } from "@/shared/lib/cn";
import type { LandingContent } from "../schemas/landing-content.schema";
import { SECTION_IDS } from "../constants";
import { CtaButton } from "./cta-button";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

export interface HowItWorksSectionProps {
  content: LandingContent["howItWorks"];
}

function stepNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function HowItWorksSection({ content }: HowItWorksSectionProps) {
  const lastIndex = content.steps.length - 1;
  return (
    <Section id={SECTION_IDS.how} gapClassName="gap-10">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} />

      {/* Wide: horizontal timeline */}
      <ol className="hidden grid-cols-4 gap-6 steps:grid">
        {content.steps.map((step, index) => {
          const isLast = index === lastIndex;
          return (
            <li key={step.title} className="relative flex flex-col gap-3.5">
              {isLast ? null : (
                <div aria-hidden="true" className="absolute top-[23px] right-[-16px] left-14 h-0.5 bg-[linear-gradient(90deg,var(--color-brand-600),rgb(15_109_79/0.35))]" />
              )}
              <span
                className={cn(
                  "relative flex size-12 items-center justify-center rounded-full text-[15px] font-bold shadow-[0_0_0_6px_#fff]",
                  isLast ? "bg-accent text-on-accent" : "bg-brand-600 text-white",
                )}
              >
                {stepNumber(index)}
              </span>
              <h3 className="text-[17px] font-semibold text-brand-900">{step.title}</h3>
              <p className="text-sm leading-[1.6] text-gray-500">{step.description}</p>
            </li>
          );
        })}
      </ol>

      {/* Narrow: vertical timeline */}
      <ol className="flex flex-col steps:hidden">
        {content.steps.map((step, index) => {
          const isLast = index === lastIndex;
          return (
            <li key={step.title} className="relative flex gap-4 pb-7">
              {isLast ? null : <div aria-hidden="true" className="absolute top-12 bottom-1 left-[21px] w-0.5 bg-brand-600/35" />}
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  isLast ? "bg-accent text-on-accent" : "bg-brand-600 text-white",
                )}
              >
                {stepNumber(index)}
              </span>
              <div className="flex min-w-0 flex-col gap-1.5 pt-2.5">
                <h3 className="text-base font-semibold text-brand-900">{step.title}</h3>
                <p className="text-sm leading-[1.6] text-gray-500">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <CtaButton location="how_it_works">{content.ctaLabel}</CtaButton>
    </Section>
  );
}
