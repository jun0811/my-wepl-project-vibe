import { NextResponse } from "next/server";
import { createServerSupabase } from "@/shared/lib/supabase-server";

const DEFAULT_CATEGORIES = [
  { name: "웨딩홀", icon: "building", sort_order: 0 },
  { name: "스튜디오", icon: "camera", sort_order: 1 },
  { name: "드레스/턱시도", icon: "shirt", sort_order: 2 },
  { name: "예물/예단", icon: "gem", sort_order: 3 },
  { name: "혼수", icon: "sofa", sort_order: 4 },
  { name: "신혼여행", icon: "plane", sort_order: 5 },
  { name: "기타", icon: "plus", sort_order: 6 },
];

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const code = new URL(request.url).searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  // Check if profile exists, create if not
  let { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .maybeSingle<{ id: string; couple_id: string | null }>();

  if (!profile) {
    const meta = user.user_metadata ?? {};
    await supabase.from("profiles").upsert({
      id: user.id,
      nickname: meta.name ?? meta.full_name ?? null,
      avatar_url: meta.avatar_url ?? null,
    });

    const { data } = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id)
      .maybeSingle<{ id: string; couple_id: string | null }>();
    profile = data;
  }

  // Already has couple → go home
  if (profile?.couple_id) {
    return NextResponse.redirect(`${origin}/home`);
  }

  // First login: auto-create couple + default categories
  const { data: couple } = await supabase
    .from("couples")
    .insert({ total_budget: 30000000 })
    .select()
    .single<{ id: string }>();

  if (couple) {
    // Link profile to couple
    await supabase
      .from("profiles")
      .update({ couple_id: couple.id })
      .eq("id", user.id);

    // Create default categories
    await supabase.from("categories").insert(
      DEFAULT_CATEGORIES.map((cat) => ({
        couple_id: couple.id,
        name: cat.name,
        icon: cat.icon,
        sort_order: cat.sort_order,
        is_default: true,
        budget_amount: 0,
      })),
    );
  }

  return NextResponse.redirect(`${origin}/home`);
}
