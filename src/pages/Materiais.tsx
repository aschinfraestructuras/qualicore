import { Material } from "@/types";
import { useState, useEffect, useMemo, useRef } from "react";
import { PDFService } from "@/services/pdfService";
import {
  Plus,
  Package,
  CheckCircle,
  Edit,
  Trash2,
  X,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  MapPin,
  User,
  AlertCircle,
  Eye,
  Clock,
  FileText,
  XCircle,
  Share2,
  Cloud,
  ArrowUpRight,
  BarChart,
} from "lucide-react";
import toast from "react-hot-toast";
import MaterialForm from "@/components/forms/MaterialForm";
import MaterialView from "@/components/MaterialView";
import { ShareMaterialModal } from "@/components/ShareMaterialModal";
import { SavedMateriaisViewer } from "@/components/SavedMateriaisViewer";
import MateriaisDashboard from "@/components/MateriaisDashboard";

import { materiaisAPI } from "@/lib/supabase-api";
import { sanitizeUUIDField } from "@/utils/uuid";
import Modal from "@/components/Modal";

import { AnimatePresence, motion } from "framer-motion";

interface Filtros {
  search: string;
  tipo: string;
  estado: string;
  zona: string;
  fornecedor: string;
  dataInicio: string;
  dataFim: string;
}

export default function Materiais() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [viewingMaterial, setViewingMaterial] = useState<Material | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>({
    search: "",
    tipo: "",
    estado: "",
    zona: "",
    fornecedor: "",
    dataInicio: "",
    dataFim: "",
  });
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSavedMateriais, setShowSavedMateriais] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [sharingMaterial, setSharingMaterial] = useState<Material | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);


  useEffect(() => {
    loadMateriais();
  }, []);

  const loadMateriais = async () => {
    try {
      setLoading(true);
      const data = await materiaisAPI.getAll();
      // Mapear created_at e updated_at para data_criacao e data_atualizacao
      const materiaisComData = (data || []).map((m: any) => ({
        ...m,
        data_criacao: m.data_criacao || m.created_at || "",
        data_atualizacao: m.data_atualizacao || m.updated_at || "",
      }));
      setMateriais(materiaisComData);
    } catch (error) {
      console.error("Erro ao carregar materiais:", error);
      toast.error("Erro ao carregar materiais");
      setMateriais([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtros e pesquisa
  const materiaisFiltrados = useMemo(() => {
    return materiais.filter((material) => {
      const matchSearch =
        !filtros.search ||
        material.codigo.toLowerCase().includes(filtros.search.toLowerCase()) ||
        material.nome.toLowerCase().includes(filtros.search.toLowerCase()) ||
        material.lote.toLowerCase().includes(filtros.search.toLowerCase());

      const matchTipo = !filtros.tipo || material.tipo === filtros.tipo;
      const matchEstado = !filtros.estado || material.estado === filtros.estado;
      const matchZona = !filtros.zona || material.zona === filtros.zona;
      const matchFornecedor =
        !filtros.fornecedor || material.fornecedor_id === filtros.fornecedor;

      const matchData =
        !filtros.dataInicio ||
        !filtros.dataFim ||
        (material.data_rececao >= filtros.dataInicio &&
          material.data_rececao <= filtros.dataFim);

      return (
        matchSearch &&
        matchTipo &&
        matchEstado &&
        matchZona &&
        matchFornecedor &&
        matchData
      );
    });
  }, [materiais, filtros]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = materiais.length;
    const aprovados = materiais.filter((m) => m.estado === "aprovado").length;
    const pendentes = materiais.filter((m) => m.estado === "pendente").length;
    const emAnalise = materiais.filter((m) => m.estado === "em_analise").length;
    const reprovados = materiais.filter((m) => m.estado === "reprovado").length;
    const concluidos = materiais.filter((m) => m.estado === "concluido").length;

    const totalQuantidade = materiais.reduce((sum, m) => sum + m.quantidade, 0);
    const valorEstimado = totalQuantidade * 150; // Valor estimado por unidade

    return {
      total,
      aprovados,
      pendentes,
      emAnalise,
      reprovados,
      concluidos,
      totalQuantidade,
      valorEstimado,
    };
  }, [materiais]);

  const handleCreate = () => {
    setEditingMaterial(null);
    setShowForm(true);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setShowForm(true);
  };

  const handleView = (material: Material) => {
    setViewingMaterial(material);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      // Sanitizar campos UUID
      const payload = {
        ...data,
        fornecedor_id: sanitizeUUIDField(data.fornecedor_id),
        certificado_id: sanitizeUUIDField(data.certificado_id),
      };
      if (editingMaterial) {
        await materiaisAPI.update(editingMaterial.id, payload);
        toast.success("Material atualizado com sucesso!");
      } else {
        await materiaisAPI.create(payload);
        toast.success("Material criado com sucesso!");
      }
      await loadMateriais();
      setShowForm(false);
    } catch (error) {
      toast.error("Erro ao salvar material");
      console.error("Erro ao salvar material:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja eliminar este material?")) {
      try {
        await materiaisAPI.delete(id);
        toast.success("Material eliminado com sucesso!");
        await loadMateriais();
      } catch (error) {
        toast.error("Erro ao eliminar material");
        console.error("Erro ao eliminar material:", error);
      }
    }
  };

  const handleExport = () => {
    const csvContent = generateCSV(materiaisFiltrados);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `materiais_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Relatório exportado com sucesso!");
  };

  const handleDashboardSearch = (query: string, options?: any) => {
    setFiltros(prev => ({ ...prev, search: query }));
  };

  const handleDashboardFilterChange = (filters: any) => {
    setFiltros(prev => ({ ...prev, ...filters }));
  };

  const handlePrint = () => {
    setShowPrintModal(true);
  };

  const handleConfirmPrint = async (tipo: "executivo" | "individual" | "filtrado" | "comparativo") => {
    setShowPrintModal(false);
    
    try {
      const pdfService = new PDFService();
      
      // Determinar quais materiais usar baseado no tipo
      let materiaisParaRelatorio = materiais;
      
      switch (tipo) {
        case "executivo":
          await pdfService.generateMateriaisExecutiveReport(materiaisParaRelatorio);
          break;
        case "filtrado":
          materiaisParaRelatorio = materiaisFiltrados;
          await pdfService.generateMateriaisFilteredReport(materiaisParaRelatorio, filtros);
          break;
        case "comparativo":
          await pdfService.generateMateriaisComparativeReport(materiaisParaRelatorio);
          break;
        case "individual":
          // Para relatório individual, usar o primeiro material ou mostrar erro
          if (materiaisParaRelatorio.length > 0) {
            await pdfService.generateMateriaisIndividualReport([materiaisParaRelatorio[0]]);
          } else {
            toast.error("Nenhum material disponível para relatório individual");
            return;
          }
          break;
      }
      
      toast.success(`Relatório ${tipo} gerado com sucesso!`);
      
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast.error("Erro ao gerar relatório");
    }
  };

  const handleRelatorioIndividual = async (material: Material) => {
    try {
      const pdfService = new PDFService();
      
      await pdfService.generateMateriaisIndividualReport([material]);
      toast.success("Relatório individual gerado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao gerar relatório individual:", error);
      toast.error("Erro ao gerar relatório individual");
    }
  };

  const handleShare = (material: Material) => {
    setSharingMaterial(material);
    setShowShareModal(true);
  };

  const handleViewDocuments = (material: Material) => {
    console.log("👁️ Clicou no botão olho para Material:", material);
    console.log("📁 Documents do Material:", (material as any).documents);
    
    // Verificar se há documentos no campo documents
    const hasDocuments = 
      ((material as any).documents && (material as any).documents.length > 0) ||
      (material.anexos && material.anexos.length > 0) ||
      material.arquivo_url;

    console.log("📁 Tem documentos?", hasDocuments);

    if (hasDocuments) {
      setViewingMaterial(material);
      setShowDocumentsModal(true);
    } else {
      toast("Este material não possui documentos carregados");
    }
  };


  const generateCSV = (materiais: Material[]) => {
    const headers = [
      "Código",
      "Nome",
      "Tipo",
      "Fornecedor",
      "Data Receção",
      "Quantidade",
      "Unidade",
      "Lote",
      "Estado",
      "Zona",
      "Responsável",
    ];
    const rows = materiais.map((m) => [
      m.codigo,
      m.nome,
      m.tipo,
      m.fornecedor_id,
      m.data_rececao,
      m.quantidade,
      m.unidade,
      m.lote,
      m.estado,
      m.zona,
      m.responsavel,
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  };

  const generatePrintContent = (materiais: Material[]) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Materiais</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .stats { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .stat { text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Materiais</h1>
            <p>Data: ${new Date().toLocaleDateString("pt-PT")}</p>
            <p>Total: ${materiais.length} materiais</p>
          </div>
          
          <div class="stats">
            <div class="stat">
              <h3>Aprovados</h3>
              <p>${stats.aprovados}</p>
            </div>
            <div class="stat">
              <h3>Pendentes</h3>
              <p>${stats.pendentes}</p>
            </div>
            <div class="stat">
              <h3>Em Análise</h3>
              <p>${stats.emAnalise}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Estado</th>
                <th>Zona</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              ${materiais
                .map(
                  (m) => `
                <tr>
                  <td>${m.codigo}</td>
                  <td>${m.nome}</td>
                  <td>${m.tipo}</td>
                  <td>${m.quantidade} ${m.unidade}</td>
                  <td>${m.estado}</td>
                  <td>${m.zona}</td>
                  <td>${m.responsavel}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const clearFilters = () => {
    setFiltros({
      search: "",
      tipo: "",
      estado: "",
      zona: "",
      fornecedor: "",
      dataInicio: "",
      dataFim: "",
    });
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "aprovado":
        return "text-green-600 bg-green-100";
      case "pendente":
        return "text-yellow-600 bg-yellow-100";
      case "em_analise":
        return "text-blue-600 bg-blue-100";
      case "reprovado":
        return "text-red-600 bg-red-100";
      case "concluido":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "betao":
        return <Package className="h-5 w-5 text-gray-600" />;
      case "aco":
        return <Package className="h-5 w-5 text-blue-600" />;
      case "agregado":
        return <Package className="h-5 w-5 text-yellow-600" />;
      case "cimento":
        return <Package className="h-5 w-5 text-gray-800" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-bounce"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Carregando materiais...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pt-16">
      {/* Header Premium */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-red-900 bg-clip-text text-transparent mb-2">
              Gestão de Materiais
            </h1>
            <p className="text-xl text-gray-600 flex items-center">
              <Package className="h-5 w-5 mr-2 text-orange-500" />
              Controlo de materiais e recursos em tempo real
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <BarChart className="h-4 w-4 mr-2" />
              {showDashboard ? 'Lista' : 'Dashboard'}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Novo Material
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards - Ultra Premium */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
      >
        {/* Total de Materiais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group cursor-pointer relative"
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-3xl"></div>
            <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+{stats.total}</span>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total de Materiais</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.total / 100) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Aprovados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Aprovados</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.aprovados}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.aprovados / stats.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pendentes */}
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

        {/* Rejeitados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="group cursor-pointer relative"
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Rejeitados</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.reprovados}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.reprovados / stats.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Em Uso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="group cursor-pointer relative"
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Em Uso</h3>
                              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.emAnalise}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.emAnalise / stats.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Botão de Filtros */}
      <div className="flex items-center space-x-4 mb-6">
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
                    placeholder="Código, nome, lote..."
                    value={filtros.search}
                    onChange={(e) =>
                      setFiltros((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="input pl-10 w-full"
                  />
                </div>

                {/* Tipo */}
                <select
                  value={filtros.tipo}
                  onChange={(e) =>
                    setFiltros((prev) => ({ ...prev, tipo: e.target.value }))
                  }
                  className="input"
                >
                  <option value="">Todos os tipos</option>
                  <option value="betao">Betão</option>
                  <option value="aco">Aço</option>
                  <option value="agregado">Agregado</option>
                  <option value="cimento">Cimento</option>
                  <option value="outro">Outro</option>
                </select>

                {/* Estado */}
                <select
                  value={filtros.estado}
                  onChange={(e) =>
                    setFiltros((prev) => ({ ...prev, estado: e.target.value }))
                  }
                  className="input"
                >
                  <option value="">Todos os estados</option>
                  <option value="pendente">Pendente</option>
                  <option value="em_analise">Em Análise</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="reprovado">Reprovado</option>
                  <option value="concluido">Concluído</option>
                </select>

                {/* Zona */}
                <select
                  value={filtros.zona}
                  onChange={(e) =>
                    setFiltros((prev) => ({ ...prev, zona: e.target.value }))
                  }
                  className="input"
                >
                  <option value="">Todas as zonas</option>
                  <option value="Zona A - Fundações">Zona A - Fundações</option>
                  <option value="Zona B - Pilares">Zona B - Pilares</option>
                  <option value="Zona C - Lajes">Zona C - Lajes</option>
                  <option value="Zona D - Estrutura">Zona D - Estrutura</option>
                  <option value="Armazém Central">Armazém Central</option>
                  <option value="Laboratório">Laboratório</option>
                  <option value="Escritório">Escritório</option>
                </select>

                {/* Fornecedor */}
                <select
                  value={filtros.fornecedor}
                  onChange={(e) =>
                    setFiltros((prev) => ({ ...prev, fornecedor: e.target.value }))
                  }
                  className="input"
                >
                  <option value="">Todos os fornecedores</option>
                  {/* Aqui seria necessário carregar os fornecedores */}
                </select>

                {/* Data Início */}
                <input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      dataInicio: e.target.value,
                    }))
                  }
                  className="input"
                />

                {/* Data Fim */}
                <input
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) =>
                    setFiltros((prev) => ({ ...prev, dataFim: e.target.value }))
                  }
                  className="input"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botões de ação abaixo dos filtros */}
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <button 
          className="btn btn-outline btn-md" 
          onClick={() => setShowSavedMateriais(true)}
        >
          <Cloud className="h-4 w-4 mr-2" />
          Materiais Salvos
        </button>
        <button className="btn btn-outline btn-md" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </button>
        <button className="btn btn-accent btn-md" onClick={() => setShowPrintModal(true)}>
          <FileText className="h-4 w-4 mr-2" />
          Relatórios PDF
        </button>
        <button className="btn btn-primary btn-md ml-auto" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Material
        </button>
      </div>

      {/* Conteúdo Principal - Dashboard ou Lista */}
      {showDashboard ? (
        <MateriaisDashboard
          materiais={materiais}
          onSearch={handleDashboardSearch}
          onFilterChange={handleDashboardFilterChange}
        />
      ) : (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Lista de Materiais</h3>
            <p className="card-description">
              {materiaisFiltrados.length} de {materiais.length} material(is)
              encontrado(s)
            </p>
          </div>
          <div className="card-content">
            {materiaisFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {materiais.length === 0
                    ? "Nenhum material encontrado"
                    : "Nenhum material corresponde aos filtros aplicados"}
                </p>
                {materiais.length === 0 && (
                  <button
                    className="btn btn-primary btn-sm mt-4"
                    onClick={handleCreate}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Material
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {materiaisFiltrados.map((material) => (
                <div
                  key={material.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        {getTipoIcon(material.tipo)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {material.codigo}
                          </h4>
                          <span
                            className={`badge ${getEstadoColor(material.estado)}`}
                          >
                            {material.estado.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {material.nome} - {material.tipo}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(material.data_rececao).toLocaleDateString(
                              "pt-PT",
                            )}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {material.zona}
                          </span>
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {material.responsavel}
                          </span>
                          <span className="flex items-center">
                            <Package className="h-3 w-3 mr-1" />
                            {material.quantidade} {material.unidade}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-cyan-600 transition-colors"
                        onClick={() => handleViewDocuments(material)}
                        title="Ver Documentos"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => handleShare(material)}
                        title="Partilhar material"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => handleView(material)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => handleEdit(material)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        onClick={() => handleRelatorioIndividual(material)}
                        title="Relatório Individual PDF"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => handleDelete(material.id)}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      {/* Modal do Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingMaterial ? "Editar Material" : "Novo Material"}
              </h2>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowForm(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <MaterialForm
                initialData={
                  editingMaterial
                    ? {
                        codigo: editingMaterial.codigo,
                        nome: editingMaterial.nome,
                        tipo: editingMaterial.tipo as any,
                        fornecedor_id: editingMaterial.fornecedor_id,
                        certificado_id: editingMaterial.certificado_id,
                        data_rececao: editingMaterial.data_rececao,
                        quantidade: editingMaterial.quantidade,
                        unidade: editingMaterial.unidade,
                        lote: editingMaterial.lote,
                        responsavel: editingMaterial.responsavel,
                        zona: editingMaterial.zona,
                        estado: editingMaterial.estado as any,
                        observacoes: editingMaterial.observacoes,
                      }
                    : undefined
                }
                onSubmit={handleFormSubmit}
                onCancel={() => setShowForm(false)}
                isEditing={!!editingMaterial}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
      {viewingMaterial && (
        <MaterialView
          material={viewingMaterial}
          onClose={() => setViewingMaterial(null)}
        />
      )}



      {/* Modal de Relatórios PDF */}
      <Modal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        title="Gerar Relatório PDF de Materiais"
        size="lg"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              className="btn btn-outline flex items-center gap-3 w-full justify-start p-4 h-auto" 
              onClick={() => handleConfirmPrint("executivo")}
            >
              <FileText className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <div className="font-bold text-lg">Relatório Executivo</div>
                <div className="text-sm text-gray-600">Resumo geral com estatísticas e KPIs principais</div>
              </div>
            </button>
            
            <button 
              className="btn btn-outline flex items-center gap-3 w-full justify-start p-4 h-auto" 
              onClick={() => handleConfirmPrint("filtrado")}
            >
              <FileText className="h-6 w-6 text-green-600" />
              <div className="text-left">
                <div className="font-bold text-lg">Relatório Filtrado</div>
                <div className="text-sm text-gray-600">Apenas materiais que correspondem aos filtros atuais</div>
              </div>
            </button>
            
            <button 
              className="btn btn-outline flex items-center gap-3 w-full justify-start p-4 h-auto" 
              onClick={() => handleConfirmPrint("comparativo")}
            >
              <FileText className="h-6 w-6 text-purple-600" />
              <div className="text-left">
                <div className="font-bold text-lg">Análise Comparativa</div>
                <div className="text-sm text-gray-600">Comparação entre tipos, estados e fornecedores</div>
              </div>
            </button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Dica:</strong> Os relatórios incluem automaticamente o logotipo da empresa, 
              estatísticas atualizadas e formatação profissional para impressão.
              <br />
              <strong>Nota:</strong> Para relatórios individuais, use o botão de arquivo em cada material.
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <button className="btn btn-outline" onClick={() => setShowPrintModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Partilha */}
      {showShareModal && sharingMaterial && (
        <ShareMaterialModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setSharingMaterial(null);
          }}
          material={sharingMaterial}
        />
      )}

      {/* Modal de Materiais Salvos */}
      {showSavedMateriais && (
        <SavedMateriaisViewer
          isOpen={showSavedMateriais}
          onClose={() => setShowSavedMateriais(false)}
        />
      )}

      {/* Modal de Visualização de Documentos */}
      {showDocumentsModal && viewingMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Documentos do Material: {viewingMaterial.codigo}
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
                    Visualize e faça download dos documentos associados a este material.
                  </p>
                </div>
                
                {/* Documentos do campo documents */}
                {(viewingMaterial as any).documents && (viewingMaterial as any).documents.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Documentos Anexados ({(viewingMaterial as any).documents.length})
                    </h4>
                    <div className="space-y-3">
                      {(viewingMaterial as any).documents.map((doc: any, index: number) => (
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
                                {doc.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {(doc.size / 1024 / 1024).toFixed(2)} MB
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

                {/* Anexos */}
                {viewingMaterial.anexos && viewingMaterial.anexos.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Anexos ({viewingMaterial.anexos.length})
                    </h4>
                    <div className="space-y-3">
                      {viewingMaterial.anexos.map((doc: any, index: number) => (
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
                                {doc.nome || `Anexo ${index + 1}`}
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
                                link.download = doc.nome || `anexo_${index + 1}`;
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
                {viewingMaterial.arquivo_url && (
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
                            Arquivo do Material
                          </p>
                          <p className="text-sm text-gray-500">
                            Documento principal
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(viewingMaterial.arquivo_url, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = viewingMaterial.arquivo_url!;
                            link.download = `material_${viewingMaterial.codigo}`;
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
                {(!viewingMaterial.anexos || viewingMaterial.anexos.length === 0) && 
                 !viewingMaterial.arquivo_url &&
                 (!(viewingMaterial as any).documents || (viewingMaterial as any).documents.length === 0) && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum documento carregado para este material</p>
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
