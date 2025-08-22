// Sistema de Audit Logs para rastreabilidade

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}

interface AuditLogConfig {
  enabled: boolean;
  logLevel: 'basic' | 'detailed' | 'verbose';
  maxEntries: number;
  retentionDays: number;
}

export class AuditLogger {
  private static logs: AuditLogEntry[] = [];
  private static config: AuditLogConfig = {
    enabled: true,
    logLevel: 'detailed',
    maxEntries: 10000,
    retentionDays: 90,
  };

  // Configurar audit logging
  static configure(config: Partial<AuditLogConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Log de ação básica
  static log(
    userId: string,
    userEmail: string,
    action: string,
    resource: string,
    details: any = {},
    success: boolean = true,
    errorMessage?: string
  ): void {
    if (!this.config.enabled) return;

    const entry: AuditLogEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      userId,
      userEmail,
      action,
      resource,
      details: this.sanitizeDetails(details),
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
      success,
      errorMessage,
    };

    this.addLog(entry);
  }

  // Log de login
  static logLogin(userId: string, userEmail: string, success: boolean, errorMessage?: string): void {
    this.log(userId, userEmail, 'LOGIN', 'AUTH', { method: 'email' }, success, errorMessage);
  }

  // Log de logout
  static logLogout(userId: string, userEmail: string): void {
    this.log(userId, userEmail, 'LOGOUT', 'AUTH', {});
  }

  // Log de criação
  static logCreate(userId: string, userEmail: string, resource: string, resourceId: string, details: any): void {
    this.log(userId, userEmail, 'CREATE', resource, { resourceId, ...details });
  }

  // Log de atualização
  static logUpdate(userId: string, userEmail: string, resource: string, resourceId: string, details: any): void {
    this.log(userId, userEmail, 'UPDATE', resource, { resourceId, ...details });
  }

  // Log de eliminação
  static logDelete(userId: string, userEmail: string, resource: string, resourceId: string): void {
    this.log(userId, userEmail, 'DELETE', resource, { resourceId });
  }

  // Log de acesso
  static logAccess(userId: string, userEmail: string, resource: string, resourceId?: string): void {
    this.log(userId, userEmail, 'ACCESS', resource, { resourceId });
  }

  // Log de exportação
  static logExport(userId: string, userEmail: string, resource: string, format: string, filters?: any): void {
    this.log(userId, userEmail, 'EXPORT', resource, { format, filters });
  }

  // Obter logs por utilizador
  static getLogsByUser(userId: string, limit: number = 100): AuditLogEntry[] {
    return this.logs
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Obter logs por recurso
  static getLogsByResource(resource: string, limit: number = 100): AuditLogEntry[] {
    return this.logs
      .filter(log => log.resource === resource)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Obter logs por período
  static getLogsByPeriod(startDate: Date, endDate: Date): AuditLogEntry[] {
    return this.logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  // Obter estatísticas
  static getStats(): {
    totalLogs: number;
    logsToday: number;
    uniqueUsers: number;
    mostActiveUser: string;
    mostAccessedResource: string;
  } {
    const today = new Date().toDateString();
    const logsToday = this.logs.filter(log => 
      new Date(log.timestamp).toDateString() === today
    ).length;

    const uniqueUsers = new Set(this.logs.map(log => log.userId)).size;

    const userCounts = this.logs.reduce((acc, log) => {
      acc[log.userId] = (acc[log.userId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostActiveUser = Object.entries(userCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    const resourceCounts = this.logs.reduce((acc, log) => {
      acc[log.resource] = (acc[log.resource] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostAccessedResource = Object.entries(resourceCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    return {
      totalLogs: this.logs.length,
      logsToday,
      uniqueUsers,
      mostActiveUser,
      mostAccessedResource,
    };
  }

  // Exportar logs
  static exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['ID', 'Timestamp', 'User ID', 'User Email', 'Action', 'Resource', 'Success'];
      const rows = this.logs.map(log => [
        log.id,
        log.timestamp,
        log.userId,
        log.userEmail,
        log.action,
        log.resource,
        log.success.toString(),
      ]);
      
      return [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');
    }

    return JSON.stringify(this.logs, null, 2);
  }

  // Limpeza automática de logs antigos
  static cleanup(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

    this.logs = this.logs.filter(log => 
      new Date(log.timestamp) > cutoffDate
    );

    // Manter apenas o número máximo de entradas
    if (this.logs.length > this.config.maxEntries) {
      this.logs = this.logs
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, this.config.maxEntries);
    }
  }

  // Métodos privados
  private static generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static sanitizeDetails(details: any): any {
    // Remover dados sensíveis
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    const sanitized = { ...details };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  private static getClientIP(): string {
    // Implementar deteção de IP real
    return 'unknown';
  }

  private static getUserAgent(): string {
    return navigator.userAgent;
  }

  private static addLog(entry: AuditLogEntry): void {
    this.logs.push(entry);
    
    // Limpeza automática se necessário
    if (this.logs.length > this.config.maxEntries) {
      this.cleanup();
    }
  }
}

// Limpeza automática diária
setInterval(() => {
  AuditLogger.cleanup();
}, 24 * 60 * 60 * 1000);
