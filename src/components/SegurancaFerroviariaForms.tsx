import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Calendar, Gauge, Shield, FileText, AlertTriangle, CheckCircle, Clock, Activity,
  Users, Download, Save, Loader, Bell, Camera, Lock
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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
    nivel_seguranca: number;
    raio_cobertura: number;
    tempo_resposta: number;
    capacidade_deteccao: number;
  };
}

interface SegurancaFerroviariaFormsProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
  onSubmit: (data: FormData) => void;
}

export function SegurancaFerroviariaForms({ isOpen, onClose, data, onSubmit }: SegurancaFerroviariaFormsProps) {
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
      nivel_seguranca: 1,
      raio_cobertura: 0,
      tempo_resposta: 0,
      capacidade_deteccao: 0
    }
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
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
        data_instalacao: data.data_instalacao || '',
        status_operacional: data.status_operacional || '',
        observacoes: data.observacoes || '',
        parametros: {
          nivel_seguranca: data.parametros?.nivel_seguranca || 1,
          raio_cobertura: data.parametros?.raio_cobertura || 0,
          tempo_resposta: data.parametros?.tempo_resposta || 0,
          capacidade_deteccao: data.parametros?.capacidade_deteccao || 0
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

    if (formData.km_final < 0) {
      newErrors.km_final = 'KM final deve ser maior ou igual a 0';
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

    if (!formData.data_instalacao) {
      newErrors.data_instalacao = 'Data de instalação é obrigatória';
    }

    if (!formData.status_operacional) {
      newErrors.status_operacional = 'Status operacional é obrigatório';
    }

    if (formData.parametros.nivel_seguranca < 1 || formData.parametros.nivel_seguranca > 5) {
      newErrors.parametros = { ...newErrors.parametros, nivel_seguranca: 'Nível de segurança deve estar entre 1 e 5' };
    }

    if (formData.parametros.raio_cobertura < 0) {
      newErrors.parametros = { ...newErrors.parametros, raio_cobertura: 'Raio de cobertura deve ser maior ou igual a 0' };
    }

    if (formData.parametros.tempo_resposta < 0) {
      newErrors.parametros = { ...newErrors.parametros, tempo_resposta: 'Tempo de resposta deve ser maior ou igual a 0' };
    }

    if (formData.parametros.capacidade_deteccao < 0 || formData.parametros.capacidade_deteccao > 100) {
      newErrors.parametros = { ...newErrors.parametros, capacidade_deteccao: 'Capacidade de detecção deve estar entre 0 e 100' };
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
      toast.success(data ? 'Sistema de segurança atualizado com sucesso!' : 'Sistema de segurança criado com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar sistema de segurança');
    } finally {
      setLoading(false);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Sistema de Detecção':
        return <Bell className="h-5 w-5" />;
      case 'Sistema de Vigilância':
        return <Camera className="h-5 w-5" />;
      case 'Sistema de Controle':
        return <Shield className="h-5 w-5" />;
      case 'Sistema de Alarme':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {data ? 'Editar Sistema de Segurança' : 'Novo Sistema de Segurança'}
                    </h2>
                    <p className="text-sm text-gray-600">Preencha os dados do sistema</p>
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
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código *
                  </label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => handleInputChange('codigo', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.codigo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="SEG-001-2024"
                  />
                  {errors.codigo && <p className="text-red-500 text-sm mt-1">{errors.codigo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.tipo ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Sistema de Detecção">Sistema de Detecção</option>
                    <option value="Sistema de Vigilância">Sistema de Vigilância</option>
                    <option value="Sistema de Controle">Sistema de Controle</option>
                    <option value="Sistema de Alarme">Sistema de Alarme</option>
                  </select>
                  {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.categoria ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione a categoria</option>
                    <option value="Detecção de Intrusão">Detecção de Intrusão</option>
                    <option value="CCTV">CCTV</option>
                    <option value="Controle de Acesso">Controle de Acesso</option>
                    <option value="Alarme de Incêndio">Alarme de Incêndio</option>
                    <option value="Detecção de Fumo">Detecção de Fumo</option>
                    <option value="Sistema de Emergência">Sistema de Emergência</option>
                  </select>
                  {errors.categoria && <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => handleInputChange('estado', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.estado ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione o estado</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Avaria">Avaria</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                  {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
                </div>
              </div>

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização *
                  </label>
                  <input
                    type="text"
                    value={formData.localizacao}
                    onChange={(e) => handleInputChange('localizacao', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.localizacao ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Lisboa - Estação Central"
                  />
                  {errors.localizacao && <p className="text-red-500 text-sm mt-1">{errors.localizacao}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    KM Inicial *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.km_inicial}
                    onChange={(e) => handleInputChange('km_inicial', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.km_inicial ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.000"
                  />
                  {errors.km_inicial && <p className="text-red-500 text-sm mt-1">{errors.km_inicial}</p>}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.km_final ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="5.000"
                  />
                  {errors.km_final && <p className="text-red-500 text-sm mt-1">{errors.km_final}</p>}
                </div>
              </div>

              {/* Equipment Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fabricante *
                  </label>
                  <input
                    type="text"
                    value={formData.fabricante}
                    onChange={(e) => handleInputChange('fabricante', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.fabricante ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Siemens"
                  />
                  {errors.fabricante && <p className="text-red-500 text-sm mt-1">{errors.fabricante}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => handleInputChange('modelo', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.modelo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="SICAM PAS"
                  />
                  {errors.modelo && <p className="text-red-500 text-sm mt-1">{errors.modelo}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Instalação *
                  </label>
                  <input
                    type="date"
                    value={formData.data_instalacao}
                    onChange={(e) => handleInputChange('data_instalacao', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.data_instalacao ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.data_instalacao && <p className="text-red-500 text-sm mt-1">{errors.data_instalacao}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Operacional *
                </label>
                <select
                  value={formData.status_operacional}
                  onChange={(e) => handleInputChange('status_operacional', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.status_operacional ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o status</option>
                  <option value="Operacional">Operacional</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Teste">Teste</option>
                  <option value="Desligado">Desligado</option>
                </select>
                {errors.status_operacional && <p className="text-red-500 text-sm mt-1">{errors.status_operacional}</p>}
              </div>

              {/* Technical Parameters */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Gauge className="h-5 w-5 mr-2 text-red-600" />
                  Parâmetros Técnicos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nível de Segurança (1-5) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={formData.parametros.nivel_seguranca}
                      onChange={(e) => handleInputChange('parametros.nivel_seguranca', parseInt(e.target.value) || 1)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.parametros?.nivel_seguranca ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.parametros?.nivel_seguranca && <p className="text-red-500 text-sm mt-1">{errors.parametros.nivel_seguranca}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Raio de Cobertura (m) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.parametros.raio_cobertura}
                      onChange={(e) => handleInputChange('parametros.raio_cobertura', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.parametros?.raio_cobertura ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.parametros?.raio_cobertura && <p className="text-red-500 text-sm mt-1">{errors.parametros.raio_cobertura}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempo de Resposta (s) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.parametros.tempo_resposta}
                      onChange={(e) => handleInputChange('parametros.tempo_resposta', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.parametros?.tempo_resposta ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.parametros?.tempo_resposta && <p className="text-red-500 text-sm mt-1">{errors.parametros.tempo_resposta}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacidade de Detecção (%) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.parametros.capacidade_deteccao}
                      onChange={(e) => handleInputChange('parametros.capacidade_deteccao', parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.parametros?.capacidade_deteccao ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.parametros?.capacidade_deteccao && <p className="text-red-500 text-sm mt-1">{errors.parametros.capacidade_deteccao}</p>}
                  </div>
                </div>
              </div>

              {/* Observations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Observações sobre o sistema de segurança..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{loading ? 'Salvando...' : (data ? 'Atualizar' : 'Criar')}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
