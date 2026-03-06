import { cn } from "@/shared/lib/cn";
import { formatCurrency } from "@/shared/lib/format";

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  showLabel?: boolean;
  showOverAmount?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  current,
  total,
  color = "bg-primary-400",
  showLabel = false,
  showOverAmount = false,
  size = "md",
}: ProgressBarProps) {
  const isOver = current > total && total > 0;
  const hasExpenseWithoutBudget = total === 0 && current > 0;
  const percentage = total === 0
    ? (current > 0 ? 100 : 0)
    : Math.min((current / total) * 100, 100);

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className="w-full">
      <div className={cn("w-full rounded-full bg-neutral-100", heights[size])}>
        <div
          className={cn(
            "rounded-full transition-all duration-500 ease-out",
            heights[size],
            color,
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-xs text-neutral-500">
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      {showOverAmount && (isOver || hasExpenseWithoutBudget) && (
        <p className="mt-1 text-xs font-medium text-primary-700">
          {hasExpenseWithoutBudget ? "예산 미설정" : `${formatCurrency(current - total)}원 초과`}
        </p>
      )}
    </div>
  );
}
