import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
// import { RFI } from '../../types'
import { HelpCircle, AlertCircle, Upload, X, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const rfiSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  solicitante: z.string().min(1, 'Solicitante é obrigatório'),
  destinatario: z.string().min(1, 'Destinatário é obrigatório'),
  data_solicitacao: z.string().min(1, 'Data de solicitação é obrigatória'),
  prioridade: z.enum(['baixa', 'media', 'alta', 'urgente']),
  status: z.enum(['pendente', 'em_analise', 'respondido', 'fechado']),
  resposta: z.string().optional(),
  impacto_custo: z.number().optional(),
  impacto_prazo: z.number().optional(),
  observacoes: z.string().optional(),
})

type RFIFormData = z.infer<typeof rfiSchema>

interface RFIFormProps {
  initialData?: Partial<RFIFormData>
  onSubmit: (data: RFIFormData) => void
  onCancel: () => void
}

const prioridades = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
  { value: 'urgente', label: 'Urgente' },
]

const statusOptions = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_analise', label: 'Em Análise' },
  { value: 'respondido', label: 'Respondido' },
  { value: 'fechado', label: 'Fechado' },
]

const generateCodigo = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `RFI-${year}-${month}${day}-${random}`
}

export default function RFIForm({ initialData, onSubmit, onCancel }: RFIFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm<RFIFormData & { codigo: string }>({
    resolver: zodResolver(rfiSchema),
    defaultValues: { prioridade: 'media', status: 'pendente', ...initialData, codigo: initialData?.codigo || generateCodigo() }
  })

  // Garante que sempre há um código gerado
  useEffect(() => {
    if (!watch('codigo')) {
      setValue('codigo', generateCodigo())
    }
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(prev => [...prev, ...files])
    toast.success(`${files.length} ficheiro(s) adicionado(s)`)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmitForm = async (data: RFIFormData) => {
    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      // Garante que o campo 'codigo' está presente
      if (!data.codigo) {
        setValue('codigo', generateCodigo())
        data.codigo = generateCodigo()
      }
      onSubmit(data)
      toast.success('RFI salvo com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar RFI')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <HelpCircle className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-blue-900">{initialData ? 'Editar RFI' : 'Novo RFI'}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
          <div className="flex gap-2">
            <input {...register('codigo')} type="text" className="input" placeholder="RFI-2024-001" />
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setValue('codigo', generateCodigo())}>Gerar Código</button>
          </div>
          {errors.codigo && <p className="text-xs text-danger-600 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.codigo.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
          <input {...register('numero')} type="text" className="input" placeholder="RFI-2024-001" />
          {errors.numero && <p className="text-xs text-danger-600 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.numero.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
          <input {...register('titulo')} type="text" className="input" placeholder="Assunto do pedido" />
          {errors.titulo && <p className="text-xs text-danger-600 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.titulo.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Solicitante *</label>
          <input {...register('solicitante')} type="text" className="input" placeholder="Nome do solicitante" />
          {errors.solicitante && <p className="text-xs text-danger-600 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.solicitante.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destinatário *</label>
          <input {...register('destinatario')} type="text" className="input" placeholder="Nome do destinatário" />
          {errors.destinatario && <p className="text-xs text-danger-600 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.destinatario.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de Solicitação *</label>
          <input {...register('data_solicitacao')} type="date" className="input" />
          {errors.data_solicitacao && <p className="text-xs text-danger-600 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.data_solicitacao.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade *</label>
          <select {...register('prioridade')} className="select">
            {prioridades.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select {...register('status')} className="select">
            {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Impacto no Custo (€)</label>
          <input {...register('impacto_custo', { valueAsNumber: true })} type="number" className="input" placeholder="0.00" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Impacto no Prazo (dias)</label>
          <input {...register('impacto_prazo', { valueAsNumber: true })} type="number" className="input" placeholder="0" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
        <textarea {...register('descricao')} rows={3} className="textarea" placeholder="Descreva a dúvida ou pedido de informação..." />
        {errors.descricao && <p className="text-xs text-danger-600 mt-1 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.descricao.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Resposta</label>
        <textarea {...register('resposta')} rows={2} className="textarea" placeholder="Resposta ao pedido (se aplicável)..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
        <textarea {...register('observacoes')} rows={2} className="textarea" placeholder="Observações adicionais..." />
      </div>
      {/* Upload de Ficheiros */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Anexos</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary-400 transition-colors">
          <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Arraste ficheiros para aqui ou clique para selecionar</p>
          <input type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileUpload} className="hidden" id="file-upload-rfi" />
          <label htmlFor="file-upload-rfi" className="btn btn-outline btn-sm cursor-pointer">Selecionar Ficheiros</label>
        </div>
        {uploadedFiles.length > 0 && (
          <div className="mt-2 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Ficheiros selecionados:</h4>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button type="button" onClick={() => removeFile(index)} className="text-danger-600 hover:text-danger-800">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isSubmitting}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={!isValid || isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Salvar RFI'}
        </button>
      </div>
    </form>
  )
} 