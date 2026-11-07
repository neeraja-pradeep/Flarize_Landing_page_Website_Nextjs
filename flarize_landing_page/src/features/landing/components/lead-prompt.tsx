"use client";

import { useEffect } from "react";
import { track } from "@/shared/lib/analytics";
import { readSessionFlag, writeSessionFlag } from "@/shared/lib/session-flag";
import { CloseIcon } from "@/ui/icons";
import { ANALYTICS_EVENTS, PROMPT_DELAY_MS, STORAGE_KEYS } from "../constants";
import { useLeadUiStore } from "../store";
import { CtaButton } from "./cta-button";

/** Timed nudge shown once per session to visitors who haven't touched the form. */
export function LeadPrompt() {
  const isOpen = useLeadUiStore((s) => s.isPromptOpen);
  const setPromptOpen = useLeadUiStore((s) => s.setPromptOpen);

  useEffect(() => {
    const timer = setTimeout(() => {
      const ui = useLeadUiStore.getState();
      const hasBeenHandled = readSessionFlag(STORAGE_KEYS.leadSubmitted) || readSessionFlag(STORAGE_KEYS.promptDismissed);
      if (ui.status === "success" || ui.hasStarted || ui.isFormFocused || hasBeenHandled) return;
      ui.setPromptOpen(true);
      track(ANALYTICS_EVENTS.popupImpression);
    }, PROMPT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    writeSessionFlag(STORAGE_KEYS.promptDismissed);
    setPromptOpen(false);
    track(ANALYTICS_EVENTS.popupDismiss);
  };

  return (
    <div
      role="dialog"
      aria-label="Free solar consultation"
      className="fixed bottom-[84px] left-4 z-50 flex w-[min(340px,calc(100%-32px))] flex-col gap-2.5 rounded-card border border-gray-200 bg-white p-5 shadow-popup tablet:bottom-6"
    >
      <button
        type="button"
        onClick={handleClose}
        aria-label="Close"
        className="absolute top-2 right-2 flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-gray-500 transition-colors hover:bg-gray-100"
      >
        <CloseIcon size={18} />
      </button>
      <strong className="pr-7 text-base text-brand-900">Thinking about solar for your home?</strong>
      <p className="text-[13.5px] leading-[1.55] text-gray-700">
        Our team can walk you through suitable options, estimated cost and subsidy eligibility. It&apos;s free.
      </p>
      <CtaButton location="popup" size="popup" className="self-auto">
        Get My Free Solar Consultation
      </CtaButton>
    </div>
  );
}
