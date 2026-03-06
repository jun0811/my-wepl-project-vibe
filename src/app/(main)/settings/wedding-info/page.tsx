"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/shared/ui";
import { REGIONS, type Region } from "@/shared/types";
import { useIsAuthenticated } from "@/features/auth";
import { createClient } from "@/shared/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

export default function WeddingInfoPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { profile } = useIsAuthenticated();
  const couple = profile?.couples;

  const [weddingDate, setWeddingDate] = useState(couple?.wedding_date ?? "");
  const [region, setRegion] = useState<Region | string>(couple?.region ?? "");
  const [weddingHall, setWeddingHall] = useState(couple?.wedding_hall ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!profile?.couple_id) return;
    setIsSaving(true);
    const supabase = createClient();
    await supabase
      .from("couples")
      .update({
        wedding_date: weddingDate || null,
        region: region || null,
        wedding_hall: weddingHall || null,
      })
      .eq("id", profile.couple_id);

    queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    setIsSaving(false);
    router.back();
  };

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100" aria-label="뒤로가기">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <h1 className="text-xl font-bold text-neutral-900">결혼 정보 수정</h1>
      </div>

      <Card className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">결혼식 날짜</label>
          <input type="date" value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm focus:border-primary-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">지역</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm focus:border-primary-500 focus:outline-none">
            <option value="">선택해주세요</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">웨딩홀</label>
          <input type="text" value={weddingHall} onChange={(e) => setWeddingHall(e.target.value)} placeholder="웨딩홀 이름" className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm focus:border-primary-500 focus:outline-none" />
        </div>
        <Button onClick={handleSave} disabled={isSaving} fullWidth>
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </Card>
    </div>
  );
}
