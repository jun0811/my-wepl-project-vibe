import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "결혼 비용 평균 얼마? 카테고리별 실제 비용 통계",
  description:
    "2026년 결혼 비용 평균은? 웨딩홀, 스튜디오, 드레스, 예물, 혼수, 신혼여행 카테고리별 실제 커플들의 평균 비용과 가격 분포를 확인하세요. 지역별 결혼 비용 비교.",
  keywords: [
    "결혼 비용 평균", "웨딩홀 평균 가격", "스드메 평균 비용",
    "결혼 비용 통계", "2026 결혼 비용", "지역별 결혼 비용",
    "예물 예단 평균", "신혼여행 평균 비용", "혼수 비용 평균",
  ],
  openGraph: {
    title: "결혼 비용 평균 - 카테고리별 실제 비용 통계 | 웨플",
    description: "웨딩홀, 스드메, 예물 등 카테고리별 실제 커플들의 평균 비용을 확인하세요.",
  },
  alternates: {
    canonical: "/explore",
  },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
