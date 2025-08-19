export class AuditTools {
  private static auditResults: any[] = [];

  // Auditoria de Headers de Segurança
  static async auditSecurityHeaders(): Promise<any> {
    const results = {
      timestamp: Date.now(),
      headers: {},
      score: 0,
      recommendations: [],
    };

    try {
      const response = await fetch(window.location.href);
      const headers = response.headers;

      const securityHeaders = [
        'X-Frame-Options',
        'X-Content-Type-Options',
        'X-XSS-Protection',
        'Strict-Transport-Security',
        'Content-Security-Policy',
        'Referrer-Policy',
        'Permissions-Policy',
      ];

      let score = 0;
      securityHeaders.forEach((header) => {
        const value = headers.get(header);
        results.headers[header] = value;
        
        if (value) {
          score += 14; // ~100/7 headers
        } else {
          results.recommendations.push(`Adicionar header: ${header}`);
        }
      });

      results.score = Math.min(100, score);
      return results;
    } catch (error) {
      console.error('Erro ao verificar headers:', error);
      return results;
    }
  }

  // Auditoria de Performance
  static async auditPerformance(): Promise<any> {
    const results = {
      timestamp: Date.now(),
      metrics: {},
      score: 0,
      recommendations: [],
    };

    if ('PerformanceObserver' in window) {
      // Core Web Vitals
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        results.metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          ttfb: navigation.responseStart - navigation.requestStart,
          domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          windowLoad: navigation.loadEventEnd - navigation.loadEventStart,
        };
      }

      // Resource timing
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources.filter((r: any) => r.duration > 1000);
      
      if (slowResources.length > 0) {
        results.recommendations.push(`Otimizar ${slowResources.length} recursos lentos`);
      }

      // Calculate score
      const ttfb = results.metrics.ttfb || 0;
      const domLoad = results.metrics.domLoad || 0;
      
      let score = 100;
      if (ttfb > 600) score -= 20;
      if (domLoad > 200) score -= 20;
      if (slowResources.length > 5) score -= 20;
      
      results.score = Math.max(0, score);
    }

    return results;
  }

  // Auditoria de Acessibilidade
  static auditAccessibility(): any {
    const results = {
      timestamp: Date.now(),
      issues: [],
      score: 100,
      recommendations: [],
    };

    // Verificar imagens sem alt
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
    
    if (imagesWithoutAlt.length > 0) {
      results.issues.push(`${imagesWithoutAlt.length} imagens sem atributo alt`);
      results.score -= imagesWithoutAlt.length * 2;
    }

    // Verificar contraste de cores
    const elements = document.querySelectorAll('*');
    const lowContrastElements = Array.from(elements).filter(el => {
      const style = window.getComputedStyle(el);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      // Simulação básica de verificação de contraste
      return color && backgroundColor && color !== backgroundColor;
    });

    // Verificar formulários sem labels
    const inputs = document.querySelectorAll('input, textarea, select');
    const inputsWithoutLabel = Array.from(inputs).filter(input => {
      const id = input.getAttribute('id');
      return !id || !document.querySelector(`label[for="${id}"]`);
    });

    if (inputsWithoutLabel.length > 0) {
      results.issues.push(`${inputsWithoutLabel.length} inputs sem labels`);
      results.score -= inputsWithoutLabel.length * 3;
    }

    // Verificar headings hierarquia
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    let skipIssues = 0;

    Array.from(headings).forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        skipIssues++;
      }
      previousLevel = level;
    });

    if (skipIssues > 0) {
      results.issues.push(`${skipIssues} problemas na hierarquia de headings`);
      results.score -= skipIssues * 2;
    }

    results.score = Math.max(0, results.score);
    results.recommendations = results.issues.map(issue => `Corrigir: ${issue}`);

    return results;
  }

  // Auditoria de SEO
  static auditSEO(): any {
    const results = {
      timestamp: Date.now(),
      issues: [],
      score: 100,
      recommendations: [],
    };

    // Verificar meta tags
    const title = document.title;
    if (!title || title.length < 10 || title.length > 60) {
      results.issues.push('Título da página inadequado');
      results.score -= 10;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      results.issues.push('Meta description em falta');
      results.score -= 15;
    } else {
      const description = metaDescription.getAttribute('content');
      if (!description || description.length < 50 || description.length > 160) {
        results.issues.push('Meta description inadequada');
        results.score -= 10;
      }
    }

    // Verificar headings
    const h1s = document.querySelectorAll('h1');
    if (h1s.length === 0) {
      results.issues.push('H1 em falta');
      results.score -= 10;
    } else if (h1s.length > 1) {
      results.issues.push('Múltiplos H1s');
      results.score -= 5;
    }

    // Verificar links
    const links = document.querySelectorAll('a');
    const linksWithoutText = Array.from(links).filter(link => !link.textContent?.trim());
    if (linksWithoutText.length > 0) {
      results.issues.push(`${linksWithoutText.length} links sem texto`);
      results.score -= linksWithoutText.length * 2;
    }

    // Verificar imagens
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
    if (imagesWithoutAlt.length > 0) {
      results.issues.push(`${imagesWithoutAlt.length} imagens sem alt`);
      results.score -= imagesWithoutAlt.length * 2;
    }

    results.score = Math.max(0, results.score);
    results.recommendations = results.issues.map(issue => `Melhorar: ${issue}`);

    return results;
  }

  // Auditoria de Bundle
  static auditBundle(): any {
    const results = {
      timestamp: Date.now(),
      size: 0,
      scripts: 0,
      styles: 0,
      score: 100,
      recommendations: [],
    };

    // Contar scripts
    const scripts = document.querySelectorAll('script[src]');
    results.scripts = scripts.length;

    // Contar stylesheets
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    results.styles = styles.length;

    // Verificar tamanho estimado
    let totalSize = 0;
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('assets')) {
        totalSize += 100; // Estimativa
      }
    });

    results.size = totalSize;

    // Recomendações baseadas no tamanho
    if (totalSize > 1000) {
      results.recommendations.push('Bundle muito grande - considerar code splitting');
      results.score -= 20;
    }

    if (scripts.length > 10) {
      results.recommendations.push('Muitos scripts - otimizar carregamento');
      results.score -= 15;
    }

    results.score = Math.max(0, results.score);
    return results;
  }

  // Executar auditoria completa
  static async runFullAudit(): Promise<any> {
    const startTime = Date.now();

    const [
      securityHeaders,
      performance,
      accessibility,
      seo,
      bundle,
    ] = await Promise.all([
      this.auditSecurityHeaders(),
      this.auditPerformance(),
      Promise.resolve(this.auditAccessibility()),
      Promise.resolve(this.auditSEO()),
      Promise.resolve(this.auditBundle()),
    ]);

    const totalScore = Math.round(
      (securityHeaders.score + performance.score + accessibility.score + seo.score + bundle.score) / 5
    );

    const audit = {
      timestamp: Date.now(),
      duration: Date.now() - startTime,
      overallScore: totalScore,
      categories: {
        security: securityHeaders,
        performance,
        accessibility,
        seo,
        bundle,
      },
      summary: {
        critical: 0,
        warnings: 0,
        info: 0,
      },
      recommendations: [
        ...securityHeaders.recommendations,
        ...performance.recommendations,
        ...accessibility.recommendations,
        ...seo.recommendations,
        ...bundle.recommendations,
      ],
    };

    // Classificar recomendações
    audit.recommendations.forEach(rec => {
      if (rec.includes('crítico') || rec.includes('segurança')) {
        audit.summary.critical++;
      } else if (rec.includes('performance') || rec.includes('otimizar')) {
        audit.summary.warnings++;
      } else {
        audit.summary.info++;
      }
    });

    this.auditResults.push(audit);
    return audit;
  }

  // Obter histórico de auditorias
  static getAuditHistory(): any[] {
    return this.auditResults;
  }

  // Limpar histórico
  static clearHistory(): void {
    this.auditResults = [];
  }
}
