import { Card } from "@/shared/ui";
import { ProgressBar } from "@/shared/ui";
import { formatCurrency } from "@/shared/lib/format";

// TODO: Replace with real data
const MOCK_CATEGORIES = [
  { id: "1", name: "웨딩홀", budget: 12000000, expense: 8000000, count: 3 },
  { id: "2", name: "스튜디오", budget: 3500000, expense: 1200000, count: 2 },
  { id: "3", name: "드레스/턱시도", budget: 3000000, expense: 2500000, count: 4 },
  { id: "4", name: "예물/예단", budget: 5000000, expense: 550000, count: 1 },
  { id: "5", name: "혼수", budget: 6000000, expense: 0, count: 0 },
  { id: "6", name: "신혼여행", budget: 2000000, expense: 0, count: 0 },
  { id: "7", name: "기타", budget: 500000, expense: 250000, count: 2 },
];

export default function ManagePage() {
  const totalBudget = MOCK_CATEGORIES.reduce((sum, c) => sum + c.budget, 0);
  const totalExpense = MOCK_CATEGORIES.reduce((sum, c) => sum + c.expense, 0);

  return (
    <div className="hide-scrollbar overflow-y-auto px-5 pt-6 pb-4">
      {/* Header */}
      <section className="mb-5">
        <h1 className="text-xl font-bold text-neutral-900">지출 관리</h1>
        <div className="mt-3 flex gap-4">
          <div>
            <p className="text-xs text-neutral-500">총 예산</p>
            <p className="text-lg font-bold">{formatCurrency(totalBudget)}원</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">총 지출</p>
            <p className="text-lg font-bold text-primary-500">
              {formatCurrency(totalExpense)}원
            </p>
          </div>
        </div>
      </section>

      {/* Category List */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-700">카테고리</h3>
          <button className="text-sm text-primary-500">편집</button>
        </div>
        <div className="space-y-2.5">
          {MOCK_CATEGORIES.map((cat) => {
            const pct =
              cat.budget > 0
                ? Math.round((cat.expense / cat.budget) * 100)
                : 0;
            return (
              <Card key={cat.id} padding="sm" className="cursor-pointer active:bg-neutral-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-sm font-medium">{cat.name}</span>
                      {cat.count > 0 && (
                        <span className="rounded-full bg-primary-50 px-1.5 py-0.5 text-xs text-primary-600">
                          {cat.count}건
                        </span>
                      )}
                    </div>
                    <ProgressBar
                      current={cat.expense}
                      total={cat.budget}
                      size="sm"
                    />
                    <div className="mt-1 flex justify-between text-xs text-neutral-400">
                      <span>
                        {formatCurrency(cat.expense)} / {formatCurrency(cat.budget)}원
                      </span>
                      <span>{pct}%</span>
                    </div>
                  </div>
                  <svg
                    className="ml-3 h-5 w-5 text-neutral-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
