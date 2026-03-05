import { create } from "zustand";

interface UIState {
  isBottomSheetOpen: boolean;
  bottomSheetContent: string | null;
  toastMessage: string | null;

  openBottomSheet: (content?: string) => void;
  closeBottomSheet: () => void;
  showToast: (message: string) => void;
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
  showToast: (message) => set({ toastMessage: message }),
  hideToast: () => set({ toastMessage: null }),
}));
