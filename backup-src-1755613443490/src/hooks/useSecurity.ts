import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import toast from 'react-hot-toast';

interface SecurityConfig {
  enableRateLimiting: boolean;
  enableSSProtection: boolean;
  enableCSRFProtection: boolean;
  enableSessionTimeout: boolean;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
}

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  enableRateLimiting: true,
  enableSSProtection: true,
  enableCSRFProtection: true,
  enableSessionTimeout: true,
  sessionTimeoutMinutes: 30,
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 15
};

export const useSecurity = (config: Partial<SecurityConfig> = {}) => {
  const securityConfig = { ...DEFAULT_SECURITY_CONFIG, ...config };
  const { user, logout } = useAuthStore();
  const navigate =();

  // Proteção contraSS
  const sanitizeInput =((input: string): string => {
    if (!securityConfig.enableSSProtection) return input;
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }, [securityConfig.enableSSProtection]);

  // Rate Limiting
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  
  const checkRateLimit =((key: string, limit: number = 10, windowMs: number = 60000): boolean => {
    if (!securityConfig.enableRateLimiting) return true;
    
    const now = Date.now();
    const record = rateLimitMap.get(key);
    
    if (!record || now > record.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= limit) {
      return false;
    }
    
    record.count++;
    return true;
  }, [securityConfig.enableRateLimiting]);

  // Proteção contra CSRF
  const generateCSRFToken =((): string => {
    if (!securityConfig.enableCSRFProtection) return '';
    
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('csrf_token', token);
    return token;
  }, [securityConfig.enableCSRFProtection]);

  const validateCSRFToken =((token: string): boolean => {
    if (!securityConfig.enableCSRFProtection) return true;
    
    const storedToken = sessionStorage.getItem('csrf_token');
    return token === storedToken;
  }, [securityConfig.enableCSRFProtection]);

  // Timeout de sessão
  useEffect(() => {
    if (!securityConfig.enableSessionTimeout || !user) return;
    
         let timeoutId: ReturnType<typeof setTimeout>;
    
    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);
      
             timeoutId = setTimeout(() => {
         toast.('Sessão expirada. Faça login novamente.');
         logout();
         navigate('/login');
       }, securityConfig.sessionTimeoutMinutes * 60 * 1000) as any;
    };
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handle= () => {
      resetTimeout();
    };
    
    events.forEach(event => {
      document.addEventListener(event, handle true);
    });
    
    resetTimeout();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => {
        document.removeEventListener(event, handle true);
      });
    };
  }, [user, securityConfig.enableSessionTimeout, securityConfig.sessionTimeoutMinutes, logout, navigate]);

  // Proteção contra ataques de força bruta
  const loginAttempts = new Map<string, { count: number; lockoutUntil: number }>();
  
  const checkLoginAttempts =((identifier: string): boolean => {
    const now = Date.now();
    const record = loginAttempts.get(identifier);
    
    if (record && now < record.lockoutUntil) {
      const remainingMinutes = Math.ceil((record.lockoutUntil - now) / 60000);
      toast.(`Conta bloqueada. Tente novamente em ${remainingMinutes} minutos.`);
      return false;
    }
    
    if (record && now >= record.lockoutUntil) {
      loginAttempts.delete(identifier);
    }
    
    return true;
  }, []);

  const recordLoginAttempt =((identifier: string, success: boolean) => {
    if (success) {
      loginAttempts.delete(identifier);
      return;
    }
    
    const record = loginAttempts.get(identifier) || { count: 0, lockoutUntil: 0 };
    record.count++;
    
    if (record.count >= securityConfig.maxLoginAttempts) {
      record.lockoutUntil = Date.now() + (securityConfig.lockoutDurationMinutes * 60 * 1000);
      toast.(`Muitas tentativas de login. Conta bloqueada por ${securityConfig.lockoutDurationMinutes} minutos.`);
    }
    
    loginAttempts.set(identifier, record);
  }, [securityConfig.maxLoginAttempts, securityConfig.lockoutDurationMinutes]);

  // Proteção contra navegação não autorizada
  const validateRouteAccess =((route: string): boolean => {
    if (!user) {
      navigate('/login');
      return false;
    }
    
    // Adicionar validações específicas por rota aqui
    const protectedRoutes = ['/dashboard', '/admin', '/settings'];
    const isProtectedRoute = protectedRoutes.some(protectedRoute => 
      route.startsWith(protectedRoute)
    );
    
    if (isProtectedRoute && !user) {
      toast.('Acesso negado. Faça login para continuar.');
      navigate('/login');
      return false;
    }
    
    return true;
  }, [user, navigate]);

  //amento de atividades suspeitas
  const monitor=((action: string?: unknown) => {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /document\./i
    ];
    
    const isSuspicious = suspiciousPatterns.some(pattern => 
      pattern.test(JSON.stringify(|| ''))
    );
    
    if (isSuspicious) {
      console.warn('🚨 Atividade suspeita detectada:', { action});
      toast.('Atividade suspeita detectada. Sua sessão foi encerrada.');
      logout();
      navigate('/login');
    }
  }, [logout, navigate]);

  return {
    sanitizeInput,
    checkRateLimit,
    generateCSRFToken,
    validateCSRFToken,
    checkLoginAttempts,
    recordLoginAttempt,
    validateRouteAccess,
    monitor
    securityConfig
  };
};