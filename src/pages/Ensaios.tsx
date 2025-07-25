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
} from "lucide-react";
import { ensaiosAPI } from "@/lib/supabase-api";
import { toast } from "react-hot-toast";
import EnsaioForm from "@/components/forms/EnsaioForm";
import Modal from "@/components/Modal";
import RelatorioEnsaiosPremium from "@/components/RelatorioEnsaiosPremium";
import { ShareEnsaioModal } from "@/components/ShareEnsaioModal";
import { SavedEnsaiosViewer } from "@/components/SavedEnsaiosViewer";
import { AnimatePresence, motion } from "framer-motion";
import { PDFService } from "@/services/pdfService";
import { ShareService } from "@/services/shareService";

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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ensaios Técnicos</h1>
          <p className="text-gray-600">
            Gestão de ensaios laboratoriais e testes
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="btn btn-primary btn-md"
            onClick={() => setShowRelatorioPremium(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Relatórios PDF
          </button>
          <button className="btn btn-primary btn-md" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Ensaio
          </button>
        </div>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredEnsaios.length}
                </p>
              </div>
              <TestTube className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conformes</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredEnsaios.filter((e) => e.conforme).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Não Conformes
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredEnsaios.filter((e) => !e.conforme).length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Ensaios</h3>
          <p className="card-description">
            {filteredEnsaios.length} ensaio(s) encontrado(s)
          </p>
        </div>
        <div className="card-content">
          {filteredEnsaios.length === 0 ? (
            <div className="text-center py-12">
              <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum ensaio encontrado</p>
              <button
                className="btn btn-primary btn-sm mt-4"
                onClick={handleCreate}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Ensaio
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEnsaios.map((ensaio) => (
                <div
                  key={ensaio.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-lg ${ensaio.conforme ? "bg-green-100" : "bg-red-100"}`}
                      >
                        <TestTube
                          className={`h-6 w-6 ${ensaio.conforme ? "text-green-600" : "text-red-600"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {ensaio.codigo}
                          </h4>
                          <span
                            className={`badge ${ensaio.conforme ? "badge-success" : "badge-error"}`}
                          >
                            {ensaio.conforme ? "Conforme" : "Não Conforme"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {ensaio.tipo} - {ensaio.laboratorio}
                        </p>
                        <p className="text-xs text-gray-500">
                          {ensaio.valor_obtido} {ensaio.unidade} /{" "}
                          {ensaio.valor_esperado} {ensaio.unidade}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(ensaio)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleViewDocuments(ensaio)}
                        className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                        title="Ver Documentos"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleGenerateIndividualReport(ensaio)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Relatório Individual"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleShareEnsaio(ensaio)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Compartilhar Ensaio"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ensaio.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
