import { Card } from "@/shared/ui";
import { formatCurrency } from "@/shared/lib/format";

// TODO: Replace with real aggregated data
const MOCK_TRENDS = [
  { category: "웨딩홀", average: 11800000, change: 3 },
  { category: "스튜디오", average: 3200000, change: -2 },
  { category: "드레스/턱시도", average: 2800000, change: 5 },
  { category: "예물/예단", average: 4500000, change: 1 },
  { category: "혼수", average: 5800000, change: -1 },
  { category: "신혼여행", average: 2500000, change: 0 },
];

const TOTAL_AVERAGE = 32500000;
const DATA_COUNT = 847;

export default function ExplorePage() {
  return (
    <div className="hide-scrollbar overflow-y-auto px-5 pt-6 pb-4">
      {/* Header */}
      <section className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">
          결혼 비용, 얼마나 들까?
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          웨플 사용자 {DATA_COUNT}쌍의 실제 데이터 기준
        </p>
      </section>

      {/* Total Average */}
      <Card className="mb-5 bg-primary-50 border-primary-100">
        <div className="text-center">
          <p className="text-sm text-primary-600">전체 평균 결혼 비용</p>
          <p className="mt-1 text-3xl font-bold text-primary-700">
            {formatCurrency(TOTAL_AVERAGE)}원
          </p>
          <p className="mt-2 text-xs text-primary-400">
            서울/경기 기준 | 최근 6개월
          </p>
        </div>
      </Card>

      {/* Category Trends */}
      <section className="mb-5">
        <h3 className="mb-3 text-sm font-semibold text-neutral-700">
          카테고리별 평균 비용
        </h3>
        <div className="space-y-2">
          {MOCK_TRENDS.map((item) => (
            <Card key={item.category} padding="sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.category}</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(item.average)}원
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={
                      item.change > 0
                        ? "text-sm text-error"
                        : item.change < 0
                          ? "text-sm text-secondary-500"
                          : "text-sm text-neutral-400"
                    }
                  >
                    {item.change > 0 ? "+" : ""}
                    {item.change}%
                  </span>
                  <p className="text-xs text-neutral-400">vs 작년</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Card className="bg-secondary-50 border-secondary-100 text-center">
        <p className="text-sm font-medium text-secondary-700">
          내 결혼 비용은 평균 대비 어디쯤?
        </p>
        <p className="mt-1 text-xs text-secondary-500">
          지출을 기록하면 다른 커플과 비교할 수 있어요
        </p>
      </Card>
    </div>
  );
}
