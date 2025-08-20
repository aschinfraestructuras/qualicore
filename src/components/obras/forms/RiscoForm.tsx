import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle, User, DollarSign, Target, AlertCircle, FileText } from 'lucide-react';
import { RiscoObra } from '@/types';

interface RiscoFormProps {
  isOpen: boolean;
  onClose: () => void;
  risco?: RiscoObra | null;
  onSave: (risco: RiscoObra) => void;
}

export default function RiscoForm({ isOpen, onClose, risco, onSave }: RiscoFormProps) {
  const [formData, setFormData] = useState<Partial<RiscoObra>>({
    descricao: '',
    categoria: '',
    probabilidade: 'media',
    impacto: 'medio',
    nivel_risco: 'medio',
    status: 'ativo',
    responsavel: '',
    custo_estimado: 0,
    medidas_preventivas: [],
    observacoes: ''
  });

  const [novaMedida, setNovaMedida] = useState('');

  useEffect(() => {
    if (risco) {
      setFormData({
        ...risco,
        medidas_preventivas: [...risco.medidas_preventivas]
      });
    } else {
      setFormData({
        descricao: '',
        categoria: '',
        probabilidade: 'media',
        impacto: 'medio',
        nivel_risco: 'medio',
        status: 'ativo',
        responsavel: '',
        custo_estimado: 0,
        medidas_preventivas: [],
        observacoes: ''
      });
    }
  }, [risco]);

  const calcularNivelRisco = (probabilidade: string, impacto: string) => {
    const probMap = { baixa: 1, media: 2, alta: 3, critica: 4 };
    const impactoMap = { baixo: 1, medio: 2, alto: 3, critico: 4 };
    
    const score = probMap[probabilidade as keyof typeof probMap] * impactoMap[impacto as keyof typeof impactoMap];
    
    if (score >= 12) return 'critico';
    if (score >= 8) return 'alto';
    if (score >= 4) return 'medio';
    return 'baixo';
  };

  const handleProbabilidadeChange = (probabilidade: string) => {
    const impacto = formData.impacto || 'medio';
    const nivel_risco = calcularNivelRisco(probabilidade, impacto);
    setFormData({ ...formData, probabilidade, nivel_risco });
  };

  const handleImpactoChange = (impacto: string) => {
    const probabilidade = formData.probabilidade || 'media';
    const nivel_risco = calcularNivelRisco(probabilidade, impacto);
    setFormData({ ...formData, impacto, nivel_risco });
  };

  const adicionarMedida = () => {
    if (novaMedida.trim()) {
      setFormData({
        ...formData,
        medidas_preventivas: [...(formData.medidas_preventivas || []), novaMedida.trim()]
      });
      setNovaMedida('');
    }
  };

  const removerMedida = (index: number) => {
    const medidas = [...(formData.medidas_preventivas || [])];
    medidas.splice(index, 1);
    setFormData({ ...formData, medidas_preventivas: medidas });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const riscoData: RiscoObra = {
      id: risco?.id || `risco_${Date.now()}`,
      descricao: formData.descricao || '',
      categoria: formData.categoria || '',
      probabilidade: formData.probabilidade || 'media',
      impacto: formData.impacto || 'medio',
      nivel_risco: formData.nivel_risco || 'medio',
      status: formData.status || 'ativo',
      responsavel: formData.responsavel || '',
      custo_estimado: formData.custo_estimado || 0,
      medidas_preventivas: formData.medidas_preventivas || [],
      observacoes: formData.observacoes || '',
      data_criacao: risco?.data_criacao || new Date().toISOString(),
      data_atualizacao: new Date().toISOString()
    };

    onSave(riscoData);
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
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {risco ? 'Editar Risco' : 'Novo Risco'}
              </h2>
              <p className="text-gray-600">Identifique e analise o risco</p>
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
              Descrição do Risco *
            </label>
            <textarea
              required
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              placeholder="Descreva o risco identificado..."
            />
          </div>

          {/* Categoria e Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="h-4 w-4 inline mr-2" />
                Categoria
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              >
                <option value="">Selecione uma categoria</option>
                <option value="tecnico">Técnico</option>
                <option value="financeiro">Financeiro</option>
                <option value="operacional">Operacional</option>
                <option value="ambiental">Ambiental</option>
                <option value="seguranca">Segurança</option>
                <option value="legal">Legal</option>
                <option value="fornecedores">Fornecedores</option>
                <option value="clima">Clima</option>
                <option value="outros">Outros</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              >
                <option value="ativo">Ativo</option>
                <option value="mitigado">Mitigado</option>
                <option value="resolvido">Resolvido</option>
                <option value="ocorreu">Ocorreu</option>
              </select>
            </div>
          </div>

          {/* Probabilidade e Impacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Probabilidade
              </label>
              <select
                value={formData.probabilidade}
                onChange={(e) => handleProbabilidadeChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Impacto
              </label>
              <select
                value={formData.impacto}
                onChange={(e) => handleImpactoChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              >
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
                <option value="critico">Crítico</option>
              </select>
            </div>
          </div>

          {/* Nível de Risco (Calculado) */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Nível de Risco Calculado:</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.nivel_risco === 'critico' ? 'bg-red-100 text-red-700' :
                formData.nivel_risco === 'alto' ? 'bg-orange-100 text-orange-700' :
                formData.nivel_risco === 'medio' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {formData.nivel_risco?.toUpperCase()}
              </span>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Medidas Preventivas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              Medidas Preventivas
            </label>
            <div className="space-y-3">
              {formData.medidas_preventivas?.map((medida, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={medida}
                    onChange={(e) => {
                      const medidas = [...(formData.medidas_preventivas || [])];
                      medidas[index] = e.target.value;
                      setFormData({ ...formData, medidas_preventivas: medidas });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removerMedida(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={novaMedida}
                  onChange={(e) => setNovaMedida(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarMedida())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Nova medida preventiva..."
                />
                <button
                  type="button"
                  onClick={adicionarMedida}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Adicionar
                </button>
              </div>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
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
              className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 rounded-xl transition-colors font-medium"
            >
              {risco ? 'Atualizar' : 'Criar'} Risco
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
