"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/shared/ui";
import { formatCurrencyWithUnit } from "@/shared/lib/format";
import { useIsAuthenticated } from "@/features/auth";
import { createClient } from "@/shared/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export default function BudgetSettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { profile } = useIsAuthenticated();
  const couple = profile?.couples;

  const [totalBudget, setTotalBudget] = useState(couple?.total_budget ?? 30000000);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!profile?.couple_id) return;
    setIsSaving(true);
    const supabase = createClient();
    await supabase
      .from("couples")
      .update({ total_budget: totalBudget })
      .eq("id", profile.couple_id);

    queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    setIsSaving(false);
    router.back();
  };

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100" aria-label="뒤로가기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <h1 className="text-xl font-bold text-neutral-900">예산 설정</h1>
      </div>

      <Card className="space-y-5">
        <div className="rounded-xl bg-neutral-50 p-4 text-center">
          <span className="text-2xl font-bold text-primary-600">
            {formatCurrencyWithUnit(totalBudget)}
          </span>
        </div>
        <input type="range" min={10000000} max={100000000} step={1000000} value={totalBudget} onChange={(e) => setTotalBudget(Number(e.target.value))} className="w-full accent-primary-500" />
        <div className="flex justify-between text-xs text-neutral-400">
          <span>1,000만원</span>
          <span>1억원</span>
        </div>
        <Button onClick={handleSave} disabled={isSaving} fullWidth>
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </Card>
    </div>
  );
}
