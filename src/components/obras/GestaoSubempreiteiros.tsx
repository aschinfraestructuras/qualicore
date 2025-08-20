import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Building, Shield, FileText, Plus, Edit, Trash2, 
  Phone, Mail, MapPin, Calendar, DollarSign, CheckCircle, AlertCircle,
  TrendingUp, Award, Clock, UserCheck 
} from 'lucide-react';
import { Subempreiteiro, SeguroSubempreiteiro, EquipaSubempreteiro } from '@/types';
import SubempreiteiroForm from './forms/SubempreiteiroForm';
import toast from 'react-hot-toast';

interface GestaoSubempreiteirosProps {
  subempreiteiros: Subempreiteiro[];
  onSubempreiteirosChange: (subempreiteiros: Subempreiteiro[]) => void;
}

export default function GestaoSubempreiteiros({ 
  subempreiteiros, 
  onSubempreiteirosChange 
}: GestaoSubempreiteirosProps) {
  const [activeTab, setActiveTab] = useState<'lista' | 'analise'>('lista');
  const [showForm, setShowForm] = useState(false);
  const [editingSubempreiteiro, setEditingSubempreiteiro] = useState<Subempreiteiro | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'text-green-600 bg-green-100';
      case 'inativo': return 'text-gray-600 bg-gray-100';
      case 'concluido': return 'text-blue-600 bg-blue-100';
      case 'rescisao': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (percentual: number) => {
    if (percentual >= 80) return 'text-green-600';
    if (percentual >= 60) return 'text-yellow-600';
    if (percentual >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Calcular estatísticas
  const stats = {
    total: subempreiteiros.length,
    ativos: subempreiteiros.filter(s => s.status === 'ativo').length,
    concluidos: subempreiteiros.filter(s => s.status === 'concluido').length,
    valorTotal: subempreiteiros.reduce((acc, s) => acc + s.valor_contrato, 0),
    valorExecutado: subempreiteiros.reduce((acc, s) => acc + s.valor_executado, 0),
    percentualMedio: subempreiteiros.length > 0 
      ? subempreiteiros.reduce((acc, s) => acc + s.percentual_execucao, 0) / subempreiteiros.length 
      : 0,
    segurosAtivos: subempreiteiros.reduce((acc, s) => 
      acc + s.seguros.filter(seg => seg.status === 'ativo').length, 0
    ),
    equipasAtivas: subempreiteiros.reduce((acc, s) => 
      acc + s.equipas.filter(eq => eq.status === 'ativa').length, 0
    ),
  };

  const handleSaveSubempreiteiro = (subempreiteiro: Subempreiteiro) => {
    if (editingSubempreiteiro) {
      const updatedSubempreiteiros = subempreiteiros.map(s => 
        s.id === subempreiteiro.id ? subempreiteiro : s
      );
      onSubempreiteirosChange(updatedSubempreiteiros);
      toast.success('Subempreiteiro atualizado com sucesso!');
    } else {
      onSubempreiteirosChange([...subempreiteiros, subempreiteiro]);
      toast.success('Subempreiteiro criado com sucesso!');
    }
    setEditingSubempreiteiro(null);
  };

  const handleEditSubempreiteiro = (subempreiteiro: Subempreiteiro) => {
    setEditingSubempreiteiro(subempreiteiro);
    setShowForm(true);
  };

  const handleDeleteSubempreiteiro = (subempreiteiroId: string) => {
    const updatedSubempreiteiros = subempreiteiros.filter(s => s.id !== subempreiteiroId);
    onSubempreiteirosChange(updatedSubempreiteiros);
    toast.success('Subempreiteiro removido com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Building className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gestão de Subempreiteiros</h2>
            <p className="text-gray-600">Controle de subempreiteiros, seguros e equipas</p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setEditingSubempreiteiro(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Subempreiteiro
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
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Building className="h-8 w-8 text-gray-400" />
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
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
            </div>
            <UserCheck className="h-8 w-8 text-green-400" />
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
              <p className="text-sm text-gray-600">Valor Total</p>
              <p className="text-lg font-bold text-purple-600">
                {new Intl.NumberFormat('pt-PT', { 
                  style: 'currency', 
                  currency: 'EUR',
                  minimumFractionDigits: 0
                }).format(stats.valorTotal)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-400" />
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
              <p className="text-sm text-gray-600">Progresso Médio</p>
              <p className={`text-2xl font-bold ${getProgressColor(stats.percentualMedio)}`}>
                {stats.percentualMedio.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-400" />
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('lista')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'lista'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Lista ({subempreiteiros.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('analise')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analise'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Análise</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'lista' && (
        <div className="space-y-4">
          {subempreiteiros.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum subempreiteiro registado</h3>
              <p className="text-gray-600 mb-4">Adicione subempreiteiros para gerir contratos e equipas</p>
              <button
                onClick={() => {
                  setEditingSubempreiteiro(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Subempreiteiro
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {subempreiteiros.map((subempreiteiro, index) => (
                <motion.div
                  key={subempreiteiro.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <Building className="h-5 w-5 text-purple-600" />
                          <h3 className="text-lg font-semibold text-gray-900">{subempreiteiro.nome}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subempreiteiro.status)}`}>
                          {subempreiteiro.status}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                          {subempreiteiro.tipo_servico}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Telefone</p>
                            <p className="text-sm font-medium">{subempreiteiro.telefone}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium">{subempreiteiro.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Contratação</p>
                            <p className="text-sm font-medium">{new Date(subempreiteiro.data_contratacao).toLocaleDateString('pt-PT')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Valor Contrato</p>
                            <p className="text-sm font-medium">
                              {new Intl.NumberFormat('pt-PT', { 
                                style: 'currency', 
                                currency: 'EUR',
                                minimumFractionDigits: 0
                              }).format(subempreiteiro.valor_contrato)}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progresso da Execução</span>
                          <span className={`text-sm font-medium ${getProgressColor(subempreiteiro.percentual_execucao)}`}>
                            {subempreiteiro.percentual_execucao}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              subempreiteiro.percentual_execucao >= 80 ? 'bg-green-500' :
                              subempreiteiro.percentual_execucao >= 60 ? 'bg-yellow-500' :
                              subempreiteiro.percentual_execucao >= 40 ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${subempreiteiro.percentual_execucao}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Seguros e Equipas */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Seguros</span>
                          </div>
                          <div className="space-y-1">
                            {subempreiteiro.seguros.slice(0, 2).map((seguro, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-xs text-blue-700">{seguro.tipo}</span>
                                <span className={`text-xs px-1 rounded ${
                                  seguro.status === 'ativo' ? 'bg-green-100 text-green-700' :
                                  seguro.status === 'expirado' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {seguro.status}
                                </span>
                              </div>
                            ))}
                            {subempreiteiro.seguros.length > 2 && (
                              <span className="text-xs text-blue-600">+{subempreiteiro.seguros.length - 2} mais</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">Equipas</span>
                          </div>
                          <div className="space-y-1">
                            {subempreiteiro.equipas.slice(0, 2).map((equipa, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-xs text-green-700">{equipa.nome}</span>
                                <span className={`text-xs px-1 rounded ${
                                  equipa.status === 'ativa' ? 'bg-green-100 text-green-700' :
                                  equipa.status === 'inativa' ? 'bg-gray-100 text-gray-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {equipa.status}
                                </span>
                              </div>
                            ))}
                            {subempreiteiro.equipas.length > 2 && (
                              <span className="text-xs text-green-600">+{subempreiteiro.equipas.length - 2} mais</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => handleEditSubempreiteiro(subempreiteiro)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSubempreiteiro(subempreiteiro.id)}
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

      {activeTab === 'analise' && (
        <div className="space-y-6">
          {/* Análise Financeira */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise Financeira</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Valor Total Contratos</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat('pt-PT', { 
                    style: 'currency', 
                    currency: 'EUR',
                    minimumFractionDigits: 0
                  }).format(stats.valorTotal)}
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Valor Executado</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat('pt-PT', { 
                    style: 'currency', 
                    currency: 'EUR',
                    minimumFractionDigits: 0
                  }).format(stats.valorExecutado)}
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Progresso Médio</span>
                </div>
                <p className={`text-2xl font-bold ${getProgressColor(stats.percentualMedio)}`}>
                  {stats.percentualMedio.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Análise de Seguros */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Seguros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Seguros Ativos</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{stats.segurosAtivos}</p>
                <p className="text-sm text-blue-700">de {subempreiteiros.reduce((acc, s) => acc + s.seguros.length, 0)} total</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Equipas Ativas</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{stats.equipasAtivas}</p>
                <p className="text-sm text-green-700">de {subempreiteiros.reduce((acc, s) => acc + s.equipas.length, 0)} total</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Forms */}
      <AnimatePresence>
        {showForm && (
          <SubempreiteiroForm
            isOpen={showForm}
            onClose={() => {
              setShowForm(false);
              setEditingSubempreiteiro(null);
            }}
            subempreiteiro={editingSubempreiteiro}
            onSave={handleSaveSubempreiteiro}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
