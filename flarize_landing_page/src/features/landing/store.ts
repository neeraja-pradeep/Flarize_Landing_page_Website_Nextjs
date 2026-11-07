import { create } from "zustand";

export type LeadStatus = "idle" | "loading" | "success" | "error";

interface LeadUiState {
  status: LeadStatus;
  /** A form field currently has focus (hides the mobile bar so it can't cover the keyboard area). */
  isFormFocused: boolean;
  /** The user has interacted with the form at least once. */
  hasStarted: boolean;
  /** The lead form card is on screen (hides the floating buttons below the float breakpoint). */
  isFormInView: boolean;
  isPromptOpen: boolean;
  setStatus: (status: LeadStatus) => void;
  setFormFocused: (isFocused: boolean) => void;
  markStarted: () => void;
  setFormInView: (isInView: boolean) => void;
  setPromptOpen: (isOpen: boolean) => void;
}

export const useLeadUiStore = create<LeadUiState>()((set) => ({
  status: "idle",
  isFormFocused: false,
  hasStarted: false,
  isFormInView: false,
  isPromptOpen: false,
  setStatus: (status) => set({ status }),
  setFormFocused: (isFormFocused) => set({ isFormFocused }),
  markStarted: () => set({ hasStarted: true }),
  setFormInView: (isFormInView) => set({ isFormInView }),
  setPromptOpen: (isPromptOpen) => set({ isPromptOpen }),
}));
