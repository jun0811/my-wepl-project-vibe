"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CategoryAverage } from "../api/stats";

interface CostBarChartProps {
  data: CategoryAverage[];
  myExpenses?: Record<string, number>;
}

function formatAmount(value: number): string {
  if (value >= 10000) return `${Math.round(value / 10000)}만`;
  return `${value}`;
}

export function CostBarChart({ data, myExpenses }: CostBarChartProps) {
  const hasMyData = myExpenses && Object.values(myExpenses).some((v) => v > 0);

  const chartData = data.map((d) => ({
    name: d.category_name,
    평균: d.avg_amount,
    ...(hasMyData ? { "내 지출": myExpenses[d.category_name] ?? 0 } : {}),
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
          formatter={(value, name) => [`${formatAmount(Number(value))}원`, name]}
          contentStyle={{
            borderRadius: 12,
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            fontSize: 13,
            outline: "none",
          }}
          wrapperStyle={{ outline: "none" }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        <Bar dataKey="평균" fill="#E8758A" radius={[4, 4, 0, 0]} />
        {hasMyData && (
          <Bar dataKey="내 지출" fill="#4A9AB5" radius={[4, 4, 0, 0]} />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}
