"use client";

import Link from "next/link";
import { Card } from "@/shared/ui";
import { ProgressBar } from "@/shared/ui/progress-bar";
import { formatCurrency, formatDday, calculateDday } from "@/shared/lib/format";
import { useIsAuthenticated } from "@/features/auth";
import { useCategories, useExpenses } from "@/features/expense";
import { MonthlyChart } from "@/features/expense/components/monthly-chart";
import { useSchedules } from "@/features/schedule";
import { GuideChecklist } from "@/features/onboarding";

import {
  TRIAL_WEDDING_DATE,
  TRIAL_TOTAL_BUDGET,
  TRIAL_TOTAL_EXPENSE,
  TRIAL_CATEGORY_SUMMARY,
  TRIAL_PAID_EXPENSES,
  TRIAL_PENDING_EXPENSES,
} from "@/shared/mocks/trial-data";

export default function HomePage() {
  const { isAuthenticated, isLoading, profile } = useIsAuthenticated();
  const couple = profile?.couples ?? null;
  const coupleId = profile?.couple_id ?? "";

  const { data: categories = [] } = useCategories(coupleId);
  const { data: expenses = [] } = useExpenses(coupleId);
  const { data: schedules = [] } = useSchedules(coupleId);

  const isTrial = !isLoading && !isAuthenticated;

  if (isLoading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-400" />
      </div>
    );
  }

  // Calculate real data or use mock
  const dday = isTrial
    ? calculateDday(TRIAL_WEDDING_DATE)
    : couple?.wedding_date
      ? calculateDday(couple.wedding_date)
      : null;

  const totalBudget = isTrial
    ? TRIAL_TOTAL_BUDGET
    : (couple?.total_budget ?? 0);

  const expenseByCategory = expenses.reduce<Record<string, number>>((acc, exp) => {
    acc[exp.category_id] = (acc[exp.category_id] ?? 0) + exp.amount;
    return acc;
  }, {});

  const totalExpense = isTrial
    ? TRIAL_TOTAL_EXPENSE
    : expenses.reduce((sum, e) => sum + e.amount, 0);

  const percentage = totalBudget > 0 ? Math.round((totalExpense / totalBudget) * 100) : 0;
  const remaining = totalBudget - totalExpense;

  const categoryData = isTrial
    ? TRIAL_CATEGORY_SUMMARY
    : categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        budget: cat.budget_amount,
        expense: expenseByCategory[cat.id] ?? 0,
      }));

  const paidExpenses = isTrial
    ? TRIAL_PAID_EXPENSES
    : expenses
        .filter((e) => e.is_paid)
        .slice(0, 5)
        .map((e) => ({ title: e.title, amount: e.amount, date: e.date ?? "" }));

  const pendingExpenses = isTrial
    ? TRIAL_PENDING_EXPENSES
    : expenses
        .filter((e) => !e.is_paid && e.amount > 0)
        .slice(0, 5)
        .map((e) => ({ title: e.title, amount: e.amount, date: e.date ?? "" }));

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

      {/* Guide Checklist */}
      {isAuthenticated && (
        <section className="mb-4">
          <GuideChecklist
            items={[
              { label: "총 예산 설정하기", completed: totalBudget > 0, href: "/settings/budget" },
              { label: "카테고리 예산 배분하기", completed: categories.some((c) => c.budget_amount > 0), href: "/settings/budget" },
              { label: "첫 지출 기록하기", completed: expenses.length > 0, href: "/manage" },
              { label: "파트너 초대하기", completed: false, href: "/settings/partner" },
              { label: "일정 등록하기", completed: schedules.length > 0, href: "/schedule" },
            ]}
          />
        </section>
      )}

      {/* Budget Overview */}
      <Link href={isAuthenticated ? "/settings/budget" : "/login"}>
        <Card className="mb-4 cursor-pointer transition-colors active:bg-neutral-50">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">
              예산 대비 지출
            </h2>
            <span className={`text-2xl font-bold ${remaining < 0 ? "text-error" : "text-primary-500"}`}>
              {percentage}%
            </span>
          </div>
          <ProgressBar current={totalExpense} total={totalBudget} size="lg" showOverAmount />
          <div className="mt-3 flex justify-between text-sm">
            <div>
              <span className="text-neutral-500">지출 </span>
              <span className="font-semibold">{formatCurrency(totalExpense)}원</span>
            </div>
            <div>
              {remaining >= 0 ? (
                <>
                  <span className="text-neutral-500">남은 예산 </span>
                  <span className="font-semibold text-secondary-600">
                    {formatCurrency(remaining)}원
                  </span>
                </>
              ) : (
                <>
                  <span className="text-neutral-500">초과 </span>
                  <span className="font-semibold text-error">
                    {formatCurrency(Math.abs(remaining))}원
                  </span>
                </>
              )}
            </div>
          </div>
        </Card>
      </Link>

      {/* Category Progress */}
      <section className="mb-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-700">
          카테고리별 현황
        </h3>
        <div className="flex flex-col gap-2.5">
          {categoryData.map((cat) => {
            const inner = (
              <Card key={cat.id} padding="sm" className="flex cursor-pointer items-center gap-3 transition-colors active:bg-neutral-50">
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
                <svg className="h-4 w-4 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Card>
            );
            return isAuthenticated ? (
              <Link key={cat.id} href={`/manage/${cat.id}`}>{inner}</Link>
            ) : (
              <div key={cat.id}>{inner}</div>
            );
          })}
        </div>
      </section>

      {/* Monthly Trend */}
      {!isTrial && expenses.length > 0 && (
        <section className="mb-4">
          <h3 className="mb-3 text-sm font-semibold text-neutral-700">월별 지출 추이</h3>
          <Card>
            <MonthlyChart expenses={expenses} />
          </Card>
        </section>
      )}

      {/* Pending Expenses */}
      <section className="mb-4">
        <h3 className="mb-3 text-sm font-semibold text-neutral-700">
          결제 대기
          {pendingExpenses.length > 0 && (
            <span className="ml-1.5 text-xs font-normal text-amber-500">
              {pendingExpenses.length}건
            </span>
          )}
        </h3>
        <Card>
          {pendingExpenses.length === 0 ? (
            <p className="py-4 text-center text-sm text-neutral-400">
              대기 중인 결제가 없어요
            </p>
          ) : (
            <div className="divide-y divide-neutral-50">
              {pendingExpenses.map((expense, i) => (
                <div key={i} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium">{expense.title}</p>
                    <p className="text-xs text-neutral-400">{expense.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold">
                      {formatCurrency(expense.amount)}원
                    </span>
                    <span className="mt-0.5 block rounded bg-amber-50 px-1.5 py-0.5 text-xs text-amber-600">
                      결제대기
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      {/* Recent Paid Expenses */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-neutral-700">최근 지출</h3>
        <Card>
          {paidExpenses.length === 0 ? (
            <p className="py-4 text-center text-sm text-neutral-400">
              아직 결제 완료된 내역이 없어요
            </p>
          ) : (
            <div className="divide-y divide-neutral-50">
              {paidExpenses.map((expense, i) => (
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
