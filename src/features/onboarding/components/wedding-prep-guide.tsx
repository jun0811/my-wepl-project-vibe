"use client";

import { useState } from "react";
import { Card } from "@/shared/ui";
import { formatCurrency } from "@/shared/lib/format";

interface PrepItemData {
  category: string;
  description: string;
  averageCost: string;
  timing: string;
  timingStart: number;
  timingEnd: number;
  tip: string;
}

interface PrepItem extends PrepItemData {
  completed: boolean;
  spentAmount: number;
  isCurrent: boolean;
}

interface WeddingPrepGuideProps {
  categoryExpenseMap: Record<string, number>;
  dday?: number | null;
}

const PREP_ITEMS: PrepItemData[] = [
  {
    category: "웨딩홀",
    description: "웨딩홀 투어 & 계약",
    averageCost: "평균 800만원",
    timing: "D-180~120",
    timingStart: 180,
    timingEnd: 120,
    tip: "주말 성수기는 1년 전 예약 필수. 식대/대관료 분리 확인",
  },
  {
    category: "스튜디오",
    description: "스튜디오 촬영",
    averageCost: "평균 150만원",
    timing: "D-120~90",
    timingStart: 120,
    timingEnd: 90,
    tip: "보정 컷수/원판 포함 여부 꼭 확인",
  },
  {
    category: "드레스/정장",
    description: "드레스 & 정장 피팅",
    averageCost: "평균 120만원",
    timing: "D-120~60",
    timingStart: 120,
    timingEnd: 60,
    tip: "피팅 2~3회 필요. 속옷/슈즈 별도 준비",
  },
  {
    category: "예물/예단",
    description: "예물 & 예단 준비",
    averageCost: "평균 300만원",
    timing: "D-90~60",
    timingStart: 90,
    timingEnd: 60,
    tip: "양가 상의 먼저. 예단은 지역별 차이 큼",
  },
  {
    category: "혼수",
    description: "혼수 구매",
    averageCost: "평균 500만원",
    timing: "D-60~30",
    timingStart: 60,
    timingEnd: 30,
    tip: "가전은 신혼 특가 시즌 활용. 가구는 입주일 역산",
  },
  {
    category: "신혼여행",
    description: "신혼여행 예약",
    averageCost: "평균 400만원",
    timing: "D-90~30",
    timingStart: 90,
    timingEnd: 30,
    tip: "성수기 항공은 3개월 전 예약. 여행자보험 필수",
  },
  {
    category: "기타",
    description: "청첩장, 부케, 답례품 등",
    averageCost: "평균 100만원",
    timing: "D-30~7",
    timingStart: 30,
    timingEnd: 7,
    tip: "청첩장은 2개월 전, 부케/답례품은 2주 전",
  },
];

function isInTimingRange(
  dday: number | null | undefined,
  timingStart: number,
  timingEnd: number,
): boolean {
  if (dday == null) return false;
  return dday <= timingStart && dday >= timingEnd;
}

export function WeddingPrepGuide({
  categoryExpenseMap,
  dday,
}: WeddingPrepGuideProps) {
  const [expanded, setExpanded] = useState(false);

  const items: PrepItem[] = PREP_ITEMS.map((item) => {
    const spent = categoryExpenseMap[item.category] ?? 0;
    return {
      ...item,
      completed: spent > 0,
      spentAmount: spent,
      isCurrent:
        !spent &&
        isInTimingRange(dday, item.timingStart, item.timingEnd),
    };
  });

  const completedCount = items.filter((i) => i.completed).length;

  return (
    <Card>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between"
      >
        <h3 className="text-sm font-semibold text-neutral-700">
          결혼 준비 가이드
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-primary-500">
            {completedCount}/{items.length}
          </span>
          <svg
            className={`h-4 w-4 text-neutral-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 space-y-1">
          {items.map((item) => (
            <div
              key={item.category}
              className={`flex gap-3 py-2 ${
                item.isCurrent
                  ? "-mx-2 rounded-lg bg-primary-50 px-2"
                  : ""
              }`}
            >
              <div className="flex shrink-0 pt-0.5">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    item.completed
                      ? "border-primary-500 bg-primary-500"
                      : item.isCurrent
                        ? "border-primary-400"
                        : "border-neutral-300"
                  }`}
                >
                  {item.completed && (
                    <svg
                      className="h-3 w-3 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-sm ${
                        item.completed
                          ? "text-neutral-400 line-through"
                          : "text-neutral-700"
                      }`}
                    >
                      {item.description}
                    </span>
                    <span className="shrink-0 rounded bg-secondary-50 px-1.5 py-0.5 text-xs text-secondary-600">
                      {item.timing}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 text-xs ${
                      item.completed
                        ? "text-primary-500"
                        : "text-neutral-400"
                    }`}
                  >
                    {item.completed
                      ? `${formatCurrency(item.spentAmount)}원 사용중`
                      : item.averageCost}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-neutral-400">
                  {item.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
