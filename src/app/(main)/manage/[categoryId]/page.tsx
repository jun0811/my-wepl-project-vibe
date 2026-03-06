"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, BottomSheet, TopBar } from "@/shared/ui";
import { FAB } from "@/shared/ui/fab";
import { ProgressBar } from "@/shared/ui/progress-bar";
import { formatCurrency } from "@/shared/lib/format";
import { useExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense, useCategories } from "@/features/expense";
import { ExpenseForm } from "@/features/expense/components/expense-form";
import { useIsAuthenticated } from "@/features/auth";
import type { Expense } from "@/shared/types";
import { exportExpensesToExcel } from "@/features/expense/lib/export-excel";

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
  const updateMutation = useUpdateExpense(coupleId);
  const deleteMutation = useDeleteExpense(coupleId);

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

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
      <TopBar
        title={category.name}
        onBack={() => router.back()}
        rightAction={
          <button
            onClick={() => {
              exportExpensesToExcel({
                expenses,
                categories: categories.filter((c) => c.id === categoryId),
              });
            }}
            className="text-xs font-medium text-primary-500"
          >
            엑셀
          </button>
        }
      />

      {/* Budget overview */}
      <Card className="mb-5">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-neutral-500">예산</span>
          <span className="font-semibold">{formatCurrency(category.budget_amount)}원</span>
        </div>
        <ProgressBar current={totalExpense} total={category.budget_amount} size="md" showOverAmount />
        <div className="mt-2 flex justify-between text-xs text-neutral-400">
          <span>지출 {formatCurrency(totalExpense)}원</span>
          <span className={totalExpense > category.budget_amount ? "text-error font-medium" : ""}>
            {category.budget_amount > 0
              ? `${Math.round((totalExpense / category.budget_amount) * 100)}%`
              : totalExpense > 0 ? "예산 미설정" : "-"}
          </span>
        </div>
      </Card>

      {/* Status summary */}
      {expenses.length > 0 && (
        <div className="mb-4 flex gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5">
            <span className="text-xs font-medium text-green-600">
              결제완료 {expenses.filter((e) => e.is_paid).length}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5">
            <span className="text-xs font-medium text-amber-600">
              결제대기 {expenses.filter((e) => !e.is_paid && e.amount > 0).length}
            </span>
          </div>
        </div>
      )}

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
              <Card
                key={expense.id}
                padding="sm"
                className="cursor-pointer transition-colors active:bg-neutral-50"
                onClick={() => setEditingExpense(expense)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      {expense.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {expense.date && (
                        <span className="text-xs text-neutral-400">{expense.date}</span>
                      )}
                      {(() => {
                        if (expense.is_paid)
                          return <span className="rounded bg-green-50 px-1.5 py-0.5 text-xs text-green-600">결제완료</span>;
                        if (expense.amount > 0)
                          return <span className="rounded bg-amber-50 px-1.5 py-0.5 text-xs text-amber-600">결제대기</span>;
                        return <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">미등록</span>;
                      })()}
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
                  <div className="ml-3 flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {formatCurrency(expense.amount)}원
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("삭제하시겠습니까?")) {
                          deleteMutation.mutate(expense.id);
                        }
                      }}
                      className="text-xs text-neutral-400 hover:text-error"
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

      {/* Edit expense bottom sheet */}
      <BottomSheet
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="지출 수정"
      >
        {editingExpense && (
          <ExpenseForm
            key={editingExpense.id}
            categories={categories}
            onSubmit={(data) => {
              updateMutation.mutate(
                {
                  id: editingExpense.id,
                  updates: {
                    category_id: data.category_id,
                    title: data.title,
                    amount: data.amount,
                    memo: data.memo,
                    date: data.date,
                    vendor_name: data.vendor_name,
                    is_paid: data.is_paid,
                    price_feeling: data.price_feeling,
                    tags: data.tags,
                  },
                },
                {
                  onSuccess: () => setEditingExpense(null),
                },
              );
            }}
            onCancel={() => setEditingExpense(null)}
            isPending={updateMutation.isPending}
            defaultValues={{
              categoryId: editingExpense.category_id,
              title: editingExpense.title,
              amount: String(editingExpense.amount),
              memo: editingExpense.memo ?? "",
              date: editingExpense.date ?? "",
              vendorName: editingExpense.vendor_name ?? "",
              isPaid: editingExpense.is_paid,
              priceFeeling: editingExpense.price_feeling ?? "",
              tags: editingExpense.tags ?? [],
            }}
          />
        )}
      </BottomSheet>
    </div>
  );
}
