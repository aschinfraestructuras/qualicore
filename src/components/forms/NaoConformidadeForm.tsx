import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Upload, Plus, Trash2, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { NaoConformidade } from '@/types'
import toast from 'react-hot-toast'

// Schema expandido para todos os campos
const naoConformidadeSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  tipo: z.enum(['material', 'execucao', 'documentacao', 'seguranca', 'ambiente', 'qualidade', 'prazo', 'custo', 'outro']),
  tipo_outro: z.string().optional(),
  severidade: z.enum(['baixa', 'media', 'alta', 'critica']),
  categoria: z.enum(['auditoria', 'inspecao', 'reclamacao', 'acidente', 'incidente', 'desvio', 'outro']),
  categoria_outro: z.string().optional(),
  data_deteccao: z.string().min(1, 'Data de deteção é obrigatória'),
  data_resolucao: z.string().optional(),
  data_limite_resolucao: z.string().optional(),
  data_verificacao_eficacia: z.string().optional(),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  causa_raiz: z.string().optional(),
  impacto: z.enum(['baixo', 'medio', 'alto', 'critico']),
  area_afetada: z.string().min(1, 'Área afetada é obrigatória'),
  responsavel_deteccao: z.string().min(1, 'Responsável pela deteção é obrigatório'),
  responsavel_resolucao: z.string().optional(),
  custo_estimado: z.number().optional(),
  custo_real: z.number().optional(),
  observacoes: z.string().optional(),
  // Integrações
  relacionado_obra_id: z.string().optional(),
  relacionado_obra_outro: z.string().optional(),
  relacionado_zona_id: z.string().optional(),
  relacionado_zona_outro: z.string().optional(),
  relacionado_ensaio_id: z.string().optional(),
  relacionado_ensaio_outro: z.string().optional(),
  relacionado_material_id: z.string().optional(),
  relacionado_material_outro: z.string().optional(),
  relacionado_checklist_id: z.string().optional(),
  relacionado_checklist_outro: z.string().optional(),
  relacionado_fornecedor_id: z.string().optional(),
  relacionado_fornecedor_outro: z.string().optional(),
  auditoria_id: z.string().optional(),
  auditoria_outro: z.string().optional(),
  // Anexos
  anexos_evidencia: z.array(z.string()).optional(),
  anexos_corretiva: z.array(z.string()).optional(),
  anexos_verificacao: z.array(z.string()).optional(),
  // Timeline
  timeline: z.array(z.object({
    id: z.string(),
    data: z.string(),
    tipo: z.enum(['deteccao', 'analise', 'acao_corretiva', 'verificacao', 'resolucao', 'reabertura', 'comentario', 'anexo']),
    responsavel: z.string(),
    descricao: z.string(),
    anexos: z.array(z.string()).optional()
  })).optional()
})

type FormData = z.infer<typeof naoConformidadeSchema>

interface NaoConformidadeFormProps {
  naoConformidade?: NaoConformidade
  onSubmit: (data: FormData) => void
  onCancel: () => void
}

export default function NaoConformidadeForm({ naoConformidade, onSubmit, onCancel }: NaoConformidadeFormProps) {
  const [showIntegrations, setShowIntegrations] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File[] }>({
    evidencia: [],
    corretiva: [],
    verificacao: []
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(naoConformidadeSchema),
    defaultValues: {
      codigo: naoConformidade?.codigo || '',
      tipo: naoConformidade?.tipo || 'material',
      tipo_outro: naoConformidade?.tipo_outro || '',
      severidade: naoConformidade?.severidade || 'media',
      categoria: naoConformidade?.categoria || 'inspecao',
      categoria_outro: naoConformidade?.categoria_outro || '',
      data_deteccao: naoConformidade?.data_deteccao || new Date().toISOString().split('T')[0],
      data_resolucao: naoConformidade?.data_resolucao || '',
      data_limite_resolucao: naoConformidade?.data_limite_resolucao || '',
      data_verificacao_eficacia: naoConformidade?.data_verificacao_eficacia || '',
      descricao: naoConformidade?.descricao || '',
      causa_raiz: naoConformidade?.causa_raiz || '',
      impacto: naoConformidade?.impacto || 'medio',
      area_afetada: naoConformidade?.area_afetada || '',
      responsavel_deteccao: naoConformidade?.responsavel_deteccao || '',
      responsavel_resolucao: naoConformidade?.responsavel_resolucao || '',
      custo_estimado: naoConformidade?.custo_estimado || 0,
      custo_real: naoConformidade?.custo_real || 0,
      observacoes: naoConformidade?.observacoes || '',
      relacionado_obra_id: naoConformidade?.relacionado_obra_id || '',
      relacionado_obra_outro: naoConformidade?.relacionado_obra_outro || '',
      relacionado_zona_id: naoConformidade?.relacionado_zona_id || '',
      relacionado_zona_outro: naoConformidade?.relacionado_zona_outro || '',
      relacionado_ensaio_id: naoConformidade?.relacionado_ensaio_id || '',
      relacionado_ensaio_outro: naoConformidade?.relacionado_ensaio_outro || '',
      relacionado_material_id: naoConformidade?.relacionado_material_id || '',
      relacionado_material_outro: naoConformidade?.relacionado_material_outro || '',
      relacionado_checklist_id: naoConformidade?.relacionado_checklist_id || '',
      relacionado_checklist_outro: naoConformidade?.relacionado_checklist_outro || '',
      relacionado_fornecedor_id: naoConformidade?.relacionado_fornecedor_id || '',
      relacionado_fornecedor_outro: naoConformidade?.relacionado_fornecedor_outro || '',
      auditoria_id: naoConformidade?.auditoria_id || '',
      auditoria_outro: naoConformidade?.auditoria_outro || '',
      anexos_evidencia: naoConformidade?.anexos_evidencia?.map(a => a.nome) || [],
      anexos_corretiva: naoConformidade?.anexos_corretiva?.map(a => a.nome) || [],
      anexos_verificacao: naoConformidade?.anexos_verificacao?.map(a => a.nome) || [],
      timeline: naoConformidade?.timeline || []
    }
  })

  // Watch para campos que controlam a exibição de campos "outro"
  const tipo = watch('tipo')
  const categoria = watch('categoria')
  const relacionado_obra_id = watch('relacionado_obra_id')
  const relacionado_zona_id = watch('relacionado_zona_id')
  const relacionado_ensaio_id = watch('relacionado_ensaio_id')
  const relacionado_material_id = watch('relacionado_material_id')
  const relacionado_checklist_id = watch('relacionado_checklist_id')
  const relacionado_fornecedor_id = watch('relacionado_fornecedor_id')
  const auditoria_id = watch('auditoria_id')


  const handleFileUpload = (type: 'evidencia' | 'corretiva' | 'verificacao', files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      setUploadedFiles(prev => ({
        ...prev,
        [type]: [...prev[type], ...fileArray]
      }))
      toast.success(`${fileArray.length} ficheiro(s) adicionado(s)`)
    }
  }

  const removeFile = (type: 'evidencia' | 'corretiva' | 'verificacao', index: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const onFormSubmit = async (data: FormData) => {
    try {
      // Processar ficheiros anexados
      const processedData = {
        ...data,
        anexos_evidencia: [
          ...(data.anexos_evidencia || []),
          ...uploadedFiles.evidencia.map(f => f.name)
        ],
        anexos_corretiva: [
          ...(data.anexos_corretiva || []),
          ...uploadedFiles.corretiva.map(f => f.name)
        ],
        anexos_verificacao: [
          ...(data.anexos_verificacao || []),
          ...uploadedFiles.verificacao.map(f => f.name)
        ]
      }

      await onSubmit(processedData)
      toast.success('Não conformidade guardada com sucesso!')
    } catch (error) {
      toast.error('Erro ao guardar não conformidade')
      console.error(error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {naoConformidade ? 'Editar Não Conformidade' : 'Nova Não Conformidade'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código *
              </label>
              <input
                type="text"
                {...register('codigo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="NC-001"
              />
              {errors.codigo && (
                <p className="text-red-500 text-sm mt-1">{errors.codigo.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                {...register('tipo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="material">Material</option>
                <option value="execucao">Execução</option>
                <option value="documentacao">Documentação</option>
                <option value="seguranca">Segurança</option>
                <option value="ambiente">Ambiente</option>
                <option value="qualidade">Qualidade</option>
                <option value="prazo">Prazo</option>
                <option value="custo">Custo</option>
                <option value="outro">Outro</option>
              </select>
              {tipo === 'outro' && (
                <input
                  type="text"
                  {...register('tipo_outro')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  placeholder="Outro tipo"
                />
              )}
              {errors.tipo && (
                <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severidade *
              </label>
              <select
                {...register('severidade')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                {...register('categoria')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="auditoria">Auditoria</option>
                <option value="inspecao">Inspeção</option>
                <option value="reclamacao">Reclamação</option>
                <option value="acidente">Acidente</option>
                <option value="incidente">Incidente</option>
                <option value="desvio">Desvio</option>
                <option value="outro">Outro</option>
              </select>
              {categoria === 'outro' && (
                <input
                  type="text"
                  {...register('categoria_outro')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  placeholder="Outra categoria"
                />
              )}
              {errors.categoria && (
                <p className="text-red-500 text-sm mt-1">{errors.categoria.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Deteção *
              </label>
              <input
                type="date"
                {...register('data_deteccao')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.data_deteccao && (
                <p className="text-red-500 text-sm mt-1">{errors.data_deteccao.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Impacto *
              </label>
              <select
                {...register('impacto')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="baixo">Baixo</option>
                <option value="medio">Médio</option>
                <option value="alto">Alto</option>
                <option value="critico">Crítico</option>
              </select>
            </div>
          </div>

          {/* Descrição e Causa Raiz */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição *
              </label>
              <textarea
                {...register('descricao')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva detalhadamente a não conformidade..."
              />
              {errors.descricao && (
                <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Causa Raiz
              </label>
              <textarea
                {...register('causa_raiz')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Identifique a causa raiz do problema..."
              />
            </div>
          </div>

          {/* Responsabilidades e Área */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Área Afetada *
              </label>
              <input
                type="text"
                {...register('area_afetada')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Zona A - Fundações"
              />
              {errors.area_afetada && (
                <p className="text-red-500 text-sm mt-1">{errors.area_afetada.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável pela Deteção *
              </label>
              <input
                type="text"
                {...register('responsavel_deteccao')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do responsável"
              />
              {errors.responsavel_deteccao && (
                <p className="text-red-500 text-sm mt-1">{errors.responsavel_deteccao.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável pela Resolução
              </label>
              <input
                type="text"
                {...register('responsavel_resolucao')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do responsável"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auditoria Relacionada
              </label>
              <select
                {...register('auditoria_id')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecionar auditoria...</option>
                <option value="aud-001">Auditoria Interna 2024</option>
                <option value="aud-002">Auditoria Externa</option>
                <option value="outro">Outro</option>
              </select>
              {auditoria_id === 'outro' && (
                <input
                  type="text"
                  {...register('auditoria_outro')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                  placeholder="Descreva a auditoria..."
                />
              )}
            </div>
          </div>

          {/* Datas Adicionais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Limite de Resolução
              </label>
              <input
                type="date"
                {...register('data_limite_resolucao')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Resolução
              </label>
              <input
                type="date"
                {...register('data_resolucao')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Verificação de Eficácia
              </label>
              <input
                type="date"
                {...register('data_verificacao_eficacia')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Custos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custo Estimado (€)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('custo_estimado', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custo Real (€)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('custo_real', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Integrações */}
          <div className="border-t pt-6">
            <button
              type="button"
              onClick={() => setShowIntegrations(!showIntegrations)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Plus size={16} />
              Integrações com Outros Módulos
            </button>

            {showIntegrations && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Obra Relacionada
                  </label>
                  <select
                    {...register('relacionado_obra_id')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecionar obra...</option>
                    <option value="obra-001">Residencial Lisboa</option>
                    <option value="obra-002">Comercial Porto</option>
                    <option value="outro">Outro</option>
                  </select>
                  {relacionado_obra_id === 'outro' && (
                    <input
                      type="text"
                      {...register('relacionado_obra_outro')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                      placeholder="Descreva a obra..."
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zona Relacionada
                  </label>
                  <select
                    {...register('relacionado_zona_id')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecionar zona...</option>
                    <option value="zona-001">Zona A - Fundações</option>
                    <option value="zona-002">Zona B - Pilares</option>
                    <option value="outro">Outro</option>
                  </select>
                  {relacionado_zona_id === 'outro' && (
                    <input
                      type="text"
                      {...register('relacionado_zona_outro')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                      placeholder="Descreva a zona..."
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ensaio Relacionado
                  </label>
                  <select
                    {...register('relacionado_ensaio_id')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecionar ensaio...</option>
                    <option value="ensaio-001">Ensaio de Resistência</option>
                    <option value="ensaio-002">Ensaio de Qualidade</option>
                    <option value="outro">Outro</option>
                  </select>
                  {relacionado_ensaio_id === 'outro' && (
                    <input
                      type="text"
                      {...register('relacionado_ensaio_outro')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                      placeholder="Descreva o ensaio..."
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material Relacionado
                  </label>
                  <select
                    {...register('relacionado_material_id')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecionar material...</option>
                    <option value="mat-001">Cimento</option>
                    <option value="mat-002">Aço</option>
                    <option value="outro">Outro</option>
                  </select>
                  {relacionado_material_id === 'outro' && (
                    <input
                      type="text"
                      {...register('relacionado_material_outro')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                      placeholder="Descreva o material..."
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Checklist Relacionado
                  </label>
                  <select
                    {...register('relacionado_checklist_id')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecionar checklist...</option>
                    <option value="chk-001">Checklist Fundações</option>
                    <option value="chk-002">Checklist Estrutura</option>
                    <option value="outro">Outro</option>
                  </select>
                  {relacionado_checklist_id === 'outro' && (
                    <input
                      type="text"
                      {...register('relacionado_checklist_outro')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                      placeholder="Descreva o checklist..."
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fornecedor Relacionado
                  </label>
                  <select
                    {...register('relacionado_fornecedor_id')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecionar fornecedor...</option>
                    <option value="for-001">Fornecedor A</option>
                    <option value="for-002">Fornecedor B</option>
                    <option value="outro">Outro</option>
                  </select>
                  {relacionado_fornecedor_id === 'outro' && (
                    <input
                      type="text"
                      {...register('relacionado_fornecedor_outro')}
                      className="w-full px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                      placeholder="Descreva o fornecedor..."
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Anexos */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Anexos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Evidência */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle size={16} className="inline mr-1" />
                  Evidência da NC
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload('evidencia', e.target.files)}
                    className="hidden"
                    id="evidencia-upload"
                  />
                  <label
                    htmlFor="evidencia-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Carregar ficheiros</span>
                  </label>
                </div>
                {uploadedFiles.evidencia.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.evidencia.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile('evidencia', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ação Corretiva */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CheckCircle size={16} className="inline mr-1" />
                  Ação Corretiva
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload('corretiva', e.target.files)}
                    className="hidden"
                    id="corretiva-upload"
                  />
                  <label
                    htmlFor="corretiva-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Carregar ficheiros</span>
                  </label>
                </div>
                {uploadedFiles.corretiva.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.corretiva.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile('corretiva', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verificação */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={16} className="inline mr-1" />
                  Verificação
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload('verificacao', e.target.files)}
                    className="hidden"
                    id="verificacao-upload"
                  />
                  <label
                    htmlFor="verificacao-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Carregar ficheiros</span>
                  </label>
                </div>
                {uploadedFiles.verificacao.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.verificacao.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile('verificacao', index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações Adicionais
            </label>
            <textarea
              {...register('observacoes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'A guardar...' : (naoConformidade ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 