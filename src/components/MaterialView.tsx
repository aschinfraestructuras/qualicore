import { MaterialRecord } from '@/lib/pocketbase'
import { 
  Package, 
  Calendar, 
  MapPin, 
  User, 
  Building, 
  FileText, 
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  CheckSquare
} from 'lucide-react'

interface MaterialViewProps {
  material: MaterialRecord
  onClose: () => void
}

export default function MaterialView({ material, onClose }: MaterialViewProps) {
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'aprovado': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'pendente': return <Clock className="h-5 w-5 text-yellow-600" />
      case 'em_analise': return <AlertCircle className="h-5 w-5 text-blue-600" />
      case 'reprovado': return <XCircle className="h-5 w-5 text-red-600" />
      case 'concluido': return <CheckSquare className="h-5 w-5 text-gray-600" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprovado': return 'text-green-600 bg-green-100'
      case 'pendente': return 'text-yellow-600 bg-yellow-100'
      case 'em_analise': return 'text-blue-600 bg-blue-100'
      case 'reprovado': return 'text-red-600 bg-red-100'
      case 'concluido': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'betao': return <Package className="h-6 w-6 text-gray-600" />
      case 'aco': return <Package className="h-6 w-6 text-blue-600" />
      case 'agregado': return <Package className="h-6 w-6 text-yellow-600" />
      case 'cimento': return <Package className="h-6 w-6 text-gray-800" />
      default: return <Package className="h-6 w-6 text-gray-600" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Detalhes do Material</h2>
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              {getTipoIcon(material.tipo)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{material.codigo}</h3>
              <p className="text-gray-600">{material.nome}</p>
              <div className="flex items-center space-x-2 mt-2">
                {getEstadoIcon(material.estado)}
                <span className={`badge ${getEstadoColor(material.estado)}`}>
                  {material.estado.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Informações Básicas</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Data de Receção</p>
                    <p className="text-sm text-gray-900">
                      {new Date(material.data_rececao).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Zona</p>
                    <p className="text-sm text-gray-900">{material.zona}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Responsável</p>
                    <p className="text-sm text-gray-900">{material.responsavel}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Especificações</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Package className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Quantidade</p>
                    <p className="text-sm text-gray-900">
                      {material.quantidade} {material.unidade}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Lote</p>
                    <p className="text-sm text-gray-900">{material.lote}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Fornecedor ID</p>
                    <p className="text-sm text-gray-900">{material.fornecedor_id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificado */}
          {material.certificado_id && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Certificado</h4>
              <div className="flex items-center space-x-3">
                <FileText className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-900">{material.certificado_id}</p>
              </div>
            </div>
          )}

          {/* Observações */}
          {material.observacoes && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Observações</h4>
              <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                {material.observacoes}
              </p>
            </div>
          )}

          {/* Anexos */}
          {material.anexos && material.anexos.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Anexos</h4>
              <div className="space-y-2">
                {material.anexos.map((anexo, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{anexo}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <p className="text-xs text-gray-500">Criado em</p>
              <p className="text-sm text-gray-900">
                {new Date(material.created).toLocaleDateString('pt-PT')} às{' '}
                {new Date(material.created).toLocaleTimeString('pt-PT')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Atualizado em</p>
              <p className="text-sm text-gray-900">
                {new Date(material.updated).toLocaleDateString('pt-PT')} às{' '}
                {new Date(material.updated).toLocaleTimeString('pt-PT')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 