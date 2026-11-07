import { BuildingIcon } from "@/ui/icons";
import type { LandingContent } from "../schemas/landing-content.schema";
import { SECTION_IDS } from "../constants";
import { CtaButton } from "./cta-button";
import { ProjectCard } from "./project-card";
import { ProjectTabs } from "./project-tabs";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

export interface ProjectsSectionProps {
  content: LandingContent["projects"];
}

export function ProjectsSection({ content }: ProjectsSectionProps) {
  const residentialPanel = (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-5">
      {content.residential.map((project) => (
        <ProjectCard key={project.id} project={project} categoryLabel={content.tabs.residential} />
      ))}
    </div>
  );

  const commercialPanel = (
    <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-card border border-dashed border-gray-200 bg-gray-50 p-[clamp(28px,5vw,48px)] text-center">
      <div className="flex size-[52px] items-center justify-center rounded-[14px] bg-accent-soft text-accent-dark">
        <BuildingIcon size={26} />
      </div>
      <h3 className="text-lg font-semibold text-brand-900">{content.commercialEmpty.title}</h3>
      <p className="max-w-[460px] text-sm leading-[1.6] text-gray-500">{content.commercialEmpty.description}</p>
    </div>
  );

  return (
    <Section id={SECTION_IDS.projects} gapClassName="gap-7">
      <ProjectTabs
        heading={<SectionHeading eyebrow={content.eyebrow} title={content.title} />}
        labels={content.tabs}
        panels={{ residential: residentialPanel, commercial: commercialPanel }}
      />
      <CtaButton location="projects">{content.ctaLabel}</CtaButton>
    </Section>
  );
}
