import React, { useState, useEffect } from 'react';
import { X, Calendar, User, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { RececaoObra } from '../../types/rececaoObra';
import { toast } from 'react-hot-toast';

interface RececaoObraFormProps {
  rececao?: RececaoObra | null;
  onSave: (data: Partial<RececaoObra>) => void;
  onCancel: () => void;
}

export default function RececaoObraForm({ rececao, onSave, onCancel }: RececaoObraFormProps) {
  const [formData, setFormData] = useState({
    codigo: '',
    data_rececao: '',
    status: 'pendente' as const,
    tipo_rececao: 'provisoria' as const,
    responsavel_rececao: '',
    coordenador_seguranca: '',
    diretor_obra: '',
    fiscal_obra: '',
    observacoes: '',
    reservas: [] as string[],
    nova_reserva: ''
  });

  useEffect(() => {
    if (rececao) {
      setFormData({
        codigo: rececao.codigo,
        data_rececao: rececao.data_rececao,
        status: rececao.status,
        tipo_rececao: rececao.tipo_rececao,
        responsavel_rececao: rececao.responsavel_rececao,
        coordenador_seguranca: rececao.coordenador_seguranca,
        diretor_obra: rececao.diretor_obra,
        fiscal_obra: rececao.fiscal_obra,
        observacoes: rececao.observacoes,
        reservas: rececao.reservas,
        nova_reserva: ''
      });
    }
  }, [rececao]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codigo || !formData.data_rececao || !formData.responsavel_rececao) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    onSave(formData);
  };

  const addReserva = () => {
    if (formData.nova_reserva.trim()) {
      setFormData(prev => ({
        ...prev,
        reservas: [...prev.reservas, prev.nova_reserva.trim()],
        nova_reserva: ''
      }));
    }
  };

  const removeReserva = (index: number) => {
    setFormData(prev => ({
      ...prev,
      reservas: prev.reservas.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {rececao ? 'Editar Receção de Obra' : 'Nova Receção de Obra'}
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
                Código da Receção *
              </label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="REC-2024-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Receção *
              </label>
              <input
                type="date"
                value={formData.data_rececao}
                onChange={(e) => setFormData(prev => ({ ...prev, data_rececao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <option value="com_reservas">Com Reservas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Receção
              </label>
              <select
                value={formData.tipo_rececao}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo_rececao: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="provisoria">Provisória</option>
                <option value="definitiva">Definitiva</option>
                <option value="parcial">Parcial</option>
              </select>
            </div>
          </div>

          {/* Equipa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsável pela Receção *
              </label>
              <input
                type="text"
                value={formData.responsavel_rececao}
                onChange={(e) => setFormData(prev => ({ ...prev, responsavel_rececao: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Eng. João Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coordenador de Segurança
              </label>
              <input
                type="text"
                value={formData.coordenador_seguranca}
                onChange={(e) => setFormData(prev => ({ ...prev, coordenador_seguranca: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Eng. Maria Santos"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diretor de Obra
              </label>
              <input
                type="text"
                value={formData.diretor_obra}
                onChange={(e) => setFormData(prev => ({ ...prev, diretor_obra: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Eng. Pedro Costa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fiscal de Obra
              </label>
              <input
                type="text"
                value={formData.fiscal_obra}
                onChange={(e) => setFormData(prev => ({ ...prev, fiscal_obra: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Eng. Ana Ferreira"
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
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações sobre a receção..."
            />
          </div>

          {/* Reservas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reservas
            </label>
            <div className="space-y-3">
              {formData.reservas.map((reserva, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="flex-1 text-sm text-gray-700">{reserva}</span>
                  <button
                    type="button"
                    onClick={() => removeReserva(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.nova_reserva}
                  onChange={(e) => setFormData(prev => ({ ...prev, nova_reserva: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adicionar nova reserva..."
                />
                <button
                  type="button"
                  onClick={addReserva}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
            </div>
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
              {rececao ? 'Atualizar' : 'Criar'} Receção
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
