import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Download, 
  Building2, 
  Star, 
  Award, 
  Shield, 
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  FileText,
  BarChart3
} from 'lucide-react';
import { FornecedorAvancado } from '../types/fornecedores';

interface RelatorioFornecedoresAvancadosPremiumProps {
  fornecedores: FornecedorAvancado[];
  onClose: () => void;
}

export default function RelatorioFornecedoresAvancadosPremium({
  fornecedores,
  onClose
}: RelatorioFornecedoresAvancadosPremiumProps) {
  const stats = {
    total: fornecedores.length,
    qualificados: fornecedores.filter(f => f.status_qualificacao === 'qualificado').length,
    pendentes: fornecedores.filter(f => f.status_qualificacao === 'pendente').length,
    suspensos: fornecedores.filter(f => f.status_qualificacao === 'suspenso').length,
    desqualificados: fornecedores.filter(f => f.status_qualificacao === 'desqualificado').length,
    mediaClassificacao: fornecedores.reduce((acc, f) => acc + f.classificacao_geral, 0) / fornecedores.length || 0,
    comCertificacao: fornecedores.filter(f => f.certificacoes.length > 0).length
  };

  const categorias = fornecedores.reduce((acc, f) => {
    f.categorias.forEach(cat => {
      acc[cat] = (acc[cat] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topFornecedores = [...fornecedores]
    .sort((a, b) => b.classificacao_geral - a.classificacao_geral)
    .slice(0, 5);

  const handleDownload = () => {
    // Implementar download do relatório
    console.log('Download do relatório');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-6 w-6 mr-2 text-purple-600" />
              Relatório de Fornecedores Avançados
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Building2 className="h-8 w-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Qualificados</p>
                  <p className="text-2xl font-bold">{stats.qualificados}</p>
                </div>
                <CheckCircle className="h-8 w-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Pendentes</p>
                  <p className="text-2xl font-bold">{stats.pendentes}</p>
                </div>
                <Clock className="h-8 w-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Suspensos</p>
                  <p className="text-2xl font-bold">{stats.suspensos}</p>
                </div>
                <AlertTriangle className="h-8 w-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Desqualificados</p>
                  <p className="text-2xl font-bold">{stats.desqualificados}</p>
                </div>
                <Shield className="h-8 w-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Classificação Média</p>
                  <p className="text-2xl font-bold">{stats.mediaClassificacao.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Com Certificação</p>
                  <p className="text-2xl font-bold">{stats.comCertificacao}</p>
                </div>
                <Award className="h-8 w-8 opacity-80" />
              </div>
            </div>
          </div>

          {/* Distribuição por Categorias */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-orange-600" />
              Distribuição por Categorias
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(categorias).map(([categoria, count]) => (
                <div key={categoria} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 capitalize">{categoria}</span>
                    <span className="text-lg font-bold text-blue-600">{count}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Fornecedores */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Top 5 Fornecedores por Classificação
            </h3>
            
            <div className="space-y-3">
              {topFornecedores.map((fornecedor, index) => (
                <div key={fornecedor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{fornecedor.nome}</p>
                      <p className="text-sm text-gray-600">{fornecedor.codigo}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      fornecedor.status_qualificacao === 'qualificado' ? 'text-green-600 bg-green-100' :
                      fornecedor.status_qualificacao === 'pendente' ? 'text-yellow-600 bg-yellow-100' :
                      fornecedor.status_qualificacao === 'suspenso' ? 'text-red-600 bg-red-100' :
                      'text-gray-600 bg-gray-100'
                    }`}>
                      {fornecedor.status_qualificacao}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="ml-1 font-medium text-gray-900">{fornecedor.classificacao_geral.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo Executivo */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Resumo Executivo
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Pontos Fortes</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• {stats.qualificados} fornecedores qualificados ({((stats.qualificados / stats.total) * 100).toFixed(1)}%)</li>
                  <li>• Classificação média de {stats.mediaClassificacao.toFixed(1)}/5.0</li>
                  <li>• {stats.comCertificacao} fornecedores com certificações</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Áreas de Melhoria</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• {stats.pendentes} fornecedores pendentes de qualificação</li>
                  <li>• {stats.suspensos} fornecedores suspensos</li>
                  <li>• {stats.desqualificados} fornecedores desqualificados</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
