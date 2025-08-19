import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Wrench, Clock } from 'lucide-react';
import { ManutencaoPreventiva } from '../../types/rececaoObra';
import { toast } from 'react-hot-toast';

interface ManutencaoFormProps {
  manutencao?: ManutencaoPreventiva | null;
  onSave: (data: Partial<ManutencaoPreventiva>) => void;
  onCancel: () => void;
}

export default function ManutencaoForm({ manutencao, onSave, onCancel }: ManutencaoFormProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: 'preventiva' as const,
    frequencia: 'mensal' as const,
    proxima_manutencao: '',
    ultima_manutencao: '',
    responsavel: '',
    custo_estimado: 0,
    status: 'agendada' as const,
    observacoes: ''
  });

  useEffect(() => {
    if (manutencao) {
      setFormData({
        titulo: manutencao.titulo,
        descricao: manutencao.descricao,
        tipo: manutencao.tipo,
        frequencia: manutencao.frequencia,
        proxima_manutencao: manutencao.proxima_manutencao,
        ultima_manutencao: manutencao.ultima_manutencao || '',
        responsavel: manutencao.responsavel,
        custo_estimado: manutencao.custo_estimado,
        status: manutencao.status,
        observacoes: manutencao.observacoes
      });
    }
  }, [manutencao]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.descricao || !formData.proxima_manutencao) {
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
            {manutencao ? 'Editar Manutenção' : 'Nova Manutenção'}
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
                Título da Manutenção *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Manutenção do sistema de ar condicionado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Manutenção
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="preventiva">Preventiva</option>
                <option value="corretiva">Corretiva</option>
                <option value="preditiva">Preditiva</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequência
              </label>
              <select
                value={formData.frequencia}
                onChange={(e) => setFormData(prev => ({ ...prev, frequencia: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="diaria">Diária</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
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
                <option value="agendada">Agendada</option>
                <option value="em_curso">Em Curso</option>
                <option value="concluida">Concluída</option>
                <option value="atrasada">Atrasada</option>
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição da Manutenção *
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição detalhada da manutenção..."
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Próxima Manutenção *
              </label>
              <input
                type="date"
                value={formData.proxima_manutencao}
                onChange={(e) => setFormData(prev => ({ ...prev, proxima_manutencao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Última Manutenção
              </label>
              <input
                type="date"
                value={formData.ultima_manutencao}
                onChange={(e) => setFormData(prev => ({ ...prev, ultima_manutencao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Responsável e Custo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsável
              </label>
              <input
                type="text"
                value={formData.responsavel}
                onChange={(e) => setFormData(prev => ({ ...prev, responsavel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome do responsável"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custo Estimado (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.custo_estimado}
                onChange={(e) => setFormData(prev => ({ ...prev, custo_estimado: parseFloat(e.target.value) || 0 }))}
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
              {manutencao ? 'Atualizar' : 'Criar'} Manutenção
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
