import {
  Ensaio,
  Documento,
  Checklist,
  Material,
  Fornecedor,
  NaoConformidade,
  Obra,
} from "@/types";
import { useState, useEffect } from "react";
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Package,
  Filter,
  RefreshCw,
  Printer,
  Share2,
  Eye,
  PieChart,
  Activity,
  Clock,
  Search,
  XCircle,
  ChevronDown,
  ChevronUp,
  Building,
  Zap,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  calcularMetricasReais,
  MetricasReais,
} from "@/services/metricsService";
import { printService } from "@/services/printService";
import UniversalPrintModal from "@/components/UniversalPrintModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface FiltrosRelatorio {
  periodo: "semana" | "mes" | "trimestre" | "ano" | "personalizado";
  dataInicio?: string;
  dataFim?: string;
  modulo:
    | "todos"
    | "ensaios"
    | "checklists"
    | "materiais"
    | "ncs"
    | "documentos";
  zona?: string;
  responsavel?: string;
  status?: string;
}

export default function Relatorios() {
  const [metricas, setMetricas] = useState<MetricasReais | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    periodo: "mes",
    modulo: "todos",
  });
  const [relatorioAtivo, setRelatorioAtivo] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printModulo, setPrintModulo] = useState<string>("geral");
  const navigate = useNavigate();

  useEffect(() => {
    carregarMetricas();
  }, []);

  const carregarMetricas = async () => {
    try {
      setLoading(true);
      const dados = await calcularMetricasReais();
      setMetricas(dados);
    } catch (error) {
      console.error("Erro ao carregar métricas:", error);
      toast.error("Erro ao carregar dados para relatórios");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    carregarMetricas();
    toast.success("Dados atualizados");
  };

  const handleExportRelatorio = (tipo: string) => {
    const data = {
      tipo,
      filtros,
      metricas,
      dataExportacao: new Date().toISOString(),
      periodo: filtros.periodo,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-${tipo}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Relatório ${tipo} exportado com sucesso!`);
  };

  const handleExportPDF = async (tipo: string) => {
    try {
      setLoading(true);
      
      // Configurar dados para o relatório executivo
      const dadosRelatorio = {
        tipo: 'executivo',
        modulo: tipo,
        metricas: metricas,
        filtros: filtros,
        periodo: filtros.periodo,
        dataGeracao: new Date().toISOString()
      };

      // Usar o sistema universal de impressão
      await printService.printRelatorio({
        titulo: `Relatório Executivo - ${getModuloTitle(tipo)}`,
        subtitulo: `Dashboard Executivo - ${new Date().toLocaleDateString('pt-PT')}`,
        tipo: 'executivo',
        modulo: tipo as any,
        dados: [], // Dados específicos podem ser carregados se necessário
        metricas: metricas,
        filtros: filtros,
        orientacao: 'portrait',
        tamanho: 'a4',
        incluirKPIs: true,
        incluirTabelas: false, // Relatório executivo foca em KPIs
        incluirGraficos: true
      });

      toast.success(`Relatório Executivo ${getModuloTitle(tipo)} exportado com sucesso!`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      toast.error('Erro ao gerar relatório PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = (tipo: string) => {
    // Simular exportação Excel
    const csvContent = `Tipo,Valor,Data\n${tipo},${metricas?.geral.conformidade_geral}%,${new Date().toISOString()}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-${tipo}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Relatório ${tipo} em Excel exportado com sucesso!`);
  };

  const handlePrintRelatorio = async (tipo: string) => {
    try {
      setLoading(true);
      
      // Usar o sistema universal de impressão
      await printService.printRelatorio({
        titulo: `Relatório Executivo - ${getModuloTitle(tipo)}`,
        subtitulo: `Dashboard Executivo - ${new Date().toLocaleDateString('pt-PT')}`,
        tipo: 'executivo',
        modulo: tipo as any,
        dados: [], // Dados específicos podem ser carregados se necessário
        metricas: metricas,
        filtros: filtros,
        orientacao: 'portrait',
        tamanho: 'a4',
        incluirKPIs: true,
        incluirTabelas: false, // Relatório executivo foca em KPIs
        incluirGraficos: true
      });

      toast.success(`Relatório Executivo ${getModuloTitle(tipo)} enviado para impressão!`);
    } catch (error) {
      console.error('Erro ao imprimir relatório:', error);
      toast.error('Erro ao gerar relatório para impressão');
    } finally {
      setLoading(false);
    }
  };

  const handleShareRelatorio = (tipo: string) => {
    if (navigator.share) {
      navigator
        .share({
          title: `Relatório ${tipo}`,
          text: `Relatório de qualidade - ${tipo}`,
          url: window.location.href,
        })
        .then(() => {
          toast.success("Relatório partilhado com sucesso!");
        })
        .catch(() => {
          toast.error("Erro ao partilhar relatório");
        });
    } else {
      // Fallback para copiar link
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast.success(
          "Link do relatório copiado para a área de transferência!",
        );
      });
    }
  };

  const handleClearFilters = () => {
    setFiltros({
      periodo: "mes",
      modulo: "todos",
    });
    setSearchTerm("");
    toast.success("Filtros limpos");
  };

  const handleApplyFilters = () => {
    carregarMetricas();
    setShowFilters(false);
    toast.success("Filtros aplicados");
  };

  const handleViewRelatorio = (tipo: string) => {
    setRelatorioAtivo(relatorioAtivo === tipo ? null : tipo);
    toast.success(`Visualizando relatório ${tipo}`);
  };

  const handleVerDetalhes = (modulo: string) => {
    // Navegar para módulos específicos
    console.log(`Navegando para módulo: ${modulo}`);
    switch (modulo) {
      case "ensaios":
        navigate("/ensaios");
        break;
      case "checklists":
        navigate("/checklists");
        break;
      case "materiais":
        navigate("/materiais");
        break;
      case "fornecedores":
        navigate("/fornecedores");
        break;
      case "nao-conformidades":
        navigate("/nao-conformidades");
        break;
      case "documentos":
        navigate("/documentos");
        break;
      case "obras":
        navigate("/obras");
        break;
      case "relatorios":
        navigate("/relatorios");
        break;
      case "controlo-betonagens":
        navigate("/controlo-betonagens");
        break;
      case "caracterizacao-solos":
        navigate("/caracterizacao-solos");
        break;
      case "via-ferrea":
        navigate("/via-ferrea");
        break;
      case "pontes-tuneis":
        navigate("/pontes-tuneis");
        break;
      case "sinalizacao":
        navigate("/sinalizacao");
        break;
      case "eletrificacao":
        navigate("/eletrificacao");
        break;
      default:
        console.log(`Módulo ${modulo} não mapeado`);
    }
  };

  // Função auxiliar para obter título do módulo
  const getModuloTitle = (modulo: string): string => {
    const titles: Record<string, string> = {
      'geral': 'Geral',
      'executivo': 'Executivo',
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

  // Função para gerar dashboard executivo geral
  const handleDashboardGeral = async () => {
    try {
      setLoading(true);
      
      // Usar o sistema universal para dashboard geral
      await printService.printDashboard(metricas);

      toast.success('Dashboard Executivo Geral enviado para impressão!');
    } catch (error) {
      console.error('Erro ao gerar dashboard geral:', error);
      toast.error('Erro ao gerar dashboard executivo');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!metricas) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Erro ao carregar dados para relatórios</p>
        <button onClick={carregarMetricas} className="btn btn-primary mt-4">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pt-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">
            Relatórios de Qualidade
          </h1>
          <p className="text-gray-600 mt-2">
            Análises detalhadas e relatórios baseados em dados reais
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Barra de Pesquisa */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar relatórios..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg shadow-soft hover:shadow-md transition-all ${
              showFilters
                ? "bg-primary-100 text-primary-600"
                : "bg-white text-gray-600"
            }`}
            title="Filtros"
          >
            <Filter className="h-5 w-5" />
          </button>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-white shadow-soft hover:shadow-md transition-all"
            title="Atualizar dados"
          >
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>

          <button
            onClick={handleDashboardGeral}
            className="p-2 rounded-lg bg-white shadow-soft hover:shadow-md transition-all"
            title="Dashboard Executivo Geral"
          >
            <Printer className="h-5 w-5 text-gray-600" />
          </button>

          <div className="flex items-center space-x-2 bg-white rounded-xl p-1 shadow-soft">
            <Calendar className="h-4 w-4 text-gray-500 ml-2" />
            <select
              value={filtros.periodo}
              onChange={(e) =>
                setFiltros((prev) => ({
                  ...prev,
                  periodo: e.target.value as any,
                }))
              }
              className="px-3 py-2 text-sm border-0 bg-transparent focus:outline-none"
            >
              <option value="semana">Última Semana</option>
              <option value="mes">Último Mês</option>
              <option value="trimestre">Último Trimestre</option>
              <option value="ano">Último Ano</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Filtros Avançados */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="card"
          >
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="card-title">Filtros Avançados</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Módulo
                  </label>
                  <select
                    value={filtros.modulo}
                    onChange={(e) =>
                      setFiltros({ ...filtros, modulo: e.target.value as any })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="todos">Todos os módulos</option>
                    <option value="ensaios">Ensaios</option>
                    <option value="checklists">Checklists</option>
                    <option value="materiais">Materiais</option>
                    <option value="ncs">Não Conformidades</option>
                    <option value="documentos">Documentos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona/Projeto
                  </label>
                  <input
                    type="text"
                    value={filtros.zona || ""}
                    onChange={(e) =>
                      setFiltros({ ...filtros, zona: e.target.value })
                    }
                    placeholder="Filtrar por zona..."
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={filtros.responsavel || ""}
                    onChange={(e) =>
                      setFiltros({ ...filtros, responsavel: e.target.value })
                    }
                    placeholder="Filtrar por responsável..."
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filtros.status || ""}
                    onChange={(e) =>
                      setFiltros({ ...filtros, status: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Todos os status</option>
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluido">Concluído</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                {filtros.periodo === "personalizado" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Início
                      </label>
                      <input
                        type="date"
                        value={filtros.dataInicio || ""}
                        onChange={(e) =>
                          setFiltros({ ...filtros, dataInicio: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Fim
                      </label>
                      <input
                        type="date"
                        value={filtros.dataFim || ""}
                        onChange={(e) =>
                          setFiltros({ ...filtros, dataFim: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </>
                )}

                <div className="flex items-end space-x-2">
                  <button
                    onClick={handleApplyFilters}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    Aplicar Filtros
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="btn btn-secondary btn-sm"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPIs Resumo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
      >
        <div
          className="card card-hover cursor-pointer"
          onClick={() => handleViewRelatorio("conformidade")}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Conformidade
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {metricas.geral.conformidade_geral}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div
          className="card card-hover cursor-pointer"
          onClick={() => handleViewRelatorio("ensaios")}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ensaios</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {metricas.ensaios.taxa_conformidade}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
        </div>

        <div
          className="card card-hover cursor-pointer"
          onClick={() => handleViewRelatorio("checklists")}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checklists</p>
                <p className="text-2xl font-bold text-purple-600">
                  {metricas.checklists.conformidade_media}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div
          className="card card-hover cursor-pointer"
          onClick={() => handleViewRelatorio("materiais")}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Materiais</p>
                <p className="text-2xl font-bold text-orange-600">
                  {metricas.materiais.taxa_aprovacao}%
                </p>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div
          className="card card-hover cursor-pointer"
          onClick={() => handleViewRelatorio("ncs")}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  NCs Resolvidas
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {metricas.naoConformidades.taxa_resolucao}%
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        <div
          className="card card-hover cursor-pointer"
          onClick={() => handleViewRelatorio("geral")}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reg.</p>
                <p className="text-2xl font-bold text-blue-600">
                  {metricas.geral.total_registros}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div
          className="card card-hover cursor-pointer"
          onClick={() => handleViewRelatorio("controlo-betonagens")}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Betonagens</p>
                <p className="text-2xl font-bold text-red-600">
                  {metricas.betonagens?.total_betonagens || 0}
                </p>
              </div>
              <Building className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        <div
          className="card card-hover cursor-pointer"
          onClick={() => handleViewRelatorio("caracterizacao-solos")}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Caracterização Solos</p>
                <p className="text-2xl font-bold text-green-600">
                  {metricas.solos?.total_solos || 0}
                </p>
              </div>
              <Layers className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        <div
          className="card card-hover cursor-pointer"
          onClick={() => handleViewRelatorio("via-ferrea")}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Via Férrea</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {metricas.ferroviario?.via_ferrea?.total_trilhos || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-cyan-500" />
            </div>
          </div>
        </div>

        <div
          className="card card-hover cursor-pointer"
          onClick={() => handleViewRelatorio("pontes-tuneis")}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pontes & Túneis</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {metricas.ferroviario?.pontes_tuneis?.total_pontes_tuneis || 0}
                </p>
              </div>
              <Building className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
        </div>

        <div
          className="card card-hover cursor-pointer"
          onClick={() => handleViewRelatorio("sinalizacao")}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sinalização</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {metricas.ferroviario?.sinalizacao?.total_sinalizacoes || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        <div
          className="card card-hover cursor-pointer"
          onClick={() => handleViewRelatorio("eletrificacao")}
        >
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Eletrificação</p>
                <p className="text-2xl font-bold text-amber-600">
                  {metricas.ferroviario?.eletrificacao?.total_eletrificacoes || 0}
                </p>
              </div>
              <Zap className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tipos de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Relatório Executivo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card card-hover"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">Relatório Executivo Geral</h3>
                <p className="card-description">Dashboard executivo para gestão</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Conformidade Geral
                </span>
                <span className="font-medium text-green-600">
                  {metricas.geral.conformidade_geral}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Alertas Críticos</span>
                <span className="font-medium text-red-600">
                  {metricas.geral.alertas_criticos}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total de Registos</span>
                <span className="font-medium text-blue-600">
                  {metricas.geral.total_registros}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tendência</span>
                <span className="font-medium text-emerald-600 capitalize">
                  {metricas.geral.tendencia_qualidade}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleViewRelatorio("executivo")}
                className="btn btn-outline btn-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExportPDF("executivo")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Exportar PDF"
                >
                  <FileText className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleExportExcel("executivo")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Exportar Excel"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePrintRelatorio("executivo")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Imprimir"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShareRelatorio("executivo")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Partilhar"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Relatório de Ensaios */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card card-hover"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">Relatório Executivo - Ensaios</h3>
                <p className="card-description">
                  Dashboard executivo de conformidade
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </div>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taxa Conformidade</span>
                <span className="font-medium text-emerald-600">
                  {metricas.ensaios.taxa_conformidade}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Ensaios</span>
                <span className="font-medium text-blue-600">
                  {metricas.ensaios.total_ensaios}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Não Conformes</span>
                <span className="font-medium text-red-600">
                  {metricas.ensaios.ensaios_nao_conformes}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Por Mês</span>
                <span className="font-medium text-purple-600">
                  {metricas.ensaios.ensaios_por_mes}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleViewRelatorio("ensaios")}
                className="btn btn-outline btn-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExportPDF("ensaios")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Exportar PDF"
                >
                  <FileText className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleExportExcel("ensaios")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Exportar Excel"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePrintRelatorio("ensaios")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Imprimir"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShareRelatorio("ensaios")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Partilhar"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Relatório de Checklists */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card card-hover"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">Relatório Executivo - Checklists</h3>
                <p className="card-description">Dashboard executivo de inspeções</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Conformidade Média
                </span>
                <span className="font-medium text-purple-600">
                  {metricas.checklists.conformidade_media}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Checklists</span>
                <span className="font-medium text-blue-600">
                  {metricas.checklists.total_checklists}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Concluídos</span>
                <span className="font-medium text-green-600">
                  {metricas.checklists.checklists_concluidos}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pendentes</span>
                <span className="font-medium text-yellow-600">
                  {metricas.checklists.checklists_pendentes}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleViewRelatorio("checklists")}
                className="btn btn-outline btn-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExportPDF("checklists")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Exportar PDF"
                >
                  <FileText className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleExportExcel("checklists")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Exportar Excel"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePrintRelatorio("checklists")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Imprimir"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShareRelatorio("checklists")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Partilhar"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Relatório de Materiais */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card card-hover"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">Relatório Executivo - Materiais</h3>
                <p className="card-description">
                  Dashboard executivo de controlo
                </p>
              </div>
              <Package className="h-8 w-8 text-orange-500" />
            </div>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taxa Aprovação</span>
                <span className="font-medium text-orange-600">
                  {metricas.materiais.taxa_aprovacao}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Materiais</span>
                <span className="font-medium text-blue-600">
                  {metricas.materiais.total_materiais}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Aprovados</span>
                <span className="font-medium text-green-600">
                  {metricas.materiais.materiais_aprovados}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pendentes</span>
                <span className="font-medium text-yellow-600">
                  {metricas.materiais.materiais_pendentes}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleViewRelatorio("materiais")}
                className="btn btn-outline btn-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExportPDF("materiais")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Exportar PDF"
                >
                  <FileText className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleExportExcel("materiais")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Exportar Excel"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePrintRelatorio("materiais")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Imprimir"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShareRelatorio("materiais")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Partilhar"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Relatório de Não Conformidades */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card card-hover"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">Relatório Executivo - NCs</h3>
                <p className="card-description">
                  Gestão de problemas e resoluções
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taxa Resolução</span>
                <span className="font-medium text-red-600">
                  {metricas.naoConformidades.taxa_resolucao}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total NCs</span>
                <span className="font-medium text-blue-600">
                  {metricas.naoConformidades.total_ncs}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resolvidas</span>
                <span className="font-medium text-green-600">
                  {metricas.naoConformidades.ncs_resolvidas}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pendentes</span>
                <span className="font-medium text-yellow-600">
                  {metricas.naoConformidades.ncs_pendentes}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleViewRelatorio("ncs")}
                className="btn btn-outline btn-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExportPDF("ncs")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Exportar PDF"
                >
                  <FileText className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleExportExcel("ncs")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Exportar Excel"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePrintRelatorio("ncs")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Imprimir"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShareRelatorio("ncs")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Partilhar"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Relatório de Documentos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="card card-hover"
        >
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">Relatório Executivo - Documentos</h3>
                <p className="card-description">Dashboard executivo documental</p>
              </div>
              <FileText className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Documentos</span>
                <span className="font-medium text-indigo-600">
                  {metricas.documentos.total_documentos}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Aprovados</span>
                <span className="font-medium text-green-600">
                  {metricas.documentos.documentos_aprovados}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Vencidos</span>
                <span className="font-medium text-red-600">
                  {metricas.documentos.documentos_vencidos}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pendentes</span>
                <span className="font-medium text-yellow-600">
                  {metricas.documentos.documentos_pendentes}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleViewRelatorio("documentos")}
                className="btn btn-outline btn-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalhes
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExportPDF("documentos")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Exportar PDF"
                >
                  <FileText className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleExportExcel("documentos")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Exportar Excel"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePrintRelatorio("documentos")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Imprimir"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShareRelatorio("documentos")}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Partilhar"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Relatório Detalhado Ativo */}
      <AnimatePresence>
        {relatorioAtivo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
          >
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="card-title">
                  Relatório Detalhado -{" "}
                  {relatorioAtivo.charAt(0).toUpperCase() +
                    relatorioAtivo.slice(1)}
                </h3>
                <button
                  onClick={() => setRelatorioAtivo(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatorioAtivo === "executivo" && (
                  <>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {metricas.geral.conformidade_geral}%
                      </div>
                      <div className="text-sm text-blue-700">
                        Conformidade Geral
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {metricas.geral.total_registros}
                      </div>
                      <div className="text-sm text-green-700">
                        Total Registos
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {metricas.geral.alertas_criticos}
                      </div>
                      <div className="text-sm text-red-700">
                        Alertas Críticos
                      </div>
                    </div>
                  </>
                )}

                {relatorioAtivo === "ensaios" && (
                  <>
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">
                        {metricas.ensaios.taxa_conformidade}%
                      </div>
                      <div className="text-sm text-emerald-700">
                        Taxa Conformidade
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {metricas.ensaios.total_ensaios}
                      </div>
                      <div className="text-sm text-blue-700">Total Ensaios</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {metricas.ensaios.ensaios_nao_conformes}
                      </div>
                      <div className="text-sm text-red-700">Não Conformes</div>
                    </div>
                  </>
                )}

                {relatorioAtivo === "checklists" && (
                  <>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-1">
                        {metricas.checklists.conformidade_media}%
                      </div>
                      <div className="text-sm text-purple-700">
                        Conformidade Média
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {metricas.checklists.checklists_concluidos}
                      </div>
                      <div className="text-sm text-green-700">Concluídos</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {metricas.checklists.checklists_pendentes}
                      </div>
                      <div className="text-sm text-yellow-700">Pendentes</div>
                    </div>
                  </>
                )}

                {relatorioAtivo === "materiais" && (
                  <>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        {metricas.materiais.taxa_aprovacao}%
                      </div>
                      <div className="text-sm text-orange-700">
                        Taxa Aprovação
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {metricas.materiais.materiais_aprovados}
                      </div>
                      <div className="text-sm text-green-700">Aprovados</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {metricas.materiais.materiais_pendentes}
                      </div>
                      <div className="text-sm text-yellow-700">Pendentes</div>
                    </div>
                  </>
                )}

                {relatorioAtivo === "ncs" && (
                  <>
                    <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {metricas.naoConformidades.taxa_resolucao}%
                      </div>
                      <div className="text-sm text-red-700">Taxa Resolução</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {metricas.naoConformidades.ncs_resolvidas}
                      </div>
                      <div className="text-sm text-green-700">Resolvidas</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {metricas.naoConformidades.ncs_pendentes}
                      </div>
                      <div className="text-sm text-yellow-700">Pendentes</div>
                    </div>
                  </>
                )}

                {relatorioAtivo === "documentos" && (
                  <>
                    <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600 mb-1">
                        {metricas.documentos.total_documentos}
                      </div>
                      <div className="text-sm text-indigo-700">
                        Total Documentos
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {metricas.documentos.documentos_aprovados}
                      </div>
                      <div className="text-sm text-green-700">Aprovados</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {metricas.documentos.documentos_vencidos}
                      </div>
                      <div className="text-sm text-red-700">Vencidos</div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Relatório gerado em {new Date().toLocaleString("pt-PT")}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleExportPDF(relatorioAtivo)}
                      className="btn btn-outline btn-sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleExportExcel(relatorioAtivo)}
                      className="btn btn-outline btn-sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </button>
                    <button
                      onClick={() => handlePrintRelatorio(relatorioAtivo)}
                      className="btn btn-outline btn-sm"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Imprimir
                    </button>
                    <button
                      onClick={() => handleShareRelatorio(relatorioAtivo)}
                      className="btn btn-outline btn-sm"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Partilhar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Impressão Universal */}
      <UniversalPrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        modulo={printModulo}
        dados={[]} // Dados específicos podem ser passados aqui
        metricas={metricas}
        titulo={`Relatório de ${printModulo.charAt(0).toUpperCase() + printModulo.slice(1)}`}
        subtitulo={`Sistema de Gestão da Qualidade - ${new Date().toLocaleDateString('pt-PT')}`}
      />
    </div>
  );
}
