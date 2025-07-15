import { useState, useEffect } from "react";
import { NaoConformidade, naoConformidadesAPI } from "@/lib/supabase-api";
import NaoConformidadeForm from "@/components/forms/NaoConformidadeForm";
import toast from "react-hot-toast";
import { sanitizeUUIDField } from "@/utils/uuid";

export default function NaoConformidades() {
  const [naoConformidades, setNaoConformidades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNC, setEditingNC] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterSeveridade, setFilterSeveridade] = useState("");

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

  const handleExportar = () => {
    toast.success("Funcionalidade de exportação será implementada em breve!");
    // TODO: Implementar exportação para PDF/Excel
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
    const matchSeveridade =
      !filterSeveridade || nc.severidade === filterSeveridade;

    return matchSearch && matchTipo && matchSeveridade;
  });

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
          <div className="flex gap-2">
            <button onClick={handleCreateNC} className="btn btn-primary">
              + Nova NC
            </button>
            <button
              onClick={() => handleCreateAuditoria()}
              className="btn btn-secondary"
            >
              + Auditoria
            </button>
            <button
              onClick={() => handleExportar()}
              className="btn btn-outline"
            >
              Exportar
            </button>
          </div>
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

        {/* FILTROS */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4">
          <input
            className="input"
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="input"
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
          >
            <option value="">Tipo</option>
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
          <select
            className="input"
            value={filterSeveridade}
            onChange={(e) => setFilterSeveridade(e.target.value)}
          >
            <option value="">Severidade</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
        </div>

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
    </div>
  );
}
