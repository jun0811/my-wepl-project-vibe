"use client";

import { useCallback, useRef, useState } from "react";
import { Button, Chip } from "@/shared/ui";
import { formatCurrency } from "@/shared/lib/format";
import type { Category } from "@/shared/types";

interface QuickExpenseFormProps {
  categories: Category[];
  onSubmit: (data: {
    category_id: string;
    title: string;
    amount: number;
  }) => void;
  onCancel: () => void;
  onDetailMode: () => void;
  isPending?: boolean;
}

function parseRawAmount(value: string): number {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
}

export function QuickExpenseForm({
  categories,
  onSubmit,
  onDetailMode,
  isPending = false,
}: QuickExpenseFormProps) {
  const [rawAmount, setRawAmount] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [title, setTitle] = useState("");
  const amountInputRef = useRef<HTMLInputElement>(null);

  const amount = parseRawAmount(rawAmount);
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const isValid = amount > 0 && selectedCategoryId !== null;

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numeric = e.target.value.replace(/[^0-9]/g, "");
      if (numeric === "") {
        setRawAmount("");
        return;
      }
      setRawAmount(formatCurrency(Number(numeric)));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid || !selectedCategoryId) return;

      const resolvedTitle =
        title.trim() || selectedCategory?.name || "지출";

      onSubmit({
        category_id: selectedCategoryId,
        title: resolvedTitle,
        amount,
      });

      setRawAmount("");
      setSelectedCategoryId(null);
      setTitle("");
      amountInputRef.current?.focus();
    },
    [isValid, selectedCategoryId, selectedCategory, title, amount, onSubmit],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-5 pb-6">
      {/* Amount input */}
      <div className="flex flex-col items-center gap-1 pt-2">
        <div className="relative flex w-full items-center justify-center">
          <input
            ref={amountInputRef}
            type="text"
            inputMode="numeric"
            value={rawAmount}
            onChange={handleAmountChange}
            placeholder="0"
            autoFocus
            className="w-full bg-transparent text-center text-2xl font-bold text-neutral-900 outline-none placeholder:text-neutral-300"
          />
        </div>
        <span className="text-sm text-neutral-400">원</span>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            size="sm"
            selected={selectedCategoryId === category.id}
            onClick={() => setSelectedCategoryId(category.id)}
          />
        ))}
      </div>

      {/* Title (optional) */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="메모 (선택)"
        className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-primary-500"
      />

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          fullWidth
          onClick={onDetailMode}
          disabled={isPending}
        >
          상세 입력
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={!isValid || isPending}
        >
          {isPending ? "등록 중..." : "등록"}
        </Button>
      </div>
    </form>
  );
}
