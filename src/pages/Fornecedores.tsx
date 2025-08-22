import { useState, useEffect } from "react";
import {
  Plus,
  Building,
  Phone,
  Edit,
  Trash2,
  X,
  Search,
  Download,
  Eye,
  FileText,
  MapPin,
  Award,
  Hash,
  User,
  Filter,
  XCircle,
  Share2,
  Cloud,
  BarChart,
} from "lucide-react";
import { fornecedoresAPI } from "@/lib/supabase-api";
import { Fornecedor } from "@/types";
import toast from "react-hot-toast";
import FornecedorForm from "@/components/forms/FornecedorForm";
import RelatorioFornecedoresPremium from "@/components/RelatorioFornecedoresPremium";
import { ShareFornecedorModal } from "@/components/ShareFornecedorModal";
import { SavedFornecedoresViewer } from "@/components/SavedFornecedoresViewer";
import FornecedoresDashboard from "@/components/FornecedoresDashboard";
import { PDFService } from "@/services/pdfService";
import { AnimatePresence, motion } from "framer-motion";

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [filteredFornecedores, setFilteredFornecedores] = useState<
    Fornecedor[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSavedFornecedores, setShowSavedFornecedores] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [editingFornecedor, setEditingFornecedor] = useState<Fornecedor | null>(
    null,
  );
  const [selectedFornecedor, setSelectedFornecedor] =
    useState<Fornecedor | null>(null);
  const [sharingFornecedor, setSharingFornecedor] = useState<Fornecedor | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [sortBy, setSortBy] = useState("nome");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    loadFornecedores();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [fornecedores, searchTerm, estadoFilter, sortBy, sortOrder]);

  const loadFornecedores = async () => {
    try {
      setLoading(true);
      const data = await fornecedoresAPI.getAll();
      // Mapear created_at para data_registo
      const fornecedoresComData = (data || []).map((f: any) => ({
        ...f,
        data_registo: f.data_registo || f.created_at || "",
      }));
      setFornecedores(fornecedoresComData);
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
      toast.error("Erro ao carregar fornecedores");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...fornecedores];

    // Filtro por termo de pesquisa
    if (searchTerm) {
      filtered = filtered.filter(
        (fornecedor) =>
          fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fornecedor.nif.includes(searchTerm) ||
          fornecedor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fornecedor.contacto.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filtro por estado
    if (estadoFilter) {
      filtered = filtered.filter(
        (fornecedor) => fornecedor.estado === estadoFilter,
      );
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Fornecedor];
      let bValue = b[sortBy as keyof Fornecedor];

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredFornecedores(filtered);
  };

  const handleCreate = () => {
    setEditingFornecedor(null);
    setShowForm(true);
  };

  const handleEdit = (fornecedor: Fornecedor) => {
    setEditingFornecedor(fornecedor);
    setShowForm(true);
  };

  const handleView = (fornecedor: Fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setShowViewModal(true);
  };

  const handleDashboardSearch = (query: string, options?: any) => {
    setSearchTerm(query);
  };

  const handleDashboardFilterChange = (filters: any) => {
    if (filters.estado) {
      setEstadoFilter(filters.estado);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingFornecedor) {
        await fornecedoresAPI.update(editingFornecedor.id, data);
        toast.success("Fornecedor atualizado com sucesso!");
      } else {
        await fornecedoresAPI.create(data);
        toast.success("Fornecedor criado com sucesso!");
      }
      setShowForm(false);
      loadFornecedores();
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
      toast.error("Erro ao salvar fornecedor");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
      try {
        await fornecedoresAPI.delete(id);
        toast.success("Fornecedor excluído com sucesso!");
        loadFornecedores();
      } catch (error) {
        console.error("Erro ao excluir fornecedor:", error);
        toast.error("Erro ao excluir fornecedor");
      }
    }
  };

  const handleExport = () => {
    setShowRelatorioModal(true);
  };

  const handleShare = (fornecedor: Fornecedor) => {
    setSharingFornecedor(fornecedor);
    setShowShareModal(true);
  };

  const handleViewDocuments = (fornecedor: Fornecedor) => {
    console.log("👁️ Clicou no botão olho para Fornecedor:", fornecedor);
    console.log("📁 Documents do Fornecedor:", (fornecedor as any).documents);
    
    // Verificar se há documentos no campo documents
    const hasDocuments = 
      ((fornecedor as any).documents && (fornecedor as any).documents.length > 0) ||
      fornecedor.arquivo_url; // Manter compatibilidade com arquivo_url antigo

    console.log("📁 Tem documentos?", hasDocuments);

    if (hasDocuments) {
      setSelectedFornecedor(fornecedor);
      setShowDocumentsModal(true);
    } else {
      toast("Este fornecedor não possui documentos carregados");
    }
  };

  const handleIndividualReport = async (fornecedor: Fornecedor) => {
    try {
      const pdfService = new PDFService();

      await pdfService.generateObrasIndividualReport([fornecedor]);
      toast.success("Relatório individual gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório individual:", error);
      toast.error("Erro ao gerar relatório individual");
    }
  };

  const getStats = () => {
    const total = fornecedores.length;
    const ativos = fornecedores.filter((f) => f.estado === "ativo").length;
    const inativos = fornecedores.filter((f) => f.estado === "inativo").length;
    // Por enquanto, assumimos que todos têm certificações (será implementado quando adicionarmos o campo)
    const comCertificacoes = 0;

    return { total, ativos, inativos, comCertificacoes };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
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
              Gestão de Fornecedores
            </h1>
            <p className="text-xl text-gray-600 flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-500" />
              Controlo de fornecedores e parceiros em tempo real
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
          >
            <BarChart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            {showDashboard ? 'Lista' : 'Dashboard'}
          </button>
          <button 
            className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl group" 
            onClick={() => setShowSavedFornecedores(true)}
          >
            <Cloud className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Fornecedores Salvos
          </button>
          <button 
            className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl group" 
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Exportar
          </button>
          <button 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl group" 
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Novo Fornecedor
          </button>
          </div>
        </div>
      </motion.div>

      {/* Botão de Filtros */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center space-x-4 mb-6"
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
            showFilters
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
          title="Filtros"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </button>
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
                {/* Pesquisa */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar fornecedores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-10 w-full"
                  />
                </div>

                {/* Filtro por Estado */}
                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  className="input"
                >
                  <option value="">Todos os Estados</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>

                {/* Ordenação */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input"
                >
                  <option value="nome">Nome</option>
                  <option value="nif">NIF</option>
                  <option value="estado">Estado</option>
                  <option value="data_registo">Data Registo</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                  className="input"
                >
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.ativos}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inativos</p>
                <p className="text-2xl font-bold text-gray-600">
                  {stats.inativos}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Building className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Certificados
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.comCertificacoes}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal - Dashboard ou Lista */}
      {showDashboard ? (
        <FornecedoresDashboard
          fornecedores={fornecedores}
          onSearch={handleDashboardSearch}
          onFilterChange={handleDashboardFilterChange}
        />
      ) : (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Lista de Fornecedores</h3>
            <p className="card-description">
              {filteredFornecedores.length} fornecedor(es) encontrado(s)
            </p>
          </div>
          <div className="card-content">
            {filteredFornecedores.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum fornecedor encontrado</p>
                <button
                  className="btn btn-primary btn-sm mt-4"
                  onClick={handleCreate}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Fornecedor
                </button>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Fornecedor</th>
                    <th>NIF</th>
                    <th>Contacto</th>
                    <th>Estado</th>
                    <th>Data Registo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFornecedores.map((fornecedor) => (
                    <tr key={fornecedor.id} className="hover:bg-gray-50">
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Building className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {fornecedor.nome}
                            </div>
                            <div className="text-sm text-gray-500">
                              {fornecedor.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-1">
                          <Hash className="h-4 w-4 text-gray-400" />
                          <span className="font-mono">{fornecedor.nif}</span>
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-sm">
                            <User className="h-3 w-3 text-gray-400" />
                            <span>{fornecedor.contacto}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Phone className="h-3 w-3" />
                            <span>{fornecedor.telefone}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${fornecedor.estado === "ativo" ? "badge-success" : "badge-secondary"}`}
                        >
                          {fornecedor.estado}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-gray-500">
                          {new Date(fornecedor.data_registo).toLocaleDateString(
                            "pt-PT",
                          )}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-1 text-gray-400 hover:text-cyan-600 transition-colors"
                            onClick={() => handleViewDocuments(fornecedor)}
                            title="Ver Documentos"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={() => handleShare(fornecedor)}
                            title="Partilhar fornecedor"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={() => handleView(fornecedor)}
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            onClick={() => handleIndividualReport(fornecedor)}
                            title="Relatório individual"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            onClick={() => handleEdit(fornecedor)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            onClick={() => handleDelete(fornecedor.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                {editingFornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}
              </h2>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowForm(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <FornecedorForm
                initialData={
                  editingFornecedor
                    ? {
                        nome: editingFornecedor.nome,
                        nif: editingFornecedor.nif,
                        morada: editingFornecedor.morada,
                        telefone: editingFornecedor.telefone,
                        email: editingFornecedor.email,
                        contacto: editingFornecedor.contacto,
                        estado: editingFornecedor.estado as any,
                      }
                    : undefined
                }
                onSubmit={handleFormSubmit}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização Detalhada */}
      {showViewModal && selectedFornecedor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Detalhes do Fornecedor
              </h2>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowViewModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Informações Empresariais */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" />
                  Informações Empresariais
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nome da Empresa
                    </label>
                    <p className="text-gray-900 font-medium">
                      {selectedFornecedor.nome}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      NIF
                    </label>
                    <p className="text-gray-900 font-mono">
                      {selectedFornecedor.nif}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Estado
                    </label>
                    <span
                      className={`badge ${selectedFornecedor.estado === "ativo" ? "badge-success" : "badge-secondary"}`}
                    >
                      {selectedFornecedor.estado}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Data de Registo
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedFornecedor.data_registo).toLocaleDateString(
                        "pt-PT",
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações de Contacto */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-green-600" />
                  Informações de Contacto
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nome do Contacto
                    </label>
                    <p className="text-gray-900">
                      {selectedFornecedor.contacto}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-gray-900">{selectedFornecedor.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Telefone
                    </label>
                    <p className="text-gray-900">
                      {selectedFornecedor.telefone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Morada */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-red-600" />
                  Morada
                </h4>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Morada Completa
                  </label>
                  <p className="text-gray-900">{selectedFornecedor.morada}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t">
              <button
                onClick={() => setShowViewModal(false)}
                className="btn btn-outline btn-md"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedFornecedor);
                }}
                className="btn btn-primary btn-md"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exportação */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Exportar Fornecedores
              </h2>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowExportModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center">
                <Download className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Exportar {filteredFornecedores.length} fornecedor(es)
                </h3>
                <p className="text-gray-600 mb-6">
                  Escolha o formato de exportação
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    // Exportar como CSV
                    const csvContent = [
                      "Nome,NIF,Contacto,Email,Telefone,Estado,Data Registo",
                      ...filteredFornecedores.map(
                        (f) =>
                          `"${f.nome}","${f.nif}","${f.contacto}","${f.email}","${f.telefone}","${f.estado}","${new Date(f.data_registo).toLocaleDateString("pt-PT")}"`,
                      ),
                    ].join("\n");

                    const blob = new Blob([csvContent], {
                      type: "text/csv;charset=utf-8;",
                    });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `fornecedores_${new Date().toISOString().split("T")[0]}.csv`;
                    link.click();
                    setShowExportModal(false);
                    toast.success("Fornecedores exportados com sucesso!");
                  }}
                  className="btn btn-primary btn-md flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </button>

                <button
                  onClick={() => {
                    // Exportar como JSON
                    const jsonContent = JSON.stringify(
                      filteredFornecedores,
                      null,
                      2,
                    );
                    const blob = new Blob([jsonContent], {
                      type: "application/json",
                    });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = `fornecedores_${new Date().toISOString().split("T")[0]}.json`;
                    link.click();
                    setShowExportModal(false);
                    toast.success("Fornecedores exportados com sucesso!");
                  }}
                  className="btn btn-outline btn-md flex-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Relatórios Premium */}
      <RelatorioFornecedoresPremium
        isOpen={showRelatorioModal}
        onClose={() => setShowRelatorioModal(false)}
        fornecedores={fornecedores}
      />

      {/* Modal de Partilha */}
      {showShareModal && sharingFornecedor && (
        <ShareFornecedorModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setSharingFornecedor(null);
          }}
          fornecedor={sharingFornecedor}
        />
      )}

      {/* Modal de Fornecedores Salvos */}
      <SavedFornecedoresViewer
        isOpen={showSavedFornecedores}
        onClose={() => setShowSavedFornecedores(false)}
      />

      {/* Modal de Visualização de Documentos */}
      {showDocumentsModal && selectedFornecedor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Documentos do Fornecedor: {selectedFornecedor.nome}
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
                    Visualize e faça download dos documentos associados a este fornecedor.
                  </p>
                </div>
                
                {/* Documentos do campo documents */}
                {(selectedFornecedor as any).documents && (selectedFornecedor as any).documents.length > 0 && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Documentos Anexados
                    </h4>
                    <div className="space-y-3">
                      {(selectedFornecedor as any).documents.map((doc: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
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

                {/* Arquivo URL */}
                {selectedFornecedor.arquivo_url && (
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Arquivo Principal
                    </h4>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Arquivo do Fornecedor
                          </p>
                          <p className="text-sm text-gray-500">
                            Documento principal
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(selectedFornecedor.arquivo_url, '_blank')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = selectedFornecedor.arquivo_url!;
                            link.download = `fornecedor_${selectedFornecedor.nome}`;
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
                {(!selectedFornecedor.arquivo_url && (!(selectedFornecedor as any).documents || (selectedFornecedor as any).documents.length === 0)) && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum documento carregado para este fornecedor</p>
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
