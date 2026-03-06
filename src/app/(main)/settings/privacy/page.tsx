"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/shared/ui";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100" aria-label="뒤로가기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <h1 className="text-xl font-bold text-neutral-900">개인정보처리방침</h1>
      </div>

      <Card>
        <div className="space-y-4 text-sm leading-relaxed text-neutral-600">
          <h2 className="font-semibold text-neutral-900">1. 수집하는 개인정보</h2>
          <p>카카오 계정 연동 시: 닉네임, 프로필 사진, 이메일(선택)</p>
          <p>서비스 이용 시: 결혼 관련 예산 및 지출 정보</p>

          <h2 className="font-semibold text-neutral-900">2. 개인정보의 이용 목적</h2>
          <p>서비스 제공 및 사용자 식별, 커플 단위 데이터 관리, 익명 통계 생성</p>

          <h2 className="font-semibold text-neutral-900">3. 익명 데이터 활용</h2>
          <p>결제 완료된 지출 데이터는 개인 식별 정보를 제거한 후 지역별/카테고리별 통계에 활용됩니다. 최소 10건 이상의 데이터가 모인 그룹만 공개됩니다.</p>

          <h2 className="font-semibold text-neutral-900">4. 데이터 보관 및 삭제</h2>
          <p>회원 탈퇴 시 개인 데이터는 즉시 삭제됩니다. 이미 수집된 익명 통계 데이터는 개인을 특정할 수 없으므로 유지됩니다.</p>

          <h2 className="font-semibold text-neutral-900">5. 문의</h2>
          <p>개인정보 관련 문의는 서비스 내 설정 메뉴를 통해 접수할 수 있습니다.</p>
        </div>
      </Card>
    </div>
  );
}
