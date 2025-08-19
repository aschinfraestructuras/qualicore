import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Upload, 
  Filter, 
  Search, 
  Calendar,
  MapPin,
  Users,
  Shield,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  TrendingUp,
  Eye,
  FileSpreadsheet,
  FileCode,
  Printer,
  Settings,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Star,
  Target,
  Award,
  Clock,
  Building2,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Auditoria, EstatisticasAuditoria } from '../types/auditorias';
import { auditoriasAPI } from '../lib/supabase-api/auditoriasAPI';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

interface FiltroRelatorio {
  dataInicio?: string;
  dataFim?: string;
  tipo?: string;
  status?: string;
  resultado?: string;
  obra?: string;
  auditor?: string;
  classificacao?: string;
  conformidadeMin?: number;
  conformidadeMax?: number;
}

interface ArquivoRelatorio {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  dataUpload: string;
  url: string;
  descricao?: string;
}

export default function RelatoriosAuditorias() {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [filteredAuditorias, setFilteredAuditorias] = useState<Auditoria[]>([]);
  const [selectedAuditorias, setSelectedAuditorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState<FiltroRelatorio>({});
  const [stats, setStats] = useState<EstatisticasAuditoria>({
    total_auditorias: 0,
    auditorias_este_ano: 0,
    auditorias_este_mes: 0,
    percentagem_conformidade_geral: 0,
    nao_conformidades_abertas: 0,
    acoes_corretivas_pendentes: 0,
    auditorias_por_tipo: [],
    conformidade_por_obra: [],
    tendencia_mensal: []
  });
  const [arquivos, setArquivos] = useState<ArquivoRelatorio[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    loadAuditorias();
    loadStats();
    loadArquivos();
  }, []);

  useEffect(() => {
    filterAuditorias();
  }, [auditorias, searchTerm, filtros]);

  const loadAuditorias = async () => {
    try {
      setLoading(true);
      const data = await auditoriasAPI.getAuditorias();
      setAuditorias(data);
    } catch (error) {
      console.error('Erro ao carregar auditorias:', error);
      toast.error('Erro ao carregar auditorias');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await auditoriasAPI.getEstatisticas();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const loadArquivos = async () => {
    // Mock data para arquivos
    const mockArquivos: ArquivoRelatorio[] = [
      {
        id: '1',
        nome: 'Relatório_Trimestral_Auditorias_Q1_2024.pdf',
        tipo: 'pdf',
        tamanho: 2048576,
        dataUpload: '2024-03-15T10:30:00',
        url: '#',
        descricao: 'Relatório trimestral de auditorias do primeiro trimestre de 2024'
      },
      {
        id: '2',
        nome: 'Auditorias_Conformidade_2024.xlsx',
        tipo: 'excel',
        tamanho: 1048576,
        dataUpload: '2024-03-10T14:20:00',
        url: '#',
        descricao: 'Planilha com dados de conformidade das auditorias de 2024'
      },
      {
        id: '3',
        nome: 'Checklist_Auditoria_Seguranca.pdf',
        tipo: 'pdf',
        tamanho: 512000,
        dataUpload: '2024-03-05T09:15:00',
        url: '#',
        descricao: 'Checklist para auditorias de segurança'
      }
    ];
    setArquivos(mockArquivos);
  };

  const filterAuditorias = () => {
    let filtered = auditorias;

    // Filtro por termo de pesquisa
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.escopo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.obra_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.auditor_principal.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtros avançados
    if (filtros.dataInicio) {
      filtered = filtered.filter(a => new Date(a.data_inicio) >= new Date(filtros.dataInicio!));
    }
    if (filtros.dataFim) {
      filtered = filtered.filter(a => new Date(a.data_inicio) <= new Date(filtros.dataFim!));
    }
    if (filtros.tipo) {
      filtered = filtered.filter(a => a.tipo === filtros.tipo);
    }
    if (filtros.status) {
      filtered = filtered.filter(a => a.status === filtros.status);
    }
    if (filtros.resultado) {
      filtered = filtered.filter(a => a.resultado === filtros.resultado);
    }
    if (filtros.obra) {
      filtered = filtered.filter(a => a.obra_nome.toLowerCase().includes(filtros.obra!.toLowerCase()));
    }
    if (filtros.auditor) {
      filtered = filtered.filter(a => a.auditor_principal.toLowerCase().includes(filtros.auditor!.toLowerCase()));
    }
    if (filtros.classificacao) {
      filtered = filtered.filter(a => a.classificacao === filtros.classificacao);
    }
    if (filtros.conformidadeMin !== undefined) {
      filtered = filtered.filter(a => a.percentagem_conformidade >= filtros.conformidadeMin!);
    }
    if (filtros.conformidadeMax !== undefined) {
      filtered = filtered.filter(a => a.percentagem_conformidade <= filtros.conformidadeMax!);
    }

    setFilteredAuditorias(filtered);
  };

  const handleSelectAuditoria = (id: string) => {
    setSelectedAuditorias(prev => 
      prev.includes(id) 
        ? prev.filter(a => a !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAuditorias.length === filteredAuditorias.length) {
      setSelectedAuditorias([]);
    } else {
      setSelectedAuditorias(filteredAuditorias.map(a => a.id));
    }
  };

  const handleUploadFile = async (file: File) => {
    try {
      // Mock upload
      const novoArquivo: ArquivoRelatorio = {
        id: Date.now().toString(),
        nome: file.name,
        tipo: file.name.split('.').pop() || 'pdf',
        tamanho: file.size,
        dataUpload: new Date().toISOString(),
        url: '#',
        descricao: `Arquivo enviado em ${new Date().toLocaleDateString('pt-PT')}`
      };
      
      setArquivos(prev => [novoArquivo, ...prev]);
      setShowUploadModal(false);
      toast.success('Arquivo enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      toast.error('Erro ao enviar arquivo');
    }
  };

  const handleDownloadFile = (arquivo: ArquivoRelatorio) => {
    // Mock download
    const link = document.createElement('a');
    link.href = arquivo.url;
    link.download = arquivo.nome;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Download iniciado: ${arquivo.nome}`);
  };

  const handleGeneratePDF = async () => {
    if (selectedAuditorias.length === 0) {
      toast.error('Selecione pelo menos uma auditoria para gerar o relatório');
      return;
    }

    setGeneratingPDF(true);
    try {
      // Mock PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${btoa('Mock PDF content')}`;
      link.download = `relatorio_auditorias_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Relatório PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar relatório PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluida': return 'text-green-600 bg-green-100';
      case 'em_curso': return 'text-blue-600 bg-blue-100';
      case 'programada': return 'text-yellow-600 bg-yellow-100';
      case 'cancelada': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getResultadoColor = (resultado: string) => {
    switch (resultado) {
      case 'conforme': return 'text-green-600';
      case 'nao_conforme': return 'text-red-600';
      case 'conforme_com_observacoes': return 'text-yellow-600';
      case 'pendente': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pt-16">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pt-16">
      <div className="space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-sm border-b border-gray-200 mb-8"
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <FileText className="h-8 w-8 mr-3 text-blue-600" />
                  Relatórios de Auditorias
                </h1>
                <p className="text-xl text-gray-600 flex items-center mt-2">
                  <Target className="h-5 w-5 mr-2 text-purple-500" />
                  Sistema de Relatórios e Documentação - Auditorias SGQ
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload</span>
                </button>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
                >
                  <Filter className="h-5 w-5" />
                  <span>Filtros</span>
                </button>
                
                <button
                  onClick={handleGeneratePDF}
                  disabled={selectedAuditorias.length === 0 || generatingPDF}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50"
                >
                  {generatingPDF ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Printer className="h-5 w-5" />
                  )}
                  <span>{generatingPDF ? 'Gerando...' : 'Gerar PDF'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_auditorias}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Ano</p>
                <p className="text-2xl font-bold text-green-600">{stats.auditorias_este_ano}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Mês</p>
                <p className="text-2xl font-bold text-purple-600">{stats.auditorias_este_mes}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conformidade</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.percentagem_conformidade_geral}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">NCs Abertas</p>
                <p className="text-2xl font-bold text-red-600">{stats.nao_conformidades_abertas}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ações Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.acoes_corretivas_pendentes}</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </motion.div>

        {/* Gráficos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Auditorias por Tipo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={stats.auditorias_por_tipo}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="quantidade"
                  label={({ tipo, quantidade }) => `${tipo}: ${quantidade}`}
                >
                  {stats.auditorias_por_tipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conformidade por Obra</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.conformidade_por_obra}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="obra" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conformidade" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Filtros Avançados */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros Avançados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                <input
                  type="date"
                  value={filtros.dataInicio || ''}
                  onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                <input
                  type="date"
                  value={filtros.dataFim || ''}
                  onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={filtros.tipo || ''}
                  onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="interna">Interna</option>
                  <option value="externa">Externa</option>
                  <option value="certificacao">Certificação</option>
                  <option value="seguimento">Seguimento</option>
                  <option value="surpresa">Surpresa</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filtros.status || ''}
                  onChange={(e) => setFiltros({ ...filtros, status: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="programada">Programada</option>
                  <option value="em_curso">Em Curso</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resultado</label>
                <select
                  value={filtros.resultado || ''}
                  onChange={(e) => setFiltros({ ...filtros, resultado: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="conforme">Conforme</option>
                  <option value="nao_conforme">Não Conforme</option>
                  <option value="conforme_com_observacoes">Conforme com Observações</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Obra</label>
                <input
                  type="text"
                  placeholder="Nome da obra"
                  value={filtros.obra || ''}
                  onChange={(e) => setFiltros({ ...filtros, obra: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auditor</label>
                <input
                  type="text"
                  placeholder="Nome do auditor"
                  value={filtros.auditor || ''}
                  onChange={(e) => setFiltros({ ...filtros, auditor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conformidade Mínima (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={filtros.conformidadeMin || ''}
                  onChange={(e) => setFiltros({ ...filtros, conformidadeMin: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-end space-x-3">
              <button
                onClick={() => setFiltros({})}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Aplicar
              </button>
            </div>
          </motion.div>
        )}

        {/* Pesquisa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar auditorias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedAuditorias.length} de {filteredAuditorias.length} selecionadas
              </span>
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                {selectedAuditorias.length === filteredAuditorias.length ? 'Desselecionar' : 'Selecionar'} Todos
              </button>
            </div>
          </div>
        </motion.div>

        {/* Lista de Auditorias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedAuditorias.length === filteredAuditorias.length && filteredAuditorias.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auditoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resultado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conformidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAuditorias.map((auditoria) => (
                  <motion.tr
                    key={auditoria.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedAuditorias.includes(auditoria.id)}
                        onChange={() => handleSelectAuditoria(auditoria.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{auditoria.codigo}</div>
                          <div className="text-sm text-gray-500">{auditoria.escopo}</div>
                          <div className="text-sm text-gray-500">{auditoria.obra_nome}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(auditoria.status)}`}>
                        {auditoria.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getResultadoColor(auditoria.resultado)}`}>
                        {auditoria.resultado}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ width: `${auditoria.percentagem_conformidade}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{auditoria.percentagem_conformidade}%</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(auditoria.data_inicio).toLocaleDateString('pt-PT')}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAuditorias.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma auditoria encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || Object.values(filtros).some(f => f !== '' && f !== undefined)
                  ? 'Tente ajustar os filtros de pesquisa.'
                  : 'Não há auditorias disponíveis para relatório.'}
              </p>
            </div>
          )}
        </motion.div>

        {/* Arquivos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Arquivos de Relatórios</h3>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {arquivos.map((arquivo) => (
              <div key={arquivo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {arquivo.tipo === 'pdf' && <FileText className="h-5 w-5 text-red-500" />}
                      {arquivo.tipo === 'excel' && <FileSpreadsheet className="h-5 w-5 text-green-500" />}
                      {arquivo.tipo === 'csv' && <FileCode className="h-5 w-5 text-blue-500" />}
                      <h4 className="text-sm font-medium text-gray-900 truncate">{arquivo.nome}</h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{arquivo.descricao}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(arquivo.tamanho)}</span>
                      <span>{new Date(arquivo.dataUpload).toLocaleDateString('pt-PT')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(arquivo)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal de Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload de Arquivo</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Fechar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h4 className="mt-2 text-sm font-medium text-gray-900">Upload de Arquivo</h4>
              <p className="mt-1 text-sm text-gray-500">
                Arraste e solte um arquivo aqui ou clique para selecionar
              </p>
              <input
                type="file"
                accept=".pdf,.xlsx,.xls,.csv,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleUploadFile(file);
                  }
                }}
                className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            <div className="mt-4 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
