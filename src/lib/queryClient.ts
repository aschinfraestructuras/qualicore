import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 10 minutos
      staleTime: 10 * 60 * 1000,
      // Manter cache por 30 minutos
      gcTime: 30 * 60 * 1000,
      // Tentativas de retry
      retry: 3,
      // Não refetch ao focar janela
      refetchOnWindowFocus: false,
      // Não refetch ao reconectar
      refetchOnReconnect: false,
      // Refetch apenas se dados estiverem stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations apenas 1 vez
      retry: 1,
    },
  },
});

// Hooks otimizados para diferentes tipos de dados
export const useOptimizedQuery = (key: string[], queryFn: () => Promise<any>, options = {}) => {
  return {
    queryKey: key,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutos para dados que mudam pouco
    gcTime: 15 * 60 * 1000, // 15 minutos de cache
    ...options,
  };
};

// Hook para dados que mudam frequentemente
export const useFrequentQuery = (key: string[], queryFn: () => Promise<any>, options = {}) => {
  return {
    queryKey: key,
    queryFn,
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos de cache
    refetchInterval: 60 * 1000, // Refetch a cada minuto
    ...options,
  };
};

// Hook para dados estáticos
export const useStaticQuery = (key: string[], queryFn: () => Promise<any>, options = {}) => {
  return {
    queryKey: key,
    queryFn,
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 24 * 60 * 60 * 1000, // 24 horas de cache
    ...options,
  };
};
