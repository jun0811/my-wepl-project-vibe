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

  // Use DB view with k-anonymity (>= 10) built in, no raw data exposure
  let query = supabase
    .from("category_averages")
    .select("region, category_name, data_count, avg_amount, median_amount, min_amount, max_amount, p25_amount, p75_amount");

  if (region) {
    query = query.eq("region", region);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []) as CategoryAverage[];
}
