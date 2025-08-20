import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, ArrowRight, User, Phone, AlertCircle, Building } from 'lucide-react';
import { DependenciaExterna } from '@/types';

interface DependenciaFormProps {
  isOpen: boolean;
  onClose: () => void;
  dependencia?: DependenciaExterna | null;
  onSave: (dependencia: DependenciaExterna) => void;
}

export default function DependenciaForm({ isOpen, onClose, dependencia, onSave }: DependenciaFormProps) {
  const [formData, setFormData] = useState<Partial<DependenciaExterna>>({
    descricao: '',
    entidade: '',
    data_necessaria: '',
    status: 'pendente',
    impacto_obra: 'medio',
    responsavel_interno: '',
    contato_externo: '',
    observacoes: ''
  });

  useEffect(() => {
    if (dependencia) {
      setFormData({
        ...dependencia,
        data_necessaria: dependencia.data_necessaria ? new Date(dependencia.data_necessaria).toISOString().split('T')[0] : ''
      });
    } else {
      setFormData({
        descricao: '',
        entidade: '',
        data_necessaria: '',
        status: 'pendente',
        impacto_obra: 'medio',
        responsavel_interno: '',
        contato_externo: '',
        observacoes: ''
      });
    }
  }, [dependencia]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dependenciaData: DependenciaExterna = {
      id: dependencia?.id || `dependencia_${Date.now()}`,
      descricao: formData.descricao || '',
      entidade: formData.entidade || '',
      data_necessaria: formData.data_necessaria || new Date().toISOString(),
      status: formData.status || 'pendente',
      impacto_obra: formData.impacto_obra || 'medio',
      responsavel_interno: formData.responsavel_interno || '',
      contato_externo: formData.contato_externo || '',
      observacoes: formData.observacoes || '',
      data_criacao: dependencia?.data_criacao || new Date().toISOString(),
      data_atualizacao: new Date().toISOString()
    };

    onSave(dependenciaData);
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
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {dependencia ? 'Editar Dependência' : 'Nova Dependência Externa'}
              </h2>
              <p className="text-gray-600">Defina os detalhes da dependência externa</p>
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
          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição da Dependência *
            </label>
            <textarea
              required
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Descreva a dependência externa..."
            />
          </div>

          {/* Entidade e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="h-4 w-4 inline mr-2" />
                Entidade Externa *
              </label>
              <input
                type="text"
                required
                value={formData.entidade}
                onChange={(e) => setFormData({ ...formData, entidade: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Nome da entidade"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Data Necessária *
              </label>
              <input
                type="date"
                required
                value={formData.data_necessaria}
                onChange={(e) => setFormData({ ...formData, data_necessaria: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Status e Impacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              >
                <option value="pendente">Pendente</option>
                <option value="em_processo">Em Processo</option>
                <option value="concluida">Concluída</option>
                <option value="atrasada">Atrasada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Impacto na Obra
              </label>
              <select
                value={formData.impacto_obra}
                onChange={(e) => setFormData({ ...formData, impacto_obra: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              >
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
                <option value="critico">Crítico</option>
              </select>
            </div>
          </div>

          {/* Responsável e Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Responsável Interno
              </label>
              <input
                type="text"
                value={formData.responsavel_interno}
                onChange={(e) => setFormData({ ...formData, responsavel_interno: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Nome do responsável interno"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Contato Externo
              </label>
              <input
                type="text"
                value={formData.contato_externo}
                onChange={(e) => setFormData({ ...formData, contato_externo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                placeholder="Telefone ou email"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
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
              className="px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-xl transition-colors font-medium"
            >
              {dependencia ? 'Atualizar' : 'Criar'} Dependência
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
