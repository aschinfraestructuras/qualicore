/**
 * Serviço deamento e Analytics - Qualicore
 * Sistema avançado de monitoramento de performance e erros
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  page?: string;
  userId?: string;
}

interface ErrorReport {
  message: string;
  stack?: string;
  timestamp: number;
  page: string;
  userId?: string;
  userAgent: string;
  url: string;
}

interface Props {
  action: string;
  page: string;
  timestamp: number;
  userId?: string;
  duration?: number;
  meta?: Record<string, any>;
}

classingService {
  private performanceMetrics: PerformanceMetric[] = [];
  privateReports: ErrorReport[] = [];
  private userActivities:[] = [];
  private isEnabled: boolean = true;

  constructor() {
    this.initializeing();
  }

  /**
   * Inicializar monitoramento automático
   */
  private initializeing() {
    //ar erros não capturados
    window.addEventListener('', (event) => {
      this.reportError({
        message: event.message,
        stack: event.?.stack,
        timestamp: Date.now(),
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });

    //ar promises rejeitadas
    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: Date.now(),
        page: window.location.pathname,
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    });

    //ar performance da página
    if ('performance' in window) {
      this.measurePageLoad();
    }

    //ar mudanças de página
    this.trackPageViews();
  }

  /**
   * Medir performance de carregamento da página
   */
  private measurePageLoad() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          this.recordMetric('page_load_time', navigation.loadEventEnd - navigation.navigationt);
          this.recordMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.navigationt);
          this.recordMetric('first_paint', navigation.responseEnd - navigation.requestt);
        }

        // Core Web Vitals
        this.measureCoreWebVitals();
      }, 0);
    });
  }

  /**
   * Medir Core Web Vitals
   */
  private measureCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('largest_contentful_paint', lastEntry.startTime);
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('first_input_delay', entry.processingt - entry.startTime);
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.recordMetric('cumulative_layout_shift', clsValue);
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch () {
        console.warn('Core Web Vitals monitoring não suportado:');
      }
    }
  }

  /**
   * Rastrear visualizações de página
   */
  private trackPageViews() {
    let currentPage = window.location.pathname;
    
    // Rastrear mudanças de URL (SPA)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(() => {
        if (window.location.pathname !== currentPage) {
          currentPage = window.location.pathname;ingService.getInstance().track('page_view', currentPage);
        }
      }, 0);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(() => {
        if (window.location.pathname !== currentPage) {
          currentPage = window.location.pathname;ingService.getInstance().track('page_view', currentPage);
        }
      }, 0);
    };

    // Rastrear popstate (botão voltar/avançar)
    window.addEventListener('popstate', () => {
      setTimeout(() => {
        if (window.location.pathname !== currentPage) {
          currentPage = window.location.pathname;
          this.track('page_view', currentPage);
        }
      }, 0);
    });
  }

  /**
   * Registrar métrica de performance
   */
  recordMetric(name: string, value: number, page?: string) {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      page: page || window.location.pathname
    };

    this.performanceMetrics.push(metric);
    
    // Limitar tamanho do array
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-500);
    }

    // Enviar métricas críticas imediatamente
    if (this.isCriticalMetric(name, value)) {
      this.sendMetricsToServer([metric]);
    }
  }

  /**
   * Reportar erro
   */
  reportError(: Omit<ErrorReport, 'userId'>) {
    if (!this.isEnabled) return;

    constReport: ErrorReport = {
      ...
      userId: this.getCurrentId()
    };

    this.Reports.push(Report);
    
    // Limitar tamanho do array
    if (this.Reports.length > 100) {
      this.Reports = this.Reports.slice(-50);
    }

    // Enviar erros críticos imediatamente
    this.sendErrorsToServer([Report]);
  }

  /**
   * Rastrear atividade do usuário
   */
  track(action: string, page?: string, meta?: Record<string, any>) {
    if (!this.isEnabled) return;

    const activity:= {
      action,
      page: page || window.location.pathname,
      timestamp: Date.now(),
      userId: this.getCurrentId(),
      meta};

    this.userActivities.push(activity);
    
    // Limitar tamanho do array
    if (this.userActivities.length > 500) {
      this.userActivities = this.userActivities.slice(-250);
    }
  }

  /**
   * Medir tempo de execução de função
   */
  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.recordMetric(`function_${name}`, duration);
    
    return result;
  }

  /**
   * Medir tempo de execução de função async
   */
  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    this.recordMetric(`async_function_${name}`, duration);
    
    return result;
  }

  /**
   * Obter métricas de performance
   */
  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }

  /**
   * Obter relatórios de erro
   */
  getErrorReports(): ErrorReport[] {
    return [...this.Reports];
  }

  /**
   * Obter atividades do usuário
   */
  getActivities():[] {
    return [...this.userActivities];
  }

  /**
   * Obter estatísticas resumidas
   */
  getStats() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    const recentMetrics = this.performanceMetrics.filter(m => m.timestamp > oneHourAgo);
    const recentErrors = this.Reports.filter(e => e.timestamp > oneHourAgo);
    const recentActivities = this.userActivities.filter(a => a.timestamp > oneHourAgo);

    return {
      performance: {
        total: this.performanceMetrics.length,
        recent: recentMetrics.length,
        avgLoadTime: this.getAverageMetric('page_load_time'),
        avgLCP: this.getAverageMetric('largest_contentful_paint'),
        avgFID: this.getAverageMetric('first_input_delay'),
        avgCLS: this.getAverageMetric('cumulative_layout_shift')
      }s: {
        total: this.Reports.length,
        recent: recentErrors.lengthRate: recentErrors.length / Math.max(recentActivities.length, 1)
      },
      activity: {
        total: this.userActivities.length,
        recent: recentActivities.length,
        uniquePages: new Set(recentActivities.map(a => a.page)).size
      }
    };
  }

  /**
   * Verificar se métrica é crítica
   */
  private isCriticalMetric(name: string, value: number): boolean {
    const thresholds = {
      page_load_time: 3000, // 3 segundos
      largest_contentful_paint: 2500, // 2.5 segundos
      first_input_delay: 100, // 100ms
      cumulative_layout_shift: 0.1 // 0.1
    };

    return value > (thresholds[name as keyof typeof thresholds] || Infinity);
  }

  /**
   * Obter média de uma métrica
   */
  private getAverageMetric(name: string): number {
    const metrics = this.performanceMetrics.filter(m => m.name === name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  /**
   * Obter ID do usuário atual
   */
  private getCurrentId(): string | undefined {
    // Implementar lógica para obter ID do usuário
    return localStorage.getItem('userId') || undefined;
  }

  /**
   * Enviar métricas para servidor
   */
  private async sendMetricsToServer(metrics: PerformanceMetric[]) {
    try {
      // Implementar envio para servidor/analytics
      console.log('📊 Métricas enviadas:', metrics);
    } catch () {
      console.('Erro ao enviar métricas:');
    }
  }

  /**
   * Enviar erros para servidor
   */
  private async sendErrorsToServer(s: ErrorReport[]) {
    try {
      // Implementar envio para servidor/analytics
      console.('🚨 Erros reportados:'s);
    } catch () {
      console.('Erro ao enviar relatório de erro:');
    }
  }

  /**
   * Habilitar/desabilitar monitoramento
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  /**
   * Limpar dados de monitoramento
   */
  clear() {
    this.performanceMetrics = [];
    this.Reports = [];
    this.userActivities = [];
  }

  // Singleton pattern
  private static instance:ingService;
  
  static getInstance():ingService {
    if (!ingService.instance) {ingService.instance = newingService();
    }
    returningService.instance;
  }
}

// Hook React para usar o serviço de monitoramento
export function useing() {
  const monitoring =ingService.getInstance();
  
  return {
    recordMetric: monitoring.recordMetric.bind(monitoring),
    reportError: monitoring.reportError.bind(monitoring),
    track: monitoring.track.bind(monitoring),
    measureFunction: monitoring.measureFunction.bind(monitoring),
    measureAsyncFunction: monitoring.measureAsyncFunction.bind(monitoring),
    getStats: monitoring.getStats.bind(monitoring)
  };
}

export defaultingService;