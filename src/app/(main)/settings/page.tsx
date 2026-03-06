"use client";

import { Card, Button } from "@/shared/ui";
import { InstallBanner } from "@/shared/ui/install-banner";
import { useIsAuthenticated, useSignOut } from "@/features/auth";
import Link from "next/link";

const MENU_ITEMS = [
  { label: "결혼 정보 수정", href: "/settings/wedding-info" },
  { label: "예산 설정", href: "/settings/budget" },
  { label: "파트너 초대", href: "/settings/partner" },
  { label: "기능 소개", href: "/settings/about" },
  { label: "이용약관", href: "/settings/terms" },
  { label: "개인정보처리방침", href: "/settings/privacy" },
];

export default function SettingsPage() {
  const { isAuthenticated, isLoading, profile } = useIsAuthenticated();
  const { mutate: signOut, isPending: isSigningOut } = useSignOut();

  if (isLoading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-400" />
      </div>
    );
  }

  return (
    <div className="hide-scrollbar overflow-y-auto px-5 pt-6 pb-4">
      <h1 className="mb-5 text-xl font-bold text-neutral-900">설정</h1>

      {/* Profile */}
      <Card className="mb-5">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="프로필"
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-primary-600">
                  {profile?.nickname?.charAt(0) ?? "W"}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold">{profile?.nickname ?? "웨플 사용자"}</p>
              <p className="text-sm text-neutral-500">
                {profile?.role === "bride" ? "신부" : profile?.role === "groom" ? "신랑" : ""}{" "}
                {profile?.couples?.region ? `| ${profile.couples.region}` : ""}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-3 text-sm text-neutral-500">
              로그인하면 데이터를 저장하고 파트너와 공유할 수 있어요
            </p>
            <Link href="/login">
              <Button size="sm">로그인하기</Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Menu */}
      <Card padding="sm">
        <ul className="divide-y divide-neutral-50">
          {MENU_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center justify-between px-1 py-3.5"
              >
                <span className="text-sm text-neutral-700">{item.label}</span>
                <svg
                  className="h-4 w-4 text-neutral-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </li>
          ))}

          {/* Logout */}
          {isAuthenticated && (
            <li>
              <button
                onClick={() => signOut()}
                disabled={isSigningOut}
                className="flex w-full items-center px-1 py-3.5 text-sm text-error disabled:opacity-50"
              >
                {isSigningOut ? "로그아웃 중..." : "로그아웃"}
              </button>
            </li>
          )}
        </ul>
      </Card>

      {/* Install App */}
      <div className="mt-5">
        <InstallBanner variant="card" />
      </div>

      <p className="mt-6 text-center text-xs text-neutral-300">
        Wepl v0.1.0
      </p>
    </div>
  );
}
