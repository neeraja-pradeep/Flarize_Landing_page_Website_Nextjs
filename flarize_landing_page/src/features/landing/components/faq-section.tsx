import type { LandingContent } from "../schemas/landing-content.schema";
import { SECTION_IDS } from "../constants";
import { FaqAccordion } from "./faq-accordion";
import { Section } from "./section";
import { SectionHeading } from "./section-heading";

export interface FaqSectionProps {
  content: LandingContent["faq"];
}

export function FaqSection({ content }: FaqSectionProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return (
    <Section id={SECTION_IDS.faq} tone="muted" width="narrow" gapClassName="gap-7">
      <SectionHeading eyebrow={content.eyebrow} title={content.title} isBalanced={false} />
      <FaqAccordion items={content.items} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </Section>
  );
}
