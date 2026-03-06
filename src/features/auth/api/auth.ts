import { createClient } from "@/shared/lib/supabase";
import type { Provider } from "@supabase/supabase-js";
import type { Profile, Couple } from "@/shared/types";

export type ProfileWithCouple = Profile & { couples: Couple | null };

export async function signInWithKakao() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao" as Provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getProfile(): Promise<ProfileWithCouple | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  let { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .maybeSingle<Profile>();

  // Auto-create profile if trigger didn't fire
  if (!profile) {
    const meta = user.user_metadata ?? {};
    const { data: created } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        nickname: meta.name ?? meta.full_name ?? null,
        avatar_url: meta.avatar_url ?? null,
      })
      .select()
      .single<Profile>();
    profile = created;
  }

  if (!profile) return null;

  let couple: Couple | null = null;
  if (profile.couple_id) {
    const { data } = await supabase
      .from("couples")
      .select()
      .eq("id", profile.couple_id)
      .single<Couple>();
    couple = data;
  }

  return { ...profile, couples: couple };
}

export async function updateNickname(nickname: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({ nickname })
    .eq("id", user.id);

  if (error) throw error;
}
