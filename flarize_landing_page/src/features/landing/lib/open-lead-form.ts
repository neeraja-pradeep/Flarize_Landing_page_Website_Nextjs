import "client-only";
import { track } from "@/shared/lib/analytics";
import { writeSessionFlag } from "@/shared/lib/session-flag";
import { ANALYTICS_EVENTS, LEAD_FORM_FIELD_NAME, LEAD_FORM_ID, STORAGE_KEYS, type CtaLocation } from "../constants";
import { useLeadUiStore } from "../store";

const TABLET_WIDTH = 860;
const SCROLL_OFFSET_COMPACT = 76;
const SCROLL_OFFSET_WIDE = 96;
const FOCUS_DELAY_MS = 700;
const RING_CLASS = "animate-ring-pulse";

let focusTimer: ReturnType<typeof setTimeout> | undefined;

/** Scrolls to the lead form, pulses it and focuses the first field. Used by every CTA. */
export function openLeadForm(location: CtaLocation): void {
  const form = document.getElementById(LEAD_FORM_ID);
  if (!form) return;

  track(ANALYTICS_EVENTS.ctaClick, { location });
  track(ANALYTICS_EVENTS.formOpen, { location });

  const ui = useLeadUiStore.getState();
  if (ui.isPromptOpen) {
    writeSessionFlag(STORAGE_KEYS.promptDismissed);
    ui.setPromptOpen(false);
  }

  const offset = window.innerWidth < TABLET_WIDTH ? SCROLL_OFFSET_COMPACT : SCROLL_OFFSET_WIDE;
  window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });

  form.classList.remove(RING_CLASS);
  void form.offsetWidth; // restart the animation
  form.classList.add(RING_CLASS);

  clearTimeout(focusTimer);
  focusTimer = setTimeout(() => {
    form.classList.remove(RING_CLASS);
    if (useLeadUiStore.getState().status !== "success") {
      form.querySelector<HTMLInputElement>(`[name="${LEAD_FORM_FIELD_NAME}"]`)?.focus({ preventScroll: true });
    }
  }, FOCUS_DELAY_MS);
}
