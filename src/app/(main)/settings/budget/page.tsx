"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, TopBar } from "@/shared/ui";
import { formatCurrency, formatCurrencyWithUnit } from "@/shared/lib/format";
import { useIsAuthenticated } from "@/features/auth";
import { useCategories, useUpdateCategoryBudget } from "@/features/expense";
import { createClient } from "@/shared/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export default function BudgetSettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { profile } = useIsAuthenticated();
  const couple = profile?.couples;
  const coupleId = profile?.couple_id ?? "";

  const { data: categories = [] } = useCategories(coupleId);
  const updateBudget = useUpdateCategoryBudget(coupleId);

  const [totalBudget, setTotalBudget] = useState(couple?.total_budget ?? 30000000);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && Object.keys(categoryBudgets).length === 0) {
      const initial: Record<string, number> = {};
      categories.forEach((cat) => {
        initial[cat.id] = cat.budget_amount;
      });
      setCategoryBudgets(initial);
    }
  }, [categories, categoryBudgets]);

  const categoryTotal = Object.values(categoryBudgets).reduce((sum, v) => sum + v, 0);
  const remaining = totalBudget - categoryTotal;

  const handleCategoryChange = (catId: string, value: string) => {
    const num = Number(value.replace(/,/g, "")) || 0;
    setCategoryBudgets((prev) => ({ ...prev, [catId]: num }));
  };

  const handleSave = async () => {
    if (!profile?.couple_id) return;
    setIsSaving(true);

    const supabase = createClient();
    await supabase
      .from("couples")
      .update({ total_budget: totalBudget })
      .eq("id", profile.couple_id);

    for (const cat of categories) {
      const newBudget = categoryBudgets[cat.id] ?? 0;
      if (newBudget !== cat.budget_amount) {
        await updateBudget.mutateAsync({ id: cat.id, budgetAmount: newBudget });
      }
    }

    queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    setIsSaving(false);
    router.back();
  };

  return (
    <div className="hide-scrollbar overflow-y-auto px-5 pt-6 pb-4">
      <TopBar title="예산 설정" onBack={() => router.back()} />

      {/* Total budget */}
      <Card className="mb-5 space-y-4">
        <h3 className="text-sm font-semibold text-neutral-700">총 예산</h3>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={formatCurrency(totalBudget)}
            onChange={(e) => {
              const raw = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
              setTotalBudget(Math.min(raw, 500000000));
            }}
            className="h-14 w-full rounded-xl border border-neutral-300 pr-10 pl-4 text-center text-2xl font-bold text-primary-600 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
          <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-neutral-400">
            원
          </span>
        </div>
        <input
          type="range"
          min={10000000}
          max={100000000}
          step={1000000}
          value={Math.min(totalBudget, 100000000)}
          onChange={(e) => setTotalBudget(Number(e.target.value))}
          className="w-full accent-primary-500"
        />
        <div className="flex justify-between text-xs text-neutral-400">
          <span>1,000만원</span>
          <span>1억원</span>
        </div>
      </Card>

      {/* Category budgets */}
      <Card className="mb-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-700">카테고리별 예산</h3>
          <span
            className={`text-xs font-medium ${
              remaining === 0
                ? "text-green-600"
                : remaining > 0
                  ? "text-amber-500"
                  : "text-error"
            }`}
          >
            {remaining === 0
              ? "배분 완료"
              : remaining > 0
                ? `잔여 ${formatCurrency(remaining)}원`
                : `${formatCurrency(Math.abs(remaining))}원 초과`}
          </span>
        </div>

        <div className="space-y-3">
          {categories.map((cat) => {
            const value = categoryBudgets[cat.id] ?? 0;
            const pct = totalBudget > 0 ? Math.round((value / totalBudget) * 100) : 0;
            return (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm text-neutral-700">{cat.name}</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatCurrency(value)}
                    onChange={(e) => handleCategoryChange(cat.id, e.target.value)}
                    className="h-10 w-full rounded-xl border border-neutral-300 pr-8 pl-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs text-neutral-400">
                    원
                  </span>
                </div>
                <span className="w-10 shrink-0 text-right text-xs text-neutral-400">{pct}%</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Button onClick={handleSave} disabled={isSaving} fullWidth>
        {isSaving ? "저장 중..." : "저장"}
      </Button>
    </div>
  );
}
