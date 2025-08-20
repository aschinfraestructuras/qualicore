import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Shield, Target, TrendingUp, Plus, Edit, Trash2, 
  AlertCircle, CheckCircle, Clock, DollarSign, Users, FileText, Calendar 
} from 'lucide-react';
import { RiscoObra, PlanoMitigacaoRiscos, AuditoriaRisco } from '@/types';
import RiscoForm from './forms/RiscoForm';
import toast from 'react-hot-toast';

interface GestaoRiscosProps {
  riscos: RiscoObra[];
  planoMitigacao: PlanoMitigacaoRiscos;
  auditorias: AuditoriaRisco[];
  onRiscosChange: (riscos: RiscoObra[]) => void;
  onPlanoMitigacaoChange: (plano: PlanoMitigacaoRiscos) => void;
  onAuditoriasChange: (auditorias: AuditoriaRisco[]) => void;
}

export default function GestaoRiscos({ 
  riscos, 
  planoMitigacao, 
  auditorias, 
  onRiscosChange, 
  onPlanoMitigacaoChange, 
  onAuditoriasChange 
}: GestaoRiscosProps) {
  const [activeTab, setActiveTab] = useState<'riscos' | 'mitigacao' | 'auditorias'>('riscos');
  const [showRiscoForm, setShowRiscoForm] = useState(false);
  const [editingRisco, setEditingRisco] = useState<RiscoObra | null>(null);

  const getNivelRiscoColor = (nivel: string) => {
    switch (nivel) {
      case 'critico': return 'text-red-600 bg-red-100 border-red-200';
      case 'alto': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medio': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'baixo': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'text-red-600 bg-red-100';
      case 'mitigado': return 'text-yellow-600 bg-yellow-100';
      case 'resolvido': return 'text-green-600 bg-green-100';
      case 'ocorreu': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProbabilidadeColor = (probabilidade: string) => {
    switch (probabilidade) {
      case 'critica': return 'text-red-600';
      case 'alta': return 'text-orange-600';
      case 'media': return 'text-yellow-600';
      case 'baixa': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactoColor = (impacto: string) => {
    switch (impacto) {
      case 'critico': return 'text-red-600';
      case 'alto': return 'text-orange-600';
      case 'medio': return 'text-yellow-600';
      case 'baixo': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Calcular estatísticas
  const stats = {
    total: riscos.length,
    ativos: riscos.filter(r => r.status === 'ativo').length,
    mitigados: riscos.filter(r => r.status === 'mitigado').length,
    resolvidos: riscos.filter(r => r.status === 'resolvido').length,
    criticos: riscos.filter(r => r.nivel_risco === 'critico').length,
    altos: riscos.filter(r => r.nivel_risco === 'alto').length,
    medios: riscos.filter(r => r.nivel_risco === 'medio').length,
    baixos: riscos.filter(r => r.nivel_risco === 'baixo').length,
  };

  const handleSaveRisco = (risco: RiscoObra) => {
    if (editingRisco) {
      const updatedRiscos = riscos.map(r => 
        r.id === risco.id ? risco : r
      );
      onRiscosChange(updatedRiscos);
      toast.success('Risco atualizado com sucesso!');
    } else {
      onRiscosChange([...riscos, risco]);
      toast.success('Risco criado com sucesso!');
    }
    setEditingRisco(null);
  };

  const handleEditRisco = (risco: RiscoObra) => {
    setEditingRisco(risco);
    setShowRiscoForm(true);
  };

  const handleDeleteRisco = (riscoId: string) => {
    const updatedRiscos = riscos.filter(r => r.id !== riscoId);
    onRiscosChange(updatedRiscos);
    toast.success('Risco removido com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gestão de Riscos</h2>
            <p className="text-gray-600">Identificação, análise e mitigação de riscos</p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setEditingRisco(null);
            setShowRiscoForm(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Risco
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Riscos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-gray-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Riscos Ativos</p>
              <p className="text-2xl font-bold text-red-600">{stats.ativos}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Riscos Críticos</p>
              <p className="text-2xl font-bold text-red-600">{stats.criticos}</p>
            </div>
            <Target className="h-8 w-8 text-red-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mitigados</p>
              <p className="text-2xl font-bold text-green-600">{stats.mitigados}</p>
            </div>
            <Shield className="h-8 w-8 text-green-400" />
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('riscos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'riscos'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Riscos ({riscos.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('mitigacao')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mitigacao'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Plano de Mitigação</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('auditorias')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'auditorias'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Auditorias ({auditorias.length})</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'riscos' && (
        <div className="space-y-4">
          {riscos.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum risco identificado</h3>
              <p className="text-gray-600 mb-4">Identifique e registe os riscos potenciais da obra</p>
              <button
                onClick={() => {
                  setEditingRisco(null);
                  setShowRiscoForm(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Identificar Primeiro Risco
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {riscos.map((risco, index) => (
                <motion.div
                  key={risco.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow ${getNivelRiscoColor(risco.nivel_risco)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          <h3 className="text-lg font-semibold text-gray-900">{risco.descricao}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(risco.status)}`}>
                          {risco.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNivelRiscoColor(risco.nivel_risco)}`}>
                          {risco.nivel_risco}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Categoria</p>
                            <p className="text-sm font-medium capitalize">{risco.categoria}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Probabilidade</p>
                            <p className={`text-sm font-medium capitalize ${getProbabilidadeColor(risco.probabilidade)}`}>
                              {risco.probabilidade}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Impacto</p>
                            <p className={`text-sm font-medium capitalize ${getImpactoColor(risco.impacto)}`}>
                              {risco.impacto}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Responsável</p>
                            <p className="text-sm font-medium">{risco.responsavel}</p>
                          </div>
                        </div>
                      </div>
                      
                      {risco.medidas_preventivas.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Medidas Preventivas:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {risco.medidas_preventivas.map((medida, idx) => (
                              <li key={idx} className="text-sm text-gray-600">{medida}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {risco.custo_estimado && (
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Custo Estimado</p>
                            <p className="text-sm font-medium">
                              {new Intl.NumberFormat('pt-PT', { 
                                style: 'currency', 
                                currency: 'EUR' 
                              }).format(risco.custo_estimado)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => handleEditRisco(risco)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteRisco(risco.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'mitigacao' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Plano de Mitigação de Riscos</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Estratégias Gerais</h4>
                <p className="text-sm text-blue-700">
                  {planoMitigacao.estrategias_gerais.length} estratégias definidas
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Recursos de Mitigação</h4>
                <p className="text-sm text-green-700">
                  {planoMitigacao.recursos_mitigacao.length} recursos disponíveis
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">Procedimentos de Emergência</h4>
                <p className="text-sm text-orange-700">
                  {planoMitigacao.procedimentos_emergencia.length} procedimentos
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Versão: {planoMitigacao.versao}</p>
                <p className="text-sm text-gray-600">Responsável: {planoMitigacao.responsavel}</p>
              </div>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Edit className="h-4 w-4 mr-2" />
                Editar Plano
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'auditorias' && (
        <div className="space-y-4">
          {auditorias.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma auditoria realizada</h3>
              <p className="text-gray-600 mb-4">Realize auditorias para verificar a eficácia das medidas de mitigação</p>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Agendar Primeira Auditoria
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {auditorias.map((auditoria, index) => (
                <motion.div
                  key={auditoria.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900">{auditoria.escopo}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          auditoria.tipo === 'preventiva' ? 'text-blue-600 bg-blue-100' :
                          auditoria.tipo === 'corretiva' ? 'text-orange-600 bg-orange-100' :
                          'text-green-600 bg-green-100'
                        }`}>
                          {auditoria.tipo}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Data</p>
                            <p className="text-sm font-medium">{new Date(auditoria.data).toLocaleDateString('pt-PT')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Auditor</p>
                            <p className="text-sm font-medium">{auditoria.auditor}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Riscos Avaliados</p>
                            <p className="text-sm font-medium">{auditoria.riscos_avaliados.length}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Conformidades</p>
                            <p className="text-sm font-medium">{auditoria.conformidades.length}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Forms */}
      <AnimatePresence>
        {showRiscoForm && (
          <RiscoForm
            isOpen={showRiscoForm}
            onClose={() => {
              setShowRiscoForm(false);
              setEditingRisco(null);
            }}
            risco={editingRisco}
            onSave={handleSaveRisco}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
