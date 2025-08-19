import { useState } from "react";
import { X, Printer, FileText, Download, Eye, Settings, Monitor } from "lucide-react";
import { printService, PrintOptions } from "@/services/printService";
import { MetricasReais } from "@/services/metricsService";
import toast from "react-hot-toast";

interface UniversalPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  modulo: string;
  dados?: any[];
  metricas?: MetricasReais;
  titulo?: string;
  subtitulo?: string;
}

export default function UniversalPrintModal({
  isOpen,
  onClose,
  modulo,
  dados = [],
  metricas,
  titulo,
  subtitulo,
}: UniversalPrintModalProps) {
  const [tipoRelatorio, setTipoRelatorio] = useState<"executivo" | "detalhado" | "comparativo" | "individual">("executivo");
  const [orientacao, setOrientacao] = useState<"portrait" | "landscape">("portrait");
  const [tamanho, setTamanho] = useState<"a4" | "a3" | "letter">("a4");
  const [incluirKPIs, setIncluirKPIs] = useState(true);
  const [incluirTabelas, setIncluirTabelas] = useState(true);
  const [incluirGraficos, setIncluirGraficos] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    try {
      setLoading(true);

      const options: PrintOptions = {
        titulo: titulo || `Relatório de ${getModuloTitle(modulo)}`,
        subtitulo: subtitulo || `${getTipoTitle(tipoRelatorio)} - ${new Date().toLocaleDateString('pt-PT')}`,
        tipo: tipoRelatorio,
        modulo: modulo as any,
        dados,
        metricas,
        orientacao,
        tamanho,
        incluirKPIs,
        incluirTabelas,
        incluirGraficos
      };

      await printService.printRelatorio(options);
      toast.success("Relatório enviado para impressão!");
      onClose();
    } catch (error) {
      console.error("Erro ao imprimir:", error);
      toast.error("Erro ao gerar relatório para impressão");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintCurrentPage = () => {
    try {
      printService.printCurrentPage();
      toast.success("Página atual enviada para impressão!");
      onClose();
    } catch (error) {
      console.error("Erro ao imprimir página atual:", error);
      toast.error("Erro ao imprimir página atual");
    }
  };

  const handlePrintDashboard = async () => {
    if (!metricas) {
      toast.error("Métricas não disponíveis para dashboard");
      return;
    }

    try {
      setLoading(true);
      await printService.printDashboard(metricas);
      toast.success("Dashboard enviado para impressão!");
      onClose();
    } catch (error) {
      console.error("Erro ao imprimir dashboard:", error);
      toast.error("Erro ao gerar dashboard para impressão");
    } finally {
      setLoading(false);
    }
  };

  const getModuloTitle = (modulo: string): string => {
    const titles: Record<string, string> = {
      'geral': 'Geral',
      'ensaios': 'Ensaios',
      'checklists': 'Checklists',
      'materiais': 'Materiais',
      'ncs': 'Não Conformidades',
      'documentos': 'Documentos',
      'fornecedores': 'Fornecedores',
      'obras': 'Obras'
    };
    return titles[modulo] || modulo;
  };

  const getTipoTitle = (tipo: string): string => {
    const titles: Record<string, string> = {
      'executivo': 'Relatório Executivo',
      'detalhado': 'Relatório Detalhado',
      'comparativo': 'Relatório Comparativo',
      'individual': 'Relatório Individual'
    };
    return titles[tipo] || tipo;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Printer className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Sistema de Impressão Universal
              </h2>
              <p className="text-gray-600">
                Configure e imprima relatórios de {getModuloTitle(modulo)}
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

        <div className="p-6 space-y-6">
          {/* Opções Rápidas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Opções Rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={handlePrintCurrentPage}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <Monitor className="h-8 w-8 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Imprimir Página Atual</h4>
                <p className="text-sm text-gray-600">
                  Imprime exatamente o que está visível na tela
                </p>
              </button>

              <button
                onClick={handlePrintDashboard}
                disabled={!metricas}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left disabled:opacity-50"
              >
                <FileText className="h-8 w-8 text-green-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Dashboard Completo</h4>
                <p className="text-sm text-gray-600">
                  Relatório executivo com todas as métricas
                </p>
              </button>

              <button
                onClick={handlePrint}
                disabled={loading}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left disabled:opacity-50"
              >
                <Printer className="h-8 w-8 text-purple-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Relatório Personalizado</h4>
                <p className="text-sm text-gray-600">
                  Configure e imprima relatório específico
                </p>
              </button>
            </div>
          </div>

          {/* Configurações Avançadas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configurações Avançadas
            </h3>
            
            {/* Tipo de Relatório */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Relatório
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTipoRelatorio("executivo")}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    tipoRelatorio === "executivo"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h4 className="font-semibold text-gray-900">Executivo</h4>
                  <p className="text-sm text-gray-600">Visão geral para gestão</p>
                </button>
                <button
                  onClick={() => setTipoRelatorio("detalhado")}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    tipoRelatorio === "detalhado"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h4 className="font-semibold text-gray-900">Detalhado</h4>
                  <p className="text-sm text-gray-600">Análise completa com dados</p>
                </button>
                <button
                  onClick={() => setTipoRelatorio("comparativo")}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    tipoRelatorio === "comparativo"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h4 className="font-semibold text-gray-900">Comparativo</h4>
                  <p className="text-sm text-gray-600">Análise comparativa</p>
                </button>
                <button
                  onClick={() => setTipoRelatorio("individual")}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    tipoRelatorio === "individual"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h4 className="font-semibold text-gray-900">Individual</h4>
                  <p className="text-sm text-gray-600">Ficha técnica detalhada</p>
                </button>
              </div>
            </div>

            {/* Configurações de Página */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orientação
                </label>
                <select
                  value={orientacao}
                  onChange={(e) => setOrientacao(e.target.value as "portrait" | "landscape")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="portrait">Retrato (A4)</option>
                  <option value="landscape">Paisagem (A4)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamanho do Papel
                </label>
                <select
                  value={tamanho}
                  onChange={(e) => setTamanho(e.target.value as "a4" | "a3" | "letter")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="a4">A4 (210 x 297 mm)</option>
                  <option value="a3">A3 (297 x 420 mm)</option>
                  <option value="letter">Letter (216 x 279 mm)</option>
                </select>
              </div>
            </div>

            {/* Opções de Conteúdo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conteúdo do Relatório
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={incluirKPIs}
                    onChange={(e) => setIncluirKPIs(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Incluir KPIs e Indicadores</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={incluirTabelas}
                    onChange={(e) => setIncluirTabelas(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Incluir Tabelas de Dados</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={incluirGraficos}
                    onChange={(e) => setIncluirGraficos(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Incluir Gráficos (se disponível)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Informações do Relatório */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Informações do Relatório</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Módulo:</span>
                <span className="ml-2 font-medium">{getModuloTitle(modulo)}</span>
              </div>
              <div>
                <span className="text-gray-600">Tipo:</span>
                <span className="ml-2 font-medium">{getTipoTitle(tipoRelatorio)}</span>
              </div>
              <div>
                <span className="text-gray-600">Registros:</span>
                <span className="ml-2 font-medium">{dados.length} itens</span>
              </div>
              <div>
                <span className="text-gray-600">Métricas:</span>
                <span className="ml-2 font-medium">{metricas ? 'Disponíveis' : 'Não disponíveis'}</span>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handlePrint}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Printer className="h-4 w-4" />
              )}
              <span>{loading ? "Gerando..." : "Imprimir Relatório"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
