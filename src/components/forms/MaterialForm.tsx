import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { 
  Package, 
  AlertCircle, 
  Calendar, 
  User, 
  MapPin, 
  Upload, 
  X, 
  FileText,
  Building,
  Scale
} from 'lucide-react'
import toast from 'react-hot-toast'

const materialSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  nome: z.string().min(1, 'Nome é obrigatório'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  fornecedor_id: z.string().optional(),
  certificado_id: z.string().optional(),
  data_rececao: z.string().min(1, 'Data de receção é obrigatória'),
  quantidade: z.number().min(0, 'Quantidade deve ser positiva'),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
  lote: z.string().min(1, 'Lote é obrigatório'),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  zona: z.string().min(1, 'Zona é obrigatória'),
  estado: z.enum(['pendente', 'em_analise', 'aprovado', 'reprovado', 'concluido']),
  observacoes: z.string().optional()
})

type MaterialFormData = z.infer<typeof materialSchema>

interface MaterialFormProps {
  onSubmit: (data: MaterialFormData) => void
  onCancel: () => void
  initialData?: Partial<MaterialFormData>
  isEditing?: boolean
}

const materialTypes = [
  { value: 'betao', label: 'Betão', icon: Package, color: 'text-gray-600' },
  { value: 'aco', label: 'Aço', icon: Package, color: 'text-blue-600' },
  { value: 'agregado', label: 'Agregado', icon: Package, color: 'text-yellow-600' },
  { value: 'cimento', label: 'Cimento', icon: Package, color: 'text-gray-800' },
  { value: 'outro', label: 'Outro', icon: Package, color: 'text-gray-600' }
]

const statusOptions = [
  { value: 'pendente', label: 'Pendente', color: 'bg-warning-100 text-warning-700' },
  { value: 'em_analise', label: 'Em Análise', color: 'bg-info-100 text-info-700' },
  { value: 'aprovado', label: 'Aprovado', color: 'bg-success-100 text-success-700' },
  { value: 'reprovado', label: 'Reprovado', color: 'bg-danger-100 text-danger-700' },
  { value: 'concluido', label: 'Concluído', color: 'bg-gray-100 text-gray-700' }
]

const unidades = [
  'kg', 'ton', 'm³', 'm²', 'm', 'l', 'un', 'pcs', 'caixas', 'paletes'
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

const fornecedores = [
  { id: '1', nome: 'Cimpor - Cimentos de Portugal' },
  { id: '2', nome: 'Secil - Companhia Geral de Cal e Cimento' },
  { id: '3', nome: 'Lusical - Cal e Derivados' },
  { id: '4', nome: 'Siderurgia Nacional' },
  { id: '5', nome: 'Outro' }
]

export default function MaterialForm({ onSubmit, onCancel, initialData, isEditing = false }: MaterialFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCustomTipo, setShowCustomTipo] = useState(false)
  const [showCustomFornecedor, setShowCustomFornecedor] = useState(false)
  const [showCustomZona, setShowCustomZona] = useState(false)
  const [customTipo, setCustomTipo] = useState('')
  const [customFornecedor, setCustomFornecedor] = useState('')
  const [customZona, setCustomZona] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: initialData || {
      estado: 'pendente',
      tipo: 'betao',
      unidade: 'm³'
    }
  })

  // Inicializar campos customizados se há dados iniciais
  useEffect(() => {
    if (initialData) {
      // Verificar se o tipo é customizado (não está na lista padrão)
      const isCustomTipo = !materialTypes.find(t => t.value === initialData.tipo)
      if (isCustomTipo && initialData.tipo) {
        setShowCustomTipo(true)
        setCustomTipo(initialData.tipo)
        setValue('tipo', 'outro')
      }
      
      // Verificar se o fornecedor é customizado
      const isCustomFornecedor = !fornecedores.find(f => f.id === initialData.fornecedor_id)
      if (isCustomFornecedor && initialData.fornecedor_id) {
        setShowCustomFornecedor(true)
        setCustomFornecedor(initialData.fornecedor_id)
        setValue('fornecedor_id', 'outro')
      }
      
      // Verificar se a zona é customizada
      const isCustomZona = !zonas.find(z => z === initialData.zona)
      if (isCustomZona && initialData.zona) {
        setShowCustomZona(true)
        setCustomZona(initialData.zona)
        setValue('zona', 'outro')
      }
    }
  }, [initialData, setValue])

  const watchedTipo = watch('tipo')
  const watchedEstado = watch('estado')
  const watchedQuantidade = watch('quantidade')
  const watchedFornecedor = watch('fornecedor_id')
  const watchedZona = watch('zona')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
    toast.success(`${files.length} ficheiro(s) adicionado(s)`)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmitForm = async (data: MaterialFormData) => {
    setIsSubmitting(true)
    try {
      // Simular delay de submissão
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Processar dados customizados
      const processedData = { ...data }
      
      // Se tipo é "outro" e há um tipo customizado, usar o customizado
      if (data.tipo === 'outro' && customTipo.trim()) {
        processedData.tipo = customTipo.trim()
      }
      
      // Se fornecedor é "outro" e há um fornecedor customizado, usar o customizado
      if (data.fornecedor_id === 'outro' && customFornecedor.trim()) {
        processedData.fornecedor_id = customFornecedor.trim()
      }
      
      // Se zona é "outro" e há uma zona customizada, usar a customizada
      if (data.zona === 'outro' && customZona.trim()) {
        processedData.zona = customZona.trim()
      }
      
      // Aqui seria feita a chamada para a API
      console.log('Dados do material:', processedData)
      console.log('Ficheiros:', uploadedFiles)
      
      onSubmit(processedData)
      toast.success(isEditing ? 'Material atualizado com sucesso!' : 'Material registado com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar material')
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
    const code = `MAT-${year}-${month}${day}-${random}`
    setValue('codigo', code)
  }

  const generateLote = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    const lote = `L${year}${month}${day}-${random}`
    setValue('lote', lote)
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
        <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Editar Material' : 'Novo Material'}
          </h3>
          <p className="text-sm text-gray-600">
            {isEditing ? 'Atualize as informações do material' : 'Registe um novo material'}
          </p>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Código */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código do Material *
          </label>
          <div className="flex space-x-2">
            <input
              {...register('codigo')}
              type="text"
              placeholder="MAT-2024-001"
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

        {/* Nome */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome do Material *
          </label>
          <input
            {...register('nome')}
            type="text"
            placeholder="Ex: Betão C30/37, Aço B500B, etc."
            className={`input ${errors.nome ? 'border-danger-500' : ''}`}
          />
          {errors.nome && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.nome.message}
            </p>
          )}
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Material *
          </label>
          <select
            {...register('tipo')}
            onChange={(e) => {
              setValue('tipo', e.target.value)
              setShowCustomTipo(e.target.value === 'outro')
            }}
            className={`select ${errors.tipo ? 'border-danger-500' : ''}`}
          >
            {materialTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          {showCustomTipo && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Especifique o tipo de material..."
                value={customTipo}
                onChange={(e) => setCustomTipo(e.target.value)}
                className="input"
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite o tipo específico do material
              </p>
            </div>
          )}
          
          {errors.tipo && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.tipo.message}
            </p>
          )}
        </div>

        {/* Fornecedor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fornecedor
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              {...register('fornecedor_id')}
              onChange={(e) => {
                setValue('fornecedor_id', e.target.value)
                setShowCustomFornecedor(e.target.value === 'outro')
              }}
              className="select pl-10"
            >
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map(fornecedor => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </option>
              ))}
              <option value="outro">Outro (especificar)</option>
            </select>
          </div>
          
          {showCustomFornecedor && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Nome do fornecedor..."
                value={customFornecedor}
                onChange={(e) => setCustomFornecedor(e.target.value)}
                className="input"
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite o nome do fornecedor
              </p>
            </div>
          )}
        </div>

        {/* Data de Receção */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data de Receção *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              {...register('data_rececao')}
              type="date"
              className={`input pl-10 ${errors.data_rececao ? 'border-danger-500' : ''}`}
            />
          </div>
          {errors.data_rececao && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.data_rececao.message}
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

      {/* Informações de Stock */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Scale className="h-5 w-5 mr-2 text-orange-600" />
          Informações de Stock
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quantidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade *
            </label>
            <input
              {...register('quantidade', { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="100.0"
              className={`input ${errors.quantidade ? 'border-danger-500' : ''}`}
            />
            {errors.quantidade && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.quantidade.message}
              </p>
            )}
          </div>

          {/* Unidade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unidade *
            </label>
            <select
              {...register('unidade')}
              className={`select ${errors.unidade ? 'border-danger-500' : ''}`}
            >
              {unidades.map(unidade => (
                <option key={unidade} value={unidade}>
                  {unidade}
                </option>
              ))}
            </select>
            {errors.unidade && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.unidade.message}
              </p>
            )}
          </div>

          {/* Lote */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lote *
            </label>
            <div className="flex space-x-2">
              <input
                {...register('lote')}
                type="text"
                placeholder="L20240101-01"
                className={`input flex-1 ${errors.lote ? 'border-danger-500' : ''}`}
              />
              <button
                type="button"
                onClick={generateLote}
                className="btn btn-outline btn-md whitespace-nowrap"
              >
                Gerar Lote
              </button>
            </div>
            {errors.lote && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.lote.message}
              </p>
            )}
          </div>
        </div>

        {/* Certificado */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número do Certificado
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              {...register('certificado_id')}
              type="text"
              placeholder="CERT-2024-001"
              className="input pl-10"
            />
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
              onChange={(e) => {
                setValue('zona', e.target.value)
                setShowCustomZona(e.target.value === 'outro')
              }}
              className={`select pl-10 ${errors.zona ? 'border-danger-500' : ''}`}
            >
              <option value="">Selecione uma zona</option>
              {zonas.map(zona => (
                <option key={zona} value={zona}>
                  {zona}
                </option>
              ))}
              <option value="outro">Outra (especificar)</option>
            </select>
          </div>
          
          {showCustomZona && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Nome da zona..."
                value={customZona}
                onChange={(e) => setCustomZona(e.target.value)}
                className="input"
              />
              <p className="text-xs text-gray-500 mt-1">
                Digite o nome da zona ou localização
              </p>
            </div>
          )}
          
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
          placeholder="Descrição detalhada do material, especificações, observações..."
          rows={4}
          className="textarea"
        />
      </div>

      {/* Upload de Ficheiros */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anexos
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors">
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
            <span className={`badge ${materialTypes.find(t => t.value === watchedTipo)?.color || 'bg-gray-100 text-gray-700'}`}>
              {watchedTipo === 'outro' && customTipo ? customTipo : materialTypes.find(t => t.value === watchedTipo)?.label || watchedTipo}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Estado:</span>
            <span className={`badge ${statusOptions.find(s => s.value === watchedEstado)?.color}`}>
              {statusOptions.find(s => s.value === watchedEstado)?.label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Quantidade:</span>
            <span className="badge bg-orange-100 text-orange-700">
              {watchedQuantidade} {watch('unidade')}
            </span>
          </div>
          {watchedFornecedor && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Fornecedor:</span>
              <span className="badge bg-blue-100 text-blue-700">
                {watchedFornecedor === 'outro' && customFornecedor ? customFornecedor : fornecedores.find(f => f.id === watchedFornecedor)?.nome || watchedFornecedor}
              </span>
            </div>
          )}
          {watchedZona && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Zona:</span>
              <span className="badge bg-purple-100 text-purple-700">
                {watchedZona === 'outro' && customZona ? customZona : watchedZona}
              </span>
            </div>
          )}
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
              {isEditing ? 'Atualizar' : 'Registar'} Material
            </>
          )}
        </button>
      </div>
    </motion.form>
  )
} 