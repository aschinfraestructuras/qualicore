import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Calendar,
  Gauge,
  Signal,
  Settings,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Wifi,
  Radio,
  Satellite,
  Lightbulb,
  Bell,
  Camera,
  Monitor,
  Download,
  Edit,
  Trash
} from 'lucide-react';

interface SinalizacaoDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'sinalizacao' | 'inspecao';
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SinalizacaoDetails({ isOpen, onClose, data, type, onEdit, onDelete }: SinalizacaoDetailsProps) {
  if (!isOpen || !data) return null;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
      case 'operacional':
        return 'text-green-600 bg-green-100';
      case 'inativo':
      case 'desativada':
        return 'text-red-600 bg-red-100';
      case 'manutenção':
      case 'teste':
        return 'text-yellow-600 bg-yellow-100';
      case 'emergência':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
      case 'operacional':
        return <CheckCircle className="h-4 w-4" />;
      case 'inativo':
      case 'desativada':
        return <AlertTriangle className="h-4 w-4" />;
      case 'manutenção':
      case 'teste':
        return <Clock className="h-4 w-4" />;
      case 'emergência':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Signal className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Detalhes da Sinalização
                  </h2>
                  <p className="text-sm text-gray-600">
                    {data.codigo} - {data.tipo}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status Banner */}
            <div className={`p-4 rounded-xl flex items-center space-x-3 ${getStatusColor(data.status_operacional || data.estado)}`}>
              {getStatusIcon(data.status_operacional || data.estado)}
              <div>
                <h3 className="font-semibold">
                  Status: {data.status_operacional || data.estado}
                </h3>
                <p className="text-sm opacity-80">
                  Última atualização: {formatDateTime(data.updated_at || new Date().toISOString())}
                </p>
              </div>
            </div>

            {/* Informações Principais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coluna Esquerda */}
              <div className="space-y-6">
                {/* Identificação */}
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Identificação
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Código:</span>
                      <span className="font-medium">{data.codigo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-medium">{data.tipo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Categoria:</span>
                      <span className="font-medium">{data.categoria}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Modelo:</span>
                      <span className="font-medium">{data.modelo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fabricante:</span>
                      <span className="font-medium">{data.fabricante}</span>
                    </div>
                  </div>
                </div>

                {/* Localização */}
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Localização
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Local:</span>
                      <span className="font-medium">{data.localizacao}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">KM Inicial:</span>
                      <span className="font-medium">{data.km_inicial} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">KM Final:</span>
                      <span className="font-medium">{data.km_final} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Extensão:</span>
                      <span className="font-medium">{(data.km_final - data.km_inicial).toFixed(1)} km</span>
                    </div>
                  </div>
                </div>

                {/* Datas */}
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Datas Importantes
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Instalação:</span>
                      <span className="font-medium">{formatDate(data.data_instalacao)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Última Inspeção:</span>
                      <span className="font-medium">{formatDate(data.ultima_inspecao)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Próxima Inspeção:</span>
                      <span className="font-medium">{formatDate(data.proxima_inspecao)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-6">
                {/* Parâmetros Técnicos */}
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Gauge className="h-5 w-5 mr-2" />
                    Parâmetros Técnicos
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Alcance:</span>
                      <span className="font-medium">{data.parametros?.alcance || 0} m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frequência:</span>
                      <span className="font-medium">{data.parametros?.frequencia || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Potência:</span>
                      <span className="font-medium">{data.parametros?.potencia || 0} W</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sensibilidade:</span>
                      <span className="font-medium">{data.parametros?.sensibilidade || 0} dBm</span>
                    </div>
                  </div>
                </div>

                {/* Status e Estado */}
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Status e Estado
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.estado)}`}>
                        {data.estado}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status Operacional:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status_operacional)}`}>
                        {data.status_operacional}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div className="glass-card p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Observações
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 text-sm">
                      {data.observacoes || 'Nenhuma observação registrada.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações do Sistema */}
            <div className="glass-card p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Informações do Sistema
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Wifi className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs text-gray-600">Conectividade</p>
                  <p className="font-semibold text-blue-600">Ativa</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Radio className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs text-gray-600">Sinal</p>
                  <p className="font-semibold text-green-600">Estável</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Satellite className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs text-gray-600">GPS</p>
                  <p className="font-semibold text-purple-600">Sincronizado</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Monitor className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs text-gray-600">Monitoramento</p>
                  <p className="font-semibold text-orange-600">Online</p>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
              >
                Fechar
              </button>
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-medium flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar Relatório</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
