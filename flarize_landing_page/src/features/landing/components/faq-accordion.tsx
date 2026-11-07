"use client";

import { useId, useState } from "react";
import { track } from "@/shared/lib/analytics";
import { cn } from "@/shared/lib/cn";
import { ChevronDownIcon } from "@/ui/icons";
import { ANALYTICS_EVENTS } from "../constants";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: readonly FaqItem[];
}

/** One open at a time; the first item starts open. */
export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  const handleToggle = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(isOpening ? index : null);
    if (isOpening) track(ANALYTICS_EVENTS.faqOpen, { q: index + 1 });
  };

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-${index}`;
        return (
          <div key={item.question} className="overflow-hidden rounded-card border border-gray-200/90 bg-white">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => handleToggle(index)}
                className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-5 py-[18px] text-left text-[15px] font-semibold text-ink transition-colors hover:text-brand-600"
              >
                <span>{item.question}</span>
                <ChevronDownIcon size={20} className={cn("shrink-0 transition-transform duration-150", isOpen && "rotate-180")} />
              </button>
            </h3>
            <div id={panelId} role="region" hidden={!isOpen} className="px-5 pb-5 text-sm leading-[1.65] text-gray-700">
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
