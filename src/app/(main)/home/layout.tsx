import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "결혼 준비 예산 관리 - D-day, 카테고리별 지출 현황",
  description:
    "결혼식 D-day 카운트다운, 총 예산 대비 지출 현황, 웨딩홀·스드메·예물 카테고리별 진행률을 한눈에. 파트너와 함께 관리하는 결혼 준비 대시보드.",
  alternates: {
    canonical: "/home",
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
