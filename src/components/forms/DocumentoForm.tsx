import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, X, FileText, Calendar, User, MapPin, Building, AlertCircle, Upload, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const documentoSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  tipo: z.enum(['projeto', 'especificacao', 'relatorio', 'certificado', 'rfi', 'procedimento', 'plano_ensaio', 'plano_qualidade', 'manual', 'instrucao_trabalho', 'formulario', 'registro', 'outro']),
  tipo_outro: z.string().optional(),
  versao: z.string().min(1, 'Versão é obrigatória'),
  data_validade: z.string().optional(),
  data_aprovacao: z.string().optional(),
  data_revisao: z.string().optional(),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  zona: z.string().min(1, 'Zona é obrigatória'),
  zona_outro: z.string().optional(),
  estado: z.enum(['pendente', 'em_analise', 'aprovado', 'reprovado', 'concluido']),
  aprovador: z.string().optional(),
  revisor: z.string().optional(),
  categoria: z.enum(['tecnico', 'administrativo', 'seguranca', 'ambiente', 'qualidade', 'comercial', 'outro']).optional(),
  categoria_outro: z.string().optional(),
  observacoes: z.string().optional(),
  palavras_chave: z.array(z.string()).optional(),
  classificacao_confidencialidade: z.enum(['publico', 'interno', 'confidencial', 'restrito']).optional(),
  distribuicao: z.array(z.string()).optional(),
  
  // Integração com outros módulos
  relacionado_obra_id: z.string().optional(),
  relacionado_obra_outro: z.string().optional(),
  relacionado_zona_id: z.string().optional(),
  relacionado_zona_outro: z.string().optional(),
  relacionado_ensaio_id: z.string().optional(),
  relacionado_ensaio_outro: z.string().optional(),
  relacionado_material_id: z.string().optional(),
  relacionado_material_outro: z.string().optional(),
  relacionado_fornecedor_id: z.string().optional(),
  relacionado_fornecedor_outro: z.string().optional(),
  relacionado_checklist_id: z.string().optional(),
  relacionado_checklist_outro: z.string().optional(),
  
  // Campos específicos RFI
  numero_rfi: z.string().optional(),
  solicitante: z.string().optional(),
  data_solicitacao: z.string().optional(),
  data_resposta: z.string().optional(),
  prioridade: z.enum(['baixa', 'media', 'alta', 'urgente']).optional(),
  impacto_custo: z.number().optional(),
  impacto_prazo: z.number().optional(),
  resposta: z.string().optional(),
  
  // Campos específicos Procedimento
  escopo: z.string().optional(),
  responsabilidades: z.array(z.string()).optional(),
  recursos_necessarios: z.array(z.string()).optional(),
  criterios_aceitacao: z.array(z.string()).optional(),
  registros_obrigatorios: z.array(z.string()).optional(),
  frequencia_revisao: z.string().optional(),
  
  // Campos específicos Plano de Ensaio
  material_ensaio: z.string().optional(),
  tipo_ensaio: z.string().optional(),
  normas_referencia: z.array(z.string()).optional(),
  equipamentos_necessarios: z.array(z.string()).optional(),
  laboratorio_responsavel: z.string().optional(),
  frequencia_ensaios: z.string().optional(),
  acoes_nao_conformidade: z.array(z.string()).optional(),
  
  // Campos específicos Plano de Qualidade
  escopo_obra: z.string().optional(),
  objetivos_qualidade: z.array(z.string()).optional(),
  responsabilidades_qualidade: z.array(z.string()).optional(),
  recursos_qualidade: z.array(z.string()).optional(),
  controlos_qualidade: z.array(z.string()).optional(),
  indicadores_qualidade: z.array(z.string()).optional(),
  auditorias_planeadas: z.array(z.string()).optional(),
  acoes_melhoria: z.array(z.string()).optional()
})

type DocumentoFormData = z.infer<typeof documentoSchema>

interface DocumentoFormProps {
  onSubmit: (data: DocumentoFormData) => void
  onCancel: () => void
  initialData?: Partial<DocumentoFormData>
  isEditing?: boolean
}

const documentTypes = [
  { value: 'projeto', label: 'Projeto', icon: FileText, color: 'text-blue-600' },
  { value: 'especificacao', label: 'Especificação', icon: FileText, color: 'text-green-600' },
  { value: 'relatorio', label: 'Relatório', icon: FileText, color: 'text-purple-600' },
  { value: 'certificado', label: 'Certificado', icon: FileText, color: 'text-orange-600' },
  { value: 'rfi', label: 'RFI (Request for Information)', icon: FileText, color: 'text-red-600' },
  { value: 'procedimento', label: 'Procedimento', icon: FileText, color: 'text-indigo-600' },
  { value: 'plano_ensaio', label: 'Plano de Ensaio', icon: FileText, color: 'text-yellow-600' },
  { value: 'plano_qualidade', label: 'Plano de Qualidade', icon: FileText, color: 'text-teal-600' },
  { value: 'manual', label: 'Manual', icon: FileText, color: 'text-pink-600' },
  { value: 'instrucao_trabalho', label: 'Instrução de Trabalho', icon: FileText, color: 'text-cyan-600' },
  { value: 'formulario', label: 'Formulário', icon: FileText, color: 'text-lime-600' },
  { value: 'registro', label: 'Registro', icon: FileText, color: 'text-amber-600' },
  { value: 'outro', label: 'Outro', icon: FileText, color: 'text-gray-600' }
]

const categorias = [
  { value: 'tecnico', label: 'Técnico' },
  { value: 'administrativo', label: 'Administrativo' },
  { value: 'seguranca', label: 'Segurança' },
  { value: 'ambiente', label: 'Ambiente' },
  { value: 'qualidade', label: 'Qualidade' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'outro', label: 'Outro' }
]

const classificacoes = [
  { value: 'publico', label: 'Público' },
  { value: 'interno', label: 'Interno' },
  { value: 'confidencial', label: 'Confidencial' },
  { value: 'restrito', label: 'Restrito' }
]

const prioridades = [
  { value: 'baixa', label: 'Baixa', color: 'text-green-600' },
  { value: 'media', label: 'Média', color: 'text-yellow-600' },
  { value: 'alta', label: 'Alta', color: 'text-orange-600' },
  { value: 'urgente', label: 'Urgente', color: 'text-red-600' }
]

const statusOptions = [
  { value: 'pendente', label: 'Pendente', color: 'bg-warning-100 text-warning-700' },
  { value: 'em_analise', label: 'Em Análise', color: 'bg-info-100 text-info-700' },
  { value: 'aprovado', label: 'Aprovado', color: 'bg-success-100 text-success-700' },
  { value: 'reprovado', label: 'Reprovado', color: 'bg-danger-100 text-danger-700' },
  { value: 'concluido', label: 'Concluído', color: 'bg-gray-100 text-gray-700' }
]

const zonas = [
  'Zona A - Fundações',
  'Zona B - Pilares',
  'Zona C - Lajes',
  'Zona D - Estrutura',
  'Armazém Central',
  'Laboratório',
  'Escritório'
]

export default function DocumentoForm({ onSubmit, onCancel, initialData, isEditing = false }: DocumentoFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [obras, setObras] = useState<any[]>([])

  // Carregar obras do localStorage
  useEffect(() => {
    const loadObras = () => {
      try {
        const stored = localStorage.getItem('qualicore_obras')
        if (stored) {
          const obrasData = JSON.parse(stored)
          setObras(obrasData)
        }
      } catch (error) {
        console.error('Erro ao carregar obras:', error)
      }
    }
    loadObras()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<DocumentoFormData>({
    resolver: zodResolver(documentoSchema),
    defaultValues: initialData || {
      estado: 'pendente',
      tipo: 'projeto'
    }
  })

  const watchedTipo = watch('tipo')
  const watchedEstado = watch('estado')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
    toast.success(`${files.length} ficheiro(s) adicionado(s)`)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmitForm = async (data: DocumentoFormData) => {
    setIsSubmitting(true)
    try {
      // Filtrar apenas os campos válidos do schema Supabase
      const docData: any = {
        codigo: data.codigo,
        tipo: data.tipo,
        versao: data.versao,
        data_validade: data.data_validade,
        data_aprovacao: data.data_aprovacao,
        data_revisao: data.data_revisao,
        responsavel: data.responsavel,
        zona: data.zona,
        estado: data.estado,
        aprovador: data.aprovador,
        revisor: data.revisor,
        categoria: data.categoria,
        categoria_outro: data.categoria_outro,
        observacoes: data.observacoes,
        palavras_chave: data.palavras_chave,
        classificacao_confidencialidade: data.classificacao_confidencialidade,
        distribuicao: data.distribuicao,
        numero_rfi: data.numero_rfi,
        solicitante: data.solicitante,
        data_solicitacao: data.data_solicitacao,
        data_resposta: data.data_resposta,
        prioridade: data.prioridade,
        impacto_custo: data.impacto_custo,
        impacto_prazo: data.impacto_prazo,
        resposta: data.resposta,
        escopo: data.escopo,
        responsabilidades: data.responsabilidades,
        recursos_necessarios: data.recursos_necessarios,
        criterios_aceitacao: data.criterios_aceitacao,
        registros_obrigatorios: data.registros_obrigatorios,
        frequencia_revisao: data.frequencia_revisao,
        material_ensaio: data.material_ensaio,
        tipo_ensaio: data.tipo_ensaio,
        normas_referencia: data.normas_referencia,
        equipamentos_necessarios: data.equipamentos_necessarios,
        laboratorio_responsavel: data.laboratorio_responsavel,
        frequencia_ensaios: data.frequencia_ensaios,
        acoes_nao_conformidade: data.acoes_nao_conformidade,
        escopo_obra: data.escopo_obra,
        objetivos_qualidade: data.objetivos_qualidade,
        responsabilidades_qualidade: data.responsabilidades_qualidade,
        recursos_qualidade: data.recursos_qualidade,
        controlos_qualidade: data.controlos_qualidade,
        indicadores_qualidade: data.indicadores_qualidade,
        auditorias_planeadas: data.auditorias_planeadas,
        acoes_melhoria: data.acoes_melhoria,
        relacionado_obra_id: data.relacionado_obra_id,
        relacionado_obra_outro: data.relacionado_obra_outro,
        relacionado_zona_id: data.relacionado_zona_id,
        relacionado_zona_outro: data.relacionado_zona_outro,
        relacionado_ensaio_id: data.relacionado_ensaio_id,
        relacionado_ensaio_outro: data.relacionado_ensaio_outro,
        relacionado_material_id: data.relacionado_material_id,
        relacionado_material_outro: data.relacionado_material_outro,
        relacionado_fornecedor_id: data.relacionado_fornecedor_id,
        relacionado_fornecedor_outro: data.relacionado_fornecedor_outro,
        relacionado_checklist_id: data.relacionado_checklist_id,
        relacionado_checklist_outro: data.relacionado_checklist_outro
      }
      onSubmit(docData)
      toast.success(isEditing ? 'Documento atualizado com sucesso!' : 'Documento criado com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar documento')
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateCode = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const code = `DOC-${year}-${month}${day}-${random}`
    setValue('codigo', code)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmitForm)}
      className="space-y-6"
    >
      {/* Header do Formulário */}
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Editar Documento' : 'Novo Documento'}
          </h3>
          <p className="text-sm text-gray-600">
            {isEditing ? 'Atualize as informações do documento' : 'Preencha as informações do novo documento'}
          </p>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Código */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código do Documento *
          </label>
          <div className="flex space-x-2">
            <input
              {...register('codigo')}
              type="text"
              placeholder="DOC-2024-001"
              className={`input flex-1 ${errors.codigo ? 'border-danger-500' : ''}`}
            />
            <button
              type="button"
              onClick={generateCode}
              className="btn btn-outline btn-md whitespace-nowrap"
            >
              Gerar Código
            </button>
          </div>
          {errors.codigo && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.codigo.message}
            </p>
          )}
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Documento *
          </label>
          <select
            {...register('tipo')}
            className={`select ${errors.tipo ? 'border-danger-500' : ''}`}
          >
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {watchedTipo === 'outro' && (
            <input
              {...register('tipo_outro')}
              type="text"
              placeholder="Descreva o tipo de documento..."
              className="input mt-2"
            />
          )}
          {errors.tipo && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.tipo.message}
            </p>
          )}
        </div>

        {/* Versão */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Versão *
          </label>
          <input
            {...register('versao')}
            type="text"
            placeholder="1.0"
            className={`input ${errors.versao ? 'border-danger-500' : ''}`}
          />
          {errors.versao && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.versao.message}
            </p>
          )}
        </div>

        {/* Data de Validade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Validade
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              {...register('data_validade')}
              type="date"
              className="input pl-10"
            />
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado *
          </label>
          <select
            {...register('estado')}
            className={`select ${errors.estado ? 'border-danger-500' : ''}`}
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          {errors.estado && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.estado.message}
            </p>
          )}
        </div>
      </div>

      {/* Responsável e Zona */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsável *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              {...register('responsavel')}
              type="text"
              placeholder="Nome do responsável"
              className={`input pl-10 ${errors.responsavel ? 'border-danger-500' : ''}`}
            />
          </div>
          {errors.responsavel && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.responsavel.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zona *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              {...register('zona')}
              className={`select pl-10 ${errors.zona ? 'border-danger-500' : ''}`}
            >
              <option value="">Selecione uma zona</option>
              {zonas.map(zona => (
                <option key={zona} value={zona}>
                  {zona}
                </option>
              ))}
              <option value="outro">Outro</option>
            </select>
          </div>
          {watch('zona') === 'outro' && (
            <input
              {...register('zona_outro')}
              type="text"
              placeholder="Descreva a zona..."
              className="input mt-2"
            />
          )}
          {errors.zona && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.zona.message}
            </p>
          )}
        </div>
      </div>

      {/* Campos específicos por tipo de documento */}
      {watchedTipo === 'rfi' && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-900 mb-4">Informações RFI</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número RFI</label>
              <input
                {...register('numero_rfi')}
                type="text"
                placeholder="RFI-2024-001"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Solicitante</label>
              <input
                {...register('solicitante')}
                type="text"
                placeholder="Nome do solicitante"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Solicitação</label>
              <input
                {...register('data_solicitacao')}
                type="date"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
              <select {...register('prioridade')} className="select">
                <option value="">Selecione...</option>
                {prioridades.map(pri => (
                  <option key={pri.value} value={pri.value}>{pri.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impacto no Custo (€)</label>
              <input
                {...register('impacto_custo')}
                type="number"
                placeholder="0.00"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Impacto no Prazo (dias)</label>
              <input
                {...register('impacto_prazo')}
                type="number"
                placeholder="0"
                className="input"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Resposta</label>
            <textarea
              {...register('resposta')}
              rows={3}
              placeholder="Resposta à solicitação..."
              className="textarea"
            />
          </div>
        </div>
      )}

      {watchedTipo === 'procedimento' && (
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <h4 className="text-sm font-semibold text-indigo-900 mb-4">Informações do Procedimento</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Escopo</label>
              <textarea
                {...register('escopo')}
                rows={2}
                placeholder="Descrição do escopo do procedimento..."
                className="textarea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsabilidades</label>
              <textarea
                {...register('responsabilidades')}
                rows={2}
                placeholder="Lista de responsabilidades (separadas por vírgula)..."
                className="textarea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recursos Necessários</label>
              <textarea
                {...register('recursos_necessarios')}
                rows={2}
                placeholder="Lista de recursos necessários..."
                className="textarea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Critérios de Aceitação</label>
              <textarea
                {...register('criterios_aceitacao')}
                rows={2}
                placeholder="Critérios de aceitação..."
                className="textarea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequência de Revisão</label>
              <input
                {...register('frequencia_revisao')}
                type="text"
                placeholder="ex: Anual, Semestral, etc."
                className="input"
              />
            </div>
          </div>
        </div>
      )}

      {watchedTipo === 'plano_ensaio' && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-semibold text-yellow-900 mb-4">Informações do Plano de Ensaio</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material do Ensaio</label>
              <input
                {...register('material_ensaio')}
                type="text"
                placeholder="ex: Betão, Aço, etc."
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ensaio</label>
              <input
                {...register('tipo_ensaio')}
                type="text"
                placeholder="ex: Resistência, Qualidade, etc."
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Laboratório Responsável</label>
              <input
                {...register('laboratorio_responsavel')}
                type="text"
                placeholder="Nome do laboratório"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequência de Ensaios</label>
              <input
                {...register('frequencia_ensaios')}
                type="text"
                placeholder="ex: Diário, Semanal, etc."
                className="input"
              />
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Normas de Referência</label>
              <textarea
                {...register('normas_referencia')}
                rows={2}
                placeholder="Lista de normas de referência..."
                className="textarea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipamentos Necessários</label>
              <textarea
                {...register('equipamentos_necessarios')}
                rows={2}
                placeholder="Lista de equipamentos..."
                className="textarea"
              />
            </div>
          </div>
        </div>
      )}

      {watchedTipo === 'plano_qualidade' && (
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
          <h4 className="text-sm font-semibold text-teal-900 mb-4">Informações do Plano de Qualidade</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Escopo da Obra</label>
              <textarea
                {...register('escopo_obra')}
                rows={2}
                placeholder="Descrição do escopo da obra..."
                className="textarea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos de Qualidade</label>
              <textarea
                {...register('objetivos_qualidade')}
                rows={2}
                placeholder="Lista de objetivos de qualidade..."
                className="textarea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsabilidades de Qualidade</label>
              <textarea
                {...register('responsabilidades_qualidade')}
                rows={2}
                placeholder="Lista de responsabilidades..."
                className="textarea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Controlos de Qualidade</label>
              <textarea
                {...register('controlos_qualidade')}
                rows={2}
                placeholder="Lista de controlos..."
                className="textarea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Indicadores de Qualidade</label>
              <textarea
                {...register('indicadores_qualidade')}
                rows={2}
                placeholder="Lista de indicadores..."
                className="textarea"
              />
            </div>
          </div>
        </div>
      )}

      {/* Integração com outros módulos */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Integração com outros módulos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Obra Relacionada</label>
            <select {...register('relacionado_obra_id')} className="select">
              <option value="">Selecionar obra...</option>
              {obras.map((obra) => (
                <option key={obra.id} value={obra.id}>
                  {obra.codigo} - {obra.nome}
                </option>
              ))}
              <option value="outro">Outro</option>
            </select>
            {watch('relacionado_obra_id') === 'outro' && (
              <input
                {...register('relacionado_obra_outro')}
                type="text"
                placeholder="Descreva a obra..."
                className="input mt-2"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zona Relacionada</label>
            <select {...register('relacionado_zona_id')} className="select">
              <option value="">Selecionar zona...</option>
              <option value="zona-001">Zona A - Fundações</option>
              <option value="zona-002">Zona B - Pilares</option>
              <option value="outro">Outro</option>
            </select>
            {watch('relacionado_zona_id') === 'outro' && (
              <input
                {...register('relacionado_zona_outro')}
                type="text"
                placeholder="Descreva a zona..."
                className="input mt-2"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ensaio Relacionado</label>
            <select {...register('relacionado_ensaio_id')} className="select">
              <option value="">Selecionar ensaio...</option>
              <option value="ensaio-001">Ensaio de Resistência</option>
              <option value="ensaio-002">Ensaio de Qualidade</option>
              <option value="outro">Outro</option>
            </select>
            {watch('relacionado_ensaio_id') === 'outro' && (
              <input
                {...register('relacionado_ensaio_outro')}
                type="text"
                placeholder="Descreva o ensaio..."
                className="input mt-2"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material Relacionado</label>
            <select {...register('relacionado_material_id')} className="select">
              <option value="">Selecionar material...</option>
              <option value="mat-001">Cimento</option>
              <option value="mat-002">Aço</option>
              <option value="outro">Outro</option>
            </select>
            {watch('relacionado_material_id') === 'outro' && (
              <input
                {...register('relacionado_material_outro')}
                type="text"
                placeholder="Descreva o material..."
                className="input mt-2"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor Relacionado</label>
            <select {...register('relacionado_fornecedor_id')} className="select">
              <option value="">Selecionar fornecedor...</option>
              <option value="for-001">Fornecedor A</option>
              <option value="for-002">Fornecedor B</option>
              <option value="outro">Outro</option>
            </select>
            {watch('relacionado_fornecedor_id') === 'outro' && (
              <input
                {...register('relacionado_fornecedor_outro')}
                type="text"
                placeholder="Descreva o fornecedor..."
                className="input mt-2"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Checklist Relacionado</label>
            <select {...register('relacionado_checklist_id')} className="select">
              <option value="">Selecionar checklist...</option>
              <option value="chk-001">Checklist Fundações</option>
              <option value="chk-002">Checklist Estrutura</option>
              <option value="outro">Outro</option>
            </select>
            {watch('relacionado_checklist_id') === 'outro' && (
              <input
                {...register('relacionado_checklist_outro')}
                type="text"
                placeholder="Descreva o checklist..."
                className="input mt-2"
              />
            )}
          </div>
        </div>
      </div>

      {/* Campos adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
          <select {...register('categoria')} className="select">
            <option value="">Selecione...</option>
            {categorias.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
            <option value="outro">Outro</option>
          </select>
          {watch('categoria') === 'outro' && (
            <input
              {...register('categoria_outro')}
              type="text"
              placeholder="Descreva a categoria..."
              className="input mt-2"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Classificação de Confidencialidade</label>
          <select {...register('classificacao_confidencialidade')} className="select">
            <option value="">Selecione...</option>
            {classificacoes.map(cls => (
              <option key={cls.value} value={cls.value}>{cls.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observações
        </label>
        <textarea
          {...register('observacoes')}
          placeholder="Descrição detalhada do documento..."
          rows={4}
          className="textarea"
        />
      </div>

      {/* Upload de Ficheiros */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anexos
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Arraste ficheiros para aqui ou clique para selecionar
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="btn btn-outline btn-sm cursor-pointer"
          >
            Selecionar Ficheiros
          </label>
        </div>

        {/* Lista de ficheiros */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Ficheiros selecionados:</h4>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-danger-600 hover:text-danger-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview do Estado */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Pré-visualização:</h4>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Tipo:</span>
            <span className={`badge ${documentTypes.find(t => t.value === watchedTipo)?.color}`}>
              {documentTypes.find(t => t.value === watchedTipo)?.label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Estado:</span>
            <span className={`badge ${statusOptions.find(s => s.value === watchedEstado)?.color}`}>
              {statusOptions.find(s => s.value === watchedEstado)?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary btn-md"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="btn btn-primary btn-md"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="loading-spinner h-4 w-4"></div>
              <span>Guardando...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>{isEditing ? 'Atualizar' : 'Criar'} Documento</span>
            </div>
          )}
        </button>
      </div>
    </motion.form>
  )
} 