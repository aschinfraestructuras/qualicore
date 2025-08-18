import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X as XIcon, 
  Edit, 
  Trash2, 
  Building, 
  Calendar, 
  MapPin, 
  FileText,
  Thermometer,
  Gauge,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Hash,
  TrendingUp,
  Clock,
  Download,
  Eye,
  Layers,
  Droplets,
  TestTube,
  Microscope,
  Compass,
  Ruler,
  Scale,
  Zap,
  Database,
  FileCheck,
  Award
} from 'lucide-react';
import { CaracterizacaoSolo } from '@/types/solos';

interface CaracterizacaoSolosDetailsProps {
  solo: CaracterizacaoSolo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CaracterizacaoSolosDetails({ 
  solo, 
  isOpen, 
  onClose 
}: CaracterizacaoSolosDetailsProps) {
  if (!solo) return null;

  const getAdequacaoColor = (adequacao: string) => {
    switch (adequacao) {
      case 'EXCELENTE': return 'text-green-600 bg-green-100';
      case 'ADEQUADO': return 'text-blue-600 bg-blue-100';
      case 'MARGINAL': return 'text-yellow-600 bg-yellow-100';
      case 'TOLERABLE': return 'text-orange-600 bg-orange-100';
      case 'INADECUADO': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConformidadeIcon = (conforme: boolean) => {
    return conforme ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Não definida';
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const formatNumber = (value: any, decimals: number = 2) => {
    if (value === null || value === undefined || typeof value !== 'number') return 'N/A';
    return value.toFixed(decimals);
  };

  const renderGranulometriaTable = (granulometria: any, title: string) => {
    if (!granulometria || typeof granulometria !== 'object') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            {title}
          </h4>
          <p className="text-gray-500">Dados não disponíveis</p>
        </div>
      );
    }

    // Extrair dados de peneiração se existirem
    const peneiras = granulometria.peneiras || {};
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <Layers className="w-5 h-5 mr-2" />
          {title}
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peneira (mm)
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Passante
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(peneiras).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {key}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(value, 1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {granulometria.curva_granulometrica && (
          <div className="mt-3 p-2 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              <strong>Curva Granulométrica:</strong> {granulometria.curva_granulometrica}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Caracterização de Solo
                    </h2>
                    <p className="text-gray-600">
                      {solo.codigo} • {solo.obra}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Hash className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Código</p>
                      <p className="text-lg font-semibold text-gray-900">{solo.codigo}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Building className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-green-600 font-medium">Obra</p>
                      <p className="text-lg font-semibold text-gray-900">{solo.obra}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Localização</p>
                      <p className="text-lg font-semibold text-gray-900">{solo.localizacao}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <TestTube className="w-5 h-5 text-orange-600 mr-2" />
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Laboratório</p>
                      <p className="text-lg font-semibold text-gray-900">{solo.laboratorio}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status e Conformidade */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getConformidadeIcon(solo.conforme)}
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Conformidade
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      solo.conforme ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                    }`}>
                      {solo.conforme ? 'Conforme' : 'Não Conforme'}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Adequação
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAdequacaoColor(solo.classificacao.adequacao)}`}>
                      {solo.classificacao.adequacao}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Layers className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Tipo Amostra
                      </span>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full text-gray-600 bg-gray-100">
                      {solo.tipo_amostra}
                    </span>
                  </div>
                </div>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Data Colheita</p>
                      <p className="font-semibold text-gray-900">{formatDate(solo.data_colheita)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Receção Laboratório</p>
                      <p className="font-semibold text-gray-900">{formatDate(solo.data_rececao_laboratorio)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center">
                    <FileCheck className="w-5 h-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Data Resultados</p>
                      <p className="font-semibold text-gray-900">{formatDate(solo.data_resultados)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Características Físicas */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Thermometer className="w-6 h-6 mr-2 text-blue-600" />
                  Características Físicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Humidade Natural</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.humidade_natural)}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Densidade Natural</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.densidade_natural)} g/cm³</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Densidade Seca</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.densidade_seca)} g/cm³</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">Índice de Vazios</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.indice_vazios)}</p>
                  </div>
                </div>
              </div>

              {/* Granulometria */}
              <div className="space-y-4">
                {renderGranulometriaTable(solo.granulometria_peneiracao, 'Granulometria por Peneiração')}
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Droplets className="w-5 h-5 mr-2" />
                    Granulometria por Sedimentação
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Silte</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.granulometria_sedimentacao.silte)}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Argila</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.granulometria_sedimentacao.argila)}%</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Coef. Uniformidade</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.granulometria_sedimentacao.coeficiente_uniformidade)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">Coef. Curvatura</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.granulometria_sedimentacao.coeficiente_curvatura)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Limites de Consistência */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Scale className="w-6 h-6 mr-2 text-green-600" />
                  Limites de Consistência (Atterberg)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-600">Limite de Liquidez</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.limites_consistencia.limite_liquidez)}%</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-600">Limite de Plasticidade</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.limites_consistencia.limite_plasticidade)}%</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-600">Índice de Plasticidade</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.limites_consistencia.indice_plasticidade)}%</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-600">Índice de Liquidez</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.limites_consistencia.indice_liquidez)}</p>
                  </div>
                </div>
              </div>

              {/* Ensaios de Compactação */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Gauge className="w-6 h-6 mr-2 text-blue-600" />
                    Proctor Normal
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-600">Humidade Ótima</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.proctor_normal.humidade_otima)}%</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-600">Densidade Máxima</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.proctor_normal.densidade_maxima)} g/cm³</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-600">Grau de Compactação</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.proctor_normal.grau_compactacao)}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                    Proctor Modificado
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-green-600">Humidade Ótima</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.proctor_modificado.humidade_otima)}%</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-green-600">Densidade Máxima</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.proctor_modificado.densidade_maxima)} g/cm³</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-green-600">Grau de Compactação</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.proctor_modificado.grau_compactacao)}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ensaios de Resistência */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Zap className="w-6 h-6 mr-2 text-orange-600" />
                    Ensaios CBR
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-sm text-orange-600">Valor CBR</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.cbr.valor_cbr)}%</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-sm text-orange-600">Expansão</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.cbr.expansao)}%</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <p className="text-sm text-orange-600">Penetração</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.cbr.penetracao)} mm</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Compass className="w-6 h-6 mr-2 text-purple-600" />
                    Resistência ao Cisalhamento
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-sm text-purple-600">Coesão</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.resistencia_cisalhamento.coesao)} kPa</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-sm text-purple-600">Ângulo de Atrito</p>
                      <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.resistencia_cisalhamento.angulo_atrito)}°</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-sm text-purple-600">Tipo de Ensaio</p>
                      <p className="text-lg font-semibold text-gray-900">{solo.resistencia_cisalhamento.tipo_ensaio}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Características Químicas */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Microscope className="w-6 h-6 mr-2 text-red-600" />
                  Características Químicas
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-red-600">pH</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.caracteristicas_quimicas.ph, 1)}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-red-600">Matéria Orgânica</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.caracteristicas_quimicas.materia_organica)}%</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-red-600">Sulfatos</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.caracteristicas_quimicas.sulfatos)} mg/kg</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-red-600">Gessos</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.caracteristicas_quimicas.gessos)}%</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-red-600">Carbonatos</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.caracteristicas_quimicas.carbonatos)}%</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-red-600">Cloretos</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.caracteristicas_quimicas.cloretos)} mg/kg</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-red-600">CTC</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.caracteristicas_quimicas.capacidade_troca_cationica)} meq/100g</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-red-600">Sais Solúveis</p>
                    <p className="text-lg font-semibold text-gray-900">{formatNumber(solo.caracteristicas_quimicas.sais_soluveis)}%</p>
                  </div>
                </div>
              </div>

              {/* Classificação */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-indigo-600" />
                  Classificação do Solo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-sm text-indigo-600 font-medium">Sistema Unificado (USCS)</p>
                    <p className="text-lg font-semibold text-gray-900">{solo.classificacao.sistema_unificado}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-sm text-indigo-600 font-medium">Sistema AASHTO</p>
                    <p className="text-lg font-semibold text-gray-900">{solo.classificacao.sistema_aashto}</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-sm text-indigo-600 font-medium">Grupo Português</p>
                    <p className="text-lg font-semibold text-gray-900">{solo.classificacao.grupo_portugues}</p>
                  </div>
                </div>
              </div>

              {/* Observações e Recomendações */}
              {(solo.observacoes || solo.recomendacoes) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {solo.observacoes && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <Eye className="w-6 h-6 mr-2 text-blue-600" />
                        Observações
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{solo.observacoes}</p>
                    </div>
                  )}
                  
                  {solo.recomendacoes && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <FileText className="w-6 h-6 mr-2 text-green-600" />
                        Recomendações
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{solo.recomendacoes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Documentação */}
              {(solo.relatorio_laboratorio || solo.certificado_laboratorio || solo.fotos_amostra?.length > 0) && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-purple-600" />
                    Documentação
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {solo.relatorio_laboratorio && (
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-purple-600 mr-2" />
                            <span className="text-sm font-medium text-purple-600">Relatório Laboratório</span>
                          </div>
                          <button className="p-1 hover:bg-purple-200 rounded transition-colors">
                            <Download className="w-4 h-4 text-purple-600" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {solo.certificado_laboratorio && (
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FileCheck className="w-5 h-5 text-purple-600 mr-2" />
                            <span className="text-sm font-medium text-purple-600">Certificado Laboratório</span>
                          </div>
                          <button className="p-1 hover:bg-purple-200 rounded transition-colors">
                            <Download className="w-4 h-4 text-purple-600" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {solo.fotos_amostra && solo.fotos_amostra.length > 0 && (
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Eye className="w-5 h-5 text-purple-600 mr-2" />
                            <span className="text-sm font-medium text-purple-600">
                              Fotos da Amostra ({solo.fotos_amostra.length})
                            </span>
                          </div>
                          <button className="p-1 hover:bg-purple-200 rounded transition-colors">
                            <Eye className="w-4 h-4 text-purple-600" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Normas de Referência */}
              {solo.normas_referencia && solo.normas_referencia.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FileCheck className="w-6 h-6 mr-2 text-indigo-600" />
                    Normas de Referência
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {solo.normas_referencia.map((norma, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                        {norma}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Última atualização: {formatDate(solo.updated_at || solo.created_at || '')}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
