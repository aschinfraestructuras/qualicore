// Sistema de Rate Limiting para segurança

interface RateLimitConfig {
  windowMs: number; // Janela de tempo em ms
  maxRequests: number; // Máximo de requests por janela
  keyGenerator?: (req: any) => string; // Gerador de chave
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private static limits = new Map<string, RateLimitEntry>();
  private static config: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 100, // 100 requests por 15 minutos
  };

  // Configurar rate limiting
  static configure(config: Partial<RateLimitConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Verificar se request está dentro do limite
  static checkLimit(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry || now > entry.resetTime) {
      // Reset ou nova entrada
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs,
      };
    }

    if (entry.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Incrementar contador
    entry.count++;
    this.limits.set(key, entry);

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  // Limpar entradas expiradas
  static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }

  // Obter estatísticas
  static getStats(): { totalKeys: number; totalRequests: number } {
    let totalRequests = 0;
    for (const entry of this.limits.values()) {
      totalRequests += entry.count;
    }

    return {
      totalKeys: this.limits.size,
      totalRequests,
    };
  }
}

// Rate limiting por IP
export class IPRateLimiter {
  private static ipLimits = new Map<string, RateLimitEntry>();

  static checkIPLimit(ip: string): boolean {
    const result = RateLimiter.checkLimit(`ip:${ip}`);
    return result.allowed;
  }

  static getIPStats(ip: string): { remaining: number; resetTime: number } {
    const result = RateLimiter.checkLimit(`ip:${ip}`);
    return {
      remaining: result.remaining,
      resetTime: result.resetTime,
    };
  }
}

// Rate limiting por utilizador
export class UserRateLimiter {
  private static userLimits = new Map<string, RateLimitEntry>();

  static checkUserLimit(userId: string): boolean {
    const result = RateLimiter.checkLimit(`user:${userId}`);
    return result.allowed;
  }

  static getUserStats(userId: string): { remaining: number; resetTime: number } {
    const result = RateLimiter.checkLimit(`user:${userId}`);
    return {
      remaining: result.remaining,
      resetTime: result.resetTime,
    };
  }
}

// Limpeza automática a cada 5 minutos
setInterval(() => {
  RateLimiter.cleanup();
}, 5 * 60 * 1000);
