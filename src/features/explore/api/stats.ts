import { createClient } from "@/shared/lib/supabase";

export interface CategoryAverage {
  region: string | null;
  category_name: string;
  data_count: number;
  avg_amount: number;
  median_amount: number;
  min_amount: number;
  max_amount: number;
  p25_amount: number;
  p75_amount: number;
}

export async function getCategoryAverages(region?: string): Promise<CategoryAverage[]> {
  const supabase = createClient();

  // Use raw query on anonymous_stats since view might not be available
  let query = supabase
    .from("anonymous_stats")
    .select("region, category_name, amount");

  if (region) {
    query = query.eq("region", region);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Aggregate in client (since we can't use the view directly via Supabase client)
  const groups = (data ?? []).reduce<
    Record<string, { amounts: number[]; region: string | null }>
  >((acc, row) => {
    const key = `${row.region}__${row.category_name}`;
    if (!acc[key]) {
      acc[key] = { amounts: [], region: row.region };
    }
    acc[key].amounts.push(row.amount);
    return acc;
  }, {});

  return Object.entries(groups)
    .filter(([, group]) => group.amounts.length >= 10) // k-anonymity
    .map(([key, group]) => {
      const sorted = group.amounts.toSorted((a, b) => a - b);
      const len = sorted.length;
      const percentile = (p: number) => sorted[Math.floor(len * p)] ?? 0;

      return {
        region: group.region,
        category_name: key.split("__")[1],
        data_count: len,
        avg_amount: Math.round(sorted.reduce((s, v) => s + v, 0) / len),
        median_amount: percentile(0.5),
        min_amount: sorted[0],
        max_amount: sorted[len - 1],
        p25_amount: percentile(0.25),
        p75_amount: percentile(0.75),
      };
    });
}
