"use client";

interface StepWeddingDateProps {
  value: string;
  onChange: (date: string) => void;
}

export function StepWeddingDate({ value, onChange }: StepWeddingDateProps) {
  return (
    <div>
      <h2 className="mb-2 text-xl font-bold text-neutral-900">
        결혼식은 언제인가요?
      </h2>
      <p className="mb-8 text-sm text-neutral-500">
        아직 정해지지 않았다면 건너뛰어도 괜찮아요
      </p>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={new Date().toISOString().split("T")[0]}
        className="h-12 w-full rounded-xl border border-neutral-300 px-4 text-base text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
      />
    </div>
  );
}
