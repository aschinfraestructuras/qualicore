import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export interface ExportOptions {
  filename?: string;
  sheetName?: string;
  includeHeaders?: boolean;
}

export interface ExportData {
  headers: string[];
  data: any[][];
  title?: string;
}

// Função para exportar dados para Excel
export function exportToExcel(
  data: ExportData,
  options: ExportOptions = {}
): void {
  const {
    filename = 'export',
    sheetName = 'Dados',
    includeHeaders = true
  } = options;

  // Criar workbook
  const workbook = XLSX.utils.book_new();
  
  // Preparar dados para exportação
  let exportData: any[][] = [];
  
  if (includeHeaders) {
    exportData.push(data.headers);
  }
  
  exportData.push(...data.data);
  
  // Criar worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(exportData);
  
  // Adicionar título se fornecido
  if (data.title) {
    XLSX.utils.sheet_add_aoa(worksheet, [[data.title]], { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(worksheet, [['']], { origin: 'A2' }); // Linha em branco
    XLSX.utils.sheet_add_aoa(worksheet, data.headers, { origin: 'A3' });
    XLSX.utils.sheet_add_aoa(worksheet, data.data, { origin: 'A4' });
  }
  
  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Gerar arquivo
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Download
  saveAs(blob, `${filename}.xlsx`);
}

// Função para exportar dados para CSV
export function exportToCSV(
  data: ExportData,
  options: ExportOptions = {}
): void {
  const {
    filename = 'export',
    includeHeaders = true
  } = options;

  let csvContent = '';
  
  // Adicionar título se fornecido
  if (data.title) {
    csvContent += `"${data.title}"\n\n`;
  }
  
  // Adicionar headers se solicitado
  if (includeHeaders) {
    csvContent += data.headers.map(header => `"${header}"`).join(',') + '\n';
  }
  
  // Adicionar dados
  data.data.forEach(row => {
    csvContent += row.map(cell => `"${cell || ''}"`).join(',') + '\n';
  });
  
  // Criar blob e download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
}

// Função para exportar dados para PDF (usando jsPDF)
export async function exportToPDF(
  data: ExportData,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = 'export',
    includeHeaders = true
  } = options;

  // Importar jsPDF dinamicamente
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  
  const doc = new jsPDF();
  
  // Adicionar título se fornecido
  if (data.title) {
    doc.setFontSize(16);
    doc.text(data.title, 14, 20);
    doc.setFontSize(12);
  }
  
  // Preparar dados para tabela
  const tableData = includeHeaders ? [data.headers, ...data.data] : data.data;
  
  // Gerar tabela
  autoTable(doc, {
    head: includeHeaders ? [data.headers] : [],
    body: includeHeaders ? data.data : tableData,
    startY: data.title ? 30 : 20,
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });
  
  // Salvar arquivo
  doc.save(`${filename}.pdf`);
}

// Função para formatar dados de trilhos para exportação
export function formatTrilhosForExport(trilhos: any[]): ExportData {
  const headers = [
    'Código',
    'Tipo',
    'Material',
    'Comprimento (m)',
    'Peso (kg/m)',
    'Fabricante',
    'Data Fabricação',
    'Data Instalação',
    'KM Inicial',
    'KM Final',
    'Estado',
    'Tensão (MPa)',
    'Alinhamento (mm)',
    'Nível (mm)',
    'Bitola (mm)',
    'Última Inspeção',
    'Próxima Inspeção'
  ];

  const data = trilhos.map(trilho => [
    trilho.codigo,
    trilho.tipo,
    trilho.material,
    trilho.comprimento,
    trilho.peso,
    trilho.fabricante,
    trilho.data_fabricacao,
    trilho.data_instalacao,
    trilho.km_inicial,
    trilho.km_final,
    trilho.estado,
    trilho.tensao,
    trilho.geometria?.alinhamento || '',
    trilho.geometria?.nivel || '',
    trilho.geometria?.bitola || '',
    trilho.ultima_inspecao,
    trilho.proxima_inspecao
  ]);

  return {
    headers,
    data,
    title: 'Relatório de Trilhos - Via Férrea'
  };
}

// Função para formatar dados de travessas para exportação
export function formatTravessasForExport(travessas: any[]): ExportData {
  const headers = [
    'Código',
    'Tipo',
    'Material',
    'Comprimento (m)',
    'Largura (m)',
    'Altura (m)',
    'Peso (kg)',
    'Fabricante',
    'Data Fabricação',
    'Data Instalação',
    'KM Inicial',
    'KM Final',
    'Estado',
    'Última Inspeção',
    'Próxima Inspeção'
  ];

  const data = travessas.map(travessa => [
    travessa.codigo,
    travessa.tipo,
    travessa.material,
    travessa.comprimento,
    travessa.largura,
    travessa.altura,
    travessa.peso,
    travessa.fabricante,
    travessa.data_fabricacao,
    travessa.data_instalacao,
    travessa.km_inicial,
    travessa.km_final,
    travessa.estado,
    travessa.ultima_inspecao,
    travessa.proxima_inspecao
  ]);

  return {
    headers,
    data,
    title: 'Relatório de Travessas - Via Férrea'
  };
}

// Função para formatar dados de inspeções para exportação
export function formatInspecoesForExport(inspecoes: any[]): ExportData {
  const headers = [
    'Data Inspeção',
    'Tipo',
    'Inspector',
    'Resultado',
    'Elemento Inspecionado',
    'Observações',
    'Ações Corretivas',
    'Próxima Inspeção',
    'Parâmetros Medidos'
  ];

  const data = inspecoes.map(inspecao => [
    inspecao.data_inspecao,
    inspecao.tipo,
    inspecao.inspector,
    inspecao.resultado,
    inspecao.trilho_id ? `Trilho ${inspecao.trilho_id}` : `Travessa ${inspecao.travessa_id}`,
    inspecao.observacoes,
    inspecao.acoes_corretivas,
    inspecao.proxima_inspecao,
    JSON.stringify(inspecao.parametros_medidos || {})
  ]);

  return {
    headers,
    data,
    title: 'Relatório de Inspeções - Via Férrea'
  };
}

// Função para gerar nome de arquivo com timestamp
export function generateFilename(prefix: string, type: string): string {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
  return `${prefix}_${timestamp}`;
}
