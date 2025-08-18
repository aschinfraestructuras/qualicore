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
  Edit,
  Trash2,
  Eye,
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
import PDFService from "@/services/pdfService";

export default function RFIs() {
  const [rfis, setRFIs] = useState<RFI[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRFI, setEditingRFI] = useState<RFI | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showRelatorios, setShowRelatorios] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSavedRFIs, setShowSavedRFIs] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedRFI, setSelectedRFI] = useState<any>(null);

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
      console.log("📋 RFIs carregados:", data);
      
      // Verificar se os RFIs têm o campo documents
      if (data && data.length > 0) {
        console.log("📋 Primeiro RFI:", data[0]);
        console.log("📋 Campo documents do primeiro RFI:", (data[0] as any).documents);
      }
      
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

  console.log("🔍 RFIs filtrados:", filteredRFIs.length);

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
    console.log("🚀 handleSubmit chamado!");
    try {
      console.log("Dados recebidos do formulário RFI:", data);
      console.log("Documents:", data.documents);

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
        documents: data.documents || [],
      };
      
      console.log("🚀 Dados para API:", rfiData);
      
      if (editingRFI) {
        console.log("🚀 Atualizando RFI:", editingRFI.id);
        const result = await rfisAPI.update(editingRFI.id, rfiData);
        console.log("🚀 Resultado update:", result);
        toast.success("RFI atualizado com sucesso!");
      } else {
        console.log("🚀 Criando novo RFI");
        const result = await rfisAPI.create(rfiData);
        console.log("🚀 Resultado create:", result);
        toast.success("RFI criado com sucesso!");
      }
      
      console.log("🚀 Recarregando RFIs...");
      await loadRFIs();
      console.log("🚀 Fechando modal...");
      setShowForm(false);
    } catch (error) {
      console.error("❌ Erro detalhado ao salvar RFI:", error);
      toast.error("Erro ao salvar RFI");
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

  const handleViewDocuments = (rfi: any) => {
    console.log("👁️ Clicou no botão olho para RFI:", rfi);
    console.log("📁 Documents do RFI:", rfi.documents);
    
    // Verificar se há documentos
    const hasDocuments = 
      (rfi.documents && rfi.documents.length > 0) ||
      rfi.arquivo_url;

    console.log("📁 Tem documentos?", hasDocuments);

    if (hasDocuments) {
      setSelectedRFI(rfi);
      setShowDocumentsModal(true);
    } else {
      toast("Este RFI não possui documentos carregados");
    }
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
    <div className="space-y-8 animate-fade-in pt-8">
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
            {filteredRFIs.map((rfi) => {
              console.log("🎯 Renderizando RFI:", rfi.numero);
              return (
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
                      onClick={() => handleViewDocuments(rfi)}
                      className="btn btn-xs btn-primary mr-2"
                      title="Ver Documentos"
                    >
                      <Eye className="h-4 w-4" />
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
              );
            })}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingRFI ? "Editar RFI" : "Novo RFI"}
              </h2>
              <button
                onClick={() => {
                  console.log("🚨 Modal fechando!");
                  setShowForm(false);
                }}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                title="Fechar"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <RFIForm
                initialData={editingRFI || undefined}
                onSubmit={handleSubmit}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

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

      {/* Modal de Visualização de Documentos */}
      {showDocumentsModal && selectedRFI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Documentos do RFI: {selectedRFI.numero}
                </h2>
                <button
                  onClick={() => setShowDocumentsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Documentos Carregados
                  </h3>
                  <p className="text-sm text-gray-600">
                    Visualize e faça download dos documentos associados a este RFI.
                  </p>
                </div>
                
                {/* Documents */}
                {selectedRFI.documents && selectedRFI.documents.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Documentos ({selectedRFI.documents.length})
                    </h4>
                    <div className="space-y-3">
                      {selectedRFI.documents.map((doc: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {doc.name || `Documento ${index + 1}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {(doc.tamanho / 1024).toFixed(2)} KB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => window.open(doc.url, '_blank')}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Visualizar"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = doc.url;
                                link.download = doc.name || `documento_${index + 1}`;
                                link.click();
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Arquivo URL */}
                {selectedRFI.arquivo_url && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Arquivo Principal
                    </h4>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Arquivo do RFI
                          </p>
                          <p className="text-sm text-gray-500">
                            Documento principal
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(selectedRFI.arquivo_url, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedRFI.arquivo_url!;
                            link.download = `rfi_${selectedRFI.numero}`;
                            link.click();
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mensagem se não houver documentos */}
                {(!selectedRFI.documents || selectedRFI.documents.length === 0) && 
                 !selectedRFI.arquivo_url && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum documento carregado para este RFI</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
