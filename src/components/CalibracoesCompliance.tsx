import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import NovaCertificacaoModal from './NovaCertificacaoModal';
import NovaAuditoriaModal from './NovaAuditoriaModal';
import Modal from './Modal';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Calendar,
  FileText,
  Download,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Award,
  FileCheck,
  Clipboard,
  CheckSquare,
  XSquare,
  Info,
  ExternalLink,
  Lock,
  Unlock,
  Star,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Target,
  Users,
  Building,
  HardHat,
  TestTube,
  Ruler,
  Thermometer,
  Gauge,
  Scale,
  Microscope,
  Calculator,
  Database
} from 'lucide-react';
import { 
  Equipamento, 
  Calibracao, 
  Manutencao, 
  Inspecao 
} from '../types/calibracoes';

interface CalibracoesComplianceProps {
  equipamentos: Equipamento[];
  calibracoes: Calibracao[];
  manutencoes: Manutencao[];
  inspecoes: Inspecao[];
  onRefresh: () => void;
}

// Tipos de certificações
interface Certificacao {
  id: string;
  equipamento_id: string;
  tipo: 'ISO_17025' | 'ISO_9001' | 'IPQ' | 'CEN' | 'ENAC' | 'OUTRO';
  numero: string;
  organismo: string;
  data_emissao: string;
  data_validade: string;
  status: 'ATIVA' | 'VENCIDA' | 'PENDENTE' | 'SUSPENSA';
  escopo: string;
  observacoes?: string;
}

// Tipos de auditorias
interface Auditoria {
  id: string;
  tipo: 'INTERNA' | 'EXTERNA' | 'CERTIFICACAO' | 'MANUTENCAO';
  data_auditoria: string;
  auditor: string;
  organismo?: string;
  resultado: 'APROVADA' | 'REPROVADA' | 'CONDICIONAL' | 'PENDENTE';
  conformidade: number; // 0-100%
  nao_conformidades: string[];
  acoes_corretivas: string[];
  proxima_auditoria?: string;
  relatorio_url?: string;
}

// Normas aplicáveis
const NORMAS_APLICAVEIS = {
  ISO_17025: {
    nome: 'ISO/IEC 17025 - Requisitos gerais para a competência de laboratórios de ensaio e calibração',
    descricao: 'Norma internacional para acreditação de laboratórios',
    versao: '2017',
    aplicabilidade: 'Laboratórios de ensaio e calibração'
  },
  ISO_9001: {
    nome: 'ISO 9001 - Sistemas de gestão da qualidade',
    descricao: 'Norma para sistemas de gestão da qualidade',
    versao: '2015',
    aplicabilidade: 'Todas as organizações'
  },
  NP_EN_1990: {
    nome: 'NP EN 1990 - Eurocódigo - Bases para o dimensionamento das estruturas',
    descricao: 'Norma Portuguesa baseada no Eurocódigo',
    versao: '2019',
    aplicabilidade: 'Estruturas de construção civil'
  },
  NP_EN_1992: {
    nome: 'NP EN 1992 - Eurocódigo 2 - Dimensionamento de estruturas de betão',
    descricao: 'Norma para dimensionamento de estruturas de betão',
    versao: '2019',
    aplicabilidade: 'Estruturas de betão'
  }
};

export default function CalibracoesCompliance({ 
  equipamentos, 
  calibracoes, 
  manutencoes, 
  inspecoes, 
  onRefresh 
}: CalibracoesComplianceProps) {
  const [showNovaCertificacao, setShowNovaCertificacao] = useState(false);
  const [showNovaAuditoria, setShowNovaAuditoria] = useState(false);
  const [selectedView, setSelectedView] = useState<'certificacoes' | 'auditorias' | 'normas' | 'riscos'>('certificacoes');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Dados mock para demonstração (em produção viriam da API)
  const certificacoes: Certificacao[] = useMemo(() => [
    {
      id: '1',
      equipamento_id: equipamentos[0]?.id || '',
      tipo: 'ISO_17025',
      numero: 'L-1234',
      organismo: 'IPQ - Instituto Português da Qualidade',
      data_emissao: '2023-01-15',
      data_validade: '2025-01-15',
      status: 'ATIVA',
      escopo: 'Calibração de equipamentos de medição',
      observacoes: 'Certificação válida para todos os equipamentos de calibração'
    },
    {
      id: '2',
      equipamento_id: equipamentos[1]?.id || '',
      tipo: 'ISO_9001',
      numero: 'Q-5678',
      organismo: 'SGS Portugal',
      data_emissao: '2022-06-20',
      data_validade: '2024-06-20',
      status: 'ATIVA',
      escopo: 'Sistema de gestão da qualidade',
      observacoes: 'Cobertura total do sistema de qualidade'
    }
  ], [equipamentos]);

  const auditorias: Auditoria[] = useMemo(() => [
    {
      id: '1',
      tipo: 'EXTERNA',
      data_auditoria: '2024-01-15',
      auditor: 'Dr. João Silva',
      organismo: 'IPQ',
      resultado: 'APROVADA',
      conformidade: 95,
      nao_conformidades: ['Documentação de calibração incompleta em 2 equipamentos'],
      acoes_corretivas: ['Completar documentação até 30/01/2024'],
      proxima_auditoria: '2024-07-15',
      relatorio_url: '/relatorios/auditoria-2024-01.pdf'
    },
    {
      id: '2',
      tipo: 'INTERNA',
      data_auditoria: '2024-02-01',
      auditor: 'Eng. Maria Santos',
      resultado: 'APROVADA',
      conformidade: 98,
      nao_conformidades: [],
      acoes_corretivas: [],
      proxima_auditoria: '2024-05-01'
    }
  ], []);

  // Calcular métricas de compliance
  const complianceMetrics = useMemo(() => {
    const totalEquipamentos = equipamentos.length;
    const equipamentosCalibrados = equipamentos.filter(e => 
      calibracoes.some(c => 
        c.equipamento_id === e.id && 
        new Date(c.data_proxima_calibracao) > new Date()
      )
    ).length;

    const certificacoesAtivas = certificacoes.filter(c => c.status === 'ATIVA').length;
    const certificacoesVencidas = certificacoes.filter(c => 
      new Date(c.data_validade) < new Date()
    ).length;

    const auditoriasAprovadas = auditorias.filter(a => a.resultado === 'APROVADA').length;
    const conformidadeMedia = auditorias.length > 0 ? 
      auditorias.reduce((acc, a) => acc + a.conformidade, 0) / auditorias.length : 0;

    // Calcular risco geral
    const riscos = [];
    if (certificacoesVencidas > 0) riscos.push('Certificações vencidas');
    if (equipamentosCalibrados < totalEquipamentos * 0.9) riscos.push('Baixa conformidade de calibrações');
    if (conformidadeMedia < 90) riscos.push('Conformidade abaixo do padrão');

    return {
      totalEquipamentos,
      equipamentosCalibrados,
      taxaConformidade: totalEquipamentos > 0 ? (equipamentosCalibrados / totalEquipamentos) * 100 : 0,
      certificacoesAtivas,
      certificacoesVencidas,
      auditoriasAprovadas,
      conformidadeMedia,
      riscos,
      nivelRisco: riscos.length === 0 ? 'BAIXO' : riscos.length === 1 ? 'MÉDIO' : 'ALTO'
    };
  }, [equipamentos, calibracoes, certificacoes, auditorias]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVA':
      case 'APROVADA':
        return 'text-green-600 bg-green-100';
      case 'VENCIDA':
      case 'REPROVADA':
        return 'text-red-600 bg-red-100';
      case 'PENDENTE':
        return 'text-yellow-600 bg-yellow-100';
      case 'SUSPENSA':
      case 'CONDICIONAL':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ATIVA':
      case 'APROVADA':
        return <CheckCircle className="w-4 h-4" />;
      case 'VENCIDA':
      case 'REPROVADA':
        return <XCircle className="w-4 h-4" />;
      case 'PENDENTE':
        return <Clock className="w-4 h-4" />;
      case 'SUSPENSA':
      case 'CONDICIONAL':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header com Métricas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Compliance e Certificações</h2>
            <p className="text-gray-600">Gestão de certificações, auditorias e conformidade com normas</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onRefresh}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setShowNovaCertificacao(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Certificação</span>
            </button>
          </div>
        </div>

        {/* KPIs de Compliance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Taxa de Conformidade</p>
                <p className="text-3xl font-bold">{complianceMetrics.taxaConformidade.toFixed(1)}%</p>
                <p className="text-green-100 text-sm mt-1">
                  {complianceMetrics.equipamentosCalibrados} de {complianceMetrics.totalEquipamentos}
                </p>
              </div>
              <Shield className="h-12 w-12 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Certificações Ativas</p>
                <p className="text-3xl font-bold">{complianceMetrics.certificacoesAtivas}</p>
                <p className="text-blue-100 text-sm mt-1">
                  {complianceMetrics.certificacoesVencidas} vencidas
                </p>
              </div>
              <FileCheck className="h-12 w-12 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Conformidade Média</p>
                <p className="text-3xl font-bold">{complianceMetrics.conformidadeMedia.toFixed(1)}%</p>
                <p className="text-purple-100 text-sm mt-1">
                  {complianceMetrics.auditoriasAprovadas} auditorias aprovadas
                </p>
              </div>
              <CheckSquare className="h-12 w-12 text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`rounded-xl p-6 text-white ${
              complianceMetrics.nivelRisco === 'BAIXO' ? 'bg-gradient-to-r from-green-500 to-green-600' :
              complianceMetrics.nivelRisco === 'MÉDIO' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
              'bg-gradient-to-r from-red-500 to-red-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm">Nível de Risco</p>
                <p className="text-3xl font-bold">{complianceMetrics.nivelRisco}</p>
                <p className="text-white text-sm mt-1">
                  {complianceMetrics.riscos.length} riscos identificados
                </p>
              </div>
              <AlertTriangle className="h-12 w-12 text-white opacity-80" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs de Navegação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2"
      >
        <div className="flex space-x-2">
          {[
            { id: 'certificacoes', label: 'Certificações', icon: FileCheck },
            { id: 'auditorias', label: 'Auditorias', icon: Clipboard },
            { id: 'normas', label: 'Normas', icon: FileText },
            { id: 'riscos', label: 'Gestão de Riscos', icon: AlertTriangle }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                selectedView === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Conteúdo das Tabs */}
      <motion.div
        key={selectedView}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-6"
      >
        {selectedView === 'certificacoes' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Certificações Ativas</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Pesquisar certificações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Todos os Status</option>
                  <option value="ATIVA">Ativa</option>
                  <option value="VENCIDA">Vencida</option>
                  <option value="PENDENTE">Pendente</option>
                  <option value="SUSPENSA">Suspensa</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {certificacoes
                .filter(c => 
                  (filterStatus === 'all' || c.status === filterStatus) &&
                  (searchTerm === '' || 
                   c.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   c.organismo.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                                                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                           <FileCheck className="h-6 w-6 text-blue-600" />
                         </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{cert.numero}</h4>
                          <p className="text-sm text-gray-600">{cert.organismo}</p>
                          <p className="text-sm text-gray-500">{cert.escopo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cert.status)}`}>
                          {getStatusIcon(cert.status)}
                          <span className="ml-1">{cert.status}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Válida até: {new Date(cert.data_validade).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                    </div>
                    {cert.observacoes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{cert.observacoes}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {selectedView === 'auditorias' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Histórico de Auditorias</h3>
              <button 
                onClick={() => setShowNovaAuditoria(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Auditoria</span>
              </button>
            </div>

            <div className="space-y-4">
              {auditorias.map((auditoria, index) => (
                <motion.div
                  key={auditoria.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Clipboard className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Auditoria {auditoria.tipo} - {new Date(auditoria.data_auditoria).toLocaleDateString('pt-PT')}
                        </h4>
                        <p className="text-sm text-gray-600">Auditor: {auditoria.auditor}</p>
                        {auditoria.organismo && (
                          <p className="text-sm text-gray-500">Organismo: {auditoria.organismo}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(auditoria.resultado)}`}>
                        {getStatusIcon(auditoria.resultado)}
                        <span className="ml-1">{auditoria.resultado}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Conformidade: {auditoria.conformidade}%
                      </p>
                    </div>
                  </div>

                  {auditoria.nao_conformidades.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-red-700 mb-2">Não Conformidades:</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {auditoria.nao_conformidades.map((nc, i) => (
                          <li key={i} className="text-sm text-red-600">{nc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {auditoria.acoes_corretivas.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-green-700 mb-2">Ações Corretivas:</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {auditoria.acoes_corretivas.map((ac, i) => (
                          <li key={i} className="text-sm text-green-600">{ac}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      {auditoria.relatorio_url && (
                        <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                          <Download className="h-4 w-4" />
                          <span className="text-sm">Download Relatório</span>
                        </button>
                      )}
                      {auditoria.proxima_auditoria && (
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">
                            Próxima: {new Date(auditoria.proxima_auditoria).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'normas' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Normas Aplicáveis</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Conformidade Geral:</span>
                <span className="text-lg font-bold text-green-600">98%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(NORMAS_APLICAVEIS).map(([codigo, norma], index) => (
                <motion.div
                  key={codigo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{codigo}</h4>
                        <p className="text-sm text-gray-600">Versão {norma.versao}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-600">Conforme</span>
                    </div>
                  </div>
                  
                  <h5 className="font-medium text-gray-900 mb-2">{norma.nome}</h5>
                  <p className="text-sm text-gray-600 mb-3">{norma.descricao}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    <strong>Aplicabilidade:</strong> {norma.aplicabilidade}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm">
                      <ExternalLink className="h-4 w-4" />
                      <span>Ver Detalhes</span>
                    </button>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'riscos' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Gestão de Riscos</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                complianceMetrics.nivelRisco === 'BAIXO' ? 'bg-green-100 text-green-800' :
                complianceMetrics.nivelRisco === 'MÉDIO' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                Risco: {complianceMetrics.nivelRisco}
              </div>
            </div>

            <div className="space-y-6">
              {/* Riscos Identificados */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Riscos Identificados</h4>
                <div className="space-y-3">
                  {complianceMetrics.riscos.length > 0 ? (
                    complianceMetrics.riscos.map((risco, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="text-red-800">{risco}</span>
                        <button className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors">
                          Resolver
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800">Nenhum risco crítico identificado</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Matriz de Riscos */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Matriz de Riscos</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">Baixo</div>
                    <div className="text-sm text-green-700">Risco Aceitável</div>
                  </div>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">Médio</div>
                    <div className="text-sm text-orange-700">Monitorizar</div>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">Alto</div>
                    <div className="text-sm text-red-700">Ação Imediata</div>
                  </div>
                </div>
              </div>

              {/* Plano de Ação */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Plano de Ação</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div>
                      <h5 className="font-medium text-blue-900">Revisão de Certificações</h5>
                      <p className="text-sm text-blue-700">Verificar validade de todas as certificações</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Executar
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <h5 className="font-medium text-green-900">Auditoria Interna</h5>
                      <p className="text-sm text-green-700">Programar auditoria interna mensal</p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                      Agendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal Nova Certificação */}
      {showNovaCertificacao && (
        <Modal
          isOpen={showNovaCertificacao}
          onClose={() => setShowNovaCertificacao(false)}
          title="Nova Certificação"
          size="xl"
        >
          <NovaCertificacaoModal
            isOpen={showNovaCertificacao}
            onClose={() => setShowNovaCertificacao(false)}
            equipamentos={equipamentos}
            onSuccess={() => {
              onRefresh();
              setShowNovaCertificacao(false);
            }}
          />
        </Modal>
      )}

      {/* Modal Nova Auditoria */}
      {showNovaAuditoria && (
        <Modal
          isOpen={showNovaAuditoria}
          onClose={() => setShowNovaAuditoria(false)}
          title="Nova Auditoria"
          size="lg"
        >
          <NovaAuditoriaModal
            isOpen={showNovaAuditoria}
            onClose={() => setShowNovaAuditoria(false)}
            onSuccess={() => {
              onRefresh();
              setShowNovaAuditoria(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
