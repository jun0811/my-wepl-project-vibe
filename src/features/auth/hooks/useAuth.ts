"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signInWithKakao, signOut, getProfile } from "../api/auth";

const AUTH_KEYS = {
  profile: ["auth", "profile"] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: AUTH_KEYS.profile,
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
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

export function useIsAuthenticated() {
  const { data: profile, isLoading } = useProfile();
  return {
    isAuthenticated: !!profile,
    isLoading,
    hasCouple: !!profile?.couple_id,
    profile,
  };
}
