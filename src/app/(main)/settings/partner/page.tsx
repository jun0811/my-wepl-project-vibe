"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/shared/ui";
import { useIsAuthenticated } from "@/features/auth";

export default function PartnerPage() {
  const router = useRouter();
  const { profile } = useIsAuthenticated();

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100" aria-label="뒤로가기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <h1 className="text-xl font-bold text-neutral-900">파트너 초대</h1>
      </div>

      <Card className="py-8 text-center">
        <p className="mb-2 text-4xl">💑</p>
        <p className="text-sm font-medium text-neutral-700">
          파트너와 함께 관리해보세요
        </p>
        <p className="mt-2 text-xs text-neutral-400">
          파트너 초대 기능은 곧 업데이트될 예정이에요
        </p>
        {profile?.couple_id && (
          <div className="mt-4 rounded-lg bg-neutral-50 p-3">
            <p className="text-xs text-neutral-500">커플 코드</p>
            <p className="mt-1 font-mono text-sm font-semibold text-neutral-700">
              {profile.couple_id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
