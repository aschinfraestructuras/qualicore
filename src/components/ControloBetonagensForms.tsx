import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Building, 
  Calendar, 
  Thermometer, 
  Gauge, 
  FileText,
  MapPin,
  Truck,
  Hash,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Betonagem {
  id: string;
  codigo: string;
  obra: string;
  elemento_estrutural: string;
  localizacao: string;
  data_betonagem: string;
  data_ensaio_7d: string;
  data_ensaio_28d: string;
  fornecedor: string;
  guia_remessa: string;
  tipo_betao: string;
  aditivos: string;
  hora_limite_uso: string;
  slump: number;
  temperatura: number;
  resistencia_7d_1: number;
  resistencia_7d_2: number;
  resistencia_28d_1: number;
  resistencia_28d_2: number;
  resistencia_28d_3: number;
  resistencia_rotura: number;
  dimensoes_provete: string;
  status_conformidade: string;
  observacoes: string;
  relatorio_rotura: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  codigo: string;
  obra: string;
  elemento_estrutural: string;
  localizacao: string;
  data_betonagem: string;
  data_ensaio_7d: string;
  data_ensaio_28d: string;
  fornecedor: string;
  guia_remessa: string;
  tipo_betao: string;
  aditivos: string;
  hora_limite_uso: string;
  slump: number;
  temperatura: number;
  resistencia_7d_1: number;
  resistencia_7d_2: number;
  resistencia_28d_1: number;
  resistencia_28d_2: number;
  resistencia_28d_3: number;
  resistencia_rotura: number;
  dimensoes_provete: string;
  status_conformidade: string;
  observacoes: string;
  relatorio_rotura: string;
}

interface ControloBetonagensFormsProps {
  betonagem?: Betonagem | null;
  onSubmit: (data: FormData) => void;
  onClose: () => void;
}

const ELEMENTOS_ESTRUTURAIS = [
  'Pilar',
  'Viga',
  'Laje',
  'Fundação',
  'Muro',
  'Escada',
  'Cobertura',
  'Pavimento',
  'Outro'
];

const STATUS_CONFORMIDADE = [
  'Conforme',
  'Não Conforme',
  'Pendente'
];

const DIMENSOES_PROVETE = [
  '15x15x15 cm',
  '15x30 cm',
  '10x20 cm',
  'Outro'
];

const TIPOS_BETAO = [
  'C20/25',
  'C25/30',
  'C30/37',
  'C35/45',
  'C40/50',
  'C45/55',
  'C50/60',
  'Outro'
];

const ADITIVOS = [
  'Nenhum',
  'Superplastificante',
  'Retardador',
  'Acelerador',
  'Impermeabilizante',
  'Fibras',
  'Outro'
];

export default function ControloBetonagensForms({ betonagem, onSubmit, onClose }: ControloBetonagensFormsProps) {
  const [formData, setFormData] = useState<FormData>({
    codigo: '',
    obra: '',
    elemento_estrutural: '',
    localizacao: '',
    data_betonagem: '',
    data_ensaio_7d: '',
    data_ensaio_28d: '',
    fornecedor: '',
    guia_remessa: '',
    tipo_betao: '',
    aditivos: 'Nenhum',
    hora_limite_uso: '',
    slump: 0,
    temperatura: 0,
    resistencia_7d_1: 0,
    resistencia_7d_2: 0,
    resistencia_28d_1: 0,
    resistencia_28d_2: 0,
    resistencia_28d_3: 0,
    resistencia_rotura: 0,
    dimensoes_provete: '',
    status_conformidade: 'Pendente',
    observacoes: '',
    relatorio_rotura: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (betonagem) {
      setFormData({
        codigo: betonagem.codigo,
        obra: betonagem.obra || '',
        elemento_estrutural: betonagem.elemento_estrutural,
        localizacao: betonagem.localizacao,
        data_betonagem: betonagem.data_betonagem,
        data_ensaio_7d: betonagem.data_ensaio_7d,
        data_ensaio_28d: betonagem.data_ensaio_28d,
        fornecedor: betonagem.fornecedor,
        guia_remessa: betonagem.guia_remessa,
        tipo_betao: betonagem.tipo_betao || '',
        aditivos: betonagem.aditivos || 'Nenhum',
        hora_limite_uso: betonagem.hora_limite_uso || '',
        slump: betonagem.slump,
        temperatura: betonagem.temperatura,
        resistencia_7d_1: betonagem.resistencia_7d_1,
        resistencia_7d_2: betonagem.resistencia_7d_2,
        resistencia_28d_1: betonagem.resistencia_28d_1,
        resistencia_28d_2: betonagem.resistencia_28d_2,
        resistencia_28d_3: betonagem.resistencia_28d_3,
        resistencia_rotura: betonagem.resistencia_rotura,
        dimensoes_provete: betonagem.dimensoes_provete,
        status_conformidade: betonagem.status_conformidade,
        observacoes: betonagem.observacoes,
        relatorio_rotura: betonagem.relatorio_rotura || ''
      });
    }
  }, [betonagem]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código é obrigatório';
    }

    if (!formData.obra.trim()) {
      newErrors.obra = 'Obra é obrigatória';
    }

    if (!formData.elemento_estrutural) {
      newErrors.elemento_estrutural = 'Elemento estrutural é obrigatório';
    }

    if (!formData.localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    }

    if (!formData.data_betonagem) {
      newErrors.data_betonagem = 'Data de betonagem é obrigatória';
    }

    if (!formData.fornecedor.trim()) {
      newErrors.fornecedor = 'Fornecedor é obrigatório';
    }

    if (!formData.guia_remessa.trim()) {
      newErrors.guia_remessa = 'Guia de remessa é obrigatória';
    }

    if (formData.slump < 0) {
      newErrors.slump = 'Slump deve ser maior ou igual a 0';
    }

    if (formData.temperatura < -10 || formData.temperatura > 50) {
      newErrors.temperatura = 'Temperatura deve estar entre -10°C e 50°C';
    }

    if (formData.resistencia_7d_1 < 0) {
      newErrors.resistencia_7d_1 = 'Resistência 7d deve ser maior ou igual a 0';
    }

    if (formData.resistencia_7d_2 < 0) {
      newErrors.resistencia_7d_2 = 'Resistência 7d deve ser maior ou igual a 0';
    }

    if (formData.resistencia_28d_1 < 0) {
      newErrors.resistencia_28d_1 = 'Resistência 28d deve ser maior ou igual a 0';
    }

    if (formData.resistencia_28d_2 < 0) {
      newErrors.resistencia_28d_2 = 'Resistência 28d deve ser maior ou igual a 0';
    }

    if (formData.resistencia_28d_3 < 0) {
      newErrors.resistencia_28d_3 = 'Resistência 28d deve ser maior ou igual a 0';
    }

    if (formData.resistencia_rotura < 0) {
      newErrors.resistencia_rotura = 'Resistência de rotura deve ser maior ou igual a 0';
    }

    if (!formData.dimensoes_provete) {
      newErrors.dimensoes_provete = 'Dimensões do provete são obrigatórias';
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

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
      toast.error('Erro ao salvar betonagem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNumberInputChange = (field: keyof FormData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Calcular automaticamente as datas de ensaio baseado na data de betonagem
  useEffect(() => {
    if (formData.data_betonagem && !betonagem) { // Só calcular se não for edição
      const dataBetonagem = new Date(formData.data_betonagem);
      
      // Calcular data de ensaio a 7 dias
      const dataEnsaio7d = new Date(dataBetonagem);
      dataEnsaio7d.setDate(dataEnsaio7d.getDate() + 7);
      
      // Calcular data de ensaio a 28 dias
      const dataEnsaio28d = new Date(dataBetonagem);
      dataEnsaio28d.setDate(dataEnsaio28d.getDate() + 28);
      
      setFormData(prev => ({
        ...prev,
        data_ensaio_7d: dataEnsaio7d.toISOString().split('T')[0],
        data_ensaio_28d: dataEnsaio28d.toISOString().split('T')[0]
      }));
    }
  }, [formData.data_betonagem, betonagem]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Conforme': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Não Conforme': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Pendente': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {betonagem ? 'Editar Betonagem' : 'Nova Betonagem'}
                </h2>
                <p className="text-sm text-gray-600">
                  {betonagem ? 'Atualizar dados da betonagem' : 'Registar nova betonagem'}
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
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   <Hash className="h-4 w-4 inline mr-1" />
                   Código *
                 </label>
                 <input
                   type="text"
                   name="codigo"
                   value={formData.codigo}
                   onChange={(e) => handleInputChange('codigo', e.target.value)}
                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                     errors.codigo ? 'border-red-500' : 'border-gray-300'
                   }`}
                   placeholder="Ex: BET-2024-001"
                   required
                 />
                 {errors.codigo && (
                   <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>
                 )}
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   <Building className="h-4 w-4 inline mr-1" />
                   Obra *
                 </label>
                 <input
                   type="text"
                   name="obra"
                   value={formData.obra}
                   onChange={(e) => handleInputChange('obra', e.target.value)}
                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                     errors.obra ? 'border-red-500' : 'border-gray-300'
                   }`}
                   placeholder="Ex: Viaduto A1 - Km 45"
                   required
                 />
                 {errors.obra && (
                   <p className="mt-1 text-sm text-red-600">{errors.obra}</p>
                 )}
               </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building className="h-4 w-4 inline mr-1" />
                  Elemento Estrutural *
                </label>
                <select
                  name="elemento_estrutural"
                  value={formData.elemento_estrutural}
                  onChange={(e) => handleInputChange('elemento_estrutural', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.elemento_estrutural ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Selecionar elemento</option>
                  {ELEMENTOS_ESTRUTURAIS.map((elemento) => (
                    <option key={elemento} value={elemento}>{elemento}</option>
                  ))}
                </select>
                {errors.elemento_estrutural && (
                  <p className="mt-1 text-sm text-red-600">{errors.elemento_estrutural}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Localização *
                </label>
                <input
                  type="text"
                  name="localizacao"
                  value={formData.localizacao}
                  onChange={(e) => handleInputChange('localizacao', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.localizacao ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Pilar P1 - Nível 0"
                  required
                />
                {errors.localizacao && (
                  <p className="mt-1 text-sm text-red-600">{errors.localizacao}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Data de Betonagem *
                </label>
                <input
                  type="date"
                  name="data_betonagem"
                  value={formData.data_betonagem}
                  onChange={(e) => handleInputChange('data_betonagem', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.data_betonagem ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.data_betonagem && (
                  <p className="mt-1 text-sm text-red-600">{errors.data_betonagem}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Data Ensaio 7 dias
                </label>
                <input
                  type="date"
                  name="data_ensaio_7d"
                  value={formData.data_ensaio_7d}
                  onChange={(e) => handleInputChange('data_ensaio_7d', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Data Ensaio 28 dias
                </label>
                <input
                  type="date"
                  name="data_ensaio_28d"
                  value={formData.data_ensaio_28d}
                  onChange={(e) => handleInputChange('data_ensaio_28d', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Truck className="h-4 w-4 inline mr-1" />
                  Fornecedor *
                </label>
                <input
                  type="text"
                  name="fornecedor"
                  value={formData.fornecedor}
                  onChange={(e) => handleInputChange('fornecedor', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fornecedor ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Cimpor, Secil"
                  required
                />
                {errors.fornecedor && (
                  <p className="mt-1 text-sm text-red-600">{errors.fornecedor}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Guia de Remessa *
                </label>
                <input
                  type="text"
                  name="guia_remessa"
                  value={formData.guia_remessa}
                  onChange={(e) => handleInputChange('guia_remessa', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.guia_remessa ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: GR-2024-001"
                  required
                />
                {errors.guia_remessa && (
                  <p className="mt-1 text-sm text-red-600">{errors.guia_remessa}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Gauge className="h-4 w-4 inline mr-1" />
                  Slump (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="slump"
                  value={formData.slump}
                                     onChange={(e) => handleNumberInputChange('slump', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.slump ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 12.5"
                />
                {errors.slump && (
                  <p className="mt-1 text-sm text-red-600">{errors.slump}</p>
                )}
              </div>

                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   <Thermometer className="h-4 w-4 inline mr-1" />
                   Temperatura (°C)
                 </label>
                 <input
                   type="number"
                   step="0.1"
                   name="temperatura"
                   value={formData.temperatura}
                                      onChange={(e) => handleNumberInputChange('temperatura', e.target.value)}
                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                     errors.temperatura ? 'border-red-500' : 'border-gray-300'
                   }`}
                   placeholder="Ex: 18.0"
                 />
                 {errors.temperatura && (
                   <p className="mt-1 text-sm text-red-600">{errors.temperatura}</p>
                 )}
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   <Gauge className="h-4 w-4 inline mr-1" />
                   Tipo de Betão
                 </label>
                 <select
                   name="tipo_betao"
                   value={formData.tipo_betao}
                   onChange={(e) => handleInputChange('tipo_betao', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 >
                   <option value="">Selecionar tipo</option>
                   {TIPOS_BETAO.map((tipo) => (
                     <option key={tipo} value={tipo}>{tipo}</option>
                   ))}
                 </select>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   <FileText className="h-4 w-4 inline mr-1" />
                   Aditivos
                 </label>
                 <select
                   name="aditivos"
                   value={formData.aditivos}
                   onChange={(e) => handleInputChange('aditivos', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 >
                   {ADITIVOS.map((aditivo) => (
                     <option key={aditivo} value={aditivo}>{aditivo}</option>
                   ))}
                 </select>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   <Calendar className="h-4 w-4 inline mr-1" />
                   Hora Limite de Uso
                 </label>
                 <input
                   type="time"
                   name="hora_limite_uso"
                   value={formData.hora_limite_uso}
                   onChange={(e) => handleInputChange('hora_limite_uso', e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                 />
               </div>
             </div>

            {/* Seção de Resistências */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Thermometer className="w-5 h-5 mr-2 text-blue-600" />
                Resistências das Provetas (MPa)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Resistências 7 dias */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-3">A 7 dias</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Probeta 1
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="resistencia_7d_1"
                        value={formData.resistencia_7d_1}
                        onChange={(e) => handleNumberInputChange('resistencia_7d_1', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.resistencia_7d_1 ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: 25.3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Probeta 2
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="resistencia_7d_2"
                        value={formData.resistencia_7d_2}
                        onChange={(e) => handleNumberInputChange('resistencia_7d_2', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.resistencia_7d_2 ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: 26.1"
                      />
                    </div>
                  </div>
                </div>

                {/* Resistências 28 dias */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-3">A 28 dias</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Probeta 1
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="resistencia_28d_1"
                        value={formData.resistencia_28d_1}
                        onChange={(e) => handleNumberInputChange('resistencia_28d_1', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.resistencia_28d_1 ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: 38.5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Probeta 2
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="resistencia_28d_2"
                        value={formData.resistencia_28d_2}
                                                 onChange={(e) => handleNumberInputChange('resistencia_28d_2', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.resistencia_28d_2 ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: 39.2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Probeta 3
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        name="resistencia_28d_3"
                        value={formData.resistencia_28d_3}
                                                 onChange={(e) => handleNumberInputChange('resistencia_28d_3', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.resistencia_28d_3 ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Ex: 37.8"
                      />
                    </div>
                  </div>
                </div>

                {/* Resistência de Rotura */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-3">Resistência de Rotura</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor (MPa)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="resistencia_rotura"
                      value={formData.resistencia_rotura}
                                             onChange={(e) => handleNumberInputChange('resistencia_rotura', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.resistencia_rotura ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ex: 42.1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Campo editável para rompamento diferente</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status e Observações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Gauge className="h-4 w-4 inline mr-1" />
                  Dimensões do Provete *
                </label>
                <select
                  name="dimensoes_provete"
                  value={formData.dimensoes_provete}
                  onChange={(e) => handleInputChange('dimensoes_provete', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.dimensoes_provete ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Selecionar dimensões</option>
                  {DIMENSOES_PROVETE.map((dimensao) => (
                    <option key={dimensao} value={dimensao}>{dimensao}</option>
                  ))}
                </select>
                {errors.dimensoes_provete && (
                  <p className="mt-1 text-sm text-red-600">{errors.dimensoes_provete}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  Status de Conformidade *
                </label>
                <div className="relative">
                  <select
                    name="status_conformidade"
                    value={formData.status_conformidade}
                    onChange={(e) => handleInputChange('status_conformidade', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecionar status</option>
                    {STATUS_CONFORMIDADE.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {getStatusIcon(formData.status_conformidade)}
                  </div>
                </div>
              </div>

                             <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Observações
                 </label>
                 <textarea
                   value={formData.observacoes}
                   onChange={(e) => handleInputChange('observacoes', e.target.value)}
                   rows={3}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Observações adicionais..."
                 />
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   <FileText className="h-4 w-4 inline mr-1" />
                   Relatório de Rotura
                 </label>
                 <textarea
                   value={formData.relatorio_rotura}
                   onChange={(e) => handleInputChange('relatorio_rotura', e.target.value)}
                   rows={3}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="Link ou referência para o relatório de resultados da rotura..."
                 />
                 <p className="text-xs text-gray-500 mt-1">Insira o link ou referência para o relatório de resultados da rotura</p>
               </div>
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
                disabled={isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>A guardar...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{betonagem ? 'Atualizar' : 'Criar'} Betonagem</span>
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
