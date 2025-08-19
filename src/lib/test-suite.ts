export class TestSuite {
  private static results: any[] = [];

  // Testar React Query
  static async testReactQuery() {
    try {
      const { queryClient } = await import('./queryClient');
      const isConfigured = queryClient && queryClient.getDefaultOptions;
      
      this.results.push({
        test: 'React Query',
        status: isConfigured ? 'PASS' : 'FAIL',
        message: isConfigured ? 'React Query configurado corretamente' : 'React Query não configurado'
      });
      
      return isConfigured;
    } catch (error) {
      this.results.push({
        test: 'React Query',
        status: 'FAIL',
        message: `Erro: ${error}`
      });
      return false;
    }
  }

  // Testar Security Service
  static async testSecurityService() {
    try {
      const { SecurityService } = await import('./security');
      
      // Testar rate limiting
      const rateLimit1 = SecurityService.checkRateLimit('test', 1);
      const rateLimit2 = SecurityService.checkRateLimit('test', 1);
      
      // Testar XSS protection
      const sanitized = SecurityService.sanitizeInput('<script>alert("xss")</script>');
      const hasScript = sanitized.includes('<script>');
      
      this.results.push({
        test: 'Security Service',
        status: rateLimit1 && !rateLimit2 && !hasScript ? 'PASS' : 'FAIL',
        message: 'Rate limiting e XSS protection funcionando'
      });
      
      return rateLimit1 && !rateLimit2 && !hasScript;
    } catch (error) {
      this.results.push({
        test: 'Security Service',
        status: 'FAIL',
        message: `Erro: ${error}`
      });
      return false;
    }
  }

  // Testar Error Tracking
  static async testErrorTracking() {
    try {
      const { ErrorTrackingService } = await import('./error-tracking');
      
      // Simular um erro
      ErrorTrackingService.captureError(new Error('Test error'), { test: true });
      
      const stats = ErrorTrackingService.getErrorStats();
      
      this.results.push({
        test: 'Error Tracking',
        status: stats.total > 0 ? 'PASS' : 'FAIL',
        message: `Capturou ${stats.total} erros`
      });
      
      return stats.total > 0;
    } catch (error) {
      this.results.push({
        test: 'Error Tracking',
        status: 'FAIL',
        message: `Erro: ${error}`
      });
      return false;
    }
  }

  // Testar Performance Monitor
  static async testPerformanceMonitor() {
    try {
      const { PerformanceMonitor } = await import('./performance');
      
      // Testar medição de componente
      const startTime = performance.now();
      PerformanceMonitor.measureComponentRender('TestComponent', startTime);
      
      this.results.push({
        test: 'Performance Monitor',
        status: 'PASS',
        message: 'Performance monitoring ativo'
      });
      
      return true;
    } catch (error) {
      this.results.push({
        test: 'Performance Monitor',
        status: 'FAIL',
        message: `Erro: ${error}`
      });
      return false;
    }
  }

  // Testar Supabase Connection
  static async testSupabaseConnection() {
    try {
      const { supabase } = await import('./supabase');
      
      // Testar conexão simples
      const { data, error } = await supabase.from('obras').select('count', { count: 'exact', head: true });
      
      this.results.push({
        test: 'Supabase Connection',
        status: !error ? 'PASS' : 'FAIL',
        message: error ? `Erro de conexão: ${error.message}` : 'Conexão Supabase OK'
      });
      
      return !error;
    } catch (error) {
      this.results.push({
        test: 'Supabase Connection',
        status: 'FAIL',
        message: `Erro: ${error}`
      });
      return false;
    }
  }

  // Testar Executive Dashboard
  static async testExecutiveDashboard() {
    try {
      const { ExecutiveDashboard } = await import('../components/ExecutiveDashboard');
      
      this.results.push({
        test: 'Executive Dashboard',
        status: 'PASS',
        message: 'Dashboard executivo carregado'
      });
      
      return true;
    } catch (error) {
      this.results.push({
        test: 'Executive Dashboard',
        status: 'FAIL',
        message: `Erro: ${error}`
      });
      return false;
    }
  }

  // Executar todos os testes
  static async runAllTests() {
    console.log('🧪 Iniciando testes do Qualicore...');
    
    await this.testReactQuery();
    await this.testSecurityService();
    await this.testErrorTracking();
    await this.testPerformanceMonitor();
    await this.testSupabaseConnection();
    await this.testExecutiveDashboard();
    
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const total = this.results.length;
    
    console.log(`\n📊 RESULTADOS DOS TESTES:`);
    console.log(`✅ Passou: ${passed}/${total}`);
    console.log(`❌ Falhou: ${total - passed}/${total}`);
    
    this.results.forEach(result => {
      const icon = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${result.test}: ${result.message}`);
    });
    
    return {
      passed,
      total,
      results: this.results,
      success: passed === total
    };
  }

  // Obter resultados
  static getResults() {
    return this.results;
  }

  // Limpar resultados
  static clearResults() {
    this.results = [];
  }
}
