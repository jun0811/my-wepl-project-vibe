"use client";

import Link from "next/link";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5">
      <div className="text-center">
        <p className="text-6xl mb-4">!</p>
        <h2 className="text-xl font-semibold text-neutral-800 mb-2">
          문제가 발생했어요
        </h2>
        <p className="text-sm text-neutral-500 mb-8">
          잠시 후 다시 시도해 주세요
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-primary-500 px-6 py-3 text-sm font-medium text-white active:bg-primary-600 transition-colors"
          >
            다시 시도
          </button>
          <Link
            href="/home"
            className="text-sm text-neutral-500 underline underline-offset-2"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
