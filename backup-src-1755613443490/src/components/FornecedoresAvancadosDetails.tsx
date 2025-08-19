import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Edit, 
  Building2, 
  Star, 
  Award, 
  Shield, 
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { FornecedorAvancado } from '../types/fornecedores';

interface FornecedoresAvancadosDetailsProps {
  fornecedor: FornecedorAvancado;
  onClose: () => void;
  onEdit: () => void;
}

export function FornecedoresAvancadosDetails({
  fornecedor,
  onClose,
  onEdit
}: FornecedoresAvancadosDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualificado': return 'text-green-600 bg-green-100';
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'suspenso': return 'text-red-600 bg-red-100';
      case 'desqualificado': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getClassificacaoColor = (classificacao: number) => {
    if (classificacao >= 4.5) return 'text-green-600';
    if (classificacao >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Building2 className="h-6 w-6 mr-2 text-blue-600" />
              Detalhes do Fornecedor
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="p-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Header com informações principais */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{fornecedor.nome}</h3>
                <p className="text-lg text-gray-600">Código: {fornecedor.codigo}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(fornecedor.status_qualificacao)}`}>
                    {fornecedor.status_qualificacao}
                  </span>
                  <div className="flex items-center">
                    <Star className={`h-4 w-4 ${getClassificacaoColor(fornecedor.classificacao_geral)}`} />
                    <span className={`ml-1 text-sm font-medium ${getClassificacaoColor(fornecedor.classificacao_geral)}`}>
                      {fornecedor.classificacao_geral.toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Criado em</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(fornecedor.data_criacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          {/* Informações de Contacto */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              Informações de Contacto
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{fornecedor.email || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Telefone</p>
                  <p className="text-sm text-gray-600">{fornecedor.telefone || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Website</p>
                  <p className="text-sm text-gray-600">{fornecedor.website || 'Não informado'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Endereço</p>
                  <p className="text-sm text-gray-600">
                    {fornecedor.morada}, {fornecedor.codigo_postal} {fornecedor.cidade}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Qualificação e Avaliação */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-purple-600" />
              Qualificação e Avaliação
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Datas Importantes</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Qualificação:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {fornecedor.data_qualificacao ? new Date(fornecedor.data_qualificacao).toLocaleDateString('pt-BR') : 'Não definida'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Reavaliação:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {fornecedor.data_reavaliacao ? new Date(fornecedor.data_reavaliacao).toLocaleDateString('pt-BR') : 'Não definida'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Avaliação por Critérios</h5>
                <div className="space-y-1">
                  {Object.entries(fornecedor.criterios_avaliacao || {}).map(([criterio, valor]) => (
                    <div key={criterio} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{criterio}:</span>
                      <span className="text-sm font-medium text-gray-900">{valor.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Certificações</h5>
                <div className="flex items-center">
                  <Award className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-gray-900">
                    {fornecedor.certificacoes.length} certificação{fornecedor.certificacoes.length !== 1 ? 'ões' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Categorias e Produtos */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-orange-600" />
              Categorias e Produtos
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Categorias</h5>
                <div className="flex flex-wrap gap-2">
                  {fornecedor.categorias.length > 0 ? (
                    fornecedor.categorias.map((categoria, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {categoria}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Nenhuma categoria definida</p>
                  )}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Produtos Principais</h5>
                <div className="flex flex-wrap gap-2">
                  {fornecedor.produtos_principais.length > 0 ? (
                    fornecedor.produtos_principais.map((produto, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                      >
                        {produto}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Nenhum produto definido</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Observações */}
          {fornecedor.observacoes && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Observações</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{fornecedor.observacoes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
