import type { Metadata } from "next";
import { LandingContent } from "./landing-content";

export const metadata: Metadata = {
  title: "웨플 - 결혼 비용, 한눈에",
  description:
    "결혼 준비 예산부터 지출 관리, 다른 커플의 평균 비용까지. 커플이 함께 결혼 비용을 투명하게 관리하세요.",
  openGraph: {
    title: "웨플 - 결혼 비용, 한눈에",
    description: "예산 관리부터 다른 커플의 평균 비용까지. 결혼 준비의 모든 비용을 한눈에.",
    type: "website",
    images: ["/icons/_icon_compressed_1772803748.png"],
  },
};

export default function RootPage() {
  return <LandingContent />;
}
