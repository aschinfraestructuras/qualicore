import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuthStore } from '../lib/auth';
import toast from 'react-hot-toast';

interface SecurityContextType {
  checkRateLimit: (action: string, limit?: number) => boolean;
  sanitizeInput: (input: string) => string;
  generateCSRFToken: () => string;
  validateCSRFToken: (token: string) => boolean;
  checkLoginAttempts: (identifier: string) => boolean;
  recordLoginAttempt: (identifier: string, success: boolean) => void;
  validateRouteAccess: (route: string) => boolean;
  monitor: (action: string, data?: unknown) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user } = useAuthStore();

  // Proteção global contra ataques
  useEffect(() => {
    // Proteção contra clickjacking
    if (window.self !== window.top) {
      window.top.location = window.self.location;
    }

    // Proteção contra ataques de injeção
    const originalEval = window.eval;
    window.eval = function(code: string) {
      console.warn('🚨 Tentativa de uso de eval() bloqueada:', code);
      throw new Error('eval() não é permitido por questões de segurança');
    };

    // Proteção contra manipulação do localStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key: string, value: string) {
      if (key.includes('script') || key.includes('javascript')) {
        console.warn('🚨 Tentativa de injeção no localStorage bloqueada');
        return;
      }
      originalSetItem.call(this, key, value);
    };

    // Proteção contra ataques de timing
    const originalFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input.toString();
      
      // Verificar URLs suspeitas
      if (url.includes('javascript:') || url.includes(':text/html')) {
        console.warn('🚨 Tentativa de fetch para URL suspeita bloqueada:', url);
        throw new Error('URL não permitida por questões de segurança');
      }
      
      return originalFetch.call(this, input, init);
    };

    return () => {
      window.eval = originalEval;
      localStorage.setItem = originalSetItem;
      window.fetch = originalFetch;
    };
  }, []);

  // Monitoramento de atividades suspeitas
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (user) {
        // Log de saída para auditoria
        console.log('👤 Usuário saiu da aplicação:', user.email);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && user) {
        console.log('👤 Usuário mudou para outra aba:', user.email);
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      // Desabilitar menu de contexto em áreas sensíveis
      const target = event.target as HTMLElement;
      if (target.closest('[data-sensitive="true"]')) {
        event.preventDefault();
        toast.error('Menu de contexto desabilitado nesta área');
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // Bloquear atalhos perigosos
      const dangerousCombos = [
        { ctrl: true, shift: true, key: 'I' }, // DevTools
        { ctrl: true, shift: true, key: 'J' }, // Console
        { ctrl: true, shift: true, key: 'C' }, // Console
        { f12: true }, // F12
        { ctrl: true, key: 'U' }, // View Source
      ];

      const isDangerous = dangerousCombos.some(combo => {
        return (
          (combo.ctrl === undefined || combo.ctrl === event.ctrlKey) &&
          (combo.shift === undefined || combo.shift === event.shiftKey) &&
          (combo.key === undefined || combo.key === event.key) &&
          (combo.f12 === undefined || combo.f12 === (event.key === 'F12'))
        );
      });

      if (isDangerous) {
        event.preventDefault();
        toast.error('Atalho bloqueado por questões de segurança');
      }
    };

    // Adicionar event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [user]);

  // Context value
  const contextValue: SecurityContextType = {
    checkRateLimit: (action: string, limit = 10) => {
      const key = `rate_limit_${action}`;
      const attempts = parseInt(localStorage.getItem(key) || '0');
      if (attempts >= limit) {
        return false;
      }
      localStorage.setItem(key, (attempts + 1).toString());
      return true;
    },
    sanitizeInput: (input: string) => {
      return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    },
    generateCSRFToken: () => {
      const token = Math.random().toString(36).substring(2);
      sessionStorage.setItem('csrf_token', token);
      return token;
    },
    validateCSRFToken: (token: string) => {
      const storedToken = sessionStorage.getItem('csrf_token');
      return token === storedToken;
    },
    checkLoginAttempts: (identifier: string) => {
      const key = `login_attempts_${identifier}`;
      const attempts = parseInt(localStorage.getItem(key) || '0');
      return attempts < 5;
    },
    recordLoginAttempt: (identifier: string, success: boolean) => {
      const key = `login_attempts_${identifier}`;
      if (success) {
        localStorage.removeItem(key);
      } else {
        const attempts = parseInt(localStorage.getItem(key) || '0');
        localStorage.setItem(key, (attempts + 1).toString());
      }
    },
    validateRouteAccess: (route: string) => {
      // Implementar lógica de validação de rotas
      return true;
    },
    monitor: (action: string, data?: unknown) => {
      console.log('🔒 Security Monitor:', action, data);
    },
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};