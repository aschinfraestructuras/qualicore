import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calendar, FileText, AlertTriangle, CheckCircle, Clock, Activity,
  User, Save, Loader, Building, Mountain
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface InspecaoPontesTuneisFormData {
  ponte_tunel_id: string;
  data_inspecao: string;
  tipo_inspecao: string;
  resultado: string;
  observacoes: string;
  responsavel: string;
  proxima_inspecao: string;
}

interface InspecaoPontesTuneisFormProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
  onSubmit: (data: InspecaoPontesTuneisFormData) => void;
  pontesTuneis: any[]; // Lista de pontes/túneis para seleção
}

const TIPOS_INSPECAO = [
  'Periódica',
  'Preventiva',
  'Corretiva',
  'Estrutural',
  'Segurança',
  'Emergência'
];

const RESULTADOS = [
  'Conforme',
  'Não Conforme',
  'Pendente',
  'Em Análise',
  'Aprovado',
  'Reprovado'
];

export function InspecaoPontesTuneisForm({ 
  isOpen, 
  onClose, 
  data, 
  onSubmit, 
  pontesTuneis 
}: InspecaoPontesTuneisFormProps) {
  const [formData, setFormData] = useState<InspecaoPontesTuneisFormData>({
    ponte_tunel_id: '',
    data_inspecao: '',
    tipo_inspecao: '',
    resultado: '',
    observacoes: '',
    responsavel: '',
    proxima_inspecao: ''
  });

  const [errors, setErrors] = useState<Partial<InspecaoPontesTuneisFormData>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        ponte_tunel_id: data.ponte_tunel_id || '',
        data_inspecao: data.data_inspecao || '',
        tipo_inspecao: data.tipo_inspecao || '',
        resultado: data.resultado || '',
        observacoes: data.observacoes || '',
        responsavel: data.responsavel || '',
        proxima_inspecao: data.proxima_inspecao || ''
      });
    } else {
      // Set default values for new inspection
      const today = new Date().toISOString().split('T')[0];
      const nextInspection = new Date();
      nextInspection.setMonth(nextInspection.getMonth() + 3);
      
      setFormData({
        ponte_tunel_id: '',
        data_inspecao: today,
        tipo_inspecao: 'Periódica',
        resultado: 'Conforme',
        observacoes: '',
        responsavel: '',
        proxima_inspecao: nextInspection.toISOString().split('T')[0]
      });
    }
  }, [data]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for the field
    if (errors[field as keyof InspecaoPontesTuneisFormData]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<InspecaoPontesTuneisFormData> = {};

    if (!formData.ponte_tunel_id) {
      newErrors.ponte_tunel_id = 'Seleção da estrutura é obrigatória';
    }

    if (!formData.data_inspecao) {
      newErrors.data_inspecao = 'Data da inspeção é obrigatória';
    }

    if (!formData.tipo_inspecao) {
      newErrors.tipo_inspecao = 'Tipo de inspeção é obrigatório';
    }

    if (!formData.resultado) {
      newErrors.resultado = 'Resultado é obrigatório';
    }

    if (!formData.responsavel.trim()) {
      newErrors.responsavel = 'Responsável é obrigatório';
    }

    if (!formData.proxima_inspecao) {
      newErrors.proxima_inspecao = 'Data da próxima inspeção é obrigatória';
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

    try {
      setLoading(true);
      await onSubmit(formData);
      toast.success('Inspeção salva com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar inspeção:', error);
      toast.error('Erro ao salvar inspeção');
    } finally {
      setLoading(false);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Ponte':
        return <Building className="h-4 w-4" />;
      case 'Túnel':
        return <Mountain className="h-4 w-4" />;
      case 'Viaduto':
        return <Building className="h-4 w-4" />;
      case 'Passagem Inferior':
        return <Activity className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {data ? 'Editar Inspeção' : 'Nova Inspeção'}
                </h2>
                <p className="text-sm text-gray-600">
                  {data ? 'Atualizar dados da inspeção' : 'Criar nova inspeção de estrutura'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Estrutura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estrutura *
              </label>
              <select
                value={formData.ponte_tunel_id}
                onChange={(e) => handleInputChange('ponte_tunel_id', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.ponte_tunel_id ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione uma estrutura</option>
                {pontesTuneis.map((estrutura) => (
                  <option key={estrutura.id} value={estrutura.id}>
                    {estrutura.codigo} - {estrutura.tipo} ({estrutura.localizacao})
                  </option>
                ))}
              </select>
              {errors.ponte_tunel_id && (
                <p className="mt-1 text-sm text-red-600">{errors.ponte_tunel_id}</p>
              )}
            </div>

            {/* Data da Inspeção */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data da Inspeção *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.data_inspecao}
                  onChange={(e) => handleInputChange('data_inspecao', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.data_inspecao ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.data_inspecao && (
                <p className="mt-1 text-sm text-red-600">{errors.data_inspecao}</p>
              )}
            </div>

            {/* Tipo de Inspeção */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Inspeção *
              </label>
              <select
                value={formData.tipo_inspecao}
                onChange={(e) => handleInputChange('tipo_inspecao', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.tipo_inspecao ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione o tipo</option>
                {TIPOS_INSPECAO.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
              {errors.tipo_inspecao && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo_inspecao}</p>
              )}
            </div>

            {/* Resultado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resultado *
              </label>
              <select
                value={formData.resultado}
                onChange={(e) => handleInputChange('resultado', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.resultado ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione o resultado</option>
                {RESULTADOS.map((resultado) => (
                  <option key={resultado} value={resultado}>
                    {resultado}
                  </option>
                ))}
              </select>
              {errors.resultado && (
                <p className="mt-1 text-sm text-red-600">{errors.resultado}</p>
              )}
            </div>

            {/* Responsável */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsável *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.responsavel}
                  onChange={(e) => handleInputChange('responsavel', e.target.value)}
                  placeholder="Nome do responsável"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.responsavel ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.responsavel && (
                <p className="mt-1 text-sm text-red-600">{errors.responsavel}</p>
              )}
            </div>

            {/* Próxima Inspeção */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Próxima Inspeção *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.proxima_inspecao}
                  onChange={(e) => handleInputChange('proxima_inspecao', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.proxima_inspecao ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.proxima_inspecao && (
                <p className="mt-1 text-sm text-red-600">{errors.proxima_inspecao}</p>
              )}
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Detalhes da inspeção, observações, recomendações..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{data ? 'Atualizar' : 'Criar'} Inspeção</span>
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
