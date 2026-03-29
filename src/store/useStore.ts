import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProjectIdea, UserPreferences } from '../types';

interface AppState {
  preferences: UserPreferences | null;
  setPreferences: (prefs: UserPreferences) => void;
  currentIdeas: ProjectIdea[];
  setCurrentIdeas: (ideas: ProjectIdea[]) => void;
  savedIdeas: ProjectIdea[];
  saveIdea: (idea: ProjectIdea) => void;
  removeSavedIdea: (id: string) => void;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  ideasGeneratedCount: number;
  incrementIdeasGenerated: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      preferences: null,
      setPreferences: (prefs) => set({ preferences: prefs }),
      currentIdeas: [],
      setCurrentIdeas: (ideas) => set({ currentIdeas: ideas }),
      savedIdeas: [],
      saveIdea: (idea) =>
        set((state) => {
          if (state.savedIdeas.some((i) => i.id === idea.id)) return state;
          return { savedIdeas: [...state.savedIdeas, idea] };
        }),
      removeSavedIdea: (id) =>
        set((state) => ({
          savedIdeas: state.savedIdeas.filter((i) => i.id !== id),
        })),
      isFocusMode: false,
      toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),
      ideasGeneratedCount: 0,
      incrementIdeasGenerated: () =>
        set((state) => ({ ideasGeneratedCount: state.ideasGeneratedCount + 1 })),
    }),
    {
      name: 'lofi-idea-generator-storage',
      partialize: (state) => ({
        savedIdeas: state.savedIdeas,
        ideasGeneratedCount: state.ideasGeneratedCount,
      }),
    }
  )
);
