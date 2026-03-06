"use client";

import { useEffect, useCallback, useRef } from "react";

declare global {
  interface Window {
    Kakao?: {
      init(key: string): void;
      isInitialized(): boolean;
      Share: {
        sendDefault(params: Record<string, unknown>): void;
      };
    };
  }
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? "";
const SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";

function initKakao() {
  if (window.Kakao && !window.Kakao.isInitialized() && KAKAO_JS_KEY) {
    window.Kakao.init(KAKAO_JS_KEY);
  }
}

function useKakaoSDK() {
  const loaded = useRef(false);

  useEffect(() => {
    if (!KAKAO_JS_KEY || loaded.current) return;
    loaded.current = true;

    // Already loaded
    if (window.Kakao) {
      initKakao();
      return;
    }

    // Script tag already exists but not yet loaded
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", initKakao);
      return;
    }

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = initKakao;
    document.head.appendChild(script);
  }, []);
}

export function useKakaoShare() {
  useKakaoSDK();

  const share = useCallback(
    ({
      title = "웨플 - 결혼 비용, 한눈에",
      description = "예산 관리부터 다른 커플의 평균 비용까지. 결혼 준비 비용을 함께 관리하세요.",
      imageUrl,
      pageUrl,
    }: {
      title?: string;
      description?: string;
      imageUrl?: string;
      pageUrl?: string;
    } = {}) => {
      if (!window.Kakao?.isInitialized()) {
        // SDK not ready — try init once more
        initKakao();
        if (!window.Kakao?.isInitialized()) {
          alert("카카오 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
          return;
        }
      }

      const url = pageUrl ?? window.location.origin;

      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title,
          description,
          imageUrl: imageUrl ?? `${url}/icons/_icon_compressed_1772803748.png`,
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [
          {
            title: "웨플 시작하기",
            link: { mobileWebUrl: url, webUrl: url },
          },
        ],
      });
    },
    [],
  );

  return share;
}

interface KakaoShareButtonProps {
  className?: string;
  title?: string;
  description?: string;
}

export function KakaoShareButton({
  className,
  title,
  description,
}: KakaoShareButtonProps) {
  const share = useKakaoShare();

  return (
    <button
      type="button"
      onClick={() => share({ title, description })}
      className={
        className ??
        "flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/30 text-sm font-medium text-white transition-colors active:bg-white/10"
      }
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.45 4.08 3.63 5.18-.16.58-.58 2.1-.66 2.43-.1.41.15.4.31.29.13-.09 2.01-1.36 2.82-1.91.61.09 1.24.13 1.9.13 4.42 0 8-2.79 8-6.12C17 3.79 13.42 1 9 1Z"
          fill="currentColor"
        />
      </svg>
      카카오톡으로 공유하기
    </button>
  );
}
