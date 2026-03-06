import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5">
      <div className="text-center">
        <p className="text-6xl mb-4">404</p>
        <h2 className="text-xl font-semibold text-neutral-800 mb-2">
          페이지를 찾을 수 없어요
        </h2>
        <p className="text-sm text-neutral-500 mb-8">
          주소가 올바른지 확인해 주세요
        </p>
        <Link
          href="/home"
          className="inline-block rounded-xl bg-primary-500 px-6 py-3 text-sm font-medium text-white active:bg-primary-600 transition-colors"
        >
          홈으로 이동
        </Link>
      </div>
    </div>
  );
}
