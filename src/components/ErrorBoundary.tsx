import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Home, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

/**
 * ErrorBoundary - Componente para capturar e tratar erros React
 * Sistema robusto de recuperação de erros com monitoramento
 */
class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Atualizar estado com informações do erro
    this.setState({
      error,
      errorInfo
    });

    // Log detalhado para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 React Error Boundary');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }

    // Chamar callback personalizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportBug = () => {
    const bugReport = {
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    // Copiar relatório para clipboard
    navigator.clipboard.writeText(JSON.stringify(bugReport, null, 2));
    
    // Mostrar notificação
    alert('Relatório de bug copiado para o clipboard. Por favor, envie para a equipe de desenvolvimento.');
  };

  render() {
    if (this.state.hasError) {
      // Renderizar fallback personalizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI padrão de erro
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Bug className="h-6 w-6 text-red-600" />
              </div>
              
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Ops! Algo deu errado
              </h2>
              
              <p className="text-gray-600 mb-6">
                Encontramos um problema inesperado. Tente novamente ou contacte o suporte.
              </p>

              <div className="space-y-3">
                <button
                  onClick={this.handleRetry}
                  disabled={this.state.retryCount >= this.maxRetries}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {this.state.retryCount >= this.maxRetries 
                    ? 'Máximo de tentativas atingido' 
                    : `Tentar novamente (${this.state.retryCount + 1}/${this.maxRetries + 1})`
                  }
                </button>

                <button
                  onClick={this.handleGoHome}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                >
                  <Home className="inline h-4 w-4 mr-2" />
                  Ir para página inicial
                </button>

                <button
                  onClick={this.handleReportBug}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  <Bug className="inline h-4 w-4 mr-2" />
                  Reportar bug
                </button>
              </div>

              {/* Informações de debug em desenvolvimento */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">Debug Info:</h3>
                  <div className="text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Erro:</span> {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <div className="mt-2">
                        <span className="font-medium">Stack:</span>
                        <pre className="text-xs bg-gray-200 p-2 rounded mt-1 overflow-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
