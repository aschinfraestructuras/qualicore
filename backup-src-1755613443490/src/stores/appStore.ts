import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'auto';

interface AppState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'auto',
      isDark: false,
      
      setTheme: (theme: Theme) => {
        set({ theme });
        get().initializeTheme();
      },
      
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        get().initializeTheme();
      },
      
      initializeTheme: () => {
        const { theme } = get();
        let isDark = false;
        
        if (theme === 'auto') {
          // Detectar preferência do sistema
          isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
          isDark = theme === 'dark';
        }
        
        set({ isDark });
        
        // Aplicar tema ao documento
        const root = document.documentElement;
        if (isDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },
    }),
    {
      name: 'app-store',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

// Listener para mudanças automáticas do sistema
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  mediaQuery.addEventListener('change', (e) => {
    const store = useAppStore.getState();
    if (store.theme === 'auto') {
      store.initializeTheme();
    }
  });
}
