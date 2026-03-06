import { cn } from "@/shared/lib/cn";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function Skeleton({
  className,
  width,
  height,
  rounded = true,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-neutral-200",
        rounded && "rounded-xl",
        className,
      )}
      style={{ width, height }}
    />
  );
}

interface SkeletonTextProps {
  className?: string;
  lines?: number;
  lastLineWidth?: string;
}

export function SkeletonText({
  className,
  lines = 3,
  lastLineWidth = "60%",
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 animate-pulse rounded-xl bg-neutral-200"
          style={{
            width: i === lines - 1 ? lastLineWidth : "100%",
          }}
        />
      ))}
    </div>
  );
}
