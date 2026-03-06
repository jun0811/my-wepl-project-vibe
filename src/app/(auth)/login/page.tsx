"use client";

import { Button } from "@/shared/ui";
import { InstallBanner } from "@/shared/ui/install-banner";
import { useSignIn } from "@/features/auth";
import Link from "next/link";

export default function LoginPage() {
  const { mutate: signIn, isPending } = useSignIn();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      {/* Logo & Title */}
      <div className="mb-12 text-center">
        <div className="mb-4 text-5xl font-bold text-primary-500">웨플</div>
        <p className="text-lg text-neutral-600">결혼 비용, 한눈에</p>
        <p className="mt-2 text-sm text-neutral-400">
          예산 관리부터 다른 커플의 평균 비용까지
        </p>
      </div>

      {/* Login Buttons */}
      <div className="w-full max-w-xs space-y-3">
        <button
          type="button"
          onClick={() => signIn()}
          disabled={isPending}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] text-sm font-semibold text-[#191919] transition-colors hover:bg-[#F5DC00] active:bg-[#EACF00] disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.45 4.08 3.63 5.18-.16.58-.58 2.1-.66 2.43-.1.41.15.4.31.29.13-.09 2.01-1.36 2.82-1.91.61.09 1.24.13 1.9.13 4.42 0 8-2.79 8-6.12C17 3.79 13.42 1 9 1Z"
              fill="#191919"
            />
          </svg>
          {isPending ? "로그인 중..." : "카카오로 시작하기"}
        </button>

        <Link href="/home" className="block">
          <Button variant="ghost" fullWidth>
            서비스 둘러보기
          </Button>
        </Link>
      </div>

      {/* Install Banner */}
      <div className="mt-6 w-full max-w-xs">
        <InstallBanner variant="card" />
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-neutral-300">
        로그인하면{" "}
        <span className="underline">이용약관</span>과{" "}
        <span className="underline">개인정보처리방침</span>에 동의합니다.
      </p>
    </div>
  );
}
