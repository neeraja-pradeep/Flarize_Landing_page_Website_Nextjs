"use client";

import { cn } from "@/shared/lib/cn";
import { PROPERTY_TYPE_VALUES, type PropertyType } from "../schemas/lead.schema";

const LABELS: Record<PropertyType, string> = { residential: "Residential", commercial: "Commercial" };

export interface PropertyTypeToggleProps {
  value: PropertyType;
  onChange: (value: PropertyType) => void;
}

export function PropertyTypeToggle({ value, onChange }: PropertyTypeToggleProps) {
  return (
    <div role="radiogroup" aria-label="Property type" className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-gray-700">Property Type</span>
      <div className="grid grid-cols-2 gap-2">
        {PROPERTY_TYPE_VALUES.map((type) => {
          const isSelected = value === type;
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(type)}
              className={cn(
                "h-11 cursor-pointer rounded-control border text-sm font-medium",
                isSelected ? "border-brand-600 bg-brand-50 text-brand-600" : "border-gray-200 bg-white text-gray-700",
              )}
            >
              {LABELS[type]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
