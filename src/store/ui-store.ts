import { create } from "zustand";

type ToastVariant = "success" | "error" | "info";

interface ToastMessage {
  message: string;
  variant: ToastVariant;
}

interface UIState {
  isBottomSheetOpen: boolean;
  bottomSheetContent: string | null;
  toastMessage: ToastMessage | null;

  openBottomSheet: (content?: string) => void;
  closeBottomSheet: () => void;
  showToast: (message: string, variant?: ToastVariant) => void;
  hideToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isBottomSheetOpen: false,
  bottomSheetContent: null,
  toastMessage: null,

  openBottomSheet: (content) =>
    set({ isBottomSheetOpen: true, bottomSheetContent: content ?? null }),
  closeBottomSheet: () =>
    set({ isBottomSheetOpen: false, bottomSheetContent: null }),
  showToast: (message, variant = "info") =>
    set({ toastMessage: { message, variant } }),
  hideToast: () => set({ toastMessage: null }),
}));
