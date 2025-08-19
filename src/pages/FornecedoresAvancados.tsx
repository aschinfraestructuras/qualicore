import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Star, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  TrendingUp,
  Calendar,
  FileText,
  Shield,
  DollarSign,
  Target
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { FornecedorAvancado } from '../types/fornecedores';
import { fornecedoresAvancadosAPI } from '../lib/supabase-api/fornecedoresAvancadosAPI';
import { FornecedoresAvancadosFilters } from '../components/FornecedoresAvancadosFilters';
import { FornecedoresAvancadosForms } from '../components/FornecedoresAvancadosForms';
import { FornecedoresAvancadosDetails } from '../components/FornecedoresAvancadosDetails';
import RelatorioFornecedoresAvancadosPremium from '../components/RelatorioFornecedoresAvancadosPremium';

export default function FornecedoresAvancados() {
  const [fornecedores, setFornecedores] = useState<FornecedorAvancado[]>([]);
  const [filteredFornecedores, setFilteredFornecedores] = useState<FornecedorAvancado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState<FornecedorAvancado | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status_qualificacao: '',
    classificacao_minima: 0,
    categoria: '',
    certificacao: false
  });
  const [stats, setStats] = useState({
    total: 0,
    qualificados: 0,
    pendentes: 0,
    suspensos: 0,
    mediaClassificacao: 0
  });

  useEffect(() => {
    loadFornecedores();
    loadStats();
  }, []);

  useEffect(() => {
    filterFornecedores();
  }, [fornecedores, searchTerm, filters]);

  const loadFornecedores = async () => {
    try {
      setLoading(true);
      const data = await fornecedoresAvancadosAPI.getFornecedoresAvancados();
      
      // Garantir que todos os arrays estejam inicializados
      const processedData = data.map(fornecedor => ({
        ...fornecedor,
        certificacoes: fornecedor.certificacoes || [],
        categorias: fornecedor.categorias || [],
        produtos_principais: fornecedor.produtos_principais || [],
        historico_avaliacoes: fornecedor.historico_avaliacoes || [],
        historico_pagamentos: fornecedor.historico_pagamentos || [],
        criterios_qualificacao: fornecedor.criterios_qualificacao || [],
        documentos_qualificacao: fornecedor.documentos_qualificacao || [],
        tags: fornecedor.tags || []
      }));
      
      setFornecedores(processedData);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
      toast.error('Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await fornecedoresAvancadosAPI.getEstatisticasFornecedores();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const filterFornecedores = () => {
    let filtered = fornecedores;

    // Filtro por termo de pesquisa
    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status de qualificação
    if (filters.status_qualificacao) {
      filtered = filtered.filter(f => f.status_qualificacao === filters.status_qualificacao);
    }

    // Filtro por classificação mínima
    if (filters.classificacao_minima > 0) {
      filtered = filtered.filter(f => f.classificacao_geral >= filters.classificacao_minima);
    }

    // Filtro por categoria
    if (filters.categoria) {
      filtered = filtered.filter(f => f.categorias?.includes(filters.categoria));
    }

    // Filtro por certificação
    if (filters.certificacao) {
      filtered = filtered.filter(f => f.certificacoes?.length > 0);
    }

    setFilteredFornecedores(filtered);
  };

  const handleCreateFornecedor = async (fornecedor: Partial<FornecedorAvancado>) => {
    try {
      await fornecedoresAvancadosAPI.createFornecedorAvancado(fornecedor);
      toast.success('Fornecedor criado com sucesso!');
      setShowForm(false);
      loadFornecedores();
      loadStats();
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      toast.error('Erro ao criar fornecedor');
    }
  };

  const handleUpdateFornecedor = async (id: string, updates: Partial<FornecedorAvancado>) => {
    try {
      await fornecedoresAvancadosAPI.updateFornecedorAvancado(id, updates);
      toast.success('Fornecedor atualizado com sucesso!');
      setShowForm(false);
      setSelectedFornecedor(null);
      loadFornecedores();
      loadStats();
    } catch (error) {
      console.error('Erro ao atualizar fornecedor:', error);
      toast.error('Erro ao atualizar fornecedor');
    }
  };

  const handleDeleteFornecedor = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await fornecedoresAvancadosAPI.deleteFornecedorAvancado(id);
        toast.success('Fornecedor excluído com sucesso!');
        loadFornecedores();
        loadStats();
      } catch (error) {
        console.error('Erro ao excluir fornecedor:', error);
        toast.error('Erro ao excluir fornecedor');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualificado': return 'text-green-600 bg-green-100';
      case 'pendente': return 'text-yellow-600 bg-yellow-100';
      case 'suspenso': return 'text-red-600 bg-red-100';
      case 'desqualificado': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getClassificacaoColor = (classificacao: number) => {
    const value = classificacao || 0;
    if (value >= 4.5) return 'text-green-600';
    if (value >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
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
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 animate-fade-in">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white shadow-sm border-b border-gray-200 mb-8"
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Building2 className="h-8 w-8 mr-3 text-blue-600" />
                    Gestão Avançada de Fornecedores
                  </h1>
                  <p className="text-xl text-gray-600 flex items-center mt-2">
                    <Shield className="h-5 w-5 mr-2 text-purple-500" />
                    Sistema de Qualificação e Avaliação de Fornecedores
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowReport(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
                  >
                    <FileText className="h-5 w-5" />
                    <span>Relatório</span>
                  </button>
                  
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Novo Fornecedor</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Estatísticas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Qualificados</p>
                  <p className="text-2xl font-bold text-green-600">{stats.qualificados}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Suspensos</p>
                  <p className="text-2xl font-bold text-red-600">{stats.suspensos}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Classificação Média</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.mediaClassificacao.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </motion.div>

          {/* Filtros */}
          <FornecedoresAvancadosFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
          />

          {/* Lista de Fornecedores */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fornecedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Classificação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Certificações
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Próxima Avaliação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFornecedores.map((fornecedor) => (
                    <motion.tr
                      key={fornecedor.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{fornecedor.nome}</div>
                            <div className="text-sm text-gray-500">{fornecedor.codigo}</div>
                            <div className="text-sm text-gray-500">{fornecedor.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fornecedor.status_qualificacao)}`}>
                          {fornecedor.status_qualificacao}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Star className={`h-4 w-4 ${getClassificacaoColor(fornecedor.classificacao_geral || 0)}`} />
                          <span className={`ml-1 text-sm font-medium ${getClassificacaoColor(fornecedor.classificacao_geral || 0)}`}>
                            {(fornecedor.classificacao_geral || 0).toFixed(1)}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-yellow-600" />
                          <span className="ml-1 text-sm text-gray-900">
                            {fornecedor.certificacoes?.length || 0} certificação{(fornecedor.certificacoes?.length || 0) !== 1 ? 'ões' : ''}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {fornecedor.data_reavaliacao ? new Date(fornecedor.data_reavaliacao).toLocaleDateString('pt-BR') : 'Não definida'}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedFornecedor(fornecedor);
                              setShowDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => {
                              setSelectedFornecedor(fornecedor);
                              setShowForm(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteFornecedor(fornecedor.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredFornecedores.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum fornecedor encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || Object.values(filters).some(f => f !== '' && f !== 0 && f !== false)
                    ? 'Tente ajustar os filtros de pesquisa.'
                    : 'Comece adicionando um novo fornecedor.'}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <FornecedoresAvancadosForms
          fornecedor={selectedFornecedor}
          onClose={() => {
            setShowForm(false);
            setSelectedFornecedor(null);
          }}
          onSave={selectedFornecedor ? handleUpdateFornecedor : handleCreateFornecedor}
        />
      )}

      {/* Detalhes */}
      {showDetails && selectedFornecedor && (
        <FornecedoresAvancadosDetails
          fornecedor={selectedFornecedor}
          onClose={() => {
            setShowDetails(false);
            setSelectedFornecedor(null);
          }}
          onEdit={() => {
            setShowDetails(false);
            setShowForm(true);
          }}
        />
      )}

      {/* Relatório */}
      {showReport && (
        <RelatorioFornecedoresAvancadosPremium
          fornecedores={fornecedores}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
