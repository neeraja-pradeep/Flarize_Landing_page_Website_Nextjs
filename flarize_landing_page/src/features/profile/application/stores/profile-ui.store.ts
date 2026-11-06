import { create } from 'zustand';

// Client-only UI state (Zustand). NOT server data.
interface ProfileUiState {
  selectedId: string | null;
  select: (id: string | null) => void;
}

export const useProfileUiStore = create<ProfileUiState>((set) => ({
  selectedId: null,
  select: (id) => set({ selectedId: id }),
}));
