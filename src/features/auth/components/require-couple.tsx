"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated } from "../hooks/useAuth";

export function RequireCouple({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, hasCouple, isLoading } = useIsAuthenticated();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasCouple) {
      router.replace("/onboarding");
    }
  }, [isLoading, isAuthenticated, hasCouple, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-sm text-neutral-400">로딩 중...</p>
      </div>
    );
  }

  // Authenticated but no couple → redirecting
  if (isAuthenticated && !hasCouple) {
    return null;
  }

  return <>{children}</>;
}
