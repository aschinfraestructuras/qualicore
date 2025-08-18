import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  Tag,
  Users,
  MapPin,
  Calendar,
  BarChart3,
  FileText,
  X,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  Cloud
} from 'lucide-react';
import { PIEInstancia } from '@/types/pie';
import PDFService from '@/services/pdfService';
import toast from 'react-hot-toast';

interface PIECardProps {
  pie: PIEInstancia;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
  onShare: (id: string) => void;
}

const PIECard: React.FC<PIECardProps> = ({ pie, onEdit, onView, onDelete, onExport, onShare }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800';
      case 'reprovado': return 'bg-red-100 text-red-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovado': return <CheckCircle className="w-4 h-4" />;
      case 'em_andamento': return <Clock className="w-4 h-4" />;
      case 'reprovado': return <XCircle className="w-4 h-4" />;
      case 'concluido': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'urgente': return 'bg-purple-100 text-purple-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'baixa': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{pie.titulo}</h3>
            <p className="text-sm text-gray-600">{pie.codigo}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(pie.status)}`}>
              {getStatusIcon(pie.status)}
              <span className="ml-1">{pie.status.replace('_', ' ')}</span>
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(pie.prioridade)}`}>
              {pie.prioridade}
            </span>
          </div>
        </div>

        {/* Description */}
        {pie.descricao && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pie.descricao}</p>
        )}

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Progresso</span>
            <span className="font-medium">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          {pie.responsavel && (
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span className="truncate">{pie.responsavel}</span>
            </div>
          )}
          {pie.zona && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{pie.zona}</span>
            </div>
          )}
          {pie.data_planeada && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(pie.data_planeada).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
          {pie.ppi_modelos && (
            <div className="flex items-center gap-2 text-gray-600">
              <Tag className="w-4 h-4" />
              <span className="truncate">{pie.ppi_modelos.nome}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onView(pie.id)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Visualizar"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(pie.id)}
              className="p-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onExport(pie.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="Exportar"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => onShare(pie.id)}
              className="p-2 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
              title="Partilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de Relatórios Individuais
interface RelatorioIndividualModalProps {
  pie: PIEInstancia | null;
  onClose: () => void;
}

const RelatorioIndividualModal: React.FC<RelatorioIndividualModalProps> = ({ pie, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    prioridade: '',
    responsavel: '',
    zona: '',
    dataInicio: '',
    dataFim: ''
  });

  const handleGenerateReport = async (tipo: 'executivo' | 'individual' | 'filtrado') => {
    if (!pie) return;
    
    // Para relatório filtrado, mostrar filtros primeiro
    if (tipo === 'filtrado') {
      setShowFilters(true);
      return;
    }
    
    setLoading(true);
    try {
      // Simular dados completos do PIE para o relatório
      const pieCompleto = {
        ...pie,
        secoes: [
          {
            id: 'secao-1',
            modelo_id: '1',
            codigo: 'SEC-001',
            nome: 'Inspeção Visual',
            descricao: 'Verificação visual dos elementos estruturais e acabamentos',
            ordem: 1,
            obrigatorio: true,
            ativo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            pontos: [
              {
                id: 'ponto-1',
                secao_id: 'secao-1',
                codigo: 'P-001',
                titulo: 'Estado geral da superfície',
                descricao: 'Verificar se a superfície está limpa e sem danos visíveis',
                tipo: 'checkbox' as const,
                obrigatorio: true,
                ordem: 1,
                ativo: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                resposta: {
                  id: 'resposta-1',
                  instancia_id: pie.id,
                  ponto_id: 'ponto-1',
                  data_resposta: new Date().toISOString(),
                  valor_booleano: true,
                  conforme: true,
                  responsavel: pie.responsavel || 'João Silva',
                  observacoes: 'Superfície em excelente estado, sem danos ou imperfeições',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              },
              {
                id: 'ponto-2',
                secao_id: 'secao-1',
                codigo: 'P-002',
                titulo: 'Medições dimensionais',
                descricao: 'Verificar as dimensões conforme especificações do projeto',
                tipo: 'number' as const,
                obrigatorio: true,
                ordem: 2,
                ativo: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                resposta: {
                  id: 'resposta-2',
                  instancia_id: pie.id,
                  ponto_id: 'ponto-2',
                  data_resposta: new Date().toISOString(),
                  valor_numerico: 25.5,
                  conforme: true,
                  responsavel: pie.responsavel || 'Maria Santos',
                  observacoes: 'Dimensões dentro da tolerância especificada (±2mm)',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              },
              {
                id: 'ponto-3',
                secao_id: 'secao-1',
                codigo: 'P-003',
                titulo: 'Alinhamento vertical',
                descricao: 'Verificar o alinhamento vertical dos elementos',
                tipo: 'text' as const,
                obrigatorio: true,
                ordem: 3,
                ativo: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                resposta: {
                  id: 'resposta-3',
                  instancia_id: pie.id,
                  ponto_id: 'ponto-3',
                  data_resposta: new Date().toISOString(),
                  valor: 'Alinhamento correto',
                  conforme: true,
                  responsavel: pie.responsavel || 'Carlos Oliveira',
                  observacoes: 'Alinhamento vertical dentro dos padrões aceitáveis',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              }
            ]
          },
          {
            id: 'secao-2',
            modelo_id: '1',
            codigo: 'SEC-002',
            nome: 'Ensaios de Resistência',
            descricao: 'Ensaios para verificar a resistência dos materiais',
            ordem: 2,
            obrigatorio: true,
            ativo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            pontos: [
              {
                id: 'ponto-4',
                secao_id: 'secao-2',
                codigo: 'P-004',
                titulo: 'Resistência à compressão',
                descricao: 'Ensaio de resistência à compressão do concreto',
                tipo: 'number' as const,
                obrigatorio: true,
                ordem: 1,
                ativo: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                resposta: {
                  id: 'resposta-4',
                  instancia_id: pie.id,
                  ponto_id: 'ponto-4',
                  data_resposta: new Date().toISOString(),
                  valor_numerico: 35.2,
                  conforme: true,
                  responsavel: pie.responsavel || 'Ana Costa',
                  observacoes: 'Resistência superior ao mínimo especificado (30 MPa)',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              },
              {
                id: 'ponto-5',
                secao_id: 'secao-2',
                codigo: 'P-005',
                titulo: 'Resistência à tração',
                descricao: 'Ensaio de resistência à tração dos aços',
                tipo: 'number' as const,
                obrigatorio: true,
                ordem: 2,
                ativo: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                resposta: {
                  id: 'resposta-5',
                  instancia_id: pie.id,
                  ponto_id: 'ponto-5',
                  data_resposta: new Date().toISOString(),
                  valor_numerico: 500,
                  conforme: true,
                  responsavel: pie.responsavel || 'Pedro Lima',
                  observacoes: 'Resistência à tração conforme especificação (500 MPa)',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              }
            ]
          },
          {
            id: 'secao-3',
            modelo_id: '1',
            codigo: 'SEC-003',
            nome: 'Documentação',
            descricao: 'Verificação da documentação técnica',
            ordem: 3,
            obrigatorio: true,
            ativo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            pontos: [
              {
                id: 'ponto-6',
                secao_id: 'secao-3',
                codigo: 'P-006',
                titulo: 'Certificados de qualidade',
                descricao: 'Verificar se os certificados estão atualizados',
                tipo: 'checkbox' as const,
                obrigatorio: true,
                ordem: 1,
                ativo: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                resposta: {
                  id: 'resposta-6',
                  instancia_id: pie.id,
                  ponto_id: 'ponto-6',
                  data_resposta: new Date().toISOString(),
                  valor_booleano: true,
                  conforme: true,
                  responsavel: pie.responsavel || 'Sofia Martins',
                  observacoes: 'Todos os certificados estão válidos e atualizados',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              },
              {
                id: 'ponto-7',
                secao_id: 'secao-3',
                codigo: 'P-007',
                titulo: 'Relatórios de ensaio',
                descricao: 'Verificar se os relatórios estão completos',
                tipo: 'file' as const,
                obrigatorio: true,
                ordem: 2,
                ativo: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                resposta: {
                  id: 'resposta-7',
                  instancia_id: pie.id,
                  ponto_id: 'ponto-7',
                  data_resposta: new Date().toISOString(),
                  arquivos: ['relatorio-ensaio-001.pdf', 'relatorio-ensaio-002.pdf'],
                  conforme: true,
                  responsavel: pie.responsavel || 'Ricardo Ferreira',
                  observacoes: 'Relatórios anexados e verificados',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              }
            ]
          }
        ]
      };

      const estatisticas = PDFService.calculateStatistics(pieCompleto.secoes);

      const reportData = {
        pie: {
          ...pieCompleto,
          prioridade: pieCompleto.prioridade === 'media' ? 'normal' : pieCompleto.prioridade
        },
        secoes: pieCompleto.secoes,
        estatisticas,
        // Dados de assinatura e responsáveis
        assinaturas: {
          qualidade: {
            nome: 'Maria Santos',
            cargo: 'Técnica de Qualidade',
            data: new Date().toISOString()
          },
          chefeObra: {
            nome: 'João Silva',
            cargo: 'Chefe de Obra',
            data: new Date().toISOString()
          }
        },
        responsaveis: {
          betonagem: 'Pedro Costa - Encarregado',
          geometria: 'António Ferreira - Topógrafo',
          ensaios: 'Laboratório Técnico',
          acabamentos: 'Manuel Rodrigues - Acabador',
          estrutural: 'Eng. Carlos Lima'
        },
        datas: {
          inicio: pie.created_at,
          fim: new Date().toISOString(),
          aprovacao: new Date().toISOString()
        }
      };

      // Gerar PDF com o tipo correto
      const pdfUrl = await PDFService.generatePIEReport(reportData, tipo);
      
      // Download do arquivo
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `PIE-${pie.codigo}-${tipo}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar URL
      URL.revokeObjectURL(pdfUrl);
      
      toast.success(`Relatório ${tipo} gerado com sucesso!`);
      onClose();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    try {
      // Simular dados filtrados baseados nos filtros aplicados
      const pieCompleto = {
        ...pie,
        // Aplicar filtros aos dados
        status: filters.status || pie.status,
        prioridade: filters.prioridade || pie.prioridade,
        responsavel: filters.responsavel || pie.responsavel,
        zona: filters.zona || pie.zona,
        secoes: [
          {
            id: 'secao-1',
            modelo_id: '1',
            codigo: 'SEC-001',
            nome: 'Inspeção Visual',
            descricao: 'Verificação visual dos elementos estruturais e acabamentos',
            ordem: 1,
            obrigatorio: true,
            ativo: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            pontos: [
              {
                id: 'ponto-1',
                secao_id: 'secao-1',
                codigo: 'P-001',
                titulo: 'Estado geral da superfície',
                descricao: 'Verificar se a superfície está limpa e sem danos visíveis',
                tipo: 'checkbox' as const,
                obrigatorio: true,
                ordem: 1,
                ativo: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                resposta: {
                  id: 'resposta-1',
                  instancia_id: pie.id,
                  ponto_id: 'ponto-1',
                  data_resposta: new Date().toISOString(),
                  valor_booleano: true,
                  conforme: true,
                  responsavel: pie.responsavel || 'João Silva',
                  observacoes: 'Superfície em excelente estado, sem danos ou imperfeições',
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                }
              }
            ]
          }
        ]
      };

      const estatisticas = PDFService.calculateStatistics(pieCompleto.secoes);

      const reportData = {
        pie: {
          ...pieCompleto,
          prioridade: (pieCompleto.prioridade === 'media' ? 'normal' : pieCompleto.prioridade) as 'baixa' | 'normal' | 'alta' | 'urgente',
          status: pieCompleto.status as 'rascunho' | 'em_andamento' | 'concluido' | 'aprovado' | 'reprovado'
        },
        secoes: pieCompleto.secoes,
        estatisticas,
        filters, // Incluir filtros aplicados
        // Dados de assinatura e responsáveis
        assinaturas: {
          qualidade: {
            nome: 'Maria Santos',
            cargo: 'Técnica de Qualidade',
            data: new Date().toISOString()
          },
          chefeObra: {
            nome: 'João Silva',
            cargo: 'Chefe de Obra',
            data: new Date().toISOString()
          }
        },
        responsaveis: {
          betonagem: 'Pedro Costa - Encarregado',
          geometria: 'António Ferreira - Topógrafo',
          ensaios: 'Laboratório Técnico',
          acabamentos: 'Manuel Rodrigues - Acabador',
          estrutural: 'Eng. Carlos Lima'
        },
        datas: {
          inicio: pie.created_at,
          fim: new Date().toISOString(),
          aprovacao: new Date().toISOString()
        }
      };

      // Gerar PDF filtrado
      const pdfUrl = await PDFService.generatePIEReport(reportData, 'filtrado');
      
      // Download do arquivo
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `PIE-${pie.codigo}-filtrado-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpar URL
      URL.revokeObjectURL(pdfUrl);
      
      toast.success('Relatório filtrado gerado com sucesso!');
      setShowFilters(false);
      onClose();
    } catch (error) {
      console.error('Erro ao gerar relatório filtrado:', error);
      toast.error('Erro ao gerar relatório filtrado');
    } finally {
      setLoading(false);
    }
  };

  if (!pie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Relatórios PIE</h2>
              <p className="text-sm text-gray-600">{pie.codigo} - {pie.titulo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Relatório Executivo */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Relatório Executivo</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Visão geral e indicadores de performance</p>
              
              <button
                onClick={() => handleGenerateReport('executivo')}
                disabled={loading}
                className="w-full btn btn-primary"
              >
                {loading ? 'Gerando...' : 'Gerar PDF'}
              </button>
            </div>

            {/* Relatório Individual */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Relatório Individual</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Ficha técnica detalhada do PIE</p>
              
              <button
                onClick={() => handleGenerateReport('individual')}
                disabled={loading}
                className="w-full btn btn-outline"
              >
                {loading ? 'Gerando...' : 'Gerar PDF'}
              </button>
            </div>

            {/* Relatório Filtrado */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Relatório Filtrado</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Análise com filtros aplicados</p>
              
              <button
                onClick={() => handleGenerateReport('filtrado')}
                disabled={loading}
                className="w-full btn btn-outline"
              >
                {loading ? 'Gerando...' : 'Aplicar Filtros'}
              </button>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do PIE</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{pie.status}</div>
                <div className="text-sm text-gray-600">Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{pie.prioridade}</div>
                <div className="text-sm text-gray-600">Prioridade</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{pie.responsavel}</div>
                <div className="text-sm text-gray-600">Responsável</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{pie.zona}</div>
                <div className="text-sm text-gray-600">Zona</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Filtros */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Filter className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Filtros do Relatório</h2>
                  <p className="text-sm text-gray-600">Configure os filtros para o relatório</p>
                </div>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos os status</option>
                    <option value="rascunho">Rascunho</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluido">Concluído</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="reprovado">Reprovado</option>
                  </select>
                </div>

                {/* Prioridade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={filters.prioridade}
                    onChange={(e) => setFilters({...filters, prioridade: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todas as prioridades</option>
                    <option value="baixa">Baixa</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                {/* Responsável */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsável
                  </label>
                  <input
                    type="text"
                    value={filters.responsavel}
                    onChange={(e) => setFilters({...filters, responsavel: e.target.value})}
                    placeholder="Nome do responsável"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Zona */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona
                  </label>
                  <input
                    type="text"
                    value={filters.zona}
                    onChange={(e) => setFilters({...filters, zona: e.target.value})}
                    placeholder="Nome da zona"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Período */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Início
                    </label>
                    <input
                      type="date"
                      value={filters.dataInicio}
                      onChange={(e) => setFilters({...filters, dataInicio: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Fim
                    </label>
                    <input
                      type="date"
                      value={filters.dataFim}
                      onChange={(e) => setFilters({...filters, dataFim: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleApplyFilters}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Gerando...' : 'Gerar Relatório'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PontosInspecaoEnsaios: React.FC = () => {
  const navigate = useNavigate();
  const [pies, setPies] = useState<PIEInstancia[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSavedPIE, setShowSavedPIE] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedPIE, setSelectedPIE] = useState<any>(null);

  // Mock data for demonstration
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
      zona: 'Pilares Centrais',
      user_id: 'user1',
      created_at: '2024-12-01T09:00:00Z',
      updated_at: '2024-12-01T09:00:00Z',
      ppi_modelos: { nome: 'Estrutura CCE', categoria: 'CCE' },
      obras: { nome: 'Residencial Solar' }
    },
    {
      id: '3',
      codigo: 'PIE-20241201-0003',
      titulo: 'Inspeção de Acabamentos',
      descricao: 'Verificação dos acabamentos internos',
      status: 'rascunho',
      prioridade: 'baixa',
      data_planeada: '2024-12-20',
      responsavel: 'Pedro Costa',
      zona: 'Apartamentos 101-105',
      user_id: 'user1',
      created_at: '2024-12-01T08:00:00Z',
      updated_at: '2024-12-01T08:00:00Z',
      ppi_modelos: { nome: 'Acabamentos CCM', categoria: 'CCM' },
      obras: { nome: 'Residencial Solar' }
    }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setPies(mockPies);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPies = pies.filter(pie => {
    const matchesSearch = pie.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pie.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pie.responsavel?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || pie.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || pie.prioridade === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleNewPIE = () => {
    navigate('/pie/editor');
  };

  const handleEdit = (id: string) => {
    navigate(`/pie/editor/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/pie/view/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja eliminar este PIE?')) {
      setPies(pies.filter(pie => pie.id !== id));
    }
  };

  const handleExport = (id: string) => {
    const pie = pies.find(p => p.id === id);
    if (pie) {
      setSelectedPIE(pie);
    }
  };

  const handleShare = (id: string) => {
    const pie = pies.find(p => p.id === id);
    if (pie) {
      // Simular partilha por email
      const emails = prompt('Digite os emails separados por vírgula:');
      if (emails) {
        toast.success(`PIE partilhado com: ${emails}`);
      }
    }
  };

  const getStatusCount = (status: string) => {
    return pies.filter(pie => pie.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="py-6 pt-14">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pontos de Inspeção e Ensaios</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gestão completa de pontos de inspeção e ensaios
                </p>
              </div>
              <button
                onClick={handleNewPIE}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Plano
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{pies.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount('em_andamento')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount('aprovado')}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{getStatusCount('rascunho')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Pesquisar PIEs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'cards' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Todas</option>
                    <option value="baixa">Baixa</option>
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredPies.length} resultado{filteredPies.length !== 1 ? 's' : ''} encontrado{filteredPies.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Content */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredPies.map(pie => (
              <PIECard
                key={pie.id}
                pie={pie}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
                onExport={handleExport}
                onShare={handleShare}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PIE
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Responsável
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Planeada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progresso
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPies.map(pie => (
                    <tr key={pie.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{pie.titulo}</div>
                          <div className="text-sm text-gray-500">{pie.codigo}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          pie.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                          pie.status === 'em_andamento' ? 'bg-yellow-100 text-yellow-800' :
                          pie.status === 'reprovado' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pie.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pie.responsavel || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pie.data_planeada ? new Date(pie.data_planeada).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">75%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(pie.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(pie.id)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(pie.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredPies.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum PIE encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                ? 'Tente ajustar os filtros de pesquisa.'
                : 'Comece criando o seu primeiro plano de inspeção e ensaios.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
              <div className="mt-6">
                <button
                  onClick={handleNewPIE}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro PIE
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal de Relatórios Individuais */}
        {selectedPIE && (
          <RelatorioIndividualModal
            pie={selectedPIE}
            onClose={() => setSelectedPIE(null)}
          />
        )}
      </div>
    </div>
  );
};

export default PontosInspecaoEnsaios; 