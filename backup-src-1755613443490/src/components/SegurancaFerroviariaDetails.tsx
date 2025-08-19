import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Calendar, Gauge, Shield, FileText, AlertTriangle, CheckCircle, Clock, Activity,
  Users, Download, Edit, Trash, Bell, Camera, Lock, Eye, Settings, Zap
} from 'lucide-react';

interface SegurancaFerroviariaDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function SegurancaFerroviariaDetails({ isOpen, onClose, data, type, onEdit, onDelete }: SegurancaFerroviariaDetailsProps) {
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Sistema de Detecção':
        return <Bell className="h-5 w-5" />;
      case 'Sistema de Vigilância':
        return <Camera className="h-5 w-5" />;
      case 'Sistema de Controle':
        return <Shield className="h-5 w-5" />;
      case 'Sistema de Alarme':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
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

  const getNivelSegurancaColor = (nivel: number) => {
    switch (nivel) {
      case 1:
        return 'bg-red-100 text-red-800 border-red-200';
      case 2:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 3:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 4:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 5:
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                    {getTipoIcon(data.tipo)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Detalhes do Sistema de Segurança</h2>
                    <p className="text-sm text-gray-600">{data.codigo}</p>
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
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-red-600" />
                      Informações Básicas
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Código</label>
                        <p className="text-gray-900 font-semibold">{data.codigo}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Tipo</label>
                        <div className="flex items-center space-x-2">
                          {getTipoIcon(data.tipo)}
                          <p className="text-gray-900">{data.tipo}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Categoria</label>
                        <p className="text-gray-900">{data.categoria}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Estado</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(data.estado)}`}>
                          {getStatusIcon(data.estado)}
                          <span className="ml-1">{data.estado}</span>
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status Operacional</label>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(data.status_operacional)}`}>
                          {getStatusIcon(data.status_operacional)}
                          <span className="ml-1">{data.status_operacional}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      Localização
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Localização</label>
                        <p className="text-gray-900">{data.localizacao}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Extensão</label>
                        <p className="text-gray-900">KM {data.km_inicial} - {data.km_final}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Fabricante</label>
                        <p className="text-gray-900">{data.fabricante}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Modelo</label>
                        <p className="text-gray-900">{data.modelo}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Data de Instalação</label>
                        <p className="text-gray-900">{new Date(data.data_instalacao).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Parameters */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Gauge className="h-5 w-5 mr-2 text-purple-600" />
                  Parâmetros Técnicos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-600">Nível de Segurança</label>
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getNivelSegurancaColor(data.parametros?.nivel_seguranca || 1)}`}>
                      Nível {data.parametros?.nivel_seguranca || 1}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-600">Raio de Cobertura</label>
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{data.parametros?.raio_cobertura || 0} m</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-600">Tempo de Resposta</label>
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{data.parametros?.tempo_resposta || 0} s</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-600">Capacidade de Detecção</label>
                      <Eye className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{data.parametros?.capacidade_deteccao || 0}%</p>
                  </div>
                </div>
              </div>

              {/* Inspection Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-600" />
                    Informações de Inspeção
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Última Inspeção</label>
                      <p className="text-gray-900">
                        {data.ultima_inspecao ? new Date(data.ultima_inspecao).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Próxima Inspeção</label>
                      <p className="text-gray-900">
                        {data.proxima_inspecao ? new Date(data.proxima_inspecao).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                    Observações
                  </h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900 text-sm">
                      {data.observacoes || 'Nenhuma observação registrada.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* System Status Indicators */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-red-600" />
                  Indicadores do Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${data.estado === 'Ativo' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-700">Status Geral</span>
                    <span className={`text-sm ${data.estado === 'Ativo' ? 'text-green-600' : 'text-red-600'}`}>
                      {data.estado}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${data.status_operacional === 'Operacional' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm font-medium text-gray-700">Operacional</span>
                    <span className={`text-sm ${data.status_operacional === 'Operacional' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {data.status_operacional}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${(data.parametros?.capacidade_deteccao || 0) >= 80 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <span className="text-sm font-medium text-gray-700">Detecção</span>
                    <span className={`text-sm ${(data.parametros?.capacidade_deteccao || 0) >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                      {(data.parametros?.capacidade_deteccao || 0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>Criado em: {new Date(data.created_at).toLocaleString('pt-BR')}</p>
                <p>Atualizado em: {new Date(data.updated_at).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
