import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSecurity } from "@/hooks/useSecurity";
import { useAuthStore } from "@/lib/auth";
import toast from 'react-hot-toast';

interface SecurityContextType {
  sanitizeInput: (input: string) => string;
  checkRateLimit: (key: string, limit?: number, windowMs?: number) => boolean;
  generateCSRFToken: () => string;
  validateCSRFToken: (token: string) => boolean;
  checkLoginAttempts: (identifier: string) => boolean;
  recordLoginAttempt: (identifier: string, success: boolean) => void;
  validateRouteAccess: (route: string) => boolean;
  monitor: (action: string?: unknown) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user } = useAuthStore();
  const security = useSecurity();

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

  //amento de atividades suspeitas
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

    const handleContextMenu = (event:) => {
      // Desabilitar menu de contexto em áreas sensíveis
      const target = event.target as HTMLElement;
      if (target.closest('[-sensitive="true"]')) {
        event.preventDefault();
        toast.('Menu de contexto desabilitado nesta área');
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
          (combo.f12 === undefined || combo.f12 === (event.key === 'F12')) &&
          (combo.key === undefined || combo.key.toUpperCase() === event.key.toUpperCase())
        );
      });

      if (isDangerous) {
        event.preventDefault();
        toast.('Atalho bloqueado por questões de segurança');
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

  // Proteção contra ataques de DOM
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Verificar por scripts injetados
            if (element.tagName === 'SCRIPT') {
              console.warn('🚨 Script injetado detectado e removido');
              element.remove();
            }
            
            // Verificar por atributos suspeitos
            const suspiciousAttributes = ['onclick', 'onload', 'on', 'onmouseover'];
            suspiciousAttributes.forEach(attr => {
              if (element.hasAttribute(attr)) {
                console.warn(`🚨 Atributo suspeito removido: ${attr}`);
                element.removeAttribute(attr);
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attribute: ['onclick', 'onload', 'on', 'onmouseover']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <SecurityContext.Provider value={security}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurityContext deve ser usado dentro de um SecurityProvider');
  }
  return context;
};