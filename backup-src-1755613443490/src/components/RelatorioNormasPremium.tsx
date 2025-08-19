import { useState } from "react";
import { Norma } from "@/types/normas";
import { Download, Printer, FileText, Filter, Calendar, BookOpen, CheckCircle, AlertTriangle, XCircle, Clock, Hash, Shield, Tag, Building } from "lucide-react";
import toast from "react-hot-toast";
import PDFService from "@/services/pdfService";

interface RelatorioNormasPremiumProps {
  normas: Norma[];
  filtros?: {
    categoria?: string;
    status?: string;
    organismo?: string;
    prioridade?: string;
    dataInicio?: string;
    dataFim?: string;
  };
  tipoRelatorio: "executivo" | "individual" | "filtrado" | "comparativo";
  normaEspecifica?: Norma;
  colunas?: Record<string, boolean>;
  onSelecaoChange?: (normasSelecionadas: Norma[]) => void;
}

export default function RelatorioNormasPremium({
  normas,
  filtros = {},
  tipoRelatorio,
  normaEspecifica,
  colunas = {
    codigo: true,
    titulo: true,
    categoria: true,
    organismo: true,
    versao: true,
    status: true,
    prioridade: true,
    data_publicacao: true,
    data_entrada_vigor: true,
    ultima_atualizacao: true,
  },
  onSelecaoChange,
}: RelatorioNormasPremiumProps) {
  const [loading, setLoading] = useState(false);
  const [normasSelecionadas, setNormasSelecionadas] = useState<Set<string>>(new Set());
  const [selecaoAtiva, setSelecaoAtiva] = useState(false);

  // Estatísticas
  const totalNormas = normas.length;
  const normasAtivas = normas.filter(n => n.status === 'ATIVA').length;
  const normasPendentes = normas.filter(n => n.status === 'REVISAO').length;
  const normasObsoletas = normas.filter(n => n.status === 'OBSOLETA').length;
  const normasCriticas = normas.filter(n => n.prioridade === 'CRITICA').length;
  const normasAltas = normas.filter(n => n.prioridade === 'ALTA').length;

  // Análise por categoria
  const analisePorCategoria = normas.reduce((acc, norma) => {
    acc[norma.categoria] = (acc[norma.categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Análise por organismo
  const analisePorOrganismo = normas.reduce((acc, norma) => {
    acc[norma.organismo] = (acc[norma.organismo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const toggleSelecao = (codigo: string) => {
    const novasSelecoes = new Set(normasSelecionadas);
    if (novasSelecoes.has(codigo)) {
      novasSelecoes.delete(codigo);
    } else {
      novasSelecoes.add(codigo);
    }
    setNormasSelecionadas(novasSelecoes);
    
    if (onSelecaoChange) {
      const normasSelecionadasArray = normas.filter(n => novasSelecoes.has(n.codigo));
      onSelecaoChange(normasSelecionadasArray);
    }
  };

  const selecionarTodos = () => {
    const todasNormas = new Set(normas.map(n => n.codigo));
    setNormasSelecionadas(todasNormas);
    
    if (onSelecaoChange) {
      onSelecaoChange(normas);
    }
  };

  const limparSelecao = () => {
    setNormasSelecionadas(new Set());
    
    if (onSelecaoChange) {
      onSelecaoChange([]);
    }
  };

  const toggleModoSelecao = () => {
    setSelecaoAtiva(!selecaoAtiva);
    if (selecaoAtiva) {
      limparSelecao();
    }
  };

  const getNormasParaRelatorio = () => {
    if (normaEspecifica) {
      return [normaEspecifica];
    }
    
    if (selecaoAtiva && normasSelecionadas.size > 0) {
      return normas.filter(n => normasSelecionadas.has(n.codigo));
    }
    
    return normas;
  };

  const getTituloRelatorio = () => {
    switch (tipoRelatorio) {
      case 'executivo':
        return 'Relatório Executivo de Normas';
      case 'individual':
        return `Norma: ${normaEspecifica?.codigo} - ${normaEspecifica?.titulo}`;
      case 'filtrado':
        return 'Relatório Filtrado de Normas';
      case 'comparativo':
        return 'Relatório Comparativo de Normas';
      default:
        return 'Relatório de Normas';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ATIVA': return 'text-green-600 bg-green-100';
      case 'PENDENTE': return 'text-yellow-600 bg-yellow-100';
      case 'OBSOLETA': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'CRITICA': return 'text-red-600 bg-red-100';
      case 'ALTA': return 'text-orange-600 bg-orange-100';
      case 'MEDIA': return 'text-yellow-600 bg-yellow-100';
      case 'BAIXA': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      const pdfService = new PDFService();
      const normasParaRelatorio = getNormasParaRelatorio();
      
      const options = {
        titulo: getTituloRelatorio(),
        subtitulo: `Gerado em ${new Date().toLocaleDateString('pt-PT')}`,
        normas: normasParaRelatorio,
        tipo: tipoRelatorio,
        filtros: filtros,
        normaEspecifica: normaEspecifica,
        colunas: colunas,
      };
      
      if (typeof pdfService.gerarRelatorioNormas === 'function') {
        pdfService.gerarRelatorioNormas(options);
        toast.success(`Relatório PDF gerado com ${normasParaRelatorio.length} normas!`);
      } else {
        console.error("Método gerarRelatorioNormas não encontrado no PDFService");
        toast.error("Erro: Método de geração de PDF não disponível");
      }
      
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar relatório PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 print:p-0">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6 print:mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 print:text-xl">
            {getTituloRelatorio()}
          </h1>
          <p className="text-gray-600 print:text-sm">
            Gerado em {new Date().toLocaleDateString('pt-PT')} às {new Date().toLocaleTimeString('pt-PT')}
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={toggleModoSelecao}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selecaoAtiva 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {selecaoAtiva ? 'Cancelar Seleção' : 'Modo Seleção'}
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Printer className="w-4 h-4 inline mr-2" />
            Imprimir
          </button>
          <button
            onClick={generatePDF}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4 inline mr-2" />
            {loading ? 'Gerando...' : 'PDF'}
          </button>
        </div>
      </div>

      {/* Controles de Seleção */}
      {selecaoAtiva && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-blue-800">
                Selecionadas: {normasSelecionadas.size} de {totalNormas}
              </span>
              <button
                onClick={selecionarTodos}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Todos
              </button>
              <button
                onClick={limparSelecao}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 print:grid-cols-3">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 mr-3" />
            <div>
              <p className="text-sm opacity-90">Total</p>
              <p className="text-2xl font-bold">{totalNormas}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 mr-3" />
            <div>
              <p className="text-sm opacity-90">Ativas</p>
              <p className="text-2xl font-bold">{normasAtivas}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <Clock className="w-8 h-8 mr-3" />
            <div>
              <p className="text-sm opacity-90">Pendentes</p>
              <p className="text-2xl font-bold">{normasPendentes}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 mr-3" />
            <div>
              <p className="text-sm opacity-90">Obsoletas</p>
              <p className="text-2xl font-bold">{normasObsoletas}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 mr-3" />
            <div>
              <p className="text-sm opacity-90">Críticas</p>
              <p className="text-2xl font-bold">{normasCriticas}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center">
            <Shield className="w-8 h-8 mr-3" />
            <div>
              <p className="text-sm opacity-90">Alta Prioridade</p>
              <p className="text-2xl font-bold">{normasAltas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Análise por Categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 print:break-inside-avoid">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Por Categoria
          </h3>
          <div className="space-y-2">
            {Object.entries(analisePorCategoria)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([categoria, count]) => (
                <div key={categoria} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{categoria}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              ))}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Por Organismo
          </h3>
          <div className="space-y-2">
            {Object.entries(analisePorOrganismo)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([organismo, count]) => (
                <div key={organismo} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{organismo}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Tabela de Normas */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {selecaoAtiva && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider print:hidden">
                    <input
                      type="checkbox"
                      checked={normasSelecionadas.size === normas.length}
                      onChange={() => {
                        if (normasSelecionadas.size === normas.length) {
                          limparSelecao();
                        } else {
                          selecionarTodos();
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
                {colunas.codigo && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                )}
                {colunas.titulo && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                )}
                {colunas.categoria && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                )}
                {colunas.organismo && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organismo
                  </th>
                )}
                {colunas.versao && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Versão
                  </th>
                )}
                {colunas.status && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                )}
                {colunas.prioridade && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                )}
                {colunas.data_publicacao && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Publicação
                  </th>
                )}
                {colunas.data_entrada_vigor && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrada em Vigor
                  </th>
                )}
                {colunas.ultima_atualizacao && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Atualização
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {normas.map((norma) => (
                <tr key={norma.id} className="hover:bg-gray-50">
                  {selecaoAtiva && (
                    <td className="px-4 py-3 print:hidden">
                      <input
                        type="checkbox"
                        checked={normasSelecionadas.has(norma.codigo)}
                        onChange={() => toggleSelecao(norma.codigo)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {colunas.codigo && (
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {norma.codigo}
                    </td>
                  )}
                  {colunas.titulo && (
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={norma.titulo}>
                        {norma.titulo}
                      </div>
                    </td>
                  )}
                  {colunas.categoria && (
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {norma.categoria}
                    </td>
                  )}
                  {colunas.organismo && (
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {norma.organismo}
                    </td>
                  )}
                  {colunas.versao && (
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {norma.versao}
                    </td>
                  )}
                  {colunas.status && (
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(norma.status)}`}>
                        {norma.status}
                      </span>
                    </td>
                  )}
                  {colunas.prioridade && (
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadeColor(norma.prioridade)}`}>
                        {norma.prioridade}
                      </span>
                    </td>
                  )}
                  {colunas.data_publicacao && (
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(norma.data_publicacao).toLocaleDateString('pt-PT')}
                    </td>
                  )}
                  {colunas.data_entrada_vigor && (
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(norma.data_entrada_vigor).toLocaleDateString('pt-PT')}
                    </td>
                  )}
                  {colunas.ultima_atualizacao && (
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(norma.ultima_atualizacao).toLocaleDateString('pt-PT')}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumo */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg print:mt-4">
        <p className="text-sm text-gray-600">
          <strong>Total de normas:</strong> {totalNormas} | 
          <strong> Ativas:</strong> {normasAtivas} | 
          <strong> Pendentes:</strong> {normasPendentes} | 
          <strong> Obsoletas:</strong> {normasObsoletas}
        </p>
        {selecaoAtiva && normasSelecionadas.size > 0 && (
          <p className="text-sm text-blue-600 mt-1">
            <strong>Normas selecionadas para relatório:</strong> {normasSelecionadas.size}
          </p>
        )}
      </div>
    </div>
  );
}
