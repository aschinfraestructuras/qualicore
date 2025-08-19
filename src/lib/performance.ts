export class PerformanceMonitor {
  static measurePageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      const metrics = {
        loadTime: navigation.loadEventEnd - navigation.navigationStart,
        domReady: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        timestamp: new Date().toISOString()
      };

      this.saveMetrics(metrics);
    });
  }

  private static async saveMetrics(metrics: any) {
    try {
      const { supabase } = await import('./supabase');
      await supabase.from('performance_metrics').insert(metrics);
    } catch (err) {
      console.error('Failed to save metrics:', err);
    }
  }

  // Medir performance de componentes
  static measureComponentRender(componentName: string, startTime: number) {
    const renderTime = performance.now() - startTime;
    
    if (renderTime > 100) { // Alertar se demorar mais de 100ms
      console.warn(`Slow component render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }

    this.saveComponentMetrics(componentName, renderTime);
  }

  private static async saveComponentMetrics(componentName: string, renderTime: number) {
    try {
      const { supabase } = await import('./supabase');
      await supabase.from('component_performance').insert({
        component_name: componentName,
        render_time: renderTime,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to save component metrics:', err);
    }
  }

  // Setup performance monitoring
  static setupPerformanceMonitoring() {
    this.measurePageLoad();
    
    // Monitorizar Core Web Vitals
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.saveMetrics({ lcp: lastEntry.startTime, type: 'lcp' });
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.saveMetrics({ 
              fid: entry.processingStart - entry.startTime, 
              type: 'fid' 
            });
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }
  }
}
