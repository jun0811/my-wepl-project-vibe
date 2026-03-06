"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/ui";
import { InstallBanner } from "@/shared/ui/install-banner";
import { KakaoShareButton } from "@/shared/ui/kakao-share";

const FEATURES = [
  {
    icon: "budget",
    title: "예산 관리",
    desc: "총 예산 설정부터 카테고리별 배분까지\n한눈에 관리",
  },
  {
    icon: "expense",
    title: "지출 기록",
    desc: "결제 상태, 태그, 업체 정보까지\n꼼꼼하게 기록",
  },
  {
    icon: "explore",
    title: "비용 탐색",
    desc: "다른 커플의 평균 비용과\n내 예산 비교",
  },
  {
    icon: "share",
    title: "커플 공유",
    desc: "파트너와 실시간으로\n함께 관리",
  },
];

const STATS = [
  { value: "7", label: "기본 카테고리" },
  { value: "100%", label: "무료" },
  { value: "0", label: "광고" },
];

const STEPS = [
  { num: "1", title: "카카오 로그인", desc: "3초면 가입 완료" },
  { num: "2", title: "결혼 정보 입력", desc: "날짜, 지역, 예산 설정" },
  { num: "3", title: "지출 기록 시작", desc: "카테고리별로 기록하고 관리" },
];

function FeatureIcon({ type }: { type: string }) {
  const iconMap: Record<string, string> = {
    budget: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    expense: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    explore: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    share: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  };

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100">
      <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={iconMap[type]} />
      </svg>
    </div>
  );
}

export function LandingContent() {
  return (
    <div className="hide-scrollbar overflow-y-auto">
      {/* Hero */}
      <section className="relative flex flex-col items-center px-6 pt-16 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-white" />
        <div className="relative z-10 flex flex-col items-center">
          <Image
            src="/icons/_icon_compressed_1772803748.png"
            alt="Wepl"
            width={80}
            height={80}
            className="rounded-2xl shadow-lg"
          />
          <h1 className="mt-6 text-center text-3xl font-bold leading-tight text-neutral-900">
            결혼 비용,<br />한눈에 관리하세요
          </h1>
          <p className="mt-3 text-center text-base leading-relaxed text-neutral-500">
            예산 설정부터 지출 기록, 다른 커플의 평균 비용까지<br />
            커플이 함께 투명하게
          </p>

          <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
            <Link href="/home">
              <Button fullWidth size="lg">
                둘러보기
              </Button>
            </Link>
            <Link href="/login">
              <Button fullWidth size="lg" variant="outline">
                카카오로 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-8">
        <div className="flex justify-around rounded-2xl bg-neutral-50 py-5">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-primary-500">{s.value}</p>
              <p className="mt-1 text-xs text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-8">
        <h2 className="mb-6 text-center text-xl font-bold text-neutral-900">
          이런 기능이 있어요
        </h2>
        <div className="flex flex-col gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-100">
              <FeatureIcon type={f.icon} />
              <div className="flex-1">
                <p className="text-base font-semibold text-neutral-900">{f.title}</p>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-neutral-500">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-neutral-50 px-6 py-10">
        <h2 className="mb-6 text-center text-xl font-bold text-neutral-900">
          시작하는 방법
        </h2>
        <div className="flex flex-col gap-4">
          {STEPS.map((s) => (
            <div key={s.num} className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-lg font-bold text-white">
                {s.num}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-800">{s.title}</p>
                <p className="text-xs text-neutral-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore preview */}
      <section className="px-6 py-10">
        <h2 className="mb-2 text-center text-xl font-bold text-neutral-900">
          다른 커플은 얼마나 쓸까?
        </h2>
        <p className="mb-6 text-center text-sm text-neutral-500">
          익명 통계로 카테고리별 평균 비용을 비교해보세요
        </p>
        <div className="space-y-3">
          {[
            { name: "웨딩홀", avg: "800만", range: "500~1,200만" },
            { name: "스튜디오", avg: "250만", range: "150~400만" },
            { name: "드레스/정장", avg: "200만", range: "100~350만" },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-neutral-100">
              <span className="text-sm font-medium text-neutral-800">{item.name}</span>
              <div className="text-right">
                <span className="text-sm font-bold text-primary-500">평균 {item.avg}</span>
                <span className="ml-2 text-xs text-neutral-400">{item.range}</span>
              </div>
            </div>
          ))}
        </div>
        <Link href="/explore" className="mt-4 block text-center text-sm font-medium text-secondary-500 underline underline-offset-2">
          전체 비용 탐색하기
        </Link>
      </section>

      {/* Social proof / highlights */}
      <section className="bg-primary-50 px-6 py-10">
        <h2 className="mb-6 text-center text-xl font-bold text-neutral-900">
          왜 웨플인가요?
        </h2>
        <div className="space-y-3">
          {[
            { title: "엑셀보다 편하게", desc: "지출 내역을 기록하고 엑셀로도 추출할 수 있어요" },
            { title: "파트너와 실시간 공유", desc: "같은 데이터를 보면서 함께 결정할 수 있어요" },
            { title: "개인정보 걱정 없음", desc: "통계 데이터는 완전 익명화. 누가 얼마 썼는지 절대 알 수 없어요" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl bg-white px-4 py-3.5 shadow-sm">
              <p className="text-sm font-semibold text-neutral-800">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Install Banner */}
      <section className="px-6 py-6">
        <InstallBanner variant="card" />
      </section>

      {/* Final CTA */}
      <section className="px-6 pt-4 pb-10">
        <div className="rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 px-6 py-8 text-center text-white shadow-lg">
          <p className="text-lg font-bold">결혼 준비, 같이 시작해요</p>
          <p className="mt-2 text-sm opacity-90">
            무료로 시작하고 파트너를 초대하세요
          </p>
          <div className="mt-5 flex flex-col gap-2.5">
            <Link href="/login">
              <Button fullWidth size="lg" variant="outline" className="border-white bg-white text-primary-600 hover:bg-primary-50">
                카카오로 시작하기
              </Button>
            </Link>
            <KakaoShareButton />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 px-6 py-6 text-center">
        <p className="text-xs text-neutral-400">
          <Link href="/settings/terms" className="underline underline-offset-2">이용약관</Link>
          {" | "}
          <Link href="/settings/privacy" className="underline underline-offset-2">개인정보처리방침</Link>
          {" | "}
          <Link href="/settings/about" className="underline underline-offset-2">기능 소개</Link>
        </p>
        <p className="mt-2 text-xs text-neutral-300">Wepl v0.1.0</p>
      </footer>
    </div>
  );
}
