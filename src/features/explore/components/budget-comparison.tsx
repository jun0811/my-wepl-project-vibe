"use client";

import { useMemo } from "react";
import { formatCurrencyWithUnit } from "@/shared/lib/format";

interface BudgetComparisonProps {
  categories: { name: string; budget: number }[];
  averages: { category_name: string; avg_amount: number }[];
}

export function BudgetComparison({ categories, averages }: BudgetComparisonProps) {
  const matched = useMemo(() => {
    const avgMap = new Map(averages.map((a) => [a.category_name, a.avg_amount]));

    const items = categories
      .filter((c) => avgMap.has(c.name) && c.budget > 0)
      .map((c) => ({
        name: c.name,
        budget: c.budget,
        avg: avgMap.get(c.name)!,
      }));

    if (items.length === 0) return [];

    const maxVal = Math.max(...items.flatMap((i) => [i.budget, i.avg]));

    return items.map((item) => ({
      ...item,
      myPct: maxVal > 0 ? (item.budget / maxVal) * 100 : 0,
      avgPct: maxVal > 0 ? (item.avg / maxVal) * 100 : 0,
    }));
  }, [categories, averages]);

  if (matched.length === 0) return null;

  return (
    <div className="space-y-4">
      {matched.map((item) => (
        <div key={item.name}>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium">{item.name}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-12 shrink-0 text-xs text-neutral-400">내 예산</span>
              <div
                className="h-4 rounded-full bg-primary-400"
                style={{ width: `${item.myPct}%`, minWidth: item.myPct > 0 ? 4 : 0 }}
              />
              <span className="shrink-0 text-xs font-medium">
                {formatCurrencyWithUnit(item.budget)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 shrink-0 text-xs text-neutral-400">평균</span>
              <div
                className="h-4 rounded-full bg-secondary-400"
                style={{ width: `${item.avgPct}%`, minWidth: item.avgPct > 0 ? 4 : 0 }}
              />
              <span className="shrink-0 text-xs font-medium">
                {formatCurrencyWithUnit(item.avg)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
