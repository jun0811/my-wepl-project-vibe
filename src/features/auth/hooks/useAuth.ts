"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/lib/supabase";
import { signInWithKakao, signOut, getProfile, updateNickname } from "../api/auth";

const AUTH_KEYS = {
  profile: ["auth", "profile"] as const,
};

function useSessionReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(() => setReady(true));
  }, []);
  return ready;
}

export function useProfile() {
  const sessionReady = useSessionReady();
  const query = useQuery({
    queryKey: AUTH_KEYS.profile,
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: sessionReady,
  });
  return {
    ...query,
    isLoading: !sessionReady || query.isLoading,
  };
}

export function useSignIn() {
  return useMutation({
    mutationFn: signInWithKakao,
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function useUpdateNickname() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNickname,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.profile });
    },
  });
}

export function useIsAuthenticated() {
  const { data: profile, isLoading } = useProfile();
  return {
    isAuthenticated: !!profile,
    isLoading,
    hasCouple: !!profile?.couple_id,
    profile,
  };
}
