"use client";

import { formatCurrencyWithUnit } from "@/shared/lib/format";
import type { Region } from "@/shared/types";

interface StepConfirmProps {
  data: {
    role: "bride" | "groom" | null;
    weddingDate: string;
    region: Region | null;
    totalBudget: number;
  };
}

const ROLE_LABEL = { bride: "신부", groom: "신랑" } as const;

export function StepConfirm({ data }: StepConfirmProps) {
  const items = [
    { label: "역할", value: data.role ? ROLE_LABEL[data.role] : "미선택" },
    { label: "결혼식 날짜", value: data.weddingDate || "미정" },
    { label: "지역", value: data.region ?? "미선택" },
    { label: "총 예산", value: formatCurrencyWithUnit(data.totalBudget) },
  ];

  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-neutral-900">
        이대로 시작할까요?
      </h2>
      <p className="mb-8 text-sm text-neutral-500">
        설정에서 언제든 변경할 수 있어요
      </p>
      <div className="space-y-4 rounded-2xl bg-neutral-50 p-5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">{item.label}</span>
            <span className="text-sm font-semibold text-neutral-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
