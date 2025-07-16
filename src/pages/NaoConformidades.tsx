import { useState, useEffect } from "react";
import { NaoConformidade, naoConformidadesAPI } from "@/lib/supabase-api";
import NaoConformidadeForm from "@/components/forms/NaoConformidadeForm";
import RelatorioNaoConformidadesPremium from "@/components/RelatorioNaoConformidadesPremium";
import toast from "react-hot-toast";
import { sanitizeUUIDField } from "@/utils/uuid";
import { Plus, Search, Filter, FileText, XCircle, Download } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function NaoConformidades() {
  const [naoConformidades, setNaoConformidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNC, setEditingNC] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterSeveridade, setFilterSeveridade] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterResponsavel, setFilterResponsavel] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDataDeteccao, setFilterDataDeteccao] = useState("");
  const [filterDataResolucao, setFilterDataResolucao] = useState("");
  const [filterAreaAfetada, setFilterAreaAfetada] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);
  const [ncSelecionada, setNcSelecionada] = useState<string>("");
  const [tipoRelatorio, setTipoRelatorio] = useState<"executivo" | "individual" | "filtrado" | "comparativo">("executivo");

  useEffect(() => {
    loadNaoConformidades();
  }, []);

  const loadNaoConformidades = async () => {
    try {
      setLoading(true);
      const data = await naoConformidadesAPI.getAll();
      setNaoConformidades(data as any[]);
    } catch (error) {
      console.error("Erro ao carregar não conformidades:", error);
      toast.error("Erro ao carregar não conformidades");
    } finally {
      setLoading(false);
    }
  };

  // KPIs - usando data_resolucao para determinar status
  const total = naoConformidades.length;
  const pendentes = naoConformidades.filter((nc) => !nc.data_resolucao).length;
  const resolvidas = naoConformidades.filter((nc) => nc.data_resolucao).length;
  const criticas = naoConformidades.filter(
    (nc) => nc.severidade === "critica",
  ).length;

  const handleCreateNC = () => {
    setEditingNC(null);
    setShowForm(true);
  };

  const handleCreateAuditoria = () => {
    toast.success("Funcionalidade de auditoria será implementada em breve!");
    // TODO: Implementar modal/formulário de auditoria
  };

  const handleRelatorios = () => {
    setShowRelatorioModal(true);
  };

  const handleSubmitNC = async (data: any) => {
    try {
      console.log("Dados recebidos do formulário NC:", data);

      // Filtrar apenas os campos válidos do schema Supabase e sanitizar UUIDs
      const validNCData = {
        codigo: data.codigo,
        tipo: data.tipo,
        tipo_outro: data.tipo_outro,
        severidade: data.severidade,
        categoria: data.categoria,
        categoria_outro: data.categoria_outro,
        data_deteccao: data.data_deteccao,
        data_resolucao: data.data_resolucao,
        data_limite_resolucao: data.data_limite_resolucao,
        data_verificacao_eficacia: data.data_verificacao_eficacia,
        descricao: data.descricao,
        causa_raiz: data.causa_raiz,
        impacto: data.impacto,
        area_afetada: data.area_afetada,
        responsavel_deteccao: data.responsavel_deteccao,
        responsavel_resolucao: data.responsavel_resolucao,
        responsavel_verificacao: data.responsavel_verificacao,
        acao_corretiva: data.acao_corretiva,
        acao_preventiva: data.acao_preventiva,
        medidas_implementadas: data.medidas_implementadas || [],
        custo_estimado: data.custo_estimado,
        custo_real: data.custo_real,
        custo_preventivo: data.custo_preventivo,
        observacoes: data.observacoes,
        relacionado_obra_id: sanitizeUUIDField(data.relacionado_obra_id),
        relacionado_obra_outro: data.relacionado_obra_outro,
        relacionado_zona_id: sanitizeUUIDField(data.relacionado_zona_id),
        relacionado_zona_outro: data.relacionado_zona_outro,
        relacionado_ensaio_id: sanitizeUUIDField(data.relacionado_ensaio_id),
        relacionado_ensaio_outro: data.relacionado_ensaio_outro,
        relacionado_material_id: sanitizeUUIDField(
          data.relacionado_material_id,
        ),
        relacionado_material_outro: data.relacionado_material_outro,
        relacionado_checklist_id: sanitizeUUIDField(
          data.relacionado_checklist_id,
        ),
        relacionado_checklist_outro: data.relacionado_checklist_outro,
        relacionado_documento_id: sanitizeUUIDField(
          data.relacionado_documento_id,
        ),
        relacionado_fornecedor_id: sanitizeUUIDField(
          data.relacionado_fornecedor_id,
        ),
        relacionado_fornecedor_outro: data.relacionado_fornecedor_outro,
        auditoria_id: sanitizeUUIDField(data.auditoria_id),
        auditoria_outro: data.auditoria_outro,
      };

      console.log("Dados corrigidos para envio:", validNCData);

      if (editingNC) {
        await naoConformidadesAPI.update(editingNC.id, validNCData);
        toast.success("Não conformidade atualizada com sucesso!");
      } else {
        await naoConformidadesAPI.create(validNCData);
        toast.success("Não conformidade criada com sucesso!");
      }
      await loadNaoConformidades();
      setShowForm(false);
    } catch (error) {
      console.error("Erro detalhado ao salvar NC:", error);
      toast.error("Erro ao salvar não conformidade");
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingNC(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja eliminar esta não conformidade?")) {
      try {
        await naoConformidadesAPI.delete(id);
        toast.success("Não conformidade eliminada com sucesso!");
        await loadNaoConformidades();
      } catch (error) {
        toast.error("Erro ao eliminar não conformidade");
        console.error(error);
      }
    }
  };

  const filteredNCs = naoConformidades.filter((nc) => {
    const matchSearch =
      !searchTerm ||
      nc.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nc.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nc.area_afetada.toLowerCase().includes(searchTerm.toLowerCase());

    const matchTipo = !filterTipo || nc.tipo === filterTipo;
    const matchSeveridade = !filterSeveridade || nc.severidade === filterSeveridade;
    const matchCategoria = !filterCategoria || nc.categoria === filterCategoria;
    const matchResponsavel = !filterResponsavel || 
      nc.responsavel_deteccao?.toLowerCase().includes(filterResponsavel.toLowerCase()) ||
      nc.responsavel_resolucao?.toLowerCase().includes(filterResponsavel.toLowerCase());
    const matchAreaAfetada = !filterAreaAfetada || nc.area_afetada?.toLowerCase().includes(filterAreaAfetada.toLowerCase());
    const matchDataDeteccao = !filterDataDeteccao || nc.data_deteccao?.includes(filterDataDeteccao);
    const matchDataResolucao = !filterDataResolucao || nc.data_resolucao?.includes(filterDataResolucao);

    // Filtro por status
    let matchStatus = true;
    if (filterStatus) {
      if (filterStatus === "resolvida") {
        matchStatus = !!nc.data_resolucao;
      } else if (filterStatus === "pendente") {
        matchStatus = !nc.data_resolucao;
      } else if (filterStatus === "atrasada") {
        matchStatus = !nc.data_resolucao && nc.data_limite_resolucao && new Date(nc.data_limite_resolucao) < new Date();
      }
    }

    return matchSearch && matchTipo && matchSeveridade && matchCategoria && 
           matchResponsavel && matchAreaAfetada && matchDataDeteccao && matchDataResolucao && matchStatus;
  });

  // Obter valores únicos para os filtros
  const tiposUnicos = [...new Set(naoConformidades.map(nc => nc.tipo).filter(Boolean))];
  const categoriasUnicas = [...new Set(naoConformidades.map(nc => nc.categoria).filter(Boolean))];
  const responsaveisUnicos = [...new Set([
    ...naoConformidades.map(nc => nc.responsavel_deteccao).filter(Boolean),
    ...naoConformidades.map(nc => nc.responsavel_resolucao).filter(Boolean)
  ])];
  const areasUnicas = [...new Set(naoConformidades.map(nc => nc.area_afetada).filter(Boolean))];

  const clearFilters = () => {
    setSearchTerm("");
    setFilterTipo("");
    setFilterSeveridade("");
    setFilterCategoria("");
    setFilterResponsavel("");
    setFilterStatus("");
    setFilterDataDeteccao("");
    setFilterDataResolucao("");
    setFilterAreaAfetada("");
  };

  const getStatusColor = (nc: any) => {
    if (nc.data_resolucao) return "bg-green-100 text-green-800";
    if (
      nc.data_limite_resolucao &&
      new Date(nc.data_limite_resolucao) < new Date()
    )
      return "bg-red-100 text-red-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getStatusText = (nc: any) => {
    if (nc.data_resolucao) return "Resolvida";
    if (
      nc.data_limite_resolucao &&
      new Date(nc.data_limite_resolucao) < new Date()
    )
      return "Atrasada";
    return "Pendente";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER E AÇÕES RÁPIDAS */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Não Conformidades</h1>
            <p className="text-gray-500">
              Gestão integrada de NCs, auditorias e medidas corretivas
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCreateNC}
              className="btn btn-primary btn-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova NC
            </button>
            <button
              onClick={handleCreateAuditoria}
              className="btn btn-secondary btn-md"
            >
              <FileText className="h-4 w-4 mr-2" />
              Auditoria
            </button>
            <button
              onClick={handleRelatorios}
              className="btn btn-outline btn-md"
            >
              <Download className="h-4 w-4 mr-2" />
              Relatórios
            </button>
          </div>
        </div>

        {/* Botão de Filtros */}
        <div className="flex items-center space-x-4 mb-4">
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
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card">
            <div className="card-content">
              <p className="text-sm">Total</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <p className="text-sm">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{pendentes}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <p className="text-sm">Resolvidas</p>
              <p className="text-2xl font-bold text-green-600">{resolvidas}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-content">
              <p className="text-sm">Críticas</p>
              <p className="text-2xl font-bold text-red-600">{criticas}</p>
            </div>
          </div>
        </div>

        {/* Filtros Ativos */}
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
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <h3 className="card-title">Filtros</h3>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="card-content">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Pesquisa */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Pesquisar não conformidades..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-10 w-full"
                    />
                  </div>

                  {/* Tipo */}
                  <select
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value)}
                    className="input"
                  >
                    <option value="">Todos os tipos</option>
                    {tiposUnicos.map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>

                  {/* Severidade */}
                  <select
                    value={filterSeveridade}
                    onChange={(e) => setFilterSeveridade(e.target.value)}
                    className="input"
                  >
                    <option value="">Todas as severidades</option>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>

                  {/* Categoria */}
                  <select
                    value={filterCategoria}
                    onChange={(e) => setFilterCategoria(e.target.value)}
                    className="input"
                  >
                    <option value="">Todas as categorias</option>
                    {categoriasUnicas.map((categoria) => (
                      <option key={categoria} value={categoria}>{categoria}</option>
                    ))}
                  </select>

                  {/* Status */}
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="input"
                  >
                    <option value="">Todos os status</option>
                    <option value="pendente">Pendente</option>
                    <option value="resolvida">Resolvida</option>
                    <option value="atrasada">Atrasada</option>
                  </select>

                  {/* Responsável */}
                  <select
                    value={filterResponsavel}
                    onChange={(e) => setFilterResponsavel(e.target.value)}
                    className="input"
                  >
                    <option value="">Todos os responsáveis</option>
                    {responsaveisUnicos.map((responsavel) => (
                      <option key={responsavel} value={responsavel}>{responsavel}</option>
                    ))}
                  </select>

                  {/* Área Afetada */}
                  <select
                    value={filterAreaAfetada}
                    onChange={(e) => setFilterAreaAfetada(e.target.value)}
                    className="input"
                  >
                    <option value="">Todas as áreas</option>
                    {areasUnicas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>

                  {/* Data Detecção */}
                  <input
                    type="date"
                    value={filterDataDeteccao}
                    onChange={(e) => setFilterDataDeteccao(e.target.value)}
                    className="input"
                    placeholder="Data de detecção"
                  />

                  {/* Data Resolução */}
                  <input
                    type="date"
                    value={filterDataResolucao}
                    onChange={(e) => setFilterDataResolucao(e.target.value)}
                    className="input"
                    placeholder="Data de resolução"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LISTA DE NCs */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Lista de Não Conformidades
            </h2>

            {filteredNCs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Nenhuma não conformidade encontrada
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNCs.map((nc) => (
                  <div
                    key={nc.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{nc.codigo}</h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              nc.severidade === "critica"
                                ? "bg-red-100 text-red-800"
                                : nc.severidade === "alta"
                                  ? "bg-orange-100 text-orange-800"
                                  : nc.severidade === "media"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                          >
                            {nc.severidade}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${getStatusColor(nc)}`}
                          >
                            {getStatusText(nc)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{nc.descricao}</p>
                        <div className="text-sm text-gray-500">
                          <span>Área: {nc.area_afetada}</span>
                          <span className="mx-2">•</span>
                          <span>
                            Detectada:{" "}
                            {new Date(nc.data_deteccao).toLocaleDateString()}
                          </span>
                          <span className="mx-2">•</span>
                          <span>Responsável: {nc.responsavel_deteccao}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setNcSelecionada(nc.id);
                            setTipoRelatorio("individual");
                            setShowRelatorioModal(true);
                          }}
                          className="btn btn-sm btn-outline"
                          title="Relatório Individual"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingNC(nc)}
                          className="btn btn-sm btn-outline"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(nc.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DO FORMULÁRIO */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingNC
                  ? "Editar Não Conformidade"
                  : "Nova Não Conformidade"}
              </h2>
              <NaoConformidadeForm
                naoConformidade={editingNC || undefined}
                onSubmit={handleSubmitNC}
                onCancel={handleCancelForm}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE RELATÓRIOS */}
      <RelatorioNaoConformidadesPremium
        isOpen={showRelatorioModal}
        onClose={() => setShowRelatorioModal(false)}
        naoConformidades={naoConformidades}
      />
    </div>
  );
}
