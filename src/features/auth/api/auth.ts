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

  const { data } = await supabase
    .from("profiles")
    .select("*, couples(*)")
    .eq("id", user.id)
    .single<ProfileWithCouple>();

  return data;
}
