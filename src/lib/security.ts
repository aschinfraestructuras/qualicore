export class SecurityService {
  // Rate limiting com localStorage (gratuito)
  static checkRateLimit(action: string, limit: number = 10): boolean {
    const key = `rate_limit_${action}`;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutos
    
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    const recentAttempts = attempts.filter((time: number) => now - time < windowMs);
    
    if (recentAttempts.length >= limit) {
      return false;
    }
    
    recentAttempts.push(now);
    localStorage.setItem(key, JSON.stringify(recentAttempts));
    return true;
  }

  // XSS Protection (gratuito)
  static sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // CSRF Protection (gratuito)
  static generateCSRFToken(): string {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem('csrf_token', token);
    return token;
  }

  static validateCSRFToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    return token === storedToken;
  }

  // Session timeout (gratuito)
  static setupSessionTimeout(timeoutMinutes: number = 30): void {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Logout automático
        localStorage.removeItem('user');
        window.location.href = '/login';
      }, timeoutMinutes * 60 * 1000);
    };

    // Reset timeout on user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });

    resetTimeout();
  }
}
