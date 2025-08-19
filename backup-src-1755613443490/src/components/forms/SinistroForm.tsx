import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, AlertTriangle, FileText } from 'lucide-react';
import { Sinistro } from '../../types/rececaoObra';
import { toast } from 'react-hot-toast';

interface SinistroFormProps {
  sinistro?: Sinistro | null;
  onSave: (data: Partial<Sinistro>) => void;
  onCancel: () => void;
}

export default function SinistroForm({ sinistro, onSave, onCancel }: SinistroFormProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_ocorrencia: '',
    data_reportado: '',
    valor_sinistro: 0,
    valor_indemnizacao: 0,
    status: 'reportado' as const,
    observacoes: '',
    documentos: [] as string[]
  });

  useEffect(() => {
    if (sinistro) {
      setFormData({
        titulo: sinistro.titulo,
        descricao: sinistro.descricao,
        data_ocorrencia: sinistro.data_ocorrencia,
        data_reportado: sinistro.data_reportado,
        valor_sinistro: sinistro.valor_sinistro,
        valor_indemnizacao: sinistro.valor_indemnizacao || 0,
        status: sinistro.status,
        observacoes: sinistro.observacoes,
        documentos: sinistro.documentos
      });
    }
  }, [sinistro]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.descricao || !formData.data_ocorrencia || !formData.data_reportado) {
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
            {sinistro ? 'Editar Sinistro' : 'Reportar Sinistro'}
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
                Título do Sinistro *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Danos causados por infiltração"
              />
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
                <option value="reportado">Reportado</option>
                <option value="em_analise">Em Análise</option>
                <option value="aprovado">Aprovado</option>
                <option value="pago">Pago</option>
                <option value="rejeitado">Rejeitado</option>
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição do Sinistro *
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição detalhada do sinistro..."
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Ocorrência *
              </label>
              <input
                type="date"
                value={formData.data_ocorrencia}
                onChange={(e) => setFormData(prev => ({ ...prev, data_ocorrencia: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Reportado *
              </label>
              <input
                type="date"
                value={formData.data_reportado}
                onChange={(e) => setFormData(prev => ({ ...prev, data_reportado: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor do Sinistro (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valor_sinistro}
                onChange={(e) => setFormData(prev => ({ ...prev, valor_sinistro: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor da Indemnização (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.valor_indemnizacao}
                onChange={(e) => setFormData(prev => ({ ...prev, valor_indemnizacao: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações adicionais sobre o sinistro..."
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
              {sinistro ? 'Atualizar' : 'Reportar'} Sinistro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
