import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Calendar, Gauge, Building, FileText, AlertTriangle, CheckCircle, Clock, Activity,
  Mountain, Download, Save, Loader
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PontesTuneisFormData {
  codigo: string;
  tipo: string;
  categoria: string;
  localizacao: string;
  km_inicial: number;
  km_final: number;
  estado: string;
  fabricante: string;
  modelo: string;
  data_construcao: string;
  status_operacional: string;
  observacoes: string;
  parametros: {
    comprimento: number;
    largura: number;
    altura: number;
    capacidade_carga: number;
  };
}

interface PontesTuneisFormsProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
  onSubmit: (data: PontesTuneisFormData) => void;
}

export function PontesTuneisForms({ isOpen, onClose, data, onSubmit }: PontesTuneisFormsProps) {
  const [formData, setFormData] = useState<PontesTuneisFormData>({
    codigo: '',
    tipo: '',
    categoria: '',
    localizacao: '',
    km_inicial: 0,
    km_final: 0,
    estado: '',
    fabricante: '',
    modelo: '',
    data_construcao: '',
    status_operacional: '',
    observacoes: '',
    parametros: {
      comprimento: 0,
      largura: 0,
      altura: 0,
      capacidade_carga: 0
    }
  });

  const [errors, setErrors] = useState<Partial<PontesTuneisFormData>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        codigo: data.codigo || '',
        tipo: data.tipo || '',
        categoria: data.categoria || '',
        localizacao: data.localizacao || '',
        km_inicial: data.km_inicial || 0,
        km_final: data.km_final || 0,
        estado: data.estado || '',
        fabricante: data.fabricante || '',
        modelo: data.modelo || '',
        data_construcao: data.data_construcao || '',
        status_operacional: data.status_operacional || '',
        observacoes: data.observacoes || '',
        parametros: {
          comprimento: data.parametros?.comprimento || 0,
          largura: data.parametros?.largura || 0,
          altura: data.parametros?.altura || 0,
          capacidade_carga: data.parametros?.capacidade_carga || 0
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
    if (errors[field as keyof PontesTuneisFormData]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PontesTuneisFormData> = {};

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código é obrigatório';
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

    if (formData.km_inicial < 0) {
      newErrors.km_inicial = 'KM inicial deve ser maior ou igual a 0';
    }

    if (formData.km_final <= formData.km_inicial) {
      newErrors.km_final = 'KM final deve ser maior que KM inicial';
    }

    if (!formData.estado) {
      newErrors.estado = 'Estado é obrigatório';
    }

    if (!formData.fabricante.trim()) {
      newErrors.fabricante = 'Fabricante é obrigatório';
    }

    if (!formData.modelo.trim()) {
      newErrors.modelo = 'Modelo é obrigatório';
    }

    if (!formData.data_construcao) {
      newErrors.data_construcao = 'Data de construção é obrigatória';
    }

    if (!formData.status_operacional) {
      newErrors.status_operacional = 'Status operacional é obrigatório';
    }

    if (formData.parametros.comprimento < 0) {
      newErrors.parametros = { ...newErrors.parametros, comprimento: 'Comprimento deve ser maior ou igual a 0' };
    }

    if (formData.parametros.largura < 0) {
      newErrors.parametros = { ...newErrors.parametros, largura: 'Largura deve ser maior ou igual a 0' };
    }

    if (formData.parametros.altura < 0) {
      newErrors.parametros = { ...newErrors.parametros, altura: 'Altura deve ser maior ou igual a 0' };
    }

    if (formData.parametros.capacidade_carga < 0) {
      newErrors.parametros = { ...newErrors.parametros, capacidade_carga: 'Capacidade de carga deve ser maior ou igual a 0' };
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
      toast.success(data ? 'Ponte/Túnel atualizada com sucesso!' : 'Ponte/Túnel criada com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar ponte/túnel');
    } finally {
      setLoading(false);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Ponte':
        return <Building className="h-5 w-5" />;
      case 'Túnel':
        return <Mountain className="h-5 w-5" />;
      case 'Viaduto':
        return <Building className="h-5 w-5" />;
      case 'Passagem Inferior':
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
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.15 }}
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
                      {data ? 'Editar Ponte/Túnel' : 'Nova Ponte/Túnel'}
                    </h2>
                    <p className="text-sm text-gray-600">Gestão de infraestruturas ferroviárias</p>
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
                    placeholder="Ex: PT-001-2024"
                  />
                  {errors.codigo && (
                    <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>
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
                    <option value="Ponte">Ponte</option>
                    <option value="Túnel">Túnel</option>
                    <option value="Viaduto">Viaduto</option>
                    <option value="Passagem Inferior">Passagem Inferior</option>
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
                    <option value="Principal">Principal</option>
                    <option value="Secundário">Secundário</option>
                    <option value="Acesso">Acesso</option>
                    <option value="Emergencial">Emergencial</option>
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
                  placeholder="Ex: Rio Douro - Linha Norte"
                />
                {errors.localizacao && (
                  <p className="mt-1 text-sm text-red-600">{errors.localizacao}</p>
                )}
              </div>

              {/* KM Inicial e Final */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KM Inicial *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.km_inicial}
                    onChange={(e) => handleInputChange('km_inicial', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.km_inicial ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.000"
                  />
                  {errors.km_inicial && (
                    <p className="mt-1 text-sm text-red-600">{errors.km_inicial}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KM Final *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.km_final}
                    onChange={(e) => handleInputChange('km_final', parseFloat(e.target.value) || 0)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.km_final ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.000"
                  />
                  {errors.km_final && (
                    <p className="mt-1 text-sm text-red-600">{errors.km_final}</p>
                  )}
                </div>
              </div>

              {/* Fabricante e Modelo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fabricante *
                  </label>
                  <input
                    type="text"
                    value={formData.fabricante}
                    onChange={(e) => handleInputChange('fabricante', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.fabricante ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Mota-Engil"
                  />
                  {errors.fabricante && (
                    <p className="mt-1 text-sm text-red-600">{errors.fabricante}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => handleInputChange('modelo', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.modelo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Ponte Mista"
                  />
                  {errors.modelo && (
                    <p className="mt-1 text-sm text-red-600">{errors.modelo}</p>
                  )}
                </div>
              </div>

              {/* Data de Construção e Status Operacional */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Construção *
                  </label>
                  <input
                    type="date"
                    value={formData.data_construcao}
                    onChange={(e) => handleInputChange('data_construcao', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.data_construcao ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.data_construcao && (
                    <p className="mt-1 text-sm text-red-600">{errors.data_construcao}</p>
                  )}
                </div>

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
                      Comprimento (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.parametros.comprimento}
                      onChange={(e) => handleInputChange('parametros.comprimento', parseFloat(e.target.value) || 0)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.parametros?.comprimento ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.0"
                    />
                    {errors.parametros?.comprimento && (
                      <p className="mt-1 text-sm text-red-600">{errors.parametros.comprimento}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Largura (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.parametros.largura}
                      onChange={(e) => handleInputChange('parametros.largura', parseFloat(e.target.value) || 0)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.parametros?.largura ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.0"
                    />
                    {errors.parametros?.largura && (
                      <p className="mt-1 text-sm text-red-600">{errors.parametros.largura}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Altura (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.parametros.altura}
                      onChange={(e) => handleInputChange('parametros.altura', parseFloat(e.target.value) || 0)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.parametros?.altura ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.0"
                    />
                    {errors.parametros?.altura && (
                      <p className="mt-1 text-sm text-red-600">{errors.parametros.altura}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidade de Carga (ton)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.parametros.capacidade_carga}
                      onChange={(e) => handleInputChange('parametros.capacidade_carga', parseFloat(e.target.value) || 0)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.parametros?.capacidade_carga ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0.0"
                    />
                    {errors.parametros?.capacidade_carga && (
                      <p className="mt-1 text-sm text-red-600">{errors.parametros.capacidade_carga}</p>
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
                  placeholder="Observações adicionais sobre a ponte/túnel..."
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
