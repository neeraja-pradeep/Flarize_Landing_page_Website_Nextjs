import type { LandingContent } from "../schemas/landing-content.schema";

export interface BenefitComparisonProps {
  feature: LandingContent["benefits"]["feature"];
}

export function BenefitComparison({ feature }: BenefitComparisonProps) {
  return (
    <div className="flex flex-col gap-3.5 rounded-control border border-white/12 bg-white/6 p-[18px]">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-white/75">{feature.withoutSolar.label}</span>
        <div className="h-3.5 rounded-full bg-white/28" />
        <span className="text-xs text-white/75">{feature.withoutSolar.caption}</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-white/75">{feature.withSolar.label}</span>
        <div className="flex h-3.5 gap-0.5 overflow-hidden rounded-full">
          <div className="flex-[3] bg-accent" />
          <div className="flex-[2] bg-white/28" />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/75">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-accent" />
            {feature.withSolar.roofLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-white/40" />
            {feature.withSolar.gridLabel}
          </span>
        </div>
      </div>
      <span className="text-[11px] text-white/60">{feature.disclaimer}</span>
    </div>
  );
}
