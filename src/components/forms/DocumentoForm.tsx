import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  FileText, 
  Upload, 
  Calendar,
  User,
  MapPin,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const documentoSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  tipo: z.enum(['projeto', 'especificacao', 'relatorio', 'certificado', 'outro']),
  versao: z.string().min(1, 'Versão é obrigatória'),
  data_validade: z.string().optional(),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  zona: z.string().min(1, 'Zona é obrigatória'),
  estado: z.enum(['pendente', 'em_analise', 'aprovado', 'reprovado', 'concluido']),
  observacoes: z.string().optional(),
  fornecedor_id: z.string().optional()
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
  { value: 'outro', label: 'Outro', icon: FileText, color: 'text-gray-600' }
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
      // Simular delay de submissão
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aqui seria feita a chamada para a API
      console.log('Dados do formulário:', data)
      console.log('Ficheiros:', uploadedFiles)
      
      onSubmit(data)
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