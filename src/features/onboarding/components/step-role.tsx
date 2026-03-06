"use client";

import { cn } from "@/shared/lib/cn";

interface StepRoleProps {
  value: "bride" | "groom" | null;
  onChange: (role: "bride" | "groom") => void;
}

const ROLES = [
  { value: "bride" as const, label: "신부", emoji: "👰" },
  { value: "groom" as const, label: "신랑", emoji: "🤵" },
];

export function StepRole({ value, onChange }: StepRoleProps) {
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-neutral-900">
        어느 쪽이신가요?
      </h2>
      <p className="mb-8 text-sm text-neutral-500">
        추후 파트너와 함께 관리할 수 있어요
      </p>
      <div className="grid grid-cols-2 gap-4">
        {ROLES.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange(role.value)}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border-2 p-6 transition-all",
              value === role.value
                ? "border-primary-500 bg-primary-50"
                : "border-neutral-200 bg-white hover:border-neutral-300",
            )}
          >
            <span className="text-4xl">{role.emoji}</span>
            <span className={cn(
              "text-base font-semibold",
              value === role.value ? "text-primary-600" : "text-neutral-700",
            )}>
              {role.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
