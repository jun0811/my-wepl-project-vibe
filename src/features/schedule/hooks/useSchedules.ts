"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  toggleScheduleComplete,
} from "../api/schedule";
import type { InsertSchedule, UpdateSchedule } from "@/shared/types";
import { useUIStore } from "@/store/ui-store";

const SCHEDULE_KEYS = {
  schedules: (coupleId: string) => ["schedules", coupleId] as const,
};

export function useSchedules(coupleId: string | null) {
  return useQuery({
    queryKey: SCHEDULE_KEYS.schedules(coupleId ?? ""),
    queryFn: () => getSchedules(coupleId!),
    enabled: !!coupleId,
  });
}

export function useCreateSchedule(coupleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schedule: InsertSchedule) => createSchedule(schedule),
    onSuccess: () => {
      useUIStore.getState().showToast("일정이 추가되었어요", "success");
      queryClient.invalidateQueries({
        queryKey: SCHEDULE_KEYS.schedules(coupleId),
      });
    },
    onError: () => {
      useUIStore.getState().showToast("일정 추가에 실패했어요", "error");
    },
  });
}

export function useUpdateSchedule(coupleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateSchedule }) =>
      updateSchedule(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SCHEDULE_KEYS.schedules(coupleId),
      });
    },
    onError: () => {
      useUIStore.getState().showToast("일정 수정에 실패했어요", "error");
    },
  });
}

export function useDeleteSchedule(coupleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSchedule(id),
    onSuccess: () => {
      useUIStore.getState().showToast("일정이 삭제되었어요", "success");
      queryClient.invalidateQueries({
        queryKey: SCHEDULE_KEYS.schedules(coupleId),
      });
    },
    onError: () => {
      useUIStore.getState().showToast("일정 삭제에 실패했어요", "error");
    },
  });
}

export function useToggleSchedule(coupleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) =>
      toggleScheduleComplete(id, isCompleted),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SCHEDULE_KEYS.schedules(coupleId),
      });
    },
    onError: () => {
      useUIStore.getState().showToast("일정 상태 변경에 실패했어요", "error");
    },
  });
}
