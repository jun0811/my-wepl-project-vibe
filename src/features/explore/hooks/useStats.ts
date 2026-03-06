"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategoryAverages } from "../api/stats";

export function useCategoryAverages(region?: string) {
  return useQuery({
    queryKey: ["stats", "categoryAverages", region ?? "all"],
    queryFn: () => getCategoryAverages(region),
    staleTime: 10 * 60 * 1000, // 10 minutes - stats don't change often
  });
}
