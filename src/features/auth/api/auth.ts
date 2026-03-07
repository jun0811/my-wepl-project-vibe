import { createClient } from "@/shared/lib/supabase";
import type { Provider } from "@supabase/supabase-js";
import type { Profile, Couple } from "@/shared/types";

export type PartnerProfile = Pick<Profile, "id" | "nickname" | "avatar_url" | "role">;
export type ProfileWithCouple = Profile & { couples: Couple | null; partner: PartnerProfile | null };

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
  let partner: PartnerProfile | null = null;

  if (profile.couple_id) {
    const [coupleRes, partnerRes] = await Promise.all([
      supabase
        .from("couples")
        .select()
        .eq("id", profile.couple_id)
        .single<Couple>(),
      supabase
        .from("profiles")
        .select("id, nickname, avatar_url, role")
        .eq("couple_id", profile.couple_id)
        .neq("id", user.id)
        .maybeSingle<PartnerProfile>(),
    ]);
    couple = coupleRes.data;
    partner = partnerRes.data;
  }

  return { ...profile, couples: couple, partner };
}

export async function deleteAccount(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc("delete_user_account");
  if (error) throw error;
  await supabase.auth.signOut();
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
