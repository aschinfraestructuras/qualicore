import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Shield, FileText } from 'lucide-react';
import { Seguro } from '../../types/rececaoObra';
import { toast } from 'react-hot-toast';

interface SeguroFormProps {
  seguro?: Seguro | null;
  onSave: (data: Partial<Seguro>) => void;
  onCancel: () => void;
}

export default function SeguroForm({ seguro, onSave, onCancel }: SeguroFormProps) {
  const [formData, setFormData] = useState({
    tipo_seguro: 'garantia' as const,
    seguradora: '',
    apolice: '',
    data_inicio: '',
    data_fim: '',
    valor_segurado: 0,
    premio: 0,
    cobertura: '',
    exclusoes: [] as string[],
    status: 'ativa' as const,
    observacoes: '',
    nova_exclusao: ''
  });

  useEffect(() => {
    if (seguro) {
      setFormData({
        tipo_seguro: seguro.tipo_seguro,
        seguradora: seguro.seguradora,
        apolice: seguro.apolice,
        data_inicio: seguro.data_inicio,
        data_fim: seguro.data_fim,
        valor_segurado: seguro.valor_segurado,
        premio: seguro.premio,
        cobertura: seguro.cobertura,
        exclusoes: seguro.exclusoes,
        status: seguro.status,
        observacoes: seguro.observacoes,
        nova_exclusao: ''
      });
    }
  }, [seguro]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.seguradora || !formData.apolice || !formData.data_inicio || !formData.data_fim) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    onSave(formData);
  };

  const addExclusao = () => {
    if (formData.nova_exclusao.trim()) {
      setFormData(prev => ({
        ...prev,
        exclusoes: [...prev.exclusoes, prev.nova_exclusao.trim()],
        nova_exclusao: ''
      }));
    }
  };

  const removeExclusao = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exclusoes: prev.exclusoes.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {seguro ? 'Editar Seguro' : 'Novo Seguro'}
          </h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Seguro
              </label>
              <select
                value={formData.tipo_seguro}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo_seguro: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="garantia">Garantia</option>
                <option value="responsabilidade">Responsabilidade Civil</option>
                <option value="obra">Seguro de Obra</option>
                <option value="equipamentos">Equipamentos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ativa">Ativa</option>
                <option value="expirada">Expirada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seguradora *
              </label>
              <input
                type="text"
                value={formData.seguradora}
                onChange={(e) => setFormData(prev => ({ ...prev, seguradora: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome da seguradora"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número da Apólice *
              </label>
              <input
                type="text"
                value={formData.apolice}
                onChange={(e) => setFormData(prev => ({ ...prev, apolice: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Número da apólice"
              />
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Início *
              </label>
              <input
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, data_inicio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Fim *
              </label>
              <input
                type="date"
                value={formData.data_fim}
                onChange={(e) => setFormData(prev => ({ ...prev, data_fim: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Segurado (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valor_segurado}
                onChange={(e) => setFormData(prev => ({ ...prev, valor_segurado: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prémio (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.premio}
                onChange={(e) => setFormData(prev => ({ ...prev, premio: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Cobertura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cobertura do Seguro
            </label>
            <textarea
              value={formData.cobertura}
              onChange={(e) => setFormData(prev => ({ ...prev, cobertura: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição da cobertura do seguro..."
            />
          </div>

          {/* Exclusões */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exclusões
            </label>
            <div className="space-y-3">
              {formData.exclusoes.map((exclusao, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <X className="h-4 w-4 text-red-500" />
                  <span className="flex-1 text-sm text-gray-700">{exclusao}</span>
                  <button
                    type="button"
                    onClick={() => removeExclusao(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.nova_exclusao}
                  onChange={(e) => setFormData(prev => ({ ...prev, nova_exclusao: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adicionar nova exclusão..."
                />
                <button
                  type="button"
                  onClick={addExclusao}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {seguro ? 'Atualizar' : 'Criar'} Seguro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
