"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CategoryAverage } from "../api/stats";

interface CostBarChartProps {
  data: CategoryAverage[];
}

function formatAmount(value: number): string {
  if (value >= 10000) return `${Math.round(value / 10000)}만`;
  return `${value}`;
}

export function CostBarChart({ data }: CostBarChartProps) {
  const chartData = data.map((d) => ({
    name: d.category_name,
    평균: d.avg_amount,
    중앙값: d.median_amount,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 0, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#8E8E8E" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={formatAmount}
          tick={{ fontSize: 11, fill: "#8E8E8E" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          formatter={(value) => [`${formatAmount(Number(value))}원`]}
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #f0f0f0",
            fontSize: 13,
          }}
        />
        <Bar dataKey="평균" fill="#E8758A" radius={[4, 4, 0, 0]} />
        <Bar dataKey="중앙값" fill="#4A9AB5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
