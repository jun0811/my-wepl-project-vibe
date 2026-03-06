"use client";

import { useState } from "react";
import { Card, Chip } from "@/shared/ui";
import { formatCurrency } from "@/shared/lib/format";
import { REGIONS, type Region } from "@/shared/types";
import { useCategoryAverages } from "@/features/explore";
import { CostBarChart } from "@/features/explore/components/cost-bar-chart";
import { PriceRangeCard } from "@/features/explore/components/price-range-card";

export default function ExplorePage() {
  const [selectedRegion, setSelectedRegion] = useState<Region | undefined>(undefined);
  const { data: stats = [], isLoading } = useCategoryAverages(selectedRegion);

  const totalAverage = stats.length > 0
    ? stats.reduce((sum, s) => sum + s.avg_amount, 0)
    : 0;
  const totalDataCount = stats.reduce((sum, s) => sum + s.data_count, 0);

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
        <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
          <Chip
            label="전체"
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
      ) : stats.length === 0 ? (
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
                {formatCurrency(totalAverage)}원
              </p>
            </div>
          </Card>

          {/* Bar Chart */}
          <section className="mb-5">
            <h3 className="mb-3 text-sm font-semibold text-neutral-700">
              카테고리별 비교
            </h3>
            <Card>
              <CostBarChart data={stats} />
            </Card>
          </section>

          {/* Category Detail Cards */}
          <section className="mb-5">
            <h3 className="mb-3 text-sm font-semibold text-neutral-700">
              카테고리별 가격 분포
            </h3>
            <div className="space-y-2.5">
              {stats.map((stat) => (
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
        </>
      )}
    </div>
  );
}
