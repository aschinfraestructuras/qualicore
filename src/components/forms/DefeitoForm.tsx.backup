import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { Defeito } from '../../types/rececaoObra';
import { toast } from 'react-hot-toast';

interface DefeitoFormProps {
  defeito?: Defeito | null;
  onSave: (data: Partial<Defeito>) => void;
  onCancel: () => void;
}

export default function DefeitoForm({ defeito, onSave, onCancel }: DefeitoFormProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    localizacao: '',
    severidade: 'baixa' as const,
    status: 'reportado' as const,
    data_reportado: '',
    data_correcao: '',
    data_verificacao: '',
    responsavel_correcao: '',
    custo_correcao: 0,
    observacoes: '',
    fotos: [] as string[]
  });

  useEffect(() => {
    if (defeito) {
      setFormData({
        titulo: defeito.titulo,
        descricao: defeito.descricao,
        localizacao: defeito.localizacao,
        severidade: defeito.severidade,
        status: defeito.status,
        data_reportado: defeito.data_reportado,
        data_correcao: defeito.data_correcao || '',
        data_verificacao: defeito.data_verificacao || '',
        responsavel_correcao: defeito.responsavel_correcao,
        custo_correcao: defeito.custo_correcao,
        observacoes: defeito.observacoes,
        fotos: defeito.fotos
      });
    }
  }, [defeito]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.descricao || !formData.localizacao || !formData.data_reportado) {
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
            {defeito ? 'Editar Defeito' : 'Reportar Defeito'}
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
                Título do Defeito *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Fissura na parede"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização *
              </label>
              <input
                type="text"
                value={formData.localizacao}
                onChange={(e) => setFormData(prev => ({ ...prev, localizacao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Piso 2, Sala 201"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severidade
              </label>
              <select
                value={formData.severidade}
                onChange={(e) => setFormData(prev => ({ ...prev, severidade: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
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
                <option value="reportado">Reportado</option>
                <option value="em_analise">Em Análise</option>
                <option value="em_correcao">Em Correção</option>
                <option value="corrigido">Corrigido</option>
                <option value="verificado">Verificado</option>
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição do Defeito *
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição detalhada do defeito..."
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Correção
              </label>
              <input
                type="date"
                value={formData.data_correcao}
                onChange={(e) => setFormData(prev => ({ ...prev, data_correcao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Verificação
              </label>
              <input
                type="date"
                value={formData.data_verificacao}
                onChange={(e) => setFormData(prev => ({ ...prev, data_verificacao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Responsável e Custo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsável pela Correção
              </label>
              <input
                type="text"
                value={formData.responsavel_correcao}
                onChange={(e) => setFormData(prev => ({ ...prev, responsavel_correcao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome do responsável"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custo da Correção (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.custo_correcao}
                onChange={(e) => setFormData(prev => ({ ...prev, custo_correcao: parseFloat(e.target.value) || 0 }))}
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
              placeholder="Observações adicionais sobre o defeito..."
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
              {defeito ? 'Atualizar' : 'Reportar'} Defeito
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
