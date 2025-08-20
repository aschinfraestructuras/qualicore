import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, TreePine, Globe, Plus, Edit, Trash2, 
  FileText, Users, Target, Calendar, Clock, TrendingUp, TrendingDown,
  Activity, Zap, Percent, Award, Eye, Download, Upload,
  Droplets, Wind, Sun, Recycle, AlertTriangle, CheckCircle
} from 'lucide-react';
import { GestaoAmbientalObra, CertificacaoAmbiental } from '@/types';
import toast from 'react-hot-toast';

interface GestaoAmbientalProps {
  gestaoAmbiental: GestaoAmbientalObra;
  certificacoes: CertificacaoAmbiental[];
  onGestaoAmbientalChange: (gestao: GestaoAmbientalObra) => void;
  onCertificacoesChange: (certificacoes: CertificacaoAmbiental[]) => void;
}

export default function GestaoAmbiental({ 
  gestaoAmbiental, 
  certificacoes, 
  onGestaoAmbientalChange, 
  onCertificacoesChange 
}: GestaoAmbientalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'impactos' | 'mitigacao' | 'monitorizacao' | 'certificacoes'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'text-green-600 bg-green-100';
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'expirado': return 'text-red-600 bg-red-100';
      case 'renovacao': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impacto: string) => {
    switch (impacto) {
      case 'baixo': return 'text-green-600 bg-green-100';
      case 'medio': return 'text-yellow-600 bg-yellow-100';
      case 'alto': return 'text-orange-600 bg-orange-100';
      case 'critico': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < threshold) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const stats = {
    totalImpactos: gestaoAmbiental.impactos_ambientais.length,
    impactosMitigados: gestaoAmbiental.impactos_ambientais.filter(i => i.status_mitigacao === 'mitigado').length,
    impactosPendentes: gestaoAmbiental.impactos_ambientais.filter(i => i.status_mitigacao === 'pendente').length,
    percentualMitigacao: gestaoAmbiental.impactos_ambientais.length > 0 ? 
      (gestaoAmbiental.impactos_ambientais.filter(i => i.status_mitigacao === 'mitigado').length / gestaoAmbiental.impactos_ambientais.length) * 100 : 0,
    totalCertificacoes: certificacoes.length,
    certificacoesAtivas: certificacoes.filter(c => c.status === 'ativo').length,
    certificacoesExpiradas: certificacoes.filter(c => c.status === 'expirado').length,
  };

  const indicadoresAmbientais = [
    { nome: 'Consumo de Água', valor: '2.5', unidade: 'm³/dia', tendencia: 'down', meta: '3.0' },
    { nome: 'Consumo de Energia', valor: '45.2', unidade: 'kWh/dia', tendencia: 'stable', meta: '50.0' },
    { nome: 'Emissões CO2', valor: '12.8', unidade: 'ton/mês', tendencia: 'down', meta: '15.0' },
    { nome: 'Resíduos Reciclados', valor: '78.5', unidade: '%', tendencia: 'up', meta: '75.0' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Leaf className="h-6 w-6 mr-3 text-green-600" />
            Gestão Ambiental
          </h2>
          <p className="text-gray-600 mt-1">Controlo de impactos ambientais e sustentabilidade</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('impactos')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'impactos' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Impactos
          </button>
          <button
            onClick={() => setActiveTab('mitigacao')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'mitigacao' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Mitigação
          </button>
          <button
            onClick={() => setActiveTab('monitorizacao')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'monitorizacao' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monitorização
          </button>
          <button
            onClick={() => setActiveTab('certificacoes')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'certificacoes' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Certificações
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TreePine className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Impactos</span>
                </div>
                {getTrendIcon(stats.totalImpactos)}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.totalImpactos}
              </div>
              <div className="text-sm text-gray-600">
                Identificados no projeto
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Mitigados</span>
                </div>
                {getTrendIcon(stats.impactosMitigados)}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.percentualMitigacao.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">
                {stats.impactosMitigados} de {stats.totalImpactos} impactos
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Certificações</span>
                </div>
                {getTrendIcon(stats.certificacoesAtivas)}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.certificacoesAtivas}
              </div>
              <div className="text-sm text-gray-600">
                Ativas ({stats.totalCertificacoes} total)
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Recycle className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Sustentabilidade</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                85%
              </div>
              <div className="text-sm text-gray-600">
                Índice de sustentabilidade
              </div>
            </div>
          </div>

          {/* Indicadores Ambientais */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicadores Ambientais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {indicadoresAmbientais.map((indicador, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{indicador.nome}</h4>
                    {indicador.tendencia === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : indicador.tendencia === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <Activity className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {indicador.valor} {indicador.unidade}
                  </div>
                  <div className="text-sm text-gray-600">
                    Meta: {indicador.meta} {indicador.unidade}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plano Ambiental */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-green-600" />
                Plano Ambiental
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Versão</p>
                  <p className="font-semibold text-gray-900">{gestaoAmbiental.versao_plano}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Responsável</p>
                  <p className="font-semibold text-gray-900">{gestaoAmbiental.responsavel_ambiental}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Última Revisão</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(gestaoAmbiental.data_revisao_plano).toLocaleDateString('pt-PT')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Ativo
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                Objetivos Ambientais
              </h3>
              <div className="space-y-3">
                {gestaoAmbiental.objetivos_ambientais.map((objetivo, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-900">{objetivo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Impactos Tab */}
      {activeTab === 'impactos' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Impactos Ambientais</h3>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Novo Impacto
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gestaoAmbiental.impactos_ambientais.map((impacto) => (
              <div key={impacto.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold text-gray-900">{impacto.tipo_impacto}</span>
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
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Descrição</p>
                    <p className="text-sm text-gray-900">{impacto.descricao}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Nível de Impacto</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(impacto.nivel_impacto)}`}>
                        {impacto.nivel_impacto}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status Mitigação</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(impacto.status_mitigacao)}`}>
                        {impacto.status_mitigacao}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Medidas de Mitigação</p>
                    <p className="text-sm text-gray-900">{impacto.medidas_mitigacao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mitigação Tab */}
      {activeTab === 'mitigacao' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Medidas de Mitigação</h3>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Nova Medida
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Medidas Implementadas</h4>
              <div className="space-y-3">
                {gestaoAmbiental.medidas_mitigacao.map((medida, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">{medida.nome}</h5>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Implementada
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{medida.descricao}</p>
                    <div className="text-xs text-gray-500">
                      Responsável: {medida.responsavel} | Data: {new Date(medida.data_implementacao).toLocaleDateString('pt-PT')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Recursos Ambientais</h4>
              <div className="space-y-3">
                {gestaoAmbiental.recursos_ambientais.map((recurso, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">{recurso.nome}</h5>
                      <span className="text-sm text-gray-600">{recurso.quantidade} {recurso.unidade}</span>
                    </div>
                    <p className="text-sm text-gray-600">{recurso.descricao}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Monitorização Tab */}
      {activeTab === 'monitorizacao' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Monitorização Ambiental</h3>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Nova Monitorização
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gestaoAmbiental.monitorizacao_ambiental.map((monitorizacao) => (
              <div key={monitorizacao.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-gray-900">{monitorizacao.tipo_monitorizacao}</span>
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
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Parâmetro</p>
                    <p className="font-medium text-gray-900">{monitorizacao.parametro}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Valor Atual</p>
                    <p className="font-medium text-gray-900">{monitorizacao.valor_atual} {monitorizacao.unidade}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Limite</p>
                    <p className="font-medium text-gray-900">{monitorizacao.limite} {monitorizacao.unidade}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Frequência</p>
                    <p className="font-medium text-gray-900">{monitorizacao.frequencia}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Última Medição</p>
                    <p className="font-medium text-gray-900">
                      {new Date(monitorizacao.data_ultima_medicao).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Certificações Tab */}
      {activeTab === 'certificacoes' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Certificações Ambientais</h3>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Nova Certificação
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificacoes.map((certificacao) => (
              <div key={certificacao.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-gray-900">{certificacao.tipo}</span>
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
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Organismo</p>
                    <p className="font-medium text-gray-900">{certificacao.organismo}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Número</p>
                    <p className="font-medium text-gray-900">{certificacao.numero}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Vencimento</p>
                      <p className="font-medium text-gray-900">
                        {new Date(certificacao.data_vencimento).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(certificacao.status)}`}>
                        {certificacao.status}
                      </span>
                    </div>
                  </div>
                  
                  {certificacao.observacoes && (
                    <div>
                      <p className="text-sm text-gray-600">Observações</p>
                      <p className="text-sm text-gray-900">{certificacao.observacoes}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <button className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </button>
                  <button className="inline-flex items-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4 mr-1" />
                    Certificado
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
