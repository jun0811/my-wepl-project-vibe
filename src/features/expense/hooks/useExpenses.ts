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
      queryClient.invalidateQueries({
        queryKey: ["expenses", coupleId],
      });
      queryClient.invalidateQueries({
        queryKey: EXPENSE_KEYS.categories(coupleId),
      });
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
        queryKey: ["expenses", coupleId],
      });
      queryClient.invalidateQueries({
        queryKey: EXPENSE_KEYS.categories(coupleId),
      });
    },
  });
}

export function useDeleteExpense(coupleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses", coupleId],
      });
      queryClient.invalidateQueries({
        queryKey: EXPENSE_KEYS.categories(coupleId),
      });
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
  });
}
