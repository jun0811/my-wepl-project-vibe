"use client";

import { Card } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import type { Schedule } from "@/shared/types";

interface ScheduleListProps {
  schedules: Schedule[];
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}

export function ScheduleList({ schedules, onToggle, onDelete }: ScheduleListProps) {
  const upcoming = schedules.filter((s) => !s.is_completed);
  const completed = schedules.filter((s) => s.is_completed);

  return (
    <div className="space-y-6">
      {upcoming.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-neutral-700">
            다가오는 일정 ({upcoming.length})
          </h3>
          <div className="space-y-2">
            {upcoming.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-neutral-400">
            완료된 일정 ({completed.length})
          </h3>
          <div className="space-y-2">
            {completed.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                schedule={schedule}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      )}

      {schedules.length === 0 && (
        <div className="flex min-h-[30dvh] items-center justify-center">
          <p className="text-sm text-neutral-400">등록된 일정이 없어요</p>
        </div>
      )}
    </div>
  );
}

function ScheduleItem({
  schedule,
  onToggle,
  onDelete,
}: {
  schedule: Schedule;
  onToggle: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card padding="md">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onToggle(schedule.id, !schedule.is_completed)}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
            schedule.is_completed
              ? "border-primary-500 bg-primary-500"
              : "border-neutral-300",
          )}
        >
          {schedule.is_completed && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-medium",
              schedule.is_completed
                ? "text-neutral-400 line-through"
                : "text-neutral-900",
            )}
          >
            {schedule.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-400">
            <span>{schedule.date}</span>
            {schedule.time && <span>{schedule.time}</span>}
            {schedule.location && <span>{schedule.location}</span>}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(schedule.id)}
          className="shrink-0 p-1 text-neutral-300 transition-colors hover:text-error"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>
    </Card>
  );
}
