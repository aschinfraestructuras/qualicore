import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Save,
  X,
  Upload,
  Camera,
  FileText,
  Trash2,
  Download,
  Eye,
  Plus,
  AlertCircle,
  CheckCircle,
  Loader2,
  Building,
  Package,
  Ruler,
  Scale,
  Calendar,
  MapPin,
  User,
  Hash,
  Info
} from 'lucide-react';
import { ArmaduraFormData, FotoArmadura, DocumentoArmadura } from '@/types/armaduras';
import { armadurasAPI } from '@/lib/supabase-api/armadurasAPI';
import { fornecedoresAPI } from '@/lib/supabase-api';
import { obrasAPI } from '@/lib/supabase-api';
import toast from 'react-hot-toast';

// Schema de validação
const armaduraSchema = z.object({
  codigo: z.string().min(1, "Código é obrigatório"),
  tipo: z.enum(['feixe', 'estribo', 'cintas', 'armadura_negativa', 'armadura_positiva', 'outro']),
  tipo_outro: z.string().optional(),
  diametro: z.number().min(0.1, "Diâmetro deve ser maior que 0"),
  comprimento: z.number().min(0.1, "Comprimento deve ser maior que 0"),
  largura: z.number().optional(),
  altura: z.number().optional(),
  quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
  peso_unitario: z.number().min(0.1, "Peso unitário deve ser maior que 0"),
  // Novos campos
  numero_colada: z.string().min(1, "Número de colada é obrigatório"),
  numero_guia_remessa: z.string().min(1, "Número de guia de remessa é obrigatório"),
  fabricante: z.string().min(1, "Fabricante é obrigatório"),
  fornecedor_aco_obra: z.string().min(1, "Fornecedor do aço em obra é obrigatório"),
  local_aplicacao: z.string().min(1, "Local de aplicação é obrigatório"),
  zona_aplicacao: z.string().min(1, "Zona de aplicação é obrigatória"),
  lote_aplicacao: z.string().min(1, "Lote de aplicação é obrigatório"),
  // Campos existentes
  fornecedor_id: z.string().optional(),
  obra_id: z.string().optional(),
  zona: z.string().min(1, "Zona é obrigatória"),
  estado: z.enum(['pendente', 'em_analise', 'aprovado', 'reprovado', 'instalado', 'concluido']),
  data_rececao: z.string().min(1, "Data de receção é obrigatória"),
  data_instalacao: z.string().optional(),
  certificado_qualidade: z.string().optional(),
  ensaios_realizados: z.array(z.string()).default([]),
  observacoes: z.string().optional(),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
});

interface ArmaduraFormProps {
  onSubmit: (data: ArmaduraFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ArmaduraFormData>;
  isEditing?: boolean;
}

export default function ArmaduraForm({ onSubmit, onCancel, initialData, isEditing = false }: ArmaduraFormProps) {
  const [loading, setLoading] = useState(false);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [obras, setObras] = useState<any[]>([]);
  const [fotos, setFotos] = useState<FotoArmadura[]>([]);
  const [documentos, setDocumentos] = useState<DocumentoArmadura[]>([]);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ArmaduraFormData>({
    resolver: zodResolver(armaduraSchema),
    defaultValues: {
      codigo: initialData?.codigo || '',
      tipo: initialData?.tipo || 'feixe',
      tipo_outro: initialData?.tipo_outro || '',
      diametro: initialData?.diametro || 0,
      comprimento: initialData?.comprimento || 0,
      largura: initialData?.largura || 0,
      altura: initialData?.altura || 0,
      quantidade: initialData?.quantidade || 0,
      peso_unitario: initialData?.peso_unitario || 0,
      // Novos campos
      numero_colada: initialData?.numero_colada || '',
      numero_guia_remessa: initialData?.numero_guia_remessa || '',
      fabricante: initialData?.fabricante || '',
      fornecedor_aco_obra: initialData?.fornecedor_aco_obra || '',
      local_aplicacao: initialData?.local_aplicacao || '',
      zona_aplicacao: initialData?.zona_aplicacao || '',
      lote_aplicacao: initialData?.lote_aplicacao || '',
      // Campos existentes
      fornecedor_id: initialData?.fornecedor_id || '',
      obra_id: initialData?.obra_id || '',
      zona: initialData?.zona || '',
      estado: initialData?.estado || 'pendente',
      data_rececao: initialData?.data_rececao || new Date().toISOString().split('T')[0],
      data_instalacao: initialData?.data_instalacao || '',
      certificado_qualidade: initialData?.certificado_qualidade || '',
      ensaios_realizados: initialData?.ensaios_realizados || [],
      observacoes: initialData?.observacoes || '',
      responsavel: initialData?.responsavel || '',
    },
  });

  const tipoSelecionado = watch('tipo');

  // Carregar fornecedores e obras
  useEffect(() => {
    const loadData = async () => {
      try {
        const [fornecedoresData, obrasData] = await Promise.all([
          fornecedoresAPI.getAll(),
          obrasAPI.getAll()
        ]);
        setFornecedores(fornecedoresData);
        setObras(obrasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    loadData();
  }, []);

  // Calcular peso total automaticamente
  const quantidade = watch('quantidade') || 0;
  const pesoUnitario = watch('peso_unitario') || 0;
  const pesoTotal = quantidade * pesoUnitario;

  // Upload de foto
  const handleFotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Foto deve ter menos de 10MB');
      return;
    }

    setUploadingFoto(true);
    try {
      // Simular upload - depois será integrado com Supabase Storage
      const foto: FotoArmadura = {
        id: Date.now().toString(),
        nome: file.name,
        url: URL.createObjectURL(file),
        tipo: 'rececao',
        descricao: '',
        data_upload: new Date().toISOString(),
        tamanho: file.size
      };

      setFotos(prev => [...prev, foto]);
      toast.success('Foto adicionada com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer upload da foto');
    } finally {
      setUploadingFoto(false);
    }
  };

  // Upload de documento
  const handleDocumentoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error('Documento deve ter menos de 50MB');
      return;
    }

    setUploadingDoc(true);
    try {
      // Simular upload - depois será integrado com Supabase Storage
      const documento: DocumentoArmadura = {
        id: Date.now().toString(),
        nome: file.name,
        url: URL.createObjectURL(file),
        tipo: 'certificado',
        descricao: '',
        data_upload: new Date().toISOString(),
        tamanho: file.size
      };

      setDocumentos(prev => [...prev, documento]);
      toast.success('Documento adicionado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer upload do documento');
    } finally {
      setUploadingDoc(false);
    }
  };

  // Remover foto
  const removeFoto = (id: string) => {
    setFotos(prev => prev.filter(foto => foto.id !== id));
    toast.success('Foto removida');
  };

  // Remover documento
  const removeDocumento = (id: string) => {
    setDocumentos(prev => prev.filter(doc => doc.id !== id));
    toast.success('Documento removido');
  };

  // Submeter formulário
  const handleFormSubmit = async (data: ArmaduraFormData) => {
    setLoading(true);
    try {
      const formData = {
        ...data,
        fotos,
        documentos
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Editar Armadura' : 'Nova Armadura'}
                </h1>
                <p className="text-gray-600">Gestão de armaduras e aços para construção</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${isValid ? 100 : 50}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Informações Básicas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-500" />
              Informações Básicas
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {/* Código */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código *
                </label>
                <input
                  {...register('codigo')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: ARM-001-2024"
                />
                {errors.codigo && (
                  <p className="text-red-500 text-sm mt-1">{errors.codigo.message}</p>
                )}
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo *
                </label>
                <select
                  {...register('tipo')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="feixe">Feixe</option>
                  <option value="estribo">Estribo</option>
                  <option value="cintas">Cintas</option>
                  <option value="armadura_negativa">Armadura Negativa</option>
                  <option value="armadura_positiva">Armadura Positiva</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.tipo && (
                  <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>
                )}
              </div>

              {/* Tipo Outro */}
              {tipoSelecionado === 'outro' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especificar Tipo
                  </label>
                  <input
                    {...register('tipo_outro')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Especificar tipo..."
                  />
                </div>
              )}

              {/* Diâmetro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diâmetro (mm) *
                </label>
                <input
                  {...register('diametro', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 12.5"
                />
                {errors.diametro && (
                  <p className="text-red-500 text-sm mt-1">{errors.diametro.message}</p>
                )}
              </div>

              {/* Comprimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comprimento (m) *
                </label>
                <input
                  {...register('comprimento', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 6.0"
                />
                {errors.comprimento && (
                  <p className="text-red-500 text-sm mt-1">{errors.comprimento.message}</p>
                )}
              </div>

              {/* Quantidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade *
                </label>
                <input
                  {...register('quantidade', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 100"
                />
                {errors.quantidade && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantidade.message}</p>
                )}
              </div>

              {/* Peso Unitário */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso Unitário (kg/m) *
                </label>
                <input
                  {...register('peso_unitario', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 0.888"
                />
                {errors.peso_unitario && (
                  <p className="text-red-500 text-sm mt-1">{errors.peso_unitario.message}</p>
                )}
              </div>

              {/* Peso Total (Calculado) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso Total (kg)
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 font-semibold">
                  {pesoTotal.toFixed(2)} kg
                </div>
              </div>
            </div>
          </motion.div>

          {/* Novos Campos - Rastreamento e Identificação */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-500" />
              Identificação e Rastreamento
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {/* Número de Colada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Colada *
                </label>
                <input
                  {...register('numero_colada')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Número da colada"
                />
                {errors.numero_colada && (
                  <p className="text-red-500 text-sm mt-1">{errors.numero_colada.message}</p>
                )}
              </div>

              {/* Número Guia de Remessa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número Guia de Remessa *
                </label>
                <input
                  {...register('numero_guia_remessa')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Número da guia de remessa"
                />
                {errors.numero_guia_remessa && (
                  <p className="text-red-500 text-sm mt-1">{errors.numero_guia_remessa.message}</p>
                )}
              </div>

              {/* Fabricante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fabricante *
                </label>
                <input
                  {...register('fabricante')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do fabricante"
                />
                {errors.fabricante && (
                  <p className="text-red-500 text-sm mt-1">{errors.fabricante.message}</p>
                )}
              </div>

              {/* Fornecedor do Aço em Obra */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fornecedor do Aço em Obra *
                </label>
                <input
                  {...register('fornecedor_aco_obra')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Fornecedor do aço em obra"
                />
                {errors.fornecedor_aco_obra && (
                  <p className="text-red-500 text-sm mt-1">{errors.fornecedor_aco_obra.message}</p>
                )}
              </div>

              {/* Local de Aplicação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Local de Aplicação *
                </label>
                <input
                  {...register('local_aplicacao')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Local onde será aplicado"
                />
                {errors.local_aplicacao && (
                  <p className="text-red-500 text-sm mt-1">{errors.local_aplicacao.message}</p>
                )}
              </div>

              {/* Zona de Aplicação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona de Aplicação *
                </label>
                <input
                  {...register('zona_aplicacao')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Zona específica de aplicação"
                />
                {errors.zona_aplicacao && (
                  <p className="text-red-500 text-sm mt-1">{errors.zona_aplicacao.message}</p>
                )}
              </div>

              {/* Lote de Aplicação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lote de Aplicação *
                </label>
                <input
                  {...register('lote_aplicacao')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Identificação do lote"
                />
                {errors.lote_aplicacao && (
                  <p className="text-red-500 text-sm mt-1">{errors.lote_aplicacao.message}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Informações de Localização e Estado */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-green-500" />
              Localização e Estado
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {/* Zona */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona *
                </label>
                <input
                  {...register('zona')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Pilar P1, Viga V2"
                />
                {errors.zona && (
                  <p className="text-red-500 text-sm mt-1">{errors.zona.message}</p>
                )}
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado *
                </label>
                <select
                  {...register('estado')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pendente">Pendente</option>
                  <option value="em_analise">Em Análise</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="reprovado">Reprovado</option>
                  <option value="instalado">Instalado</option>
                  <option value="concluido">Concluído</option>
                </select>
                {errors.estado && (
                  <p className="text-red-500 text-sm mt-1">{errors.estado.message}</p>
                )}
              </div>

              {/* Responsável */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsável *
                </label>
                <input
                  {...register('responsavel')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do responsável"
                />
                {errors.responsavel && (
                  <p className="text-red-500 text-sm mt-1">{errors.responsavel.message}</p>
                )}
              </div>

              {/* Fornecedor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fornecedor
                </label>
                <select
                  {...register('fornecedor_id')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecionar fornecedor</option>
                  {fornecedores.map(fornecedor => (
                    <option key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Obra */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Obra
                </label>
                <select
                  {...register('obra_id')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecionar obra</option>
                  {obras.map(obra => (
                    <option key={obra.id} value={obra.id}>
                      {obra.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data de Receção */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Receção *
                </label>
                <input
                  {...register('data_rececao')}
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.data_rececao && (
                  <p className="text-red-500 text-sm mt-1">{errors.data_rececao.message}</p>
                )}
              </div>

              {/* Data de Instalação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Instalação
                </label>
                <input
                  {...register('data_instalacao')}
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Certificado de Qualidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificado de Qualidade
                </label>
                <input
                  {...register('certificado_qualidade')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Número do certificado"
                />
              </div>
            </div>
          </motion.div>

          {/* Fotos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Camera className="h-5 w-5 mr-2 text-purple-500" />
              Fotos ({fotos.length})
            </h2>

            {/* Upload de Fotos */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adicionar Foto
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoUpload}
                  className="hidden"
                  id="foto-upload"
                  disabled={uploadingFoto}
                />
                <label
                  htmlFor="foto-upload"
                  className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
                >
                  {uploadingFoto ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5" />
                  )}
                  <span>{uploadingFoto ? 'A fazer upload...' : 'Selecionar Foto'}</span>
                </label>
                <span className="text-sm text-gray-500">Máx: 10MB</span>
              </div>
            </div>

            {/* Lista de Fotos */}
            {fotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {fotos.map((foto, index) => (
                  <div key={foto.id} className="relative group">
                    <img
                      src={foto.url}
                      alt={foto.nome}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                        <button
                          type="button"
                          onClick={() => window.open(foto.url, '_blank')}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFoto(foto.id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">{foto.nome}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Documentos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Documentos ({documentos.length})
            </h2>

            {/* Upload de Documentos */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adicionar Documento
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleDocumentoUpload}
                  className="hidden"
                  id="doc-upload"
                  disabled={uploadingDoc}
                />
                <label
                  htmlFor="doc-upload"
                  className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl cursor-pointer hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 disabled:opacity-50"
                >
                  {uploadingDoc ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5" />
                  )}
                  <span>{uploadingDoc ? 'A fazer upload...' : 'Selecionar Documento'}</span>
                </label>
                <span className="text-sm text-gray-500">Máx: 50MB</span>
              </div>
            </div>

            {/* Lista de Documentos */}
            {documentos.length > 0 && (
              <div className="space-y-3">
                {documentos.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">{doc.nome}</p>
                        <p className="text-sm text-gray-500">
                          {(doc.tamanho / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => window.open(doc.url, '_blank')}
                        className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDocumento(doc.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Observações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Info className="h-5 w-5 mr-2 text-green-500" />
              Observações
            </h2>

            <textarea
              {...register('observacoes')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observações adicionais..."
            />
          </motion.div>

          {/* Botões */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-end space-x-4"
          >
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !isValid}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              <span>{loading ? 'A guardar...' : (isEditing ? 'Atualizar' : 'Guardar')}</span>
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
