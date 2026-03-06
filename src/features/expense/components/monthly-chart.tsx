"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Expense } from "@/shared/types";

interface MonthlyChartProps {
  expenses: Expense[];
}

function getLast6Months(): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    months.push(`${yyyy}-${mm}`);
  }
  return months;
}

function formatMan(value: number): string {
  if (value === 0) return "0";
  return `${Math.round(value / 10000)}만`;
}

export function MonthlyChart({ expenses }: MonthlyChartProps) {
  const data = useMemo(() => {
    const months = getLast6Months();

    const sumByMonth = expenses.reduce<Record<string, number>>((acc, exp) => {
      if (!exp.date) return acc;
      const key = exp.date.slice(0, 7);
      acc[key] = (acc[key] ?? 0) + exp.amount;
      return acc;
    }, {});

    return months.map((month) => ({
      month,
      label: `${parseInt(month.split("-")[1], 10)}월`,
      amount: sumByMonth[month] ?? 0,
    }));
  }, [expenses]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-primary-400)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-primary-400)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#9ca3af" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          tickFormatter={formatMan}
        />
        <Tooltip
          formatter={(value) => [`${formatMan(Number(value))}원`, "지출"]}
          labelFormatter={(label) => String(label)}
          contentStyle={{
            borderRadius: 8,
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            fontSize: 12,
            outline: "none",
          }}
          wrapperStyle={{ outline: "none" }}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="var(--color-primary-400)"
          strokeWidth={2}
          fill="url(#colorAmount)"
          activeDot={{ r: 5, stroke: "var(--color-primary-400)", strokeWidth: 2, fill: "#fff", style: { outline: "none" } }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
