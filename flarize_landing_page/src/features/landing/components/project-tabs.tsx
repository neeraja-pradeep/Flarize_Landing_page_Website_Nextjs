"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { track } from "@/shared/lib/analytics";
import { cn } from "@/shared/lib/cn";
import { ANALYTICS_EVENTS } from "../constants";

const TAB_KEYS = ["residential", "commercial"] as const;
type TabKey = (typeof TAB_KEYS)[number];

export interface ProjectTabsProps {
  heading: ReactNode;
  labels: Record<TabKey, string>;
  /** Server-rendered panels passed through as props (server-in-client composition). */
  panels: Record<TabKey, ReactNode>;
}

export function ProjectTabs({ heading, labels, panels }: ProjectTabsProps) {
  const [active, setActive] = useState<TabKey>("residential");
  const baseId = useId();
  const panelId = `${baseId}-panel`;

  const select = (tab: TabKey) => {
    setActive(tab);
    track(ANALYTICS_EVENTS.projectTab, { tab });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const next: TabKey = active === "residential" ? "commercial" : "residential";
    select(next);
    document.getElementById(`${baseId}-${next}`)?.focus();
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        {heading}
        <div role="tablist" aria-label="Project category" className="inline-flex gap-1 rounded-control bg-gray-100 p-1">
          {TAB_KEYS.map((tab) => {
            const isActive = tab === active;
            return (
              <button
                key={tab}
                id={`${baseId}-${tab}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                onClick={() => select(tab)}
                onKeyDown={handleKeyDown}
                className={cn(
                  "min-h-11 cursor-pointer rounded-[10px] border-0 px-[22px] text-sm font-semibold transition-colors duration-[140ms]",
                  isActive ? "bg-brand-600 text-white" : "bg-transparent text-gray-700",
                )}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>
      <div id={panelId} role="tabpanel" aria-labelledby={`${baseId}-${active}`} className="min-h-80">
        {panels[active]}
      </div>
    </>
  );
}
