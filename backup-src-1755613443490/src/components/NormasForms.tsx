import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Save, Plus, FileText, Calendar, Tag, Building, Settings, AlertCircle, CheckCircle, Clock, Star, Upload, Download, Paperclip
} from 'lucide-react';
import toast from 'react-hot-toast';
import { normasAPI } from '../lib/supabase-api/normasAPI';
import { storageService } from '../lib/supabase-storage';
import type { Norma, CategoriaNorma, OrganismoNormativo, StatusNorma, PrioridadeNorma } from '../types/normas';
import {
  CATEGORIAS_NORMAS,
  SUBCATEGORIAS_NORMAS,
  ORGANISMOS_NORMATIVOS
} from '../types/normas';

interface NormasFormsProps {
  isOpen: boolean;
  onClose: () => void;
  editingNorma?: Norma | null;
  onSuccess: () => void;
}

interface FormData {
  codigo: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaNorma;
  subcategoria: string;
  organismo: OrganismoNormativo;
  versao: string;
  data_publicacao: string;
  data_entrada_vigor: string;
  status: StatusNorma;
  escopo: string;
  aplicabilidade: string[];
  requisitos_principais: string[];
  metodos_ensaio: string[];
  limites_aceitacao: Record<string, any>;
  documentos_relacionados: string[];
  documentos_anexos: Array<{
    nome: string;
    url: string;
    tipo: string;
    tamanho: number;
    data_upload: string;
  }>;
  observacoes: string;
  tags: string[];
  prioridade: PrioridadeNorma;
}

const initialFormData: FormData = {
  codigo: '',
  titulo: '',
  descricao: '',
  categoria: 'CONSTRUCAO_CIVIL',
  subcategoria: '',
  organismo: 'NP',
  versao: '1.0',
  data_publicacao: '',
  data_entrada_vigor: '',
  status: 'ATIVA',
  escopo: '',
  aplicabilidade: [],
  requisitos_principais: [],
  metodos_ensaio: [],
  limites_aceitacao: {},
  documentos_relacionados: [],
  documentos_anexos: [],
  observacoes: '',
  tags: [],
  prioridade: 'MEDIA'
};

export default function NormasForms({ isOpen, onClose, editingNorma, onSuccess }: NormasFormsProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tempAplicabilidade, setTempAplicabilidade] = useState('');
  const [tempRequisito, setTempRequisito] = useState('');
  const [tempMetodo, setTempMetodo] = useState('');
  const [tempDocumento, setTempDocumento] = useState('');
  const [tempTag, setTempTag] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    if (editingNorma) {
      console.log('Editando norma existente:', editingNorma);
      setFormData({
        codigo: editingNorma.codigo || '',
        titulo: editingNorma.titulo || '',
        descricao: editingNorma.descricao || '',
        categoria: editingNorma.categoria || 'CONSTRUCAO_CIVIL',
        subcategoria: editingNorma.subcategoria || '',
        organismo: editingNorma.organismo || 'NP',
        versao: editingNorma.versao || '1.0',
        data_publicacao: editingNorma.data_publicacao || '',
        data_entrada_vigor: editingNorma.data_entrada_vigor || '',
        status: editingNorma.status || 'ATIVA',
        escopo: editingNorma.escopo || '',
        aplicabilidade: editingNorma.aplicabilidade || [],
        requisitos_principais: editingNorma.requisitos_principais || [],
        metodos_ensaio: editingNorma.metodos_ensaio || [],
        limites_aceitacao: editingNorma.limites_aceitacao || {},
        documentos_relacionados: editingNorma.documentos_relacionados || [],
        documentos_anexos: Array.isArray(editingNorma.documentos_anexos) ? editingNorma.documentos_anexos : [],
        observacoes: editingNorma.observacoes || '',
        tags: editingNorma.tags || [],
        prioridade: editingNorma.prioridade || 'MEDIA'
      });
    } else {
      console.log('Criando nova norma');
      setFormData(initialFormData);
    }
  }, [editingNorma]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.codigo.trim()) newErrors.codigo = 'Código é obrigatório';
    if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.data_publicacao) newErrors.data_publicacao = 'Data de publicação é obrigatória';
    if (!formData.data_entrada_vigor) newErrors.data_entrada_vigor = 'Data de entrada em vigor é obrigatória';
    if (!formData.categoria) newErrors.categoria = 'Categoria é obrigatória';
    if (!formData.organismo) newErrors.organismo = 'Organismo é obrigatório';
    if (!formData.versao.trim()) newErrors.versao = 'Versão é obrigatória';

    console.log('Validação do formulário:', { errors: newErrors, formData });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Garantir que todos os campos opcionais tenham valores válidos
      const normaData = {
        ...formData,
        documentos_anexos: formData.documentos_anexos || [],
        limites_aceitacao: formData.limites_aceitacao || {},
        aplicabilidade: formData.aplicabilidade || [],
        requisitos_principais: formData.requisitos_principais || [],
        metodos_ensaio: formData.metodos_ensaio || [],
        documentos_relacionados: formData.documentos_relacionados || [],
        tags: formData.tags || [],
        ultima_atualizacao: new Date().toISOString()
      };

      console.log('Dados da norma a serem enviados:', normaData);

      if (editingNorma) {
        const result = await normasAPI.normas.update(editingNorma.id, normaData);
        console.log('Norma atualizada:', result);
        toast.success('Norma atualizada com sucesso!');
      } else {
        const result = await normasAPI.normas.create(normaData);
        console.log('Norma criada:', result);
        toast.success('Norma criada com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro detalhado ao salvar norma:', error);
      toast.error(`Erro ao salvar norma: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingFile(true);
      const file = files[0];
      
      // Validar tipo de arquivo
      if (!storageService.validateFileType(file)) {
        toast.error('Tipo de arquivo não suportado. Use PDF, DOC, DOCX, JPG, PNG, XLS, XLSX ou TXT.');
        return;
      }

      // Validar tamanho (máximo 10MB)
      if (!storageService.validateFileSize(file, 10)) {
        toast.error('Arquivo muito grande. Máximo 10MB.');
        return;
      }

      // Upload para Supabase Storage
      const uploadResult = await storageService.uploadFile(file, 'normas');
      
      const newDocument = {
        nome: file.name,
        url: uploadResult.url,
        tipo: file.type,
        tamanho: file.size,
        data_upload: new Date().toISOString(),
        path: uploadResult.path
      };

      console.log('Novo documento a ser adicionado:', newDocument);

      setFormData(prev => {
        const currentDocs = prev.documentos_anexos || [];
        const updatedDocs = [...currentDocs, newDocument];
        console.log('Documentos anexos atualizados:', updatedDocs);
        
        return {
          ...prev,
          documentos_anexos: updatedDocs
        };
      });

      toast.success('Documento anexado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error(`Erro ao fazer upload do documento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleFileDownload = async (documento: any) => {
    try {
      if (documento.path) {
        // Download via Supabase Storage (bucket normas -> mapeado para 'documents' por default)
        await storageService.downloadFile(documento.path, documento.nome, (import.meta as any).env?.VITE_SUPABASE_BUCKET_NORMAS || 'documents');
        toast.success(`Download iniciado: ${documento.nome}`);
      } else {
        // Fallback para URL direta (para documentos antigos)
        const link = document.createElement('a');
        link.href = documento.url;
        link.download = documento.nome;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Download iniciado: ${documento.nome}`);
      }
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast.error(`Erro ao fazer download do documento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const removeDocument = async (index: number) => {
    try {
      const documento = formData.documentos_anexos[index];
      
      // Se tem path, eliminar do Supabase Storage
      if (documento.path) {
        await storageService.deleteFile(documento.path, (import.meta as any).env?.VITE_SUPABASE_BUCKET_NORMAS || 'documents');
      }
      
      setFormData(prev => ({
        ...prev,
        documentos_anexos: prev.documentos_anexos.filter((_, i) => i !== index)
      }));
      
      toast.success('Documento removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover documento:', error);
      toast.error(`Erro ao remover documento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    return storageService.formatFileSize(bytes);
  };

  const getFileIcon = (tipo: string) => {
    return storageService.getFileIcon(tipo);
  };

  const getSubcategorias = (categoria: CategoriaNorma): string[] => {
    return SUBCATEGORIAS_NORMAS[categoria] || [];
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
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingNorma ? 'Editar Norma' : 'Nova Norma'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {editingNorma ? 'Atualize os dados da norma' : 'Crie uma nova norma técnica'}
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
                    placeholder="Ex: NP EN 206-1"
                  />
                  {errors.codigo && (
                    <p className="text-red-500 text-xs mt-1">{errors.codigo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Versão</label>
                  <input
                    type="text"
                    value={formData.versao}
                    onChange={(e) => handleInputChange('versao', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="1.0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.titulo ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Título da norma"
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
                    placeholder="Descrição detalhada da norma"
                  />
                  {errors.descricao && (
                    <p className="text-red-500 text-xs mt-1">{errors.descricao}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value as CategoriaNorma)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Object.entries(CATEGORIAS_NORMAS).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategoria</label>
                  <select
                    value={formData.subcategoria}
                    onChange={(e) => handleInputChange('subcategoria', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Selecione uma subcategoria</option>
                    {getSubcategorias(formData.categoria).map((subcat) => (
                      <option key={subcat} value={subcat}>{subcat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organismo</label>
                  <select
                    value={formData.organismo}
                    onChange={(e) => handleInputChange('organismo', e.target.value as OrganismoNormativo)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {Object.entries(ORGANISMOS_NORMATIVOS).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                  <select
                    value={formData.prioridade}
                    onChange={(e) => handleInputChange('prioridade', e.target.value as PrioridadeNorma)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                    <option value="CRITICA">Crítica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as StatusNorma)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="ATIVA">Ativa</option>
                    <option value="REVISAO">Em Revisão</option>
                    <option value="OBSOLETA">Obsoleta</option>
                    <option value="SUSPENSA">Suspensa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Publicação *</label>
                  <input
                    type="date"
                    value={formData.data_publicacao}
                    onChange={(e) => handleInputChange('data_publicacao', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.data_publicacao ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.data_publicacao && (
                    <p className="text-red-500 text-xs mt-1">{errors.data_publicacao}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Entrada em Vigor *</label>
                  <input
                    type="date"
                    value={formData.data_entrada_vigor}
                    onChange={(e) => handleInputChange('data_entrada_vigor', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.data_entrada_vigor ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.data_entrada_vigor && (
                    <p className="text-red-500 text-xs mt-1">{errors.data_entrada_vigor}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Escopo */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Escopo</h3>
              <textarea
                value={formData.escopo}
                onChange={(e) => handleInputChange('escopo', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Descreva o escopo e aplicabilidade da norma"
              />
            </div>

            {/* Aplicabilidade */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aplicabilidade</h3>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tempAplicabilidade}
                    onChange={(e) => setTempAplicabilidade(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Adicionar aplicabilidade"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('aplicabilidade', tempAplicabilidade);
                        setTempAplicabilidade('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem('aplicabilidade', tempAplicabilidade);
                      setTempAplicabilidade('');
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.aplicabilidade.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => removeArrayItem('aplicabilidade', index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Requisitos Principais */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requisitos Principais</h3>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tempRequisito}
                    onChange={(e) => setTempRequisito(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Adicionar requisito"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addArrayItem('requisitos_principais', tempRequisito);
                        setTempRequisito('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem('requisitos_principais', tempRequisito);
                      setTempRequisito('');
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.requisitos_principais.map((item, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-900">{item}</span>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requisitos_principais', index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
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

            {/* Documentos Anexos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos Anexos</h3>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="file"
                    accept=".pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-700">
                        {uploadingFile ? 'Carregando...' : 'Clique para adicionar documentos'}
                      </span>
                    </div>
                  </label>
                  <button
                    type="button"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.documentos_anexos.map((documento, index) => (
                    <div key={index} className="flex items-center px-3 py-2 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-lg hover:bg-blue-100 transition-colors">
                      <span className="mr-2">{getFileIcon(documento.tipo)}</span>
                      <span className="font-medium truncate max-w-32">{documento.nome}</span>
                      <span className="ml-2 text-gray-600 text-xs">({formatFileSize(documento.tamanho)})</span>
                      <button
                        type="button"
                        onClick={() => handleFileDownload(documento)}
                        className="ml-2 p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded transition-colors"
                        title="Download documento"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDocument(index)}
                        className="ml-1 p-1 text-red-600 hover:text-red-800 hover:bg-red-200 rounded transition-colors"
                        title="Remover documento"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
                <span>{loading ? "Salvando..." : (editingNorma ? "Atualizar" : "Criar")}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
