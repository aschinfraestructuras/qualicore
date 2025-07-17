import { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  FileText,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  XCircle,
  BarChart3,
  Download,
  Share2,
  Cloud,
} from "lucide-react";
import RFIForm from "../components/forms/RFIForm";
import RelatorioRFIsPremium from "../components/RelatorioRFIsPremium";
import ShareRFIModal from "../components/ShareRFIModal";
import SavedRFIsViewer from "../components/SavedRFIsViewer";
import { rfisAPI } from "@/lib/supabase-api";
import type { RFI } from "@/lib/supabase-api";
import type { RFI as RFIType } from "@/types";
import Modal from "../components/Modal";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { PDFService } from "@/services/pdfService";

export default function RFIs() {
  const [rfis, setRFIs] = useState<RFI[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRFI, setEditingRFI] = useState<RFI | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showRelatorios, setShowRelatorios] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSavedRFIs, setShowSavedRFIs] = useState(false);
  const [selectedRFI, setSelectedRFI] = useState<RFI | null>(null);

  // Filtros ativos
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    prioridade: "",
    solicitante: "",
    destinatario: "",
    dataInicio: "",
    dataFim: "",
  });

  // Carregar RFIs
  useEffect(() => {
    loadRFIs();
  }, []);

  const loadRFIs = async () => {
    try {
      setLoading(true);
      const data = await rfisAPI.getAll();
      setRFIs(data || []);
    } catch (error) {
      toast.error("Erro ao carregar RFIs");
      console.error("Erro ao carregar RFIs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros
  const filteredRFIs = rfis.filter((rfi) => {
    const matchesSearch = !filters.search || 
      rfi.titulo?.toLowerCase().includes(filters.search.toLowerCase()) ||
      rfi.numero?.toLowerCase().includes(filters.search.toLowerCase()) ||
      rfi.solicitante?.toLowerCase().includes(filters.search.toLowerCase()) ||
      rfi.destinatario?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = !filters.status || rfi.status === filters.status;
    const matchesPrioridade = !filters.prioridade || rfi.prioridade === filters.prioridade;
    const matchesSolicitante = !filters.solicitante || rfi.solicitante === filters.solicitante;
    const matchesDestinatario = !filters.destinatario || rfi.destinatario === filters.destinatario;

    const matchesData = !filters.dataInicio || !filters.dataFim || 
      (rfi.data_solicitacao >= filters.dataInicio && rfi.data_solicitacao <= filters.dataFim);

    return matchesSearch && matchesStatus && matchesPrioridade && 
           matchesSolicitante && matchesDestinatario && matchesData;
  });

  // Obter valores únicos para os filtros
  const statusUnicos = [...new Set(rfis.map(r => r.status).filter(Boolean))];
  const prioridadesUnicas = [...new Set(rfis.map(r => r.prioridade).filter(Boolean))];
  const solicitantesUnicos = [...new Set(rfis.map(r => r.solicitante).filter(Boolean))];
  const destinatariosUnicos = [...new Set(rfis.map(r => r.destinatario).filter(Boolean))];

  const handleCreate = () => {
    setEditingRFI(null);
    setShowForm(true);
  };

  const handleEdit = (rfi: RFI) => {
    setEditingRFI(rfi);
    setShowForm(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      // Garante que o campo 'codigo' está presente
      const rfiData = {
        codigo: data.codigo,
        numero: data.numero,
        titulo: data.titulo,
        descricao: data.descricao,
        solicitante: data.solicitante,
        destinatario: data.destinatario,
        data_solicitacao: data.data_solicitacao,
        data_resposta: data.data_resposta,
        prioridade: data.prioridade,
        status: data.status,
        resposta: data.resposta,
        impacto_custo: data.impacto_custo,
        impacto_prazo: data.impacto_prazo,
        observacoes: data.observacoes,
      };
      if (editingRFI) {
        await rfisAPI.update(editingRFI.id, rfiData);
        toast.success("RFI atualizado com sucesso!");
      } else {
        await rfisAPI.create(rfiData);
        toast.success("RFI criado com sucesso!");
      }
      await loadRFIs();
      setShowForm(false);
    } catch (error) {
      toast.error("Erro ao salvar RFI");
      console.error("Erro ao salvar RFI:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja eliminar este RFI?")) {
      try {
        await rfisAPI.delete(id);
        toast.success("RFI eliminado com sucesso!");
        await loadRFIs();
      } catch (error) {
        toast.error("Erro ao eliminar RFI");
        console.error("Erro ao eliminar RFI:", error);
      }
    }
  };

  const handleIndividualReport = async (rfi: RFI) => {
    try {
      const pdfService = new PDFService();

      await pdfService.generateRFIsIndividualReport([rfi as unknown as RFIType]);
      toast.success("Relatório individual gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório individual:", error);
      toast.error("Erro ao gerar relatório individual");
    }
  };

  const handleShare = (rfi: RFI) => {
    setSelectedRFI(rfi);
    setShowShareModal(true);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      prioridade: "",
      solicitante: "",
      destinatario: "",
      dataInicio: "",
      dataFim: "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <HelpCircle className="h-7 w-7 text-blue-500" /> RFIs (Pedidos de
            Informação)
          </h1>
          <p className="text-gray-600 mt-1">
            Gestão centralizada de todos os pedidos de informação da obra.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSavedRFIs(true)}
            className="btn btn-outline flex items-center gap-2"
          >
            <Cloud className="h-5 w-5" /> RFIs Salvos
          </button>
          <button
            onClick={() => setShowRelatorios(true)}
            className="btn btn-outline flex items-center gap-2"
          >
            <BarChart3 className="h-5 w-5" /> Relatórios
          </button>
          <button
            onClick={handleCreate}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Novo RFI
          </button>
        </div>
      </div>

      {/* Botão de Filtros */}
      <div className="flex items-center space-x-4">
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
                    placeholder="Pesquisar RFI..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="input pl-10 w-full"
                  />
                </div>

                {/* Status */}
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="input"
                >
                  <option value="">Todos os status</option>
                  {statusUnicos.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                {/* Prioridade */}
                <select
                  value={filters.prioridade}
                  onChange={(e) => setFilters({ ...filters, prioridade: e.target.value })}
                  className="input"
                >
                  <option value="">Todas as prioridades</option>
                  {prioridadesUnicas.map((prioridade) => (
                    <option key={prioridade} value={prioridade}>{prioridade}</option>
                  ))}
                </select>

                {/* Responsável */}
                <select
                  value={filters.solicitante}
                  onChange={(e) => setFilters({ ...filters, solicitante: e.target.value })}
                  className="input"
                >
                  <option value="">Todos os solicitantes</option>
                  {solicitantesUnicos.map((solicitante) => (
                    <option key={solicitante} value={solicitante}>{solicitante}</option>
                  ))}
                </select>

                {/* Data Início */}
                <input
                  type="date"
                  value={filters.dataInicio}
                  onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })}
                  className="input"
                />

                {/* Data Fim */}
                <input
                  type="date"
                  value={filters.dataFim}
                  onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                  className="input"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">
                Nº
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">
                Título
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">
                Solicitante
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">
                Destinatário
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">
                Data
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">
                Prioridade
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-blue-700">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRFIs.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">
                  Nenhum RFI encontrado.
                </td>
              </tr>
            )}
            {filteredRFIs.map((rfi) => (
              <tr key={rfi.id} className="hover:bg-blue-50/40 transition">
                <td className="px-4 py-3 font-mono text-xs text-blue-900">
                  {rfi.numero}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {rfi.titulo}
                </td>
                <td className="px-4 py-3 text-gray-700">{rfi.solicitante}</td>
                <td className="px-4 py-3 text-gray-700">{rfi.destinatario}</td>
                <td className="px-4 py-3 text-gray-600">
                  {rfi.data_solicitacao}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`badge ${rfi.prioridade === "alta" ? "bg-red-100 text-red-700" : rfi.prioridade === "media" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
                  >
                    {rfi.prioridade}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`badge ${rfi.status === "pendente" ? "bg-yellow-100 text-yellow-700" : rfi.status === "em_analise" ? "bg-blue-100 text-blue-700" : rfi.status === "respondido" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                  >
                    {rfi.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleShare(rfi)}
                    className="btn btn-xs btn-outline mr-2"
                    title="Partilhar RFI"
                  >
                    <Share2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleIndividualReport(rfi)}
                    className="btn btn-xs btn-outline mr-2"
                    title="Relatório Individual"
                  >
                    <Download className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleEdit(rfi)}
                    className="btn btn-xs btn-outline mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(rfi.id)}
                    className="btn btn-xs btn-danger"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingRFI ? "Editar RFI" : "Novo RFI"}
        size="md"
      >
        <RFIForm
          initialData={editingRFI || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Modal de Relatórios */}
      {showRelatorios && (
        <RelatorioRFIsPremium
          rfis={rfis as unknown as RFIType[]}
          onClose={() => setShowRelatorios(false)}
        />
      )}

      {/* Modal de Partilha */}
      {showShareModal && selectedRFI && (
        <ShareRFIModal
          rfi={selectedRFI as unknown as RFIType}
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setSelectedRFI(null);
          }}
        />
      )}

      {/* Modal de RFIs Salvos */}
      {showSavedRFIs && (
        <SavedRFIsViewer
          isOpen={showSavedRFIs}
          onClose={() => setShowSavedRFIs(false)}
        />
      )}
    </div>
  );
}
