import Image from "next/image";
import type { LandingContent } from "../schemas/landing-content.schema";
import { SECTION_IDS } from "../constants";
import { LeadForm } from "./lead-form";

export interface HeroSectionProps {
  hero: LandingContent["hero"];
  leadForm: LandingContent["leadForm"];
}

export function HeroSection({ hero, leadForm }: HeroSectionProps) {
  return (
    <section id={SECTION_IDS.top} className="relative scroll-mt-[70px] overflow-hidden bg-brand-900 text-white">
      <div className="absolute inset-0">
        <Image src="/images/landing/hero-rooftop.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-hero-overlay" />
      <div className="relative z-[1] mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-center gap-[clamp(24px,4vw,56px)] px-gutter pt-[clamp(28px,5vw,64px)] pb-[clamp(36px,6vw,72px)]">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap">
            <span className="size-2 rounded-full bg-accent" />
            {hero.badge}
          </div>
          <h1 lang="ml" className="font-malayalam text-hero font-bold tracking-normal text-balance">
            {hero.headline.before}
            <span className="text-accent">{hero.headline.highlight}</span>
            {hero.headline.after}
          </h1>
          <p className="max-w-[520px] text-[clamp(15px,1.4vw,17px)] leading-[1.65] text-pretty text-white/88">{hero.description}</p>
          <dl className="grid max-w-[520px] grid-cols-3 gap-2.5">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5 border-l-2 border-accent py-0.5 pl-3">
                <dd className={stat.isTextValue ? "order-1 pt-[3px] text-[15px] leading-[1.3] font-bold" : "order-1 text-[22px] font-bold"}>{stat.value}</dd>
                <dt className="order-2 text-xs leading-[1.35] text-white/80">{stat.label}</dt>
              </div>
            ))}
          </dl>
          <ul className="flex flex-wrap gap-2">
            {hero.credentials.map((credential) => (
              <li key={credential} className="rounded-lg bg-white/8 px-2.5 py-[5px] text-xs font-medium text-white/90">
                {credential}
              </li>
            ))}
          </ul>
        </div>
        <LeadForm content={leadForm} />
      </div>
    </section>
  );
}
