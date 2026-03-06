"use client";

import { cn } from "@/shared/lib/cn";
import { REGIONS, type Region } from "@/shared/types";

interface StepRegionProps {
  value: Region | null;
  onChange: (region: Region) => void;
}

export function StepRegion({ value, onChange }: StepRegionProps) {
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-neutral-900">
        결혼식 지역은 어디인가요?
      </h2>
      <p className="mb-8 text-sm text-neutral-500">
        지역별 평균 비용을 추천해드려요
      </p>
      <div className="grid grid-cols-2 gap-3">
        {REGIONS.map((region) => (
          <button
            key={region}
            type="button"
            onClick={() => onChange(region)}
            className={cn(
              "rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all",
              value === region
                ? "border-primary-500 bg-primary-50 text-primary-600"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300",
            )}
          >
            {region}
          </button>
        ))}
      </div>
    </div>
  );
}
