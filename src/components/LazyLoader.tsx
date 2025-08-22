import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Componente de loading otimizado
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex items-center space-x-2">
      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      <span className="text-gray-600">Carregando...</span>
    </div>
  </div>
);

// Lazy loading de componentes pesados
export const LazyDashboard = lazy(() => import('./Dashboard'));
export const LazyRelatorios = lazy(() => import('./Relatorios'));
export const LazyAnalytics = lazy(() => import('./Analytics'));
export const LazyNotificacoes = lazy(() => import('./Notificacoes'));

// Wrapper para lazy loading com fallback
export const LazyComponent = ({ 
  component: Component, 
  fallback = <LoadingSpinner />,
  ...props 
}: {
  component: React.ComponentType<any>;
  fallback?: React.ReactNode;
  [key: string]: any;
}) => (
  <Suspense fallback={fallback}>
    <Component {...props} />
  </Suspense>
);

// Hook para lazy loading condicional
export const useLazyLoad = (shouldLoad: boolean, importFn: () => Promise<any>) => {
  const [Component, setComponent] = React.useState<React.ComponentType | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (shouldLoad && !Component) {
      setLoading(true);
      importFn()
        .then((module) => {
          setComponent(() => module.default);
        })
        .catch((error) => {
          console.error('Erro ao carregar componente:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [shouldLoad, Component, importFn]);

  return { Component, loading };
};
