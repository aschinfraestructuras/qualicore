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
} from "lucide-react";
import toast from "react-hot-toast";
import ObraForm from "@/components/forms/ObraForm";
import { obrasAPI } from "@/lib/supabase-api";
import { AnimatePresence, motion } from "framer-motion";

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
        const loadedObras = await obrasAPI.getAll();
        setObras(loadedObras);
      } catch (error) {
        console.error("Erro ao carregar obras:", error);
        toast.error("Erro ao carregar obras");
      }
    };
    loadObras();
  }, []);

  const handleCreate = () => {
    setEditingObra(null);
    setShowModal(true);
  };

  const handleEdit = (obra: any) => {
    setEditingObra(obra);
    setShowModal(true);
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
        const success = await obrasAPI.delete(id);
        if (success) {
          setObras(obras.filter((o) => o.id !== id));
          toast.success("Obra excluída com sucesso!");
        } else {
          toast.error("Erro ao excluir obra");
        }
      } catch (error) {
        console.error("Erro ao excluir obra:", error);
        toast.error("Erro ao excluir obra");
      }
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

  const stats = {
    total: filteredObras.length,
    em_execucao: filteredObras.filter((o) => o.status === "em_execucao").length,
    concluidas: filteredObras.filter((o) => o.status === "concluida").length,
    valor_total: filteredObras.reduce((acc, o) => acc + o.valor_contrato, 0),
    valor_executado: filteredObras.reduce((acc, o) => acc + o.valor_executado, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Obras</h1>
          <p className="text-gray-600">Controlo completo de projetos e obras</p>
        </div>
        <button className="btn btn-primary btn-md" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Obra
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
                    placeholder="Pesquisar obras..."
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
                    <option key={status} value={status}>{getStatusText(status)}</option>
                  ))}
                </select>

                {/* Tipo de Obra */}
                <select
                  value={filters.tipo_obra}
                  onChange={(e) => setFilters({ ...filters, tipo_obra: e.target.value })}
                  className="input"
                >
                  <option value="">Todos os tipos</option>
                  {tiposUnicos.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>

                {/* Categoria */}
                <select
                  value={filters.categoria}
                  onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}
                  className="input"
                >
                  <option value="">Todas as categorias</option>
                  {categoriasUnicas.map((categoria) => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>

                {/* Cliente */}
                <select
                  value={filters.cliente}
                  onChange={(e) => setFilters({ ...filters, cliente: e.target.value })}
                  className="input"
                >
                  <option value="">Todos os clientes</option>
                  {clientesUnicos.map((cliente) => (
                    <option key={cliente} value={cliente}>{cliente}</option>
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

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total de Obras
                </p>
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
                <p className="text-sm font-medium text-gray-600">Em Execução</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.em_execucao}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.concluidas}
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
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                  }).format(stats.valor_total)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Executado</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Intl.NumberFormat("pt-PT", {
                    style: "currency",
                    currency: "EUR",
                  }).format(stats.valor_executado)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Obras */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Lista de Obras</h3>
          <p className="card-description">
            {filteredObras.length} obra(s) encontrada(s)
          </p>
        </div>
        <div className="card-content">
          {filteredObras.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma obra encontrada</p>
              <button
                className="btn btn-primary btn-sm mt-4"
                onClick={handleCreate}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Obra
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredObras.map((obra) => (
                <div
                  key={obra.id}
                  className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {obra.nome}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(obra.status)}`}
                          >
                            {getStatusText(obra.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Código:</span>
                            <span>{obra.codigo}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Cliente:</span>
                            <span>{obra.cliente}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Localização:</span>
                            <span>{obra.localizacao}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Início:</span>
                            <span>
                              {new Date(obra.data_inicio).toLocaleDateString(
                                "pt-PT",
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Progresso
                            </span>
                            <span className="text-sm text-gray-600">
                              {obra.percentual_execucao}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${obra.percentual_execucao}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Responsável:</span>
                            <span className="text-gray-600">
                              {obra.responsavel_tecnico}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Contrato:</span>
                            <span className="text-gray-600">
                              {new Intl.NumberFormat("pt-PT", {
                                style: "currency",
                                currency: "EUR",
                              }).format(obra.valor_contrato)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-600 capitalize">
                              {obra.tipo_obra} - {obra.categoria}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        onClick={() => handleEdit(obra)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        onClick={() => handleDelete(obra.id)}
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingObra ? "Editar Obra" : "Nova Obra"}
              </h2>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <ObraForm
                initialData={editingObra || undefined}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
