export class PerformanceOptimizer {
  private static optimizations: any[] = [];

  // Otimização de imagens (gratuito)
  static async optimizeImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calcular dimensões mantendo proporção
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Converter para blob com qualidade otimizada
        canvas.toBlob((blob) => {
          const optimizedFile = new File([blob!], file.name, { type: 'image/jpeg' });
          this.logOptimization('Image Optimization', {
            originalSize: file.size,
            optimizedSize: optimizedFile.size,
            reduction: Math.round(((file.size - optimizedFile.size) / file.size) * 100)
          });
          resolve(optimizedFile);
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Lazy loading para componentes
  static setupLazyLoading() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.classList.add('loaded');
          observer.unobserve(element);
        }
      });
    });

    // Observar elementos com data-lazy
    document.querySelectorAll('[data-lazy]').forEach(el => {
      observer.observe(el);
    });

    this.logOptimization('Lazy Loading', { elements: document.querySelectorAll('[data-lazy]').length });
  }

  // Debounce para inputs
  static debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: ReturnType<typeof setTimeout>;
    
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  }

  // Throttle para scroll events
  static throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
    let inThrottle: boolean;
    
    return ((...args: any[]) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  }

  // Cache de dados em localStorage
  static setCache(key: string, data: any, ttl: number = 5 * 60 * 1000) {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
  }

  static getCache(key: string): any | null {
    const cached = localStorage.getItem(`cache_${key}`);
    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    const now = Date.now();
    
    if (now - cacheData.timestamp > cacheData.ttl) {
      localStorage.removeItem(`cache_${key}`);
      return null;
    }

    return cacheData.data;
  }

  // Preload de recursos críticos
  static preloadCriticalResources() {
    const criticalResources = [
      '/src/styles/globals.css',
      '/src/lib/supabase.ts'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });

    this.logOptimization('Critical Resources Preload', { resources: criticalResources.length });
  }

  // Otimização de queries com paginação
  static createPaginatedQuery(baseQuery: any, page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit;
    return baseQuery.range(offset, offset + limit - 1);
  }

  // Virtual scrolling para listas grandes
  static setupVirtualScrolling(container: HTMLElement, items: any[], itemHeight: number = 50) {
    const visibleItems = Math.ceil(container.clientHeight / itemHeight);
    const totalHeight = items.length * itemHeight;
    
    container.style.height = `${totalHeight}px`;
    container.style.position = 'relative';
    
    const renderVisibleItems = () => {
      const scrollTop = container.scrollTop;
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(startIndex + visibleItems + 2, items.length);
      
      // Limpar container
      container.innerHTML = '';
      
      // Renderizar apenas itens visíveis
      for (let i = startIndex; i < endIndex; i++) {
        const item = document.createElement('div');
        item.style.position = 'absolute';
        item.style.top = `${i * itemHeight}px`;
        item.style.height = `${itemHeight}px`;
        item.style.width = '100%';
        item.textContent = items[i]?.name || `Item ${i + 1}`;
        container.appendChild(item);
      }
    };
    
    container.addEventListener('scroll', this.throttle(renderVisibleItems, 16));
    renderVisibleItems();
    
    this.logOptimization('Virtual Scrolling', { 
      totalItems: items.length, 
      visibleItems 
    });
  }

  // Compressão de dados
  static compressData(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      // Compressão simples usando base64 (para dados pequenos)
      return btoa(jsonString);
    } catch (error) {
      console.warn('Compression failed, using original data');
      return JSON.stringify(data);
    }
  }

  static decompressData(compressedData: string): any {
    try {
      const jsonString = atob(compressedData);
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('Decompression failed, using original data');
      return JSON.parse(compressedData);
    }
  }

  // Monitorização de performance
  static measurePerformance(name: string, fn: () => any) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    const duration = end - start;
    
    this.logOptimization('Performance Measurement', {
      name,
      duration: `${duration.toFixed(2)}ms`,
      timestamp: new Date().toISOString()
    });
    
    return result;
  }

  // Log de otimizações
  private static logOptimization(type: string, data: any) {
    this.optimizations.push({
      type,
      data,
      timestamp: new Date().toISOString()
    });
    
    // Manter apenas as últimas 100 otimizações
    if (this.optimizations.length > 100) {
      this.optimizations = this.optimizations.slice(-100);
    }
  }

  // Obter estatísticas de otimização
  static getOptimizationStats() {
    const stats = {
      total: this.optimizations.length,
      byType: {} as any,
      recent: this.optimizations.slice(-10)
    };

    this.optimizations.forEach(opt => {
      stats.byType[opt.type] = (stats.byType[opt.type] || 0) + 1;
    });

    return stats;
  }

  // Setup automático de otimizações
  static setupAutoOptimizations() {
    // Preload de recursos críticos
    this.preloadCriticalResources();
    
    // Lazy loading
    this.setupLazyLoading();
    
    // Throttle scroll events
    const throttledScroll = this.throttle(() => {
      // Handle scroll events
    }, 16);
    
    window.addEventListener('scroll', throttledScroll);
    
    this.logOptimization('Auto Optimizations', {
      preload: true,
      lazyLoading: true,
      scrollThrottling: true
    });
  }
}
