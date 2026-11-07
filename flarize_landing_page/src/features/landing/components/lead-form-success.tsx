import { SITE_CONFIG } from "@/shared/config/site";
import { CheckIcon } from "@/ui/icons";
import { ContactLink } from "./contact-link";

export interface LeadFormSuccessProps {
  firstName: string;
  phone: string;
  isSimulated: boolean;
}

export function LeadFormSuccess({ firstName, phone, isSimulated }: LeadFormSuccessProps) {
  return (
    <div role="status" className="flex flex-col gap-3.5 py-2">
      <div className="flex size-[52px] items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <CheckIcon size={26} />
      </div>
      <h2 className="text-[21px] font-bold text-brand-900">Thank you, {firstName}. We&apos;ve received your enquiry.</h2>
      <p className="text-sm leading-[1.6] text-gray-700">
        Our team will call you on <strong>+91 {phone}</strong> to understand your requirements. If you&apos;d like to talk sooner, message us on WhatsApp.
      </p>
      <ContactLink
        href={SITE_CONFIG.whatsapp.href}
        kind="whatsapp"
        location="success_state"
        className="flex h-12 items-center justify-center gap-2 rounded-control border border-gray-200 text-sm font-medium text-ink transition-colors hover:bg-gray-50"
      >
        Chat on WhatsApp
      </ContactLink>
      {isSimulated ? (
        <span className="rounded-lg bg-gray-100 px-2.5 py-1.5 text-[11px] text-gray-500">
          Prototype: simulated CMS response. Connect the lead endpoint before launch.
        </span>
      ) : null}
    </div>
  );
}
