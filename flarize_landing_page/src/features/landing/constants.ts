export const LEAD_FORM_ID = "lead-form";
export const LEAD_FORM_FIELD_NAME = "name";

export const LEAD_SOURCE = "meta_ads_landing_page";
export const KERALA_PIN_MIN = 670000;
export const KERALA_PIN_MAX = 695999;

export const PROMPT_DELAY_MS = 60_000;
export const SIMULATED_LEAD_DELAY_MS = 1_400;

export const STORAGE_KEYS = {
  leadSubmitted: "flz_lp_lead_submitted",
  promptDismissed: "flz_lp_prompt_dismissed",
} as const;

export const ANALYTICS_EVENTS = {
  pageView: "lp_view",
  ctaClick: "cta_click",
  formOpen: "form_open",
  formSubmit: "form_submit",
  formValidationError: "form_validation_error",
  leadSuccess: "lead_success",
  leadError: "lead_error",
  whatsappClick: "whatsapp_click",
  callClick: "call_click",
  popupImpression: "popup_impression",
  popupDismiss: "popup_dismiss",
  faqOpen: "faq_open",
  projectTab: "project_tab",
} as const;

export const SECTION_IDS = {
  top: "top",
  benefits: "benefits",
  why: "why",
  awards: "awards",
  experience: "experience",
  projects: "projects",
  services: "services",
  how: "how",
  faq: "faq",
} as const;

/** Where a CTA / contact click came from (analytics `location`). */
export type CtaLocation =
  | "header"
  | "benefits"
  | "why_flarize"
  | "projects"
  | "services"
  | "how_it_works"
  | "final"
  | "popup"
  | "hero_direct"
  | "footer"
  | "floating"
  | "mobile_bar"
  | "success_state"
  | "form_error";
