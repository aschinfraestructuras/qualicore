import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Edit, 
  Trash2, 
  Building, 
  Calendar, 
  MapPin, 
  Truck, 
  FileText,
  Thermometer,
  Gauge,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Hash,
  TrendingUp,
  Clock
} from 'lucide-react';

interface Betonagem {
  id: string;
  codigo: string;
  obra: string;
  elemento_estrutural: string;
  localizacao: string;
  data_betonagem: string;
  data_ensaio_7d: string;
  data_ensaio_28d: string;
  fornecedor: string;
  guia_remessa: string;
  tipo_betao: string;
  aditivos: string;
  hora_limite_uso: string;
  slump: number;
  temperatura: number;
  resistencia_7d_1: number;
  resistencia_7d_2: number;
  resistencia_28d_1: number;
  resistencia_28d_2: number;
  resistencia_28d_3: number;
  resistencia_rotura: number;
  dimensoes_provete: string;
  status_conformidade: string;
  observacoes: string;
  relatorio_rotura: string;
  created_at: string;
  updated_at: string;
}

interface ControloBetonagensDetailsProps {
  betonagem: Betonagem;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ControloBetonagensDetails({ 
  betonagem, 
  onClose, 
  onEdit, 
  onDelete 
}: ControloBetonagensDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Conforme': return 'text-green-600 bg-green-100';
      case 'Não Conforme': return 'text-red-600 bg-red-100';
      case 'Pendente': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Conforme': return <CheckCircle className="h-5 w-5" />;
      case 'Não Conforme': return <XCircle className="h-5 w-5" />;
      case 'Pendente': return <AlertTriangle className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não definida';
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getResistenciaColor = (resistencia: number, minimo: number) => {
    if (resistencia === 0) return 'text-gray-500';
    return resistencia >= minimo ? 'text-green-600' : 'text-red-600';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Detalhes da Betonagem
                </h2>
                <p className="text-sm text-gray-600">
                  {betonagem.codigo} - {betonagem.elemento_estrutural}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Hash className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Código</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{betonagem.codigo}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Building className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Obra</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{betonagem.obra}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Building className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Elemento</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{betonagem.elemento_estrutural}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Localização</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{betonagem.localizacao}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Data Betonagem</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(betonagem.data_betonagem).toLocaleDateString('pt-PT')}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Fornecedor</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{betonagem.fornecedor}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Guia Remessa</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{betonagem.guia_remessa}</p>
              </div>
            </div>

            {/* Datas de Ensaio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Data Ensaio 7 dias</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {betonagem.data_ensaio_7d ? new Date(betonagem.data_ensaio_7d).toLocaleDateString('pt-PT') : 'Não definida'}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Data Ensaio 28 dias</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {betonagem.data_ensaio_28d ? new Date(betonagem.data_ensaio_28d).toLocaleDateString('pt-PT') : 'Não definida'}
                </p>
              </div>
            </div>

            {/* Parâmetros Técnicos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Gauge className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Slump</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{betonagem.slump} cm</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Thermometer className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Temperatura</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{betonagem.temperatura}°C</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Gauge className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Dimensões</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{betonagem.dimensoes_provete}</p>
              </div>
            </div>

            {/* Características do Betão */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Gauge className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-600">Tipo de Betão</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{betonagem.tipo_betao || 'Não especificado'}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-600">Aditivos</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{betonagem.aditivos || 'Nenhum'}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-600">Hora Limite de Uso</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{betonagem.hora_limite_uso || 'Não especificada'}</p>
              </div>
            </div>

            {/* Resistências das Provetas */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Thermometer className="w-5 h-5 mr-2 text-blue-600" />
                Resistências das Provetas (MPa)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Resistências 7 dias */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    A 7 dias
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Probeta 1:</span>
                      <span className={`font-semibold ${getResistenciaColor(betonagem.resistencia_7d_1, 20)}`}>
                        {betonagem.resistencia_7d_1} MPa
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Probeta 2:</span>
                      <span className={`font-semibold ${getResistenciaColor(betonagem.resistencia_7d_2, 20)}`}>
                        {betonagem.resistencia_7d_2} MPa
                      </span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-blue-800">Média:</span>
                        <span className="font-semibold text-blue-800">
                          {((betonagem.resistencia_7d_1 + betonagem.resistencia_7d_2) / 2).toFixed(1)} MPa
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resistências 28 dias */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    A 28 dias
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Probeta 1:</span>
                      <span className={`font-semibold ${getResistenciaColor(betonagem.resistencia_28d_1, 30)}`}>
                        {betonagem.resistencia_28d_1} MPa
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Probeta 2:</span>
                      <span className={`font-semibold ${getResistenciaColor(betonagem.resistencia_28d_2, 30)}`}>
                        {betonagem.resistencia_28d_2} MPa
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Probeta 3:</span>
                      <span className={`font-semibold ${getResistenciaColor(betonagem.resistencia_28d_3, 30)}`}>
                        {betonagem.resistencia_28d_3} MPa
                      </span>
                    </div>
                    <div className="border-t border-green-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-green-800">Média:</span>
                        <span className="font-semibold text-green-800">
                          {((betonagem.resistencia_28d_1 + betonagem.resistencia_28d_2 + betonagem.resistencia_28d_3) / 3).toFixed(1)} MPa
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resistência de Rotura */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <h4 className="font-medium text-orange-800 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Resistência de Rotura
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valor:</span>
                      <span className={`font-semibold ${getResistenciaColor(betonagem.resistencia_rotura, 35)}`}>
                        {betonagem.resistencia_rotura} MPa
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Campo editável para rompamento diferente
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Observações */}
            {betonagem.observacoes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{betonagem.observacoes}</p>
              </div>
            )}

            {/* Relatório de Rotura */}
            {betonagem.relatorio_rotura && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Relatório de Rotura
                </h3>
                <p className="text-orange-700 whitespace-pre-wrap">{betonagem.relatorio_rotura}</p>
              </div>
            )}

            {/* Metadados */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Informações do Sistema
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs font-medium text-gray-600">Criado em</label>
                  <p className="text-gray-900">{new Date(betonagem.created_at).toLocaleString('pt-PT')}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">Atualizado em</label>
                  <p className="text-gray-900">{new Date(betonagem.updated_at).toLocaleString('pt-PT')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={onDelete}
              className="px-4 py-2 text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Eliminar</span>
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
