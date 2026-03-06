"use client";

import { useState } from "react";
import { BottomSheet, Card } from "@/shared/ui";
import { FAB } from "@/shared/ui/fab";
import { useIsAuthenticated } from "@/features/auth";
import {
  useSchedules,
  useCreateSchedule,
  useDeleteSchedule,
  useToggleSchedule,
  ScheduleForm,
  ScheduleList,
  ScheduleCalendar,
} from "@/features/schedule";

export default function SchedulePage() {
  const { isLoading, profile } = useIsAuthenticated();
  const coupleId = profile?.couple_id ?? "";
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: schedules } = useSchedules(coupleId);
  const createMutation = useCreateSchedule(coupleId);
  const deleteMutation = useDeleteSchedule(coupleId);
  const toggleMutation = useToggleSchedule(coupleId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-primary-400" />
      </div>
    );
  }

  const displaySchedules = schedules ?? [];
  const filteredSchedules = selectedDate
    ? displaySchedules.filter((s) => s.date === selectedDate)
    : displaySchedules;

  return (
    <div className="hide-scrollbar overflow-y-auto px-5 pt-6 pb-4">
      <section className="mb-5">
        <h1 className="text-xl font-bold text-neutral-900">
          일정 관리
          {displaySchedules.length > 0 && (
            <span className="ml-2 text-base font-medium text-neutral-400">
              {displaySchedules.length}
            </span>
          )}
        </h1>
      </section>

      <Card className="mb-4">
        <ScheduleCalendar
          schedules={displaySchedules}
          selectedDate={selectedDate}
          onSelectDate={(date) =>
            setSelectedDate(date === selectedDate ? null : date)
          }
        />
      </Card>

      {selectedDate && (
        <button
          onClick={() => setSelectedDate(null)}
          className="mb-3 text-xs text-primary-500"
        >
          전체 일정 보기
        </button>
      )}

      <ScheduleList
        schedules={filteredSchedules}
        onToggle={(id, isCompleted) =>
          toggleMutation.mutate({ id, isCompleted })
        }
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      <FAB onClick={() => setShowForm(true)} />

      <BottomSheet
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="일정 추가"
      >
        <ScheduleForm
          onSubmit={(data) => {
            if (!profile) return;
            createMutation.mutate(
              {
                ...data,
                couple_id: coupleId,
              },
              {
                onSuccess: () => setShowForm(false),
              },
            );
          }}
          onCancel={() => setShowForm(false)}
          isPending={createMutation.isPending}
        />
      </BottomSheet>
    </div>
  );
}
