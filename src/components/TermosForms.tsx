import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Save,
  Upload,
  Download,
  Trash2,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Building,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  FileCheck,
  Shield,
  BookOpen,
  Scale,
  Gavel,
  ClipboardList,
  Settings,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { certificadosAPI } from '../lib/supabase-api/certificadosAPI';
import { storageService } from '../lib/supabase-storage';
import type { TermoCondicoes } from '../types/certificados';

interface TermosFormsProps {
  termo?: TermoCondicoes;
  onClose: () => void;
  onSave: (termo: TermoCondicoes) => void;
}

const TIPOS_TERMO = {
  'contrato': 'Contrato',
  'acordo': 'Acordo',
  'protocolo': 'Protocolo',
  'convencao': 'Convenção',
  'regulamento': 'Regulamento',
  'politica': 'Política',
  'procedimento': 'Procedimento',
  'instrucao': 'Instrução',
  'manual': 'Manual',
  'guia': 'Guia',
  'outro': 'Outro'
} as const;

const CATEGORIAS_TERMO = {
  'qualidade': 'Qualidade',
  'seguranca': 'Segurança',
  'ambiente': 'Ambiente',
  'comercial': 'Comercial',
  'financeiro': 'Financeiro',
  'recursos_humanos': 'Recursos Humanos',
  'tecnico': 'Técnico',
  'legal': 'Legal',
  'compliance': 'Compliance',
  'outro': 'Outro'
} as const;

const STATUS_TERMO = {
  'rascunho': 'Rascunho',
  'em_revisao': 'Em Revisão',
  'aprovado': 'Aprovado',
  'ativo': 'Ativo',
  'suspenso': 'Suspenso',
  'cancelado': 'Cancelado',
  'expirado': 'Expirado'
} as const;

const CLASSIFICACOES_CONFIDENCIALIDADE = {
  'publico': 'Público',
  'interno': 'Interno',
  'confidencial': 'Confidencial',
  'restrito': 'Restrito'
} as const;

export default function TermosForms({ termo, onClose, onSave }: TermosFormsProps) {
  const [formData, setFormData] = useState<Partial<TermoCondicoes>>({
    codigo: '',
    titulo: '',
    descricao: '',
    tipo_termo: 'contrato',
    categoria: 'qualidade',
    versao: '1.0',
    data_criacao: new Date().toISOString().split('T')[0],
    data_aprovacao: '',
    data_publicacao: '',
    data_expiracao: '',
    status: 'rascunho',
    conteudo: '',
    clausulas: [],
    obrigacoes: [],
    direitos: [],
    penalidades: [],
    responsabilidades: [],
    documentos_anexos: [],
    classificacao_confidencialidade: 'interno',
    aprovador_nome: '',
    aprovador_cargo: '',
    observacoes: '',
    tags: [],
    palavras_chave: []
  });

  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (termo) {
      setFormData(termo);
    }
  }, [termo]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.codigo?.trim()) {
      newErrors.codigo = 'Código é obrigatório';
    }
    if (!formData.titulo?.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }
    if (!formData.conteudo?.trim()) {
      newErrors.conteudo = 'Conteúdo é obrigatório';
    }
    if (!formData.data_criacao) {
      newErrors.data_criacao = 'Data de criação é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TermoCondicoes, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayFieldChange = (field: keyof TermoCondicoes, value: string) => {
    if (!value.trim()) return;
    
    const currentArray = (formData[field] as string[]) || [];
    if (!currentArray.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: keyof TermoCondicoes, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingDoc(true);
      const bucket = (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents';
      const folder = 'termos';
      
      const result = await storageService.uploadFile(file, folder, bucket);
      
      const newDoc = {
        nome: file.name,
        url: result.url,
        tamanho: file.size,
        tipo: file.type,
        data_upload: new Date().toISOString(),
        path: result.path
      };

      setFormData(prev => ({
        ...prev,
        documentos_anexos: [...(prev.documentos_anexos || []), newDoc]
      }));

      toast.success('Documento carregado com sucesso!');
    } catch (error) {
      console.error('Erro ao carregar documento:', error);
      toast.error('Erro ao carregar documento');
    } finally {
      setUploadingDoc(false);
      if (event.target) event.target.value = '';
    }
  };

  const handleFileDownload = async (doc: any) => {
    try {
      const bucket = (import.meta as any).env?.VITE_SUPABASE_BUCKET_CERTIFICADOS || 'documents';
      await storageService.downloadFile(doc.path, doc.nome, bucket);
      toast.success('Documento descarregado com sucesso!');
    } catch (error) {
      console.error('Erro ao descarregar documento:', error);
      toast.error('Erro ao descarregar documento');
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documentos_anexos: prev.documentos_anexos?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    try {
      setLoading(true);
      
      const userId = await certificadosAPI.getCurrentUserId();
      console.log('User ID obtido:', userId);
      
      if (!userId) {
        toast.error('Erro: Não foi possível obter o ID do usuário');
        return;
      }
      
      const termoData = {
        ...formData,
        user_id: userId,
        criado_em: new Date().toISOString(),
        atualizado_em: new Date().toISOString()
      } as TermoCondicoes;
      
      console.log('Dados do termo a serem enviados:', termoData);

      if (termo?.id) {
        // Update
        const updated = await certificadosAPI.termos.update(termo.id, termoData);
        toast.success('Termo atualizado com sucesso!');
        onSave(updated);
      } else {
        // Create
        const created = await certificadosAPI.termos.create(termoData);
        toast.success('Termo criado com sucesso!');
        onSave(created);
      }
    } catch (error) {
      console.error('Erro ao salvar termo:', error);
      toast.error('Erro ao salvar termo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {termo ? 'Editar Termo' : 'Novo Termo'}
                </h2>
                <p className="text-sm text-gray-600">Termos e Condições</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código *
              </label>
              <input
                type="text"
                value={formData.codigo || ''}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.codigo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="TER-001"
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
                value={formData.tipo_termo || 'contrato'}
                onChange={(e) => handleInputChange('tipo_termo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(TIPOS_TERMO).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={formData.categoria || 'qualidade'}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(CATEGORIAS_TERMO).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Versão
              </label>
              <input
                type="text"
                value={formData.versao || ''}
                onChange={(e) => handleInputChange('versao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1.0"
              />
            </div>
          </div>

          {/* Título e Descrição */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo || ''}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.titulo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Título do termo"
              />
              {errors.titulo && (
                <p className="mt-1 text-sm text-red-600">{errors.titulo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.descricao || ''}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descrição breve do termo"
              />
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Criação *
              </label>
              <input
                type="date"
                value={formData.data_criacao || ''}
                onChange={(e) => handleInputChange('data_criacao', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.data_criacao ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.data_criacao && (
                <p className="mt-1 text-sm text-red-600">{errors.data_criacao}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Aprovação
              </label>
              <input
                type="date"
                value={formData.data_aprovacao || ''}
                onChange={(e) => handleInputChange('data_aprovacao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Publicação
              </label>
              <input
                type="date"
                value={formData.data_publicacao || ''}
                onChange={(e) => handleInputChange('data_publicacao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Expiração
              </label>
              <input
                type="date"
                value={formData.data_expiracao || ''}
                onChange={(e) => handleInputChange('data_expiracao', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status e Classificação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status || 'rascunho'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(STATUS_TERMO).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Classificação Confidencialidade
              </label>
              <select
                value={formData.classificacao_confidencialidade || 'interno'}
                onChange={(e) => handleInputChange('classificacao_confidencialidade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(CLASSIFICACOES_CONFIDENCIALIDADE).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Conteúdo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo do Termo *
            </label>
            <textarea
              value={formData.conteudo || ''}
              onChange={(e) => handleInputChange('conteudo', e.target.value)}
              rows={8}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.conteudo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Conteúdo completo do termo..."
            />
            {errors.conteudo && (
              <p className="mt-1 text-sm text-red-600">{errors.conteudo}</p>
            )}
          </div>

          {/* Arrays de Texto */}
          {['clausulas', 'obrigacoes', 'direitos', 'penalidades', 'responsabilidades'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder={`Adicionar ${field.slice(0, -1)}...`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayFieldChange(field as keyof TermoCondicoes, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleArrayFieldChange(field as keyof TermoCondicoes, input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData[field as keyof TermoCondicoes] as string[])?.map((item, index) => (
                    <div key={index} className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-lg">
                      <span className="text-sm">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem(field as keyof TermoCondicoes, index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Aprovador */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Aprovador
              </label>
              <input
                type="text"
                value={formData.aprovador_nome || ''}
                onChange={(e) => handleInputChange('aprovador_nome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome do aprovador"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo do Aprovador
              </label>
              <input
                type="text"
                value={formData.aprovador_cargo || ''}
                onChange={(e) => handleInputChange('aprovador_cargo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Cargo do aprovador"
              />
            </div>
          </div>

          {/* Tags e Palavras-chave */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Adicionar tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayFieldChange('tags', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleArrayFieldChange('tags', input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag, index) => (
                    <div key={index} className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-lg">
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('tags', index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palavras-chave
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Adicionar palavra-chave..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleArrayFieldChange('palavras_chave', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      handleArrayFieldChange('palavras_chave', input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.palavras_chave?.map((keyword, index) => (
                    <div key={index} className="flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-lg">
                      <span className="text-sm">{keyword}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('palavras_chave', index)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Documentos Anexos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Documentos Anexos
              </label>
              <label className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                {uploadingDoc ? 'A carregar...' : 'Anexar Documento'}
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploadingDoc} />
              </label>
            </div>
            {formData.documentos_anexos && formData.documentos_anexos.length > 0 ? (
              <div className="space-y-2">
                {formData.documentos_anexos.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.nome}</p>
                        <p className="text-xs text-gray-500">
                          {doc.tamanho ? `${(doc.tamanho / 1024 / 1024).toFixed(2)} MB` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleFileDownload(doc)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        title="Descarregar documento"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        title="Remover documento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Sem documentos anexos.</p>
            )}
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes || ''}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
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
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Guardar Termo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
