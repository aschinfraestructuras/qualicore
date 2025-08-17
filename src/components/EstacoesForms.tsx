import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Calendar, Gauge, Building, FileText, AlertTriangle, CheckCircle, Clock, Activity,
  Users, Download, Save, Loader
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FormData {
  codigo: string;
  nome: string;
  tipo: string;
  categoria: string;
  localizacao: string;
  km: number;
  estado: string;
  operador: string;
  data_inauguracao: string;
  status_operacional: string;
  observacoes: string;
  parametros: {
    num_plataformas: number;
    num_vias: number;
    area_total: number;
    capacidade_passageiros: number;
  };
}

interface EstacoesFormsProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
  onSubmit: (data: FormData) => void;
}

export function EstacoesForms({ isOpen, onClose, data, onSubmit }: EstacoesFormsProps) {
  const [formData, setFormData] = useState<FormData>({
    codigo: '',
    nome: '',
    tipo: '',
    categoria: '',
    localizacao: '',
    km: 0,
    estado: '',
    operador: '',
    data_inauguracao: '',
    status_operacional: '',
    observacoes: '',
    parametros: {
      num_plataformas: 0,
      num_vias: 0,
      area_total: 0,
      capacidade_passageiros: 0
    }
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        codigo: data.codigo || '',
        nome: data.nome || '',
        tipo: data.tipo || '',
        categoria: data.categoria || '',
        localizacao: data.localizacao || '',
        km: data.km || 0,
        estado: data.estado || '',
        operador: data.operador || '',
        data_inauguracao: data.data_inauguracao || '',
        status_operacional: data.status_operacional || '',
        observacoes: data.observacoes || '',
        parametros: {
          num_plataformas: data.parametros?.num_plataformas || 0,
          num_vias: data.parametros?.num_vias || 0,
          area_total: data.parametros?.area_total || 0,
          capacidade_passageiros: data.parametros?.capacidade_passageiros || 0
        }
      });
    }
  }, [data]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Limpar erro do campo
    if (errors[field as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código é obrigatório';
    }

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'Tipo é obrigatório';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Categoria é obrigatória';
    }

    if (!formData.localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    }

    if (formData.km < 0) {
      newErrors.km = 'KM deve ser maior ou igual a 0';
    }

    if (!formData.estado) {
      newErrors.estado = 'Estado é obrigatório';
    }

    if (!formData.operador.trim()) {
      newErrors.operador = 'Operador é obrigatório';
    }

    if (!formData.data_inauguracao) {
      newErrors.data_inauguracao = 'Data de inauguração é obrigatória';
    }

    if (!formData.status_operacional) {
      newErrors.status_operacional = 'Status operacional é obrigatório';
    }

    if (formData.parametros.num_plataformas < 0) {
      newErrors.parametros = { ...newErrors.parametros, num_plataformas: 'Número de plataformas deve ser maior ou igual a 0' };
    }

    if (formData.parametros.num_vias < 0) {
      newErrors.parametros = { ...newErrors.parametros, num_vias: 'Número de vias deve ser maior ou igual a 0' };
    }

    if (formData.parametros.area_total < 0) {
      newErrors.parametros = { ...newErrors.parametros, area_total: 'Área total deve ser maior ou igual a 0' };
    }

    if (formData.parametros.capacidade_passageiros < 0) {
      newErrors.parametros = { ...newErrors.parametros, capacidade_passageiros: 'Capacidade de passageiros deve ser maior ou igual a 0' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      toast.success(data ? 'Estação atualizada com sucesso!' : 'Estação criada com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar estação');
    } finally {
      setLoading(false);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Principal':
        return <Building className="h-5 w-5" />;
      case 'Secundária':
        return <Building className="h-5 w-5" />;
      case 'Terminal':
        return <Building className="h-5 w-5" />;
      case 'Intercambiador':
        return <MapPin className="h-5 w-5" />;
      default:
        return <Building className="h-5 w-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {data ? 'Editar Estação' : 'Nova Estação'}
                    </h2>
                    <p className="text-sm text-gray-600">Gestão de estações ferroviárias</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código *
                  </label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => handleInputChange('codigo', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.codigo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: EST-001-2024"
                  />
                  {errors.codigo && (
                    <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.nome ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Estação Central de Lisboa"
                  />
                  {errors.nome && (
                    <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.tipo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Principal">Principal</option>
                    <option value="Secundária">Secundária</option>
                    <option value="Terminal">Terminal</option>
                    <option value="Intercambiador">Intercambiador</option>
                  </select>
                  {errors.tipo && (
                    <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.categoria ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione a categoria</option>
                    <option value="Terminal">Terminal</option>
                    <option value="Intercambiador">Intercambiador</option>
                    <option value="Regional">Regional</option>
                    <option value="Metropolitana">Metropolitana</option>
                  </select>
                  {errors.categoria && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => handleInputChange('estado', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.estado ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione o estado</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Avaria">Avaria</option>
                    <option value="Desligado">Desligado</option>
                    <option value="Planejado">Planejado</option>
                  </select>
                  {errors.estado && (
                    <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operador *
                  </label>
                  <input
                    type="text"
                    value={formData.operador}
                    onChange={(e) => handleInputChange('operador', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.operador ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: CP - Comboios de Portugal"
                  />
                  {errors.operador && (
                    <p className="mt-1 text-sm text-red-600">{errors.operador}</p>
                  )}
                </div>
              </div>

              {/* Localização */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização *
                </label>
                <input
                  type="text"
                  value={formData.localizacao}
                  onChange={(e) => handleInputChange('localizacao', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.localizacao ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Lisboa, Portugal"
                />
                {errors.localizacao && (
                  <p className="mt-1 text-sm text-red-600">{errors.localizacao}</p>
                )}
              </div>

              {/* KM e Data de Inauguração */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KM *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.km}
                    onChange={(e) => handleInputChange('km', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.km ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.000"
                  />
                  {errors.km && (
                    <p className="mt-1 text-sm text-red-600">{errors.km}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Inauguração *
                  </label>
                  <input
                    type="date"
                    value={formData.data_inauguracao}
                    onChange={(e) => handleInputChange('data_inauguracao', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.data_inauguracao ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.data_inauguracao && (
                    <p className="mt-1 text-sm text-red-600">{errors.data_inauguracao}</p>
                  )}
                </div>
              </div>

              {/* Status Operacional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Operacional *
                </label>
                <select
                  value={formData.status_operacional}
                  onChange={(e) => handleInputChange('status_operacional', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.status_operacional ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o status</option>
                  <option value="Operacional">Operacional</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Avaria">Avaria</option>
                  <option value="Teste">Teste</option>
                </select>
                {errors.status_operacional && (
                  <p className="mt-1 text-sm text-red-600">{errors.status_operacional}</p>
                )}
              </div>

              {/* Parâmetros Técnicos */}
              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Gauge className="h-5 w-5 mr-2" />
                  Parâmetros Técnicos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nº Plataformas
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={formData.parametros.num_plataformas}
                      onChange={(e) => handleInputChange('parametros.num_plataformas', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.parametros?.num_plataformas ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    {errors.parametros?.num_plataformas && (
                      <p className="mt-1 text-sm text-red-600">{errors.parametros.num_plataformas}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nº Vias
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={formData.parametros.num_vias}
                      onChange={(e) => handleInputChange('parametros.num_vias', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.parametros?.num_vias ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    {errors.parametros?.num_vias && (
                      <p className="mt-1 text-sm text-red-600">{errors.parametros.num_vias}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Área Total (m²)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.parametros.area_total}
                      onChange={(e) => handleInputChange('parametros.area_total', parseFloat(e.target.value) || 0)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.parametros?.area_total ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.0"
                    />
                    {errors.parametros?.area_total && (
                      <p className="mt-1 text-sm text-red-600">{errors.parametros.area_total}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidade Passageiros
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={formData.parametros.capacidade_passageiros}
                      onChange={(e) => handleInputChange('parametros.capacidade_passageiros', parseInt(e.target.value) || 0)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.parametros?.capacidade_passageiros ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    {errors.parametros?.capacidade_passageiros && (
                      <p className="mt-1 text-sm text-red-600">{errors.parametros.capacidade_passageiros}</p>
                    )}
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
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Observações adicionais sobre a estação..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{data ? 'Atualizar' : 'Criar'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
