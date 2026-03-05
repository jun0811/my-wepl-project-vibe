"use client";

import { cn } from "@/shared/lib/cn";

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
  size?: "sm" | "md";
}

export function Chip({
  label,
  selected = false,
  onClick,
  removable = false,
  onRemove,
  size = "md",
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border transition-colors",
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
        selected
          ? "border-primary-500 bg-primary-50 text-primary-700"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300",
      )}
    >
      {label}
      {removable && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              onRemove?.();
            }
          }}
          className="ml-0.5 text-neutral-400 hover:text-neutral-600"
        >
          x
        </span>
      )}
    </button>
  );
}
