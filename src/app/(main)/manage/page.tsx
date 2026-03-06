"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, BottomSheet } from "@/shared/ui";
import { ProgressBar } from "@/shared/ui/progress-bar";
import { FAB } from "@/shared/ui/fab";
import { formatCurrency } from "@/shared/lib/format";
import { useCategories, useExpenses, useCreateExpense } from "@/features/expense";
import { ExpenseForm } from "@/features/expense/components/expense-form";
import { useIsAuthenticated } from "@/features/auth";

// Mock data for trial mode
const MOCK_CATEGORIES = [
  { id: "1", name: "웨딩홀", budget_amount: 12000000, icon: "building", sort_order: 0, is_default: true, couple_id: "", created_at: "" },
  { id: "2", name: "스튜디오", budget_amount: 3500000, icon: "camera", sort_order: 1, is_default: true, couple_id: "", created_at: "" },
  { id: "3", name: "드레스/턱시도", budget_amount: 3000000, icon: "shirt", sort_order: 2, is_default: true, couple_id: "", created_at: "" },
  { id: "4", name: "예물/예단", budget_amount: 5000000, icon: "gem", sort_order: 3, is_default: true, couple_id: "", created_at: "" },
  { id: "5", name: "혼수", budget_amount: 6000000, icon: "sofa", sort_order: 4, is_default: true, couple_id: "", created_at: "" },
  { id: "6", name: "신혼여행", budget_amount: 2000000, icon: "plane", sort_order: 5, is_default: true, couple_id: "", created_at: "" },
  { id: "7", name: "기타", budget_amount: 500000, icon: "plus", sort_order: 6, is_default: true, couple_id: "", created_at: "" },
];

const MOCK_EXPENSE_MAP: Record<string, number> = {
  "1": 8000000,
  "2": 1200000,
  "3": 2500000,
  "4": 550000,
  "5": 0,
  "6": 0,
  "7": 250000,
};

const MOCK_COUNT_MAP: Record<string, number> = {
  "1": 3, "2": 2, "3": 4, "4": 1, "5": 0, "6": 0, "7": 2,
};

export default function ManagePage() {
  const { isAuthenticated, profile } = useIsAuthenticated();
  const coupleId = profile?.couple_id ?? "";
  const [showForm, setShowForm] = useState(false);

  const { data: categories } = useCategories(coupleId);
  const { data: allExpenses } = useExpenses(coupleId);
  const createMutation = useCreateExpense(coupleId);

  const isTrial = !isAuthenticated;
  const displayCategories = isTrial ? MOCK_CATEGORIES : (categories ?? []);

  const expenseByCategory = (allExpenses ?? []).reduce<Record<string, { total: number; count: number }>>(
    (acc, exp) => {
      if (!acc[exp.category_id]) acc[exp.category_id] = { total: 0, count: 0 };
      acc[exp.category_id].total += exp.amount;
      acc[exp.category_id].count += 1;
      return acc;
    },
    {},
  );

  const getCategoryExpense = (catId: string) =>
    isTrial ? (MOCK_EXPENSE_MAP[catId] ?? 0) : (expenseByCategory[catId]?.total ?? 0);

  const getCategoryCount = (catId: string) =>
    isTrial ? (MOCK_COUNT_MAP[catId] ?? 0) : (expenseByCategory[catId]?.count ?? 0);

  const totalBudget = displayCategories.reduce((sum, c) => sum + c.budget_amount, 0);
  const totalExpense = displayCategories.reduce((sum, c) => sum + getCategoryExpense(c.id), 0);

  return (
    <div className="hide-scrollbar overflow-y-auto px-5 pt-6 pb-4">
      {/* Header */}
      <section className="mb-5">
        <h1 className="text-xl font-bold text-neutral-900">지출 관리</h1>
        <div className="mt-3 flex gap-4">
          <div>
            <p className="text-xs text-neutral-500">총 예산</p>
            <p className="text-lg font-bold">{formatCurrency(totalBudget)}원</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">총 지출</p>
            <p className="text-lg font-bold text-primary-500">
              {formatCurrency(totalExpense)}원
            </p>
          </div>
        </div>
      </section>

      {/* Category List */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-700">카테고리</h3>
        </div>
        <div className="space-y-2.5">
          {displayCategories.map((cat) => {
            const expense = getCategoryExpense(cat.id);
            const count = getCategoryCount(cat.id);
            const pct =
              cat.budget_amount > 0
                ? Math.round((expense / cat.budget_amount) * 100)
                : 0;

            const content = (
              <Card key={cat.id} padding="sm" className="cursor-pointer active:bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-sm font-medium">{cat.name}</span>
                      {count > 0 && (
                        <span className="rounded-full bg-primary-50 px-1.5 py-0.5 text-xs text-primary-600">
                          {count}건
                        </span>
                      )}
                    </div>
                    <ProgressBar
                      current={expense}
                      total={cat.budget_amount}
                      size="sm"
                    />
                    <div className="mt-1 flex justify-between text-xs text-neutral-400">
                      <span>
                        {formatCurrency(expense)} / {formatCurrency(cat.budget_amount)}원
                      </span>
                      <span>{pct}%</span>
                    </div>
                  </div>
                  <svg
                    className="ml-3 h-5 w-5 text-neutral-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Card>
            );

            return isTrial ? (
              <div key={cat.id}>{content}</div>
            ) : (
              <Link key={cat.id} href={`/manage/${cat.id}`}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      {/* FAB */}
      {!isTrial && <FAB onClick={() => setShowForm(true)} />}

      {/* Add expense bottom sheet */}
      {!isTrial && (
        <BottomSheet
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title="지출 추가"
        >
          <ExpenseForm
            categories={displayCategories}
            onSubmit={(data) => {
              if (!profile) return;
              createMutation.mutate(
                {
                  ...data,
                  couple_id: coupleId,
                  created_by: profile.id,
                },
                {
                  onSuccess: () => setShowForm(false),
                },
              );
            }}
            onCancel={() => setShowForm(false)}
            isPending={createMutation.isPending}
          />
        </BottomSheet>
      )}
    </div>
  );
}
