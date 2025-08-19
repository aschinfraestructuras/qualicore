import { useState } from "react";
import { X, FileText, Filter, BarChart3, User, Download, Building } from "lucide-react";
import { Fornecedor } from "@/types";
import PDFService from "@/services/pdfService";
import toast from "react-hot-toast";

interface RelatorioFornecedoresPremiumProps {
  isOpen: boolean;
  onClose: () => void;
  fornecedores: Fornecedor[];
}

export default function RelatorioFornecedoresPremium({
  isOpen,
  onClose,
  fornecedores,
}: RelatorioFornecedoresPremiumProps) {
  const [tipoRelatorio, setTipoRelatorio] = useState<
    "executivo" | "individual" | "filtrado" | "comparativo"
  >("executivo");
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<string>("");
  const [filtros, setFiltros] = useState({
    search: "",
    estado: "",
    dataInicio: "",
    dataFim: "",
  });
  const [loading, setLoading] = useState(false);

  const handleGerarRelatorio = async () => {
    try {
      setLoading(true);

      let fornecedoresParaRelatorio = fornecedores;

      // Aplicar filtros se for relatório filtrado
      if (tipoRelatorio === "filtrado") {
        fornecedoresParaRelatorio = fornecedores.filter((fornecedor) => {
          const matchSearch =
            !filtros.search ||
            fornecedor.nome.toLowerCase().includes(filtros.search.toLowerCase()) ||
            fornecedor.nif.includes(filtros.search) ||
            fornecedor.email.toLowerCase().includes(filtros.search.toLowerCase());

          const matchEstado =
            !filtros.estado || fornecedor.estado === filtros.estado;

          const matchDataInicio =
            !filtros.dataInicio ||
            new Date(fornecedor.data_registo) >= new Date(filtros.dataInicio);

          const matchDataFim =
            !filtros.dataFim ||
            new Date(fornecedor.data_registo) <= new Date(filtros.dataFim);

          return matchSearch && matchEstado && matchDataInicio && matchDataFim;
        });
      }

      // Para relatório individual, filtrar pelo fornecedor selecionado
      if (tipoRelatorio === "individual") {
        if (!fornecedorSelecionado) {
          toast.error("Selecione um fornecedor para o relatório individual");
          return;
        }
        fornecedoresParaRelatorio = fornecedores.filter(
          (f) => f.id === fornecedorSelecionado
        );
      }

      if (fornecedoresParaRelatorio.length === 0) {
        toast.error("Nenhum fornecedor encontrado com os filtros aplicados");
        return;
      }

      // Gerar relatório baseado no tipo
      const pdfService = new PDFService();
      switch (tipoRelatorio) {
        case "executivo":
          await pdfService.generateFornecedoresExecutiveReport(
            fornecedoresParaRelatorio
          );
          break;
        case "individual":
          await pdfService.generateFornecedoresIndividualReport(
            fornecedoresParaRelatorio
          );
          break;
        case "filtrado":
          await pdfService.generateFornecedoresFilteredReport(
            fornecedoresParaRelatorio,
            filtros
          );
          break;
        case "comparativo":
          await pdfService.generateFornecedoresComparativeReport(
            fornecedoresParaRelatorio
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
      estado: "",
      dataInicio: "",
      dataFim: "",
    });
  };

  const getStats = () => {
    const total = fornecedores.length;
    const ativos = fornecedores.filter((f) => f.estado === "ativo").length;
    const inativos = fornecedores.filter((f) => f.estado === "inativo").length;
    const percentualAtivos = total > 0 ? Math.round((ativos / total) * 100) : 0;

    return { total, ativos, inativos, percentualAtivos };
  };

  const stats = getStats();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Relatórios de Fornecedores
              </h2>
              <p className="text-gray-600">
                Gere relatórios detalhados sobre fornecedores
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
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Ativos</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">Inativos</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.inativos}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">% Ativos</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {stats.percentualAtivos}%
              </p>
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
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
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
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-green-600" />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">
                      Relatório Individual
                    </h4>
                    <p className="text-sm text-gray-600">
                      Ficha técnica detalhada de um fornecedor
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setTipoRelatorio("filtrado")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  tipoRelatorio === "filtrado"
                    ? "border-blue-500 bg-blue-50"
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
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
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

          {/* Seleção de Fornecedor (apenas para relatório individual) */}
          {tipoRelatorio === "individual" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Selecionar Fornecedor
              </h3>
              <select
                value={fornecedorSelecionado}
                onChange={(e) => setFornecedorSelecionado(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione um fornecedor</option>
                {fornecedores.map((fornecedor) => (
                  <option key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome} - {fornecedor.nif}
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
                  className="text-sm text-blue-600 hover:text-blue-800"
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
                    placeholder="Nome, NIF ou email..."
                    value={filtros.search}
                    onChange={(e) =>
                      setFiltros({ ...filtros, search: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={filtros.estado}
                    onChange={(e) =>
                      setFiltros({ ...filtros, estado: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos os estados</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Registo (Início)
                  </label>
                  <input
                    type="date"
                    value={filtros.dataInicio}
                    onChange={(e) =>
                      setFiltros({ ...filtros, dataInicio: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Registo (Fim)
                  </label>
                  <input
                    type="date"
                    value={filtros.dataFim}
                    onChange={(e) =>
                      setFiltros({ ...filtros, dataFim: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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