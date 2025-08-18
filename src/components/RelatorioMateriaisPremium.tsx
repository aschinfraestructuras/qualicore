import { useState } from "react";
import { Material } from "@/types";
import { Download, Printer, FileText, Filter, Calendar, Package, CheckCircle, AlertTriangle, XCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import PDFService from "@/services/pdfService";

interface RelatorioMateriaisPremiumProps {
  materiais: Material[];
  filtros?: {
    tipo?: string;
    estado?: string;
    zona?: string;
    fornecedor?: string;
    dataInicio?: string;
    dataFim?: string;
  };
  tipoRelatorio: "executivo" | "individual" | "filtrado" | "comparativo";
  materialEspecifico?: Material;
  colunas?: Record<string, boolean>;
  mostrarCusto?: boolean;
}

export default function RelatorioMateriaisPremium({
  materiais,
  filtros = {},
  tipoRelatorio,
  materialEspecifico,
  colunas = {
    codigo: true,
    nome: true,
    tipo: true,
    estado: true,
    zona: true,
    data_rececao: true,
    quantidade: true,
    unidade: true,
    lote: false,
    responsavel: false,
    fornecedor_id: false,
  },
  mostrarCusto = false,
}: RelatorioMateriaisPremiumProps) {
  const [loading, setLoading] = useState(false);

  // Configuração institucional
  const empresaConfig = {
    nome: "ASCH Infraestructuras y Servicios SA",
    logotipo: "/logo-qualicore.png",
    morada: "Praça das Industrias - Edificio Aip - Sala 7, Nº Aip, 3, Lisboa 1300-307 Lisboa. Lisboa. Lisboa.",
    email: "info@aschinfraestructuras.com",
  };

  // Estatísticas calculadas
  const stats = {
    total: materiais.length,
    aprovados: materiais.filter(m => m.estado === "aprovado").length,
    pendentes: materiais.filter(m => m.estado === "pendente").length,
    emAnalise: materiais.filter(m => m.estado === "em_analise").length,
    reprovados: materiais.filter(m => m.estado === "reprovado").length,
    concluidos: materiais.filter(m => m.estado === "concluido").length,
    totalQuantidade: materiais.reduce((sum, m) => sum + m.quantidade, 0),
    valorEstimado: materiais.reduce((sum, m) => sum + (m.quantidade * 150), 0),
    taxaAprovacao: materiais.length > 0 ? 
      ((materiais.filter(m => m.estado === "aprovado").length / materiais.length) * 100).toFixed(1) : "0"
  };

  // Análise por tipo
  const analisePorTipo = materiais.reduce((acc, material) => {
    acc[material.tipo] = (acc[material.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Análise por fornecedor
  const analisePorFornecedor = materiais.reduce((acc, material) => {
    acc[material.fornecedor_id] = (acc[material.fornecedor_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const generatePDF = async () => {
    setLoading(true);
    try {
      const pdfService = new PDFService();
      
      const options = {
        titulo: getTituloRelatorio(),
        subtitulo: `Gerado em ${new Date().toLocaleDateString('pt-PT')}`,
        materiais: materiais,
        tipo: tipoRelatorio,
        filtros: filtros,
        materialEspecifico: materialEspecifico,
        mostrarCusto: mostrarCusto,
        colunas: colunas,
      };
      
      pdfService.gerarRelatorioMateriais(options);
      toast.success("Relatório PDF gerado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar relatório PDF");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${getTituloRelatorio()}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #2563eb;
              padding-bottom: 20px;
            }
            .company-info {
              background: linear-gradient(to right, #eff6ff, #dbeafe);
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 4px solid #2563eb;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin-bottom: 30px;
            }
            .stat-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
              background: white;
            }
            .stat-number {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .stat-label {
              font-size: 14px;
              color: #6b7280;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px; 
              font-size: 12px;
            }
            th, td { 
              border: 1px solid #d1d5db; 
              padding: 8px; 
              text-align: left; 
            }
            th { 
              background-color: #f3f4f6; 
              font-weight: bold;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
            .signature-area {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              border-bottom: 2px solid #374151;
              width: 200px;
              height: 40px;
              margin-top: 10px;
            }
            .stamp-box {
              border: 2px solid #374151;
              width: 80px;
              height: 60px;
              margin: 10px auto 0;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="color: #1e40af; margin-bottom: 10px;">${empresaConfig.nome}</h1>
            <p style="margin: 5px 0; color: #374151;">${empresaConfig.morada} | Tel: ${empresaConfig.email}</p>
            <h2 style="color: #1f2937; margin-top: 20px;">${getTituloRelatorio()}</h2>
            <p style="color: #6b7280;">Gerado em: ${new Date().toLocaleDateString("pt-PT")} às ${new Date().toLocaleTimeString("pt-PT")}</p>
          </div>
          
          <div class="company-info">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">Resumo Executivo</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number" style="color: #1e40af;">${stats.total}</div>
                <div class="stat-label">Total de Materiais</div>
              </div>
              <div class="stat-card">
                <div class="stat-number" style="color: #059669;">${stats.taxaAprovacao}%</div>
                <div class="stat-label">Taxa de Aprovação</div>
              </div>
              <div class="stat-card">
                <div class="stat-number" style="color: #1e40af;">€${stats.valorEstimado.toLocaleString("pt-PT")}</div>
                <div class="stat-label">Valor Estimado</div>
              </div>
              <div class="stat-card">
                <div class="stat-number" style="color: #059669;">${stats.aprovados}</div>
                <div class="stat-label">Aprovados</div>
              </div>
              <div class="stat-card">
                <div class="stat-number" style="color: #d97706;">${stats.pendentes}</div>
                <div class="stat-label">Pendentes</div>
              </div>
              <div class="stat-card">
                <div class="stat-number" style="color: #1e40af;">${stats.emAnalise}</div>
                <div class="stat-label">Em Análise</div>
              </div>
            </div>
          </div>
          
          ${materiais.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Zona</th>
                <th>Data Receção</th>
                <th>Quantidade</th>
              </tr>
            </thead>
            <tbody>
              ${materiais.slice(0, 20).map(material => `
                <tr>
                  <td>${material.codigo}</td>
                  <td>${material.nome}</td>
                  <td>${material.tipo}</td>
                  <td>${material.estado}</td>
                  <td>${material.zona}</td>
                  <td>${new Date(material.data_rececao).toLocaleDateString("pt-PT")}</td>
                  <td>${material.quantidade} ${material.unidade}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          ` : '<p style="text-align: center; color: #6b7280; font-style: italic;">Nenhum material encontrado</p>'}
          
          <div class="footer">
            <p>${empresaConfig.nome} | ${empresaConfig.morada} | Tel: ${empresaConfig.email}</p>
            <p>Relatório gerado automaticamente pelo sistema Qualicore</p>
            
            <div class="signature-area">
              <div>
                <p style="margin: 0; font-weight: bold;">Assinatura:</p>
                <div class="signature-box"></div>
              </div>
              <div>
                <p style="margin: 0; font-weight: bold;">Carimbo:</p>
                <div class="stamp-box"></div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getTituloRelatorio = () => {
    const titulos = {
      executivo: "Relatório Executivo de Materiais",
      individual: "Ficha Técnica de Material",
      filtrado: "Relatório de Materiais Filtrados",
      comparativo: "Análise Comparativa de Materiais"
    };
    return titulos[tipoRelatorio];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relatorio-print">
      <style>{`
        @media print {
          body, html {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .relatorio-print {
            background: white !important;
            color: #222 !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
            width: 100vw !important;
            min-width: 0 !important;
            max-width: 100vw !important;
          }
          .print\\:hidden, .btn, .btn-outline, .btn-accent, .btn-primary, .btn-link, .modal, .modal-overlay, .modal-content, .modal-header, .modal-body {
            display: none !important;
          }
          .no-print {
            display: none !important;
          }
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
        <div className="flex items-center gap-3">
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
        <span><b>Zona:</b> {filtros.zona || 'Todas'}</span>
        <span><b>Fornecedor:</b> {filtros.fornecedor || 'Todos'}</span>
        <span><b>Data Início:</b> {filtros.dataInicio || '—'}</span>
        <span><b>Data Fim:</b> {filtros.dataFim || '—'}</span>
      </div>

      {/* Resumo Executivo */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Resumo Executivo
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Materiais</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-green-600">{stats.taxaAprovacao}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          {mostrarCusto && (
            <div className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valor Estimado</p>
                  <p className="text-2xl font-bold text-blue-600">€{stats.valorEstimado.toLocaleString("pt-PT")}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estatísticas Detalhadas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Aprovados</p>
          <p className="text-xl font-bold text-green-600">{stats.aprovados}</p>
        </div>
        
        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Pendentes</p>
          <p className="text-xl font-bold text-yellow-600">{stats.pendentes}</p>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Em Análise</p>
          <p className="text-xl font-bold text-blue-600">{stats.emAnalise}</p>
        </div>
        
        <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
          <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Reprovados</p>
          <p className="text-xl font-bold text-red-600">{stats.reprovados}</p>
        </div>
      </div>

      {/* Análise por Tipo */}
      {Object.keys(analisePorTipo).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Análise por Tipo de Material</h3>
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentual
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(analisePorTipo).map(([tipo, quantidade]) => (
                  <tr key={tipo}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                      {tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quantidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {((quantidade / stats.total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lista de Materiais */}
      {materiais.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {tipoRelatorio === "individual" ? "Dados do Material" : `Lista de Materiais (${materiais.length})`}
          </h3>
          <div className="bg-white border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {colunas.codigo && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>}
                  {colunas.nome && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>}
                  {colunas.tipo && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>}
                  {colunas.estado && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>}
                  {colunas.zona && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zona</th>}
                  {colunas.data_rececao && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Receção</th>}
                  {colunas.quantidade && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>}
                  {colunas.unidade && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>}
                  {colunas.lote && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lote</th>}
                  {colunas.responsavel && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>}
                  {colunas.fornecedor_id && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fornecedor</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {materiais.slice(0, 50).map((material) => (
                  <tr key={material.id}>
                    {colunas.codigo && <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{material.codigo}</td>}
                    {colunas.nome && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.nome}</td>}
                    {colunas.tipo && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{material.tipo}</td>}
                    {colunas.estado && <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${material.estado === "aprovado" ? "bg-green-100 text-green-800" : material.estado === "pendente" ? "bg-yellow-100 text-yellow-800" : material.estado === "em_analise" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}>{material.estado}</span></td>}
                    {colunas.zona && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.zona}</td>}
                    {colunas.data_rececao && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(material.data_rececao).toLocaleDateString("pt-PT")}</td>}
                    {colunas.quantidade && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.quantidade}</td>}
                    {colunas.unidade && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.unidade}</td>}
                    {colunas.lote && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.lote}</td>}
                    {colunas.responsavel && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.responsavel}</td>}
                    {colunas.fornecedor_id && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{material.fornecedor_id}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Informações Adicionais */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Informações do Relatório</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Quantidade Total:</strong> {stats.totalQuantidade} unidades</p>
            {mostrarCusto && <p><strong>Valor Estimado:</strong> €{stats.valorEstimado.toLocaleString("pt-PT")}</p>}
          </div>
          <div>
            <p><strong>Data de Geração:</strong> {new Date().toLocaleDateString("pt-PT")}</p>
            <p><strong>Hora de Geração:</strong> {new Date().toLocaleTimeString("pt-PT")}</p>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center text-sm text-gray-500">
          <p>Qualicore | {empresaConfig.nome}</p>
          <p>{empresaConfig.morada}</p>
          <p className="mt-1">Software by: José Antunes® 2025. Todos os direitos atribuídos.</p>
        </div>
        {/* Espaço para assinatura */}
        <div className="mt-6 flex justify-between items-end">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700 mb-2">Assinatura:</p>
            <div className="border-b-2 border-gray-300 w-48 h-12"></div>
          </div>
          <div className="flex-1 text-right">
            <p className="text-sm font-medium text-gray-700 mb-2">Carimbo:</p>
            <div className="border-2 border-gray-300 w-24 h-16 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 