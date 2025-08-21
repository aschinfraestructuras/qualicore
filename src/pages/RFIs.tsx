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
  TrendingUp,
  Users,
  Target,
  Activity,
  Zap,
  Shield,
  RefreshCw,
  Award,
  TrendingDown,
  Percent,
  Hash,
  Thermometer,
  Gauge,
  Layers,
  AlertCircle,
  Clock3,
  CheckSquare,
  Square,
  ArrowUpRight,
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
import { RFIDashboard } from "@/components/RFIDashboard";
import { RFIServices } from "@/lib/rfi-enhancements";
import { rfiCache } from "@/lib/rfi-cache";

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
  const [showDashboard, setShowDashboard] = useState(false);

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

  const loadRFIs = async (forceRefresh = false) => {
    try {
      setLoading(true);
      const data = await rfiCache.getAllRFIs(forceRefresh);
      console.log("📋 RFIs carregados (cache):", data);
      
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
        const result = await rfiCache.updateRFI(editingRFI.id, rfiData);
        console.log("🚀 Resultado update:", result);
        toast.success("RFI atualizado com sucesso!");
      } else {
        console.log("🚀 Criando novo RFI");
        const result = await rfiCache.createRFI(rfiData);
        console.log("🚀 Resultado create:", result);
        toast.success("RFI criado com sucesso!");
      }
      
      console.log("🚀 Recarregando RFIs...");
      await loadRFIs(true); // Force refresh após operações de escrita
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
        await rfiCache.deleteRFI(id);
        toast.success("RFI eliminado com sucesso!");
        await loadRFIs(true); // Force refresh após eliminação
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

  const handleViewSavedRFIs = () => {
    setShowSavedRFIs(true);
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

  // Calcular estatísticas
  const stats = {
    total: rfis.length,
    pendentes: rfis.filter(r => r.status === 'pendente').length,
    em_analise: rfis.filter(r => r.status === 'em_analise').length,
    respondidos: rfis.filter(r => r.status === 'respondido').length,
    fechados: rfis.filter(r => r.status === 'fechado').length,
    urgentes: rfis.filter(r => r.prioridade === 'urgente').length,
    altas: rfis.filter(r => r.prioridade === 'alta').length,
    medias: rfis.filter(r => r.prioridade === 'media').length,
    baixas: rfis.filter(r => r.prioridade === 'baixa').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pt-16">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 animate-fade-in">
          {/* Header Premium */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <HelpCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">RFIs</h1>
                    <p className="text-blue-100 text-lg">Pedidos de Informação</p>
                  </div>
                </div>
                <p className="text-blue-100 text-lg max-w-2xl">
                  Gestão centralizada e inteligente de todos os pedidos de informação da obra com analytics avançados.
                </p>
              </div>
              
              {/* Botões de Ação Premium */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCreate}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 border border-white/30 hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                  Novo RFI
                </button>
                <button
                  onClick={() => setShowRelatorios(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 border border-white/30 hover:scale-105"
                >
                  <BarChart3 className="h-5 w-5" />
                  Relatórios
                </button>
                <button
                  onClick={() => setShowSavedRFIs(true)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 border border-white/30 hover:scale-105"
                >
                  <Cloud className="h-5 w-5" />
                  Salvos
                </button>
              </div>
            </div>
          </div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Total RFIs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="group cursor-pointer relative"
          >
            <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+{stats.total}</span>
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total de RFIs</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</p>
                
                <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out" 
                       style={{ width: `${(stats.total / 100) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RFIs Pendentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="group cursor-pointer relative"
          >
            <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-gray-600 mb-2">Pendentes</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stats.pendentes}</p>
                
                <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                  <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000 ease-out" 
                       style={{ width: `${(stats.pendentes / stats.total) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RFIs Respondidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="group cursor-pointer relative"
          >
            <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-t-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-gray-600 mb-2">Respondidos</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stats.respondidos}</p>
                
                <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                  <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000 ease-out" 
                       style={{ width: `${(stats.respondidos / stats.total) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RFIs Urgentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="group cursor-pointer relative"
          >
            <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-t-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-gray-600 mb-2">Urgentes</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stats.urgentes}</p>
                
                <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                  <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-1000 ease-out" 
                       style={{ width: `${(stats.urgentes / stats.total) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Conteúdo principal - Dashboard ou Lista */}
        {showDashboard ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard RFI</h2>
              <button
                onClick={() => setShowDashboard(false)}
                className="btn btn-outline flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Voltar à Lista</span>
              </button>
            </div>
            <RFIDashboard
              rfis={filteredRFIs}
              onSearch={(query, options) => {
                setFilters(prev => ({ ...prev, search: query }));
              }}
              onFilterChange={(newFilters) => {
                setFilters(prev => ({ ...prev, ...newFilters }));
              }}
            />
          </>
        ) : (
          <>
                         {/* Botões de Ação Premium */}
             <div className="flex flex-wrap gap-4 mb-8">
               <div className="flex flex-wrap gap-3">
                 <button
                   onClick={handleCreate}
                   className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                 >
                   <Plus className="h-5 w-5" />
                   <span>Novo RFI</span>
                 </button>

                 <button
                   onClick={() => setShowRelatorios(true)}
                   className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                 >
                   <FileText className="h-5 w-5" />
                   <span>Relatórios PDF</span>
                 </button>

                 <button
                   onClick={() => setShowDashboard(true)}
                   className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                 >
                   <BarChart3 className="h-5 w-5" />
                   <span>Dashboard</span>
                 </button>
               </div>

               <div className="flex flex-wrap gap-3">
                 <button
                   onClick={() => setShowFilters(!showFilters)}
                   className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-200"
                 >
                   <Filter className="h-5 w-5" />
                   <span>Filtros</span>
                 </button>

                 <button
                   onClick={handleViewSavedRFIs}
                   className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-200"
                 >
                   <Cloud className="h-5 w-5" />
                   <span>Ver Salvos</span>
                 </button>

                 <button
                   onClick={() => {
                     rfiCache.clear();
                     toast.success("Cache limpo com sucesso!");
                     loadRFIs(true);
                   }}
                   className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-200"
                   title="Limpar cache e recarregar dados"
                 >
                   <RefreshCw className="h-5 w-5" />
                   <span>Limpar Cache</span>
                 </button>
               </div>
             </div>
          </>
        )}

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

                           <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <HelpCircle className="h-6 w-6" />
              Lista de RFIs
              <span className="text-blue-100 text-lg font-normal">
                ({filteredRFIs.length} {filteredRFIs.length === 1 ? 'RFI' : 'RFIs'})
              </span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                       <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider w-20">
                  Nº
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider min-w-0 flex-1">
                  Título
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider w-32">
                  Solicitante
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider w-32">
                  Destinatário
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider w-24">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider w-24">
                  Prioridade
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider w-24">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider w-40">
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
                         {filteredRFIs.map((rfi, index) => {
               console.log("🎯 Renderizando RFI:", rfi.numero);
               return (
                 <motion.tr 
                   key={rfi.id} 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: index * 0.05 }}
                   className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 group"
                 >
                   <td className="px-6 py-4 font-mono text-sm font-bold text-blue-600">
                     {rfi.numero}
                   </td>
                   <td className="px-6 py-4 min-w-0">
                     <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                       {rfi.titulo}
                     </div>
                     {rfi.descricao && (
                       <div className="text-sm text-gray-500 mt-1 max-w-xs">
                         <div className="break-words">
                           {rfi.descricao.length > 100 ? `${rfi.descricao.substring(0, 100)}...` : rfi.descricao}
                         </div>
                       </div>
                     )}
                   </td>
                   <td className="px-6 py-4 min-w-0">
                     <div className="text-gray-700 font-medium truncate max-w-32">
                       {rfi.solicitante}
                     </div>
                   </td>
                   <td className="px-6 py-4 min-w-0">
                     <div className="text-gray-700 font-medium truncate max-w-32">
                       {rfi.destinatario}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <div className="text-gray-600 font-medium">
                       {new Date(rfi.data_solicitacao).toLocaleDateString('pt-PT')}
                     </div>
                   </td>
                   <td className="px-6 py-4">
                     <span
                       className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                         rfi.prioridade === "urgente" ? "bg-red-100 text-red-800" :
                         rfi.prioridade === "alta" ? "bg-orange-100 text-orange-800" :
                         rfi.prioridade === "media" ? "bg-yellow-100 text-yellow-800" :
                         "bg-green-100 text-green-800"
                       }`}
                     >
                       {rfi.prioridade}
                     </span>
                   </td>
                   <td className="px-6 py-4">
                     <span
                       className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                         rfi.status === "pendente" ? "bg-yellow-100 text-yellow-800" :
                         rfi.status === "em_analise" ? "bg-blue-100 text-blue-800" :
                         rfi.status === "respondido" ? "bg-green-100 text-green-800" :
                         "bg-gray-100 text-gray-800"
                       }`}
                     >
                       {rfi.status}
                     </span>
                   </td>
                   <td className="px-6 py-4 text-right min-w-0">
                     <div className="flex items-center justify-end gap-1 flex-wrap">
                       <button
                         onClick={() => handleShare(rfi)}
                         className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-110"
                         title="Partilhar RFI"
                       >
                         <Share2 className="h-4 w-4" />
                       </button>
                       <button
                         onClick={() => handleIndividualReport(rfi)}
                         className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-200 hover:scale-110"
                         title="Relatório Individual"
                       >
                         <Download className="h-4 w-4" />
                       </button>
                       <button
                         onClick={() => handleViewDocuments(rfi)}
                         className="p-1.5 text-purple-600 hover:bg-purple-100 rounded-lg transition-all duration-200 hover:scale-110"
                         title="Ver Documentos"
                       >
                         <Eye className="h-4 w-4" />
                       </button>
                       <button
                         onClick={() => handleEdit(rfi)}
                         className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                         title="Editar"
                       >
                         <Edit className="h-4 w-4" />
                       </button>
                       <button
                         onClick={() => handleDelete(rfi.id)}
                         className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110"
                         title="Eliminar"
                       >
                         <Trash2 className="h-4 w-4" />
                       </button>
                     </div>
                   </td>
                 </motion.tr>
               );
             })}
          </tbody>
        </table>
        </div>
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
      </div>
    </div>
  );
}
