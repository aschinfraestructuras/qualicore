import React, { useState, useEffect } from 'react';
import { PerformanceOptimizer } from '../lib/performance-optimizer';
import { PerformanceMonitor } from '../lib/performance';
import { TrendingUp, Zap, Clock, HardDrive, Activity } from 'lucide-react';

export const PerformanceDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentOptimizations, setRecentOptimizations] = useState<any[]>([]);

  useEffect(() => {
    const updateStats = () => {
      const optimizationStats = PerformanceOptimizer.getOptimizationStats();
      setStats(optimizationStats);
      setRecentOptimizations(optimizationStats.recent || []);
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Atualizar a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  const getOptimizationIcon = (type: string) => {
    switch (type) {
      case 'Image Optimization':
        return <HardDrive className="w-4 h-4" />;
      case 'Lazy Loading':
        return <Activity className="w-4 h-4" />;
      case 'Performance Measurement':
        return <Clock className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getOptimizationColor = (type: string) => {
    switch (type) {
      case 'Image Optimization':
        return 'text-blue-600 bg-blue-100';
      case 'Lazy Loading':
        return 'text-green-600 bg-green-100';
      case 'Performance Measurement':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-orange-600 bg-orange-100';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">⚡ Performance Dashboard</h2>
          <p className="text-gray-600">Monitorização de otimizações em tempo real</p>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-green-600" />
          <span className="text-sm text-gray-600">Otimizações Ativas</span>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Zap className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Otimizações</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-green-600 font-medium">Tipos Ativos</p>
                <p className="text-2xl font-bold text-green-700">{Object.keys(stats.byType || {}).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-purple-600 font-medium">Última Atividade</p>
                <p className="text-lg font-bold text-purple-700">
                  {stats.recent && stats.recent.length > 0 
                    ? new Date(stats.recent[0].timestamp).toLocaleTimeString('pt-BR')
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-orange-600 font-medium">Performance</p>
                <p className="text-2xl font-bold text-orange-700">
                  {stats.total > 0 ? 'Excelente' : 'Boa'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tipos de Otimização */}
      {stats && stats.byType && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tipos de Otimização</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(stats.byType).map(([type, count]) => (
              <div key={type} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getOptimizationIcon(type)}
                    <span className="ml-2 text-sm font-medium text-gray-700">{type}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-800">{count as number}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Otimizações Recentes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Otimizações Recentes</h3>
        <div className="space-y-3">
          {recentOptimizations.map((optimization, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${getOptimizationColor(optimization.type)}`}>
                    {getOptimizationIcon(optimization.type)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-800">{optimization.type}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(optimization.timestamp).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {optimization.data && typeof optimization.data === 'object' && (
                    <div className="text-sm text-gray-600">
                      {optimization.data.reduction && (
                        <p className="text-green-600 font-medium">
                          -{optimization.data.reduction}% tamanho
                        </p>
                      )}
                      {optimization.data.duration && (
                        <p className="text-blue-600 font-medium">
                          {optimization.data.duration}
                        </p>
                      )}
                      {optimization.data.elements && (
                        <p className="text-purple-600 font-medium">
                          {optimization.data.elements} elementos
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dicas de Performance */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">💡 Dicas de Performance</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Use lazy loading para imagens e componentes pesados</li>
          <li>• Implemente debounce em inputs de pesquisa</li>
          <li>• Utilize cache para dados frequentemente acessados</li>
          <li>• Otimize imagens antes do upload</li>
          <li>• Use virtual scrolling para listas grandes</li>
        </ul>
      </div>
    </div>
  );
};
