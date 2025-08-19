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
import { PIEInstancia } from '../types/pie';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  Cell
} from 'recharts';

interface FiltrosRelatorio {
  dataInicio?: string;
  dataFim?: string;
  status?: string;
  prioridade?: string;
  responsavel?: string;
  zona?: string;
  obra?: string;
}

interface EstatisticasPIE {
  totalPIEs: number;
  emAndamento: number;
  concluidos: number;
  aprovados: number;
  reprovados: number;
  porStatus: { status: string; quantidade: number; }[];
  porPrioridade: { prioridade: string; quantidade: number; }[];
  porZona: { zona: string; quantidade: number; }[];
  porResponsavel: { responsavel: string; quantidade: number; }[];
}

export default function RelatoriosPontosInspecao() {
  const [pies, setPies] = useState<PIEInstancia[]>([]);
  const [filteredPies, setFilteredPies] = useState<PIEInstancia[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPies, setSelectedPies] = useState<string[]>([]);
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({});
  const [stats, setStats] = useState<EstatisticasPIE>({
    totalPIEs: 0,
    emAndamento: 0,
    concluidos: 0,
    aprovados: 0,
    reprovados: 0,
    porStatus: [],
    porPrioridade: [],
    porZona: [],
    porResponsavel: []
  });

  // Mock data para demonstração
  const mockPies: PIEInstancia[] = [
    {
      id: '1',
      codigo: 'PIE-20241201-0001',
      titulo: 'Inspeção de Fundações - Bloco A',
      descricao: 'Inspeção completa das fundações do bloco A da obra',
      status: 'em_andamento',
      prioridade: 'alta',
      data_planeada: '2024-12-15',
      responsavel: 'João Silva',
      zona: 'Bloco A',
      user_id: 'user1',
      created_at: '2024-12-01T10:00:00Z',
      updated_at: '2024-12-01T10:00:00Z',
      ppi_modelos: { nome: 'Fundações CCG', categoria: 'CCG' },
      obras: { nome: 'Residencial Solar' }
    },
    {
      id: '2',
      codigo: 'PIE-20241201-0002',
      titulo: 'Ensaio de Resistência - Pilares',
      descricao: 'Ensaio de resistência à compressão dos pilares',
      status: 'aprovado',
      prioridade: 'normal',
      data_planeada: '2024-12-10',
      responsavel: 'Maria Santos',
      zona: 'Bloco B',
      user_id: 'user2',
      created_at: '2024-12-01T11:00:00Z',
      updated_at: '2024-12-01T11:00:00Z',
      ppi_modelos: { nome: 'Estruturas CCG', categoria: 'CCG' },
      obras: { nome: 'Residencial Solar' }
    },
    {
      id: '3',
      codigo: 'PIE-20241201-0003',
      titulo: 'Controlo de Qualidade - Betão',
      descricao: 'Controlo de qualidade do betão utilizado',
      status: 'concluido',
      prioridade: 'alta',
      data_planeada: '2024-12-05',
      responsavel: 'Carlos Oliveira',
      zona: 'Bloco C',
      user_id: 'user3',
      created_at: '2024-12-01T09:00:00Z',
      updated_at: '2024-12-01T09:00:00Z',
      ppi_modelos: { nome: 'Materiais CCG', categoria: 'CCG' },
      obras: { nome: 'Residencial Solar' }
    }
  ];

  useEffect(() => {
    loadPies();
  }, []);

  useEffect(() => {
    filterPies();
  }, [pies, searchTerm, filtros]);

  const loadPies = async () => {
    try {
      setLoading(true);
      // Simular carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPies(mockPies);
      calculateStats(mockPies);
    } catch (error) {
      toast.error('Erro ao carregar PIEs');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (piesData: PIEInstancia[]) => {
    const totalPIEs = piesData.length;
    const emAndamento = piesData.filter(p => p.status === 'em_andamento').length;
    const concluidos = piesData.filter(p => p.status === 'concluido').length;
    const aprovados = piesData.filter(p => p.status === 'aprovado').length;
    const reprovados = piesData.filter(p => p.status === 'reprovado').length;

    // Agrupar por status
    const statusCounts = piesData.reduce((acc, pie) => {
      acc[pie.status] = (acc[pie.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porStatus = Object.entries(statusCounts).map(([status, quantidade]) => ({
      status,
      quantidade
    }));

    // Agrupar por prioridade
    const prioridadeCounts = piesData.reduce((acc, pie) => {
      acc[pie.prioridade] = (acc[pie.prioridade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porPrioridade = Object.entries(prioridadeCounts).map(([prioridade, quantidade]) => ({
      prioridade,
      quantidade
    }));

    // Agrupar por zona
    const zonaCounts = piesData.reduce((acc, pie) => {
      const zona = pie.zona || 'Sem zona';
      acc[zona] = (acc[zona] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porZona = Object.entries(zonaCounts).map(([zona, quantidade]) => ({
      zona,
      quantidade
    }));

    // Agrupar por responsável
    const responsavelCounts = piesData.reduce((acc, pie) => {
      const responsavel = pie.responsavel || 'Sem responsável';
      acc[responsavel] = (acc[responsavel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const porResponsavel = Object.entries(responsavelCounts).map(([responsavel, quantidade]) => ({
      responsavel,
      quantidade
    }));

    setStats({
      totalPIEs,
      emAndamento,
      concluidos,
      aprovados,
      reprovados,
      porStatus,
      porPrioridade,
      porZona,
      porResponsavel
    });
  };

  const filterPies = () => {
    let filtered = pies;

    // Filtro de pesquisa
    if (searchTerm) {
      filtered = filtered.filter(pie =>
        pie.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pie.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pie.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pie.responsavel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pie.zona?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtros específicos
    if (filtros.status && filtros.status !== 'all') {
      filtered = filtered.filter(pie => pie.status === filtros.status);
    }

    if (filtros.prioridade && filtros.prioridade !== 'all') {
      filtered = filtered.filter(pie => pie.prioridade === filtros.prioridade);
    }

    if (filtros.responsavel) {
      filtered = filtered.filter(pie => 
        pie.responsavel?.toLowerCase().includes(filtros.responsavel!.toLowerCase())
      );
    }

    if (filtros.zona) {
      filtered = filtered.filter(pie => 
        pie.zona?.toLowerCase().includes(filtros.zona!.toLowerCase())
      );
    }

    if (filtros.dataInicio) {
      filtered = filtered.filter(pie => 
        new Date(pie.created_at) >= new Date(filtros.dataInicio!)
      );
    }

    if (filtros.dataFim) {
      filtered = filtered.filter(pie => 
        new Date(pie.created_at) <= new Date(filtros.dataFim!)
      );
    }

    setFilteredPies(filtered);
    calculateStats(filtered);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const piesToExport = selectedPies.length > 0 
        ? filteredPies.filter(pie => selectedPies.includes(pie.id))
        : filteredPies;

      // Criar PDF real
      const doc = new jsPDF();
      
      // Configuração da empresa
      const empresa = {
        nome: "ASCH Infraestructuras y Servicios SA",
        morada: "Praça das Industrias - Edificio Aip - Sala 7, Nº Aip, 3, Lisboa 1300-307 Lisboa",
        email: "info@aschinfraestructuras.com",
        telefone: "+351 123 456 789"
      };

      // Cabeçalho profissional com fundo azul
      doc.setFillColor(30, 64, 175); // Azul escuro
      doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
      
      // Logo/Texto da empresa (branco)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Qualicore', 20, 20);
      
      // Informações da empresa
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(empresa.nome, 20, 28);
      doc.text(`${empresa.morada} | Tel: ${empresa.telefone} | Email: ${empresa.email}`, 20, 32);
      
      // Título do relatório (preto)
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Relatório de Pontos de Inspeção e Ensaios', 20, 55);
      
      // Subtítulo
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99); // Cinza
      doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 20, 65);
      
      // Linha separadora
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(20, 80, doc.internal.pageSize.width - 20, 80);
      
      // Informações gerais
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(`Total de PIEs: ${piesToExport.length}`, 20, 95);
      
      // Estatísticas
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Estatísticas', 20, 115);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Em Andamento: ${stats.emAndamento}`, 20, 125);
      doc.text(`Concluídos: ${stats.concluidos}`, 20, 135);
      doc.text(`Aprovados: ${stats.aprovados}`, 20, 145);
      doc.text(`Reprovados: ${stats.reprovados}`, 20, 155);
      
      // Tabela de PIEs
      if (piesToExport.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Lista de PIEs', 20, 180);
        
        const tableData = piesToExport.map(pie => [
          pie.codigo,
          pie.titulo,
          pie.status.replace('_', ' '),
          pie.prioridade,
          pie.responsavel || 'N/A',
          pie.zona || 'N/A',
          pie.data_planeada ? new Date(pie.data_planeada).toLocaleDateString('pt-PT') : 'N/A'
        ]);
        
        autoTable(doc, {
          head: [['Código', 'Título', 'Status', 'Prioridade', 'Responsável', 'Zona', 'Data Planeada']],
          body: tableData,
          startY: 190,
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255
          }
        });
      }
      
      // Rodapé profissional
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // Linha separadora
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.5);
      doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
      
      // Informações do rodapé
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.setFont('helvetica', 'normal');
      
      // Lado esquerdo - Informações da empresa
      doc.text('Qualicore - Sistema de Gestão de Qualidade', 20, pageHeight - 20);
      doc.text('ASCH Infraestructuras y Servicios SA', 20, pageHeight - 15);
      
      // Centro - Data
      doc.text(`Data: ${new Date().toLocaleDateString('pt-PT')}`, pageWidth/2 - 15, pageHeight - 20);
      
      // Lado direito - Numeração de páginas
      doc.text(`Página 1 de 1`, pageWidth - 50, pageHeight - 20);
      doc.text('Documento confidencial', pageWidth - 60, pageHeight - 15);
      
      // Salvar PDF
      doc.save(`relatorio-pies-${new Date().getTime()}.pdf`);
      
      toast.success(`Relatório PDF exportado com ${piesToExport.length} PIEs`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao exportar relatório');
    } finally {
      setExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const piesToExport = selectedPies.length > 0 
        ? filteredPies.filter(pie => selectedPies.includes(pie.id))
        : filteredPies;

      // Simular exportação Excel
      const csvContent = [
        'Código,Título,Status,Prioridade,Responsável,Zona,Data Planeada,Obra',
        ...piesToExport.map(pie => 
          `${pie.codigo},"${pie.titulo}",${pie.status},${pie.prioridade},"${pie.responsavel || ''}","${pie.zona || ''}",${pie.data_planeada || ''},"${pie.obras?.nome || ''}"`
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-pies-${new Date().getTime()}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(`Relatório Excel exportado com ${piesToExport.length} PIEs`);
    } catch (error) {
      toast.error('Erro ao exportar relatório');
    } finally {
      setExporting(false);
    }
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Simular upload e processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Arquivo importado com sucesso');
      loadPies(); // Recarregar dados
    } catch (error) {
      toast.error('Erro ao importar arquivo');
    } finally {
      setUploading(false);
      // Limpar input
      event.target.value = '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'reprovado': return 'bg-red-100 text-red-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'urgente': return 'bg-purple-100 text-purple-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'baixa': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pt-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Relatórios PIE</h1>
                <p className="text-gray-600 mt-1">
                  Relatórios de Pontos de Inspeção e Ensaios
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <label className="relative">
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv"
                  onChange={handleImportFile}
                  className="hidden"
                />
                <button
                  disabled={uploading}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Importando...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5" />
                      <span>Importar</span>
                    </>
                  )}
                </button>
              </label>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
              >
                <Filter className="h-5 w-5" />
                <span>Filtros</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filtros */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Filtros Avançados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Início
                </label>
                <input
                  type="date"
                  value={filtros.dataInicio || ''}
                  onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={filtros.dataFim || ''}
                  onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filtros.status || 'all'}
                  onChange={(e) => setFiltros({...filtros, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="rascunho">Rascunho</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="reprovado">Reprovado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <select
                  value={filtros.prioridade || 'all'}
                  onChange={(e) => setFiltros({...filtros, prioridade: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas</option>
                  <option value="baixa">Baixa</option>
                  <option value="normal">Normal</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsável
                </label>
                <input
                  type="text"
                  placeholder="Nome do responsável"
                  value={filtros.responsavel || ''}
                  onChange={(e) => setFiltros({...filtros, responsavel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona
                </label>
                <input
                  type="text"
                  placeholder="Nome da zona"
                  value={filtros.zona || ''}
                  onChange={(e) => setFiltros({...filtros, zona: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFiltros({});
                    setSearchTerm('');
                  }}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Estatísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
      >
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total PIEs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPIEs}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Andamento</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.emAndamento}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold text-blue-600">{stats.concluidos}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aprovados</p>
              <p className="text-2xl font-bold text-green-600">{stats.aprovados}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reprovados</p>
              <p className="text-2xl font-bold text-red-600">{stats.reprovados}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gráficos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Gráfico de Status */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChart className="h-5 w-5 mr-2 text-blue-600" />
            PIEs por Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={stats.porStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, quantidade }) => `${status}: ${quantidade}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="quantidade"
                nameKey="status"
              >
                {stats.porStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Prioridade */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
            PIEs por Prioridade
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.porPrioridade}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="prioridade" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Busca e Exportação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar PIEs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                {selectedPies.length > 0 
                  ? `${selectedPies.length} selecionados` 
                  : `${filteredPies.length} PIEs encontrados`}
              </span>
              <button
                onClick={handleExportPDF}
                disabled={exporting}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Exportando...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5" />
                    <span>PDF</span>
                  </>
                )}
              </button>
              <button
                onClick={handleExportExcel}
                disabled={exporting}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Exportando...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-5 w-5" />
                    <span>Excel</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabela de PIEs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedPies.length === filteredPies.length && filteredPies.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPies(filteredPies.map(pie => pie.id));
                      } else {
                        setSelectedPies([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zona
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Planeada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPies.map((pie) => (
                <tr key={pie.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedPies.includes(pie.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPies([...selectedPies, pie.id]);
                        } else {
                          setSelectedPies(selectedPies.filter(id => id !== pie.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pie.codigo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{pie.titulo}</div>
                      {pie.descricao && (
                        <div className="text-gray-500 text-xs mt-1 truncate max-w-xs">
                          {pie.descricao}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(pie.status)}`}>
                      {pie.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPrioridadeColor(pie.prioridade)}`}>
                      {pie.prioridade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pie.responsavel || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pie.zona || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pie.data_planeada ? new Date(pie.data_planeada).toLocaleDateString('pt-PT') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(`/pie/view/${pie.id}`, '_blank')}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => window.open(`/pie/editor/${pie.id}`, '_blank')}
                        className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                        title="Editar PIE"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setSelectedPies([pie.id])}
                        className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                        title="Selecionar para exportação"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPies.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum PIE encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar os filtros ou termo de pesquisa.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
