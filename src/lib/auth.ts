import { supabase } from "./supabase";
import { create } from "zustand";

interface AuthState {
  user: any | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (
    email: string,
  ) => Promise<{ success: boolean; error?: string }>;
  checkUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        set({ user: data.user, loading: false });
        return { success: true };
      }

      return { success: false, error: "Erro desconhecido no registro" };
    } catch (error: any) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        set({ user: data.user, loading: false });
        return { success: true };
      }

      return { success: false, error: "Erro desconhecido no login" };
    } catch (error: any) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Erro no logout:", error);
      }

      set({ user: null, loading: false });
    } catch (error) {
      console.error("Erro no logout:", error);
      set({ loading: false });
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ loading: true });
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      set({ loading: false });
      return { success: true };
    } catch (error: any) {
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  checkUser: async () => {
    try {
      set({ loading: true });

      // Primeiro, verificar se há uma sessão ativa
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Erro ao verificar sessão:", sessionError);
        set({ user: null, loading: false });
        return;
      }

      if (session?.user) {
        set({ user: session.user, loading: false });
      } else {
        // Se não há sessão, tentar obter usuário
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Erro ao verificar usuário:", error);
          set({ user: null, loading: false });
          return;
        }

        set({ user, loading: false });
      }

      // Configurar listener para mudanças de autenticação
      supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        set({ user: session?.user || null, loading: false });
      });
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      set({ user: null, loading: false });
    }
  },
}));

// Inicializar verificação de usuário apenas se estivermos no browser
if (typeof window !== "undefined") {
  useAuthStore.getState().checkUser();
}

export default useAuthStore;
