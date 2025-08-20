import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Shield, Award, Calendar, Plus, Edit, Trash2, Download, Eye,
  CheckCircle, AlertTriangle, Clock, User, Building, FileCheck, FileX,
  Upload, FolderOpen, Search, Filter, SortAsc, SortDesc
} from 'lucide-react';
import { DocumentacaoObra, LicencaAutorizacao, CertificacaoObrigatoria } from '@/types';
import toast from 'react-hot-toast';

interface DocumentacaoObraProps {
  documentacao: DocumentacaoObra;
  licencas: LicencaAutorizacao[];
  certificacoes: CertificacaoObrigatoria[];
  onDocumentacaoChange: (documentacao: DocumentacaoObra) => void;
  onLicencasChange: (licencas: LicencaAutorizacao[]) => void;
  onCertificacoesChange: (certificacoes: CertificacaoObrigatoria[]) => void;
}

export default function DocumentacaoObraComponent({ 
  documentacao, 
  licencas, 
  certificacoes, 
  onDocumentacaoChange, 
  onLicencasChange, 
  onCertificacoesChange 
}: DocumentacaoObraProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'licencas' | 'certificacoes' | 'documentos'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('data_vencimento');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativa': return 'text-green-600 bg-green-100';
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'expirada': return 'text-red-600 bg-red-100';
      case 'renovacao': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativa': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pendente': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'expirada': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'renovacao': return <FileCheck className="h-4 w-4 text-blue-600" />;
      default: return <FileX className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredLicencas = licencas.filter(licenca => {
    const matchesSearch = licenca.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         licenca.entidade.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || licenca.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredCertificacoes = certificacoes.filter(cert => {
    const matchesSearch = cert.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.organismo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedLicencas = [...filteredLicencas].sort((a, b) => {
    if (sortBy === 'data_vencimento') {
      return new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime();
    }
    return a.tipo.localeCompare(b.tipo);
  });

  const sortedCertificacoes = [...filteredCertificacoes].sort((a, b) => {
    if (sortBy === 'data_vencimento') {
      return new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime();
    }
    return a.tipo.localeCompare(b.tipo);
  });

  const stats = {
    totalLicencas: licencas.length,
    licencasAtivas: licencas.filter(l => l.status === 'ativa').length,
    licencasExpiradas: licencas.filter(l => l.status === 'expirada').length,
    licencasPendentes: licencas.filter(l => l.status === 'pendente').length,
    totalCertificacoes: certificacoes.length,
    certificacoesAtivas: certificacoes.filter(c => c.status === 'ativa').length,
    certificacoesExpiradas: certificacoes.filter(c => c.status === 'expirada').length,
    certificacoesPendentes: certificacoes.filter(c => c.status === 'pendente').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-teal-600" />
            Documentação de Obra
          </h2>
          <p className="text-gray-600 mt-1">Gestão de licenças, autorizações e certificações</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('licencas')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'licencas' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Licenças
          </button>
          <button
            onClick={() => setActiveTab('certificacoes')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'certificacoes' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Certificações
          </button>
          <button
            onClick={() => setActiveTab('documentos')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'documentos' 
                ? 'bg-teal-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Documentos
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Licenças</h3>
                  <p className="text-sm text-gray-600">Total: {stats.totalLicencas}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Ativas:</span>
                  <span className="font-semibold text-green-600">{stats.licencasAtivas}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pendentes:</span>
                  <span className="font-semibold text-yellow-600">{stats.licencasPendentes}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Expiradas:</span>
                  <span className="font-semibold text-red-600">{stats.licencasExpiradas}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Certificações</h3>
                  <p className="text-sm text-gray-600">Total: {stats.totalCertificacoes}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Ativas:</span>
                  <span className="font-semibold text-green-600">{stats.certificacoesAtivas}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pendentes:</span>
                  <span className="font-semibold text-yellow-600">{stats.certificacoesPendentes}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Expiradas:</span>
                  <span className="font-semibold text-red-600">{stats.certificacoesExpiradas}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                  <FileCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Documentos</h3>
                  <p className="text-sm text-gray-600">Gestão centralizada</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Categorias:</span>
                  <span className="font-semibold text-purple-600">8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Templates:</span>
                  <span className="font-semibold text-purple-600">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Aprovados:</span>
                  <span className="font-semibold text-green-600">85%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Alertas</h3>
                  <p className="text-sm text-gray-600">Ações necessárias</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Vencimento 30d:</span>
                  <span className="font-semibold text-orange-600">{stats.licencasExpiradas + stats.certificacoesExpiradas}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pendentes:</span>
                  <span className="font-semibold text-yellow-600">{stats.licencasPendentes + stats.certificacoesPendentes}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Críticos:</span>
                  <span className="font-semibold text-red-600">2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Próximos Vencimentos */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Próximos Vencimentos</h3>
            <div className="space-y-4">
              {[...licencas, ...certificacoes]
                .filter(item => {
                  const vencimento = new Date(item.data_vencimento);
                  const hoje = new Date();
                  const diffTime = vencimento.getTime() - hoje.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 30 && diffDays > 0;
                })
                .sort((a, b) => new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime())
                .slice(0, 5)
                .map((item, index) => {
                  const vencimento = new Date(item.data_vencimento);
                  const hoje = new Date();
                  const diffTime = vencimento.getTime() - hoje.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        {item.hasOwnProperty('tipo') ? (
                          <Shield className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Award className="h-5 w-5 text-green-600" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.hasOwnProperty('tipo') ? (item as LicencaAutorizacao).tipo : (item as CertificacaoObrigatoria).tipo}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.hasOwnProperty('entidade') ? (item as LicencaAutorizacao).entidade : (item as CertificacaoObrigatoria).organismo}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {vencimento.toLocaleDateString('pt-PT')}
                        </p>
                        <p className={`text-xs font-medium ${
                          diffDays <= 7 ? 'text-red-600' : 
                          diffDays <= 15 ? 'text-orange-600' : 'text-yellow-600'
                        }`}>
                          {diffDays} dias restantes
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Licenças Tab */}
      {activeTab === 'licencas' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Filters and Search */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar licenças..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="ativa">Ativa</option>
                <option value="pendente">Pendente</option>
                <option value="expirada">Expirada</option>
                <option value="renovacao">Renovação</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="data_vencimento">Data de Vencimento</option>
                <option value="tipo">Tipo</option>
              </select>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Nova Licença
            </button>
          </div>

          {/* Licenças List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedLicencas.map((licenca) => (
              <div key={licenca.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">{licenca.tipo}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Entidade</p>
                    <p className="font-medium text-gray-900">{licenca.entidade}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Número</p>
                    <p className="font-medium text-gray-900">{licenca.numero}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Vencimento</p>
                      <p className="font-medium text-gray-900">
                        {new Date(licenca.data_vencimento).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(licenca.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(licenca.status)}`}>
                        {licenca.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <button className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </button>
                  <button className="inline-flex items-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Certificações Tab */}
      {activeTab === 'certificacoes' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Filters and Search */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar certificações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="ativa">Ativa</option>
                <option value="pendente">Pendente</option>
                <option value="expirada">Expirada</option>
                <option value="renovacao">Renovação</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="data_vencimento">Data de Vencimento</option>
                <option value="tipo">Tipo</option>
              </select>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Nova Certificação
            </button>
          </div>

          {/* Certificações List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCertificacoes.map((certificacao) => (
              <div key={certificacao.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-gray-900">{certificacao.tipo}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Organismo</p>
                    <p className="font-medium text-gray-900">{certificacao.organismo}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Número</p>
                    <p className="font-medium text-gray-900">{certificacao.numero}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Vencimento</p>
                      <p className="font-medium text-gray-900">
                        {new Date(certificacao.data_vencimento).toLocaleDateString('pt-PT')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(certificacao.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(certificacao.status)}`}>
                        {certificacao.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <button className="inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </button>
                  <button className="inline-flex items-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Documentos Tab */}
      {activeTab === 'documentos' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Gestão de Documentos</h3>
              <button className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                <Upload className="h-4 w-4 mr-2" />
                Upload Documento
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <FolderOpen className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Projetos</h4>
                <p className="text-sm text-gray-600">Documentos técnicos</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">24</p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <FileCheck className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Contratos</h4>
                <p className="text-sm text-gray-600">Acordos e termos</p>
                <p className="text-2xl font-bold text-green-600 mt-2">12</p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Segurança</h4>
                <p className="text-sm text-gray-600">Planos e procedimentos</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">8</p>
              </div>
              
              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <Award className="h-12 w-12 text-orange-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Qualidade</h4>
                <p className="text-sm text-gray-600">Certificações e normas</p>
                <p className="text-2xl font-bold text-orange-600 mt-2">16</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
