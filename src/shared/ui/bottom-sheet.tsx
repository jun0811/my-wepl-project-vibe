"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/shared/lib/cn";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "relative z-10 w-full max-w-[430px] rounded-t-2xl bg-white",
          "max-h-[85dvh] overflow-y-auto",
          "animate-slide-up",
        )}
      >
        {/* Handle */}
        <div className="sticky top-0 z-10 bg-white pt-3 pb-2">
          <div className="mx-auto h-1 w-10 rounded-full bg-neutral-300" />
          {title && (
            <h2 className="mt-3 px-5 text-lg font-semibold text-neutral-900">
              {title}
            </h2>
          )}
        </div>

        {/* Content */}
        <div className="px-5 pb-8">{children}</div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
