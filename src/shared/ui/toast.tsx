"use client";

import { useEffect } from "react";
import { cn } from "@/shared/lib/cn";
import { useUIStore } from "@/store/ui-store";

const variantStyles = {
  success: "bg-success",
  error: "bg-error",
  info: "bg-info",
} as const;

export function Toast() {
  const toast = useUIStore((s) => s.toastMessage);
  const hideToast = useUIStore((s) => s.hideToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(hideToast, 3000);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <div
      className={cn(
        "fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-[398px] rounded-xl px-4 py-3 text-center text-sm font-medium text-white shadow-lg",
        variantStyles[toast.variant],
      )}
      role="status"
      aria-live="polite"
    >
      {toast.message}
    </div>
  );
}
