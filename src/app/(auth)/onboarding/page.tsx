"use client";

import { Button } from "@/shared/ui";
import {
  useOnboarding,
  StepRole,
  StepWeddingDate,
  StepRegion,
  StepBudget,
  StepConfirm,
} from "@/features/onboarding";

const STEP_COMPONENTS = {
  role: StepRole,
  "wedding-date": StepWeddingDate,
  region: StepRegion,
  budget: StepBudget,
  confirm: StepConfirm,
} as const;

export default function OnboardingPage() {
  const {
    currentStep,
    progress,
    data,
    isSubmitting,
    isFirstStep,
    isLastStep,
    updateData,
    goNext,
    goBack,
    submit,
    recommendedBudget,
  } = useOnboarding();

  const canProceed = (() => {
    switch (currentStep) {
      case "role":
        return data.role !== null;
      case "wedding-date":
        return true; // optional
      case "region":
        return data.region !== null;
      case "budget":
        return data.totalBudget > 0;
      case "confirm":
        return true;
    }
  })();

  const stepProps = (() => {
    switch (currentStep) {
      case "role":
        return { value: data.role, onChange: (role: "bride" | "groom") => updateData({ role }) };
      case "wedding-date":
        return { value: data.weddingDate, onChange: (weddingDate: string) => updateData({ weddingDate }) };
      case "region":
        return { value: data.region, onChange: (region: typeof data.region) => updateData({ region }) };
      case "budget":
        return { value: data.totalBudget, recommendedBudget, onChange: (totalBudget: number) => updateData({ totalBudget }) };
      case "confirm":
        return { data };
    }
  })();

  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className="flex min-h-dvh flex-col px-6 pt-12 pb-8">
      {/* Progress bar */}
      <div className="mb-8 h-1 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-primary-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step content */}
      <div className="flex-1">
        {/* @ts-expect-error -- step props are discriminated by currentStep */}
        <StepComponent {...stepProps} />
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-6">
        {!isFirstStep && (
          <Button variant="outline" onClick={goBack} className="flex-1">
            이전
          </Button>
        )}
        <Button
          onClick={isLastStep ? submit : goNext}
          disabled={!canProceed || isSubmitting}
          fullWidth={isFirstStep}
          className={isFirstStep ? "" : "flex-1"}
        >
          {isLastStep
            ? isSubmitting
              ? "설정 중..."
              : "시작하기"
            : currentStep === "wedding-date"
              ? data.weddingDate
                ? "다음"
                : "건너뛰기"
              : "다음"}
        </Button>
      </div>
    </div>
  );
}
