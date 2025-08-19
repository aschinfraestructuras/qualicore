import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Save, Plus, Package, Calendar, Tag, Building, Settings, AlertCircle, CheckCircle, Clock, Star, FileText, DollarSign, Users, MapPin, User, Hash
} from 'lucide-react';
import toast from 'react-hot-toast';
import { submissaoMateriaisAPI } from '../lib/supabase-api/submissaoMateriaisAPI';
import type { 
  SubmissaoMaterial, 
  TipoMaterial, 
  CategoriaMaterial, 
  EstadoSubmissao, 
  PrioridadeSubmissao, 
  UrgenciaSubmissao 
} from '../types/submissaoMateriais';
import {
  TIPOS_MATERIAL,
  CATEGORIAS_MATERIAL,
  PRIORIDADES_SUBMISSAO,
  URGENCIAS_SUBMISSAO,
  ESTADOS_SUBMISSAO
} from '../types/submissaoMateriais';

interface SubmissaoMateriaisFormsProps {
  isOpen: boolean;
  onClose: () => void;
  editingSubmissao?: SubmissaoMaterial | null;
  onSuccess: () => void;
}

interface FormData {
  codigo: string;
  titulo: string;
  descricao: string;
  tipo_material: TipoMaterial;
  categoria: CategoriaMaterial;
  especificacoes_tecnicas: string;
  normas_referencia: string[];
  certificados_necessarios: string[];
  submissor_id: string;
  submissor_nome: string;
  data_submissao: string;
  prioridade: PrioridadeSubmissao;
  urgencia: UrgenciaSubmissao;
  estado: EstadoSubmissao;
  especificacoes_detalhadas: string;
  justificativa_necessidade: string;
  impacto_custo: number;
  impacto_prazo: number;
  obra_id: string;
  obra_nome: string;
  fornecedor_sugerido: string;
  fornecedor_alternativo: string;
  tags: string[];
  observacoes: string;
  data_limite_aprovacao: string;
}

const initialFormData: FormData = {
  codigo: '',
  titulo: '',
  descricao: '',
  tipo_material: 'betao',
  categoria: 'estrutural',
  especificacoes_tecnicas: '',
  normas_referencia: [],
  certificados_necessarios: [],
  submissor_id: '',
  submissor_nome: '',
  data_submissao: new Date().toISOString().split('T')[0],
  prioridade: 'media',
  urgencia: 'normal',
  estado: 'rascunho',
  especificacoes_detalhadas: '',
  justificativa_necessidade: '',
  impacto_custo: 0,
  impacto_prazo: 0,
  obra_id: '',
  obra_nome: '',
  fornecedor_sugerido: '',
  fornecedor_alternativo: '',
  tags: [],
  observacoes: '',
  data_limite_aprovacao: ''
};

export default function SubmissaoMateriaisForms({ isOpen, onClose, editingSubmissao, onSuccess }: SubmissaoMateriaisFormsProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tempNorma, setTempNorma] = useState('');
  const [tempCertificado, setTempCertificado] = useState('');
  const [tempTag, setTempTag] = useState('');

  useEffect(() => {
    if (editingSubmissao) {
      setFormData({
        codigo: editingSubmissao.codigo || '',
        titulo: editingSubmissao.titulo || '',
        descricao: editingSubmissao.descricao || '',
        tipo_material: editingSubmissao.tipo_material || 'betao',
        categoria: editingSubmissao.categoria || 'estrutural',
        especificacoes_tecnicas: editingSubmissao.especificacoes_tecnicas || '',
        normas_referencia: editingSubmissao.normas_referencia || [],
        certificados_necessarios: editingSubmissao.certificados_necessarios || [],
        submissor_id: editingSubmissao.submissor_id || '',
        submissor_nome: editingSubmissao.submissor_nome || '',
        data_submissao: editingSubmissao.data_submissao || new Date().toISOString().split('T')[0],
        prioridade: editingSubmissao.prioridade || 'media',
        urgencia: editingSubmissao.urgencia || 'normal',
        estado: editingSubmissao.estado || 'rascunho',
        especificacoes_detalhadas: editingSubmissao.especificacoes_detalhadas || '',
        justificativa_necessidade: editingSubmissao.justificativa_necessidade || '',
        impacto_custo: editingSubmissao.impacto_custo || 0,
        impacto_prazo: editingSubmissao.impacto_prazo || 0,
        obra_id: editingSubmissao.obra_id || '',
        obra_nome: editingSubmissao.obra_nome || '',
        fornecedor_sugerido: editingSubmissao.fornecedor_sugerido || '',
        fornecedor_alternativo: editingSubmissao.fornecedor_alternativo || '',
        tags: editingSubmissao.tags || [],
        observacoes: editingSubmissao.observacoes || '',
        data_limite_aprovacao: editingSubmissao.data_limite_aprovacao || ''
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingSubmissao]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.codigo.trim()) newErrors.codigo = 'Código é obrigatório';
    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.submissor_nome.trim()) newErrors.submissor_nome = 'Nome do submissor é obrigatório';
    if (!formData.obra_nome.trim()) newErrors.obra_nome = 'Nome da obra é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);

      const submissaoData = {
        ...formData,
        documentos_anexos: [],
        etapa_atual: {
          id: 'etapa_1',
          nome: 'Submissão Inicial',
          descricao: 'Etapa inicial de submissão do material',
          ordem: 1,
          tipo_aprovacao: 'unica' as const,
          aprovadores_obrigatorios: 1,
          aprovadores_opcionais: 0,
          criterios_aprovacao: ['Verificação técnica básica'],
          tempo_limite: 5,
          acoes_disponiveis: [
            {
              id: 'aprovar',
              nome: 'Aprovar',
              descricao: 'Aprovar a submissão do material',
              tipo: 'aprovacao' as const,
              condicoes: ['Verificação técnica concluída']
            },
            {
              id: 'rejeitar',
              nome: 'Rejeitar',
              descricao: 'Rejeitar a submissão do material',
              tipo: 'rejeicao' as const,
              condicoes: ['Justificativa técnica fornecida']
            },
            {
              id: 'solicitar_alteracao',
              nome: 'Solicitar Alteração',
              descricao: 'Solicitar alterações na submissão',
              tipo: 'solicitacao_alteracao' as const,
              condicoes: ['Especificações técnicas claras']
            }
          ]
        },
        historico_aprovacoes: [],
        comentarios: []
      };

      if (editingSubmissao) {
        await submissaoMateriaisAPI.submissoes.update(editingSubmissao.id, submissaoData);
        toast.success('Submissão atualizada com sucesso!');
      } else {
        await submissaoMateriaisAPI.submissoes.create(submissaoData);
        toast.success('Submissão criada com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar submissão:', error);
      toast.error('Erro ao salvar submissão');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addArrayItem = (field: keyof FormData, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: keyof FormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

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
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingSubmissao ? 'Editar Submissão de Material' : 'Nova Submissão de Material'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {editingSubmissao ? 'Atualize os dados da submissão' : 'Crie uma nova submissão de material'}
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

          {/* Cabeçalho Profissional */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200 px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Logo e Informações da Empresa */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">QUALICORE</h3>
                  <p className="text-sm text-gray-600">Gestão de Qualidade</p>
                </div>
              </div>

              {/* Informações da Obra */}
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Obra</p>
                  <input
                    type="text"
                    value={formData.obra_nome}
                    onChange={(e) => handleInputChange('obra_nome', e.target.value)}
                    className="text-sm text-gray-700 bg-transparent border-none focus:ring-0 p-0"
                    placeholder="Nome da obra"
                  />
                </div>
              </div>

              {/* Informações do Submissor */}
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Submissor</p>
                  <input
                    type="text"
                    value={formData.submissor_nome}
                    onChange={(e) => handleInputChange('submissor_nome', e.target.value)}
                    className="text-sm text-gray-700 bg-transparent border-none focus:ring-0 p-0"
                    placeholder="Nome do submissor"
                  />
                </div>
              </div>
            </div>

            {/* Linha de Informações Adicionais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Código</p>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => handleInputChange('codigo', e.target.value)}
                    className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                    placeholder="Código da submissão"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Data Submissão</p>
                  <input
                    type="date"
                    value={formData.data_submissao}
                    onChange={(e) => handleInputChange('data_submissao', e.target.value)}
                    className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Data Limite</p>
                  <input
                    type="date"
                    value={formData.data_limite_aprovacao}
                    onChange={(e) => handleInputChange('data_limite_aprovacao', e.target.value)}
                    className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Prioridade</p>
                  <select
                    value={formData.prioridade}
                    onChange={(e) => handleInputChange('prioridade', e.target.value as PrioridadeSubmissao)}
                    className="text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Informações Básicas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Código *</label>
                  <input
                    type="text"
                    value={formData.codigo}
                    onChange={(e) => handleInputChange('codigo', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.codigo ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Ex: SM-2024-001"
                  />
                  {errors.codigo && (
                    <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Submissão *</label>
                  <input
                    type="date"
                    value={formData.data_submissao}
                    onChange={(e) => handleInputChange('data_submissao', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.data_submissao ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.data_submissao && (
                    <p className="text-red-500 text-xs mt-1">{errors.data_submissao}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.titulo ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Título da submissão"
                  />
                  {errors.titulo && (
                    <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.descricao ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Descrição detalhada do material"
                  />
                  {errors.descricao && (
                    <p className="text-red-500 text-xs mt-1">{errors.descricao}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Material</label>
                  <select
                    value={formData.tipo_material}
                    onChange={(e) => handleInputChange('tipo_material', e.target.value as TipoMaterial)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Object.entries(TIPOS_MATERIAL).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value as CategoriaMaterial)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Object.entries(CATEGORIAS_MATERIAL).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                  <select
                    value={formData.prioridade}
                    onChange={(e) => handleInputChange('prioridade', e.target.value as PrioridadeSubmissao)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Object.entries(PRIORIDADES_SUBMISSAO).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Urgência</label>
                  <select
                    value={formData.urgencia}
                    onChange={(e) => handleInputChange('urgencia', e.target.value as UrgenciaSubmissao)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Object.entries(URGENCIAS_SUBMISSAO).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => handleInputChange('estado', e.target.value as EstadoSubmissao)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Object.entries(ESTADOS_SUBMISSAO).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Submissor *</label>
                  <input
                    type="text"
                    value={formData.submissor_nome}
                    onChange={(e) => handleInputChange('submissor_nome', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.submissor_nome ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nome do submissor"
                  />
                  {errors.submissor_nome && (
                    <p className="text-red-500 text-xs mt-1">{errors.submissor_nome}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Especificações Técnicas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificações Técnicas</h3>
              <textarea
                value={formData.especificacoes_tecnicas}
                onChange={(e) => handleInputChange('especificacoes_tecnicas', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Especificações técnicas detalhadas do material"
              />
            </div>

            {/* Normas de Referência */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Normas de Referência</h3>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tempNorma}
                    onChange={(e) => setTempNorma(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Adicionar norma de referência"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('normas_referencia', tempNorma);
                        setTempNorma('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem('normas_referencia', tempNorma);
                      setTempNorma('');
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.normas_referencia.map((norma, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      {norma}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('normas_referencia', index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Certificados Necessários */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificados Necessários</h3>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tempCertificado}
                    onChange={(e) => setTempCertificado(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Adicionar certificado necessário"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('certificados_necessarios', tempCertificado);
                        setTempCertificado('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem('certificados_necessarios', tempCertificado);
                      setTempCertificado('');
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.certificados_necessarios.map((certificado, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {certificado}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('certificados_necessarios', index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Impacto */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Impacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Impacto Financeiro (€)</label>
                  <input
                    type="number"
                    value={formData.impacto_custo}
                    onChange={(e) => handleInputChange('impacto_custo', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Impacto no Prazo (dias)</label>
                  <input
                    type="number"
                    value={formData.impacto_prazo}
                    onChange={(e) => handleInputChange('impacto_prazo', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Adicionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Obra</label>
                  <input
                    type="text"
                    value={formData.obra_nome}
                    onChange={(e) => handleInputChange('obra_nome', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nome da obra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fornecedor Sugerido</label>
                  <input
                    type="text"
                    value={formData.fornecedor_sugerido}
                    onChange={(e) => handleInputChange('fornecedor_sugerido', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nome do fornecedor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fornecedor Alternativo</label>
                  <input
                    type="text"
                    value={formData.fornecedor_alternativo}
                    onChange={(e) => handleInputChange('fornecedor_alternativo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Nome do fornecedor alternativo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Limite de Aprovação</label>
                  <input
                    type="date"
                    value={formData.data_limite_aprovacao}
                    onChange={(e) => handleInputChange('data_limite_aprovacao', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Justificativa */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Justificativa da Necessidade</h3>
              <textarea
                value={formData.justificativa_necessidade}
                onChange={(e) => handleInputChange('justificativa_necessidade', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Justifique a necessidade deste material"
              />
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tempTag}
                    onChange={(e) => setTempTag(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Adicionar tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('tags', tempTag);
                        setTempTag('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem('tags', tempTag);
                      setTempTag('');
                    }}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('tags', index)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Observações */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
              <textarea
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Observações adicionais"
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
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? "Salvando..." : (editingSubmissao ? "Atualizar" : "Criar")}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
