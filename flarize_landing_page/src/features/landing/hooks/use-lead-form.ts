"use client";

import { useState, type ChangeEvent, type FocusEvent } from "react";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { track } from "@/shared/lib/analytics";
import { writeSessionFlag } from "@/shared/lib/session-flag";
import { ANALYTICS_EVENTS, STORAGE_KEYS } from "../constants";
import { LeadFormSchema, type LeadContext, type LeadFormValues } from "../schemas/lead.schema";
import { submitLead } from "../server/lead.actions";
import { useLeadUiStore } from "../store";

const TRACKING_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;

type Sanitizer = (value: string) => string;

export const sanitizePhone: Sanitizer = (value) =>
  value.replace(/\D/g, "").replace(/^91(?=\d{10})/, "").slice(0, 10);
export const sanitizePin: Sanitizer = (value) => value.replace(/\D/g, "").slice(0, 6);

function readLeadContext(): LeadContext {
  const params = new URLSearchParams(window.location.search);
  const tracking: Record<string, string> = {};
  for (const key of TRACKING_PARAMS) {
    const value = params.get(key);
    if (value) tracking[key] = value;
  }
  return { pageUrl: window.location.href, referrer: document.referrer || null, tracking };
}

export interface LeadSuccess {
  readonly firstName: string;
  readonly phone: string;
  readonly isSimulated: boolean;
}

export function useLeadForm() {
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(LeadFormSchema),
    defaultValues: { name: "", phone: "", pin: "", type: "residential" },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });
  const { register, clearErrors, handleSubmit, getValues } = form;
  const selectedType = useWatch({ control: form.control, name: "type" });
  const selectedBill = useWatch({ control: form.control, name: "bill" });
  const [success, setSuccess] = useState<LeadSuccess | null>(null);

  const status = useLeadUiStore((s) => s.status);
  const setStatus = useLeadUiStore((s) => s.setStatus);

  /** Registers a field, clearing its error on input and tracking focus for the mobile bar. */
  function bind(name: FieldPath<LeadFormValues>, sanitize?: Sanitizer) {
    const field = register(name);
    return {
      ...field,
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (sanitize) event.target.value = sanitize(event.target.value);
        const ui = useLeadUiStore.getState();
        ui.markStarted();
        clearErrors(name);
        return field.onChange(event);
      },
      onFocus: () => {
        const ui = useLeadUiStore.getState();
        if (!ui.hasStarted && !ui.isFormFocused) track(ANALYTICS_EVENTS.formOpen, { location: "hero_direct" });
        ui.setFormFocused(true);
      },
      onBlur: (event: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        useLeadUiStore.getState().setFormFocused(false);
        return field.onBlur(event);
      },
    };
  }

  function setPropertyType(type: LeadFormValues["type"]) {
    useLeadUiStore.getState().markStarted();
    form.setValue("type", type);
  }

  const handleValid = async (values: LeadFormValues) => {
    setStatus("loading");
    const result = await submitLead({ values, context: readLeadContext() }).catch(() => null);
    if (result?.ok) {
      writeSessionFlag(STORAGE_KEYS.leadSubmitted);
      useLeadUiStore.getState().setPromptOpen(false);
      setSuccess({ firstName: values.name.trim().split(" ")[0] ?? "", phone: values.phone, isSimulated: result.simulated });
      setStatus("success");
      track(ANALYTICS_EVENTS.leadSuccess, { property_type: values.type, bill: values.bill });
      return;
    }
    setStatus("error");
    track(ANALYTICS_EVENTS.leadError, { message: result ? result.error : "NETWORK" });
  };

  const handleSubmitForm = handleSubmit(handleValid, (errors) => {
    setStatus("idle");
    track(ANALYTICS_EVENTS.formValidationError, { fields: Object.keys(errors).join(",") });
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (useLeadUiStore.getState().status === "loading") return;
    track(ANALYTICS_EVENTS.formSubmit);
    return handleSubmitForm(event);
  };

  return {
    form,
    errors: form.formState.errors,
    status,
    success,
    selectedType,
    selectedBill,
    getValues,
    bind,
    setPropertyType,
    onSubmit,
  };
}
