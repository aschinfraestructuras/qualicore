import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Target, DollarSign, Calendar, BarChart3, Plus, Edit, Trash2,
  TrendingDown, AlertTriangle, CheckCircle, Clock, Percent, Calculator,
  Activity, Zap, TrendingUpIcon, TrendingDownIcon
} from 'lucide-react';
import { MetricasEVM, IndicadorPerformance } from '@/types';
import toast from 'react-hot-toast';

interface MetricasEVMProps {
  metricas: MetricasEVM;
  indicadores: IndicadorPerformance[];
  onMetricasChange: (metricas: MetricasEVM) => void;
  onIndicadoresChange: (indicadores: IndicadorPerformance[]) => void;
}

export default function MetricasEVMComponent({ 
  metricas, 
  indicadores, 
  onMetricasChange, 
  onIndicadoresChange 
}: MetricasEVMProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'indicadores' | 'analise'>('overview');

  const getStatusColor = (value: number, threshold: number = 1.0) => {
    if (value >= threshold) return 'text-green-600 bg-green-100';
    if (value >= threshold * 0.9) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (value: number, threshold: number = 1.0) => {
    if (value >= threshold) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value >= threshold * 0.9) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const calcularEAC = () => {
    if (metricas.cpi > 0) {
      return metricas.bac / metricas.cpi;
    }
    return metricas.bac;
  };

  const calcularETC = () => {
    return calcularEAC() - metricas.ac;
  };

  const calcularVAC = () => {
    return metricas.bac - calcularEAC();
  };

  const eac = calcularEAC();
  const etc = calcularETC();
  const vac = calcularVAC();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="h-6 w-6 mr-3 text-indigo-600" />
            Métricas EVM - Earned Value Management
          </h2>
          <p className="text-gray-600 mt-1">Controlo de performance e progresso do projeto</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('indicadores')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'indicadores' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Indicadores
          </button>
          <button
            onClick={() => setActiveTab('analise')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'analise' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Análise
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* SPI - Schedule Performance Index */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">SPI</span>
                </div>
                {getTrendIcon(metricas.spi)}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {metricas.spi.toFixed(2)}
              </div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metricas.spi)}`}>
                Schedule Performance Index
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {metricas.spi >= 1.0 ? 'Avanço no prazo' : 'Atraso no prazo'}
              </div>
            </div>

            {/* CPI - Cost Performance Index */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">CPI</span>
                </div>
                {getTrendIcon(metricas.cpi)}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {metricas.cpi.toFixed(2)}
              </div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metricas.cpi)}`}>
                Cost Performance Index
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {metricas.cpi >= 1.0 ? 'Dentro do orçamento' : 'Acima do orçamento'}
              </div>
            </div>

            {/* SV - Schedule Variance */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">SV</span>
                </div>
                {metricas.sv >= 0 ? 
                  <TrendingUp className="h-4 w-4 text-green-600" /> : 
                  <TrendingDown className="h-4 w-4 text-red-600" />
                }
              </div>
              <div className={`text-3xl font-bold mb-2 ${metricas.sv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metricas.sv >= 0 ? '+' : ''}{metricas.sv.toLocaleString('pt-PT')}€
              </div>
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                Schedule Variance
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {metricas.sv >= 0 ? 'Avanço no cronograma' : 'Atraso no cronograma'}
              </div>
            </div>

            {/* CV - Cost Variance */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">CV</span>
                </div>
                {metricas.cv >= 0 ? 
                  <TrendingUp className="h-4 w-4 text-green-600" /> : 
                  <TrendingDown className="h-4 w-4 text-red-600" />
                }
              </div>
              <div className={`text-3xl font-bold mb-2 ${metricas.cv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metricas.cv >= 0 ? '+' : ''}{metricas.cv.toLocaleString('pt-PT')}€
              </div>
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                Cost Variance
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {metricas.cv >= 0 ? 'Poupança no custo' : 'Excesso no custo'}
              </div>
            </div>
          </div>

          {/* Valores EVM */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">BAC</h3>
                  <p className="text-sm text-gray-600">Budget at Completion</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {metricas.bac.toLocaleString('pt-PT')}€
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">EV</h3>
                  <p className="text-sm text-gray-600">Earned Value</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {metricas.ev.toLocaleString('pt-PT')}€
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AC</h3>
                  <p className="text-sm text-gray-600">Actual Cost</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {metricas.ac.toLocaleString('pt-PT')}€
              </div>
            </div>
          </div>

          {/* Projeções */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">EAC</h3>
                  <p className="text-sm text-gray-600">Estimate at Completion</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-indigo-600">
                {eac.toLocaleString('pt-PT')}€
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ETC</h3>
                  <p className="text-sm text-gray-600">Estimate to Complete</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {etc.toLocaleString('pt-PT')}€
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Percent className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">VAC</h3>
                  <p className="text-sm text-gray-600">Variance at Completion</p>
                </div>
              </div>
              <div className={`text-2xl font-bold ${vac >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {vac >= 0 ? '+' : ''}{vac.toLocaleString('pt-PT')}€
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Indicadores Tab */}
      {activeTab === 'indicadores' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Indicadores de Performance</h3>
            <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Novo Indicador
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {indicadores.map((indicador) => (
              <div key={indicador.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-indigo-600" />
                    <span className="font-semibold text-gray-900">{indicador.nome}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {indicador.valor_atual}
                  <span className="text-lg text-gray-500 ml-1">{indicador.unidade}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Meta: {indicador.valor_meta} {indicador.unidade}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    indicador.valor_atual >= indicador.valor_meta 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {indicador.valor_atual >= indicador.valor_meta ? 'Atingido' : 'Pendente'}
                  </span>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  {indicador.descricao}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Análise Tab */}
      {activeTab === 'analise' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Análise de Performance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Análise de Cronograma</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">SPI Atual:</span>
                    <span className={`font-semibold ${getStatusColor(metricas.spi).split(' ')[0]}`}>
                      {metricas.spi.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metricas.spi)}`}>
                      {metricas.spi >= 1.0 ? 'No Prazo' : metricas.spi >= 0.9 ? 'Atenção' : 'Atrasado'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Variance:</span>
                    <span className={`font-semibold ${metricas.sv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metricas.sv >= 0 ? '+' : ''}{metricas.sv.toLocaleString('pt-PT')}€
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Análise de Custos</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">CPI Atual:</span>
                    <span className={`font-semibold ${getStatusColor(metricas.cpi).split(' ')[0]}`}>
                      {metricas.cpi.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metricas.cpi)}`}>
                      {metricas.cpi >= 1.0 ? 'No Orçamento' : metricas.cpi >= 0.9 ? 'Atenção' : 'Acima do Orçamento'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Variance:</span>
                    <span className={`font-semibold ${metricas.cv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metricas.cv >= 0 ? '+' : ''}{metricas.cv.toLocaleString('pt-PT')}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Recomendações</h4>
              <div className="space-y-2">
                {metricas.spi < 1.0 && (
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      O projeto está atrasado. Considere acelerar atividades críticas ou reavaliar o cronograma.
                    </span>
                  </div>
                )}
                {metricas.cpi < 1.0 && (
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      Os custos estão acima do orçamento. Analise as causas e implemente medidas de controlo.
                    </span>
                  </div>
                )}
                {metricas.spi >= 1.0 && metricas.cpi >= 1.0 && (
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      Excelente performance! O projeto está dentro do prazo e orçamento.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
