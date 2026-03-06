"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/lib/supabase";
import { DEFAULT_CATEGORIES } from "@/shared/types";
import type { Region, Couple } from "@/shared/types";

export type OnboardingStep = "role" | "wedding-date" | "region" | "budget" | "confirm";

const STEPS: OnboardingStep[] = ["role", "wedding-date", "region", "budget", "confirm"];

interface OnboardingData {
  role: "bride" | "groom" | null;
  weddingDate: string;
  region: Region | null;
  totalBudget: number;
}

const REGIONAL_BUDGET_DEFAULTS: Record<string, number> = {
  "서울": 35000000,
  "경기/인천": 30000000,
  "부산/경남": 28000000,
  "대구/경북": 25000000,
  "대전/충청": 24000000,
  "광주/전라": 23000000,
  "강원": 22000000,
  "제주": 23000000,
};

export function useOnboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("role");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    role: null,
    weddingDate: "",
    region: null,
    totalBudget: 30000000,
  });

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  const updateData = useCallback((partial: Partial<OnboardingData>) => {
    setData((prev) => {
      const next = { ...prev, ...partial };
      // Auto-set budget recommendation when region changes
      if (partial.region && !prev.totalBudget) {
        next.totalBudget = REGIONAL_BUDGET_DEFAULTS[partial.region] ?? 30000000;
      }
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      // Auto-set recommended budget when entering budget step
      if (STEPS[nextIndex] === "budget" && data.region) {
        setData((prev) => ({
          ...prev,
          totalBudget: REGIONAL_BUDGET_DEFAULTS[data.region!] ?? 30000000,
        }));
      }
      setCurrentStep(STEPS[nextIndex]);
    }
  }, [stepIndex, data.region]);

  const goBack = useCallback(() => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  }, [stepIndex]);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create couple
      const { data: couple, error: coupleError } = await supabase
        .from("couples")
        .insert({
          wedding_date: data.weddingDate || null,
          region: data.region,
          total_budget: data.totalBudget,
        })
        .select()
        .single<Couple>();

      if (coupleError || !couple) throw coupleError ?? new Error("Failed to create couple");

      // Link profile to couple
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ couple_id: couple.id, role: data.role })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Create default categories
      const categories = DEFAULT_CATEGORIES.map((cat) => ({
        couple_id: couple.id,
        name: cat.name,
        icon: cat.icon,
        sort_order: cat.sort_order,
        is_default: true,
        budget_amount: 0,
      }));

      const { error: catError } = await supabase
        .from("categories")
        .insert(categories);

      if (catError) throw catError;

      router.push("/home");
    } catch (error) {
      console.error("Onboarding failed:", error);
      setIsSubmitting(false);
    }
  }, [data, router]);

  return {
    currentStep,
    stepIndex,
    progress,
    data,
    isSubmitting,
    isFirstStep: stepIndex === 0,
    isLastStep: currentStep === "confirm",
    updateData,
    goNext,
    goBack,
    submit,
    recommendedBudget: data.region ? REGIONAL_BUDGET_DEFAULTS[data.region] : null,
  };
}
