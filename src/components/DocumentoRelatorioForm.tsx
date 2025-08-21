import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Save, Download, FileText, BarChart3, Calendar, 
  Filter, Search, Settings, CheckCircle, Clock, 
  AlertTriangle, Info, Shield, BookOpen, TrendingUp,
  Users, MapPin, FileCheck, FileX, FilePlus
} from 'lucide-react';
import toast from 'react-hot-toast';

interface DocumentoRelatorioFormProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateReport: (config: ReportConfig) => void;
  documentos: any[];
  darkMode?: boolean;
}

interface ReportConfig {
  tipo: 'executivo' | 'detalhado' | 'vencimentos' | 'personalizado';
  titulo: string;
  periodo: {
    inicio: string;
    fim: string;
  };
  filtros: {
    tipo?: string[];
    estado?: string[];
    zona?: string[];
    responsavel?: string[];
  };
  incluirGraficos: boolean;
  incluirTabelas: boolean;
  incluirEstatisticas: boolean;
  formato: 'pdf' | 'excel';
}

const TIPOS_DOCUMENTO = [
  'especificacao', 'projeto', 'relatorio', 'certificado', 
  'manual', 'procedimento', 'instrucao', 'formulario'
];

const ESTADOS_DOCUMENTO = [
  'aprovado', 'em_analise', 'pendente', 'reprovado', 'vencido'
];

export default function DocumentoRelatorioForm({ 
  isOpen, 
  onClose, 
  onGenerateReport, 
  documentos,
  darkMode = false 
}: DocumentoRelatorioFormProps) {
  const [config, setConfig] = useState<ReportConfig>({
    tipo: 'executivo',
    titulo: '',
    periodo: {
      inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fim: new Date().toISOString().split('T')[0]
    },
    filtros: {
      tipo: [],
      estado: [],
      zona: [],
      responsavel: []
    },
    incluirGraficos: true,
    incluirTabelas: true,
    incluirEstatisticas: true,
    formato: 'pdf'
  });

  const [activeStep, setActiveStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Extrair opções únicas dos documentos
  const zonas = [...new Set(documentos.map(d => d.zona).filter(Boolean))];
  const responsaveis = [...new Set(documentos.map(d => d.responsavel).filter(Boolean))];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerateReport(config);
      toast.success('Relatório gerado com sucesso!');
      onClose();
    } catch (error) {
      toast.error('Erro ao gerar relatório');
    } finally {
      setIsGenerating(false);
    }
  };

  const getTituloPadrao = () => {
    const tipos = {
      'executivo': 'Relatório Executivo de Documentos',
      'detalhado': 'Relatório Detalhado de Documentos',
      'vencimentos': 'Relatório de Vencimentos',
      'personalizado': 'Relatório Personalizado de Documentos'
    };
    return tipos[config.tipo] || 'Relatório de Documentos';
  };

  useEffect(() => {
    if (isOpen) {
      setConfig(prev => ({
        ...prev,
        titulo: getTituloPadrao()
      }));
    }
  }, [isOpen, config.tipo]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${
            darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          }`}
        >
          {/* Header */}
          <div className={`sticky top-0 z-10 p-6 border-b ${
            darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-blue-600' : 'bg-blue-500'
                }`}>
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Gerador de Relatórios
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Configure e gere relatórios personalizados
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= activeStep 
                      ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`
                      : `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      step < activeStep 
                        ? (darkMode ? 'bg-blue-600' : 'bg-blue-500')
                        : (darkMode ? 'bg-gray-700' : 'bg-gray-200')
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Tipo de Relatório */}
            {activeStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Tipo de Relatório
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { 
                        tipo: 'executivo', 
                        titulo: 'Relatório Executivo', 
                        descricao: 'Visão geral com KPIs principais',
                        icon: TrendingUp,
                        color: 'from-blue-500 to-indigo-500'
                      },
                      { 
                        tipo: 'detalhado', 
                        titulo: 'Relatório Detalhado', 
                        descricao: 'Análise completa com todos os dados',
                        icon: BarChart3,
                        color: 'from-purple-500 to-pink-500'
                      },
                      { 
                        tipo: 'vencimentos', 
                        titulo: 'Relatório de Vencimentos', 
                        descricao: 'Foco em documentos próximos do vencimento',
                        icon: Calendar,
                        color: 'from-emerald-500 to-green-500'
                      },
                      { 
                        tipo: 'personalizado', 
                        titulo: 'Relatório Personalizado', 
                        descricao: 'Configure filtros e opções específicas',
                        icon: Settings,
                        color: 'from-orange-500 to-red-500'
                      }
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <motion.div
                          key={option.tipo}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setConfig(prev => ({ ...prev, tipo: option.tipo as any }))}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                            config.tipo === option.tipo
                              ? `${darkMode ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500 bg-blue-50'}`
                              : `${darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`
                          }`}
                        >
                          <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center mb-3`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {option.titulo}
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {option.descricao}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Configurações */}
            {activeStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Configurações do Relatório
                  </h3>
                  
                  {/* Título */}
                  <div className="mb-4">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Título do Relatório
                    </label>
                    <input
                      type="text"
                      value={config.titulo}
                      onChange={(e) => setConfig(prev => ({ ...prev, titulo: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }`}
                      placeholder="Digite o título do relatório"
                    />
                  </div>

                  {/* Período */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Data Início
                      </label>
                      <input
                        type="date"
                        value={config.periodo.inicio}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          periodo: { ...prev.periodo, inicio: e.target.value }
                        }))}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Data Fim
                      </label>
                      <input
                        type="date"
                        value={config.periodo.fim}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          periodo: { ...prev.periodo, fim: e.target.value }
                        }))}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Filtros */}
                  <div className="space-y-4">
                    <h4 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Filtros (Opcional)
                    </h4>
                    
                    {/* Tipo */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Tipo de Documento
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {TIPOS_DOCUMENTO.map((tipo) => (
                          <label key={tipo} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={config.filtros.tipo?.includes(tipo)}
                              onChange={(e) => {
                                const newTipos = e.target.checked
                                  ? [...(config.filtros.tipo || []), tipo]
                                  : (config.filtros.tipo || []).filter(t => t !== tipo);
                                setConfig(prev => ({
                                  ...prev,
                                  filtros: { ...prev.filtros, tipo: newTipos }
                                }));
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`text-sm capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {tipo}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Estado */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Estado
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {ESTADOS_DOCUMENTO.map((estado) => (
                          <label key={estado} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={config.filtros.estado?.includes(estado)}
                              onChange={(e) => {
                                const newEstados = e.target.checked
                                  ? [...(config.filtros.estado || []), estado]
                                  : (config.filtros.estado || []).filter(e => e !== estado);
                                setConfig(prev => ({
                                  ...prev,
                                  filtros: { ...prev.filtros, estado: newEstados }
                                }));
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className={`text-sm capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {estado.replace('_', ' ')}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Opções */}
            {activeStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Opções do Relatório
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Incluir Gráficos */}
                    <div className={`p-4 rounded-xl border ${
                      darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="h-5 w-5 text-blue-500" />
                          <div>
                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Incluir Gráficos
                            </h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Adiciona visualizações gráficas ao relatório
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.incluirGraficos}
                            onChange={(e) => setConfig(prev => ({ ...prev, incluirGraficos: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            darkMode 
                              ? 'bg-gray-600 peer-checked:bg-blue-600' 
                              : 'bg-gray-300 peer-checked:bg-blue-600'
                          }`}></div>
                        </label>
                      </div>
                    </div>

                    {/* Incluir Tabelas */}
                    <div className={`p-4 rounded-xl border ${
                      darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-green-500" />
                          <div>
                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Incluir Tabelas
                            </h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Adiciona tabelas detalhadas com os dados
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.incluirTabelas}
                            onChange={(e) => setConfig(prev => ({ ...prev, incluirTabelas: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            darkMode 
                              ? 'bg-gray-600 peer-checked:bg-green-600' 
                              : 'bg-gray-300 peer-checked:bg-green-600'
                          }`}></div>
                        </label>
                      </div>
                    </div>

                    {/* Incluir Estatísticas */}
                    <div className={`p-4 rounded-xl border ${
                      darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="h-5 w-5 text-purple-500" />
                          <div>
                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Incluir Estatísticas
                            </h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Adiciona métricas e KPIs ao relatório
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.incluirEstatisticas}
                            onChange={(e) => setConfig(prev => ({ ...prev, incluirEstatisticas: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
                            darkMode 
                              ? 'bg-gray-600 peer-checked:bg-purple-600' 
                              : 'bg-gray-300 peer-checked:bg-purple-600'
                          }`}></div>
                        </label>
                      </div>
                    </div>

                    {/* Formato */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Formato de Saída
                      </label>
                      <div className="flex space-x-4">
                        {[
                          { value: 'pdf', label: 'PDF', icon: FileText },
                          { value: 'excel', label: 'Excel', icon: BarChart3 }
                        ].map((option) => {
                          const Icon = option.icon;
                          return (
                            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                value={option.value}
                                checked={config.formato === option.value}
                                onChange={(e) => setConfig(prev => ({ ...prev, formato: e.target.value as 'pdf' | 'excel' }))}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <Icon className="h-4 w-4" />
                              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {option.label}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className={`sticky bottom-0 p-6 border-t ${
            darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                disabled={activeStep === 1}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  activeStep === 1
                    ? `${darkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-100 text-gray-400'} cursor-not-allowed`
                    : `${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                }`}
              >
                Anterior
              </button>

              <div className="flex items-center space-x-3">
                {activeStep < 3 ? (
                  <button
                    onClick={() => setActiveStep(activeStep + 1)}
                    className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                      darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 ${
                      isGenerating
                        ? `${darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-400 text-gray-600'} cursor-not-allowed`
                        : `${darkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}`
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Gerando...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Gerar Relatório</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
