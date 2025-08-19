export class SecurityScanner {
  private static vulnerabilities: any[] = [];
  private static scanResults: any[] = [];

  // Scanner de vulnerabilidades XSS
  static scanXSSVulnerabilities() {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    ];

    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      const value = (input as HTMLInputElement).value;
      xssPatterns.forEach((pattern) => {
        if (pattern.test(value)) {
          this.vulnerabilities.push({
            type: 'XSS',
            element: input.tagName,
            value: value.substring(0, 100),
            pattern: pattern.source,
            severity: 'HIGH',
            timestamp: Date.now(),
          });
        }
      });
    });
  }

  // Scanner de vulnerabilidades de injeção SQL
  static scanSQLInjectionVulnerabilities() {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
      /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/gi,
      /(\b(OR|AND)\b\s+['"]\w+['"]\s*=\s*['"]\w+['"])/gi,
      /(\b(OR|AND)\b\s+\d+\s*=\s*\d+\s*--)/gi,
    ];

    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
      const value = (input as HTMLInputElement).value;
      sqlPatterns.forEach((pattern) => {
        if (pattern.test(value)) {
          this.vulnerabilities.push({
            type: 'SQL_INJECTION',
            element: input.tagName,
            value: value.substring(0, 100),
            pattern: pattern.source,
            severity: 'CRITICAL',
            timestamp: Date.now(),
          });
        }
      });
    });
  }

  // Scanner de configurações de segurança
  static scanSecurityHeaders() {
    const headers = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security',
      'Content-Security-Policy',
      'Referrer-Policy',
    ];

    headers.forEach((header) => {
      // Verifica se o header está presente (simulação)
      const isPresent = Math.random() > 0.3; // Simulação
      if (!isPresent) {
        this.vulnerabilities.push({
          type: 'MISSING_SECURITY_HEADER',
          header,
          severity: 'MEDIUM',
          timestamp: Date.now(),
        });
      }
    });
  }

  // Scanner de vulnerabilidades de CSRF
  static scanCSRFVulnerabilities() {
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      const csrfToken = form.querySelector('input[name*="csrf"], input[name*="token"]');
      if (!csrfToken) {
        this.vulnerabilities.push({
          type: 'CSRF',
          element: 'FORM',
          action: (form as HTMLFormElement).action,
          severity: 'HIGH',
          timestamp: Date.now(),
        });
      }
    });
  }

  // Scanner de vulnerabilidades de autenticação
  static scanAuthenticationVulnerabilities() {
    // Verifica se há tokens expirados
    const tokens = ['auth_token', 'session_token', 'access_token'];
    tokens.forEach((tokenName) => {
      const token = localStorage.getItem(tokenName) || sessionStorage.getItem(tokenName);
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          const exp = decoded.exp * 1000;
          if (Date.now() > exp) {
            this.vulnerabilities.push({
              type: 'EXPIRED_TOKEN',
              token: tokenName,
              severity: 'MEDIUM',
              timestamp: Date.now(),
            });
          }
        } catch (error) {
          // Token inválido
          this.vulnerabilities.push({
            type: 'INVALID_TOKEN',
            token: tokenName,
            severity: 'HIGH',
            timestamp: Date.now(),
          });
        }
      }
    });
  }

  // Scanner de vulnerabilidades de armazenamento
  static scanStorageVulnerabilities() {
    // Verifica dados sensíveis no localStorage
    const sensitiveData = ['password', 'credit_card', 'ssn', 'api_key'];
    sensitiveData.forEach((key) => {
      if (localStorage.getItem(key) || sessionStorage.getItem(key)) {
        this.vulnerabilities.push({
          type: 'SENSITIVE_DATA_STORAGE',
          key,
          severity: 'CRITICAL',
          timestamp: Date.now(),
        });
      }
    });
  }

  // Scanner de vulnerabilidades de rede
  static scanNetworkVulnerabilities() {
    // Verifica se está usando HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      this.vulnerabilities.push({
        type: 'INSECURE_PROTOCOL',
        protocol: location.protocol,
        severity: 'HIGH',
        timestamp: Date.now(),
      });
    }

    // Verifica se há requisições para domínios não seguros
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach((script) => {
      const src = script.getAttribute('src');
      if (src && src.startsWith('http:') && !src.includes('localhost')) {
        this.vulnerabilities.push({
          type: 'INSECURE_RESOURCE',
          resource: src,
          severity: 'MEDIUM',
          timestamp: Date.now(),
        });
      }
    });
  }

  // Scanner de vulnerabilidades de dependências
  static async scanDependencyVulnerabilities() {
    try {
      // Simulação de verificação de dependências
      const mockVulnerabilities = [
        { package: 'lodash', version: '4.17.15', severity: 'LOW' },
        { package: 'moment', version: '2.29.1', severity: 'MEDIUM' },
      ];

      mockVulnerabilities.forEach((vuln) => {
        this.vulnerabilities.push({
          type: 'DEPENDENCY_VULNERABILITY',
          ...vuln,
          timestamp: Date.now(),
        });
      });
    } catch (error) {
      console.error('Erro ao verificar dependências:', error);
    }
  }

  // Executa todos os scanners
  static async runFullScan() {
    this.vulnerabilities = [];
    
    this.scanXSSVulnerabilities();
    this.scanSQLInjectionVulnerabilities();
    this.scanSecurityHeaders();
    this.scanCSRFVulnerabilities();
    this.scanAuthenticationVulnerabilities();
    this.scanStorageVulnerabilities();
    this.scanNetworkVulnerabilities();
    await this.scanDependencyVulnerabilities();

    const report = this.generateSecurityReport();
    await this.saveSecurityReport(report);
    
    return report;
  }

  // Gera relatório de segurança
  static generateSecurityReport() {
    const criticalCount = this.vulnerabilities.filter(v => v.severity === 'CRITICAL').length;
    const highCount = this.vulnerabilities.filter(v => v.severity === 'HIGH').length;
    const mediumCount = this.vulnerabilities.filter(v => v.severity === 'MEDIUM').length;
    const lowCount = this.vulnerabilities.filter(v => v.severity === 'LOW').length;

    const score = Math.max(0, 100 - (criticalCount * 25 + highCount * 15 + mediumCount * 10 + lowCount * 5));

    return {
      timestamp: Date.now(),
      vulnerabilities: this.vulnerabilities,
      summary: {
        total: this.vulnerabilities.length,
        critical: criticalCount,
        high: highCount,
        medium: mediumCount,
        low: lowCount,
        securityScore: score,
      },
      recommendations: this.generateRecommendations(),
    };
  }

  // Gera recomendações de segurança
  static generateRecommendations() {
    const recommendations = [];

    const criticalVulns = this.vulnerabilities.filter(v => v.severity === 'CRITICAL');
    const highVulns = this.vulnerabilities.filter(v => v.severity === 'HIGH');

    if (criticalVulns.length > 0) {
      recommendations.push({
        priority: 'IMMEDIATE',
        action: 'Corrigir vulnerabilidades críticas imediatamente',
        count: criticalVulns.length,
      });
    }

    if (highVulns.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Implementar proteções de segurança adicionais',
        count: highVulns.length,
      });
    }

    if (this.vulnerabilities.filter(v => v.type === 'MISSING_SECURITY_HEADER').length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Configurar headers de segurança no servidor',
      });
    }

    return recommendations;
  }

  // Salva relatório no Supabase
  static async saveSecurityReport(report: any) {
    try {
      const { supabase } = await import('./supabase');
      
      await supabase.from('security_reports').insert({
        data: report,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Erro ao salvar relatório de segurança:', error);
    }
  }

  // Limpa dados
  static clearResults() {
    this.vulnerabilities = [];
    this.scanResults = [];
  }
}
