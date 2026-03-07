"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Card, Button, TopBar } from "@/shared/ui";
import { useIsAuthenticated } from "@/features/auth";
import { KakaoShareButton } from "@/shared/ui/kakao-share";
import { createClient } from "@/shared/lib/supabase";

export default function PartnerPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { profile } = useIsAuthenticated();
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);

  const coupleCode = profile?.couple_id?.slice(0, 8).toUpperCase() ?? "";

  const handleCopy = async () => {
    if (!coupleCode) return;
    try {
      await navigator.clipboard.writeText(coupleCode);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = coupleCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinCouple = async () => {
    const code = inputCode.trim().toLowerCase();
    if (code.length < 8) {
      setJoinError("8자리 커플 코드를 입력해주세요");
      return;
    }

    // Don't join own couple
    if (code === profile?.couple_id?.slice(0, 8).toLowerCase()) {
      setJoinError("본인의 커플 코드는 입력할 수 없어요");
      return;
    }

    const confirmed = window.confirm(
      "파트너의 커플로 연결하면 예산 설정이 상대방 기준으로 바뀌고, 되돌릴 수 없어요. 연결할까요?"
    );
    if (!confirmed) return;

    setIsJoining(true);
    setJoinError("");

    try {
      const supabase = createClient();

      // Find couple by code prefix
      const { data: couples } = await supabase
        .from("couples")
        .select("id")
        .limit(100);

      const targetCouple = couples?.find(
        (c) => c.id.slice(0, 8).toLowerCase() === code,
      );

      if (!targetCouple) {
        setJoinError("해당 커플 코드를 찾을 수 없어요");
        setIsJoining(false);
        return;
      }

      const myOldCoupleId = profile?.couple_id;

      // Update my profile to new couple
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ couple_id: targetCouple.id })
        .eq("id", profile!.id);

      if (profileError) {
        setJoinError("연결에 실패했어요. 다시 시도해주세요.");
        setIsJoining(false);
        return;
      }

      // Move my expenses to new couple
      if (myOldCoupleId && myOldCoupleId !== targetCouple.id) {
        await supabase
          .from("expenses")
          .update({ couple_id: targetCouple.id } as Record<string, unknown>)
          .eq("couple_id", myOldCoupleId)
          .eq("created_by", profile!.id);

        await supabase
          .from("schedules")
          .update({ couple_id: targetCouple.id } as Record<string, unknown>)
          .eq("couple_id", myOldCoupleId);

        // Check if old couple has no other members
        const { data: remainingMembers } = await supabase
          .from("profiles")
          .select("id")
          .eq("couple_id", myOldCoupleId);

        if (!remainingMembers || remainingMembers.length === 0) {
          // Delete old categories & couple (expenses already moved)
          await supabase
            .from("categories")
            .delete()
            .eq("couple_id", myOldCoupleId);
          await supabase
            .from("couples")
            .delete()
            .eq("id", myOldCoupleId);
        }
      }

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["schedules"] });

      setJoinSuccess(true);
    } catch {
      setJoinError("연결 중 오류가 발생했어요");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="hide-scrollbar overflow-y-auto px-5 pt-6 pb-4">
      <TopBar title="파트너 초대" onBack={() => router.back()} />

      {/* Connected partner info */}
      {profile?.partner ? (
        <Card className="mb-4">
          <div className="flex items-center gap-4">
            {profile.partner.avatar_url ? (
              <img
                src={profile.partner.avatar_url}
                alt=""
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-500">
                {profile.partner.nickname?.charAt(0) ?? "?"}
              </div>
            )}
            <div className="flex-1">
              <p className="text-base font-semibold text-neutral-800">
                {profile.partner.nickname ?? "파트너"}
              </p>
              <p className="mt-0.5 text-sm text-neutral-500">
                {profile.partner.role === "bride" ? "신부" : profile.partner.role === "groom" ? "신랑" : ""}
                {profile.partner.role ? " · " : ""}연결됨
              </p>
            </div>
            <div className="flex h-8 items-center rounded-full bg-green-50 px-3 text-xs font-medium text-green-600">
              연결 완료
            </div>
          </div>
        </Card>
      ) : (
        <Card className="mb-4">
          <div className="text-center">
            <p className="text-4xl">💑</p>
            <p className="mt-3 text-base font-semibold text-neutral-800">
              파트너와 함께 관리해보세요
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500">
              커플 코드를 공유하거나 입력하면<br />
              같은 예산과 지출을 함께 볼 수 있어요
            </p>
          </div>
        </Card>
      )}

      {/* My Couple Code */}
      {profile?.couple_id && (
        <Card className="mb-4">
          <p className="mb-2 text-xs font-medium text-neutral-500">내 커플 코드</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-xl bg-neutral-50 px-4 py-3 text-center font-mono text-lg font-bold tracking-widest text-neutral-800">
              {coupleCode}
            </div>
            <button
              onClick={handleCopy}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 transition-colors active:bg-neutral-50"
              aria-label="코드 복사"
            >
              {copied ? (
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
              )}
            </button>
          </div>
          {copied && (
            <p className="mt-2 text-center text-xs text-green-600">복사되었어요!</p>
          )}
        </Card>
      )}

      {/* Share via Kakao */}
      <Card className="mb-4">
        <p className="mb-3 text-xs font-medium text-neutral-500">카카오톡으로 초대하기</p>
        <KakaoShareButton
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] text-sm font-semibold text-[#191919] transition-colors active:bg-[#EACF00]"
          title="웨플 - 결혼 비용 같이 관리하자!"
          description={`커플 코드: ${coupleCode} 를 입력하면 함께 관리할 수 있어요`}
        />
      </Card>

      {/* Join with code */}
      <Card className="mb-4">
        <p className="mb-3 text-xs font-medium text-neutral-500">파트너 코드로 연결하기</p>
        {joinSuccess ? (
          <div className="rounded-xl bg-green-50 px-4 py-4 text-center">
            <p className="text-sm font-semibold text-green-700">연결 완료!</p>
            <p className="mt-1 text-xs text-green-600">
              이제 파트너와 같은 데이터를 공유해요
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.toUpperCase().slice(0, 8));
                  setJoinError("");
                }}
                placeholder="8자리 커플 코드 입력"
                maxLength={8}
                className="h-11 flex-1 rounded-xl border border-neutral-300 px-4 text-center font-mono text-sm font-semibold tracking-widest uppercase placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-neutral-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
              <Button
                onClick={handleJoinCouple}
                disabled={isJoining || inputCode.length < 8}
                size="sm"
                className="shrink-0"
              >
                {isJoining ? "연결 중..." : "연결"}
              </Button>
            </div>
            {joinError && (
              <p className="mt-2 text-xs text-red-500">{joinError}</p>
            )}
          </>
        )}
      </Card>

      {/* How it works */}
      <Card className="mb-4">
        <p className="mb-3 text-xs font-medium text-neutral-500">연결 방법</p>
        <div className="space-y-3">
          {[
            { num: "1", text: "파트너에게 커플 코드를 공유해요" },
            { num: "2", text: "파트너가 웨플에 가입해요" },
            { num: "3", text: "파트너 초대 페이지에서 코드를 입력하면 연결!" },
          ].map((step) => (
            <div key={step.num} className="flex items-center gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600">
                {step.num}
              </div>
              <p className="text-sm text-neutral-700">{step.text}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Notice */}
      <div className="rounded-xl bg-neutral-50 px-4 py-3">
        <p className="mb-1.5 text-xs font-medium text-neutral-600">알아두세요</p>
        <ul className="space-y-1 text-xs leading-relaxed text-neutral-500">
          <li>• 코드를 입력하면 상대방의 데이터로 합쳐져요</li>
          <li>• 내가 기록한 지출은 유지되지만, 예산 설정은 상대방 기준으로 바뀌어요</li>
          <li>• 연결 후에는 되돌릴 수 없으니 신중하게 입력해주세요</li>
          <li>• 커플 코드는 본인만 확인할 수 있으니 안심하세요</li>
        </ul>
      </div>
    </div>
  );
}
