import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const code = new URL(request.url).searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Ignore cookie errors in edge cases
          }
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  // Ensure profile exists
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

  // Has couple → home, no couple → onboarding
  if (profile?.couple_id) {
    return NextResponse.redirect(`${origin}/home`);
  }

  return NextResponse.redirect(`${origin}/onboarding`);
}
