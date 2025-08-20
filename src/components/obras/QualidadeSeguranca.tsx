import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Shield, AlertTriangle, Plus, Edit, Trash2, 
  FileText, Users, Target, Calendar, Clock, TrendingUp, TrendingDown,
  Activity, Zap, Percent, Award, Eye, Download, Upload,
  HardHat, FirstAid, FireExtinguisher, Safety, Warning, CheckSquare
} from 'lucide-react';
import { PlanoQualidadeObra, PlanoSegurancaObra, InspecaoQualidade, AcidenteIncidente } from '@/types';
import toast from 'react-hot-toast';

interface QualidadeSegurancaProps {
  planoQualidade: PlanoQualidadeObra;
  planoSeguranca: PlanoSegurancaObra;
  inspecoes: InspecaoQualidade[];
  acidentes: AcidenteIncidente[];
  onPlanoQualidadeChange: (plano: PlanoQualidadeObra) => void;
  onPlanoSegurancaChange: (plano: PlanoSegurancaObra) => void;
  onInspecoesChange: (inspecoes: InspecaoQualidade[]) => void;
  onAcidentesChange: (acidentes: AcidenteIncidente[]) => void;
}

export default function QualidadeSeguranca({ 
  planoQualidade, 
  planoSeguranca, 
  inspecoes, 
  acidentes, 
  onPlanoQualidadeChange, 
  onPlanoSegurancaChange, 
  onInspecoesChange, 
  onAcidentesChange 
}: QualidadeSegurancaProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'qualidade' | 'seguranca' | 'inspecoes' | 'acidentes'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('mes');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'conformidade': return 'text-green-600 bg-green-100';
      case 'nao_conformidade': return 'text-red-600 bg-red-100';
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'em_correcao': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severidade: string) => {
    switch (severidade) {
      case 'baixa': return 'text-green-600 bg-green-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'alta': return 'text-orange-600 bg-orange-100';
      case 'critica': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < threshold) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const stats = {
    totalInspecoes: inspecoes.length,
    inspecoesConformes: inspecoes.filter(i => i.resultado === 'conformidade').length,
    inspecoesNaoConformes: inspecoes.filter(i => i.resultado === 'nao_conformidade').length,
    percentualConformidade: inspecoes.length > 0 ? 
      (inspecoes.filter(i => i.resultado === 'conformidade').length / inspecoes.length) * 100 : 0,
    totalAcidentes: acidentes.length,
    acidentesMes: acidentes.filter(a => {
      const dataAcidente = new Date(a.data_ocorrencia);
      const hoje = new Date();
      return dataAcidente.getMonth() === hoje.getMonth() && dataAcidente.getFullYear() === hoje.getFullYear();
    }).length,
    acidentesLeves: acidentes.filter(a => a.severidade === 'baixa').length,
    acidentesGraves: acidentes.filter(a => a.severidade === 'alta' || a.severidade === 'critica').length,
  };

  const procedimentosQualidade = [
    { nome: 'Controlo de Materiais', status: 'ativo', responsavel: 'Eng. Qualidade' },
    { nome: 'Inspeção de Obra', status: 'ativo', responsavel: 'Fiscal de Obra' },
    { nome: 'Ensaios de Laboratório', status: 'ativo', responsavel: 'Lab. Técnico' },
    { nome: 'Documentação Técnica', status: 'ativo', responsavel: 'Técnico Doc.' },
  ];

  const procedimentosSeguranca = [
    { nome: 'Equipamentos de Proteção', status: 'ativo', responsavel: 'Coord. Segurança' },
    { nome: 'Sinalização de Obra', status: 'ativo', responsavel: 'Técnico Segurança' },
    { nome: 'Formação de Trabalhadores', status: 'ativo', responsavel: 'Formador' },
    { nome: 'Inspeções de Segurança', status: 'ativo', responsavel: 'Inspetor' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <CheckCircle className="h-6 w-6 mr-3 text-amber-600" />
            Qualidade & Segurança
          </h2>
          <p className="text-gray-600 mt-1">Gestão de qualidade, segurança e conformidade</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' 
                ? 'bg-amber-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('qualidade')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'qualidade' 
                ? 'bg-amber-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Qualidade
          </button>
          <button
            onClick={() => setActiveTab('seguranca')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'seguranca' 
                ? 'bg-amber-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Segurança
          </button>
          <button
            onClick={() => setActiveTab('inspecoes')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'inspecoes' 
                ? 'bg-amber-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Inspeções
          </button>
          <button
            onClick={() => setActiveTab('acidentes')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'acidentes' 
                ? 'bg-amber-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Acidentes
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
                  <CheckSquare className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Conformidade</span>
                </div>
                {getTrendIcon(stats.percentualConformidade, 90)}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.percentualConformidade.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">
                {stats.inspecoesConformes} de {stats.totalInspecoes} inspeções
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-600">Não Conformidades</span>
                </div>
                {getTrendIcon(stats.inspecoesNaoConformes, 0)}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.inspecoesNaoConformes}
              </div>
              <div className="text-sm text-gray-600">
                Requerem correção
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Acidentes</span>
                </div>
                {getTrendIcon(stats.acidentesMes, 0)}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stats.acidentesMes}
              </div>
              <div className="text-sm text-gray-600">
                Este mês ({stats.totalAcidentes} total)
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <HardHat className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-600">Dias Sem Acidentes</span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                45
              </div>
              <div className="text-sm text-gray-600">
                Recorde atual
              </div>
            </div>
          </div>

          {/* Quality & Safety Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Procedimentos de Qualidade
              </h3>
              <div className="space-y-3">
                {procedimentosQualidade.map((procedimento, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{procedimento.nome}</p>
                      <p className="text-sm text-gray-600">{procedimento.responsavel}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {procedimento.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Procedimentos de Segurança
              </h3>
              <div className="space-y-3">
                {procedimentosSeguranca.map((procedimento, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{procedimento.nome}</p>
                      <p className="text-sm text-gray-600">{procedimento.responsavel}</p>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {procedimento.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
            <div className="space-y-4">
              {inspecoes.slice(0, 5).map((inspecao, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-3 h-3 rounded-full ${
                    inspecao.resultado === 'conformidade' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{inspecao.tipo_inspecao}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(inspecao.data_inspecao).toLocaleDateString('pt-PT')} - {inspecao.inspetor}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inspecao.resultado)}`}>
                    {inspecao.resultado === 'conformidade' ? 'Conforme' : 'Não Conforme'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Qualidade Tab */}
      {activeTab === 'qualidade' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Gestão da Qualidade</h3>
            <button className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Novo Procedimento
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Plano de Qualidade</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Versão</p>
                  <p className="font-semibold text-gray-900">{planoQualidade.versao}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Responsável</p>
                  <p className="font-semibold text-gray-900">{planoQualidade.responsavel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Última Revisão</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(planoQualidade.data_revisao).toLocaleDateString('pt-PT')}
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
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Objetivos de Qualidade</h4>
              <div className="space-y-3">
                {planoQualidade.objetivos_qualidade.map((objetivo, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-900">{objetivo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Procedimentos de Qualidade</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {planoQualidade.procedimentos_qualidade.map((procedimento, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-900">{procedimento.nome}</h5>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{procedimento.descricao}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Responsável: {procedimento.responsavel}</span>
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(procedimento.status)}`}>
                      {procedimento.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Segurança Tab */}
      {activeTab === 'seguranca' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Gestão da Segurança</h3>
            <button className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Novo Procedimento
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Plano de Segurança</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Versão</p>
                  <p className="font-semibold text-gray-900">{planoSeguranca.versao}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Responsável</p>
                  <p className="font-semibold text-gray-900">{planoSeguranca.responsavel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Última Revisão</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(planoSeguranca.data_revisao).toLocaleDateString('pt-PT')}
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
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Equipamentos de Proteção</h4>
              <div className="space-y-3">
                {planoSeguranca.equipamentos_protecao.map((equipamento, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <HardHat className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-900">{equipamento.nome}</span>
                    </div>
                    <span className="text-xs text-gray-600">{equipamento.quantidade} unidades</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Procedimentos de Segurança</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {planoSeguranca.procedimentos_seguranca.map((procedimento, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-900">{procedimento.nome}</h5>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{procedimento.descricao}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Responsável: {procedimento.responsavel}</span>
                    <span className={`px-2 py-1 rounded-full ${getStatusColor(procedimento.status)}`}>
                      {procedimento.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Inspeções Tab */}
      {activeTab === 'inspecoes' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Inspeções de Qualidade</h3>
            <button className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Nova Inspeção
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspecoes.map((inspecao) => (
              <div key={inspecao.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-amber-600" />
                    <span className="font-semibold text-gray-900">{inspecao.tipo_inspecao}</span>
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
                    <p className="text-sm text-gray-600">Inspetor</p>
                    <p className="font-medium text-gray-900">{inspecao.inspetor}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Data</p>
                    <p className="font-medium text-gray-900">
                      {new Date(inspecao.data_inspecao).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Resultado</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inspecao.resultado)}`}>
                      {inspecao.resultado === 'conformidade' ? 'Conforme' : 'Não Conforme'}
                    </span>
                  </div>
                  
                  {inspecao.observacoes && (
                    <div>
                      <p className="text-sm text-gray-600">Observações</p>
                      <p className="text-sm text-gray-900">{inspecao.observacoes}</p>
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
                    Relatório
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Acidentes Tab */}
      {activeTab === 'acidentes' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Registo de Acidentes e Incidentes</h3>
            <button className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Novo Registo
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Data</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Tipo</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Descrição</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Severidade</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Local</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {acidentes.map((acidente) => (
                    <tr key={acidente.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">
                          {new Date(acidente.data_ocorrencia).toLocaleDateString('pt-PT')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(acidente.data_ocorrencia).toLocaleTimeString('pt-PT')}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {acidente.tipo}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{acidente.descricao}</p>
                        <p className="text-sm text-gray-600">{acidente.envolvidos} pessoas</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(acidente.severidade)}`}>
                          {acidente.severidade}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-900">{acidente.local_ocorrencia}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
