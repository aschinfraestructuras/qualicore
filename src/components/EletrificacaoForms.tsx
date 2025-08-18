import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Save, Upload, Camera, FileText, MapPin, Gauge, Zap, Settings, AlertCircle, CheckCircle, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { eletrificacaoAPI } from '../lib/supabase-api/eletrificacaoAPI';

interface EletrificacaoFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData: any;
  onSuccess: () => void;
  type: 'eletrificacao' | 'inspecao';
}

interface EletrificacaoFormData {
  codigo: string;
  tipo: "Catenária" | "Subestação" | "Poste" | "Transformador" | "Cabo" | "Disjuntor";
  categoria: "Alimentação" | "Transformação" | "Distribuição" | "Proteção" | "Controle";
  localizacao: string;
  km_inicial: number;
  km_final: number;
  estado: "Operacional" | "Manutenção" | "Avaria" | "Desligado";
  fabricante: string;
  modelo: string;
  data_instalacao: string;
  status_operacional: string;
  observacoes: string;
  parametros: {
    tensao: number;
    corrente: number;
    potencia: number;
    frequencia: number;
  };
}

export function EletrificacaoForm({ isOpen, onClose, editData, onSuccess, type }: EletrificacaoFormProps) {
  const [formData, setFormData] = useState<EletrificacaoFormData>({
    codigo: '', 
    tipo: 'Catenária', 
    categoria: 'Alimentação', 
    localizacao: '', 
    km_inicial: 0, 
    km_final: 0, 
    estado: 'Operacional', 
    fabricante: '', 
    modelo: '', 
    data_instalacao: '', 
    status_operacional: '', 
    observacoes: '',
    parametros: { tensao: 0, corrente: 0, potencia: 0, frequencia: 0 }
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editData) {
      setFormData({
        codigo: editData.codigo || '', 
        tipo: editData.tipo || 'Catenária', 
        categoria: editData.categoria || 'Alimentação',
        localizacao: editData.localizacao || '', 
        km_inicial: editData.km_inicial || 0, 
        km_final: editData.km_final || 0,
        estado: editData.estado || 'Operacional', 
        fabricante: editData.fabricante || '', 
        modelo: editData.modelo || '',
        data_instalacao: editData.data_instalacao || '', 
        status_operacional: editData.status_operacional || '',
        observacoes: editData.observacoes || '',
        parametros: {
          tensao: editData.parametros?.tensao || 0,
          corrente: editData.parametros?.corrente || 0,
          potencia: editData.parametros?.potencia || 0,
          frequencia: editData.parametros?.frequencia || 0
        }
      });
    } else {
      setFormData({
        codigo: '', 
        tipo: 'Catenária', 
        categoria: 'Alimentação', 
        localizacao: '', 
        km_inicial: 0, 
        km_final: 0, 
        estado: 'Operacional', 
        fabricante: '', 
        modelo: '', 
        data_instalacao: '', 
        status_operacional: '', 
        observacoes: '',
        parametros: { tensao: 0, corrente: 0, potencia: 0, frequencia: 0 }
      });
    }
  }, [editData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleParametrosChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      parametros: { ...prev.parametros, [field]: value }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.codigo.trim()) newErrors.codigo = 'Código é obrigatório';
    if (!formData.tipo) newErrors.tipo = 'Tipo é obrigatório';
    if (!formData.categoria) newErrors.categoria = 'Categoria é obrigatória';
    if (!formData.localizacao.trim()) newErrors.localizacao = 'Localização é obrigatória';
    if (!formData.data_instalacao) newErrors.data_instalacao = 'Data de instalação é obrigatória';
    if (!formData.estado) newErrors.estado = 'Estado é obrigatório';
    if (formData.parametros.tensao <= 0) newErrors.tensao = 'Tensão deve ser > 0';
    if (formData.parametros.corrente <= 0) newErrors.corrente = 'Corrente deve ser > 0';
    if (formData.parametros.potencia <= 0) newErrors.potencia = 'Potência deve ser > 0';
    if (formData.parametros.frequencia <= 0) newErrors.frequencia = 'Frequência deve ser > 0';

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
        await eletrificacaoAPI.eletrificacoes.update(editData.id, formData);
        toast.success('Eletrificação atualizada com sucesso!');
      } else {
        await eletrificacaoAPI.eletrificacoes.create(formData);
        toast.success('Eletrificação criada com sucesso!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar eletrificação:', error);
      toast.error('Erro ao salvar eletrificação');
    } finally {
      setLoading(false);
    }
  };

  const tipoOptions = [
    { value: '', label: 'Selecione o tipo' },
    { value: 'Catenária', label: 'Catenária' },
    { value: 'Subestação', label: 'Subestação' },
    { value: 'Poste', label: 'Poste' },
    { value: 'Transformador', label: 'Transformador' },
    { value: 'Cabo', label: 'Cabo' },
    { value: 'Disjuntor', label: 'Disjuntor' }
  ];

  const categoriaOptions = [
    { value: '', label: 'Selecione a categoria' },
    { value: 'Alimentação', label: 'Alimentação' },
    { value: 'Transformação', label: 'Transformação' },
    { value: 'Distribuição', label: 'Distribuição' },
    { value: 'Proteção', label: 'Proteção' },
    { value: 'Controle', label: 'Controle' }
  ];

  const estadoOptions = [
    { value: '', label: 'Selecione o estado' },
    { value: 'Operacional', label: 'Operacional' },
    { value: 'Manutenção', label: 'Manutenção' },
    { value: 'Avaria', label: 'Avaria' },
    { value: 'Desligado', label: 'Desligado' }
  ];

  const fabricanteOptions = [
    { value: '', label: 'Selecione o fabricante' },
    { value: 'Siemens', label: 'Siemens' },
    { value: 'ABB', label: 'ABB' },
    { value: 'Schneider Electric', label: 'Schneider Electric' },
    { value: 'General Electric', label: 'General Electric' },
    { value: 'Alstom', label: 'Alstom' },
    { value: 'Bombardier', label: 'Bombardier' },
    { value: 'Outro', label: 'Outro' }
  ];

  const statusOptions = [
    { value: '', label: 'Selecione o status' },
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' },
    { value: 'Manutenção', label: 'Manutenção' },
    { value: 'Avaria', label: 'Avaria' }
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
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editData ? 'Editar' : 'Nova'} Eletrificação
                  </h2>
                  <p className="text-sm text-gray-600">
                    Preencha os dados da eletrificação ferroviária
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                    errors.codigo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: CAT-001-2024"
                />
                {errors.codigo && (
                  <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => handleInputChange('tipo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                    errors.tipo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {tipoOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.tipo && (
                  <p className="text-red-500 text-xs mt-1">{errors.tipo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                    errors.categoria ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {categoriaOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.categoria && (
                  <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                    errors.localizacao ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Linha Norte - KM 45.2"
                />
                {errors.localizacao && (
                  <p className="text-red-500 text-xs mt-1">{errors.localizacao}</p>
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                    errors.data_instalacao ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.data_instalacao && (
                  <p className="text-red-500 text-xs mt-1">{errors.data_instalacao}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                    errors.estado ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {estadoOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.estado && (
                  <p className="text-red-500 text-xs mt-1">{errors.estado}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fabricante
                </label>
                <select
                  value={formData.fabricante}
                  onChange={(e) => handleInputChange('fabricante', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                >
                  {fabricanteOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo
                </label>
                <input
                  type="text"
                  value={formData.modelo}
                  onChange={(e) => handleInputChange('modelo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ex: CAT-1500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KM Inicial
                </label>
                <input
                  type="number"
                  value={formData.km_inicial}
                  onChange={(e) => handleInputChange('km_inicial', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  KM Final
                </label>
                <input
                  type="number"
                  value={formData.km_final}
                  onChange={(e) => handleInputChange('km_final', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.0"
                  step="0.1"
                />
              </div>
            </div>

            {/* Parâmetros Técnicos */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Gauge className="h-5 w-5 mr-2 text-yellow-600" />
                Parâmetros Técnicos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tensão (V) *
                  </label>
                  <input
                    type="number"
                    value={formData.parametros.tensao}
                    onChange={(e) => handleParametrosChange('tensao', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                      errors.tensao ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="25000"
                  />
                  {errors.tensao && (
                    <p className="text-red-500 text-xs mt-1">{errors.tensao}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Corrente (A) *
                  </label>
                  <input
                    type="number"
                    value={formData.parametros.corrente}
                    onChange={(e) => handleParametrosChange('corrente', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                      errors.corrente ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="1000"
                  />
                  {errors.corrente && (
                    <p className="text-red-500 text-xs mt-1">{errors.corrente}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Potência (kW) *
                  </label>
                  <input
                    type="number"
                    value={formData.parametros.potencia}
                    onChange={(e) => handleParametrosChange('potencia', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                      errors.potencia ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="25000"
                  />
                  {errors.potencia && (
                    <p className="text-red-500 text-xs mt-1">{errors.potencia}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequência (Hz) *
                  </label>
                  <input
                    type="number"
                    value={formData.parametros.frequencia}
                    onChange={(e) => handleParametrosChange('frequencia', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 ${
                      errors.frequencia ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="50"
                  />
                  {errors.frequencia && (
                    <p className="text-red-500 text-xs mt-1">{errors.frequencia}</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                placeholder="Observações adicionais sobre a eletrificação..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{editData ? 'Atualizar' : 'Criar'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}