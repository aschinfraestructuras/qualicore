import * as XLSX from 'xlsx';

export interface ExcelReportConfig {
  titulo: string;
  periodo: {
    inicio: string;
    fim: string;
  };
  filtros: {
    tipo?: string[];
    estado?: string[];
    zona?: string[];
    responsavel?: string[];
  };
  incluirGraficos: boolean;
  incluirTabelas: boolean;
  incluirEstatisticas: boolean;
}

export class ExcelService {
  private workbook: XLSX.WorkBook;

  constructor() {
    this.workbook = XLSX.utils.book_new();
  }

  // Gerar relatório executivo de documentos
  public async generateDocumentosExecutiveReport(documentos: any[], config: ExcelReportConfig): Promise<void> {
    try {
      // Planilha 1: Resumo Executivo
      const resumoData = [
        ['RELATÓRIO EXECUTIVO DE DOCUMENTOS'],
        [''],
        ['Período:', `${config.periodo.inicio} a ${config.periodo.fim}`],
        ['Data de Geração:', new Date().toLocaleDateString('pt-PT')],
        [''],
        ['ESTATÍSTICAS GERAIS'],
        ['Total de Documentos', documentos.length],
        ['Documentos Aprovados', documentos.filter(d => d.estado === 'aprovado').length],
        ['Documentos Em Análise', documentos.filter(d => d.estado === 'em_analise').length],
        ['Documentos Pendentes', documentos.filter(d => d.estado === 'pendente').length],
        ['Documentos Vencidos', documentos.filter(d => new Date(d.data_validade) < new Date()).length],
        [''],
        ['Taxa de Aprovação', `${Math.round((documentos.filter(d => d.estado === 'aprovado').length / documentos.length) * 100)}%`],
        ['Documentos Críticos', documentos.filter(d => {
          const dataValidade = new Date(d.data_validade);
          const hoje = new Date();
          const diffTime = dataValidade.getTime() - hoje.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7 && diffDays > 0;
        }).length]
      ];

      const resumoSheet = XLSX.utils.aoa_to_sheet(resumoData);
      XLSX.utils.book_append_sheet(this.workbook, resumoSheet, 'Resumo Executivo');

      // Planilha 2: Distribuição por Tipo
      const tipoStats = documentos.reduce((acc: Record<string, number>, documento) => {
        acc[documento.tipo] = (acc[documento.tipo] || 0) + 1;
        return acc;
      }, {});

      const tipoData = [
        ['DISTRIBUIÇÃO POR TIPO'],
        [''],
        ['Tipo', 'Quantidade', 'Percentual']
      ];

      Object.entries(tipoStats).forEach(([tipo, count]) => {
        const percentual = Math.round((count / documentos.length) * 100);
        tipoData.push([tipo, count, `${percentual}%`]);
      });

      const tipoSheet = XLSX.utils.aoa_to_sheet(tipoData);
      XLSX.utils.book_append_sheet(this.workbook, tipoSheet, 'Distribuição por Tipo');

      // Planilha 3: Documentos Principais
      const documentosData = [
        ['DOCUMENTOS PRINCIPAIS'],
        [''],
        ['Código', 'Tipo', 'Estado', 'Responsável', 'Zona', 'Data Validade', 'Observações']
      ];

      documentos.slice(0, 50).forEach(documento => {
        documentosData.push([
          documento.codigo || 'N/A',
          documento.tipo || 'N/A',
          documento.estado || 'N/A',
          documento.responsavel || 'N/A',
          documento.zona || 'N/A',
          new Date(documento.data_validade || new Date()).toLocaleDateString('pt-PT'),
          documento.observacoes || ''
        ]);
      });

      const documentosSheet = XLSX.utils.aoa_to_sheet(documentosData);
      XLSX.utils.book_append_sheet(this.workbook, documentosSheet, 'Documentos');

      // Planilha 4: Análise Temporal
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const hoje = new Date();
      const temporalData = [
        ['ANÁLISE TEMPORAL (ÚLTIMOS 6 MESES)'],
        [''],
        ['Mês', 'Total de Documentos', 'Documentos Aprovados', 'Taxa de Aprovação']
      ];

      for (let i = 5; i >= 0; i--) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const mes = meses[data.getMonth()];
        const documentosMes = documentos.filter(d => {
          const docDate = new Date(d.created);
          return docDate.getMonth() === data.getMonth() && docDate.getFullYear() === data.getFullYear();
        });
        const aprovadosMes = documentosMes.filter(d => d.estado === 'aprovado');
        const taxaAprovacao = documentosMes.length > 0 ? Math.round((aprovadosMes.length / documentosMes.length) * 100) : 0;

        temporalData.push([
          mes,
          documentosMes.length,
          aprovadosMes.length,
          `${taxaAprovacao}%`
        ]);
      }

      const temporalSheet = XLSX.utils.aoa_to_sheet(temporalData);
      XLSX.utils.book_append_sheet(this.workbook, temporalSheet, 'Análise Temporal');

      // Salvar arquivo
      const fileName = `Relatorio_Documentos_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(this.workbook, fileName);

    } catch (error) {
      console.error('Erro ao gerar relatório Excel:', error);
      throw error;
    }
  }

  // Gerar relatório detalhado de documentos
  public async generateDocumentosDetailedReport(documentos: any[], config: ExcelReportConfig): Promise<void> {
    try {
      // Planilha 1: Resumo Detalhado
      const resumoData = [
        ['RELATÓRIO DETALHADO DE DOCUMENTOS'],
        [''],
        ['Período:', `${config.periodo.inicio} a ${config.periodo.fim}`],
        ['Data de Geração:', new Date().toLocaleDateString('pt-PT')],
        [''],
        ['FILTROS APLICADOS'],
        ['Tipos:', config.filtros.tipo?.join(', ') || 'Todos'],
        ['Estados:', config.filtros.estado?.join(', ') || 'Todos'],
        ['Zonas:', config.filtros.zona?.join(', ') || 'Todas'],
        ['Responsáveis:', config.filtros.responsavel?.join(', ') || 'Todos'],
        [''],
        ['ESTATÍSTICAS DETALHADAS'],
        ['Total de Documentos', documentos.length],
        ['Documentos Aprovados', documentos.filter(d => d.estado === 'aprovado').length],
        ['Documentos Em Análise', documentos.filter(d => d.estado === 'em_analise').length],
        ['Documentos Pendentes', documentos.filter(d => d.estado === 'pendente').length],
        ['Documentos Reprovados', documentos.filter(d => d.estado === 'reprovado').length],
        ['Documentos Vencidos', documentos.filter(d => new Date(d.data_validade) < new Date()).length],
        ['Próximos Vencimentos (30 dias)', documentos.filter(d => {
          const dataValidade = new Date(d.data_validade);
          const hoje = new Date();
          const diffTime = dataValidade.getTime() - hoje.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 30 && diffDays > 0;
        }).length]
      ];

      const resumoSheet = XLSX.utils.aoa_to_sheet(resumoData);
      XLSX.utils.book_append_sheet(this.workbook, resumoSheet, 'Resumo Detalhado');

      // Planilha 2: Todos os Documentos
      const todosDocumentosData = [
        ['TODOS OS DOCUMENTOS'],
        [''],
        ['ID', 'Código', 'Tipo', 'Versão', 'Estado', 'Responsável', 'Zona', 'Data Criação', 'Data Validade', 'Observações']
      ];

      documentos.forEach(documento => {
        todosDocumentosData.push([
          documento.id || 'N/A',
          documento.codigo || 'N/A',
          documento.tipo || 'N/A',
          documento.versao || 'N/A',
          documento.estado || 'N/A',
          documento.responsavel || 'N/A',
          documento.zona || 'N/A',
          new Date(documento.created || documento.data_criacao || new Date()).toLocaleDateString('pt-PT'),
          new Date(documento.data_validade || new Date()).toLocaleDateString('pt-PT'),
          documento.observacoes || ''
        ]);
      });

      const todosDocumentosSheet = XLSX.utils.aoa_to_sheet(todosDocumentosData);
      XLSX.utils.book_append_sheet(this.workbook, todosDocumentosSheet, 'Todos Documentos');

      // Planilha 3: Análise por Responsável
      const responsavelStats = documentos.reduce((acc: Record<string, number>, documento) => {
        acc[documento.responsavel] = (acc[documento.responsavel] || 0) + 1;
        return acc;
      }, {});

      const responsavelData = [
        ['ANÁLISE POR RESPONSÁVEL'],
        [''],
        ['Responsável', 'Total de Documentos', 'Percentual']
      ];

      Object.entries(responsavelStats).forEach(([responsavel, count]) => {
        const percentual = Math.round((count / documentos.length) * 100);
        responsavelData.push([responsavel, count, `${percentual}%`]);
      });

      const responsavelSheet = XLSX.utils.aoa_to_sheet(responsavelData);
      XLSX.utils.book_append_sheet(this.workbook, responsavelSheet, 'Por Responsável');

      // Planilha 4: Análise por Zona
      const zonaStats = documentos.reduce((acc: Record<string, number>, documento) => {
        acc[documento.zona] = (acc[documento.zona] || 0) + 1;
        return acc;
      }, {});

      const zonaData = [
        ['ANÁLISE POR ZONA'],
        [''],
        ['Zona', 'Total de Documentos', 'Percentual']
      ];

      Object.entries(zonaStats).forEach(([zona, count]) => {
        const percentual = Math.round((count / documentos.length) * 100);
        zonaData.push([zona, count, `${percentual}%`]);
      });

      const zonaSheet = XLSX.utils.aoa_to_sheet(zonaData);
      XLSX.utils.book_append_sheet(this.workbook, zonaSheet, 'Por Zona');

      // Salvar arquivo
      const fileName = `Relatorio_Detalhado_Documentos_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(this.workbook, fileName);

    } catch (error) {
      console.error('Erro ao gerar relatório detalhado Excel:', error);
      throw error;
    }
  }

  // Gerar relatório de vencimentos
  public async generateDocumentosVencimentosReport(documentos: any[], config: ExcelReportConfig): Promise<void> {
    try {
      // Filtrar documentos próximos do vencimento
      const documentosVencimento = documentos.filter(doc => {
        const dataValidade = new Date(doc.data_validade);
        const hoje = new Date();
        const diffTime = dataValidade.getTime() - hoje.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30; // Documentos que vencem em 30 dias
      });

      // Planilha 1: Resumo de Vencimentos
      const resumoData = [
        ['RELATÓRIO DE VENCIMENTOS DE DOCUMENTOS'],
        [''],
        ['Período:', `${config.periodo.inicio} a ${config.periodo.fim}`],
        ['Data de Geração:', new Date().toLocaleDateString('pt-PT')],
        [''],
        ['ESTATÍSTICAS DE VENCIMENTOS'],
        ['Total de Documentos Analisados', documentos.length],
        ['Documentos que Vencem em 30 dias', documentosVencimento.length],
        ['Documentos Vencidos', documentos.filter(d => new Date(d.data_validade) < new Date()).length],
        ['Documentos Críticos (7 dias)', documentos.filter(d => {
          const dataValidade = new Date(d.data_validade);
          const hoje = new Date();
          const diffTime = dataValidade.getTime() - hoje.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 7 && diffDays > 0;
        }).length]
      ];

      const resumoSheet = XLSX.utils.aoa_to_sheet(resumoData);
      XLSX.utils.book_append_sheet(this.workbook, resumoSheet, 'Resumo Vencimentos');

      // Planilha 2: Documentos Próximos do Vencimento
      const vencimentosData = [
        ['DOCUMENTOS PRÓXIMOS DO VENCIMENTO'],
        [''],
        ['Código', 'Tipo', 'Estado', 'Responsável', 'Zona', 'Data Validade', 'Dias Restantes', 'Status']
      ];

      documentosVencimento.forEach(documento => {
        const dataValidade = new Date(documento.data_validade);
        const hoje = new Date();
        const diffTime = dataValidade.getTime() - hoje.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let status = '';
        if (diffDays < 0) {
          status = 'VENCIDO';
        } else if (diffDays <= 7) {
          status = 'CRÍTICO';
        } else if (diffDays <= 15) {
          status = 'ATENÇÃO';
        } else {
          status = 'NORMAL';
        }

        vencimentosData.push([
          documento.codigo || 'N/A',
          documento.tipo || 'N/A',
          documento.estado || 'N/A',
          documento.responsavel || 'N/A',
          documento.zona || 'N/A',
          dataValidade.toLocaleDateString('pt-PT'),
          diffDays,
          status
        ]);
      });

      const vencimentosSheet = XLSX.utils.aoa_to_sheet(vencimentosData);
      XLSX.utils.book_append_sheet(this.workbook, vencimentosSheet, 'Próximos Vencimentos');

      // Salvar arquivo
      const fileName = `Relatorio_Vencimentos_Documentos_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(this.workbook, fileName);

    } catch (error) {
      console.error('Erro ao gerar relatório de vencimentos Excel:', error);
      throw error;
    }
  }
}
