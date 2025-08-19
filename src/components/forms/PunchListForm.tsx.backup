import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { PunchList } from '../../types/rececaoObra';
import { toast } from 'react-hot-toast';

interface PunchListFormProps {
  punchList?: PunchList | null;
  onSave: (data: Partial<PunchList>) => void;
  onCancel: () => void;
}

export default function PunchListForm({ punchList, onSave, onCancel }: PunchListFormProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    localizacao: '',
    categoria: 'acabamentos' as const,
    prioridade: 'baixa' as const,
    responsavel: '',
    data_limite: '',
    status: 'pendente' as const,
    data_conclusao: '',
    data_verificacao: '',
    observacoes: '',
    fotos: [] as string[]
  });

  useEffect(() => {
    if (punchList) {
      setFormData({
        titulo: punchList.titulo,
        descricao: punchList.descricao,
        localizacao: punchList.localizacao,
        categoria: punchList.categoria,
        prioridade: punchList.prioridade,
        responsavel: punchList.responsavel,
        data_limite: punchList.data_limite,
        status: punchList.status,
        data_conclusao: punchList.data_conclusao || '',
        data_verificacao: punchList.data_verificacao || '',
        observacoes: punchList.observacoes,
        fotos: punchList.fotos
      });
    }
  }, [punchList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.descricao || !formData.localizacao || !formData.data_limite) {
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
            {punchList ? 'Editar Punch List' : 'Nova Punch List'}
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
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Acabamento da parede"
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
                placeholder="Ex: Piso 1, Corredor A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="acabamentos">Acabamentos</option>
                <option value="instalacoes">Instalações</option>
                <option value="estrutura">Estrutura</option>
                <option value="equipamentos">Equipamentos</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                value={formData.prioridade}
                onChange={(e) => setFormData(prev => ({ ...prev, prioridade: e.target.value as any }))}
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
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pendente">Pendente</option>
                <option value="em_curso">Em Curso</option>
                <option value="concluida">Concluída</option>
                <option value="verificada">Verificada</option>
              </select>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrição detalhada do item da punch list..."
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Limite *
              </label>
              <input
                type="date"
                value={formData.data_limite}
                onChange={(e) => setFormData(prev => ({ ...prev, data_limite: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Conclusão
              </label>
              <input
                type="date"
                value={formData.data_conclusao}
                onChange={(e) => setFormData(prev => ({ ...prev, data_conclusao: e.target.value }))}
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
              {punchList ? 'Atualizar' : 'Criar'} Punch List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
