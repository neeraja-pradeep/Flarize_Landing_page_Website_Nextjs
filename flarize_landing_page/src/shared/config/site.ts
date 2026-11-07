/**
 * Business-wide contact + social details shared by the header, footer, floating
 * actions and every call/WhatsApp CTA. Swap for CMS data when the API lands.
 */
const WHATSAPP_NUMBER = "919995083579";
const WHATSAPP_MESSAGE =
  "Hi, I'm interested in solar for my property. I'd like to know about suitable options and estimated costs.";

export const SITE_CONFIG = {
  name: "Flarize",
  title: "Flarize | Rooftop Solar for Kerala Homes",
  description:
    "Rooftop solar for Kerala homes. Get a free consultation on system size, cost, PM Surya Ghar subsidy and EMI options from Flarize.",
  phone: { href: "tel:+916282922988", display: "+91 62829 22988" },
  whatsapp: {
    display: "+91 99950 83579",
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
  },
  address: "Serving Alappuzha, Ernakulam, Kannur and across Kerala",
  socials: [
    { id: "instagram", label: "Instagram", href: "https://www.instagram.com/flarize.technologies/" },
    { id: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61586953048937" },
    { id: "youtube", label: "YouTube", href: "https://www.youtube.com/@FlarizeSolarinstallation" },
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/flarize-technologies-pvt-ltd/" },
  ],
} as const;

export type SocialId = (typeof SITE_CONFIG.socials)[number]["id"];
