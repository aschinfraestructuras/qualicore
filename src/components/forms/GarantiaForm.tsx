import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Shield, FileText } from 'lucide-react';
import { Garantia } from '../../types/rececaoObra';
import { toast } from 'react-hot-toast';

interface GarantiaFormProps {
  garantia?: Garantia | null;
  onSave: (data: Partial<Garantia>) => void;
  onCancel: () => void;
}

export default function GarantiaForm({ garantia, onSave, onCancel }: GarantiaFormProps) {
  const [formData, setFormData] = useState({
    tipo_garantia: '10_anos' as const,
    descricao: '',
    data_inicio: '',
    data_fim: '',
    valor_garantia: 0,
    seguradora: '',
    apolice: '',
    status: 'ativa' as const,
    cobertura: '',
    observacoes: ''
  });

  useEffect(() => {
    if (garantia) {
      setFormData({
        tipo_garantia: garantia.tipo_garantia,
        descricao: garantia.descricao,
        data_inicio: garantia.data_inicio,
        data_fim: garantia.data_fim,
        valor_garantia: garantia.valor_garantia,
        seguradora: garantia.seguradora,
        apolice: garantia.apolice,
        status: garantia.status,
        cobertura: garantia.cobertura,
        observacoes: garantia.observacoes
      });
    }
  }, [garantia]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.data_inicio || !formData.data_fim || !formData.seguradora) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {garantia ? 'Editar Garantia' : 'Nova Garantia'}
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
                Tipo de Garantia *
              </label>
              <select
                value={formData.tipo_garantia}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo_garantia: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="10_anos">10 Anos</option>
                <option value="5_anos">5 Anos</option>
                <option value="2_anos">2 Anos</option>
                <option value="outros">Outros</option>
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

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição da Garantia *
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição detalhada da garantia..."
            />
          </div>

          {/* Informações Financeiras */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor da Garantia (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valor_garantia}
                onChange={(e) => setFormData(prev => ({ ...prev, valor_garantia: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
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
                Número da Apólice
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

          {/* Cobertura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cobertura da Garantia
            </label>
            <textarea
              value={formData.cobertura}
              onChange={(e) => setFormData(prev => ({ ...prev, cobertura: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição da cobertura da garantia..."
            />
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
              {garantia ? 'Atualizar' : 'Criar'} Garantia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
