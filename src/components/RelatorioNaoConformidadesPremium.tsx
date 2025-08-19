import { useState } from "react";
import { X, FileText, Filter, BarChart3, AlertTriangle, Download } from "lucide-react";
import { NaoConformidade } from "@/types";
import { PDFService } from "@/services/pdfService";
import toast from "react-hot-toast";

interface RelatorioNaoConformidadesPremiumProps {
  isOpen: boolean;
  onClose: () => void;
  naoConformidades: NaoConformidade[];
}

export default function RelatorioNaoConformidadesPremium({
  isOpen,
  onClose,
  naoConformidades,
}: RelatorioNaoConformidadesPremiumProps) {
  const [tipoRelatorio, setTipoRelatorio] = useState<
    "executivo" | "individual" | "filtrado" | "comparativo"
  >("executivo");
  const [ncSelecionada, setNcSelecionada] = useState<string>("");
  const [filtros, setFiltros] = useState({
    search: "",
    tipo: "",
    severidade: "",
    categoria: "",
    status: "",
    dataInicio: "",
    dataFim: "",
  });
  const [loading, setLoading] = useState(false);

  const handleGerarRelatorio = async () => {
    try {
      setLoading(true);

      let ncsParaRelatorio = naoConformidades;

      // Aplicar filtros se for relatório filtrado
      if (tipoRelatorio === "filtrado") {
        ncsParaRelatorio = naoConformidades.filter((nc) => {
          const matchSearch =
            !filtros.search ||
            nc.codigo.toLowerCase().includes(filtros.search.toLowerCase()) ||
            nc.descricao.toLowerCase().includes(filtros.search.toLowerCase()) ||
            nc.area_afetada.toLowerCase().includes(filtros.search.toLowerCase());

          const matchTipo = !filtros.tipo || nc.tipo === filtros.tipo;
          const matchSeveridade = !filtros.severidade || nc.severidade === filtros.severidade;
          const matchCategoria = !filtros.categoria || nc.categoria === filtros.categoria;

          const matchDataInicio =
            !filtros.dataInicio ||
            new Date(nc.data_deteccao) >= new Date(filtros.dataInicio);

          const matchDataFim =
            !filtros.dataFim ||
            new Date(nc.data_deteccao) <= new Date(filtros.dataFim);

          // Filtro por status
          let matchStatus = true;
          if (filtros.status) {
            if (filtros.status === "resolvida") {
              matchStatus = !!nc.data_resolucao;
            } else if (filtros.status === "pendente") {
              matchStatus = !nc.data_resolucao;
            } else if (filtros.status === "atrasada") {
              matchStatus = !nc.data_resolucao && nc.data_limite_resolucao && new Date(nc.data_limite_resolucao) < new Date();
            }
          }

          return matchSearch && matchTipo && matchSeveridade && matchCategoria && 
                 matchDataInicio && matchDataFim && matchStatus;
        });
      }

      // Para relatório individual, filtrar pela NC selecionada
      if (tipoRelatorio === "individual") {
        if (!ncSelecionada) {
          toast.error("Selecione uma não conformidade para o relatório individual");
          return;
        }
        ncsParaRelatorio = naoConformidades.filter(
          (nc) => nc.id === ncSelecionada
        );
      }

      if (ncsParaRelatorio.length === 0) {
        toast.error("Nenhuma não conformidade encontrada com os filtros aplicados");
        return;
      }

      // Gerar relatório baseado no tipo
      const pdfService = new PDFService();
      switch (tipoRelatorio) {
        case "executivo":
          await pdfService.generateNaoConformidadesExecutiveReport(
            ncsParaRelatorio
          );
          break;
        case "individual":
          await pdfService.generateNaoConformidadesIndividualReport(
            ncsParaRelatorio
          );
          break;
        case "filtrado":
          await pdfService.generateNaoConformidadesFilteredReport(
            ncsParaRelatorio,
            filtros
          );
          break;
        case "comparativo":
          await pdfService.generateNaoConformidadesComparativeReport(
            ncsParaRelatorio
          );
          break;
      }

      toast.success("Relatório gerado com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório");
    } finally {
      setLoading(false);
    }
  };

  const limparFiltros = () => {
    setFiltros({
      search: "",
      tipo: "",
      severidade: "",
      categoria: "",
      status: "",
      dataInicio: "",
      dataFim: "",
    });
  };

  const getStats = () => {
    const total = naoConformidades.length;
    const pendentes = naoConformidades.filter((nc) => !nc.data_resolucao).length;
    const resolvidas = naoConformidades.filter((nc) => nc.data_resolucao).length;
    const percentualResolucao = total > 0 ? Math.round((resolvidas / total) * 100) : 0;
    const criticas = naoConformidades.filter((nc) => nc.severidade === "critica").length;

    return { total, pendentes, resolvidas, percentualResolucao, criticas };
  };

  const stats = getStats();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Relatórios de Não Conformidades
              </h2>
              <p className="text-gray-600">
                Gere relatórios detalhados sobre não conformidades
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
          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">Total</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900">Pendentes</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Resolvidas</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.resolvidas}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">% Resolução</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {stats.percentualResolucao}%
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Críticas</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{stats.criticas}</p>
            </div>
          </div>

          {/* Seleção do Tipo de Relatório */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tipo de Relatório
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTipoRelatorio("executivo")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  tipoRelatorio === "executivo"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-red-600" />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">
                      Relatório Executivo
                    </h4>
                    <p className="text-sm text-gray-600">
                      Visão geral e indicadores de performance
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTipoRelatorio("individual")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  tipoRelatorio === "individual"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">
                      Relatório Individual
                    </h4>
                    <p className="text-sm text-gray-600">
                      Ficha técnica detalhada de uma NC
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTipoRelatorio("filtrado")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  tipoRelatorio === "filtrado"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Filter className="h-6 w-6 text-purple-600" />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">
                      Relatório Filtrado
                    </h4>
                    <p className="text-sm text-gray-600">
                      Análise com filtros personalizados
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTipoRelatorio("comparativo")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  tipoRelatorio === "comparativo"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-indigo-600" />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">
                      Relatório Comparativo
                    </h4>
                    <p className="text-sm text-gray-600">
                      Análise comparativa e benchmarks
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Seleção de NC (apenas para relatório individual) */}
          {tipoRelatorio === "individual" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Selecionar Não Conformidade
              </h3>
              <select
                value={ncSelecionada}
                onChange={(e) => setNcSelecionada(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Selecione uma não conformidade</option>
                {naoConformidades.map((nc) => (
                  <option key={nc.id} value={nc.id}>
                    {nc.codigo} - {nc.tipo} ({nc.severidade})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filtros (apenas para relatório filtrado) */}
          {tipoRelatorio === "filtrado" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <button
                  onClick={limparFiltros}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Limpar filtros
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesquisa
                  </label>
                  <input
                    type="text"
                    placeholder="Código, descrição ou área..."
                    value={filtros.search}
                    onChange={(e) =>
                      setFiltros({ ...filtros, search: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={filtros.tipo}
                    onChange={(e) =>
                      setFiltros({ ...filtros, tipo: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Todos os tipos</option>
                    <option value="material">Material</option>
                    <option value="execucao">Execução</option>
                    <option value="documentacao">Documentação</option>
                    <option value="seguranca">Segurança</option>
                    <option value="ambiente">Ambiente</option>
                    <option value="qualidade">Qualidade</option>
                    <option value="prazo">Prazo</option>
                    <option value="custo">Custo</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severidade
                  </label>
                  <select
                    value={filtros.severidade}
                    onChange={(e) =>
                      setFiltros({ ...filtros, severidade: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Todas as severidades</option>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={filtros.categoria}
                    onChange={(e) =>
                      setFiltros({ ...filtros, categoria: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Todas as categorias</option>
                    <option value="auditoria">Auditoria</option>
                    <option value="inspecao">Inspeção</option>
                    <option value="reclamacao">Reclamação</option>
                    <option value="acidente">Acidente</option>
                    <option value="incidente">Incidente</option>
                    <option value="desvio">Desvio</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filtros.status}
                    onChange={(e) =>
                      setFiltros({ ...filtros, status: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Todos os status</option>
                    <option value="pendente">Pendente</option>
                    <option value="resolvida">Resolvida</option>
                    <option value="atrasada">Atrasada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Detecção (Início)
                  </label>
                  <input
                    type="date"
                    value={filtros.dataInicio}
                    onChange={(e) =>
                      setFiltros({ ...filtros, dataInicio: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Detecção (Fim)
                  </label>
                  <input
                    type="date"
                    value={filtros.dataFim}
                    onChange={(e) =>
                      setFiltros({ ...filtros, dataFim: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botão Gerar Relatório */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleGerarRelatorio}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{loading ? "Gerando..." : "Gerar Relatório"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
