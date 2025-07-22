import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  FileText,
  Download,
  Share2,
  Cloud,
  X,
  CheckCircle,
} from "lucide-react";
import { checklistsAPI } from "@/lib/supabase-api";
import toast from "react-hot-toast";
import ChecklistForm from "@/components/forms/ChecklistForm";
import RelatorioChecklistsPremium from "@/components/RelatorioChecklistsPremium";
import { ShareChecklistModal } from "@/components/ShareChecklistModal";
import { SavedChecklistsViewer } from "@/components/SavedChecklistsViewer";
import { AnimatePresence, motion } from "framer-motion";
import { PDFService } from "@/services/pdfService";
import type { Checklist } from "@/types";

export default function Checklists() {
  const [checklists, setChecklists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<any | null>(null);
  const [showRelatorios, setShowRelatorios] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Sharing states
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSavedViewer, setShowSavedViewer] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);

  // Filtros ativos
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    estado: "",
    responsavel: "",
    zona: "",
    tipo: "",
    dataInicio: "",
    dataFim: "",
  });

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    try {
      setLoading(true);
      const data = await checklistsAPI.getAll();
      setChecklists(data);
    } catch (error) {
      console.error("Erro ao carregar checklists:", error);
      toast.error("Erro ao carregar checklists");
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros
  const filteredChecklists = checklists.filter((checklist) => {
    const matchesSearch = !filters.search || 
      checklist.codigo?.toLowerCase().includes(filters.search.toLowerCase()) ||
      checklist.titulo?.toLowerCase().includes(filters.search.toLowerCase()) ||
      checklist.responsavel?.toLowerCase().includes(filters.search.toLowerCase()) ||
      checklist.zona?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = !filters.status || checklist.status === filters.status;
    const matchesEstado = !filters.estado || checklist.estado === filters.estado;
    const matchesResponsavel = !filters.responsavel || checklist.responsavel === filters.responsavel;
    const matchesZona = !filters.zona || checklist.zona === filters.zona;
    const matchesTipo = !filters.tipo || checklist.tipo === filters.tipo;

    const matchesData = !filters.dataInicio || !filters.dataFim || 
      (checklist.data_inspecao >= filters.dataInicio && checklist.data_inspecao <= filters.dataFim);

    return matchesSearch && matchesStatus && matchesEstado && matchesResponsavel && 
           matchesZona && matchesTipo && matchesData;
  });

  // Obter valores únicos para os filtros
  const statusUnicos = [...new Set(checklists.map(c => c.status).filter(Boolean))];
  const estadosUnicos = [...new Set(checklists.map(c => c.estado).filter(Boolean))];
  const responsaveisUnicos = [...new Set(checklists.map(c => c.responsavel).filter(Boolean))];
  const zonasUnicas = [...new Set(checklists.map(c => c.zona).filter(Boolean))];
  const tiposUnicos = [...new Set(checklists.map(c => c.tipo).filter(Boolean))];

  // Opções completas baseadas nos formulários
  const statusOptions = [
    "pendente",
    "em_andamento", 
    "aprovado",
    "reprovado",
    "correcao",
    "concluido",
    "cancelado"
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
    "Zona E - Acabamentos",
    "Zona F - Instalações",
    "Zona G - Exterior",
    "Armazém Central",
    "Laboratório",
    "Escritório",
    "Outro"
  ];

  const tipoOptions = [
    "Checklist de Segurança",
    "Checklist de Qualidade",
    "Checklist de Execução",
    "Checklist de Receção",
    "Checklist de Manutenção",
    "Checklist de Limpeza",
    "Checklist de Equipamentos",
    "Checklist de Documentação",
    "Checklist de Conformidade",
    "Checklist de Inspeção Geral",
    "Outro"
  ];

  const handleCreate = () => {
    setEditingChecklist(null);
    setShowForm(true);
  };

  const handleEdit = (checklist: any) => {
    setEditingChecklist(checklist);
    setShowForm(true);
  };

  const handleIndividualReport = async (checklist: any) => {
    try {
      // Converter para o tipo Checklist esperado pelo PDFService
      const checklistData: Checklist = {
        id: checklist.id,
        codigo: checklist.codigo,
        titulo: checklist.tipo || checklist.codigo,
        obra: checklist.codigo,
        status: checklist.estado || 'pendente',
        responsavel: checklist.responsavel || checklist.inspetor || 'N/A',
        zona: checklist.zona || 'N/A',
        estado: checklist.estado || 'pendente',
        data_criacao: checklist.data_inspecao || new Date().toISOString(),
        data_atualizacao: checklist.data_inspecao || new Date().toISOString(),
        pontos: [],
        observacoes: checklist.observacoes || ''
      };
      
      const pdfService = new PDFService();

      
      await pdfService.generateChecklistsIndividualReport([checklistData]);
      toast.success("Relatório individual gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar relatório individual:", error);
      toast.error("Erro ao gerar relatório individual");
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      console.log("Dados recebidos do formulário de checklist:", data);

      // Separar pontos de inspeção dos dados básicos
      const { pontos, ...checklistData } = data;

      // Filtrar apenas os campos válidos do schema Supabase
      const validChecklistData = {
        codigo: checklistData.codigo,
        obra_id: checklistData.obra_id || null,
        titulo: checklistData.titulo,
        status: checklistData.status,
        responsavel: checklistData.responsavel,
        zona: checklistData.zona,
        estado: checklistData.estado || "pendente",
        observacoes: checklistData.observacoes,
      };

      console.log("Dados corrigidos para envio:", validChecklistData);
      console.log("Pontos de inspeção:", pontos);

      if (editingChecklist) {
        await checklistsAPI.updateWithPontos(
          editingChecklist.id,
          validChecklistData,
          pontos || [],
        );
        toast.success("Checklist atualizado com sucesso!");
      } else {
        await checklistsAPI.createWithPontos(validChecklistData, pontos || []);
        toast.success("Checklist criado com sucesso!");
      }
      setShowForm(false);
      loadChecklists();
    } catch (error) {
      console.error("Erro detalhado ao salvar checklist:", error);
      toast.error("Erro ao salvar checklist");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este checklist?")) {
      try {
        await checklistsAPI.delete(id);
        toast.success("Checklist excluído com sucesso!");
        loadChecklists();
      } catch (error) {
        console.error("Erro ao excluir checklist:", error);
        toast.error("Erro ao excluir checklist");
      }
    }
  };

  const handleViewDocuments = (checklist: any) => {
    // Verificar se há anexos
    const hasDocuments = 
      (checklist.anexos_gerais && checklist.anexos_gerais.length > 0) ||
      (checklist.pontos && checklist.pontos.some((p: any) => p.anexos && p.anexos.length > 0));

    if (hasDocuments) {
      setSelectedChecklist(checklist);
      setShowDocumentsModal(true);
    } else {
      toast("Este checklist não possui anexos carregados");
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      estado: "",
      responsavel: "",
      zona: "",
      tipo: "",
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
          <h1 className="text-2xl font-bold text-gray-900">
            Checklists de Inspeção
          </h1>
          <p className="text-gray-600">Gestão de checklists e inspeções</p>
        </div>
        <div className="flex gap-3">
          <button
            className="btn btn-outline btn-md"
            onClick={() => setShowSavedViewer(true)}
          >
            <Cloud className="h-4 w-4 mr-2" />
            Ver Guardados
          </button>
          <button
            className="btn btn-secondary btn-md"
            onClick={() => setShowRelatorios(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Relatórios
          </button>
          <button className="btn btn-primary btn-md" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Checklist
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
                  <X className="h-5 w-5" />
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
                    placeholder="Pesquisar checklists..."
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
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
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

                {/* Tipo */}
                <select
                  value={filters.tipo}
                  onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                  className="input"
                >
                  <option value="">Todos os tipos</option>
                  {tiposUnicos.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
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
                  {filteredChecklists.length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Média Conformidade
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredChecklists.length > 0
                    ? Math.round(
                        filteredChecklists.reduce(
                          (acc, c) => acc + c.percentual_conformidade,
                          0,
                        ) / filteredChecklists.length,
                      )
                    : 0}
                  %
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
                  Aprovados
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredChecklists.filter(c => c.status === "aprovado").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Checklists</h3>
          <p className="card-description">
            {filteredChecklists.length} checklist(s) encontrado(s)
          </p>
        </div>
        <div className="card-content">
          {filteredChecklists.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum checklist encontrado</p>
              <button
                className="btn btn-primary btn-sm mt-4"
                onClick={handleCreate}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Checklist
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredChecklists.map((checklist) => (
                <div
                  key={checklist.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Eye className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {checklist.codigo}
                          </h4>
                          <span className="badge badge-info">
                            {checklist.percentual_conformidade}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {checklist.tipo} - {checklist.inspetor}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(checklist.data_inspecao).toLocaleDateString(
                            "pt-PT",
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedChecklist(checklist);
                          setShowShareModal(true);
                        }}
                        className="btn btn-xs btn-outline"
                        title="Partilhar"
                      >
                        <Share2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleIndividualReport(checklist)}
                        className="btn btn-xs btn-outline"
                        title="Relatório Individual"
                      >
                        <Download className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleViewDocuments(checklist)}
                        className="p-2 text-gray-400 hover:text-cyan-600 transition-colors"
                        title="Ver Documentos"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(checklist)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(checklist.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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

      {/* Modal do Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingChecklist ? "Editar Checklist" : "Novo Checklist"}
              </h2>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowForm(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <ChecklistForm
                initialData={
                  editingChecklist
                    ? {
                        obra: editingChecklist.codigo,
                        titulo: editingChecklist.tipo,
                        status: editingChecklist.estado as any,
                        responsavel: editingChecklist.responsavel,
                        zona: editingChecklist.zona,
                        observacoes: editingChecklist.observacoes,
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

      {/* Modal de Relatórios Premium */}
      {showRelatorios && (
        <RelatorioChecklistsPremium
          checklists={filteredChecklists.map((c) => ({
            id: c.id,
            codigo: c.codigo,
            titulo: c.tipo || c.codigo,
            obra: c.codigo,
            status: c.estado || 'pendente',
            responsavel: c.responsavel || c.inspetor || 'N/A',
            zona: c.zona || 'N/A',
            estado: c.estado || 'pendente',
            data_criacao: c.data_inspecao || new Date().toISOString(),
            data_atualizacao: c.data_inspecao || new Date().toISOString(),
            pontos: [],
            observacoes: c.observacoes || ''
          }))}
          onClose={() => setShowRelatorios(false)}
        />
      )}

      {/* Modal de Partilha */}
      {showShareModal && selectedChecklist && (
        <ShareChecklistModal
          isOpen={showShareModal}
          checklist={selectedChecklist}
          onClose={() => {
            setShowShareModal(false);
            setSelectedChecklist(null);
          }}
        />
      )}

      {/* Modal de Checklists Salvos */}
      {showSavedViewer && (
        <SavedChecklistsViewer
          isOpen={showSavedViewer}
          onClose={() => setShowSavedViewer(false)}
        />
      )}

      {/* Modal de Visualização de Documentos */}
      {showDocumentsModal && selectedChecklist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Anexos do Checklist: {selectedChecklist.codigo}
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
              <div className="space-y-6">
                {/* Anexos Gerais */}
                {selectedChecklist.anexos_gerais && selectedChecklist.anexos_gerais.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Anexos Gerais ({selectedChecklist.anexos_gerais.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedChecklist.anexos_gerais.map((doc: any, index: number) => (
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
                                {doc.nome || `Anexo Geral ${index + 1}`}
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
                                link.download = doc.nome || `anexo_geral_${index + 1}`;
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

                {/* Anexos dos Pontos */}
                {selectedChecklist.pontos && selectedChecklist.pontos.map((ponto: any, pontoIndex: number) => (
                  ponto.anexos && ponto.anexos.length > 0 && (
                    <div key={pontoIndex}>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Anexos do Ponto: {ponto.descricao} ({ponto.anexos.length})
                      </h3>
                      <div className="space-y-3">
                        {ponto.anexos.map((doc: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <FileText className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {doc.nome || `Anexo Ponto ${index + 1}`}
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
                                  link.download = doc.nome || `anexo_ponto_${index + 1}`;
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
                  )
                ))}

                {/* Mensagem se não houver documentos */}
                {(!selectedChecklist.anexos_gerais || selectedChecklist.anexos_gerais.length === 0) &&
                 (!selectedChecklist.pontos || !selectedChecklist.pontos.some((p: any) => p.anexos && p.anexos.length > 0)) && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhum anexo carregado para este checklist</p>
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
