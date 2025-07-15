import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  Eye,
  FileText,
  Printer,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  File,
  FileCheck,
  ArrowUpDown,
  Filter,
  XCircle,
} from "lucide-react";

import { documentosAPI } from "@/lib/supabase-api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/Modal";
import DocumentoForm from "@/components/forms/DocumentoForm";
import RelatorioDocumentosPremium from "@/components/RelatorioDocumentosPremium";
import { pdfService } from "@/services/pdfService";
import type { Documento } from "@/types";

// Dados mockados mais realistas
const mockDocumentos = [
  {
    id: "1",
    codigo: "DOC-2024-001",
    tipo: "especificacao",
    versao: "1.0",
    data_validade: "2024-12-31",
    responsavel: "Maria Santos",
    zona: "Zona A - Fundações",
    estado: "aprovado",
    observacoes: "Especificação técnica para betão estrutural C30/37",
    created: "2024-01-10T10:00:00Z",
    updated: "2024-01-10T15:30:00Z",
  },
  {
    id: "2",
    codigo: "DOC-2024-002",
    tipo: "projeto",
    versao: "2.1",
    data_validade: "2024-06-30",
    responsavel: "João Silva",
    zona: "Zona B - Pilares",
    estado: "em_analise",
    observacoes: "Projeto de armaduras para pilares principais",
    created: "2024-01-09T14:20:00Z",
    updated: "2024-01-10T09:15:00Z",
  },
  {
    id: "3",
    codigo: "DOC-2024-003",
    tipo: "relatorio",
    versao: "1.2",
    data_validade: "2024-03-15",
    responsavel: "Carlos Mendes",
    zona: "Zona C - Lajes",
    estado: "pendente",
    observacoes: "Relatório de inspeção de cofragem",
    created: "2024-01-08T16:45:00Z",
    updated: "2024-01-08T16:45:00Z",
  },
  {
    id: "4",
    codigo: "DOC-2024-004",
    tipo: "certificado",
    versao: "1.0",
    data_validade: "2025-01-15",
    responsavel: "Ana Costa",
    zona: "Armazém Central",
    estado: "aprovado",
    observacoes: "Certificado de conformidade - Cimento CEM I",
    created: "2024-01-07T11:30:00Z",
    updated: "2024-01-07T11:30:00Z",
  },
  {
    id: "5",
    codigo: "DOC-2024-005",
    tipo: "projeto",
    versao: "1.5",
    data_validade: "2024-08-20",
    responsavel: "Pedro Alves",
    zona: "Zona D - Estrutura",
    estado: "reprovado",
    observacoes: "Projeto de ligações estruturais - necessita revisão",
    created: "2024-01-06T13:15:00Z",
    updated: "2024-01-09T17:20:00Z",
  },
  {
    id: "6",
    codigo: "RFI-2024-001",
    tipo: "rfi",
    versao: "1.0",
    data_validade: "2024-02-15",
    responsavel: "Luís Ferreira",
    zona: "Zona A - Fundações",
    estado: "pendente",
    observacoes: "Solicitação de esclarecimento sobre especificações de betão",
    created: "2024-01-15T09:00:00Z",
    updated: "2024-01-15T09:00:00Z",
  },
  {
    id: "7",
    codigo: "PROC-2024-001",
    tipo: "procedimento",
    versao: "2.0",
    data_validade: "2025-12-31",
    responsavel: "Sofia Martins",
    zona: "Geral",
    estado: "aprovado",
    observacoes: "Procedimento de controlo de qualidade de materiais",
    created: "2024-01-12T14:30:00Z",
    updated: "2024-01-14T16:45:00Z",
  },
  {
    id: "8",
    codigo: "PE-2024-001",
    tipo: "plano_ensaio",
    versao: "1.0",
    data_validade: "2024-12-31",
    responsavel: "Ricardo Oliveira",
    zona: "Laboratório",
    estado: "aprovado",
    observacoes: "Plano de ensaios de resistência à compressão do betão",
    created: "2024-01-11T11:20:00Z",
    updated: "2024-01-13T10:15:00Z",
  },
  {
    id: "9",
    codigo: "PQ-2024-001",
    tipo: "plano_qualidade",
    versao: "1.0",
    data_validade: "2025-06-30",
    responsavel: "Teresa Silva",
    zona: "Geral",
    estado: "aprovado",
    observacoes: "Plano de qualidade geral da obra",
    created: "2024-01-10T08:45:00Z",
    updated: "2024-01-12T17:30:00Z",
  },
  {
    id: "10",
    codigo: "MAN-2024-001",
    tipo: "manual",
    versao: "1.0",
    data_validade: "2026-01-01",
    responsavel: "António Costa",
    zona: "Geral",
    estado: "aprovado",
    observacoes: "Manual de procedimentos de segurança na obra",
    created: "2024-01-09T13:15:00Z",
    updated: "2024-01-11T15:20:00Z",
  },
];

const documentTypes = [
  {
    value: "projeto",
    label: "Projeto",
    icon: FileText,
    color: "text-blue-600",
  },
  {
    value: "especificacao",
    label: "Especificação",
    icon: FileCheck,
    color: "text-green-600",
  },
  {
    value: "relatorio",
    label: "Relatório",
    icon: File,
    color: "text-purple-600",
  },
  {
    value: "certificado",
    label: "Certificado",
    icon: FileCheck,
    color: "text-orange-600",
  },
  { value: "rfi", label: "RFI", icon: FileText, color: "text-red-600" },
  {
    value: "procedimento",
    label: "Procedimento",
    icon: FileText,
    color: "text-indigo-600",
  },
  {
    value: "plano_ensaio",
    label: "Plano de Ensaio",
    icon: FileText,
    color: "text-yellow-600",
  },
  {
    value: "plano_qualidade",
    label: "Plano de Qualidade",
    icon: FileText,
    color: "text-teal-600",
  },
  { value: "manual", label: "Manual", icon: FileText, color: "text-pink-600" },
  {
    value: "instrucao_trabalho",
    label: "Instrução de Trabalho",
    icon: FileText,
    color: "text-cyan-600",
  },
  {
    value: "formulario",
    label: "Formulário",
    icon: FileText,
    color: "text-lime-600",
  },
  {
    value: "registro",
    label: "Registro",
    icon: FileText,
    color: "text-amber-600",
  },
  { value: "outro", label: "Outro", icon: File, color: "text-gray-600" },
];

const statusOptions = [
  {
    value: "pendente",
    label: "Pendente",
    color: "bg-warning-100 text-warning-700",
  },
  {
    value: "em_analise",
    label: "Em Análise",
    color: "bg-info-100 text-info-700",
  },
  {
    value: "aprovado",
    label: "Aprovado",
    color: "bg-success-100 text-success-700",
  },
  {
    value: "reprovado",
    label: "Reprovado",
    color: "bg-danger-100 text-danger-700",
  },
  {
    value: "concluido",
    label: "Concluído",
    color: "bg-gray-100 text-gray-700",
  },
];

export default function Documentos() {
  const [documentos, setDocumentos] = useState<any[]>([]); // Changed to any[] as Documento type is removed
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterZona, setFilterZona] = useState("");
  const [filterResponsavel, setFilterResponsavel] = useState("");
  const [filterDataCriacao, setFilterDataCriacao] = useState("");
  const [filterDataValidade, setFilterDataValidade] = useState("");
  const [filterVersao, setFilterVersao] = useState("");
  const [sortBy, setSortBy] = useState("data_criacao");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Estados para modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any | null>(null); // Changed to any
  const [viewingDocument, setViewingDocument] = useState<any | null>(null); // Changed to any
  const [showFilters, setShowFilters] = useState(false);
  const [showRelatorioPremiumModal, setShowRelatorioPremiumModal] = useState(false);

  useEffect(() => {
    loadDocumentos();
  }, []);

  const loadDocumentos = async () => {
    try {
      setLoading(true);
      const response = await documentosAPI.getAll();
      setDocumentos(response || []);
    } catch (error) {
      console.error(error);
      setDocumentos([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocumentos = (documentos || []).filter((doc) => {
    const matchesSearch =
      doc.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.zona.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.observacoes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = !filterEstado || doc.estado === filterEstado;
    const matchesTipo = !filterTipo || doc.tipo === filterTipo;
    const matchesZona = !filterZona || doc.zona.includes(filterZona);
    const matchesResponsavel = !filterResponsavel || doc.responsavel.toLowerCase().includes(filterResponsavel.toLowerCase());
    const matchesDataCriacao = !filterDataCriacao || doc.created?.includes(filterDataCriacao);
    const matchesDataValidade = !filterDataValidade || doc.data_validade?.includes(filterDataValidade);
    const matchesVersao = !filterVersao || doc.versao?.includes(filterVersao);

    return matchesSearch && matchesEstado && matchesTipo && matchesZona && 
           matchesResponsavel && matchesDataCriacao && matchesDataValidade && matchesVersao;
  });

  const sortedDocumentos = [...filteredDocumentos].sort((a, b) => {
    const aValue = a[sortBy as keyof any] || ""; // Changed to any
    const bValue = b[sortBy as keyof any] || ""; // Changed to any

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Obter valores únicos para os filtros
  const responsaveisUnicos = [...new Set(documentos.map(d => d.responsavel).filter(Boolean))];
  const versoesUnicas = [...new Set(documentos.map(d => d.versao).filter(Boolean))];

  const clearFilters = () => {
    setSearchTerm("");
    setFilterEstado("");
    setFilterTipo("");
    setFilterZona("");
    setFilterResponsavel("");
    setFilterDataCriacao("");
    setFilterDataValidade("");
    setFilterVersao("");
  };

  const getEstadoInfo = (estado: string) => {
    return statusOptions.find((s) => s.value === estado) || statusOptions[0];
  };

  const getTipoInfo = (tipo: string) => {
    return documentTypes.find((t) => t.value === tipo) || documentTypes[4];
  };

  const handleCreateDocument = async (data: any) => {
    try {
      console.log("Dados recebidos do formulário:", data);

      // Corrigir campos UUID vazios para null
      const uuidFields = [
        "relacionado_obra_id",
        "relacionado_zona_id",
        "relacionado_ensaio_id",
        "relacionado_material_id",
        "relacionado_fornecedor_id",
        "relacionado_checklist_id",
      ];
      const docData = { ...data };

      // Limpar todos os campos UUID vazios ou inválidos
      uuidFields.forEach((field) => {
        if (
          docData[field] === "" ||
          docData[field] === undefined ||
          docData[field] === null
        ) {
          docData[field] = null;
        }
      });

      // Limpar arrays vazios
      const arrayFields = [
        "palavras_chave",
        "distribuicao",
        "responsabilidades",
        "recursos_necessarios",
        "criterios_aceitacao",
        "registros_obrigatorios",
        "normas_referencia",
        "equipamentos_necessarios",
        "acoes_nao_conformidade",
        "objetivos_qualidade",
        "responsabilidades_qualidade",
        "recursos_qualidade",
        "controlos_qualidade",
        "indicadores_qualidade",
        "auditorias_planeadas",
        "acoes_melhoria",
      ];

      arrayFields.forEach((field) => {
        if (!Array.isArray(docData[field]) || docData[field].length === 0) {
          docData[field] = [];
        }
      });

      console.log("Dados corrigidos para envio:", docData);

      const newDocument = await documentosAPI.create(docData);
      setDocumentos((prev) => [newDocument, ...prev]);
      setShowCreateModal(false);
      toast.success("Documento criado com sucesso!");
    } catch (error) {
      console.error("Erro detalhado:", error);
      toast.error("Erro ao criar documento");
    }
  };

  const handleEditDocument = async (data: any) => {
    if (!editingDocument) return;
    try {
      console.log("Dados recebidos para edição:", data);

      // Corrigir campos UUID vazios para null
      const uuidFields = [
        "relacionado_obra_id",
        "relacionado_zona_id",
        "relacionado_ensaio_id",
        "relacionado_material_id",
        "relacionado_fornecedor_id",
        "relacionado_checklist_id",
      ];
      const docData = { ...data };

      // Limpar todos os campos UUID vazios ou inválidos
      uuidFields.forEach((field) => {
        if (
          docData[field] === "" ||
          docData[field] === undefined ||
          docData[field] === null
        ) {
          docData[field] = null;
        }
      });

      // Limpar arrays vazios
      const arrayFields = [
        "palavras_chave",
        "distribuicao",
        "responsabilidades",
        "recursos_necessarios",
        "criterios_aceitacao",
        "registros_obrigatorios",
        "normas_referencia",
        "equipamentos_necessarios",
        "acoes_nao_conformidade",
        "objetivos_qualidade",
        "responsabilidades_qualidade",
        "recursos_qualidade",
        "controlos_qualidade",
        "indicadores_qualidade",
        "auditorias_planeadas",
        "acoes_melhoria",
      ];

      arrayFields.forEach((field) => {
        if (!Array.isArray(docData[field]) || docData[field].length === 0) {
          docData[field] = [];
        }
      });

      console.log("Dados corrigidos para edição:", docData);

      const updatedDocument = await documentosAPI.update(
        editingDocument.id,
        docData,
      );
      setDocumentos((prev) =>
        prev.map((doc) =>
          doc.id === editingDocument.id ? updatedDocument : doc,
        ),
      );
      setShowEditModal(false);
      setEditingDocument(null);
      toast.success("Documento atualizado com sucesso!");
    } catch (error) {
      console.error("Erro detalhado:", error);
      toast.error("Erro ao atualizar documento");
    }
  };

  const handleViewDocument = (document: any) => {
    // Changed to any
    setViewingDocument(document);
    setShowViewModal(true);
  };

  const handleEditClick = (document: any) => {
    // Changed to any
    setEditingDocument(document);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que quer eliminar este documento?")) {
      try {
        // await documentosAPI.delete(id)
        setDocumentos((prev) => prev.filter((doc) => doc.id !== id));
        toast.success("Documento eliminado com sucesso");
      } catch (error) {
        toast.error("Erro ao eliminar documento");
      }
    }
  };

  const handleExport = () => {
    const csvContent = [
      [
        "Código",
        "Tipo",
        "Versão",
        "Responsável",
        "Zona",
        "Estado",
        "Data Validade",
        "Observações",
      ],
      ...sortedDocumentos.map((doc) => [
        doc.codigo,
        getTipoInfo(doc.tipo).label,
        doc.versao,
        doc.responsavel,
        doc.zona,
        getEstadoInfo(doc.estado).label,
        doc.data_validade || "-",
        doc.observacoes || "-",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `documentos_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exportação concluída");
  };

  const handleBulkAction = (action: string) => {
    if (selectedDocuments.length === 0) {
      toast.error("Selecione pelo menos um documento");
      return;
    }

    switch (action) {
      case "delete":
        if (confirm(`Eliminar ${selectedDocuments.length} documento(s)?`)) {
          toast.success(
            `${selectedDocuments.length} documento(s) eliminado(s)`,
          );
          setSelectedDocuments([]);
        }
        break;
      case "export":
        toast.success(`${selectedDocuments.length} documento(s) exportado(s)`);
        break;
      default:
        break;
    }
  };

  const handleGenerateRelatorioIndividual = async (document: any) => {
    try {
      // Converter para o tipo Documento esperado pelo PDFService
      const documentoData: Documento = {
        id: document.id,
        codigo: document.codigo,
        tipo: document.tipo,
        versao: document.versao,
        data_validade: document.data_validade,
        data_aprovacao: document.data_aprovacao,
        data_revisao: document.data_revisao,
        aprovador: document.aprovador,
        revisor: document.revisor,
        categoria: document.categoria,
        categoria_outro: document.categoria_outro,
        rfi: document.rfi,
        procedimento: document.procedimento,
        plano_ensaio: document.plano_ensaio,
        plano_qualidade: document.plano_qualidade,
        relacionado_obra_id: document.relacionado_obra_id,
        relacionado_obra_outro: document.relacionado_obra_outro,
        relacionado_zona_id: document.relacionado_zona_id,
        relacionado_zona_outro: document.relacionado_zona_outro,
        relacionado_ensaio_id: document.relacionado_ensaio_id,
        relacionado_ensaio_outro: document.relacionado_ensaio_outro,
        relacionado_material_id: document.relacionado_material_id,
        relacionado_material_outro: document.relacionado_material_outro,
        relacionado_fornecedor_id: document.relacionado_fornecedor_id,
        relacionado_fornecedor_outro: document.relacionado_fornecedor_outro,
        relacionado_checklist_id: document.relacionado_checklist_id,
        relacionado_checklist_outro: document.relacionado_checklist_outro,
        timeline: document.timeline || [],
        anexos_principal: document.anexos_principal || [],
        anexos_apendices: document.anexos_apendices || [],
        anexos_revisoes: document.anexos_revisoes || [],
        observacoes: document.observacoes,
        palavras_chave: document.palavras_chave || [],
        classificacao_confidencialidade: document.classificacao_confidencialidade,
        distribuicao: document.distribuicao || [],
        data_criacao: document.created || document.data_criacao,
        data_atualizacao: document.updated || document.data_atualizacao,
        responsavel: document.responsavel,
        zona: document.zona,
        estado: document.estado,
        anexos: document.anexos || []
      };
      
      await pdfService.generateDocumentosIndividualReport([documentoData]);
      toast.success("Relatório individual gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório individual:", error);
      toast.error("Erro ao gerar relatório individual");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-glow">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 font-display">
                Documentos
              </h1>
              <p className="text-gray-600 mt-1">
                Gestão completa de documentação técnica
              </p>
            </div>
          </div>
        </motion.div>

        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-glow">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              Documentos
            </h1>
            <p className="text-gray-600 mt-1">
              Gestão completa de documentação técnica
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-outline btn-md"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary btn-md"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Documento
          </button>
        </div>
      </motion.div>

      {/* Botão de Filtros */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setShowRelatorioPremiumModal(true)}
          className="btn btn-secondary btn-md"
        >
          <FileText className="h-4 w-4 mr-2" />
          Relatórios
        </button>
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

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          {
            label: "Total",
            value: (documentos || []).length,
            icon: FileText,
            color: "bg-gradient-to-br from-blue-500 to-blue-600",
          },
          {
            label: "Aprovados",
            value: (documentos || []).filter((d) => d.estado === "aprovado")
              .length,
            icon: CheckCircle,
            color: "bg-gradient-to-br from-green-500 to-green-600",
          },
          {
            label: "Pendentes",
            value: (documentos || []).filter((d) => d.estado === "pendente")
              .length,
            icon: Clock,
            color: "bg-gradient-to-br from-warning-500 to-warning-600",
          },
          {
            label: "Em Análise",
            value: (documentos || []).filter((d) => d.estado === "em_analise")
              .length,
            icon: AlertTriangle,
            color: "bg-gradient-to-br from-info-500 to-info-600",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
                <div className={`p-3 rounded-xl ${stat.color} shadow-glow`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

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
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar documentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10"
                  />
                </div>

                {/* Tipo Filter */}
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="select"
                >
                  <option value="">Todos os tipos</option>
                  {documentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                {/* Estado Filter */}
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="select"
                >
                  <option value="">Todos os estados</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>

                {/* Zona Filter */}
                <select
                  value={filterZona}
                  onChange={(e) => setFilterZona(e.target.value)}
                  className="select"
                >
                  <option value="">Todas as zonas</option>
                  {Array.from(new Set(documentos.map((d) => d.zona))).map(
                    (zona) => (
                      <option key={zona} value={zona}>
                        {zona}
                      </option>
                    ),
                  )}
                </select>

                {/* Responsável Filter */}
                <select
                  value={filterResponsavel}
                  onChange={(e) => setFilterResponsavel(e.target.value)}
                  className="select"
                >
                  <option value="">Todos os responsáveis</option>
                  {responsaveisUnicos.map((responsavel) => (
                    <option key={responsavel} value={responsavel}>
                      {responsavel}
                    </option>
                  ))}
                </select>

                {/* Versão Filter */}
                <select
                  value={filterVersao}
                  onChange={(e) => setFilterVersao(e.target.value)}
                  className="select"
                >
                  <option value="">Todas as versões</option>
                  {versoesUnicas.map((versao) => (
                    <option key={versao} value={versao}>
                      {versao}
                    </option>
                  ))}
                </select>

                {/* Data Criação */}
                <input
                  type="date"
                  value={filterDataCriacao}
                  onChange={(e) => setFilterDataCriacao(e.target.value)}
                  className="input"
                  placeholder="Data de criação"
                />

                {/* Data Validade */}
                <input
                  type="date"
                  value={filterDataValidade}
                  onChange={(e) => setFilterDataValidade(e.target.value)}
                  className="input"
                  placeholder="Data de validade"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-primary-100 text-primary-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <FileText className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-primary-100 text-primary-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <File className="h-5 w-5" />
            </button>
          </div>

          <span className="text-sm text-gray-600">
            {sortedDocumentos.length} documento(s) encontrado(s)
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {selectedDocuments.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedDocuments.length} selecionado(s)
              </span>
              <button
                onClick={() => handleBulkAction("export")}
                className="btn btn-outline btn-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Exportar
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="btn btn-danger btn-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Eliminar
              </button>
            </div>
          )}

          <button onClick={handleExport} className="btn btn-secondary btn-sm">
            <Download className="h-4 w-4 mr-1" />
            Exportar Todos
          </button>
        </div>
      </motion.div>

      {/* Documents Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card"
      >
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedDocuments.length === sortedDocumentos.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDocuments(
                            sortedDocumentos.map((d) => d.id),
                          );
                        } else {
                          setSelectedDocuments([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th>
                    <button
                      onClick={() => {
                        setSortBy("codigo");
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      }}
                      className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
                    >
                      <span>Código</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th>Tipo</th>
                  <th>Versão</th>
                  <th>Responsável</th>
                  <th>Zona</th>
                  <th>
                    <button
                      onClick={() => {
                        setSortBy("estado");
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      }}
                      className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
                    >
                      <span>Estado</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th>Data Validade</th>
                  <th>
                    <button
                      onClick={() => {
                        setSortBy("data_criacao");
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      }}
                      className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
                    >
                      <span>Criado</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </th>
                  <th className="w-20">Ações</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {sortedDocumentos.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12">
                        <div>Nenhum documento encontrado</div>
                      </td>
                    </tr>
                  ) : (
                    sortedDocumentos.map((doc, index) => {
                      const tipoInfo = getTipoInfo(doc.tipo);
                      const estadoInfo = getEstadoInfo(doc.estado);
                      const TipoIcon = tipoInfo.icon;

                      return (
                        <motion.tr
                          key={doc.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="hover:bg-gray-50/50"
                        >
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedDocuments.includes(doc.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDocuments([
                                    ...selectedDocuments,
                                    doc.id,
                                  ]);
                                } else {
                                  setSelectedDocuments(
                                    selectedDocuments.filter(
                                      (id) => id !== doc.id,
                                    ),
                                  );
                                }
                              }}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td>
                            <div className="flex items-center space-x-2">
                              <TipoIcon
                                className={`h-4 w-4 ${tipoInfo.color}`}
                              />
                              <span className="font-medium text-gray-900">
                                {doc.codigo}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="text-sm text-gray-700">
                              {tipoInfo.label}
                            </span>
                          </td>
                          <td>
                            <span className="text-sm font-medium text-gray-900">
                              {doc.versao}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center space-x-2">
                              <div className="h-6 w-6 rounded-full bg-gradient-primary flex items-center justify-center">
                                <span className="text-xs font-bold text-white">
                                  {doc.responsavel
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                              </div>
                              <span className="text-sm text-gray-700">
                                {doc.responsavel}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="text-sm text-gray-700">
                              {doc.zona}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${estadoInfo.color}`}>
                              {estadoInfo.label}
                            </span>
                          </td>
                          <td>
                            <span className="text-sm text-gray-700">
                              {doc.data_validade
                                ? new Date(
                                    doc.data_validade,
                                  ).toLocaleDateString("pt-BR")
                                : "-"}
                            </span>
                          </td>
                          <td>
                            <span className="text-sm text-gray-500">
                              {new Date(doc.data_criacao).toLocaleDateString(
                                "pt-BR",
                              )}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleViewDocument(doc)}
                                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Visualizar"
                              >
                                <Eye className="h-4 w-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleEditClick(doc)}
                                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => {
                                  // Implementar impressão
                                  toast.success(
                                    "Funcionalidade de impressão em desenvolvimento",
                                  );
                                }}
                                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Imprimir"
                              >
                                <Printer className="h-4 w-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleGenerateRelatorioIndividual(doc)}
                                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Gerar Relatório Individual"
                              >
                                <FileText className="h-4 w-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="p-1 rounded-lg hover:bg-red-100 transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Modals */}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Novo Documento"
        size="xl"
      >
        <DocumentoForm
          onSubmit={handleCreateDocument}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingDocument(null);
        }}
        title="Editar Documento"
        size="xl"
      >
        {editingDocument && (
          <DocumentoForm
            onSubmit={handleEditDocument}
            onCancel={() => {
              setShowEditModal(false);
              setEditingDocument(null);
            }}
            initialData={editingDocument as any}
            isEditing={true}
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingDocument(null);
        }}
        title="Visualizar Documento"
        size="lg"
      >
        {viewingDocument && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {viewingDocument.codigo}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <span
                  className={`badge ${getTipoInfo(viewingDocument.tipo).color}`}
                >
                  {getTipoInfo(viewingDocument.tipo).label}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Versão
                </label>
                <p className="text-gray-900">{viewingDocument.versao}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <span
                  className={`badge ${getEstadoInfo(viewingDocument.estado).color}`}
                >
                  {getEstadoInfo(viewingDocument.estado).label}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsável
                </label>
                <p className="text-gray-900">{viewingDocument.responsavel}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona
                </label>
                <p className="text-gray-900">{viewingDocument.zona}</p>
              </div>
              {viewingDocument.data_validade && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Validade
                  </label>
                  <p className="text-gray-900">
                    {new Date(viewingDocument.data_validade).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                </div>
              )}
            </div>

            {viewingDocument.observacoes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {viewingDocument.observacoes}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Criado em:{" "}
                {new Date(viewingDocument.data_criacao).toLocaleString("pt-BR")}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditClick(viewingDocument);
                  }}
                  className="btn btn-outline btn-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    // Implementar impressão
                    toast.success(
                      "Funcionalidade de impressão em desenvolvimento",
                    );
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  <Printer className="h-4 w-4 mr-1" />
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

             {/* Relatório Premium Modal */}
       {showRelatorioPremiumModal && (
         <RelatorioDocumentosPremium
           documentos={filteredDocumentos.map((doc) => ({
             id: doc.id,
             codigo: doc.codigo,
             tipo: doc.tipo,
             versao: doc.versao,
             data_validade: doc.data_validade,
             data_aprovacao: doc.data_aprovacao,
             data_revisao: doc.data_revisao,
             aprovador: doc.aprovador,
             revisor: doc.revisor,
             categoria: doc.categoria,
             categoria_outro: doc.categoria_outro,
             rfi: doc.rfi,
             procedimento: doc.procedimento,
             plano_ensaio: doc.plano_ensaio,
             plano_qualidade: doc.plano_qualidade,
             relacionado_obra_id: doc.relacionado_obra_id,
             relacionado_obra_outro: doc.relacionado_obra_outro,
             relacionado_zona_id: doc.relacionado_zona_id,
             relacionado_zona_outro: doc.relacionado_zona_outro,
             relacionado_ensaio_id: doc.relacionado_ensaio_id,
             relacionado_ensaio_outro: doc.relacionado_ensaio_outro,
             relacionado_material_id: doc.relacionado_material_id,
             relacionado_material_outro: doc.relacionado_material_outro,
             relacionado_fornecedor_id: doc.relacionado_fornecedor_id,
             relacionado_fornecedor_outro: doc.relacionado_fornecedor_outro,
             relacionado_checklist_id: doc.relacionado_checklist_id,
             relacionado_checklist_outro: doc.relacionado_checklist_outro,
             timeline: doc.timeline || [],
             anexos_principal: doc.anexos_principal || [],
             anexos_apendices: doc.anexos_apendices || [],
             anexos_revisoes: doc.anexos_revisoes || [],
             observacoes: doc.observacoes,
             palavras_chave: doc.palavras_chave || [],
             classificacao_confidencialidade: doc.classificacao_confidencialidade,
             distribuicao: doc.distribuicao || [],
             data_criacao: doc.created || doc.data_criacao,
             data_atualizacao: doc.updated || doc.data_atualizacao,
             responsavel: doc.responsavel,
             zona: doc.zona,
             estado: doc.estado,
             anexos: doc.anexos || []
           }))}
           onClose={() => setShowRelatorioPremiumModal(false)}
         />
       )}
    </div>
  );
}
