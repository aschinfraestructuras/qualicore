import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  Building2,
  User,
  Hash,
  CheckSquare,
  Square,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PDFService } from '@/services/pdfService';
import type { Certificado } from '@/types';

interface RelatorioCertificadosPremiumProps {
  certificados: Certificado[];
  onClose: () => void;
  onSelecaoChange?: (certificadosSelecionados: Certificado[]) => void;
}

export default function RelatorioCertificadosPremium({
  certificados,
  onClose,
  onSelecaoChange
}: RelatorioCertificadosPremiumProps) {
  const [tipoRelatorio, setTipoRelatorio] = useState<'executivo' | 'filtrado' | 'comparativo' | 'individual'>('filtrado');
  const [certificadoSelecionado, setCertificadoSelecionado] = useState<Certificado | null>(null);
  const [loading, setLoading] = useState(false);
  const [certificadosSelecionados, setCertificadosSelecionados] = useState<Set<string>>(new Set());
  const [selecaoAtiva, setSelecaoAtiva] = useState(false);

  // Filtros
  const [filtros, setFiltros] = useState({
    search: '',
    tipo: '',
    fornecedor: '',
    status: '',
    dataInicio: '',
    dataFim: '',
    validade: ''
  });

  const toggleSelecao = (id: string) => {
    const novaSelecao = new Set(certificadosSelecionados);
    if (novaSelecao.has(id)) {
      novaSelecao.delete(id);
    } else {
      novaSelecao.add(id);
    }
    setCertificadosSelecionados(novaSelecao);
    
    const certificadosSelecionadosArray = certificados.filter(c => novaSelecao.has(c.id));
    onSelecaoChange?.(certificadosSelecionadosArray);
  };

  const selecionarTodos = () => {
    const todosIds = new Set(certificados.map(c => c.id));
    setCertificadosSelecionados(todosIds);
    onSelecaoChange?.(certificados);
  };

  const limparSelecao = () => {
    setCertificadosSelecionados(new Set());
    onSelecaoChange?.([]);
  };

  const toggleModoSelecao = () => {
    if (selecaoAtiva) {
      limparSelecao();
    }
    setSelecaoAtiva(!selecaoAtiva);
  };

  const getCertificadosParaRelatorio = () => {
    if (selecaoAtiva && certificadosSelecionados.size > 0) {
      return certificados.filter(c => certificadosSelecionados.has(c.id));
    }
    return certificados;
  };

  const handleGerarRelatorio = async () => {
    try {
      setLoading(true);
      const certificadosParaRelatorio = getCertificadosParaRelatorio();

      if (certificadosParaRelatorio.length === 0) {
        toast.error('Nenhum certificado encontrado com os filtros aplicados');
        return;
      }

      const pdfService = new PDFService();
      
      if (typeof pdfService.gerarRelatorioCertificados === 'function') {
        await pdfService.gerarRelatorioCertificados({
          tipo: tipoRelatorio,
          certificados: certificadosParaRelatorio,
          filtros: filtros,
          certificadoIndividual: certificadoSelecionado
        });
        
        toast.success(`Relatório PDF gerado com ${certificadosParaRelatorio.length} certificados!`);
      } else {
        console.error("Método gerarRelatorioCertificados não encontrado no PDFService");
        toast.error("Erro: Método de geração de PDF não disponível");
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const total = certificados.length;
    const validos = certificados.filter(c => c.status === 'valido').length;
    const expirados = certificados.filter(c => c.status === 'expirado').length;
    const pendentes = certificados.filter(c => c.status === 'pendente').length;
    const percentualValidos = total > 0 ? Math.round((validos / total) * 100) : 0;

    return { total, validos, expirados, pendentes, percentualValidos };
  };

  const stats = getStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">Relatórios de Certificados</h2>
                <p className="text-blue-100">Geração de relatórios PDF profissionais</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 p-6 overflow-y-auto border-r">
            {/* Controles de Seleção */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg no-print">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                <CheckSquare className="h-4 w-4 mr-2" />
                Controles de Seleção
              </h3>
              <div className="space-y-2">
                <button
                  onClick={toggleModoSelecao}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selecaoAtiva 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {selecaoAtiva ? 'Seleção Ativa' : 'Selecionar'}
                </button>
                {selecaoAtiva && (
                  <>
                    <button
                      onClick={selecionarTodos}
                      className="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Todos
                    </button>
                    <button
                      onClick={limparSelecao}
                      className="w-full px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Limpar
                    </button>
                    <div className="text-center text-sm text-gray-600">
                      {certificadosSelecionados.size} selecionados
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tipo de Relatório */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Tipo de Relatório</h3>
              <div className="space-y-2">
                {[
                  { value: 'executivo', label: 'Executivo', icon: BarChart3 },
                  { value: 'filtrado', label: 'Filtrado', icon: Filter },
                  { value: 'comparativo', label: 'Comparativo', icon: BarChart3 },
                  { value: 'individual', label: 'Individual', icon: FileText }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setTipoRelatorio(value as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      tipoRelatorio === value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtros */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Filtros</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  value={filtros.search}
                  onChange={(e) => setFiltros(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <select
                  value={filtros.tipo}
                  onChange={(e) => setFiltros(prev => ({ ...prev, tipo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Todos os tipos</option>
                  <option value="material">Material</option>
                  <option value="equipamento">Equipamento</option>
                  <option value="servico">Serviço</option>
                  <option value="sistema">Sistema</option>
                </select>
                <select
                  value={filtros.status}
                  onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Todos os status</option>
                  <option value="valido">Válido</option>
                  <option value="expirado">Expirado</option>
                  <option value="pendente">Pendente</option>
                </select>
                <input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Estatísticas */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Estatísticas</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total:</span>
                  <span className="font-semibold">{stats.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Válidos:</span>
                  <span className="font-semibold text-green-600">{stats.validos}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Expirados:</span>
                  <span className="font-semibold text-red-600">{stats.expirados}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pendentes:</span>
                  <span className="font-semibold text-yellow-600">{stats.pendentes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>% Válidos:</span>
                  <span className="font-semibold">{stats.percentualValidos}%</span>
                </div>
              </div>
            </div>

            {/* Botão Gerar */}
            <button
              onClick={handleGerarRelatorio}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Gerando...' : 'Gerar PDF Premium'}
            </button>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">Válidos</p>
                      <p className="text-2xl font-bold text-green-600">{stats.validos}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">Expirados</p>
                      <p className="text-2xl font-bold text-red-600">{stats.expirados}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-600">Pendentes</p>
                      <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabela */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {selecaoAtiva && (
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider no-print">
                            <input
                              type="checkbox"
                              checked={certificadosSelecionados.size === certificados.length && certificados.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  selecionarTodos();
                                } else {
                                  limparSelecao();
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                        )}
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Código
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fornecedor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Validade
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Responsável
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {certificados.map((certificado) => (
                        <tr 
                          key={certificado.id}
                          className={`hover:bg-gray-50 transition-colors ${
                            certificadosSelecionados.has(certificado.id) ? 'bg-blue-50' : ''
                          }`}
                        >
                          {selecaoAtiva && (
                            <td className="px-4 py-3 no-print">
                              <input
                                type="checkbox"
                                checked={certificadosSelecionados.has(certificado.id)}
                                onChange={() => toggleSelecao(certificado.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                          )}
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {certificado.codigo}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {certificado.tipo}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {certificado.fornecedor}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              certificado.status === 'valido' 
                                ? 'bg-green-100 text-green-800'
                                : certificado.status === 'expirado'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {certificado.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(certificado.data_validade).toLocaleDateString('pt-PT')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {certificado.responsavel}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
