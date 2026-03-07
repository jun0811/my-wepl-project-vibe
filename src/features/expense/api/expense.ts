import { createClient } from "@/shared/lib/supabase";
import type { Expense, InsertExpense, UpdateExpense, Category } from "@/shared/types";

export async function getCategories(coupleId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select()
    .eq("couple_id", coupleId)
    .order("sort_order");

  if (error) throw error;
  return data as Category[];
}

export async function getExpenses(coupleId: string, categoryId?: string) {
  const supabase = createClient();
  let query = supabase
    .from("expenses")
    .select()
    .eq("couple_id", coupleId)
    .order("created_at", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Expense[];
}

export async function createExpense(expense: InsertExpense) {
  const supabase = createClient();

  // Enforce created_by from authenticated session, not client input
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("expenses")
    .insert({ ...expense, created_by: user.id })
    .select()
    .single<Expense>();

  if (error) throw error;
  return data;
}

export async function updateExpense(id: string, updates: UpdateExpense) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("expenses")
    .update(updates)
    .eq("id", id)
    .select()
    .single<Expense>();

  if (error) throw error;
  return data;
}

export async function deleteExpense(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function updateCategoryBudget(id: string, budgetAmount: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .update({ budget_amount: budgetAmount })
    .eq("id", id);

  if (error) throw error;
}
