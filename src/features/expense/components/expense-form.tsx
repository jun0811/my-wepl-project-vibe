"use client";

import { useForm } from "react-hook-form";
import { Button, Chip } from "@/shared/ui";
import { SUGGESTED_TAGS } from "@/shared/types";
import type { Category } from "@/shared/types";

interface ExpenseFormData {
  title: string;
  amount: string;
  categoryId: string;
  memo: string;
  date: string;
  vendorName: string;
  isPaid: boolean;
  priceFelling: "cheap" | "fair" | "expensive" | "";
}

interface ExpenseFormProps {
  categories: Category[];
  onSubmit: (data: {
    category_id: string;
    title: string;
    amount: number;
    memo: string | null;
    date: string | null;
    vendor_name: string | null;
    is_paid: boolean;
    price_feeling: "cheap" | "fair" | "expensive" | null;
    tags: string[];
  }) => void;
  onCancel: () => void;
  isPending?: boolean;
  defaultValues?: Partial<ExpenseFormData & { tags: string[] }>;
}

export function ExpenseForm({
  categories,
  onSubmit,
  onCancel,
  isPending,
  defaultValues,
}: ExpenseFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<ExpenseFormData & { tags: string[] }>({
      defaultValues: {
        title: defaultValues?.title ?? "",
        amount: defaultValues?.amount ?? "",
        categoryId: defaultValues?.categoryId ?? categories[0]?.id ?? "",
        memo: defaultValues?.memo ?? "",
        date: defaultValues?.date ?? new Date().toISOString().split("T")[0],
        vendorName: defaultValues?.vendorName ?? "",
        isPaid: defaultValues?.isPaid ?? false,
        priceFelling: defaultValues?.priceFelling ?? "",
        tags: defaultValues?.tags ?? [],
      },
    });

  const selectedCategoryId = watch("categoryId");
  const selectedTags = watch("tags") ?? [];
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const suggestedTags = selectedCategory
    ? SUGGESTED_TAGS[selectedCategory.name] ?? []
    : [];

  const toggleTag = (tag: string) => {
    const current = selectedTags;
    setValue(
      "tags",
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    );
  };

  const onFormSubmit = (data: ExpenseFormData & { tags: string[] }) => {
    onSubmit({
      category_id: data.categoryId,
      title: data.title,
      amount: Number(data.amount),
      memo: data.memo || null,
      date: data.date || null,
      vendor_name: data.vendorName || null,
      is_paid: data.isPaid,
      price_feeling: data.priceFelling || null,
      tags: data.tags ?? [],
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      {/* Category */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          카테고리
        </label>
        <select
          {...register("categoryId", { required: true })}
          className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          항목명
        </label>
        <input
          {...register("title", { required: "항목명을 입력해주세요" })}
          placeholder="예: 웨딩홀 계약금"
          className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-error">{errors.title.message}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          금액
        </label>
        <div className="relative">
          <input
            {...register("amount", {
              required: "금액을 입력해주세요",
              min: { value: 1, message: "1원 이상 입력해주세요" },
            })}
            type="number"
            inputMode="numeric"
            placeholder="0"
            className="h-11 w-full rounded-xl border border-neutral-300 pr-8 pl-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-neutral-400">
            원
          </span>
        </div>
        {errors.amount && (
          <p className="mt-1 text-xs text-error">{errors.amount.message}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          날짜
        </label>
        <input
          {...register("date")}
          type="date"
          className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      {/* Tags */}
      {suggestedTags.length > 0 && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            태그
          </label>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                selected={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Vendor */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          업체명 (선택)
        </label>
        <input
          {...register("vendorName")}
          placeholder="예: OO웨딩홀"
          className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      {/* Price feeling */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          체감 가격 (선택)
        </label>
        <div className="flex gap-2">
          {([
            { value: "cheap", label: "저렴해요" },
            { value: "fair", label: "적당해요" },
            { value: "expensive", label: "비싸요" },
          ] as const).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                setValue(
                  "priceFelling",
                  watch("priceFelling") === option.value ? "" : option.value,
                )
              }
              className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-all ${
                watch("priceFelling") === option.value
                  ? "border-primary-500 bg-primary-50 text-primary-600"
                  : "border-neutral-200 text-neutral-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Memo */}
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

      {/* Is paid */}
      <label className="flex items-center gap-2">
        <input
          {...register("isPaid")}
          type="checkbox"
          className="h-5 w-5 rounded border-neutral-300 accent-primary-500"
        />
        <span className="text-sm text-neutral-700">결제 완료</span>
      </label>

      {/* Actions */}
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
