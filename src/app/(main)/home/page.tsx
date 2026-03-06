"use client";

import { Card } from "@/shared/ui";
import { ProgressBar } from "@/shared/ui/progress-bar";
import { formatCurrency, formatDday, calculateDday } from "@/shared/lib/format";
import { useIsAuthenticated } from "@/features/auth";
import { useCategories, useExpenses } from "@/features/expense";

// Mock data for trial mode
const MOCK_DATA = {
  weddingDate: "2026-10-10",
  totalBudget: 32000000,
  totalExpense: 12500000,
  categories: [
    { name: "웨딩홀", budget: 12000000, expense: 8000000 },
    { name: "스튜디오", budget: 3500000, expense: 1200000 },
    { name: "드레스/턱시도", budget: 3000000, expense: 2500000 },
    { name: "예물/예단", budget: 5000000, expense: 550000 },
    { name: "혼수", budget: 6000000, expense: 0 },
    { name: "신혼여행", budget: 2000000, expense: 0 },
    { name: "기타", budget: 500000, expense: 250000 },
  ],
  recentExpenses: [
    { title: "드레스 피팅 2차", amount: 150000, date: "3.4 (화)" },
    { title: "웨딩홀 식대 계약금", amount: 3000000, date: "3.1 (토)" },
  ],
};

export default function HomePage() {
  const { isAuthenticated, profile } = useIsAuthenticated();
  const couple = profile?.couples ?? null;
  const coupleId = profile?.couple_id ?? "";

  const { data: categories = [] } = useCategories(coupleId);
  const { data: expenses = [] } = useExpenses(coupleId);

  const isTrial = !isAuthenticated || !coupleId;

  // Calculate real data or use mock
  const dday = isTrial
    ? calculateDday(MOCK_DATA.weddingDate)
    : couple?.wedding_date
      ? calculateDday(couple.wedding_date)
      : null;

  const totalBudget = isTrial
    ? MOCK_DATA.totalBudget
    : (couple?.total_budget ?? 0);

  const expenseByCategory = expenses.reduce<Record<string, number>>((acc, exp) => {
    acc[exp.category_id] = (acc[exp.category_id] ?? 0) + exp.amount;
    return acc;
  }, {});

  const totalExpense = isTrial
    ? MOCK_DATA.totalExpense
    : expenses.reduce((sum, e) => sum + e.amount, 0);

  const percentage = totalBudget > 0 ? Math.round((totalExpense / totalBudget) * 100) : 0;
  const remaining = totalBudget - totalExpense;

  const categoryData = isTrial
    ? MOCK_DATA.categories
    : categories.map((cat) => ({
        name: cat.name,
        budget: cat.budget_amount,
        expense: expenseByCategory[cat.id] ?? 0,
      }));

  const recentExpenses = isTrial
    ? MOCK_DATA.recentExpenses
    : expenses.slice(0, 5).map((e) => ({
        title: e.title,
        amount: e.amount,
        date: e.date ?? "",
      }));

  return (
    <div className="hide-scrollbar overflow-y-auto px-5 pt-6 pb-4">
      {/* Trial mode banner */}
      {isTrial && (
        <div className="mb-4 rounded-xl bg-secondary-50 px-4 py-3 text-center text-sm text-secondary-700">
          체험 모드로 보고 있어요. 로그인하면 실제 데이터를 관리할 수 있어요.
        </div>
      )}

      {/* D-day Header */}
      <section className="mb-6">
        <div className="flex items-baseline gap-3">
          {dday !== null ? (
            <>
              <span className="text-3xl font-bold text-primary-500">
                {formatDday(dday)}
              </span>
              <span className="text-sm text-neutral-500">우리의 결혼식까지</span>
            </>
          ) : (
            <span className="text-lg font-semibold text-neutral-700">
              결혼 준비를 시작해볼까요?
            </span>
          )}
        </div>
      </section>

      {/* Budget Overview */}
      <Card className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-900">
            예산 대비 지출
          </h2>
          <span className="text-2xl font-bold text-primary-500">{percentage}%</span>
        </div>
        <ProgressBar current={totalExpense} total={totalBudget} size="lg" />
        <div className="mt-3 flex justify-between text-sm">
          <div>
            <span className="text-neutral-500">지출 </span>
            <span className="font-semibold">{formatCurrency(totalExpense)}원</span>
          </div>
          <div>
            <span className="text-neutral-500">남은 예산 </span>
            <span className="font-semibold text-secondary-600">
              {formatCurrency(remaining)}원
            </span>
          </div>
        </div>
      </Card>

      {/* Category Progress */}
      <section className="mb-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-700">
          카테고리별 현황
        </h3>
        <div className="space-y-2.5">
          {categoryData.map((cat) => (
            <Card key={cat.name} padding="sm" className="flex items-center gap-3">
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{cat.name}</span>
                  <span className="text-xs text-neutral-500">
                    {formatCurrency(cat.expense)} / {formatCurrency(cat.budget)}원
                  </span>
                </div>
                <ProgressBar
                  current={cat.expense}
                  total={cat.budget}
                  size="sm"
                  color={cat.expense > cat.budget ? "bg-error" : "bg-primary-400"}
                />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Expenses */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-neutral-700">최근 지출</h3>
        <Card>
          {recentExpenses.length === 0 ? (
            <p className="py-4 text-center text-sm text-neutral-400">
              아직 지출 내역이 없어요
            </p>
          ) : (
            <div className="divide-y divide-neutral-50">
              {recentExpenses.map((expense, i) => (
                <div key={i} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium">{expense.title}</p>
                    <p className="text-xs text-neutral-400">{expense.date}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(expense.amount)}원
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
