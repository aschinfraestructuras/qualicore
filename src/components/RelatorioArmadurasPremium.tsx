import { useState } from "react";
import { Armadura } from "@/types/armaduras";
import { Download, Printer, FileText, Filter, Calendar, Package, CheckCircle, AlertTriangle, XCircle, Clock, Hash, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { PDFService } from "@/services/pdfService";

interface RelatorioArmadurasPremiumProps {
  armaduras: Armadura[];
  filtros?: {
    tipo?: string;
    estado?: string;
    zona?: string;
    fabricante?: string;
    numero_colada?: string;
    numero_guia_remessa?: string;
    local_aplicacao?: string;
    dataInicio?: string;
    dataFim?: string;
    diametroMin?: number;
    diametroMax?: number;
  };
  tipoRelatorio: "executivo" | "individual" | "filtrado" | "comparativo";
  armaduraEspecifica?: Armadura;
  colunas?: Record<string, boolean>;
  mostrarCusto?: boolean;
  onSelecaoChange?: (armadurasSelecionadas: Armadura[]) => void;
}

export default function RelatorioArmadurasPremium({
  armaduras,
  filtros = {},
  tipoRelatorio,
  armaduraEspecifica,
  colunas = {
    codigo: true,
    tipo: true,
    diametro: true,
    quantidade: true,
    peso_total: true,
    fabricante: true,
    numero_colada: true,
    estado: true,
    local_aplicacao: true,
    responsavel: true,
    data_rececao: true,
  },
  mostrarCusto = false,
  onSelecaoChange,
}: RelatorioArmadurasPremiumProps) {
  const [loading, setLoading] = useState(false);
  const [armadurasSelecionadas, setArmadurasSelecionadas] = useState<Set<string>>(new Set());
  const [selecaoAtiva, setSelecaoAtiva] = useState(false);

  // Configuração institucional
  const empresaConfig = {
    nome: "ASCH Infraestructuras y Servicios SA",
    logotipo: "/logo-qualicore.png",
    morada: "Praça das Industrias - Edificio Aip - Sala 7, Nº Aip, 3, Lisboa 1300-307 Lisboa. Lisboa. Lisboa.",
    email: "info@aschinfraestructuras.com",
  };

  // Estatísticas calculadas
  const stats = {
    total: armaduras.length,
    aprovadas: armaduras.filter(a => a.estado === "aprovado").length,
    pendentes: armaduras.filter(a => a.estado === "pendente").length,
    emAnalise: armaduras.filter(a => a.estado === "em_analise").length,
    reprovadas: armaduras.filter(a => a.estado === "reprovado").length,
    instaladas: armaduras.filter(a => a.estado === "instalado").length,
    concluidas: armaduras.filter(a => a.estado === "concluido").length,
    pesoTotal: armaduras.reduce((sum, a) => sum + a.peso_total, 0),
    valorEstimado: armaduras.reduce((sum, a) => sum + (a.peso_total * 1200), 0),
    taxaAprovacao: armaduras.length > 0 ? 
      ((armaduras.filter(a => a.estado === "aprovado").length / armaduras.length) * 100).toFixed(1) : "0",
    fabricantesUnicos: new Set(armaduras.map(a => a.fabricante)).size,
    lotesUnicos: new Set(armaduras.map(a => a.lote_aplicacao)).size,
  };

  // Análise por tipo
  const analisePorTipo = armaduras.reduce((acc, armadura) => {
    acc[armadura.tipo] = (acc[armadura.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Análise por fabricante
  const analisePorFabricante = armaduras.reduce((acc, armadura) => {
    acc[armadura.fabricante] = (acc[armadura.fabricante] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Análise por diâmetro
  const analisePorDiametro = armaduras.reduce((acc, armadura) => {
    acc[armadura.diametro] = (acc[armadura.diametro] || 0) + armadura.peso_total;
    return acc;
  }, {} as Record<number, number>);

  // Funções de seleção
  const toggleSelecao = (codigo: string) => {
    const novasSelecoes = new Set(armadurasSelecionadas);
    if (novasSelecoes.has(codigo)) {
      novasSelecoes.delete(codigo);
    } else {
      novasSelecoes.add(codigo);
    }
    setArmadurasSelecionadas(novasSelecoes);
    
    // Notificar componente pai
    if (onSelecaoChange) {
      const armadurasSelecionadasArray = armaduras.filter(a => novasSelecoes.has(a.codigo));
      onSelecaoChange(armadurasSelecionadasArray);
    }
  };

  const selecionarTodos = () => {
    const todosCodigos = new Set(armaduras.map(a => a.codigo));
    setArmadurasSelecionadas(todosCodigos);
    if (onSelecaoChange) {
      onSelecaoChange(armaduras);
    }
  };

  const limparSelecao = () => {
    setArmadurasSelecionadas(new Set());
    if (onSelecaoChange) {
      onSelecaoChange([]);
    }
  };

  const toggleModoSelecao = () => {
    setSelecaoAtiva(!selecaoAtiva);
    if (!selecaoAtiva) {
      limparSelecao();
    }
  };

  // Obter armaduras para relatório (selecionadas ou todas)
  const getArmadurasParaRelatorio = () => {
    if (selecaoAtiva && armadurasSelecionadas.size > 0) {
      return armaduras.filter(a => armadurasSelecionadas.has(a.codigo));
    }
    return armaduras;
  };

  const getTituloRelatorio = () => {
    const armadurasRelatorio = getArmadurasParaRelatorio();
    const totalSelecionadas = armadurasSelecionadas.size;
    
    switch (tipoRelatorio) {
      case "executivo":
        return `Relatório Executivo de Armaduras${totalSelecionadas > 0 ? ` (${totalSelecionadas} selecionadas)` : ''}`;
      case "individual":
        return `Relatório Individual - ${armaduraEspecifica?.codigo}`;
      case "filtrado":
        return `Relatório Filtrado de Armaduras${totalSelecionadas > 0 ? ` (${totalSelecionadas} selecionadas)` : ''}`;
      case "comparativo":
        return `Relatório Comparativo de Armaduras${totalSelecionadas > 0 ? ` (${totalSelecionadas} selecionadas)` : ''}`;
      default:
        return "Relatório de Armaduras";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      const pdfService = new PDFService();
      const armadurasParaRelatorio = getArmadurasParaRelatorio();
      
      const options = {
        titulo: getTituloRelatorio(),
        subtitulo: `Gerado em ${new Date().toLocaleDateString('pt-PT')}`,
        armaduras: armadurasParaRelatorio,
        tipo: tipoRelatorio,
        filtros: filtros,
        armaduraEspecifica: armaduraEspecifica,
        mostrarCusto: mostrarCusto,
        colunas: colunas,
      };
      
      // Verificar se o método existe
      if (typeof pdfService.gerarRelatorioArmaduras === 'function') {
        pdfService.gerarRelatorioArmaduras(options);
        toast.success(`Relatório PDF gerado com ${armadurasParaRelatorio.length} armaduras!`);
      } else {
        console.error("Método gerarRelatorioArmaduras não encontrado no PDFService");
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
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
        }
      `}</style>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            {getTituloRelatorio()}
          </h2>
          <p className="text-gray-600">Geração de relatórios profissionais para direção</p>
        </div>
        <div className="flex items-center gap-3 no-print">
          {/* Controles de Seleção */}
          <div className="flex items-center gap-2 border-r pr-3">
            <button
              onClick={toggleModoSelecao}
              className={`btn btn-sm ${selecaoAtiva ? 'btn-primary' : 'btn-outline'}`}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {selecaoAtiva ? 'Seleção Ativa' : 'Selecionar'}
            </button>
            
            {selecaoAtiva && (
              <>
                <button
                  onClick={selecionarTodos}
                  className="btn btn-sm btn-outline"
                >
                  <Hash className="h-4 w-4 mr-1" />
                  Todos
                </button>
                <button
                  onClick={limparSelecao}
                  className="btn btn-sm btn-outline"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Limpar
                </button>
                <span className="text-sm text-gray-600">
                  {armadurasSelecionadas.size} selecionadas
                </span>
              </>
            )}
          </div>
          
          <button
            onClick={handlePrint}
            disabled={loading}
            className="btn btn-outline btn-md"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </button>
          <button
            onClick={generatePDF}
            disabled={loading}
            className="btn btn-primary btn-md"
          >
            <Download className="h-4 w-4 mr-2" />
            {loading ? "Gerando..." : "Gerar PDF Premium"}
          </button>
        </div>
      </div>

      {/* Cabeçalho Institucional */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border-l-4 border-blue-500">
        <div className="text-center flex flex-col items-center justify-center gap-2">
          <img src="/logo-qualicore.png" alt="Logotipo" className="h-16 mb-2" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          <h3 className="text-lg font-bold text-blue-900 mb-1">Qualicore - Gestão de Qualidade</h3>
          <div className="text-blue-800 font-semibold">{empresaConfig.nome}</div>
          <p className="text-sm text-blue-700">{empresaConfig.morada}</p>
          <p className="text-sm text-blue-700">Email: {empresaConfig.email}</p>
          <p className="text-xs text-blue-600 mt-1">
            Relatório gerado em: {new Date().toLocaleDateString("pt-PT")} às {new Date().toLocaleTimeString("pt-PT")}
          </p>
        </div>
      </div>

      {/* Resumo dos filtros aplicados */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 text-sm text-gray-700 flex flex-wrap gap-4 justify-center">
        <span><b>Tipo:</b> {filtros.tipo || 'Todos'}</span>
        <span><b>Estado:</b> {filtros.estado || 'Todos'}</span>
        <span><b>Fabricante:</b> {filtros.fabricante || 'Todos'}</span>
        <span><b>Zona:</b> {filtros.zona || 'Todas'}</span>
        {filtros.dataInicio && <span><b>Data Início:</b> {filtros.dataInicio}</span>}
        {filtros.dataFim && <span><b>Data Fim:</b> {filtros.dataFim}</span>}
        {filtros.diametroMin && <span><b>Diâmetro Min:</b> {filtros.diametroMin}mm</span>}
        {filtros.diametroMax && <span><b>Diâmetro Max:</b> {filtros.diametroMax}mm</span>}
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-800">Total Armaduras</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.pesoTotal.toFixed(1)} kg</div>
          <div className="text-sm text-green-800">Peso Total</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.taxaAprovacao}%</div>
          <div className="text-sm text-purple-800">Taxa Aprovação</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.fabricantesUnicos}</div>
          <div className="text-sm text-orange-800">Fabricantes</div>
        </div>
      </div>

      {/* Distribuição por Estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Distribuição por Estado
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Aprovadas</span>
              <span className="font-semibold text-green-600">{stats.aprovadas}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pendentes</span>
              <span className="font-semibold text-yellow-600">{stats.pendentes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Em Análise</span>
              <span className="font-semibold text-blue-600">{stats.emAnalise}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Reprovadas</span>
              <span className="font-semibold text-red-600">{stats.reprovadas}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Instaladas</span>
              <span className="font-semibold text-purple-600">{stats.instaladas}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Concluídas</span>
              <span className="font-semibold text-indigo-600">{stats.concluidas}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Análise por Tipo
          </h3>
          <div className="space-y-2">
            {Object.entries(analisePorTipo).map(([tipo, quantidade]) => (
              <div key={tipo} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{tipo.replace('_', ' ')}</span>
                <span className="font-semibold text-blue-600">{quantidade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Detalhes das Armaduras</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {selecaoAtiva && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider no-print">
                    <input
                      type="checkbox"
                      checked={armadurasSelecionadas.size === armaduras.length && armaduras.length > 0}
                      onChange={armadurasSelecionadas.size === armaduras.length ? limparSelecao : selecionarTodos}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}
                {colunas.codigo && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>}
                {colunas.tipo && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>}
                {colunas.diametro && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diâmetro</th>}
                {colunas.quantidade && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>}
                {colunas.peso_total && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso Total</th>}
                {colunas.fabricante && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fabricante</th>}
                {colunas.numero_colada && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Colada</th>}
                {colunas.estado && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>}
                {colunas.local_aplicacao && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local Aplicação</th>}
                {colunas.responsavel && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>}
                {colunas.data_rececao && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Receção</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {armaduras.map((armadura) => (
                <tr key={armadura.id} className={`hover:bg-gray-50 ${armadurasSelecionadas.has(armadura.codigo) ? 'bg-blue-50' : ''}`}>
                  {selecaoAtiva && (
                    <td className="px-4 py-4 whitespace-nowrap no-print">
                      <input
                        type="checkbox"
                        checked={armadurasSelecionadas.has(armadura.codigo)}
                        onChange={() => toggleSelecao(armadura.codigo)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  {colunas.codigo && <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{armadura.codigo}</td>}
                  {colunas.tipo && <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{armadura.tipo.replace('_', ' ')}</td>}
                  {colunas.diametro && <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{armadura.diametro} mm</td>}
                  {colunas.quantidade && <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{armadura.quantidade}</td>}
                  {colunas.peso_total && <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{armadura.peso_total} kg</td>}
                  {colunas.fabricante && <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{armadura.fabricante}</td>}
                  {colunas.numero_colada && <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{armadura.numero_colada}</td>}
                  {colunas.estado && (
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        armadura.estado === 'aprovado' ? 'bg-green-100 text-green-800' :
                        armadura.estado === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                        armadura.estado === 'em_analise' ? 'bg-blue-100 text-blue-800' :
                        armadura.estado === 'reprovado' ? 'bg-red-100 text-red-800' :
                        armadura.estado === 'instalado' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {armadura.estado.replace('_', ' ')}
                      </span>
                    </td>
                  )}
                  {colunas.local_aplicacao && <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{armadura.local_aplicacao}</td>}
                  {colunas.responsavel && <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{armadura.responsavel}</td>}
                  {colunas.data_rececao && <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(armadura.data_rececao).toLocaleDateString("pt-PT")}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>Relatório gerado automaticamente pelo sistema Qualicore</p>
        <p>© 2024 {empresaConfig.nome} - Todos os direitos reservados</p>
      </div>
    </div>
  );
}
