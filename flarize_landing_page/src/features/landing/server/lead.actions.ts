"use server";

import { env } from "@/shared/config/env";
import { LEAD_SOURCE, SIMULATED_LEAD_DELAY_MS } from "../constants";
import { LeadSubmissionSchema, type SubmitLeadResult } from "../schemas/lead.schema";

/** Re-validates the submission (Server Actions are public endpoints) and forwards it to the CMS. */
export async function submitLead(input: unknown): Promise<SubmitLeadResult> {
  const parsed = LeadSubmissionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "INVALID" };

  const { values, context } = parsed.data;
  const body = {
    name: values.name,
    mobile: `+91${values.phone}`,
    pincode: values.pin,
    monthly_bill_range: values.bill,
    property_type: values.type,
    source: LEAD_SOURCE,
    page_url: context.pageUrl,
    referrer: context.referrer,
    ...context.tracking,
    submitted_at: new Date().toISOString(),
  };

  if (!env.LEAD_ENDPOINT) {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LEAD_DELAY_MS));
    return { ok: true, simulated: true };
  }

  try {
    const res = await fetch(env.LEAD_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return res.ok ? { ok: true, simulated: false } : { ok: false, error: "SERVER" };
  } catch {
    return { ok: false, error: "SERVER" };
  }
}
