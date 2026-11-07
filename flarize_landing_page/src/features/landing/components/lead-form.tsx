"use client";

import { useCallback, useId, useRef } from "react";
import { SITE_CONFIG } from "@/shared/config/site";
import { Button } from "@/ui/button";
import type { LandingContent } from "../schemas/landing-content.schema";
import { LEAD_FORM_FIELD_NAME, LEAD_FORM_ID } from "../constants";
import { sanitizePhone, sanitizePin, useLeadForm } from "../hooks/use-lead-form";
import { useInView } from "../hooks/use-in-view";
import { useLeadUiStore } from "../store";
import { cn } from "@/shared/lib/cn";
import { ContactLink } from "./contact-link";
import { FIELD_BASE, FormField, fieldBorder } from "./form-field";
import { LeadFormSuccess } from "./lead-form-success";
import { PropertyTypeToggle } from "./property-type-toggle";

export interface LeadFormProps {
  content: LandingContent["leadForm"];
}

const SUBMIT_LABELS = { loading: "Sending your enquiry…", error: "Try Again" } as const;

export function LeadForm({ content }: LeadFormProps) {
  const { errors, status, success, selectedType, selectedBill, bind, setPropertyType, onSubmit } = useLeadForm();
  const cardRef = useRef<HTMLDivElement>(null);
  const setFormInView = useLeadUiStore((s) => s.setFormInView);
  useInView(cardRef, useCallback((isInView: boolean) => setFormInView(isInView), [setFormInView]));

  const ids = { name: useId(), phone: useId(), pin: useId(), bill: useId() };
  const isLoading = status === "loading";

  return (
    <div
      id={LEAD_FORM_ID}
      ref={cardRef}
      className="min-w-0 scroll-mt-20 rounded-card bg-white p-[clamp(20px,3vw,28px)] text-ink shadow-form"
    >
      {success ? (
        <LeadFormSuccess {...success} />
      ) : (
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1">
            <h2 className="text-[21px] font-bold text-brand-900">{content.title}</h2>
            <p className="text-[13.5px] leading-[1.55] text-gray-500">{content.description}</p>
          </div>

          <FormField label="Full Name" errorId={ids.name} error={errors.name?.message}>
            <input
              {...bind(LEAD_FORM_FIELD_NAME)}
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? ids.name : undefined}
              className={cn(FIELD_BASE, fieldBorder(!!errors.name))}
            />
          </FormField>

          <FormField label="Mobile Number" errorId={ids.phone} error={errors.phone?.message}>
            <div className={cn("flex h-12 overflow-hidden rounded-field border bg-field-bg", fieldBorder(!!errors.phone))}>
              <span className="flex items-center border-r border-field-border px-3 text-[15px] text-gray-500">+91</span>
              <input
                {...bind("phone", sanitizePhone)}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                placeholder="10-digit mobile number"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? ids.phone : undefined}
                className="min-w-0 flex-1 border-0 bg-transparent px-3.5 text-[15px] text-ink outline-none"
              />
            </div>
          </FormField>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
            <FormField label="PIN Code" errorId={ids.pin} error={errors.pin?.message}>
              <input
                {...bind("pin", sanitizePin)}
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                placeholder="e.g. 688001"
                aria-invalid={!!errors.pin}
                aria-describedby={errors.pin ? ids.pin : undefined}
                className={cn(FIELD_BASE, fieldBorder(!!errors.pin))}
              />
            </FormField>
            <FormField label="Monthly Electricity Bill" errorId={ids.bill} error={errors.bill?.message}>
              <select
                {...bind("bill")}
                defaultValue=""
                aria-invalid={!!errors.bill}
                aria-describedby={errors.bill ? ids.bill : undefined}
                className={cn(FIELD_BASE, "px-2.5", fieldBorder(!!errors.bill), selectedBill ? "text-ink" : "text-placeholder")}
              >
                <option value="">Select range</option>
                {content.billRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <PropertyTypeToggle value={selectedType} onChange={setPropertyType} />

          {status === "error" ? (
            <div role="alert" className="rounded-control border border-danger-border/25 bg-danger-border/8 px-3.5 py-3 text-[13px] leading-normal text-danger-dark">
              We couldn&apos;t send your enquiry. Your details are still here, so please try again. If it keeps failing, call us on{" "}
              <ContactLink href={SITE_CONFIG.phone.href} kind="call" location="form_error" className="font-semibold text-danger-dark underline">
                {SITE_CONFIG.phone.display}
              </ContactLink>
              .
            </div>
          ) : null}

          <Button type="submit" size="form" disabled={isLoading} className={cn(isLoading && "opacity-60")}>
            {status === "loading" || status === "error" ? SUBMIT_LABELS[status] : content.submitLabel}
          </Button>
          <p className="text-center text-xs leading-normal text-gray-500">{content.disclaimer}</p>
        </form>
      )}
    </div>
  );
}
