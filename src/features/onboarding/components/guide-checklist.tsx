"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/shared/ui";

interface GuideItem {
  label: string;
  completed: boolean;
  href: string;
}

interface GuideChecklistProps {
  items: GuideItem[];
}

export function GuideChecklist({ items }: GuideChecklistProps) {
  const [expanded, setExpanded] = useState(false);
  const completedCount = items.filter((i) => i.completed).length;
  const displayItems = expanded ? items : items.slice(0, 3);

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-700">
          웨플 시작 가이드
        </h3>
        <span className="text-xs font-medium text-primary-500">
          {completedCount}/{items.length} 완료
        </span>
      </div>
      <div className="space-y-2">
        {displayItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-2.5 py-1"
          >
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                item.completed
                  ? "border-primary-500 bg-primary-500"
                  : "border-neutral-300"
              }`}
            >
              {item.completed && (
                <svg
                  className="h-3 w-3 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span
              className={`text-sm ${
                item.completed
                  ? "text-neutral-400 line-through"
                  : "text-neutral-700"
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
      {items.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 w-full text-center text-xs text-neutral-400"
        >
          {expanded ? "접기" : `${items.length - 3}개 더보기`}
        </button>
      )}
    </Card>
  );
}
