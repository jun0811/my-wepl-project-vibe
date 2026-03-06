"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Button, TopBar } from "@/shared/ui";
import { useIsAuthenticated } from "@/features/auth";

const FEATURES = [
  {
    icon: "💰",
    title: "예산 관리",
    description: "총 예산 설정부터 카테고리별 배분까지, 한눈에 예산을 관리하세요.",
  },
  {
    icon: "📝",
    title: "지출 기록",
    description: "결제 상태, 태그, 업체 정보까지 꼼꼼하게 기록하고 엑셀로 추출하세요.",
  },
  {
    icon: "📅",
    title: "일정 관리",
    description: "캘린더에서 결혼 준비 일정을 한눈에 확인하고 관리하세요.",
  },
  {
    icon: "📊",
    title: "비용 탐색",
    description: "다른 커플의 평균 비용과 내 예산을 비교해보세요.",
  },
];

const HIGHLIGHTS = [
  {
    icon: "📎",
    title: "엑셀 추출",
    description: "지출 내역을 엑셀 파일로 한번에 다운로드",
  },
  {
    icon: "👫",
    title: "파트너 공유",
    description: "커플이 함께 실시간으로 예산과 지출을 관리",
  },
  {
    icon: "🔒",
    title: "안전한 데이터",
    description: "통계 데이터는 완전 익명화되어 개인정보 걱정 없음",
  },
];

export default function AboutPage() {
  const router = useRouter();
  const { isAuthenticated } = useIsAuthenticated();

  return (
    <div className="hide-scrollbar overflow-y-auto px-5 pt-6 pb-4">
      <TopBar title="기능 소개" onBack={() => router.back()} />

      {/* Hero */}
      <section className="mb-8 flex flex-col items-center pt-4">
        <Image
          src="/icons/_icon_compressed_1772803748.png"
          alt="Wepl"
          width={80}
          height={80}
          className="rounded-2xl shadow-md"
        />
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Wepl</h1>
        <p className="mt-1 text-sm text-neutral-500">
          결혼 준비, 함께 관리하세요
        </p>
      </section>

      {/* Core Features */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">핵심 기능</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {FEATURES.map((f) => (
            <Card key={f.title} padding="sm" className="text-center">
              <span className="text-2xl">{f.icon}</span>
              <p className="mt-2 text-sm font-semibold text-neutral-800">{f.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">{f.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="mb-6">
        <h2 className="mb-3 text-sm font-semibold text-neutral-700">이런 것도 돼요</h2>
        <Card>
          <div className="divide-y divide-neutral-50">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="flex items-start gap-3 py-3">
                <span className="mt-0.5 text-lg">{h.icon}</span>
                <div>
                  <p className="text-sm font-medium text-neutral-800">{h.title}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{h.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="pb-4">
        {isAuthenticated ? (
          <Link href="/home">
            <Button fullWidth>홈으로 돌아가기</Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button fullWidth>시작하기</Button>
          </Link>
        )}
      </section>
    </div>
  );
}
