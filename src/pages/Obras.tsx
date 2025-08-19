import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building,
  CheckCircle,
  X,
  TrendingUp,
  Filter,
  Calendar,
  XCircle,
  FileText,
  Share2,
  Cloud,
  Download,
  Eye,
  Printer,
  Building2,
  DollarSign,
  Edit3,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";
import toast from "react-hot-toast";
import ObraForm from "@/components/forms/ObraForm";
import RelatorioObrasPremium from "@/components/RelatorioObrasPremium";
import { ShareObraModal } from "@/components/ShareObraModal";
import { SavedObrasViewer } from "@/components/SavedObrasViewer";
import { obrasAPI } from "@/lib/supabase-api";
import { PDFService } from "@/services/pdfService";
import { ShareService } from "@/services/shareService";
import { Link } from "react-router-dom";

// Dados mock iniciais para demonstração
const mockObras: any[] = [
  {
    id: "1",
    codigo: "OBR-2024-001",
    nome: "Edifício Residencial Solar",
    cliente: "Construtora ABC",
    localizacao: "Lisboa, Portugal",
    data_inicio: "2024-01-15",
    data_fim_prevista: "2024-12-31",
    valor_contrato: 2500000,
    valor_executado: 1250000,
    percentual_execucao: 50,
    status: "em_execucao",
    tipo_obra: "residencial",
    categoria: "grande",
    responsavel_tecnico: "Eng. João Silva",
    coordenador_obra: "Eng. Maria Santos",
    fiscal_obra: "Eng. Carlos Mendes",
    engenheiro_responsavel: "Eng. Ana Costa",
    arquiteto: "Arq. Pedro Alves",
    zonas: [],
    fases: [],
    equipas: [],
    fornecedores_principais: [],
    riscos: [],
    indicadores: [],
    responsavel: "Eng. João Silva",
    zona: "Lisboa",
    estado: "em_analise",
    data_criacao: "2024-01-15T09:00:00Z",
    data_atualizacao: "2024-01-15T09:00:00Z",
  },
  {
    id: "2",
    codigo: "OBR-2024-002",
    nome: "Centro Comercial Plaza",
    cliente: "Desenvolvimento XYZ",
    localizacao: "Porto, Portugal",
    data_inicio: "2024-02-01",
    data_fim_prevista: "2025-06-30",
    valor_contrato: 5000000,
    valor_executado: 750000,
    percentual_execucao: 15,
    status: "em_execucao",
    tipo_obra: "comercial",
    categoria: "mega",
    responsavel_tecnico: "Eng. Sofia Martins",
    coordenador_obra: "Eng. Ricardo Pereira",
    fiscal_obra: "Eng. Luísa Ferreira",
    engenheiro_responsavel: "Eng. Manuel Santos",
    arquiteto: "Arq. Teresa Silva",
    zonas: [],
    fases: [],
    equipas: [],
    fornecedores_principais: [],
    riscos: [],
    indicadores: [],
    responsavel: "Eng. Sofia Martins",
    zona: "Porto",
    estado: "em_analise",
    data_criacao: "2024-02-01T10:00:00Z",
    data_atualizacao: "2024-02-01T10:00:00Z",
  },
  {
    id: "3",
    codigo: "OBR-2024-003",
    nome: "Ponte Pedonal Rio",
    cliente: "Câmara Municipal",
    localizacao: "Coimbra, Portugal",
    data_inicio: "2024-03-01",
    data_fim_prevista: "2024-08-31",
    valor_contrato: 800000,
    valor_executado: 600000,
    percentual_execucao: 75,
    status: "em_execucao",
    tipo_obra: "infraestrutura",
    categoria: "media",
    responsavel_tecnico: "Eng. António Costa",
    coordenador_obra: "Eng. Filipa Santos",
    fiscal_obra: "Eng. João Pereira",
    engenheiro_responsavel: "Eng. Maria Silva",
    arquiteto: "Arq. Carlos Mendes",
    zonas: [],
    fases: [],
    equipas: [],
    fornecedores_principais: [],
    riscos: [],
    indicadores: [],
    responsavel: "Eng. António Costa",
    zona: "Coimbra",
    estado: "aprovado",
    data_criacao: "2024-03-01T08:00:00Z",
    data_atualizacao: "2024-03-01T08:00:00Z",
  },
];

export default function Obras() {
  const [obras, setObras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingRealData, setUsingRealData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingObra, setEditingObra] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showRelatorios, setShowRelatorios] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSavedObrasViewer, setShowSavedObrasViewer] = useState(false);

  // Filtros ativos
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    tipo_obra: "",
    categoria: "",
    cliente: "",
    responsavel_tecnico: "",
    dataInicio: "",
    dataFim: "",
  });

  // Carregar obras da API ao montar o componente
  useEffect(() => {
    const loadObras = async () => {
      try {
        setLoading(true);
        console.log("🔄 Carregando obras da Supabase...");
        
        const loadedObras = await obrasAPI.getAll();
        console.log("📊 Obras carregadas da Supabase:", loadedObras);
        
        if (loadedObras && loadedObras.length > 0) {
          console.log("✅ Usando dados reais da Supabase");
          setObras(loadedObras);
          setUsingRealData(true);
        } else {
          console.log("⚠️ Nenhuma obra encontrada na Supabase, usando dados mock para demonstração");
          setObras(mockObras);
          setUsingRealData(false);
          toast.success("Usando dados de demonstração - conecte-se à Supabase para dados reais");
        }
      } catch (error) {
        console.error("❌ Erro ao carregar obras da Supabase:", error);
        console.log("🔄 Usando dados mock devido ao erro");
        setObras(mockObras);
        setUsingRealData(false);
        toast.error("Erro ao carregar obras - usando dados de demonstração");
      } finally {
        setLoading(false);
      }
    };
    loadObras();
  }, []);

  const handleCreate = () => {
    setEditingObra(null);
    setShowModal(true);
  };

  const handleEdit = (obra: any) => {
    console.log("Função handleEdit chamada!");
    console.log("Editando obra:", obra);
    console.log("Nome da obra:", obra?.nome);
    
    try {
      setEditingObra(obra);
      setShowModal(true);
      toast.success(`Editando obra: ${obra?.nome || 'obra'}`);
    } catch (error) {
      console.error("Erro ao abrir modal:", error);
      toast.error("Erro ao abrir modal de edição");
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      console.log("Dados do formulário:", data);

      // Validação dos campos obrigatórios
      if (
        !data.codigo ||
        !data.nome ||
        !data.cliente ||
        !data.localizacao ||
        !data.data_inicio ||
        !data.data_fim_prevista ||
        !data.valor_contrato
      ) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      // Converter dados do formulário para o formato da API
      const obraData = {
        codigo: data.codigo,
        nome: data.nome,
        cliente: data.cliente,
        localizacao: data.localizacao,
        data_inicio: data.data_inicio,
        data_fim_prevista: data.data_fim_prevista,
        data_fim_real: data.data_fim_real,
        valor_contrato: Number(data.valor_contrato) || 0,
        valor_executado: Number(data.valor_executado) || 0,
        percentual_execucao: Number(data.percentual_execucao) || 0,
        status: data.status,
        tipo_obra: data.tipo_obra,
        categoria: data.categoria,
        responsavel_tecnico: data.responsavel_tecnico,
        coordenador_obra: data.coordenador_obra,
        fiscal_obra: data.fiscal_obra,
        engenheiro_responsavel: data.engenheiro_responsavel,
        arquiteto: data.arquiteto,
        fornecedores_principais: data.fornecedores_principais || [],
        observacoes: data.observacoes,
      };

      console.log("Dados convertidos para API:", obraData);

      if (editingObra) {
        // Atualizar obra existente
        const updatedObra = await obrasAPI.update(editingObra.id, obraData);
        if (updatedObra) {
          setObras(
            obras.map((o) => (o.id === editingObra.id ? updatedObra : o)),
          );
          toast.success("Obra atualizada com sucesso!");
        } else {
          toast.error("Erro ao atualizar obra");
        }
      } else {
        // Criar nova obra
        console.log("Tentando criar obra com dados:", obraData);

        // Verificar se o PocketBase está disponível
        try {
          const isAvailable = await fetch("http://localhost:8090/api/health")
            .then(() => true)
            .catch(() => false);
          console.log("PocketBase disponível:", isAvailable);
        } catch (e) {
          console.log("Erro ao verificar PocketBase:", e);
        }

        const newObra = await obrasAPI.create(obraData);
        console.log("Resultado da criação:", newObra);
        if (newObra) {
          setObras([...obras, newObra]);
          toast.success("Obra criada com sucesso!");
        } else {
          toast.error("Erro ao criar obra");
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao salvar obra:", error);
      if (error instanceof Error) {
        toast.error(`Erro ao salvar obra: ${error.message}`);
      } else {
        toast.error("Erro ao salvar obra");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta obra?")) {
      try {
        console.log("Excluindo obra com ID:", id);
        const success = await obrasAPI.delete(id);
        if (success) {
          setObras(obras.filter((o) => o.id !== id));
          toast.success("Obra excluída com sucesso!");
        } else {
          // Se a API falhar, remover da lista local para demonstração
          console.log("API falhou, removendo da lista local para demonstração");
          setObras(obras.filter((o) => o.id !== id));
          toast.success("Obra excluída com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao excluir obra:", error);
        // Para demonstração, remover da lista local mesmo com erro
        setObras(obras.filter((o) => o.id !== id));
        toast.success("Obra excluída com sucesso!");
      }
    }
  };

  const handleGenerateIndividualReport = async (obra: any) => {
    try {
      console.log("Gerando relatório individual para obra:", obra);
      const pdfService = new PDFService();

      await pdfService.generateObrasIndividualReport([obra]);
      toast.success(`Relatório individual gerado com sucesso para ${obra.nome}!`);
    } catch (error) {
      console.error("Erro ao gerar relatório individual:", error);
      toast.error("Erro ao gerar relatório individual");
    }
  };



  // Aplicar filtros
  const filteredObras = obras.filter((obra) => {
    const matchesSearch = !filters.search || 
      obra.nome?.toLowerCase().includes(filters.search.toLowerCase()) ||
      obra.codigo?.toLowerCase().includes(filters.search.toLowerCase()) ||
      obra.cliente?.toLowerCase().includes(filters.search.toLowerCase()) ||
      obra.localizacao?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = !filters.status || obra.status === filters.status;
    const matchesTipo = !filters.tipo_obra || obra.tipo_obra === filters.tipo_obra;
    const matchesCategoria = !filters.categoria || obra.categoria === filters.categoria;
    const matchesCliente = !filters.cliente || obra.cliente === filters.cliente;
    const matchesResponsavel = !filters.responsavel_tecnico || obra.responsavel_tecnico === filters.responsavel_tecnico;

    const matchesData = !filters.dataInicio || !filters.dataFim || 
      (obra.data_inicio >= filters.dataInicio && obra.data_inicio <= filters.dataFim);

    return matchesSearch && matchesStatus && matchesTipo && matchesCategoria && 
           matchesCliente && matchesResponsavel && matchesData;
  });

  // Obter valores únicos para os filtros
  const statusUnicos = [...new Set(obras.map(o => o.status).filter(Boolean))];
  const tiposUnicos = [...new Set(obras.map(o => o.tipo_obra).filter(Boolean))];
  const categoriasUnicas = [...new Set(obras.map(o => o.categoria).filter(Boolean))];
  const clientesUnicos = [...new Set(obras.map(o => o.cliente).filter(Boolean))];
  const responsaveisUnicos = [...new Set(obras.map(o => o.responsavel_tecnico).filter(Boolean))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em_execucao":
        return "bg-blue-100 text-blue-800";
      case "concluida":
        return "bg-green-100 text-green-800";
      case "paralisada":
        return "bg-yellow-100 text-yellow-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "em_execucao":
        return "Em Execução";
      case "concluida":
        return "Concluída";
      case "paralisada":
        return "Paralisada";
      case "cancelada":
        return "Cancelada";
      case "planeamento":
        return "Planeamento";
      default:
        return status;
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      tipo_obra: "",
      categoria: "",
      cliente: "",
      responsavel_tecnico: "",
      dataInicio: "",
      dataFim: "",
    });
  };

  const handleViewSavedObras = () => {
    setShowSavedObrasViewer(true);
  };

  // Funções de ação para os botões
  const handleEditObra = (obra: any) => {
    console.log("Editando obra:", obra);
    setEditingObra(obra);
    setShowModal(true);
    toast.success(`Editando obra: ${obra.nome}`);
  };

  const handleRelatorioObra = (obra: any) => {
    console.log("Gerando relatório para obra:", obra);
    setEditingObra(obra);
    setShowRelatorios(true);
    toast.success(`Gerando relatório para: ${obra.nome}`);
  };

  const handleExportObra = async (obra: any) => {
    console.log("Exportando obra:", obra);
    try {
      const pdfService = new PDFService();
      await pdfService.generateObrasIndividualReport([obra]);
      toast.success(`Obra ${obra.nome} exportada com sucesso!`);
    } catch (error) {
      console.error("Erro ao exportar obra:", error);
      toast.error("Erro ao exportar obra");
    }
  };

  const handleShareObra = (obra: any) => {
    console.log("Partilhando obra:", obra);
    setEditingObra(obra);
    setShowShareModal(true);
    toast.success(`Abrindo modal de partilha para ${obra.nome}`);
  };

  const handleDeleteObra = async (obra: any) => {
    console.log("Excluindo obra:", obra);
    if (confirm(`Tem certeza que deseja excluir a obra "${obra.nome}"?`)) {
      try {
        await obrasAPI.delete(obra.id);
        toast.success(`Obra ${obra.nome} excluída com sucesso!`);
        setObras(obras.filter((o) => o.id !== obra.id));
      } catch (error) {
        console.error("Erro ao excluir obra:", error);
        toast.error("Erro ao excluir obra");
      }
    }
  };

  const stats = {
    total: filteredObras.length,
    em_execucao: filteredObras.filter((o) => o.status === "em_execucao").length,
    concluidas: filteredObras.filter((o) => o.status === "concluida").length,
    valor_total: filteredObras.reduce((acc, o) => acc + o.valor_contrato, 0),
    valor_executado: filteredObras.reduce((acc, o) => acc + o.valor_executado, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-bounce"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Carregando obras...</p>
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-2">
              Gestão de Obras
            </h1>
            <p className="text-xl text-gray-600 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-500" />
              Controlo completo de projetos e obras em tempo real
            </p>
            {usingRealData ? (
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Dados Reais da Supabase</span>
              </div>
            ) : (
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-orange-600 font-medium">Dados de Demonstração</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/obras/nova"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Nova Obra
            </Link>
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
        {/* Total de Obras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group cursor-pointer relative"
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-3xl"></div>
            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+1</span>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total de Obras</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.total / 10) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Em Execução */}
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
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Em Execução</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.em_execucao}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.em_execucao / stats.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Concluídas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="group cursor-pointer relative"
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Concluídas</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.concluidas}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.concluidas / stats.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Valor Total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="group cursor-pointer relative"
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Valor Total</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.valor_total.toLocaleString('pt-PT')} €</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.valor_executado / stats.valor_total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Valor Executado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="group cursor-pointer relative"
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Executado</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.valor_executado.toLocaleString('pt-PT')} €</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.valor_executado / stats.valor_total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

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
            {filteredObras.length} obra(s) encontrada(s)
          </div>
        </div>
      </motion.div>

      {/* Lista de Obras - Ultra Premium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-6"
      >
        {filteredObras.map((obra, index) => (
          <motion.div
            key={obra.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 + index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/3 to-indigo-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Building2 className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{obra.nome}</h3>
                      <span className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg border border-blue-400/30">
                        {getStatusText(obra.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Código:</span>
                        <span>{obra.codigo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Cliente:</span>
                        <span>{obra.cliente}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Localização:</span>
                        <span>{obra.localizacao}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Responsável:</span>
                        <span>{obra.responsavel_tecnico}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Progresso</span>
                        <span className="text-sm font-bold text-blue-600">{obra.percentual_execucao}%</span>
                      </div>
                      <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-3 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden" 
                          style={{ width: `${obra.percentual_execucao}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => handleEditObra(obra)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        EDITAR
                      </button>
                      <button 
                        onClick={() => handleRelatorioObra(obra)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        RELATÓRIO
                      </button>
                      <button 
                        onClick={() => handleExportObra(obra)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        EXPORTAR
                      </button>
                      <button 
                        onClick={() => handleShareObra(obra)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        PARTILHAR
                      </button>
                      <button 
                        onClick={() => handleDeleteObra(obra)}
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

      {/* Modais e Componentes */}
      <AnimatePresence>
        {/* Modal de Edição */}
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ObraForm
                initialData={editingObra}
                onSubmit={async (data) => {
                  try {
                    if (editingObra) {
                      await obrasAPI.update(editingObra.id, data);
                      toast.success('Obra atualizada com sucesso!');
                    } else {
                      await obrasAPI.create(data);
                      toast.success('Obra criada com sucesso!');
                    }
                    setShowModal(false);
                    // Recarregar obras
                    const loadedObras = await obrasAPI.getAll();
                    setObras(loadedObras || mockObras);
                  } catch (error) {
                    console.error('Erro ao salvar obra:', error);
                    toast.error('Erro ao salvar obra');
                  }
                }}
                onCancel={() => setShowModal(false)}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Modal de Relatórios */}
        {showRelatorios && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRelatorios(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <RelatorioObrasPremium
                obras={editingObra ? [editingObra] : obras}
                onClose={() => setShowRelatorios(false)}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Modal de Partilha */}
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <ShareObraModal
                obra={editingObra}
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Modal de Obras Guardadas */}
        {showSavedObrasViewer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSavedObrasViewer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <SavedObrasViewer
                isOpen={showSavedObrasViewer}
                onClose={() => setShowSavedObrasViewer(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
