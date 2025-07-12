import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { 
  Building, 
  AlertCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Upload, 
  X, 
  FileText,
  User,
  Hash,
  Globe,
  CheckCircle,
  XCircle,
  Truck,
  Award
} from 'lucide-react'
import toast from 'react-hot-toast'

const fornecedorSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  nif: z.string().min(9, 'NIF deve ter pelo menos 9 dígitos').max(9, 'NIF deve ter no máximo 9 dígitos'),
  morada: z.string().min(1, 'Morada é obrigatória'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido'),
  contacto: z.string().min(1, 'Contacto é obrigatório'),
  estado: z.enum(['ativo', 'inativo'])
})

type FornecedorFormData = z.infer<typeof fornecedorSchema>

interface FornecedorFormProps {
  onSubmit: (data: FornecedorFormData) => void
  onCancel: () => void
  initialData?: Partial<FornecedorFormData>
  isEditing?: boolean
}

const statusOptions = [
  { value: 'ativo', label: 'Ativo', color: 'bg-success-100 text-success-700' },
  { value: 'inativo', label: 'Inativo', color: 'bg-gray-100 text-gray-700' }
]

export default function FornecedorForm({ onSubmit, onCancel, initialData, isEditing = false }: FornecedorFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<FornecedorFormData>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: initialData || {
      estado: 'ativo'
    }
  })

  const watchedEstado = watch('estado')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
    toast.success(`${files.length} ficheiro(s) adicionado(s)`)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmitForm = async (data: FornecedorFormData) => {
    setIsSubmitting(true)
    try {
      // Simular delay de submissão
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aqui seria feita a chamada para a API
      console.log('Dados do fornecedor:', data)
      console.log('Ficheiros:', uploadedFiles)
      
      onSubmit(data)
      toast.success(isEditing ? 'Fornecedor atualizado com sucesso!' : 'Fornecedor registado com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar fornecedor')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateNIF = (nif: string) => {
    // Validação básica de NIF português
    if (nif.length !== 9) return false
    
    const weights = [9, 8, 7, 6, 5, 4, 3, 2]
    let sum = 0
    
    for (let i = 0; i < 8; i++) {
      sum += parseInt(nif[i]) * weights[i]
    }
    
    const remainder = sum % 11
    const checkDigit = remainder === 0 || remainder === 1 ? 0 : 11 - remainder
    
    return parseInt(nif[8]) === checkDigit
  }

  const handleNIFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nif = e.target.value.replace(/\D/g, '')
    setValue('nif', nif)
    
    if (nif.length === 9) {
      if (validateNIF(nif)) {
        toast.success('NIF válido!')
      } else {
        toast.error('NIF inválido!')
      }
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
        <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600">
          <Building className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h3>
          <p className="text-sm text-gray-600">
            {isEditing ? 'Atualize as informações do fornecedor' : 'Registe um novo fornecedor'}
          </p>
        </div>
      </div>

      {/* Informações Empresariais */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2 text-cyan-600" />
          Informações Empresariais
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome da Empresa */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Empresa *
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register('nome')}
                type="text"
                placeholder="Nome da empresa"
                className={`input pl-10 ${errors.nome ? 'border-danger-500' : ''}`}
              />
            </div>
            {errors.nome && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.nome.message}
              </p>
            )}
          </div>

          {/* NIF */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NIF *
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register('nif')}
                type="text"
                placeholder="123456789"
                maxLength={9}
                onChange={handleNIFChange}
                className={`input pl-10 ${errors.nif ? 'border-danger-500' : ''}`}
              />
            </div>
            {errors.nif && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.nif.message}
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
      </div>

      {/* Informações de Contacto */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-cyan-600" />
          Informações de Contacto
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome do Contacto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Contacto *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register('contacto')}
                type="text"
                placeholder="Nome do contacto principal"
                className={`input pl-10 ${errors.contacto ? 'border-danger-500' : ''}`}
              />
            </div>
            {errors.contacto && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.contacto.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register('email')}
                type="email"
                placeholder="contacto@empresa.pt"
                className={`input pl-10 ${errors.email ? 'border-danger-500' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register('telefone')}
                type="tel"
                placeholder="+351 123 456 789"
                className={`input pl-10 ${errors.telefone ? 'border-danger-500' : ''}`}
              />
            </div>
            {errors.telefone && (
              <p className="mt-1 text-sm text-danger-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.telefone.message}
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="url"
                placeholder="https://www.empresa.pt"
                className="input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Morada */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-cyan-600" />
          Morada
        </h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Morada Completa *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <textarea
              {...register('morada')}
              placeholder="Rua, número, andar, código postal, localidade"
              rows={3}
              className={`textarea pl-10 ${errors.morada ? 'border-danger-500' : ''}`}
            />
          </div>
          {errors.morada && (
            <p className="mt-1 text-sm text-danger-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.morada.message}
            </p>
          )}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-cyan-600" />
          Informações Adicionais
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certificações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificações
            </label>
            <textarea
              placeholder="ISO 9001, ISO 14001, etc."
              rows={3}
              className="textarea"
            />
          </div>

          {/* Produtos/Serviços */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produtos/Serviços
            </label>
            <textarea
              placeholder="Principais produtos ou serviços fornecidos"
              rows={3}
              className="textarea"
            />
          </div>
        </div>
      </div>

      {/* Upload de Ficheiros */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anexos
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-cyan-400 transition-colors">
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
            <span className="text-sm text-gray-600">Estado:</span>
            <span className={`badge ${statusOptions.find(s => s.value === watchedEstado)?.color}`}>
              {statusOptions.find(s => s.value === watchedEstado)?.label}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">NIF:</span>
            <span className="badge bg-gray-100 text-gray-700">
              {watch('nif')}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Contacto:</span>
            <span className="badge bg-cyan-100 text-cyan-700">
              {watch('contacto')}
            </span>
          </div>
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
              {isEditing ? 'Atualizar' : 'Registar'} Fornecedor
            </>
          )}
        </button>
      </div>
    </motion.form>
  )
} 