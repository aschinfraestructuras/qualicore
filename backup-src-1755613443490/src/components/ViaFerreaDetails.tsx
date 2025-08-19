import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Calendar, Gauge, Ruler, HardHat, FileText, AlertTriangle } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'trilho' | 'travessa' | 'inspecao';
}

export function TrilhoDetails({ isOpen, onClose, data }: DetailModalProps) {
  if (!isOpen || !data) return null;

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Excelente': return 'text-green-600 bg-green-100';
      case 'Bom': return 'text-blue-600 bg-blue-100';
      case 'Regular': return 'text-yellow-600 bg-yellow-100';
      case 'Mau': return 'text-orange-600 bg-orange-100';
      case 'Crítico': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Ruler className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Detalhes do Trilho</h2>
              <p className="text-gray-600">{data.codigo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações Básicas */}
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📋</span>
                Informações Básicas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Código:</span>
                  <span className="font-semibold text-gray-900">{data.codigo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tipo:</span>
                  <span className="font-semibold text-gray-900">{data.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Material:</span>
                  <span className="font-semibold text-gray-900">{data.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fabricante:</span>
                  <span className="font-semibold text-gray-900">{data.fabricante}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(data.estado)}`}>
                    {data.estado}
                  </span>
                </div>
              </div>
            </div>

            {/* Dimensões */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📏</span>
                Dimensões
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Comprimento:</span>
                  <span className="font-semibold text-gray-900">{data.comprimento} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Peso:</span>
                  <span className="font-semibold text-gray-900">{data.peso} kg/m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tensão:</span>
                  <span className="font-semibold text-gray-900">{data.tensao} MPa</span>
                </div>
              </div>
            </div>

            {/* Localização */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Localização
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">KM Inicial:</span>
                  <span className="font-semibold text-gray-900">{data.km_inicial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">KM Final:</span>
                  <span className="font-semibold text-gray-900">{data.km_final}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Extensão:</span>
                  <span className="font-semibold text-gray-900">{(data.km_final - data.km_inicial).toFixed(3)} km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Datas e Inspeções */}
          <div className="space-y-6">
            {/* Datas */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Datas Importantes
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fabricação:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.data_fabricacao).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Instalação:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.data_instalacao).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Última Inspeção:</span>
                  <span className="font-semibold text-gray-900">{data.ultima_inspecao ? new Date(data.ultima_inspecao).toLocaleDateString('pt-BR') : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Próxima Inspeção:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.proxima_inspecao).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* Geometria */}
            {data.geometria && (
              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Gauge className="h-5 w-5 mr-2" />
                  Parâmetros de Geometria
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Alinhamento:</span>
                    <span className="font-semibold text-gray-900">{data.geometria.alinhamento} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nível:</span>
                    <span className="font-semibold text-gray-900">{data.geometria.nivel} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bitola:</span>
                    <span className="font-semibold text-gray-900">{data.geometria.bitola} mm</span>
                  </div>
                </div>
              </div>
            )}

            {/* Histórico */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Histórico
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Criado em:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Atualizado em:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.updated_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function TravessaDetails({ isOpen, onClose, data }: DetailModalProps) {
  if (!isOpen || !data) return null;

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Excelente': return 'text-green-600 bg-green-100';
      case 'Bom': return 'text-blue-600 bg-blue-100';
      case 'Regular': return 'text-yellow-600 bg-yellow-100';
      case 'Mau': return 'text-orange-600 bg-orange-100';
      case 'Crítico': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <HardHat className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Detalhes da Travessa</h2>
              <p className="text-gray-600">{data.codigo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações Básicas */}
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📋</span>
                Informações Básicas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Código:</span>
                  <span className="font-semibold text-gray-900">{data.codigo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tipo:</span>
                  <span className="font-semibold text-gray-900">{data.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Material:</span>
                  <span className="font-semibold text-gray-900">{data.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fabricante:</span>
                  <span className="font-semibold text-gray-900">{data.fabricante}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(data.estado)}`}>
                    {data.estado}
                  </span>
                </div>
              </div>
            </div>

            {/* Dimensões */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📏</span>
                Dimensões
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Comprimento:</span>
                  <span className="font-semibold text-gray-900">{data.comprimento} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Largura:</span>
                  <span className="font-semibold text-gray-900">{data.largura} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Altura:</span>
                  <span className="font-semibold text-gray-900">{data.altura} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Peso:</span>
                  <span className="font-semibold text-gray-900">{data.peso} kg</span>
                </div>
              </div>
            </div>

            {/* Localização */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Localização
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">KM Inicial:</span>
                  <span className="font-semibold text-gray-900">{data.km_inicial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">KM Final:</span>
                  <span className="font-semibold text-gray-900">{data.km_final}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Extensão:</span>
                  <span className="font-semibold text-gray-900">{(data.km_final - data.km_inicial).toFixed(4)} km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Datas e Histórico */}
          <div className="space-y-6">
            {/* Datas */}
            <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Datas Importantes
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fabricação:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.data_fabricacao).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Instalação:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.data_instalacao).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Última Inspeção:</span>
                  <span className="font-semibold text-gray-900">{data.ultima_inspecao ? new Date(data.ultima_inspecao).toLocaleDateString('pt-BR') : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Próxima Inspeção:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.proxima_inspecao).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* Histórico */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Histórico
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Criado em:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Atualizado em:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.updated_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function InspecaoDetails({ isOpen, onClose, data }: DetailModalProps) {
  if (!isOpen || !data) return null;

  const getResultadoColor = (resultado: string) => {
    switch (resultado) {
      case 'Conforme': return 'text-green-600 bg-green-100';
      case 'Não Conforme': return 'text-yellow-600 bg-yellow-100';
      case 'Crítico': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Detalhes da Inspeção</h2>
              <p className="text-gray-600">{data.tipo} - {new Date(data.data_inspecao).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações Básicas */}
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📋</span>
                Informações da Inspeção
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Data:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.data_inspecao).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tipo:</span>
                  <span className="font-semibold text-gray-900">{data.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Inspector:</span>
                  <span className="font-semibold text-gray-900">{data.inspector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Resultado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResultadoColor(data.resultado)}`}>
                    {data.resultado}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Próxima Inspeção:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.proxima_inspecao).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📝</span>
                Observações
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {data.observacoes || 'Nenhuma observação registrada.'}
              </p>
            </div>

            {/* Ações Corretivas */}
            <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🔧</span>
                Ações Corretivas
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {data.acoes_corretivas || 'Nenhuma ação corretiva necessária.'}
              </p>
            </div>
          </div>

          {/* Parâmetros e Histórico */}
          <div className="space-y-6">
            {/* Parâmetros Medidos */}
            {data.parametros_medidos && Object.keys(data.parametros_medidos).length > 0 && (
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Gauge className="h-5 w-5 mr-2" />
                  Parâmetros Medidos
                </h3>
                <div className="space-y-3">
                  {Object.entries(data.parametros_medidos).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-gray-600">{key}:</span>
                      <span className="font-semibold text-gray-900">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Histórico */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Histórico
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Criado em:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Atualizado em:</span>
                  <span className="font-semibold text-gray-900">{new Date(data.updated_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* Elemento Inspecionado */}
            <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Elemento Inspecionado
              </h3>
              <div className="space-y-3">
                {data.trilho_id && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trilho ID:</span>
                    <span className="font-semibold text-gray-900">{data.trilho_id}</span>
                  </div>
                )}
                {data.travessa_id && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Travessa ID:</span>
                    <span className="font-semibold text-gray-900">{data.travessa_id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
