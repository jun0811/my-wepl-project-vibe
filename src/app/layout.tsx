import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "웨플 - 결혼 비용, 한눈에 관리",
    template: "%s | 웨플",
  },
  description:
    "결혼 준비 비용 얼마나 들까? 웨딩홀, 스드메, 예물 등 카테고리별 예산 관리부터 다른 커플의 실제 비용 비교까지. 신혼부부 필수 결혼 준비 가계부.",
  keywords: [
    "결혼 비용", "결혼 준비 비용", "웨딩 예산", "결혼 준비", "결혼 예산",
    "스드메 가격", "웨딩홀 비용", "신혼부부", "결혼 가계부", "웨딩 비용 관리",
    "결혼 준비 체크리스트", "예물 예단 비용", "신혼여행 비용", "혼수 비용",
    "결혼 평균 비용", "2026 결혼 비용",
  ],
  icons: {
    icon: "/icons/_icon_compressed_1772803748.png",
    apple: "/icons/_icon_compressed_1772803748.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "웨플",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "웨플",
    title: "웨플 - 결혼 비용, 한눈에 관리",
    description: "웨딩홀, 스드메, 예물 등 카테고리별 예산 관리부터 다른 커플의 실제 비용 비교까지. 커플이 함께 쓰는 결혼 준비 가계부.",
    images: ["/icons/_icon_compressed_1772803748.png"],
  },
  twitter: {
    card: "summary",
    title: "웨플 - 결혼 비용, 한눈에 관리",
    description: "결혼 준비 비용 관리 & 다른 커플 평균 비용 비교. 신혼부부 필수 앱.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://wepl.vercel.app"),
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#E8758A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "웨플",
              alternateName: "Wepl",
              description: "결혼 준비 비용 관리 & 다른 커플 평균 비용 비교. 커플이 함께 쓰는 결혼 가계부.",
              url: "https://wepl.vercel.app",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "KRW",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.5",
                ratingCount: "1",
              },
            }),
          }}
        />
        <Providers>
          <div className="app-shell">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
