"use client";

import { Card } from "@/shared/ui";
import { formatCurrency } from "@/shared/lib/format";
import type { CategoryAverage } from "../api/stats";

interface PriceRangeCardProps {
  stat: CategoryAverage;
}

export function PriceRangeCard({ stat }: PriceRangeCardProps) {
  const range = stat.max_amount - stat.min_amount;
  const p25Pct = range > 0 ? ((stat.p25_amount - stat.min_amount) / range) * 100 : 25;
  const medianPct = range > 0 ? ((stat.median_amount - stat.min_amount) / range) * 100 : 50;
  const p75Pct = range > 0 ? ((stat.p75_amount - stat.min_amount) / range) * 100 : 75;

  return (
    <Card padding="sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-900">
          {stat.category_name}
        </span>
        <span className="text-xs text-neutral-400">{stat.data_count}건</span>
      </div>

      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-lg font-bold text-primary-600">
          {formatCurrency(Math.round(stat.avg_amount))}원
        </span>
        <span className="text-xs text-neutral-400">
          중앙값 {formatCurrency(Math.round(stat.median_amount))}원
        </span>
      </div>

      {/* Range visualization */}
      <div className="relative mt-3 mb-1 h-2 rounded-full bg-neutral-100">
        {/* IQR range (p25-p75) */}
        <div
          className="absolute h-2 rounded-full bg-primary-200"
          style={{ left: `${p25Pct}%`, width: `${p75Pct - p25Pct}%` }}
        />
        {/* Median marker */}
        <div
          className="absolute top-[-2px] h-3 w-1 rounded-full bg-primary-500"
          style={{ left: `${medianPct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-neutral-400">
        <span>{formatCurrency(Math.round(stat.min_amount))}</span>
        <span>{formatCurrency(Math.round(stat.max_amount))}</span>
      </div>
    </Card>
  );
}
