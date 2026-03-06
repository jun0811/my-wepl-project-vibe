"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/shared/ui";

interface ScheduleFormData {
  title: string;
  date: string;
  time: string;
  location: string;
  memo: string;
}

interface ScheduleFormProps {
  onSubmit: (data: {
    title: string;
    date: string;
    time: string | null;
    location: string | null;
    memo: string | null;
  }) => void;
  onCancel: () => void;
  isPending?: boolean;
  defaultValues?: Partial<ScheduleFormData>;
}

export function ScheduleForm({
  onSubmit,
  onCancel,
  isPending,
  defaultValues,
}: ScheduleFormProps) {
  const { register, handleSubmit, formState: { errors } } =
    useForm<ScheduleFormData>({
      defaultValues: {
        title: defaultValues?.title ?? "",
        date: defaultValues?.date ?? new Date().toISOString().split("T")[0],
        time: defaultValues?.time ?? "",
        location: defaultValues?.location ?? "",
        memo: defaultValues?.memo ?? "",
      },
    });

  const onFormSubmit = (data: ScheduleFormData) => {
    onSubmit({
      title: data.title,
      date: data.date,
      time: data.time || null,
      location: data.location || null,
      memo: data.memo || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          일정명
        </label>
        <input
          {...register("title", { required: "일정명을 입력해주세요" })}
          placeholder="예: 웨딩홀 방문"
          className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-error">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          날짜
        </label>
        <input
          {...register("date", { required: "날짜를 선택해주세요" })}
          type="date"
          className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
        {errors.date && (
          <p className="mt-1 text-xs text-error">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          시간 (선택)
        </label>
        <input
          {...register("time")}
          type="time"
          className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          장소 (선택)
        </label>
        <input
          {...register("location")}
          placeholder="예: OO웨딩홀"
          className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          메모 (선택)
        </label>
        <textarea
          {...register("memo")}
          rows={2}
          placeholder="메모를 입력하세요"
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          취소
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}
