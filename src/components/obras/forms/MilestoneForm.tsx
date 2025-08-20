import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Target, DollarSign, User, AlertCircle } from 'lucide-react';
import { MilestoneObra } from '@/types';

interface MilestoneFormProps {
  isOpen: boolean;
  onClose: () => void;
  milestone?: MilestoneObra | null;
  onSave: (milestone: MilestoneObra) => void;
}

export default function MilestoneForm({ isOpen, onClose, milestone, onSave }: MilestoneFormProps) {
  const [formData, setFormData] = useState<Partial<MilestoneObra>>({
    nome: '',
    descricao: '',
    data_prevista: '',
    data_real: '',
    status: 'pendente',
    importancia: 'media',
    responsavel: '',
    custo_estimado: 0,
    observacoes: ''
  });

  useEffect(() => {
    if (milestone) {
      setFormData({
        ...milestone,
        data_prevista: milestone.data_prevista ? new Date(milestone.data_prevista).toISOString().split('T')[0] : '',
        data_real: milestone.data_real ? new Date(milestone.data_real).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        nome: '',
        descricao: '',
        data_prevista: '',
        data_real: '',
        status: 'pendente',
        importancia: 'media',
        responsavel: '',
        custo_estimado: 0,
        observacoes: ''
      });
    }
  }, [milestone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const milestoneData: MilestoneObra = {
      id: milestone?.id || `milestone_${Date.now()}`,
      nome: formData.nome || '',
      descricao: formData.descricao || '',
      data_prevista: formData.data_prevista || new Date().toISOString(),
      data_real: formData.data_real || null,
      status: formData.status || 'pendente',
      importancia: formData.importancia || 'media',
      responsavel: formData.responsavel || '',
      custo_estimado: formData.custo_estimado || 0,
      observacoes: formData.observacoes || '',
      data_criacao: milestone?.data_criacao || new Date().toISOString(),
      data_atualizacao: new Date().toISOString()
    };

    onSave(milestoneData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {milestone ? 'Editar Milestone' : 'Novo Milestone'}
              </h2>
              <p className="text-gray-600">Defina os detalhes do milestone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Milestone *
            </label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Ex: Fundação concluída"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Descreva o milestone..."
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Data Prevista *
              </label>
              <input
                type="date"
                required
                value={formData.data_prevista}
                onChange={(e) => setFormData({ ...formData, data_prevista: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Data Real
              </label>
              <input
                type="date"
                value={formData.data_real || ''}
                onChange={(e) => setFormData({ ...formData, data_real: e.target.value || null })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Status e Importância */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="pendente">Pendente</option>
                <option value="em_execucao">Em Execução</option>
                <option value="concluida">Concluída</option>
                <option value="atrasada">Atrasada</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Importância
              </label>
              <select
                value={formData.importancia}
                onChange={(e) => setFormData({ ...formData, importancia: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>

          {/* Responsável e Custo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Responsável
              </label>
              <input
                type="text"
                value={formData.responsavel}
                onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Nome do responsável"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="h-4 w-4 inline mr-2" />
                Custo Estimado (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.custo_estimado}
                onChange={(e) => setFormData({ ...formData, custo_estimado: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors font-medium"
            >
              {milestone ? 'Atualizar' : 'Criar'} Milestone
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
