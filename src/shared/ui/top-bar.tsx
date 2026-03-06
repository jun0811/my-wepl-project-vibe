"use client";

import { cn } from "@/shared/lib/cn";
import { Icon } from "./icon";

interface TopBarProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export function TopBar({ title, onBack, rightAction, className }: TopBarProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center bg-white px-4",
        className,
      )}
    >
      {onBack ? (
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center -ml-2"
          aria-label="뒤로 가기"
        >
          <Icon name="arrow-left" size={20} />
        </button>
      ) : (
        <div className="w-10" />
      )}

      <h1 className="flex-1 text-center text-base font-semibold text-neutral-900 truncate">
        {title}
      </h1>

      {rightAction ? (
        <div className="flex items-center">{rightAction}</div>
      ) : (
        <div className="w-10" />
      )}
    </header>
  );
}
