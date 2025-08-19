import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  FileText,
  Eye,
  Download,
  Calendar,
  MapPin,
  TestTube,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  X,
  Share2,
  Cloud,
  ArrowUpRight,
  BarChart3,
  Shield,
} from "lucide-react";
import { ensaiosAPI } from "@/lib/supabase-api";
import { toast } from "react-hot-toast";
import EnsaioForm from "@/components/forms/EnsaioForm";
import Modal from "@/components/Modal";
import RelatorioEnsaiosPremium from "@/components/RelatorioEnsaiosPremium";
import { ShareEnsaioModal } from "@/components/ShareEnsaioModal";
import { SavedEnsaiosViewer } from "@/components/SavedEnsaiosViewer";
import { AnimatePresence, motion } from "framer-motion";
import PDFService from "@/services/pdfService";
import { ShareService } from "@/services/shareService";
import { EnsaioDashboard } from "@/components/EnsaioDashboard";

export default function Ensaios() {
  const [ensaios, setEnsaios] = useState<any[]>([]); // Changed type to any[] as Ensaio type is removed
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEnsaio, setEditingEnsaio] = useState<any>(null);
  const [showRelatorioPremium, setShowRelatorioPremium] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSavedEnsaiosViewer, setShowSavedEnsaiosViewer] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // Filtros ativos
  const [filters, setFilters] = useState({
    search: "",
    tipo: "",
    estado: "",
    zona: "",
    laboratorio: "",
    conforme: "",
    responsavel: "",
    dataInicio: "",
    dataFim: "",
  });

  useEffect(() => {
    loadEnsaios();
  }, []);

  const loadEnsaios = async () => {
    try {
      setLoading(true);
      const data = await ensaiosAPI.getAll();
      setEnsaios(data);
    } catch (error) {
      console.error("Erro ao carregar ensaios:", error);
      toast.error("Erro ao carregar ensaios");
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros
  const filteredEnsaios = ensaios.filter((ensaio) => {
    const matchesSearch = !filters.search || 
      ensaio.codigo?.toLowerCase().includes(filters.search.toLowerCase()) ||
      ensaio.tipo?.toLowerCase().includes(filters.search.toLowerCase()) ||
      ensaio.laboratorio?.toLowerCase().includes(filters.search.toLowerCase()) ||
      ensaio.responsavel?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesTipo = !filters.tipo || ensaio.tipo === filters.tipo;
    const matchesEstado = !filters.estado || ensaio.estado === filters.estado;
    const matchesZona = !filters.zona || ensaio.zona === filters.zona;
    const matchesLaboratorio = !filters.laboratorio || ensaio.laboratorio === filters.laboratorio;
    
    const matchesConforme = filters.conforme === "" || 
      (filters.conforme === "true" && ensaio.conforme) ||
      (filters.conforme === "false" && !ensaio.conforme);

    const matchesData = !filters.dataInicio || !filters.dataFim || 
      (ensaio.data_ensaio >= filters.dataInicio && ensaio.data_ensaio <= filters.dataFim);

    return matchesSearch && matchesTipo && matchesEstado && matchesZona && 
           matchesLaboratorio && matchesConforme && matchesData;
  });

  // Obter valores únicos para os filtros
  const tiposUnicos = [...new Set(ensaios.map(e => e.tipo).filter(Boolean))];
  const estadosUnicos = [...new Set(ensaios.map(e => e.estado).filter(Boolean))];
  const zonasUnicas = [...new Set(ensaios.map(e => e.zona).filter(Boolean))];
  const laboratoriosUnicos = [...new Set(ensaios.map(e => e.laboratorio).filter(Boolean))];
  const responsaveisUnicos = [...new Set(ensaios.map(e => e.responsavel).filter(Boolean))];

  // Opções completas baseadas no formulário
  const tipoOptions = [
    "Ensaio de Resistência à Compressão",
    "Ensaio de Resistência à Tração",
    "Ensaio de Flexão",
    "Ensaio de Densidade",
    "Ensaio de Absorção",
    "Ensaio de Permeabilidade",
    "Ensaio de Durabilidade",
    "Ensaio de Consistência",
    "Ensaio de Slump",
    "Ensaio de Temperatura",
    "Ensaio de Umidade",
    "Ensaio de Granulometria",
    "Ensaio de Adensamento",
    "Ensaio de Cisalhamento",
    "Ensaio de Penetração",
    "Outro"
  ];

  const estadoOptions = [
    "pendente",
    "em_analise",
    "aprovado",
    "reprovado",
    "concluido"
  ];

  const zonaOptions = [
    "Zona A - Fundações",
    "Zona B - Pilares",
    "Zona C - Lajes",
    "Zona D - Estrutura",
    "Armazém Central",
    "Laboratório",
    "Escritório",
    "Outro"
  ];

  const laboratorioOptions = [
    "Laboratório Central",
    "Laboratório de Obra",
    "Laboratório Externo - CEM",
    "Laboratório Externo - LNEC",
    "Laboratório Externo - IST",
    "Laboratório Externo - FEUP",
    "Laboratório Externo - FCT",
    "Laboratório Externo - UA",
    "Laboratório Externo - UC",
    "Laboratório Externo - UMinho",
    "Laboratório Externo - UPorto",
    "Laboratório Externo - ULisboa",
    "Laboratório Externo - UAlgarve",
    "Laboratório Externo - UÉvora",
    "Laboratório Externo - UCoimbra",
    "Laboratório Externo - UBraga",
    "Laboratório Externo - UAveiro",
    "Laboratório Externo - UBI",
    "Laboratório Externo - UMaia",
    "Outro"
  ];

  const handleCreate = () => {
    setEditingEnsaio(null);
    setShowForm(true);
  };

  const handleEdit = (ensaio: any) => {
    // Changed type to any
    setEditingEnsaio(ensaio);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      console.log("Dados recebidos do formulário de ensaio:", data);

      // Filtrar apenas os campos válidos do schema Supabase
      let material_id = data.material_id;

      // Verificar se material_id é um UUID válido ou null
      if (
        !material_id ||
        material_id === "" ||
        material_id === "undefined" ||
        material_id === "null"
      ) {
        material_id = null;
      } else if (
        typeof material_id === "string" &&
        !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
          material_id,
        )
      ) {
        console.log(
          "material_id inválido, convertendo para null:",
          material_id,
        );
        material_id = null;
      }

      const ensaioData = {
        codigo: data.codigo,
        tipo: data.tipo,
        data_ensaio: data.data_ensaio,
        laboratorio: data.laboratorio,
        responsavel: data.responsavel,
        valor_esperado: data.valor_esperado,
        valor_obtido: data.valor_obtido,
        unidade: data.unidade,
        conforme: data.conforme,
        estado: data.estado,
        zona: data.zona,
        observacoes: data.observacoes,
        material_id: material_id,
        resultado: data.resultado || `${data.valor_obtido} ${data.unidade}`,
        documents: data.documents || [], // Incluir documentos
        seguimento: data.seguimento || [], // Incluir seguimento
        contextoAdicional: data.contextoAdicional || [], // Incluir contexto adicional
      };

      if (editingEnsaio) {
        await ensaiosAPI.update(editingEnsaio.id, ensaioData);
        toast.success("Ensaio atualizado com sucesso!");
      } else {
        await ensaiosAPI.create(ensaioData);
        toast.success("Ensaio criado com sucesso!");
      }

      setShowForm(false);
      loadEnsaios();
    } catch (error) {
      console.error("Erro ao salvar ensaio:", error);
      toast.error("Erro ao salvar ensaio");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este ensaio?")) {
      try {
        await ensaiosAPI.delete(id);
        toast.success("Ensaio excluído com sucesso!");
        loadEnsaios();
      } catch (error) {
        console.error("Erro ao excluir ensaio:", error);
        toast.error("Erro ao excluir ensaio");
      }
    }
  };

  const handleGenerateIndividualReport = async (ensaio: any) => {
    try {
      const pdfService = new PDFService();
      await pdfService.generateEnsaiosIndividualReport([ensaio]);
    } catch (error) {
      console.error("Erro ao gerar relatório individual:", error);
      toast.error("Erro ao gerar relatório");
    }
  };

  const handleShareEnsaio = async (ensaio: any) => {
    setEditingEnsaio(ensaio);
    setShowShareModal(true);
  };

  const handleViewSavedEnsaios = () => {
    setShowSavedEnsaiosViewer(true);
  };

  const handleViewDocuments = (ensaio: any) => {
    if (ensaio.documents && ensaio.documents.length > 0) {
      // Abrir modal para visualizar documentos
      setEditingEnsaio(ensaio);
      setShowDocumentsModal(true);
    } else {
      toast("Este ensaio não possui documentos carregados");
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      tipo: "",
      estado: "",
      zona: "",
      laboratorio: "",
      conforme: "",
      responsavel: "",
      dataInicio: "",
      dataFim: "",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <TestTube className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-bounce"></div>
          </div>
          <p className="text-gray-600 mt-6 font-medium text-lg">Carregando ensaios...</p>
          <div className="mt-4 flex justify-center">
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state quando não há ensaios
  if (ensaios.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pt-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-900 bg-clip-text text-transparent mb-2">
                Gestão de Ensaios
              </h1>
              <p className="text-xl text-gray-600 flex items-center">
                <TestTube className="h-5 w-5 mr-2 text-purple-500" />
                Controlo laboratorial e análise de qualidade em tempo real
              </p>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center min-h-[60vh]"
        >
          <div className="text-center max-w-md">
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center mx-auto">
                <TestTube className="h-16 w-16 text-purple-500" />
              </div>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Nenhum Ensaio Encontrado
            </h2>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Comece a criar ensaios para monitorizar a qualidade dos seus materiais e estruturas. 
              O sistema irá ajudá-lo a manter o controlo de qualidade em conformidade com as normas europeias.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowForm(true)}
                className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
              >
                <Plus className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                Criar Primeiro Ensaio
              </button>
              
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>Conformidade EN/ISO</span>
                </div>
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                  <span>Relatórios Avançados</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-purple-500" />
                  <span>Controlo de Qualidade</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Modal de Formulário */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Novo Ensaio
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <EnsaioForm
                  onSubmit={handleFormSubmit}
                  onCancel={() => setShowForm(false)}
                  initialData={undefined}
                  isEditing={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Calcular estatísticas
  const stats = {
    total: filteredEnsaios.length,
    conformes: filteredEnsaios.filter((e) => e.conforme).length,
    nao_conformes: filteredEnsaios.filter((e) => !e.conforme).length,
    em_analise: filteredEnsaios.filter((e) => e.estado === "em_analise").length,
    concluidos: filteredEnsaios.filter((e) => e.estado === "concluido").length,
  };

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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-900 bg-clip-text text-transparent mb-2">
              Gestão de Ensaios
            </h1>
            <p className="text-xl text-gray-600 flex items-center">
              <TestTube className="h-5 w-5 mr-2 text-purple-500" />
              Controlo laboratorial e análise de qualidade em tempo real
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <BarChart3 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              {showDashboard ? 'Lista' : 'Dashboard'}
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Novo Ensaio
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
        {/* Total de Ensaios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group cursor-pointer relative"
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-3xl"></div>
            <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TestTube className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+{stats.total}</span>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total de Ensaios</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.total / 100) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ensaios Conformes */}
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
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Conformes</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.conformes}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.conformes / stats.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ensaios Não Conformes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
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
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Não Conformes</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.nao_conformes}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.nao_conformes / stats.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Em Análise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Em Análise</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.em_analise}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.em_analise / stats.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Concluídos */}
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
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Concluídos</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.concluidos}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.concluidos / stats.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Conteúdo principal - Dashboard ou Lista */}
      {showDashboard ? (
        <EnsaioDashboard
          ensaios={filteredEnsaios}
          onSearch={(query, options) => {
            setFilters(prev => ({ ...prev, search: query }));
          }}
          onFilterChange={(newFilters) => {
            setFilters(prev => ({ ...prev, ...newFilters }));
          }}
        />
      ) : (
        <>
          {/* Botões de ação */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleCreate}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Novo Ensaio</span>
            </button>

            <button
              onClick={() => setShowRelatorioPremium(true)}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Relatórios PDF</span>
            </button>

            <button
              onClick={handleViewSavedEnsaios}
              className="btn btn-outline flex items-center space-x-2"
            >
              <Cloud className="h-4 w-4" />
              <span>Ver Salvos</span>
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </button>
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
                    placeholder="Pesquisar ensaios..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="input pl-10 w-full"
                  />
                </div>

                {/* Tipo */}
                <select
                  value={filters.tipo}
                  onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                  className="input"
                >
                  <option value="">Todos os tipos</option>
                  {tipoOptions.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>

                {/* Estado */}
                <select
                  value={filters.estado}
                  onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                  className="input"
                >
                  <option value="">Todos os estados</option>
                  {estadoOptions.map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>

                {/* Zona */}
                <select
                  value={filters.zona}
                  onChange={(e) => setFilters({ ...filters, zona: e.target.value })}
                  className="input"
                >
                  <option value="">Todas as zonas</option>
                  {zonasUnicas.map((zona) => (
                    <option key={zona} value={zona}>{zona}</option>
                  ))}
                </select>

                {/* Responsável */}
                <select
                  value={filters.responsavel}
                  onChange={(e) => setFilters({ ...filters, responsavel: e.target.value })}
                  className="input"
                >
                  <option value="">Todos os responsáveis</option>
                  {responsaveisUnicos.map((responsavel) => (
                    <option key={responsavel} value={responsavel}>{responsavel}</option>
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

      {/* Filtros e Ações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <FileText className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Cloud className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {filteredEnsaios.length} ensaio(s) encontrado(s)
          </div>
        </div>
      </motion.div>

      {/* Lista de Ensaios - Ultra Premium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-6"
      >
        {filteredEnsaios.map((ensaio, index) => (
          <motion.div
            key={ensaio.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 + index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 via-pink-500/3 to-rose-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <TestTube className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{ensaio.codigo}</h3>
                      <span className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg border ${
                        ensaio.conforme 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400/30'
                          : 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-red-400/30'
                      }`}>
                        {ensaio.conforme ? 'Conforme' : 'Não Conforme'}
                      </span>
                      <span className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg border border-blue-400/30">
                        {ensaio.estado}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Tipo:</span>
                        <span>{ensaio.tipo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Laboratório:</span>
                        <span>{ensaio.laboratorio}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Responsável:</span>
                        <span>{ensaio.responsavel}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Data:</span>
                        <span>{ensaio.data_ensaio}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Resultado</span>
                        <span className={`text-sm font-bold ${
                          ensaio.conforme ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {ensaio.conforme ? '✓ Aprovado' : '✗ Reprovado'}
                        </span>
                      </div>
                      <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-3 shadow-inner">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden ${
                            ensaio.conforme 
                              ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                              : 'bg-gradient-to-r from-red-500 to-rose-500'
                          }`}
                          style={{ width: ensaio.conforme ? '100%' : '100%' }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => handleEdit(ensaio)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        EDITAR
                      </button>
                      <button 
                        onClick={() => handleViewDocuments(ensaio)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        VER
                      </button>
                      <button 
                        onClick={() => handleGenerateIndividualReport(ensaio)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        RELATÓRIO
                      </button>
                      <button 
                        onClick={() => handleShareEnsaio(ensaio)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        PARTILHAR
                      </button>
                      <button 
                        onClick={() => handleDelete(ensaio.id)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        EXCLUIR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal de Relatório Premium */}
      {showRelatorioPremium && (
        <RelatorioEnsaiosPremium
          ensaios={filteredEnsaios}
          onClose={() => setShowRelatorioPremium(false)}
        />
      )}

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingEnsaio ? "Editar Ensaio" : "Novo Ensaio"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <EnsaioForm
                onSubmit={handleFormSubmit}
                onCancel={() => setShowForm(false)}
                initialData={editingEnsaio || undefined}
                isEditing={!!editingEnsaio}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Compartilhamento */}
      {showShareModal && (
        <ShareEnsaioModal
          ensaio={editingEnsaio}
          onClose={() => setShowShareModal(false)}
          isOpen={showShareModal}
        />
      )}

      {/* Modal de Visualização de Ensaios Salvos */}
      {showSavedEnsaiosViewer && (
        <SavedEnsaiosViewer
          isOpen={showSavedEnsaiosViewer}
          onClose={() => setShowSavedEnsaiosViewer(false)}
        />
      )}

      {/* Modal de Visualização de Documentos */}
      {showDocumentsModal && editingEnsaio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Documentos do Ensaio: {editingEnsaio.codigo}
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
                    Documentos Carregados ({editingEnsaio.documents?.length || 0})
                  </h3>
                  <p className="text-sm text-gray-600">
                    Visualize e faça download dos documentos associados a este ensaio.
                  </p>
                </div>
                
                {editingEnsaio.documents && editingEnsaio.documents.length > 0 ? (
                  <div className="space-y-3">
                    {editingEnsaio.documents.map((doc: any, index: number) => (
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
                              {(doc.size / 1024).toFixed(2)} KB
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
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum documento carregado para este ensaio</p>
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
