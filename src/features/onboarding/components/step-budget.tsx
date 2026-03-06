"use client";

import { formatCurrencyWithUnit } from "@/shared/lib/format";

interface StepBudgetProps {
  value: number;
  recommendedBudget: number | null;
  onChange: (budget: number) => void;
}

const BUDGET_PRESETS = [
  20000000, 25000000, 30000000, 35000000, 40000000, 50000000,
];

export function StepBudget({ value, recommendedBudget, onChange }: StepBudgetProps) {
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-neutral-900">
        총 예산을 설정해주세요
      </h2>
      {recommendedBudget && (
        <p className="mb-6 text-sm text-secondary-600">
          해당 지역 평균 예산: {formatCurrencyWithUnit(recommendedBudget)}
        </p>
      )}

      {/* Current value display */}
      <div className="mb-6 rounded-xl bg-neutral-50 p-4 text-center">
        <span className="text-2xl font-bold text-primary-600">
          {formatCurrencyWithUnit(value)}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={10000000}
        max={100000000}
        step={1000000}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mb-6 w-full accent-primary-500"
      />
      <div className="mb-6 flex justify-between text-xs text-neutral-400">
        <span>1,000만원</span>
        <span>1억원</span>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-3 gap-2">
        {BUDGET_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
              value === preset
                ? "border-primary-500 bg-primary-50 text-primary-600"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
            }`}
          >
            {formatCurrencyWithUnit(preset)}
          </button>
        ))}
      </div>
    </div>
  );
}
