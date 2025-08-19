export class PerformanceAnalyzer {
  private static metrics: any[] = [];
  private static observers: Map<string, PerformanceObserver> = new Map();

  // Analisa Core Web Vitals
  static analyzeCoreWebVitals() {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.push({
          type: 'LCP',
          value: lastEntry.startTime,
          timestamp: Date.now(),
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', lcpObserver);

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.push({
            type: 'FID',
            value: entry.processingStart - entry.startTime,
            timestamp: Date.now(),
          });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', fidObserver);

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.push({
          type: 'CLS',
          value: clsValue,
          timestamp: Date.now(),
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', clsObserver);
    }
  }

  // Analisa tempo de carregamento de recursos
  static analyzeResourceTiming() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.initiatorType === 'img' || entry.initiatorType === 'script') {
            this.metrics.push({
              type: 'RESOURCE',
              name: entry.name,
              duration: entry.duration,
              size: entry.transferSize,
              initiatorType: entry.initiatorType,
              timestamp: Date.now(),
            });
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', resourceObserver);
    }
  }

  // Analisa memória
  static analyzeMemory() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.push({
        type: 'MEMORY',
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        timestamp: Date.now(),
      });
    }
  }

  // Analisa bundle size
  static analyzeBundleSize() {
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    
    scripts.forEach((script) => {
      const src = script.getAttribute('src');
      if (src && src.includes('assets')) {
        // Estimativa baseada no nome do arquivo
        const size = this.estimateScriptSize(src);
        totalSize += size;
      }
    });

    this.metrics.push({
      type: 'BUNDLE_SIZE',
      totalSize,
      scriptCount: scripts.length,
      timestamp: Date.now(),
    });
  }

  // Analisa performance de componentes React
  static analyzeReactPerformance(componentName: string, renderTime: number) {
    this.metrics.push({
      type: 'REACT_RENDER',
      component: componentName,
      renderTime,
      timestamp: Date.now(),
    });
  }

  // Analisa erros de performance
  static analyzePerformanceErrors() {
    const errors: any[] = [];
    
    // Verifica LCP > 2.5s
    const lcpMetrics = this.metrics.filter(m => m.type === 'LCP');
    if (lcpMetrics.length > 0) {
      const lastLCP = lcpMetrics[lcpMetrics.length - 1];
      if (lastLCP.value > 2500) {
        errors.push({
          type: 'LCP_SLOW',
          value: lastLCP.value,
          threshold: 2500,
        });
      }
    }

    // Verifica FID > 100ms
    const fidMetrics = this.metrics.filter(m => m.type === 'FID');
    if (fidMetrics.length > 0) {
      const lastFID = fidMetrics[fidMetrics.length - 1];
      if (lastFID.value > 100) {
        errors.push({
          type: 'FID_SLOW',
          value: lastFID.value,
          threshold: 100,
        });
      }
    }

    // Verifica CLS > 0.1
    const clsMetrics = this.metrics.filter(m => m.type === 'CLS');
    if (clsMetrics.length > 0) {
      const lastCLS = clsMetrics[clsMetrics.length - 1];
      if (lastCLS.value > 0.1) {
        errors.push({
          type: 'CLS_POOR',
          value: lastCLS.value,
          threshold: 0.1,
        });
      }
    }

    return errors;
  }

  // Gera relatório de performance
  static generateReport() {
    const report = {
      timestamp: Date.now(),
      metrics: this.metrics,
      errors: this.analyzePerformanceErrors(),
      summary: {
        totalMetrics: this.metrics.length,
        errorCount: this.analyzePerformanceErrors().length,
        averageRenderTime: this.calculateAverageRenderTime(),
        resourceCount: this.metrics.filter(m => m.type === 'RESOURCE').length,
      },
    };

    return report;
  }

  // Salva métricas no Supabase
  static async saveMetricsToDatabase() {
    try {
      const { supabase } = await import('./supabase');
      const report = this.generateReport();
      
      await supabase.from('performance_metrics').insert({
        data: report,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Erro ao salvar métricas:', error);
    }
  }

  // Limpa observers
  static cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers.clear();
  }

  // Métodos privados
  private static estimateScriptSize(src: string): number {
    // Estimativa baseada no nome do arquivo
    if (src.includes('vendor')) return 500000; // ~500KB
    if (src.includes('router')) return 100000; // ~100KB
    if (src.includes('ui')) return 200000; // ~200KB
    return 50000; // ~50KB default
  }

  private static calculateAverageRenderTime(): number {
    const renderMetrics = this.metrics.filter(m => m.type === 'REACT_RENDER');
    if (renderMetrics.length === 0) return 0;
    
    const total = renderMetrics.reduce((sum, m) => sum + m.renderTime, 0);
    return total / renderMetrics.length;
  }

  // Inicializa todas as análises
  static initialize() {
    this.analyzeCoreWebVitals();
    this.analyzeResourceTiming();
    
    // Análise periódica
    setInterval(() => {
      this.analyzeMemory();
      this.analyzeBundleSize();
      this.saveMetricsToDatabase();
    }, 30000); // A cada 30 segundos
  }
}
