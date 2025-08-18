import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  X, 
  Upload, 
  FileText, 
  Image, 
  BookOpen,
  Calculator,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CaracterizacaoSolo } from '@/types/solos';
import NormasManager from './NormasManager';

interface FormData {
  codigo: string;
  obra: string;
  localizacao: string;
  coordenadas_gps: string;
  data_colheita: string;
  data_rececao_laboratorio: string;
  data_resultados: string;
  laboratorio: string;
  responsavel_tecnico: string;
  fiscal_obra: string;
  profundidade_colheita: number;
  tipo_amostra: 'Disturbada' | 'Indeformada' | 'Sondagem';
  numero_amostra: string;
  descricao_visual: string;
  humidade_natural: number;
  densidade_natural: number;
  densidade_seca: number;
  indice_vazios: number;
  porosidade: number;
  granulometria_peneiracao: {
    p80: number;
    p63: number;
    p50: number;
    p40: number;
    p25: number;
    p20: number;
    p10: number;
    p5: number;
    p2: number;
    p04: number;
    p008: number;
  };
  granulometria_sedimentacao: {
    silte: number;
    argila: number;
    coeficiente_uniformidade: number;
    coeficiente_curvatura: number;
  };
  limites_consistencia: {
    limite_liquidez: number;
    limite_plasticidade: number;
    indice_plasticidade: number;
    indice_liquidez: number;
  };
  proctor_normal: {
    humidade_otima: number;
    densidade_maxima: number;
    grau_compactacao: number;
  };
  proctor_modificado: {
    humidade_otima: number;
    densidade_maxima: number;
    grau_compactacao: number;
  };
  cbr: {
    valor_cbr: number;
    expansao: number;
    penetracao: number;
  };
  resistencia_cisalhamento: {
    coesao: number;
    angulo_atrito: number;
    tipo_ensaio: 'Direto' | 'Triaxial' | 'Cisalhamento';
  };
  caracteristicas_quimicas: {
    ph: number;
    materia_organica: number;
    sulfatos: number;
    gessos: number;
    carbonatos: number;
    cloretos: number;
    capacidade_troca_cationica: number;
    sais_soluveis: number;
    sulfatos_soluveis_so3: number;
  };
  ensaios_especificos: {
    hinchamiento_livre: number;
    colapso: number;
    permeabilidade: number;
    compressibilidade: number;
    consolidacao: {
      indice_compressao: number;
      indice_recompressao: number;
      pressao_preconsolidacao: number;
    };
  };
  classificacao: {
    sistema_unificado: string;
    sistema_aashto: string;
    grupo_portugues: string;
    adequacao: 'INADECUADO' | 'TOLERABLE' | 'MARGINAL' | 'ADEQUADO' | 'EXCELENTE';
  };
  conforme: boolean;
  observacoes: string;
  recomendacoes: string;
  relatorio_laboratorio: string;
  certificado_laboratorio: string;
  fotos_amostra: string[];
  normas_referencia: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CaracterizacaoSolo) => void;
  editingSolo?: CaracterizacaoSolo;
}

const TIPOS_AMOSTRA = ['Disturbada', 'Indeformada', 'Sondagem'];
const TIPOS_ENSAIO = ['Direto', 'Triaxial', 'Cisalhamento'];
const ADEQUACOES = ['INADECUADO', 'TOLERABLE', 'MARGINAL', 'ADEQUADO', 'EXCELENTE'];

const initialFormData: FormData = {
  codigo: '',
  obra: '',
  localizacao: '',
  coordenadas_gps: '',
  data_colheita: '',
  data_rececao_laboratorio: '',
  data_resultados: '',
  laboratorio: '',
  responsavel_tecnico: '',
  fiscal_obra: '',
  profundidade_colheita: 0,
  tipo_amostra: 'Disturbada',
  numero_amostra: '',
  descricao_visual: '',
  humidade_natural: 0,
  densidade_natural: 0,
  densidade_seca: 0,
  indice_vazios: 0,
  porosidade: 0,
  granulometria_peneiracao: {
    p80: 100, p63: 100, p50: 100, p40: 100, p25: 100, p20: 100,
    p10: 100, p5: 100, p2: 100, p04: 100, p008: 100
  },
  granulometria_sedimentacao: {
    silte: 0, argila: 0, coeficiente_uniformidade: 0, coeficiente_curvatura: 0
  },
  limites_consistencia: {
    limite_liquidez: 0, limite_plasticidade: 0, indice_plasticidade: 0, indice_liquidez: 0
  },
  proctor_normal: { humidade_otima: 0, densidade_maxima: 0, grau_compactacao: 0 },
  proctor_modificado: { humidade_otima: 0, densidade_maxima: 0, grau_compactacao: 0 },
  cbr: { valor_cbr: 0, expansao: 0, penetracao: 0 },
  resistencia_cisalhamento: { coesao: 0, angulo_atrito: 0, tipo_ensaio: 'Triaxial' },
  caracteristicas_quimicas: {
    ph: 0, materia_organica: 0, sulfatos: 0, gessos: 0, carbonatos: 0,
    cloretos: 0, capacidade_troca_cationica: 0, sais_soluveis: 0, sulfatos_soluveis_so3: 0
  },
  ensaios_especificos: {
    hinchamiento_livre: 0, colapso: 0, permeabilidade: 0, compressibilidade: 0,
    consolidacao: { indice_compressao: 0, indice_recompressao: 0, pressao_preconsolidacao: 0 }
  },
  classificacao: {
    sistema_unificado: '', sistema_aashto: '', grupo_portugues: '', adequacao: 'MARGINAL'
  },
  conforme: false,
  observacoes: '',
  recomendacoes: '',
  relatorio_laboratorio: '',
  certificado_laboratorio: '',
  fotos_amostra: [],
  normas_referencia: []
};

export default function CaracterizacaoSolosForms({ isOpen, onClose, onSubmit, editingSolo }: Props) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showNormasManager, setShowNormasManager] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingSolo) {
      setFormData({
        ...initialFormData,
        ...editingSolo,
        coordenadas_gps: editingSolo.coordenadas_gps || '',
        fotos_amostra: editingSolo.fotos_amostra || [],
        normas_referencia: editingSolo.normas_referencia || []
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingSolo]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.codigo) newErrors.codigo = 'Código é obrigatório';
    if (!formData.obra) newErrors.obra = 'Obra é obrigatória';
    if (!formData.localizacao) newErrors.localizacao = 'Localização é obrigatória';
    if (!formData.laboratorio) newErrors.laboratorio = 'Laboratório é obrigatório';
    if (!formData.data_colheita) newErrors.data_colheita = 'Data de colheita é obrigatória';
    if (!formData.data_resultados) newErrors.data_resultados = 'Data de resultados é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    const soloData: CaracterizacaoSolo = {
      ...formData,
      id: editingSolo?.id
    };

    onSubmit(soloData);
    onClose();
  };

  const handleNormaSelect = (norma: any) => {
    if (!formData.normas_referencia.includes(norma.codigo)) {
      setFormData(prev => ({
        ...prev,
        normas_referencia: [...prev.normas_referencia, norma.codigo]
      }));
    }
  };

  const removeNorma = (codigo: string) => {
    setFormData(prev => ({
      ...prev,
      normas_referencia: prev.normas_referencia.filter(n => n !== codigo)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calculator className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {editingSolo ? 'Editar' : 'Nova'} Caracterização de Solo
                </h2>
                <p className="text-green-100">Documentar resultados de laboratório</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-12 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            {currentStep === 1 && 'Informações Gerais'}
            {currentStep === 2 && 'Características Físicas'}
            {currentStep === 3 && 'Ensaios de Laboratório'}
            {currentStep === 4 && 'Classificação e Conformidade'}
            {currentStep === 5 && 'Documentação'}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh] p-6">
          {/* Step 1: Informações Gerais */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código da Amostra *
                </label>
                <input
                  type="text"
                  value={formData.codigo || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.codigo ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: SOLO-2024-001"
                />
                {errors.codigo && <p className="text-red-500 text-sm mt-1">{errors.codigo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Obra *
                </label>
                <input
                  type="text"
                  value={formData.obra || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, obra: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.obra ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nome da obra"
                />
                {errors.obra && <p className="text-red-500 text-sm mt-1">{errors.obra}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização *
                </label>
                <input
                  type="text"
                  value={formData.localizacao || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, localizacao: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.localizacao ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Localização específica na obra"
                />
                {errors.localizacao && <p className="text-red-500 text-sm mt-1">{errors.localizacao}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coordenadas GPS
                </label>
                <input
                  type="text"
                  value={formData.coordenadas_gps || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, coordenadas_gps: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 41.1579, -8.6291"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profundidade de Colheita (m) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.profundidade_colheita}
                  onChange={(e) => setFormData(prev => ({ ...prev, profundidade_colheita: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Amostra *
                </label>
                <select
                  value={formData.tipo_amostra}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipo_amostra: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {TIPOS_AMOSTRA.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número da Amostra *
                </label>
                <input
                  type="text"
                  value={formData.numero_amostra || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, numero_amostra: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: AM-001"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Visual
                </label>
                <textarea
                  value={formData.descricao_visual || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao_visual: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descrição visual da amostra..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Características Físicas */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Humidade Natural (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.humidade_natural}
                  onChange={(e) => setFormData(prev => ({ ...prev, humidade_natural: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Densidade Natural (g/cm³)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.densidade_natural}
                  onChange={(e) => setFormData(prev => ({ ...prev, densidade_natural: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Densidade Seca (g/cm³)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.densidade_seca}
                  onChange={(e) => setFormData(prev => ({ ...prev, densidade_seca: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Índice de Vazios
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.indice_vazios}
                  onChange={(e) => setFormData(prev => ({ ...prev, indice_vazios: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porosidade (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.porosidade}
                  onChange={(e) => setFormData(prev => ({ ...prev, porosidade: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              {/* Granulometria por Peneiração */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Granulometria por Peneiração (%)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Object.entries(formData.granulometria_peneiracao).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        P{key.replace('p', '')}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={value}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          granulometria_peneiracao: {
                            ...prev.granulometria_peneiracao,
                            [key]: parseFloat(e.target.value) || 0
                          }
                        }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="0.0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Ensaios de Laboratório */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Limites de Consistência */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Limites de Consistência (Atterberg)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Limite de Liquidez (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.limites_consistencia.limite_liquidez}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        limites_consistencia: {
                          ...prev.limites_consistencia,
                          limite_liquidez: parseFloat(e.target.value) || 0
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Limite de Plasticidade (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.limites_consistencia.limite_plasticidade}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        limites_consistencia: {
                          ...prev.limites_consistencia,
                          limite_plasticidade: parseFloat(e.target.value) || 0
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* CBR */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ensaio CBR</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor CBR (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cbr.valor_cbr}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        cbr: { ...prev.cbr, valor_cbr: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expansão (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.cbr.expansao}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        cbr: { ...prev.cbr, expansao: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Penetração (mm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.cbr.penetracao}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        cbr: { ...prev.cbr, penetracao: parseFloat(e.target.value) || 0 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Características Químicas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Características Químicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">pH</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.caracteristicas_quimicas.ph}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        caracteristicas_quimicas: {
                          ...prev.caracteristicas_quimicas,
                          ph: parseFloat(e.target.value) || 0
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Matéria Orgânica (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.caracteristicas_quimicas.materia_organica}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        caracteristicas_quimicas: {
                          ...prev.caracteristicas_quimicas,
                          materia_organica: parseFloat(e.target.value) || 0
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sulfatos (mg/kg)</label>
                    <input
                      type="number"
                      step="1"
                      value={formData.caracteristicas_quimicas.sulfatos}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        caracteristicas_quimicas: {
                          ...prev.caracteristicas_quimicas,
                          sulfatos: parseFloat(e.target.value) || 0
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Classificação e Conformidade */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Classificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sistema Unificado (USCS)</label>
                    <input
                      type="text"
                      value={formData.classificacao.sistema_unificado || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        classificacao: { ...prev.classificacao, sistema_unificado: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: CL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adequação</label>
                    <select
                      value={formData.classificacao.adequacao}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        classificacao: { ...prev.classificacao, adequacao: e.target.value as any }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {ADEQUACOES.map(adequacao => (
                        <option key={adequacao} value={adequacao}>{adequacao}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conformidade</h3>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.conforme}
                      onChange={(e) => setFormData(prev => ({ ...prev, conforme: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Conforme com especificações</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  value={formData.observacoes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Observações sobre a caracterização..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recomendações</label>
                <textarea
                  value={formData.recomendacoes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, recomendacoes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Recomendações para utilização..."
                />
              </div>
            </div>
          )}

          {/* Step 5: Documentação */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Normas de Referência</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setShowNormasManager(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Selecionar Normas</span>
                  </button>
                </div>
                
                {formData.normas_referencia.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.normas_referencia.map((norma, index) => (
                      <span
                        key={index}
                        className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        <span>{norma}</span>
                        <button
                          onClick={() => removeNorma(norma)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relatório de Laboratório (URL)</label>
                    <input
                      type="text"
                      value={formData.relatorio_laboratorio || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, relatorio_laboratorio: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="URL do relatório PDF"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Certificado de Laboratório (URL)</label>
                    <input
                      type="text"
                      value={formData.certificado_laboratorio || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, certificado_laboratorio: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="URL do certificado PDF"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Anterior
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              
              {currentStep < 5 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Próximo
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSolo ? 'Atualizar' : 'Criar'} Caracterização</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Normas Manager Modal */}
      <NormasManager
        isOpen={showNormasManager}
        onClose={() => setShowNormasManager(false)}
        onSelectNorma={handleNormaSelect}
        selectedNormas={formData.normas_referencia}
        multiple={true}
      />
    </div>
  );
}
