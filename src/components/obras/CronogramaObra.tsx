import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, CheckCircle, AlertCircle, Plus, Edit, Trash2, 
  ArrowRight, CalendarDays, Target, Flag, DollarSign 
} from 'lucide-react';
import { MilestoneObra, DependenciaExterna } from '@/types';
import MilestoneForm from './forms/MilestoneForm';
import DependenciaForm from './forms/DependenciaForm';
import toast from 'react-hot-toast';

interface CronogramaObraProps {
  milestones: MilestoneObra[];
  dependencias: DependenciaExterna[];
  onMilestoneChange: (milestones: MilestoneObra[]) => void;
  onDependenciaChange: (dependencias: DependenciaExterna[]) => void;
}

export default function CronogramaObra({ 
  milestones, 
  dependencias, 
  onMilestoneChange, 
  onDependenciaChange 
}: CronogramaObraProps) {
  const [activeTab, setActiveTab] = useState<'milestones' | 'dependencias'>('milestones');
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [showDependenciaForm, setShowDependenciaForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneObra | null>(null);
  const [editingDependencia, setEditingDependencia] = useState<DependenciaExterna | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'text-green-600 bg-green-100';
      case 'atrasada': return 'text-red-600 bg-red-100';
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImportanciaColor = (importancia: string) => {
    switch (importancia) {
      case 'critica': return 'text-red-600 bg-red-100';
      case 'alta': return 'text-orange-600 bg-orange-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'baixa': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSaveMilestone = (milestone: MilestoneObra) => {
    if (editingMilestone) {
      const updatedMilestones = milestones.map(m => 
        m.id === milestone.id ? milestone : m
      );
      onMilestoneChange(updatedMilestones);
      toast.success('Milestone atualizado com sucesso!');
    } else {
      onMilestoneChange([...milestones, milestone]);
      toast.success('Milestone criado com sucesso!');
    }
    setEditingMilestone(null);
  };

  const handleSaveDependencia = (dependencia: DependenciaExterna) => {
    if (editingDependencia) {
      const updatedDependencias = dependencias.map(d => 
        d.id === dependencia.id ? dependencia : d
      );
      onDependenciaChange(updatedDependencias);
      toast.success('Dependência atualizada com sucesso!');
    } else {
      onDependenciaChange([...dependencias, dependencia]);
      toast.success('Dependência criada com sucesso!');
    }
    setEditingDependencia(null);
  };

  const handleEditMilestone = (milestone: MilestoneObra) => {
    setEditingMilestone(milestone);
    setShowMilestoneForm(true);
  };

  const handleEditDependencia = (dependencia: DependenciaExterna) => {
    setEditingDependencia(dependencia);
    setShowDependenciaForm(true);
  };

  const handleDeleteMilestone = (milestoneId: string) => {
    const updatedMilestones = milestones.filter(m => m.id !== milestoneId);
    onMilestoneChange(updatedMilestones);
    toast.success('Milestone removido com sucesso!');
  };

  const handleDeleteDependencia = (dependenciaId: string) => {
    const updatedDependencias = dependencias.filter(d => d.id !== dependenciaId);
    onDependenciaChange(updatedDependencias);
    toast.success('Dependência removida com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cronograma da Obra</h2>
            <p className="text-gray-600">Gestão de milestones e dependências</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setEditingMilestone(null);
              setShowMilestoneForm(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Milestone
          </button>
          <button
            onClick={() => {
              setEditingDependencia(null);
              setShowDependenciaForm(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Dependência
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('milestones')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'milestones'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Flag className="h-4 w-4" />
              <span>Milestones ({milestones.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('dependencias')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dependencias'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ArrowRight className="h-4 w-4" />
              <span>Dependências ({dependencias.length})</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {milestones.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum milestone definido</h3>
              <p className="text-gray-600 mb-4">Adicione milestones importantes para acompanhar o progresso da obra</p>
              <button
                onClick={() => {
                  setEditingMilestone(null);
                  setShowMilestoneForm(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Milestone
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900">{milestone.nome}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                          {milestone.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanciaColor(milestone.importancia)}`}>
                          {milestone.importancia}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{milestone.descricao}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <CalendarDays className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Data Prevista</p>
                            <p className="text-sm font-medium">{new Date(milestone.data_prevista).toLocaleDateString('pt-PT')}</p>
                          </div>
                        </div>
                        
                        {milestone.data_real && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <div>
                              <p className="text-xs text-gray-500">Data Real</p>
                              <p className="text-sm font-medium">{new Date(milestone.data_real).toLocaleDateString('pt-PT')}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Responsável</p>
                            <p className="text-sm font-medium">{milestone.responsavel}</p>
                          </div>
                        </div>
                        
                        {milestone.custo_estimado && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Custo Estimado</p>
                              <p className="text-sm font-medium">
                                {new Intl.NumberFormat('pt-PT', { 
                                  style: 'currency', 
                                  currency: 'EUR' 
                                }).format(milestone.custo_estimado)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => handleEditMilestone(milestone)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMilestone(milestone.id)}
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

      {activeTab === 'dependencias' && (
        <div className="space-y-4">
          {dependencias.length === 0 ? (
            <div className="text-center py-12">
              <ArrowRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma dependência externa</h3>
              <p className="text-gray-600 mb-4">Adicione dependências externas que podem afetar o cronograma</p>
              <button
                onClick={() => {
                  setEditingDependencia(null);
                  setShowDependenciaForm(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Dependência
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {dependencias.map((dependencia, index) => (
                <motion.div
                  key={dependencia.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <ArrowRight className="h-5 w-5 text-green-600" />
                          <h3 className="text-lg font-semibold text-gray-900">{dependencia.descricao}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dependencia.status)}`}>
                          {dependencia.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          dependencia.impacto_obra === 'critico' ? 'text-red-600 bg-red-100' :
                          dependencia.impacto_obra === 'alto' ? 'text-orange-600 bg-orange-100' :
                          dependencia.impacto_obra === 'medio' ? 'text-yellow-600 bg-yellow-100' :
                          'text-green-600 bg-green-100'
                        }`}>
                          {dependencia.impacto_obra}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                          <CalendarDays className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Data Necessária</p>
                            <p className="text-sm font-medium">{new Date(dependencia.data_necessaria).toLocaleDateString('pt-PT')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Entidade</p>
                            <p className="text-sm font-medium">{dependencia.entidade}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Responsável Interno</p>
                            <p className="text-sm font-medium">{dependencia.responsavel_interno}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Contato Externo</p>
                            <p className="text-sm font-medium">{dependencia.contato_externo}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => handleEditDependencia(dependencia)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDependencia(dependencia.id)}
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

      {/* Forms */}
      <AnimatePresence>
        {showMilestoneForm && (
          <MilestoneForm
            isOpen={showMilestoneForm}
            onClose={() => {
              setShowMilestoneForm(false);
              setEditingMilestone(null);
            }}
            milestone={editingMilestone}
            onSave={handleSaveMilestone}
          />
        )}

        {showDependenciaForm && (
          <DependenciaForm
            isOpen={showDependenciaForm}
            onClose={() => {
              setShowDependenciaForm(false);
              setEditingDependencia(null);
            }}
            dependencia={editingDependencia}
            onSave={handleSaveDependencia}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
