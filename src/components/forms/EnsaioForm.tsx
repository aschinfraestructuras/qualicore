import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { 
  TestTube, 
  AlertCircle, 
  Calendar, 
  User, 
  MapPin, 
  Upload, 
  X, 
  FileText,
  Calculator,
  Target,
  CheckCircle,
  XCircle,
  Building,
  Package
} from 'lucide-react'
import toast from 'react-hot-toast'

const ensaioSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  tipo: z.enum(['resistencia', 'densidade', 'absorcao', 'durabilidade', 'outro']),
  material_id: z.string().optional(),
  resultado: z.string().min(1, 'Resultado é obrigatório'),
  valor_obtido: z.number().min(0, 'Valor obtido deve ser positivo'),
  valor_esperado: z.number().min(0, 'Valor esperado deve ser positivo'),
  unidade: z.string().min(1, 'Unidade é obrigatória'),
  laboratorio: z.string().min(1, 'Laboratório é obrigatório'),
  data_ensaio: z.string().min(1, 'Data do ensaio é obrigatória'),
  conforme: z.boolean(),
  responsavel: z.string().min(1, 'Responsável é obrigatório'),
  zona: z.string().min(1, 'Zona é obrigatória'),
  estado: z.enum(['pendente', 'em_analise', 'aprovado', 'reprovado', 'concluido']),
  observacoes: z.string().optional()
})

type EnsaioFormData = z.infer<typeof ensaioSchema>

interface EnsaioFormProps {
  onSubmit: (data: EnsaioFormData) => void
  onCancel: () => void
  initialData?: Partial<EnsaioFormData>
  isEditing?: boolean
}

const ensaioTypes = [
  { value: 'resistencia', label: 'Resistência', icon: Target, color: 'text-red-600' },
  { value: 'densidade', label: 'Densidade', icon: Calculator, color: 'text-blue-600' },
  { value: 'absorcao', label: 'Absorção', icon: Package, color: 'text-green-600' },
  { value: 'durabilidade', label: 'Durabilidade', icon: TestTube, color: 'text-purple-600' },
  { value: 'outro', label: 'Outro', icon: TestTube, color: 'text-gray-600' }
]

const statusOptions = [
  { value: 'pendente', label: 'Pendente', color: 'bg-warning-100 text-warning-700' },
  { value: 'em_analise', label: 'Em Análise', color: 'bg-info-100 text-info-700' },
  { value: 'aprovado', label: 'Aprovado', color: 'bg-success-100 text-success-700' },
  { value: 'reprovado', label: 'Reprovado', color: 'bg-danger-100 text-danger-700' },
  { value: 'concluido', label: 'Concluído', color: 'bg-gray-100 text-gray-700' }
]

const unidades = [
  'MPa', 'N/mm²', 'kg/m³', 'g/cm³', 'mm', 'cm', 'm', 'kg', 'ton', '%', 'ºC', 'h', 'dias'
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

const laboratorios = [
  'Laboratório Central',
  'Laboratório de Betão',
  'Laboratório de Solos',
  'Laboratório Externo - CEB',
  'Laboratório Externo - LNEC',
  'Outro'
]

export default function EnsaioForm({ onSubmit, onCancel, initialData, isEditing = false }: EnsaioFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<EnsaioFormData>({
    resolver: zodResolver(ensaioSchema),
    defaultValues: initialData || {
      estado: 'pendente',
      tipo: 'resistencia',
      conforme: true,
      unidade: 'MPa'
    }
  })

  const watchedTipo = watch('tipo')
  const watchedEstado = watch('estado')
  const watchedConforme = watch('conforme')
  const watchedValorObtido = watch('valor_obtido')
  const watchedValorEsperado = watch('valor_esperado')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
    toast.success(`${files.length} ficheiro(s) adicionado(s)`)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmitForm = async (data: EnsaioFormData) => {
    setIsSubmitting(true)
    try {
      // Simular delay de submissão
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aqui seria feita a chamada para a API
      console.log('Dados do ensaio:', data)
      console.log('Ficheiros:', uploadedFiles)
      
      onSubmit(data)
      toast.success(isEditing ? 'Ensaio atualizado com sucesso!' : 'Ensaio registado com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar ensaio')
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
    const code = `ENS-${year}-${month}${day}-${random}`
    setValue('codigo', code)
  }

  const calculateConformity = () => {
    if (watchedValorObtido && watchedValorEsperado) {
      const tolerance = 0.05 // 5% de tolerância
      const minValue = watchedValorEsperado * (1 - tolerance)
      const maxValue = watchedValorEsperado * (1 + tolerance)
      const isConforme = watchedValorObtido >= minValue && watchedValorObtido <= maxValue
      setValue('conforme', isConforme)
      setValue('resultado', isConforme ? 'Conforme' : 'Não Conforme')
    }
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
        <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
          <TestTube className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Editar Ensaio' : 'Novo Ensaio'}
          </h3>
          <p className="text-sm text-gray-600">
            {isEditing ? 'Atualize as informações do ensaio' : 'Registe um novo ensaio técnico'}
          </p>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Código */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código do Ensaio *
          </label>
          <div className="flex space-x-2">
            <input
              {...register('codigo')}
              type="text"
              placeholder="ENS-2024-001"
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
            Tipo de Ensaio *
          </label>
          <select
            {...register('tipo')}
            className={`select ${errors.tipo ? 'border-danger-500' : ''}`}
          >
            {ensaioTypes.map(type => (
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

        {/* Laboratório */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Laboratório *
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <select
              {...register('laboratorio')}
              className={`select pl-10 ${errors.laboratorio ? 'border-danger-500' : ''}`}
            >
              <option value="">Selecione um laboratório</option>
              {laboratorios.map(lab => (
                <option key={lab} value={lab}>
                  {lab}
                </option>
              ))}
            </select>
          </div>
          {errors.laboratorio && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.laboratorio.message}
            </p>
          )}
        </div>

        {/* Data do Ensaio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data do Ensaio *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              {...register('data_ensaio')}
              type="date"
              className={`input pl-10 ${errors.data_ensaio ? 'border-danger-500' : ''}`}
            />
          </div>
          {errors.data_ensaio && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.data_ensaio.message}
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

      {/* Resultados do Ensaio */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-green-600" />
          Resultados do Ensaio
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Valor Esperado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Esperado *
            </label>
            <input
              {...register('valor_esperado', { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="30.0"
              className={`input ${errors.valor_esperado ? 'border-danger-500' : ''}`}
            />
            {errors.valor_esperado && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.valor_esperado.message}
              </p>
            )}
          </div>

          {/* Valor Obtido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Obtido *
            </label>
            <input
              {...register('valor_obtido', { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="28.5"
              className={`input ${errors.valor_obtido ? 'border-danger-500' : ''}`}
            />
            {errors.valor_obtido && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.valor_obtido.message}
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
        </div>

        {/* Resultado e Conformidade */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resultado *
            </label>
            <input
              {...register('resultado')}
              type="text"
              placeholder="Conforme / Não Conforme"
              className={`input ${errors.resultado ? 'border-danger-500' : ''}`}
            />
            {errors.resultado && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.resultado.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conformidade
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  {...register('conforme')}
                  type="radio"
                  value="true"
                  className="mr-2"
                />
                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                Conforme
              </label>
              <label className="flex items-center">
                <input
                  {...register('conforme')}
                  type="radio"
                  value="false"
                  className="mr-2"
                />
                <XCircle className="h-4 w-4 text-red-600 mr-1" />
                Não Conforme
              </label>
            </div>
            <button
              type="button"
              onClick={calculateConformity}
              className="btn btn-outline btn-sm mt-2"
            >
              Calcular Conformidade
            </button>
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
          placeholder="Descrição detalhada do ensaio, condições, observações..."
          rows={4}
          className="textarea"
        />
      </div>

      {/* Upload de Ficheiros */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anexos
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
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
            <span className={`badge ${ensaioTypes.find(t => t.value === watchedTipo)?.color}`}>
              {ensaioTypes.find(t => t.value === watchedTipo)?.label}
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
            <span className={`badge ${watchedConforme ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'}`}>
              {watchedConforme ? 'Conforme' : 'Não Conforme'}
            </span>
          </div>
        </div>
        {watchedValorObtido && watchedValorEsperado && (
          <div className="mt-2 text-sm text-gray-600">
            Resultado: {watchedValorObtido} {watch('unidade')} / {watchedValorEsperado} {watch('unidade')}
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
              {isEditing ? 'Atualizar' : 'Registar'} Ensaio
            </>
          )}
        </button>
      </div>
    </motion.form>
  )
} 