"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/shared/ui";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100" aria-label="뒤로가기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <h1 className="text-xl font-bold text-neutral-900">이용약관</h1>
      </div>

      <Card>
        <div className="space-y-4 text-sm leading-relaxed text-neutral-600">
          <h2 className="font-semibold text-neutral-900">제1조 (목적)</h2>
          <p>이 약관은 웨플(이하 &quot;서비스&quot;)이 제공하는 결혼 비용 관리 서비스의 이용에 관한 기본적인 사항을 규정함을 목적으로 합니다.</p>

          <h2 className="font-semibold text-neutral-900">제2조 (서비스 내용)</h2>
          <p>서비스는 결혼 준비 예산 관리, 지출 기록, 카테고리별 비용 통계 제공 등의 기능을 포함합니다.</p>

          <h2 className="font-semibold text-neutral-900">제3조 (개인정보)</h2>
          <p>서비스는 사용자의 결혼 비용 데이터를 익명화하여 통계 목적으로 활용할 수 있습니다. 개인을 특정할 수 있는 정보는 통계에 포함되지 않습니다.</p>

          <h2 className="font-semibold text-neutral-900">제4조 (면책)</h2>
          <p>서비스에서 제공하는 통계 및 비용 정보는 참고용이며, 실제 비용과 다를 수 있습니다.</p>
        </div>
      </Card>
    </div>
  );
}
