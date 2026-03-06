"use client";

import { type ChangeEvent } from "react";
import { cn } from "@/shared/lib/cn";
import { formatCurrency } from "@/shared/lib/format";

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function AmountInput({
  value,
  onChange,
  label,
  error,
  placeholder = "0",
  className,
}: AmountInputProps) {
  const displayValue = value > 0 ? formatCurrency(value) : "";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    onChange(raw ? Number(raw) : 0);
  };

  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "h-12 w-full rounded-xl border border-neutral-200 pr-10 pl-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-primary-400 focus:ring-1 focus:ring-primary-400 focus:outline-none",
            error && "border-error focus:border-error focus:ring-error",
            className,
          )}
        />
        <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-neutral-400">
          원
        </span>
      </div>
      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  );
}
