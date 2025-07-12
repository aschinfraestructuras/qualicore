import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  AlertCircle, 
  Calendar, 
  User, 
  MapPin, 
  Upload, 
  X, 
  FileText,
  DollarSign,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  TrendingDown,
  Shield
} from 'lucide-react'
import toast from 'react-hot-toast'

const naoConformidadeSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  tipo: z.enum(['material', 'execucao', 'documentacao', 'seguranca', 'outro']),
  severidade: z.enum(['baixa', 'media', 'alta', 'critica']),
  data_deteccao: z.string().min(1, 'Data de deteção é obrigatória'),
  data_resolucao: z.string().optional(),
  acao_corretiva: z.string().optional(),
  responsavel_resolucao: z.string().optional(),
  custo_estimado: z.number().min(0, 'Custo deve ser positivo').optional(),
  relacionado_ensaio_id: z.string().optional(),
  relacionado_material_id: z.string().optional(),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  zona: z.string().min(1, 'Zona é obrigatória'),
  estado: z.enum(['pendente', 'em_analise', 'aprovado', 'reprovado', 'concluido']),
  observacoes: z.string().optional()
})

type NaoConformidadeFormData = z.infer<typeof naoConformidadeSchema>

interface NaoConformidadeFormProps {
  onSubmit: (data: NaoConformidadeFormData) => void
  onCancel: () => void
  initialData?: Partial<NaoConformidadeFormData>
  isEditing?: boolean
}

const ncTypes = [
  { value: 'material', label: 'Material', icon: AlertTriangle, color: 'text-orange-600' },
  { value: 'execucao', label: 'Execução', icon: Target, color: 'text-red-600' },
  { value: 'documentacao', label: 'Documentação', icon: FileText, color: 'text-blue-600' },
  { value: 'seguranca', label: 'Segurança', icon: Shield, color: 'text-purple-600' },
  { value: 'outro', label: 'Outro', icon: AlertTriangle, color: 'text-gray-600' }
]

const severidadeOptions = [
  { value: 'baixa', label: 'Baixa', color: 'bg-success-100 text-success-700', icon: CheckCircle },
  { value: 'media', label: 'Média', color: 'bg-warning-100 text-warning-700', icon: Clock },
  { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-700', icon: AlertTriangle },
  { value: 'critica', label: 'Crítica', color: 'bg-danger-100 text-danger-700', icon: XCircle }
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

export default function NaoConformidadeForm({ onSubmit, onCancel, initialData, isEditing = false }: NaoConformidadeFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<NaoConformidadeFormData>({
    resolver: zodResolver(naoConformidadeSchema),
    defaultValues: initialData || {
      estado: 'pendente',
      tipo: 'material',
      severidade: 'media'
    }
  })

  const watchedTipo = watch('tipo')
  const watchedEstado = watch('estado')
  const watchedSeveridade = watch('severidade')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
    toast.success(`${files.length} ficheiro(s) adicionado(s)`)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmitForm = async (data: NaoConformidadeFormData) => {
    setIsSubmitting(true)
    try {
      // Simular delay de submissão
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aqui seria feita a chamada para a API
      console.log('Dados da não conformidade:', data)
      console.log('Ficheiros:', uploadedFiles)
      
      onSubmit(data)
      toast.success(isEditing ? 'Não conformidade atualizada com sucesso!' : 'Não conformidade registada com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar não conformidade')
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
    const code = `NC-${year}-${month}${day}-${random}`
    setValue('codigo', code)
  }

  const getSeveridadeColor = (severidade: string) => {
    const option = severidadeOptions.find(s => s.value === severidade)
    return option ? option.color : 'bg-gray-100 text-gray-700'
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
        <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Editar Não Conformidade' : 'Nova Não Conformidade'}
          </h3>
          <p className="text-sm text-gray-600">
            {isEditing ? 'Atualize as informações da não conformidade' : 'Registe uma nova não conformidade'}
          </p>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Código */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código da NC *
          </label>
          <div className="flex space-x-2">
            <input
              {...register('codigo')}
              type="text"
              placeholder="NC-2024-001"
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
            Tipo de NC *
          </label>
          <select
            {...register('tipo')}
            className={`select ${errors.tipo ? 'border-danger-500' : ''}`}
          >
            {ncTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.tipo && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.tipo.message}
            </p>
          )}
        </div>

        {/* Severidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severidade *
          </label>
          <select
            {...register('severidade')}
            className={`select ${errors.severidade ? 'border-danger-500' : ''}`}
          >
            {severidadeOptions.map(severidade => (
              <option key={severidade.value} value={severidade.value}>
                {severidade.label}
              </option>
            ))}
          </select>
          {errors.severidade && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.severidade.message}
            </p>
          )}
        </div>

        {/* Data de Deteção */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Deteção *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              {...register('data_deteccao')}
              type="date"
              className={`input pl-10 ${errors.data_deteccao ? 'border-danger-500' : ''}`}
            />
          </div>
          {errors.data_deteccao && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.data_deteccao.message}
            </p>
          )}
        </div>

        {/* Data de Resolução */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Resolução
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              {...register('data_resolucao')}
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

      {/* Ação Corretiva */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-red-600" />
          Ação Corretiva
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição da Ação Corretiva
            </label>
            <textarea
              {...register('acao_corretiva')}
              placeholder="Descreva as ações corretivas a implementar..."
              rows={4}
              className="textarea"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responsável pela Resolução
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('responsavel_resolucao')}
                  type="text"
                  placeholder="Nome do responsável"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custo Estimado (€)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('custo_estimado', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="input pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Relacionamentos */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
          Relacionamentos
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ensaio Relacionado
            </label>
            <select
              {...register('relacionado_ensaio_id')}
              className="select"
            >
              <option value="">Selecione um ensaio (opcional)</option>
              <option value="1">ENS-2024-001 - Resistência do Betão</option>
              <option value="2">ENS-2024-002 - Densidade do Material</option>
              <option value="3">ENS-2024-003 - Absorção de Água</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material Relacionado
            </label>
            <select
              {...register('relacionado_material_id')}
              className="select"
            >
              <option value="">Selecione um material (opcional)</option>
              <option value="1">MAT-2024-001 - Betão C30/37</option>
              <option value="2">MAT-2024-002 - Aço B500B</option>
              <option value="3">MAT-2024-003 - Cimento CEM I</option>
            </select>
          </div>
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
            </select>
          </div>
          {errors.zona && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.zona.message}
            </p>
          )}
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observações
        </label>
        <textarea
          {...register('observacoes')}
          placeholder="Descrição detalhada da não conformidade, causas, impactos..."
          rows={4}
          className="textarea"
        />
      </div>

      {/* Upload de Ficheiros */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anexos
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">
            Arraste ficheiros para aqui ou clique para selecionar
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
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

      {/* Preview do Resultado */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Pré-visualização:</h4>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Tipo:</span>
            <span className={`badge ${ncTypes.find(t => t.value === watchedTipo)?.color}`}>
              {ncTypes.find(t => t.value === watchedTipo)?.label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Severidade:</span>
            <span className={`badge ${getSeveridadeColor(watchedSeveridade)}`}>
              {severidadeOptions.find(s => s.value === watchedSeveridade)?.label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Estado:</span>
            <span className={`badge ${statusOptions.find(s => s.value === watchedEstado)?.color}`}>
              {statusOptions.find(s => s.value === watchedEstado)?.label}
            </span>
          </div>
        </div>
        {watch('custo_estimado') && (
          <div className="mt-2 text-sm text-gray-600">
            Custo estimado: €{watch('custo_estimado')}
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline btn-md"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-md"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Salvando...
            </>
          ) : (
            <>
              {isEditing ? 'Atualizar' : 'Registar'} Não Conformidade
            </>
          )}
        </button>
      </div>
    </motion.form>
  )
} 