import type { Metadata, Viewport } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "웨플 - 결혼 비용, 한눈에",
  description:
    "결혼 준비 예산부터 지출 관리, 다른 커플의 평균 비용까지. 결혼 비용의 모든 것을 투명하게.",
  keywords: ["결혼 비용", "웨딩 예산", "결혼 준비", "스드메 가격", "웨딩홀 비용"],
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
        <Providers>
          <div className="app-shell">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
