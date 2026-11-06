import { create } from 'zustand';

// Client-only UI state (Zustand). NOT server data.
interface AuthUiState {
  selectedId: string | null;
  select: (id: string | null) => void;
}

export const useAuthUiStore = create<AuthUiState>((set) => ({
  selectedId: null,
  select: (id) => set({ selectedId: id }),
}));
