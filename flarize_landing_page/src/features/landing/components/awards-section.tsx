import Image from "next/image";
import { TrophyIcon } from "@/ui/icons";
import type { LandingContent } from "../schemas/landing-content.schema";
import { SECTION_IDS } from "../constants";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

export interface AwardsSectionProps {
  content: LandingContent["awards"];
}

export function AwardsSection({ content }: AwardsSectionProps) {
  return (
    <Section id={SECTION_IDS.awards}>
      <SectionHeading eyebrow={content.eyebrow} title={content.title} isCentered isBalanced={false} />
      <div className="mx-auto grid w-full max-w-[1080px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-6">
        {content.items.map((award) => (
          <figure key={award.title} className="m-0 flex flex-col overflow-hidden rounded-card border border-gray-200 bg-sand">
            <Image src={award.image} alt={award.alt} width={554} height={262} sizes="(min-width: 1120px) 540px, 100vw" className="block aspect-[554/262] w-full object-cover" />
            <figcaption className="flex items-center gap-3.5 px-5 py-[18px]">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-accent-soft text-accent-dark">
                <TrophyIcon size={22} />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-base leading-[1.35] font-semibold text-brand-900">{award.title}</h3>
                <span className="text-[13px] text-gray-500">{award.caption}</span>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
