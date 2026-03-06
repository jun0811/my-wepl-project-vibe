"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, BottomSheet } from "@/shared/ui";
import { FAB } from "@/shared/ui/fab";
import { ProgressBar } from "@/shared/ui/progress-bar";
import { formatCurrency } from "@/shared/lib/format";
import { useExpenses, useCreateExpense, useDeleteExpense, useCategories } from "@/features/expense";
import { ExpenseForm } from "@/features/expense/components/expense-form";
import { useIsAuthenticated } from "@/features/auth";

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = use(params);
  const router = useRouter();
  const { profile } = useIsAuthenticated();
  const coupleId = profile?.couple_id ?? "";

  const { data: categories = [] } = useCategories(coupleId);
  const { data: expenses = [] } = useExpenses(coupleId, categoryId);
  const createMutation = useCreateExpense(coupleId);
  const deleteMutation = useDeleteExpense(coupleId);

  const [showForm, setShowForm] = useState(false);

  const category = categories.find((c) => c.id === categoryId);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (!category) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-neutral-400">카테고리를 찾을 수 없어요</p>
      </div>
    );
  }

  return (
    <div className="hide-scrollbar overflow-y-auto px-5 pt-6 pb-4">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100"
          aria-label="뒤로가기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-neutral-900">{category.name}</h1>
      </div>

      {/* Budget overview */}
      <Card className="mb-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-neutral-500">예산</span>
          <span className="font-semibold">{formatCurrency(category.budget_amount)}원</span>
        </div>
        <ProgressBar current={totalExpense} total={category.budget_amount} size="md" />
        <div className="mt-2 flex justify-between text-xs text-neutral-400">
          <span>지출 {formatCurrency(totalExpense)}원</span>
          <span>
            {category.budget_amount > 0
              ? `${Math.round((totalExpense / category.budget_amount) * 100)}%`
              : "-"}
          </span>
        </div>
      </Card>

      {/* Expense list */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-neutral-700">
          지출 내역 ({expenses.length}건)
        </h3>
        {expenses.length === 0 ? (
          <Card>
            <p className="py-8 text-center text-sm text-neutral-400">
              아직 지출 내역이 없어요
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {expenses.map((expense) => (
              <Card key={expense.id} padding="sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      {expense.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {expense.date && (
                        <span className="text-xs text-neutral-400">{expense.date}</span>
                      )}
                      {expense.is_paid && (
                        <span className="rounded bg-green-50 px-1.5 py-0.5 text-xs text-green-600">
                          결제완료
                        </span>
                      )}
                      {expense.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-3 text-right">
                    <span className="text-sm font-semibold">
                      {formatCurrency(expense.amount)}원
                    </span>
                    <button
                      onClick={() => {
                        if (confirm("삭제하시겠습니까?")) {
                          deleteMutation.mutate(expense.id);
                        }
                      }}
                      className="mt-1 block text-xs text-neutral-400 hover:text-error"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* FAB */}
      {coupleId && <FAB onClick={() => setShowForm(true)} />}

      {/* Add expense bottom sheet */}
      <BottomSheet
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="지출 추가"
      >
        <ExpenseForm
          categories={categories}
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
          defaultValues={{ categoryId }}
        />
      </BottomSheet>
    </div>
  );
}
