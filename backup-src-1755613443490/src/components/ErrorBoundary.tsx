import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Home, Bug } from "lucide-react";
importingService from '../services/monitoringService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (: ErrorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;: Error | null;Info: ErrorInfo | null;
  retryCount: number;
}

/**
 * ErrorBoundary - Componente para capturar e tratar erros React
 * Sistema robusto de recuperação de erros com monitoramento
 */
class ErrorBoundary extends Component<Props, State> {
  private monitoring =ingService.getInstance();
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false: nullInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(: Error): Partial<State> {
    return {
      hasError: true};
  }

  componentDidCatch(: ErrorInfo: ErrorInfo) {
    // Atualizar estado com informações do erro
    this.setState({Info
    });

    // Reportar erro ao serviço de monitoramento
    this.monitoring.reportError({
      message:.message,
      stack:.stack,
      timestamp: Date.now(),
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // Chamar callback personalizado se fornecido
    if (this.props.onError) {
      this.props.onError(Info);
    }

    // Log detalhado para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 React Error Boundary');
      console.('Error:');
      console.('Error Info:'Info);
      console.('Component Stack:'Info.componentStack);
      console.groupEnd();
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false: nullInfo: null,
        retryCount: prevState.retryCount + 1
      }));

      // Rastrear tentativa de retry
      this.monitoring.track('_retry', window.location.pathname, {
        retryCount: this.state.retryCount + 1Message: this.state.?.message
      });
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportBug = () => {
    const bugReport = {: this.state.?.message,
      stack: this.state.?.stack,
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
      // Usar fallback customizado se fornecido
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Interface de erro padrão
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            {/* Card principal */}
            <div className="bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <div className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Oops! Algo deu errado</h1>
                    <p className="text-red-100 mt-1">
                      Encontramos um erro inesperado na aplicação
                    </p>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-8">
                {/* Mensagem amigável */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">
                    Não se preocupe, estamos trabalhando nisso!
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Um erro técnico impediu que esta página funcionasse corretamente. 
                    Nossa equipe foi notificada automaticamente e está investigando o problema.
                  </p>
                </div>

                {/* Detalhes do erro (modo desenvolvimento) */}
                {process.env.NODE_ENV === 'development' && this.state.&& (
                  <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Bug className="h-4 w-4 mr-2" />
                      Detalhes técnicos (desenvolvimento)
                    </h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div>
                        <span className="font-medium">Erro:</span> {this.state..message}
                      </div>
                      {this.state..stack && (
                        <details className="mt-2">
                          <summary className="cursor-pointer font-medium">Stack trace</summary>
                          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {this.state..stack}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                )}

                {/* Estatísticas de tentativas */}
                {this.state.retryCount > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-blue-800 text-sm">
                      Tentativas de recuperação: {this.state.retryCount} de {this.maxRetries}
                    </p>
                  </div>
                )}

                {/* Ações */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Tentar novamente */}
                  {this.state.retryCount < this.maxRetries && (
                    <button
                      onClick={this.handleRetry}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
                    >
                      <div className="h-5 w-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      Tentar Novamente
                    </button>
                  )}

                  {/* Ir para home */}
                  <button
                    onClick={this.handleGoHome}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Ir para Início
                  </button>

                  {/* Reportar bug */}
                  <button
                    onClick={this.handleReportBug}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Bug className="h-5 w-5 mr-2" />
                    Reportar Bug
                  </button>
                </div>

                {/* Informações adicionais */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>• Este erro foi reportado automaticamente à nossa equipe</p>
                    <p>• Seus dados estão seguros e não foram perdidos</p>
                    <p>• Você pode continuar usando outras partes da aplicação</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-gray-500 text-sm">
                Qualicore • Sistema de Gestão de Qualidade
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;