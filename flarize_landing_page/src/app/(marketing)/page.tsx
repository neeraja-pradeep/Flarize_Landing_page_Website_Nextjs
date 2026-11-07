import {
  AwardsSection,
  BenefitsSection,
  ExperienceSection,
  FaqSection,
  FinalCtaSection,
  FloatingActions,
  HeroSection,
  HowItWorksSection,
  LeadPrompt,
  MobileContactBar,
  PageViewTracker,
  ProjectsSection,
  ServicesSection,
  SiteFooter,
  SiteHeader,
  WhySection,
} from "@/features/landing";
import { getLandingContent } from "@/features/landing/server/landing.queries";

export default async function LandingPage() {
  const content = await getLandingContent();
  return (
    <div className="min-h-screen bg-white max-tablet:pb-[72px]">
      <SiteHeader />
      <main>
        <HeroSection hero={content.hero} leadForm={content.leadForm} />
        <BenefitsSection content={content.benefits} />
        <WhySection content={content.why} />
        <AwardsSection content={content.awards} />
        <ExperienceSection content={content.experience} />
        <ProjectsSection content={content.projects} />
        <ServicesSection content={content.services} />
        <HowItWorksSection content={content.howItWorks} />
        <FaqSection content={content.faq} />
        <FinalCtaSection content={content.finalCta} />
      </main>
      <SiteFooter />
      <FloatingActions />
      <MobileContactBar />
      <LeadPrompt />
      <PageViewTracker />
    </div>
  );
}
