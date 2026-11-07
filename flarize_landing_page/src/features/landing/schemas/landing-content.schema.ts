import { z } from "zod";

const text = z.string();
const titled = z.object({ title: text, description: text });
const sectionIntro = z.object({ eyebrow: text, title: text });

export const WHY_ICONS = ["components", "guidance", "wrench"] as const;

export const LandingContentSchema = z.object({
  hero: z.object({
    badge: text,
    headline: z.object({ before: text, highlight: text, after: text }),
    description: text,
    stats: z.array(z.object({ value: text, label: text, isTextValue: z.boolean().optional() })),
    credentials: z.array(text),
  }),
  leadForm: z.object({
    title: text,
    description: text,
    submitLabel: text,
    disclaimer: text,
    billRanges: z.array(z.object({ value: text, label: text })),
  }),
  benefits: sectionIntro.extend({
    ctaLabel: text,
    feature: z.object({
      pill: text,
      title: text,
      description: text,
      withoutSolar: z.object({ label: text, caption: text }),
      withSolar: z.object({ label: text, roofLabel: text, gridLabel: text }),
      disclaimer: text,
    }),
    longTerm: titled,
    informed: titled.extend({ points: z.array(text) }),
    options: titled.extend({ tags: z.array(text) }),
  }),
  why: sectionIntro.extend({
    ctaLabel: text,
    highlight: titled.extend({ pill: text }),
    items: z.array(titled.extend({ stat: text.optional(), icon: z.enum(WHY_ICONS).optional() })),
  }),
  awards: sectionIntro.extend({
    items: z.array(z.object({ image: text, alt: text, title: text, caption: text })),
  }),
  experience: sectionIntro.extend({
    stats: z.array(z.object({ label: text, value: text, caption: text })),
    timeline: z.array(z.object({ year: text, title: text, description: text })),
  }),
  projects: sectionIntro.extend({
    ctaLabel: text,
    tabs: z.object({ residential: text, commercial: text }),
    residential: z.array(
      z.object({
        id: text,
        capacity: text,
        location: text,
        imageLabel: text,
        image: text.optional(),
        description: text.optional(),
        quote: text.optional(),
        author: text.optional(),
      }),
    ),
    commercialEmpty: titled,
  }),
  services: sectionIntro.extend({
    featured: titled.extend({ number: text, pill: text, points: z.array(text), ctaLabel: text }),
    others: z.array(titled.extend({ number: text })),
  }),
  howItWorks: sectionIntro.extend({
    ctaLabel: text,
    steps: z.array(titled),
  }),
  faq: sectionIntro.extend({
    items: z.array(z.object({ question: text, answer: text })),
  }),
  finalCta: z.object({ title: text, description: text, ctaLabel: text }),
});

export type LandingContent = z.infer<typeof LandingContentSchema>;
