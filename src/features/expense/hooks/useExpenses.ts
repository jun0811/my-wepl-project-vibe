"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  updateCategoryBudget,
} from "../api/expense";
import type { InsertExpense, UpdateExpense } from "@/shared/types";
import { useUIStore } from "@/store/ui-store";

const EXPENSE_KEYS = {
  categories: (coupleId: string) => ["categories", coupleId] as const,
  expenses: (coupleId: string, categoryId?: string) =>
    categoryId
      ? (["expenses", coupleId, categoryId] as const)
      : (["expenses", coupleId] as const),
};

export function useCategories(coupleId: string | null) {
  return useQuery({
    queryKey: EXPENSE_KEYS.categories(coupleId ?? ""),
    queryFn: () => getCategories(coupleId!),
    enabled: !!coupleId,
  });
}

export function useExpenses(coupleId: string | null, categoryId?: string) {
  return useQuery({
    queryKey: EXPENSE_KEYS.expenses(coupleId ?? "", categoryId),
    queryFn: () => getExpenses(coupleId!, categoryId),
    enabled: !!coupleId,
  });
}

export function useCreateExpense(coupleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expense: InsertExpense) => createExpense(expense),
    onSuccess: () => {
      useUIStore.getState().showToast("지출이 추가되었어요", "success");
      queryClient.invalidateQueries({
        queryKey: EXPENSE_KEYS.expenses(coupleId),
      });
      queryClient.invalidateQueries({
        queryKey: EXPENSE_KEYS.categories(coupleId),
      });
    },
    onError: () => {
      useUIStore.getState().showToast("지출 추가에 실패했어요", "error");
    },
  });
}

export function useUpdateExpense(coupleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateExpense }) =>
      updateExpense(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EXPENSE_KEYS.expenses(coupleId),
      });
      queryClient.invalidateQueries({
        queryKey: EXPENSE_KEYS.categories(coupleId),
      });
    },
    onError: () => {
      useUIStore.getState().showToast("지출 수정에 실패했어요", "error");
    },
  });
}

export function useDeleteExpense(coupleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      useUIStore.getState().showToast("지출이 삭제되었어요", "success");
      queryClient.invalidateQueries({
        queryKey: EXPENSE_KEYS.expenses(coupleId),
      });
      queryClient.invalidateQueries({
        queryKey: EXPENSE_KEYS.categories(coupleId),
      });
    },
    onError: () => {
      useUIStore.getState().showToast("지출 삭제에 실패했어요", "error");
    },
  });
}

export function useUpdateCategoryBudget(coupleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, budgetAmount }: { id: string; budgetAmount: number }) =>
      updateCategoryBudget(id, budgetAmount),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: EXPENSE_KEYS.categories(coupleId),
      });
    },
    onError: () => {
      useUIStore.getState().showToast("예산 수정에 실패했어요", "error");
    },
  });
}
