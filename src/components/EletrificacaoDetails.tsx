import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Calendar, Gauge, Zap, Settings, FileText, AlertTriangle, CheckCircle, Clock, Activity,
  Battery, Power, Cable, Download, Edit, Trash
} from 'lucide-react';

interface EletrificacaoDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'eletrificacao' | 'inspecao';
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EletrificacaoDetails({ isOpen, onClose, data, type, onEdit, onDelete }: EletrificacaoDetailsProps) {
  if (!isOpen || !data) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
      case 'Operacional':
      case 'Conforme':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Manutenção':
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Avaria':
      case 'Não Conforme':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Inativo':
      case 'Desligado':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativo':
      case 'Operacional':
      case 'Conforme':
        return <CheckCircle className="h-5 w-5" />;
      case 'Manutenção':
      case 'Pendente':
        return <Clock className="h-5 w-5" />;
      case 'Avaria':
      case 'Não Conforme':
        return <AlertTriangle className="h-5 w-5" />;
      case 'Inativo':
      case 'Desligado':
        return <Activity className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
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

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Catenária':
        return <Cable className="h-6 w-6" />;
      case 'Subestação':
        return <Power className="h-6 w-6" />;
      case 'Transformador':
        return <Battery className="h-6 w-6" />;
      case 'Poste':
        return <Settings className="h-6 w-6" />;
      case 'Cabo':
        return <Cable className="h-6 w-6" />;
      case 'Disjuntor':
        return <Power className="h-6 w-6" />;
      default:
        return <Zap className="h-6 w-6" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Detalhes da Eletrificação</h2>
                  <p className="text-sm text-gray-600">{data.codigo} - {data.tipo}</p>
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
            <div className={`p-4 rounded-xl flex items-center space-x-3 border ${getStatusColor(data.status_operacional || data.estado || data.resultado)}`}>
              {getStatusIcon(data.status_operacional || data.estado || data.resultado)}
              <div>
                <h3 className="font-semibold">Status: {data.status_operacional || data.estado || data.resultado}</h3>
                <p className="text-sm opacity-80">
                  Última atualização: {formatDateTime(data.updated_at || new Date().toISOString())}
                </p>
              </div>
            </div>

            {/* Informações Principais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Identificação */}
              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Identificação
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                      {getTipoIcon(data.tipo)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Código</p>
                      <p className="font-semibold text-gray-900">{data.codigo}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo</p>
                    <p className="font-semibold text-gray-900">{data.tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Categoria</p>
                    <p className="font-semibold text-gray-900">{data.categoria}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fabricante</p>
                    <p className="font-semibold text-gray-900">{data.fabricante}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Modelo</p>
                    <p className="font-semibold text-gray-900">{data.modelo}</p>
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
                  <div>
                    <p className="text-sm text-gray-600">Localização</p>
                    <p className="font-semibold text-gray-900">{data.localizacao}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">KM Inicial</p>
                      <p className="font-semibold text-gray-900">{data.km_inicial}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">KM Final</p>
                      <p className="font-semibold text-gray-900">{data.km_final}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Datas */}
              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Datas
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Data de Instalação</p>
                    <p className="font-semibold text-gray-900">{formatDate(data.data_instalacao)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Última Inspeção</p>
                    <p className="font-semibold text-gray-900">{formatDate(data.ultima_inspecao)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Próxima Inspeção</p>
                    <p className="font-semibold text-gray-900">{formatDate(data.proxima_inspecao)}</p>
                  </div>
                </div>
              </div>

              {/* Estado */}
              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Estado
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Estado</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(data.estado)}`}>
                      {getStatusIcon(data.estado)}
                      <span className="ml-1">{data.estado}</span>
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status Operacional</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(data.status_operacional)}`}>
                      {getStatusIcon(data.status_operacional)}
                      <span className="ml-1">{data.status_operacional}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parâmetros Técnicos */}
            <div className="glass-card p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Gauge className="h-5 w-5 mr-2" />
                Parâmetros Técnicos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Battery className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs text-gray-600">Tensão</p>
                  <p className="font-semibold text-gray-900">{data.parametros?.tensao || 0} V</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Power className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs text-gray-600">Corrente</p>
                  <p className="font-semibold text-gray-900">{data.parametros?.corrente || 0} A</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs text-gray-600">Potência</p>
                  <p className="font-semibold text-gray-900">{data.parametros?.potencia || 0} W</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs text-gray-600">Frequência</p>
                  <p className="font-semibold text-gray-900">{data.parametros?.frequencia || 0} Hz</p>
                </div>
              </div>
            </div>

            {/* Observações */}
            {data.observacoes && (
              <div className="glass-card p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Observações
                </h3>
                <p className="text-gray-700 leading-relaxed">{data.observacoes}</p>
              </div>
            )}

            {/* Ações Rápidas */}
            <div className="flex items-center justify-center space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
              >
                Fechar
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-medium flex items-center space-x-2">
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
