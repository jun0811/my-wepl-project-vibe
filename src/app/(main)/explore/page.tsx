"use client";

import { useState } from "react";
import { Card, Chip } from "@/shared/ui";
import { formatCurrency } from "@/shared/lib/format";
import { REGIONS, type Region } from "@/shared/types";
import { useIsAuthenticated } from "@/features/auth";
import { useCategories, useExpenses } from "@/features/expense";
import { useCategoryAverages, type CategoryAverage } from "@/features/explore";
import { CostBarChart } from "@/features/explore/components/cost-bar-chart";
import { PriceRangeCard } from "@/features/explore/components/price-range-card";
import { BudgetComparison } from "@/features/explore/components/budget-comparison";

export default function ExplorePage() {
  const { isAuthenticated, profile } = useIsAuthenticated();
  const coupleId = profile?.couple_id ?? "";
  const { data: userCategories = [] } = useCategories(coupleId);
  const { data: expenses = [] } = useExpenses(coupleId);

  const [selectedRegion, setSelectedRegion] = useState<Region | undefined>(undefined);
  const { data: stats = [], isLoading } = useCategoryAverages(selectedRegion);

  // Map stat category names to user category names
  const STAT_TO_USER: Record<string, string[]> = {
    "웨딩홀": ["웨딩홀"],
    "스드메": ["스튜디오", "드레스/정장"],
    "예물": ["예물/예단"],
    "예단": ["예물/예단"],
    "허니문": ["신혼여행"],
    "혼수": ["혼수"],
    "기타": ["기타"],
  };

  // Build my expense totals by category name
  const categoryMap = new Map(userCategories.map((c) => [c.id, c.name]));
  const myExpensesByUserCat = expenses.reduce<Record<string, number>>((acc, e) => {
    const name = categoryMap.get(e.category_id);
    if (name) acc[name] = (acc[name] ?? 0) + e.amount;
    return acc;
  }, {});

  // Map to stat category names
  const myExpensesByCategory: Record<string, number> = {};
  for (const [statName, userNames] of Object.entries(STAT_TO_USER)) {
    const total = userNames.reduce((sum, n) => sum + (myExpensesByUserCat[n] ?? 0), 0);
    if (total > 0) myExpensesByCategory[statName] = total;
  }
  // Also include exact matches for any custom categories
  for (const [name, amount] of Object.entries(myExpensesByUserCat)) {
    if (!myExpensesByCategory[name] && !Object.values(STAT_TO_USER).flat().includes(name)) {
      myExpensesByCategory[name] = amount;
    }
  }

  // When no region filter, stats has rows per region×category — deduplicate by category
  // using weighted average (weighted by data_count) to get a single row per category
  const aggregatedStats = Object.values(
    stats.reduce<Record<string, { totalAmount: number; totalMedian: number; totalCount: number; min: number; max: number; totalP25: number; totalP75: number; name: string }>>((acc, s) => {
      if (!acc[s.category_name]) {
        acc[s.category_name] = { name: s.category_name, totalAmount: 0, totalMedian: 0, totalCount: 0, min: s.min_amount, max: s.max_amount, totalP25: 0, totalP75: 0 };
      }
      const entry = acc[s.category_name];
      entry.totalAmount += s.avg_amount * s.data_count;
      entry.totalMedian += s.median_amount * s.data_count;
      entry.totalP25 += s.p25_amount * s.data_count;
      entry.totalP75 += s.p75_amount * s.data_count;
      entry.totalCount += s.data_count;
      entry.min = Math.min(entry.min, s.min_amount);
      entry.max = Math.max(entry.max, s.max_amount);
      return acc;
    }, {}),
  ).map((entry): CategoryAverage => ({
    region: null,
    category_name: entry.name,
    data_count: entry.totalCount,
    avg_amount: entry.totalCount > 0 ? entry.totalAmount / entry.totalCount : 0,
    median_amount: entry.totalCount > 0 ? entry.totalMedian / entry.totalCount : 0,
    min_amount: entry.min,
    max_amount: entry.max,
    p25_amount: entry.totalCount > 0 ? entry.totalP25 / entry.totalCount : 0,
    p75_amount: entry.totalCount > 0 ? entry.totalP75 / entry.totalCount : 0,
  }));

  // Use aggregated (deduplicated) stats for rendering
  const displayStats = selectedRegion ? stats : aggregatedStats;

  const totalAverage = displayStats.reduce((sum, s) => sum + s.avg_amount, 0);
  const totalDataCount = displayStats.reduce((sum, s) => sum + s.data_count, 0);

  return (
    <div className="hide-scrollbar overflow-y-auto px-5 pt-6 pb-4">
      {/* Header */}
      <section className="mb-5">
        <h1 className="text-xl font-bold text-neutral-900">
          결혼 비용, 얼마나 들까?
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {totalDataCount > 0
            ? `${totalDataCount}건의 실제 데이터 기준`
            : "데이터를 불러오는 중..."}
        </p>
      </section>

      {/* Region filter */}
      <section className="mb-5">
        <div className="flex flex-wrap gap-2">
          <Chip
            label="전국"
            selected={!selectedRegion}
            onClick={() => setSelectedRegion(undefined)}
            size="sm"
          />
          {REGIONS.map((region) => (
            <Chip
              key={region}
              label={region}
              selected={selectedRegion === region}
              onClick={() => setSelectedRegion(region)}
              size="sm"
            />
          ))}
        </div>
      </section>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <p className="text-sm text-neutral-400">통계를 불러오는 중...</p>
        </div>
      ) : displayStats.length === 0 ? (
        <Card className="py-8 text-center">
          <p className="text-sm text-neutral-400">
            {selectedRegion
              ? `${selectedRegion} 지역의 데이터가 아직 부족해요`
              : "데이터가 아직 없어요"}
          </p>
          <p className="mt-1 text-xs text-neutral-300">
            10건 이상의 데이터가 모이면 통계가 공개돼요
          </p>
        </Card>
      ) : (
        <>
          {/* Total Average */}
          <Card className="mb-5 border-primary-100 bg-primary-50">
            <div className="text-center">
              <p className="text-sm text-primary-600">
                {selectedRegion ? `${selectedRegion} ` : ""}평균 결혼 비용
              </p>
              <p className="mt-1 text-3xl font-bold text-primary-700">
                {formatCurrency(Math.round(totalAverage))}원
              </p>
            </div>
          </Card>

          {/* Bar Chart */}
          <section className="mb-5">
            <h3 className="mb-3 text-sm font-semibold text-neutral-700">
              카테고리별 비교
            </h3>
            <Card>
              <CostBarChart data={displayStats} myExpenses={isAuthenticated ? myExpensesByCategory : undefined} />
            </Card>
          </section>

          {/* Category Detail Cards */}
          <section className="mb-5">
            <h3 className="mb-3 text-sm font-semibold text-neutral-700">
              카테고리별 가격 분포
            </h3>
            <div className="space-y-2.5">
              {displayStats.map((stat) => (
                <PriceRangeCard key={stat.category_name} stat={stat} />
              ))}
            </div>
          </section>

          {/* CTA */}
          <Card className="border-secondary-100 bg-secondary-50 text-center">
            <p className="text-sm font-medium text-secondary-700">
              내 결혼 비용은 평균 대비 어디쯤?
            </p>
            <p className="mt-1 text-xs text-secondary-500">
              지출을 기록하면 다른 커플과 비교할 수 있어요
            </p>
          </Card>

          {/* Budget vs Average Comparison */}
          {isAuthenticated && userCategories.length > 0 && displayStats.length > 0 && (
            <section className="mt-5">
              <h3 className="mb-3 text-sm font-semibold text-neutral-700">
                내 예산 vs 평균
              </h3>
              <Card>
                <BudgetComparison
                  categories={userCategories.map((c) => ({ name: c.name, budget: c.budget_amount }))}
                  averages={displayStats}
                />
              </Card>
            </section>
          )}
        </>
      )}
    </div>
  );
}
