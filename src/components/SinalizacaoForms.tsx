import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  Upload,
  Camera,
  FileText,
  MapPin,
  Gauge,
  Signal,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { sinalizacaoAPI } from '../lib/supabase-api/sinalizacaoAPI';

interface SinalizacaoFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData: any;
  onSuccess: () => void;
  type: 'sinalizacao' | 'inspecao';
}

interface FormData {
  codigo: string;
  tipo: string;
  categoria: string;
  localizacao: string;
  km_inicial: number;
  km_final: number;
  estado: string;
  fabricante: string;
  modelo: string;
  data_instalacao: string;
  status_operacional: string;
  observacoes: string;
  parametros: {
    alcance: number;
    frequencia: string;
    potencia: number;
    sensibilidade: number;
  };
}

export function SinalizacaoForm({ isOpen, onClose, editData, onSuccess, type }: SinalizacaoFormProps) {
  const [formData, setFormData] = useState<FormData>({
    codigo: '',
    tipo: '',
    categoria: '',
    localizacao: '',
    km_inicial: 0,
    km_final: 0,
    estado: '',
    fabricante: '',
    modelo: '',
    data_instalacao: '',
    status_operacional: '',
    observacoes: '',
    parametros: {
      alcance: 0,
      frequencia: '',
      potencia: 0,
      sensibilidade: 0
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Preencher formulário com dados de edição
  useEffect(() => {
    if (editData) {
      setFormData({
        codigo: editData.codigo || '',
        tipo: editData.tipo || '',
        categoria: editData.categoria || '',
        localizacao: editData.localizacao || '',
        km_inicial: editData.km_inicial || 0,
        km_final: editData.km_final || 0,
        estado: editData.estado || '',
        fabricante: editData.fabricante || '',
        modelo: editData.modelo || '',
        data_instalacao: editData.data_instalacao || '',
        status_operacional: editData.status_operacional || '',
        observacoes: editData.observacoes || '',
        parametros: {
          alcance: editData.parametros?.alcance || 0,
          frequencia: editData.parametros?.frequencia || '',
          potencia: editData.parametros?.potencia || 0,
          sensibilidade: editData.parametros?.sensibilidade || 0
        }
      });
    }
  }, [editData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleParametrosChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      parametros: {
        ...prev.parametros,
        [field]: value
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código é obrigatório';
    }

    if (!formData.tipo.trim()) {
      newErrors.tipo = 'Tipo é obrigatório';
    }

    if (!formData.categoria.trim()) {
      newErrors.categoria = 'Categoria é obrigatória';
    }

    if (!formData.localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    }

    if (formData.km_inicial >= formData.km_final) {
      newErrors.km_final = 'KM Final deve ser maior que KM Inicial';
    }

    if (!formData.estado.trim()) {
      newErrors.estado = 'Estado é obrigatório';
    }

    if (!formData.fabricante.trim()) {
      newErrors.fabricante = 'Fabricante é obrigatório';
    }

    if (!formData.modelo.trim()) {
      newErrors.modelo = 'Modelo é obrigatório';
    }

    if (!formData.data_instalacao) {
      newErrors.data_instalacao = 'Data de instalação é obrigatória';
    }

    if (!formData.status_operacional.trim()) {
      newErrors.status_operacional = 'Status operacional é obrigatório';
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
      if (editData) {
        // Atualizar
        await sinalizacaoAPI.sinalizacoes.update(editData.id, formData);
        toast.success('Sinalização atualizada com sucesso!');
      } else {
        // Criar
        await sinalizacaoAPI.sinalizacoes.create(formData);
        toast.success('Sinalização criada com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar sinalização:', error);
      toast.error('Erro ao salvar sinalização');
    } finally {
      setLoading(false);
    }
  };

  const tipoOptions = [
    { value: '', label: 'Selecione o tipo' },
    { value: 'Sinal Luminoso', label: 'Sinal Luminoso' },
    { value: 'Sinal Sonoro', label: 'Sinal Sonoro' },
    { value: 'Sinal Eletrônico', label: 'Sinal Eletrônico' },
    { value: 'Sinal de Velocidade', label: 'Sinal de Velocidade' },
    { value: 'Sinal de Passagem', label: 'Sinal de Passagem' }
  ];

  const categoriaOptions = [
    { value: '', label: 'Selecione a categoria' },
    { value: 'Sinalização de Via', label: 'Sinalização de Via' },
    { value: 'Sinalização de Passagem', label: 'Sinalização de Passagem' },
    { value: 'Sinalização de Velocidade', label: 'Sinalização de Velocidade' },
    { value: 'Sinalização de Segurança', label: 'Sinalização de Segurança' },
    { value: 'Sinalização de Emergência', label: 'Sinalização de Emergência' }
  ];

  const estadoOptions = [
    { value: '', label: 'Selecione o estado' },
    { value: 'Operacional', label: 'Operacional' },
    { value: 'Manutenção', label: 'Manutenção' },
    { value: 'Avariada', label: 'Avariada' },
    { value: 'Desativada', label: 'Desativada' }
  ];

  const fabricanteOptions = [
    { value: '', label: 'Selecione o fabricante' },
    { value: 'Siemens', label: 'Siemens' },
    { value: 'Alstom', label: 'Alstom' },
    { value: 'Bombardier', label: 'Bombardier' },
    { value: 'Thales', label: 'Thales' },
    { value: 'Ansaldo', label: 'Ansaldo' },
    { value: 'Outros', label: 'Outros' }
  ];

  const statusOptions = [
    { value: '', label: 'Selecione o status' },
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' },
    { value: 'Teste', label: 'Teste' },
    { value: 'Emergência', label: 'Emergência' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Signal className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editData ? 'Editar' : 'Nova'} Sinalização
                  </h2>
                  <p className="text-sm text-gray-600">
                    Preencha os dados da sinalização ferroviária
                  </p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código *
                </label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.codigo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: SIG-001-2024"
                />
                {errors.codigo && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.codigo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.tipo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {tipoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.tipo && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.tipo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.categoria ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {categoriaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.categoria && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.categoria}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização *
                </label>
                <input
                  type="text"
                  value={formData.localizacao}
                  onChange={(e) => handleInputChange('localizacao', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.localizacao ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Entrada Norte"
                />
                {errors.localizacao && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.localizacao}
                  </p>
                )}
              </div>
            </div>

            {/* Localização KM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  KM Inicial
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.km_inicial}
                  onChange={(e) => handleInputChange('km_inicial', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  KM Final
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.km_final}
                  onChange={(e) => handleInputChange('km_final', Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.km_final ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.0"
                />
                {errors.km_final && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.km_final}
                  </p>
                )}
              </div>
            </div>

            {/* Estado e Fabricante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.estado ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {estadoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.estado && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.estado}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fabricante *
                </label>
                <select
                  value={formData.fabricante}
                  onChange={(e) => handleInputChange('fabricante', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.fabricante ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {fabricanteOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.fabricante && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.fabricante}
                  </p>
                )}
              </div>
            </div>

            {/* Modelo e Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.modelo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: SIGMA-2000"
                />
                {errors.modelo && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.modelo}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Instalação *
                </label>
                <input
                  type="date"
                  value={formData.data_instalacao}
                  onChange={(e) => handleInputChange('data_instalacao', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.data_instalacao ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.data_instalacao && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.data_instalacao}
                  </p>
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
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.status_operacional ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.status_operacional && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.status_operacional}
                </p>
              )}
            </div>

            {/* Parâmetros Técnicos */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Gauge className="h-5 w-5 mr-2" />
                Parâmetros Técnicos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alcance (metros)
                  </label>
                  <input
                    type="number"
                    value={formData.parametros.alcance}
                    onChange={(e) => handleParametrosChange('alcance', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequência
                  </label>
                  <input
                    type="text"
                    value={formData.parametros.frequencia}
                    onChange={(e) => handleParametrosChange('frequencia', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="2.4 GHz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Potência (W)
                  </label>
                  <input
                    type="number"
                    value={formData.parametros.potencia}
                    onChange={(e) => handleParametrosChange('potencia', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sensibilidade (dBm)
                  </label>
                  <input
                    type="number"
                    value={formData.parametros.sensibilidade}
                    onChange={(e) => handleParametrosChange('sensibilidade', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="-85"
                  />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Observações adicionais sobre a sinalização..."
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
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{loading ? 'Salvando...' : 'Salvar Sinalização'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
