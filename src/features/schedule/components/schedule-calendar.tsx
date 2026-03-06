"use client";

import { useState, useMemo } from "react";
import { cn } from "@/shared/lib/cn";
import type { Schedule } from "@/shared/types";

interface ScheduleCalendarProps {
  schedules: Schedule[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const DAY_HEADERS = ["일", "월", "화", "수", "목", "금", "토"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function formatDateString(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function ScheduleCalendar({
  schedules,
  selectedDate,
  onSelectDate,
}: ScheduleCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const days = useMemo(() => getCalendarDays(year, month), [year, month]);

  const scheduleDates = useMemo(() => {
    const set = new Set<string>();
    for (const s of schedules) {
      set.add(s.date);
    }
    return set;
  }, [schedules]);

  const todayStr = formatDateString(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  function goToPrevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={goToPrevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 active:bg-neutral-100"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-neutral-700">
          {year}년 {month + 1}월
        </span>
        <button
          onClick={goToNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 active:bg-neutral-100"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            className="pb-1 text-center text-xs text-neutral-400"
          >
            {d}
          </div>
        ))}

        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }

          const dateStr = formatDateString(year, month, day);
          const isToday = dateStr === todayStr;
          const isSelected = dateStr === selectedDate;
          const hasSchedule = scheduleDates.has(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className="flex flex-col items-center py-1"
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                  isSelected && "bg-primary-500 font-semibold text-white",
                  !isSelected && isToday && "ring-1 ring-primary-300",
                  !isSelected && "text-neutral-700",
                )}
              >
                {day}
              </span>
              <span
                className={cn(
                  "mt-0.5 h-1 w-1 rounded-full",
                  hasSchedule ? "bg-primary-400" : "bg-transparent",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
