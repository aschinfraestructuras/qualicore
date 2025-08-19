import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Calendar, Gauge, Building, FileText, AlertTriangle, CheckCircle, Clock, Activity,
  Users, Download, Edit, Trash
} from 'lucide-react';

interface EstacoesDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function EstacoesDetails({ isOpen, onClose, data, type, onEdit, onDelete }: EstacoesDetailsProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

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
        return <CheckCircle className="h-4 w-4" />;
      case 'Manutenção':
      case 'Pendente':
        return <Clock className="h-4 w-4" />;
      case 'Avaria':
      case 'Não Conforme':
        return <AlertTriangle className="h-4 w-4" />;
      case 'Inativo':
      case 'Desligado':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Principal':
        return <Building className="h-6 w-6" />;
      case 'Secundária':
        return <Building className="h-6 w-6" />;
      case 'Terminal':
        return <Building className="h-6 w-6" />;
      case 'Intercambiador':
        return <MapPin className="h-6 w-6" />;
      default:
        return <Building className="h-6 w-6" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Detalhes da Estação</h2>
                    <p className="text-sm text-gray-600">{data?.codigo}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onEdit}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={onDelete}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
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
              {/* Identificação */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Identificação
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Código</label>
                    <p className="text-lg font-semibold text-gray-900">{data?.codigo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Nome</label>
                    <p className="text-lg font-semibold text-gray-900">{data?.nome}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Tipo</label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTipoIcon(data?.tipo)}
                      <span className="text-gray-900">{data?.tipo}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Categoria</label>
                    <p className="text-gray-900">{data?.categoria}</p>
                  </div>
                </div>
              </div>

              {/* Localização e Operação */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Localização e Operação
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Localização</label>
                    <p className="text-gray-900">{data?.localizacao}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">KM</label>
                    <p className="text-gray-900">{data?.km?.toFixed(3)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Operador</label>
                    <p className="text-gray-900">{data?.operador}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Data de Inauguração</label>
                    <p className="text-gray-900">{formatDate(data?.data_inauguracao)}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Estado</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(data?.estado)}`}>
                      {getStatusIcon(data?.estado)}
                      <span className="ml-1">{data?.estado}</span>
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Status Operacional</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(data?.status_operacional)}`}>
                      {getStatusIcon(data?.status_operacional)}
                      <span className="ml-1">{data?.status_operacional}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Parâmetros Técnicos */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Gauge className="h-5 w-5 mr-2" />
                  Parâmetros Técnicos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Nº Plataformas</label>
                    <p className="text-2xl font-bold text-gray-900">{data?.parametros?.num_plataformas || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Nº Vias</label>
                    <p className="text-2xl font-bold text-gray-900">{data?.parametros?.num_vias || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Área Total</label>
                    <p className="text-2xl font-bold text-gray-900">{data?.parametros?.area_total || 0} m²</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Capacidade Passageiros</label>
                    <p className="text-2xl font-bold text-gray-900">{data?.parametros?.capacidade_passageiros || 0}</p>
                  </div>
                </div>
              </div>

              {/* Inspeções */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Inspeções
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Última Inspeção</label>
                    <p className="text-gray-900">{formatDate(data?.ultima_inspecao)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Próxima Inspeção</label>
                    <p className="text-gray-900">{formatDate(data?.proxima_inspecao)}</p>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {data?.observacoes && (
                <div className="glass-card p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Observações
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{data.observacoes}</p>
                </div>
              )}

              {/* Informações do Sistema */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Informações do Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Criado em</label>
                    <p className="text-gray-900">{formatDate(data?.created_at)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Atualizado em</label>
                    <p className="text-gray-900">{formatDate(data?.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
