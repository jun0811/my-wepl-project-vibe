import { cn } from "@/shared/lib/cn";

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  current,
  total,
  color = "bg-primary-500",
  showLabel = false,
  size = "md",
}: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.min((current / total) * 100, 100);
  const isOver = current > total && total > 0;

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
            isOver ? "bg-error" : color,
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-xs text-neutral-500">
          <span className={cn(isOver && "text-error font-medium")}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
