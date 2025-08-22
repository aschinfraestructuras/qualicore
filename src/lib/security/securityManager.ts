// Gestor Central de Segurança

import { RateLimiter, IPRateLimiter, UserRateLimiter } from './rateLimiter';
import { AuditLogger } from './auditLogger';

interface SecurityConfig {
  rateLimitEnabled: boolean;
  auditLogEnabled: boolean;
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  blockedIPs: string[];
  allowedIPs: string[];
}

export class SecurityManager {
  private static config: SecurityConfig = {
    rateLimitEnabled: true,
    auditLogEnabled: true,
    maxRequestsPerMinute: 60,
    maxRequestsPerHour: 1000,
    blockedIPs: [],
    allowedIPs: [],
  };

  // Configurar segurança
  static configure(config: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Configurar rate limiting
    RateLimiter.configure({
      windowMs: 60 * 1000, // 1 minuto
      maxRequests: this.config.maxRequestsPerMinute,
    });
  }

  // Verificar segurança de request
  static async checkRequest(
    userId: string,
    userEmail: string,
    action: string,
    resource: string,
    ipAddress?: string
  ): Promise<{ allowed: boolean; reason?: string; remaining?: number }> {
    try {
      // Verificar IP bloqueado
      if (ipAddress && this.config.blockedIPs.includes(ipAddress)) {
        this.logSecurityEvent(userId, userEmail, 'BLOCKED_IP', 'SECURITY', { ipAddress });
        return { allowed: false, reason: 'IP bloqueado' };
      }

      // Verificar rate limiting por utilizador
      if (this.config.rateLimitEnabled) {
        const userLimit = UserRateLimiter.checkUserLimit(userId);
        if (!userLimit) {
          this.logSecurityEvent(userId, userEmail, 'RATE_LIMIT_EXCEEDED', 'SECURITY', { action, resource });
          return { allowed: false, reason: 'Limite de requests excedido' };
        }
      }

      // Log de acesso
      if (this.config.auditLogEnabled) {
        AuditLogger.logAccess(userId, userEmail, resource);
      }

      return { allowed: true };
    } catch (error) {
      console.error('Erro na verificação de segurança:', error);
      return { allowed: false, reason: 'Erro interno de segurança' };
    }
  }

  // Verificar segurança de ação
  static async checkAction(
    userId: string,
    userEmail: string,
    action: string,
    resource: string,
    resourceId?: string,
    details?: any
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Verificar permissões básicas
      const hasPermission = await this.checkPermission(userId, action, resource);
      if (!hasPermission) {
        this.logSecurityEvent(userId, userEmail, 'PERMISSION_DENIED', 'SECURITY', { action, resource, resourceId });
        return { allowed: false, reason: 'Permissão negada' };
      }

      // Log de ação
      if (this.config.auditLogEnabled) {
        switch (action) {
          case 'CREATE':
            AuditLogger.logCreate(userId, userEmail, resource, resourceId!, details);
            break;
          case 'UPDATE':
            AuditLogger.logUpdate(userId, userEmail, resource, resourceId!, details);
            break;
          case 'DELETE':
            AuditLogger.logDelete(userId, userEmail, resource, resourceId!);
            break;
          case 'EXPORT':
            AuditLogger.logExport(userId, userEmail, resource, details?.format || 'unknown', details?.filters);
            break;
          default:
            AuditLogger.log(userId, userEmail, action, resource, details);
        }
      }

      return { allowed: true };
    } catch (error) {
      console.error('Erro na verificação de ação:', error);
      return { allowed: false, reason: 'Erro interno de segurança' };
    }
  }

  // Verificar login
  static async checkLogin(
    userEmail: string,
    ipAddress?: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Verificar IP bloqueado
      if (ipAddress && this.config.blockedIPs.includes(ipAddress)) {
        return { allowed: false, reason: 'IP bloqueado' };
      }

      // Verificar rate limiting por IP
      if (this.config.rateLimitEnabled && ipAddress) {
        const ipLimit = IPRateLimiter.checkIPLimit(ipAddress);
        if (!ipLimit) {
          return { allowed: false, reason: 'Muitas tentativas de login' };
        }
      }

      return { allowed: true };
    } catch (error) {
      console.error('Erro na verificação de login:', error);
      return { allowed: false, reason: 'Erro interno de segurança' };
    }
  }

  // Log de evento de segurança
  static logSecurityEvent(
    userId: string,
    userEmail: string,
    event: string,
    category: string,
    details: any
  ): void {
    if (this.config.auditLogEnabled) {
      AuditLogger.log(userId, userEmail, event, category, details, false);
    }
  }

  // Adicionar IP à lista de bloqueados
  static blockIP(ipAddress: string, reason: string): void {
    if (!this.config.blockedIPs.includes(ipAddress)) {
      this.config.blockedIPs.push(ipAddress);
      console.log(`IP ${ipAddress} bloqueado: ${reason}`);
    }
  }

  // Remover IP da lista de bloqueados
  static unblockIP(ipAddress: string): void {
    this.config.blockedIPs = this.config.blockedIPs.filter(ip => ip !== ipAddress);
    console.log(`IP ${ipAddress} desbloqueado`);
  }

  // Adicionar IP à lista de permitidos
  static allowIP(ipAddress: string): void {
    if (!this.config.allowedIPs.includes(ipAddress)) {
      this.config.allowedIPs.push(ipAddress);
    }
  }

  // Obter estatísticas de segurança
  static getSecurityStats(): {
    totalRequests: number;
    blockedRequests: number;
    rateLimitHits: number;
    blockedIPs: number;
    allowedIPs: number;
    auditLogs: number;
  } {
    const rateLimitStats = RateLimiter.getStats();
    const auditStats = AuditLogger.getStats();

    return {
      totalRequests: rateLimitStats.totalRequests,
      blockedRequests: 0, // Implementar contador
      rateLimitHits: 0, // Implementar contador
      blockedIPs: this.config.blockedIPs.length,
      allowedIPs: this.config.allowedIPs.length,
      auditLogs: auditStats.totalLogs,
    };
  }

  // Exportar configurações de segurança
  static exportSecurityConfig(): SecurityConfig {
    return { ...this.config };
  }

  // Métodos privados
  private static async checkPermission(userId: string, action: string, resource: string): Promise<boolean> {
    // Implementar verificação de permissões baseada em roles
    // Por agora, permitir todas as ações para utilizadores autenticados
    return true;
  }
}

// Configuração inicial
SecurityManager.configure({
  rateLimitEnabled: true,
  auditLogEnabled: true,
  maxRequestsPerMinute: 60,
  maxRequestsPerHour: 1000,
});
