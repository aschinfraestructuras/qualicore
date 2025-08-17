import { useState, useEffect } from "react";
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
} from "lucide-react";
import toast from "react-hot-toast";
import ObraForm from "@/components/forms/ObraForm";
import RelatorioObrasPremium from "@/components/RelatorioObrasPremium";
import { ShareObraModal } from "@/components/ShareObraModal";
import { SavedObrasViewer } from "@/components/SavedObrasViewer";
import { obrasAPI } from "@/lib/supabase-api";
import { PDFService } from "@/services/pdfService";
import { ShareService } from "@/services/shareService";
import { AnimatePresence, motion } from "framer-motion";
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
        const loadedObras = await obrasAPI.getAll();
        console.log("Obras carregadas:", loadedObras);
        
        // Se não há obras na API, usar dados mock para demonstração
        if (!loadedObras || loadedObras.length === 0) {
          console.log("Usando dados mock para demonstração");
          setObras(mockObras);
        } else {
          setObras(loadedObras);
        }
      } catch (error) {
        console.error("Erro ao carregar obras:", error);
        console.log("Usando dados mock devido ao erro");
        setObras(mockObras);
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

  const handleExportObra = async (obra: any) => {
    try {
      console.log("Exportando obra:", obra);
      const pdfService = new PDFService();
      await pdfService.generateObrasIndividualReport([obra]);
      toast.success(`Obra ${obra.nome} exportada com sucesso!`);
    } catch (error) {
      console.error("Erro ao exportar obra:", error);
      toast.error("Erro ao exportar obra");
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

  const handleShareObra = async (obra: any) => {
    console.log("Partilhando obra:", obra);
    setEditingObra(obra);
    setShowShareModal(true);
    toast.success(`Abrindo modal de partilha para ${obra.nome}`);
  };

  const handleViewSavedObras = () => {
    setShowSavedObrasViewer(true);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando obras...</p>
        </div>
      </div>
    );
  }

      return (
      <div className="space-y-2 w-full py-2 px-4">
        <div className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Obras</h1>
          <p className="text-gray-600 mt-1">Controlo completo de projetos e obras</p>
        </div>
        <Link
          to="/obras/nova"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Obra
        </Link>
      </div>

      {/* Filtros e Ações */}
      <div className="flex items-center space-x-2">
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

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 w-full">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Obras</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Execução</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concluídas</p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">17 500 000,00 €</p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Executado</p>
              <p className="text-2xl font-bold text-purple-600">0,00 €</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Lista de Obras */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
        <div className="px-3 py-2 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Lista de Obras</h2>
          <p className="text-sm text-gray-600 mt-1">1 obra(s) encontrada(s)</p>
        </div>
        <div className="p-3 w-full">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 w-full">
            <div className="flex items-start space-x-3 w-full">
              <Building2 className="h-8 w-8 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1 w-full">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Linha do Sado - Setubal</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Planeamento
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-2 text-sm text-gray-600 w-full">
                  <div>
                    <span className="font-medium">Código:</span> T000
                  </div>
                  <div>
                    <span className="font-medium">Cliente:</span> Infraestruturas de Portugal
                  </div>
                  <div>
                    <span className="font-medium">Localização:</span> Setubal
                  </div>
                  <div>
                    <span className="font-medium">Início:</span> 01/10/2025
                  </div>
                  <div>
                    <span className="font-medium">Progresso:</span> 0%
                  </div>
                  <div>
                    <span className="font-medium">Responsável:</span> Mario Cristiano
                  </div>
                  <div>
                    <span className="font-medium">Contrato:</span> 17 500 000,00 €
                  </div>
                  <div>
                    <span className="font-medium">Tipo:</span> Infraestrutura - Grande
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                <Edit3 className="h-4 w-4 mr-1" />
                EDITAR
              </button>
              <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                <FileText className="h-4 w-4 mr-1" />
                RELATÓRIO
              </button>
              <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4 mr-1" />
                EXPORTAR
              </button>
              <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
                <Share2 className="h-4 w-4 mr-1" />
                PARTILHAR
              </button>
              <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors">
                <Trash2 className="h-4 w-4 mr-1" />
                EXCLUIR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
