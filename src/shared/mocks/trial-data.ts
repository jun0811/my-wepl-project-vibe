import type { Category } from "@/shared/types";

export const TRIAL_WEDDING_DATE = "2026-10-10";
export const TRIAL_TOTAL_BUDGET = 32_000_000;
export const TRIAL_TOTAL_EXPENSE = 12_500_000;

export const TRIAL_CATEGORIES: Category[] = [
  { id: "1", name: "웨딩홀", budget_amount: 12_000_000, icon: "building", sort_order: 0, is_default: true, couple_id: "", created_at: "" },
  { id: "2", name: "스튜디오", budget_amount: 3_500_000, icon: "camera", sort_order: 1, is_default: true, couple_id: "", created_at: "" },
  { id: "3", name: "드레스/턱시도", budget_amount: 3_000_000, icon: "shirt", sort_order: 2, is_default: true, couple_id: "", created_at: "" },
  { id: "4", name: "예물/예단", budget_amount: 5_000_000, icon: "gem", sort_order: 3, is_default: true, couple_id: "", created_at: "" },
  { id: "5", name: "혼수", budget_amount: 6_000_000, icon: "sofa", sort_order: 4, is_default: true, couple_id: "", created_at: "" },
  { id: "6", name: "신혼여행", budget_amount: 2_000_000, icon: "plane", sort_order: 5, is_default: true, couple_id: "", created_at: "" },
  { id: "7", name: "기타", budget_amount: 500_000, icon: "plus", sort_order: 6, is_default: true, couple_id: "", created_at: "" },
];

export const TRIAL_EXPENSE_MAP: Record<string, number> = {
  "1": 8_000_000,
  "2": 1_200_000,
  "3": 2_500_000,
  "4": 550_000,
  "5": 0,
  "6": 0,
  "7": 250_000,
};

export const TRIAL_COUNT_MAP: Record<string, number> = {
  "1": 3, "2": 2, "3": 4, "4": 1, "5": 0, "6": 0, "7": 2,
};

export const TRIAL_CATEGORY_SUMMARY = TRIAL_CATEGORIES.map((c) => ({
  ...c,
  name: c.name,
  budget: c.budget_amount,
  expense: TRIAL_EXPENSE_MAP[c.id] ?? 0,
}));

export const TRIAL_RECENT_EXPENSES = [
  { title: "드레스 피팅 2차", amount: 150_000, date: "3.4 (화)" },
  { title: "웨딩홀 식대 계약금", amount: 3_000_000, date: "3.1 (토)" },
];
