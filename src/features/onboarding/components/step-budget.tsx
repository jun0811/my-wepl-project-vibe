"use client";

import { type ChangeEvent } from "react";
import { DEFAULT_CATEGORIES } from "@/shared/types";
import { formatCurrency, formatCurrencyWithUnit } from "@/shared/lib/format";

interface StepBudgetProps {
  value: number;
  recommendedBudget: number | null;
  categoryBudgets: Record<string, number>;
  onChange: (budget: number) => void;
  onCategoryBudgetChange: (categoryBudgets: Record<string, number>) => void;
}

const BUDGET_PRESETS = [
  20000000, 25000000, 30000000, 35000000, 40000000, 50000000,
];

export function StepBudget({
  value,
  recommendedBudget,
  categoryBudgets,
  onChange,
  onCategoryBudgetChange,
}: StepBudgetProps) {
  const allocatedTotal = Object.values(categoryBudgets).reduce((s, v) => s + v, 0);
  const remaining = value - allocatedTotal;

  const handleCategoryChange = (name: string, amount: number) => {
    onCategoryBudgetChange({ ...categoryBudgets, [name]: amount });
  };

  const handleAmountInput = (name: string, e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    handleCategoryChange(name, raw ? Number(raw) : 0);
  };

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

      <div className="mb-6 rounded-xl bg-neutral-50 p-4 text-center">
        <span className="text-2xl font-bold text-primary-600">
          {formatCurrencyWithUnit(value)}
        </span>
      </div>

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

      <div className="mb-6 grid grid-cols-3 gap-2">
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

      <div className="rounded-xl border border-neutral-200 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-700">카테고리별 예산</h3>
          <span
            className={`text-xs font-medium ${
              remaining === 0
                ? "text-green-600"
                : remaining > 0
                  ? "text-amber-600"
                  : "text-red-500"
            }`}
          >
            {remaining === 0
              ? "배분 완료"
              : remaining > 0
                ? `잔여 ${formatCurrencyWithUnit(remaining)}`
                : `${formatCurrencyWithUnit(Math.abs(remaining))} 초과`}
          </span>
        </div>
        <div className="space-y-3">
          {DEFAULT_CATEGORIES.map((cat) => {
            const amount = categoryBudgets[cat.name] ?? 0;
            const percent = value > 0 ? Math.round((amount / value) * 100) : 0;
            return (
              <div key={cat.name} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm text-neutral-700">{cat.name}</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount > 0 ? formatCurrency(amount) : ""}
                    onChange={(e) => handleAmountInput(cat.name, e)}
                    placeholder="0"
                    className="h-11 w-full rounded-xl border border-neutral-300 pr-10 pl-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-neutral-400">
                    원
                  </span>
                </div>
                <span className="w-10 shrink-0 text-right text-xs text-neutral-400">
                  {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
