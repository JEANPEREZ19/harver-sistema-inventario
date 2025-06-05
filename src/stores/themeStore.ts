import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  language: 'es' | 'en';
  toggleTheme: () => void;
  setLanguage: (lang: 'es' | 'en') => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'es',
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'biblioteca-theme',
    }
  )
);