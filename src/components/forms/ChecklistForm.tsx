import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { 
  ClipboardCheck, 
  AlertCircle, 
  Calendar, 
  User, 
  MapPin, 
  Upload, 
  X, 
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react'
import toast from 'react-hot-toast'

const checklistItemSchema = z.object({
  id: z.string(),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  criterio: z.string().min(1, 'Critério é obrigatório'),
  conforme: z.boolean(),
  observacoes: z.string().optional()
})

const checklistSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  tipo: z.enum(['inspecao', 'verificacao', 'aceitacao', 'outro']),
  itens: z.array(checklistItemSchema).min(1, 'Pelo menos um item é obrigatório'),
  percentual_conformidade: z.number().min(0).max(100),
  data_inspecao: z.string().min(1, 'Data de inspeção é obrigatória'),
  inspetor: z.string().min(1, 'Inspetor é obrigatório'),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  zona: z.string().min(1, 'Zona é obrigatória'),
  estado: z.enum(['pendente', 'em_analise', 'aprovado', 'reprovado', 'concluido']),
  observacoes: z.string().optional()
})

type ChecklistFormData = z.infer<typeof checklistSchema>
type ChecklistItem = z.infer<typeof checklistItemSchema>

interface ChecklistFormProps {
  onSubmit: (data: ChecklistFormData) => void
  onCancel: () => void
  initialData?: Partial<ChecklistFormData>
  isEditing?: boolean
}

const checklistTypes = [
  { value: 'inspecao', label: 'Inspeção', icon: Eye, color: 'text-blue-600' },
  { value: 'verificacao', label: 'Verificação', icon: CheckCircle, color: 'text-green-600' },
  { value: 'aceitacao', label: 'Aceitação', icon: CheckCircle, color: 'text-purple-600' },
  { value: 'outro', label: 'Outro', icon: ClipboardCheck, color: 'text-gray-600' }
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

const defaultItems = [
  { id: '1', descricao: 'Verificação de dimensões', criterio: 'Dimensões conforme projeto', conforme: true, observacoes: '' },
  { id: '2', descricao: 'Verificação de alinhamento', criterio: 'Alinhamento vertical < 10mm', conforme: true, observacoes: '' },
  { id: '3', descricao: 'Verificação de limpeza', criterio: 'Superfície limpa e sem detritos', conforme: false, observacoes: 'Necessita limpeza adicional' }
]

export default function ChecklistForm({ onSubmit, onCancel, initialData, isEditing = false }: ChecklistFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [items, setItems] = useState<ChecklistItem[]>(initialData?.itens || defaultItems)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistSchema),
    defaultValues: initialData || {
      estado: 'pendente',
      tipo: 'inspecao',
      itens: defaultItems,
      percentual_conformidade: 67 // Calculado automaticamente
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

  const addItem = () => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      descricao: '',
      criterio: '',
      conforme: true,
      observacoes: ''
    }
    const updatedItems = [...items, newItem]
    setItems(updatedItems)
    setValue('itens', updatedItems)
    calculateConformity(updatedItems)
  }

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id)
    setItems(updatedItems)
    setValue('itens', updatedItems)
    calculateConformity(updatedItems)
  }

  const updateItem = (id: string, field: keyof ChecklistItem, value: any) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    )
    setItems(updatedItems)
    setValue('itens', updatedItems)
    calculateConformity(updatedItems)
  }

  const calculateConformity = (itemsList: ChecklistItem[]) => {
    if (itemsList.length === 0) {
      setValue('percentual_conformidade', 0)
      return
    }
    
    const conformes = itemsList.filter(item => item.conforme).length
    const percentual = Math.round((conformes / itemsList.length) * 100)
    setValue('percentual_conformidade', percentual)
  }

  const onSubmitForm = async (data: ChecklistFormData) => {
    setIsSubmitting(true)
    try {
      // Simular delay de submissão
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aqui seria feita a chamada para a API
      console.log('Dados do checklist:', data)
      console.log('Ficheiros:', uploadedFiles)
      
      onSubmit(data)
      toast.success(isEditing ? 'Checklist atualizado com sucesso!' : 'Checklist criado com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar checklist')
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
    const code = `CHK-${year}-${month}${day}-${random}`
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
        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
          <ClipboardCheck className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Editar Checklist' : 'Novo Checklist'}
          </h3>
          <p className="text-sm text-gray-600">
            {isEditing ? 'Atualize as informações do checklist' : 'Crie um novo checklist de inspeção'}
          </p>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Código */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código do Checklist *
          </label>
          <div className="flex space-x-2">
            <input
              {...register('codigo')}
              type="text"
              placeholder="CHK-2024-001"
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
            Tipo de Checklist *
          </label>
          <select
            {...register('tipo')}
            className={`select ${errors.tipo ? 'border-danger-500' : ''}`}
          >
            {checklistTypes.map(type => (
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

        {/* Data de Inspeção */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Inspeção *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              {...register('data_inspecao')}
              type="date"
              className={`input pl-10 ${errors.data_inspecao ? 'border-danger-500' : ''}`}
            />
          </div>
          {errors.data_inspecao && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.data_inspecao.message}
            </p>
          )}
        </div>

        {/* Inspetor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inspetor *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              {...register('inspetor')}
              type="text"
              placeholder="Nome do inspetor"
              className={`input pl-10 ${errors.inspetor ? 'border-danger-500' : ''}`}
            />
          </div>
          {errors.inspetor && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.inspetor.message}
            </p>
          )}
        </div>

        {/* Responsável */}
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

        {/* Zona */}
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

      {/* Itens do Checklist */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
            <ClipboardCheck className="h-5 w-5 mr-2 text-purple-600" />
            Itens do Checklist
          </h4>
          <button
            type="button"
            onClick={addItem}
            className="btn btn-outline btn-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-danger-600 hover:text-danger-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição *
                  </label>
                  <input
                    type="text"
                    value={item.descricao}
                    onChange={(e) => updateItem(item.id, 'descricao', e.target.value)}
                    placeholder="Descrição do item"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Critério *
                  </label>
                  <input
                    type="text"
                    value={item.criterio}
                    onChange={(e) => updateItem(item.id, 'criterio', e.target.value)}
                    placeholder="Critério de aceitação"
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conformidade
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={item.conforme}
                        onChange={() => updateItem(item.id, 'conforme', true)}
                        className="mr-2"
                      />
                      <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                      Conforme
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!item.conforme}
                        onChange={() => updateItem(item.id, 'conforme', false)}
                        className="mr-2"
                      />
                      <XCircle className="h-4 w-4 text-red-600 mr-1" />
                      Não Conforme
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <input
                    type="text"
                    value={item.observacoes}
                    onChange={(e) => updateItem(item.id, 'observacoes', e.target.value)}
                    placeholder="Observações adicionais"
                    className="input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Percentual de Conformidade */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-medium text-gray-700">Percentual de Conformidade</h5>
              <p className="text-xs text-gray-500">Calculado automaticamente</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600">
                {watch('percentual_conformidade')}%
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${watch('percentual_conformidade')}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Observações Gerais */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observações Gerais
        </label>
        <textarea
          {...register('observacoes')}
          placeholder="Observações gerais sobre o checklist..."
          rows={4}
          className="textarea"
        />
      </div>

      {/* Upload de Ficheiros */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anexos
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
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
            <span className={`badge ${checklistTypes.find(t => t.value === watchedTipo)?.color}`}>
              {checklistTypes.find(t => t.value === watchedTipo)?.label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Estado:</span>
            <span className={`badge ${statusOptions.find(s => s.value === watchedEstado)?.color}`}>
              {statusOptions.find(s => s.value === watchedEstado)?.label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Conformidade:</span>
            <span className="badge bg-blue-100 text-blue-700">
              {watch('percentual_conformidade')}%
            </span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {items.length} item(s) no checklist
        </div>
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
              {isEditing ? 'Atualizar' : 'Criar'} Checklist
            </>
          )}
        </button>
      </div>
    </motion.form>
  )
} 