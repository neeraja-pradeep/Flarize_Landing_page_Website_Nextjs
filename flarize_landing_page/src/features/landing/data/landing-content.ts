import type { LandingContent } from "../schemas/landing-content.schema";

/** Static copy from the approved design. Replaced by an API/CMS response via `getLandingContent`. */
export const LANDING_CONTENT: LandingContent = {
  hero: {
    badge: "Rooftop solar for Kerala homes",
    headline: { before: "വൈദ്യുതി ബിൽ കുറയ്ക്കാം, ", highlight: "സോളാറിലൂടെ", after: " കൂടുതൽ ലാഭിക്കാം." },
    description:
      "Explore solar systems that suit your home, understand your potential savings, and get clear guidance on pricing, applicable subsidies and installation.",
    stats: [
      { value: "8+", label: "Years of experience" },
      { value: "300+", label: "Projects completed" },
      { value: "Dedicated", label: "Service office", isTextValue: true },
    ],
    credentials: ["MNRE-registered vendor", "KSEB approved installer", "PM Surya Ghar subsidy support"],
  },
  leadForm: {
    title: "Get Your Free Solar Consultation",
    description: "Share a few details and our team will contact you to understand your solar requirements.",
    submitLabel: "Request My Free Consultation",
    disclaimer: "No obligation. We use your details only to contact you about solar.",
    billRanges: [
      { value: "below-1000", label: "Below ₹1,000" },
      { value: "1000-2500", label: "₹1,000 – ₹2,500" },
      { value: "2500-5000", label: "₹2,500 – ₹5,000" },
      { value: "5000-10000", label: "₹5,000 – ₹10,000" },
      { value: "above-10000", label: "Above ₹10,000" },
    ],
  },
  benefits: {
    eyebrow: "Why solar",
    title: "Make Your Electricity Bill Work Better for You.",
    ctaLabel: "Explore Solar for My Home",
    feature: {
      pill: "Lower electricity expenses",
      title: "Reduce Grid Electricity Dependence",
      description: "Generate electricity from your rooftop and potentially reduce the electricity you purchase from the grid.",
      withoutSolar: { label: "Without solar", caption: "Every unit you use is bought from the grid" },
      withSolar: { label: "With rooftop solar", roofLabel: "From your roof", gridLabel: "From the grid" },
      disclaimer: "Illustrative only. Your mix depends on usage, roof and system size.",
    },
    longTerm: {
      title: "Long-Term Value",
      description:
        "A properly designed solar system can generate electricity over many years, subject to performance, usage, and maintenance.",
    },
    informed: {
      title: "Make an Informed Decision",
      description: "Understand the factors that influence solar suitability and potential savings before proceeding.",
      points: ["Your monthly units", "Roof space and shade", "Budget and future needs"],
    },
    options: {
      title: "Understand Your Options",
      description: "Get expert guidance on system sizing, estimated cost, financing options, and applicable subsidy eligibility.",
      tags: ["System sizing", "Estimated cost", "PM Surya Ghar subsidy", "EMI options"],
    },
  },
  why: {
    eyebrow: "Why Flarize",
    title: "More Than Solar Installation. A Partner for Your Solar Journey.",
    ctaLabel: "Get My Free Solar Consultation",
    highlight: {
      pill: "What sets us apart",
      title: "Dedicated Service Office",
      description:
        "Your installer won't disappear after the panels go up. Our service office is your clear point of contact for repairs, scheduled annual check-ups and performance questions, across Kerala.",
    },
    items: [
      {
        stat: "8+",
        title: "Years of Experience",
        description: "Working in Kerala solar since 2018, first on commercial projects and, since 2024, focused on homes.",
      },
      {
        icon: "components",
        title: "Quality Solar Components",
        description: "Compare panels and inverters from approved brands, with a clear explanation of what suits your roof and budget.",
      },
      {
        icon: "guidance",
        title: "Expert Guidance",
        description: "Understand system options, installation requirements, costs and PM Surya Ghar subsidy eligibility before you decide.",
      },
      {
        icon: "wrench",
        title: "Installation and Service Support",
        description: "From subsidy paperwork to installation, activation and annual check-ups, one team supports you at every stage.",
      },
    ],
  },
  awards: {
    eyebrow: "Recognised & Trusted",
    title: "Recognised in Kerala",
    items: [
      {
        image: "/images/landing/award-tech-enabled-provider.png",
        alt: "Flarize team receiving the Best Technology-Enabled Solar Solutions Provider award",
        title: "Best Technology-Enabled Solar Solutions Provider",
        caption: "Kerala Energy Excellence Awards 2026.",
      },
      {
        image: "/images/landing/award-visionary-leader.png",
        alt: "Harikrishnan K.R receiving the Visionary Leader of the Year award",
        title: "Visionary Leader of the Year",
        caption: "Harikrishnan K.R, Kerala Energy Excellence Awards 2026.",
      },
    ],
  },
  experience: {
    eyebrow: "Our track record",
    title: "Experience You Can Build On.",
    stats: [
      { label: "YEARS OF EXPERIENCE", value: "8+", caption: "In Kerala solar since 2018" },
      { label: "PROJECTS", value: "300+", caption: "Homes and businesses powered" },
      { label: "KW INSTALLED", value: "2,000+", caption: "kW of clean energy enabled" },
      { label: "CUSTOMER RATING", value: "4.9/5", caption: "Average from installed customers" },
    ],
    timeline: [
      { year: "2018", title: "Golden Ray", description: "Started in Kerala; registered as a company in 2019." },
      { year: "2019", title: "Statewide expansion", description: "Built the business on commercial solar." },
      { year: "2022", title: "MNRE-registered", description: "Ready to handle customer subsidies." },
      { year: "2024", title: "Homes come first", description: "Residential focus with PM Surya Ghar, starting in Alappuzha." },
      { year: "2026", title: "Flarize, pan-Kerala", description: "Platform launches statewide." },
    ],
  },
  projects: {
    eyebrow: "Our projects",
    title: "Solar Solutions for Real-World Needs.",
    ctaLabel: "Discuss Your Solar Project",
    tabs: { residential: "Residential", commercial: "Commercial" },
    residential: [
      {
        id: "project-1",
        capacity: "3 kW",
        location: "Vadakkal, Alappuzha",
        imageLabel: "Drop Flarize project photo: 3 kW, Vadakkal",
        quote:
          "The team explained every stage, from understanding our energy needs to system design, installation and activation. Timelines were shared in advance and the work stayed on track, no unnecessary delays.",
        author: "Jose V P, homeowner",
      },
      {
        id: "project-2",
        capacity: "Capacity TBC",
        location: "Location to be confirmed",
        imageLabel: "Drop approved residential project photo",
        description: "Short project description from the approved project record.",
      },
      {
        id: "project-3",
        capacity: "Capacity TBC",
        location: "Location to be confirmed",
        imageLabel: "Drop approved residential project photo",
        description: "Short project description from the approved project record.",
      },
    ],
    commercialEmpty: {
      title: "Commercial project gallery coming soon",
      description:
        "We're preparing approved photos and details of our commercial installations. Tell us about your business and our team can share relevant examples with you.",
    },
  },
  services: {
    eyebrow: "Services",
    title: "Solar Solutions for Your Needs.",
    featured: {
      number: "01",
      pill: "Most homeowners start here",
      title: "Residential Solar Installation",
      description:
        "Rooftop systems sized to your home's usage and roof, with PM Surya Ghar subsidy support from application to bank transfer.",
      points: ["Site assessment and system design", "Certified installation and activation", "Subsidy paperwork handled for you"],
      ctaLabel: "Find the Right Solar Solution",
    },
    others: [
      { number: "02", title: "Commercial Solar Solutions", description: "Solar for shops, offices and businesses with higher daytime use." },
      { number: "03", title: "Consultation and System Selection", description: "Honest comparisons of system sizes for your roof and bill." },
      { number: "04", title: "Panel and Inverter Guidance", description: "Compare approved brands and understand what each option offers." },
      { number: "05", title: "Quotation and EMI Guidance", description: "Transparent pricing, with subsidy and EMI options explained clearly." },
      { number: "06", title: "Installation and After-Sales Support", description: "Annual check-ups and quick repairs from our dedicated service office." },
    ],
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "What Happens After You Enquire",
    ctaLabel: "Get Started with Solar",
    steps: [
      { title: "Share Your Requirements", description: "Submit your contact details, location, and approximate electricity bill." },
      { title: "Speak With Our Team", description: "The Flarize team contacts you to understand your needs." },
      { title: "Explore Suitable Options", description: "Get guidance on system sizing, estimated pricing, and applicable subsidy or financing options." },
      { title: "Plan Your Installation", description: "Proceed with the required assessment, quotation, and installation arrangements." },
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    items: [
      {
        question: "How can rooftop solar help reduce electricity expenses?",
        answer:
          "Panels on your roof generate electricity during the day, which reduces the units you buy from KSEB. How much you save depends on your usage, roof, system size and tariff, so our team reviews your bill before recommending anything.",
      },
      {
        question: "How do I choose the right solar system size?",
        answer:
          "System size is based mainly on your monthly units, available shade-free roof area and future plans such as an EV or induction cooking. Our team suggests a size after looking at your bill and, where needed, a site assessment.",
      },
      {
        question: "Is a government subsidy available for my installation?",
        answer:
          "Eligible residential installations can apply for the PM Surya Ghar subsidy, up to ₹78,000 from MNRE. Eligibility depends on the scheme rules. As an MNRE-registered vendor, we handle the application from paperwork to bank transfer.",
      },
      {
        question: "How much does a residential solar system cost?",
        answer:
          "Cost depends on system size, panel and inverter brands, and your roof. We share a clear quote with the subsidy and EMI figures shown separately, so you can compare before deciding.",
      },
      {
        question: "Can I explore EMI or financing options?",
        answer: "Yes. Multiple EMI options are available, starting from ₹2,000 a month. Our team can explain the options that apply to your system.",
      },
      {
        question: "How long does installation take?",
        answer:
          "Once your system is finalised, installation to activation typically takes 2–6 days. Approvals and site conditions can affect the overall timeline, and we share it with you in advance.",
      },
      {
        question: "What warranties are available?",
        answer:
          "Panel and inverter warranties depend on the brands you choose. Your quote lists the warranty for each component, and Flarize supports your system for 25 years.",
      },
      {
        question: "What happens after I submit an enquiry?",
        answer:
          "Our sales team calls you to understand your needs, then walks you through suitable options, estimated pricing and subsidy or financing information. There is no obligation to proceed.",
      },
      {
        question: "What service support does Flarize provide?",
        answer: "Our dedicated service office handles repairs, annual check-ups and performance questions after installation, so you always have someone to contact.",
      },
    ],
  },
  finalCta: {
    title: "Ready to Explore Solar for Your Home?",
    description: "Share your requirements and let our team help you understand suitable solar options, estimated costs, and the next steps.",
    ctaLabel: "Get My Free Solar Consultation",
  },
};
