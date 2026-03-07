"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/shared/ui";
import { ProgressBar } from "@/shared/ui/progress-bar";
import { formatCurrency, formatDday, formatDate, calculateDday } from "@/shared/lib/format";
import { useIsAuthenticated } from "@/features/auth";
import { useCategories, useExpenses } from "@/features/expense";
import { useSchedules } from "@/features/schedule";
import { GuideChecklist, WeddingPrepGuide } from "@/features/onboarding";

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
  const partner = profile?.partner ?? null;
  const coupleId = profile?.couple_id ?? "";

  const { data: categories = [] } = useCategories(coupleId);
  const { data: expenses = [] } = useExpenses(coupleId);
  const { data: schedules = [] } = useSchedules(coupleId);

  const [showAllCategories, setShowAllCategories] = useState(false);

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

  // Sort: over-budget first, then by expense ratio descending
  const sortedCategories = [...categoryData].sort((a, b) => {
    const aOver = a.budget > 0 && a.expense > a.budget ? 1 : 0;
    const bOver = b.budget > 0 && b.expense > b.budget ? 1 : 0;
    if (aOver !== bOver) return bOver - aOver;
    const aRatio = a.budget > 0 ? a.expense / a.budget : 0;
    const bRatio = b.budget > 0 ? b.expense / b.budget : 0;
    return bRatio - aRatio;
  });

  const displayCategories = showAllCategories ? sortedCategories : sortedCategories.slice(0, 3);

  // Merge recent activity: pending first, then paid, max 3
  const pendingExpenses = isTrial
    ? TRIAL_PENDING_EXPENSES
    : expenses
        .filter((e) => !e.is_paid && e.amount > 0)
        .slice(0, 5)
        .map((e) => ({ title: e.title, amount: e.amount, date: e.date ?? "", isPending: true }));

  const paidExpenses = isTrial
    ? TRIAL_PAID_EXPENSES
    : expenses
        .filter((e) => e.is_paid)
        .slice(0, 5)
        .map((e) => ({ title: e.title, amount: e.amount, date: e.date ?? "" }));

  const recentActivity = [
    ...pendingExpenses.map((e) => ({ ...e, isPending: true })),
    ...paidExpenses.map((e) => ({ ...e, isPending: false })),
  ].slice(0, 3);

  return (
    <div className="hide-scrollbar overflow-y-auto px-5 pt-6 pb-4">
      {/* Trial mode banner */}
      {isTrial && (
        <div className="mb-4 rounded-xl bg-secondary-50 px-4 py-3 text-center text-sm text-secondary-700">
          <p>체험 모드로 보고 있어요. 로그인하면 실제 데이터를 관리할 수 있어요.</p>
          <Link href="/settings/about" className="mt-1 inline-block text-xs font-medium text-secondary-600 underline underline-offset-2">
            기능 소개 보기
          </Link>
        </div>
      )}

      {/* D-day Hero */}
      <section className="mb-6">
        {dday !== null ? (
          <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 px-5 py-5">
            <p className="text-sm font-medium text-primary-400">
              {profile?.nickname && partner?.nickname
                ? `${profile.nickname} & ${partner.nickname}의 결혼식까지`
                : profile?.nickname
                  ? `${profile.nickname}님의 결혼식까지`
                  : "우리의 결혼식까지"}
            </p>
            <p className="mt-1 text-4xl font-bold text-primary-600">{formatDday(dday)}</p>
            <div className="mt-3 flex flex-col gap-0.5">
              {couple?.wedding_date && (
                <p className="text-sm text-primary-500">{formatDate(couple.wedding_date)}</p>
              )}
              {couple?.wedding_hall && (
                <p className="text-sm font-medium text-primary-700">{couple.wedding_hall}</p>
              )}
            </div>
          </div>
        ) : (
          <span className="text-lg font-semibold text-neutral-700">
            결혼 준비를 시작해볼까요?
          </span>
        )}
      </section>

      {/* Guide Checklist - hide when all completed */}
      {isAuthenticated && (() => {
        const guideItems = [
          { label: "결혼 날짜 설정하기", completed: !!couple?.wedding_date, href: "/settings/wedding-info" },
          { label: "총 예산 설정하기", completed: totalBudget > 0, href: "/settings/budget" },
          { label: "카테고리 예산 배분하기", completed: categories.some((c) => c.budget_amount > 0), href: "/settings/budget" },
          { label: "첫 지출 기록하기", completed: expenses.length > 0, href: "/manage" },
          { label: "파트너 초대하기", completed: !!partner, href: "/settings/partner" },
          { label: "일정 등록하기", completed: schedules.length > 0, href: "/schedule" },
        ];
        if (guideItems.every((i) => i.completed)) return null;
        return (
          <section className="mb-4">
            <GuideChecklist items={guideItems} />
          </section>
        );
      })()}

      {/* Budget Overview */}
      <Link href={isAuthenticated ? "/settings/budget" : "/login"}>
        <Card className="mb-4 cursor-pointer transition-colors active:bg-neutral-50">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">
              예산 대비 지출
            </h2>
            <span className={`text-2xl font-bold ${remaining < 0 ? "text-primary-600" : "text-primary-500"}`}>
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
                  <span className="font-semibold text-neutral-600">
                    {formatCurrency(remaining)}원
                  </span>
                </>
              ) : (
                <>
                  <span className="text-neutral-500">초과 </span>
                  <span className="font-semibold text-primary-600">
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
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-700">
            카테고리별 현황
          </h3>
          <Link href="/manage" className="text-xs text-neutral-400">
            전체보기
          </Link>
        </div>
        <div className="flex flex-col gap-2.5">
          {displayCategories.map((cat) => {
            const pct = cat.budget > 0 ? Math.round((cat.expense / cat.budget) * 100) : 0;
            const inner = (
              <Card
                key={cat.id}
                padding="sm"
                className="flex cursor-pointer items-center gap-3 transition-colors active:bg-neutral-50"
              >
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <span className="text-xs text-neutral-400">
                      <span className="text-neutral-500">지출</span> {formatCurrency(cat.expense)}
                      <span className="mx-0.5 text-neutral-300">/</span>
                      <span className="text-neutral-500">예산</span> {formatCurrency(cat.budget)}원
                      {pct > 0 && (
                        <span className={`ml-1 font-medium ${pct > 100 ? "text-primary-500" : "text-neutral-500"}`}>
                          {pct}%
                        </span>
                      )}
                    </span>
                  </div>
                  <ProgressBar
                    current={cat.expense}
                    total={cat.budget}
                    size="sm"
                    color="bg-primary-400"
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
        {sortedCategories.length > 3 && (
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="mt-2 w-full text-center text-xs text-neutral-400"
          >
            {showAllCategories ? "접기" : `${sortedCategories.length - 3}개 더보기`}
          </button>
        )}
      </section>

      {/* Recent Activity */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-700">최근 활동</h3>
          <Link href="/manage" className="text-xs text-neutral-400">
            전체보기
          </Link>
        </div>
        <Card>
          {recentActivity.length === 0 ? (
            <p className="py-4 text-center text-sm text-neutral-400">
              아직 등록된 내역이 없어요
            </p>
          ) : (
            <div className="divide-y divide-neutral-50">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-neutral-400">{item.date}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold">
                      {formatCurrency(item.amount)}원
                    </span>
                    {item.isPending && (
                      <span className="mt-0.5 inline-block rounded bg-amber-50 px-1.5 py-0.5 text-xs text-amber-600">
                        결제대기
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>

      {/* Wedding Prep Guide */}
      {isAuthenticated && (
        <section className="mt-6 mb-4">
          <WeddingPrepGuide
            categoryExpenseMap={categories.reduce<Record<string, number>>((acc, cat) => {
              acc[cat.name] = expenseByCategory[cat.id] ?? 0;
              return acc;
            }, {})}
            dday={dday}
          />
        </section>
      )}

      {/* About link */}
      <Link
        href="/settings/about"
        className="mt-4 block text-center text-xs text-neutral-400 underline underline-offset-2"
      >
        Wepl 기능 소개
      </Link>
    </div>
  );
}
