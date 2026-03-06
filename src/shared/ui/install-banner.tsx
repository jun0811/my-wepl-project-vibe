"use client";

import { useInstallPrompt } from "@/shared/hooks/useInstallPrompt";

interface InstallBannerProps {
  variant?: "card" | "inline";
}

export function InstallBanner({ variant = "card" }: InstallBannerProps) {
  const { canInstall, isIOS, isInstalled, promptInstall } = useInstallPrompt();

  if (isInstalled) return null;

  if (canInstall) {
    return variant === "card" ? (
      <div className="rounded-xl border border-primary-100 bg-primary-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-800">앱으로 설치하기</p>
            <p className="mt-0.5 text-xs text-neutral-500">
              홈 화면에서 바로 실행할 수 있어요
            </p>
          </div>
          <button
            onClick={promptInstall}
            className="rounded-lg bg-primary-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors active:bg-primary-600"
          >
            설치
          </button>
        </div>
      </div>
    ) : (
      <button
        onClick={promptInstall}
        className="text-xs font-medium text-primary-500 underline underline-offset-2"
      >
        앱 설치하기
      </button>
    );
  }

  if (isIOS) {
    return variant === "card" ? (
      <div className="rounded-xl border border-secondary-100 bg-secondary-50 px-4 py-3">
        <p className="text-sm font-medium text-neutral-800">앱으로 설치하기</p>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
          Safari 하단의{" "}
          <span className="inline-block rounded bg-neutral-100 px-1 py-0.5 text-neutral-700">
            공유
          </span>{" "}
          버튼 →{" "}
          <span className="inline-block rounded bg-neutral-100 px-1 py-0.5 text-neutral-700">
            홈 화면에 추가
          </span>
          를 눌러주세요
        </p>
      </div>
    ) : (
      <p className="text-xs text-neutral-400">
        Safari 공유 → 홈 화면에 추가로 설치
      </p>
    );
  }

  return null;
}
