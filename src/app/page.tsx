import type { Metadata } from "next";
import { LandingContent } from "./landing-content";

export const metadata: Metadata = {
  title: "웨플 - 결혼 비용 얼마나 들까? 예산 관리 & 평균 비용 비교",
  description:
    "결혼 준비 비용이 막막하다면? 웨딩홀·스드메·예물 카테고리별 예산 설정, 지출 추적, 다른 커플의 실제 평균 비용 비교까지. 커플이 함께 쓰는 무료 결혼 가계부.",
  openGraph: {
    title: "웨플 - 결혼 비용 얼마나 들까?",
    description: "웨딩홀, 스드메, 예물 예산 관리부터 다른 커플 평균 비용 비교까지. 신혼부부 필수 결혼 준비 가계부.",
    type: "website",
    images: ["/icons/_icon_compressed_1772803748.png"],
  },
};

export default function RootPage() {
  return <LandingContent />;
}
