export class ErrorTrackingService {
  private static errors: any[] = [];

  static captureError(error: Error, context?: any) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context
    };

    this.errors.push(errorData);
    
    // Enviar para Supabase (gratuito)
    this.saveToDatabase(errorData);
    
    // Log local para debug
    console.error('Error captured:', errorData);
  }

  private static async saveToDatabase(errorData: any) {
    try {
      const { supabase } = await import('./supabase');
      await supabase.from('error_logs').insert(errorData);
    } catch (err) {
      console.error('Failed to save error:', err);
    }
  }

  // Dashboard de erros (gratuito)
  static getErrorStats() {
    const last24h = this.errors.filter(
      e => new Date(e.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    return {
      total: this.errors.length,
      last24h: last24h.length,
      critical: last24h.filter(e => e.message.includes('critical')).length
    };
  }

  // Setup global error handler
  static setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      this.captureError(event.error, {
        type: 'global_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(new Error(event.reason), {
        type: 'unhandled_promise_rejection'
      });
    });
  }
}
