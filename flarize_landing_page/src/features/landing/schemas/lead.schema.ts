import { z } from "zod";
import { KERALA_PIN_MAX, KERALA_PIN_MIN } from "../constants";

export const BILL_RANGE_VALUES = ["below-1000", "1000-2500", "2500-5000", "5000-10000", "above-10000"] as const;
export const PROPERTY_TYPE_VALUES = ["residential", "commercial"] as const;

export const LeadFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  phone: z
    .string()
    .min(1, "Please enter your mobile number.")
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
  pin: z
    .string()
    .min(1, "Please enter your PIN code.")
    .regex(/^\d{6}$/, "PIN code should be 6 digits.")
    .refine((v) => Number(v) >= KERALA_PIN_MIN && Number(v) <= KERALA_PIN_MAX, "We currently serve Kerala PIN codes."),
  bill: z.enum(BILL_RANGE_VALUES, { error: "Please select your approximate bill." }),
  type: z.enum(PROPERTY_TYPE_VALUES),
});
export type LeadFormValues = z.infer<typeof LeadFormSchema>;
export type PropertyType = (typeof PROPERTY_TYPE_VALUES)[number];

/** Attribution captured in the browser and sent alongside the form values. */
export const LeadContextSchema = z.object({
  pageUrl: z.string(),
  referrer: z.string().nullable(),
  tracking: z.record(z.string(), z.string()),
});
export type LeadContext = z.infer<typeof LeadContextSchema>;

export const LeadSubmissionSchema = z.object({ values: LeadFormSchema, context: LeadContextSchema });
export type LeadSubmission = z.infer<typeof LeadSubmissionSchema>;

export type SubmitLeadResult =
  | { readonly ok: true; readonly simulated: boolean }
  | { readonly ok: false; readonly error: "INVALID" | "SERVER" };
