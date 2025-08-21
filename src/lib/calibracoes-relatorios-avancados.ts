import { Equipamento, Calibracao, Manutencao, Inspecao } from '../types/calibracoes';

export interface RelatorioConfig {
  titulo: string;
  periodo: {
    inicio: string;
    fim: string;
  };
  secoes: {
    resumo: boolean;
    equipamentos: boolean;
    calibracoes: boolean;
    manutencoes: boolean;
    inspecoes: boolean;
    analytics: boolean;
    compliance: boolean;
  };
  formato: 'pdf' | 'excel' | 'word' | 'html';
}

export interface RelatorioDados {
  equipamentos: Equipamento[];
  calibracoes: Calibracao[];
  manutencoes: Manutencao[];
  inspecoes: Inspecao[];
  config: RelatorioConfig;
}

interface AnalyticsData {
  totalEquipamentos: number;
  equipamentosAtivos: number;
  calibracoesVencidas: number;
  conformidadeGeral: number;
  custoTotal: number;
  conformidadePorCategoria: Record<string, number>;
}

class CalibracoesRelatoriosAvancados {
  // Calcular analytics básicos
  private calcularAnalytics(equipamentos: Equipamento[], calibracoes: Calibracao[], manutencoes: Manutencao[], inspecoes: Inspecao[]): AnalyticsData {
    const hoje = new Date();
    
    const totalEquipamentos = equipamentos.length;
    const equipamentosAtivos = equipamentos.filter(eq => eq.estado === 'ativo').length;
    
    const calibracoesVencidas = calibracoes.filter(cal => 
      new Date(cal.data_proxima_calibracao) < hoje
    ).length;
    
    const conformidadeGeral = totalEquipamentos > 0 ? 
      ((totalEquipamentos - calibracoesVencidas) / totalEquipamentos) * 100 : 0;
    
    const custoTotal = equipamentos.reduce((total, eq) => total + (eq.valor_aquisicao || 0), 0) +
                      calibracoes.reduce((total, cal) => total + (cal.custo || 0), 0) +
                      manutencoes.reduce((total, man) => total + (man.custo || 0), 0);
    
    // Conformidade por categoria
    const categorias = [...new Set(equipamentos.map(eq => eq.categoria))];
    const conformidadePorCategoria: Record<string, number> = {};
    
    categorias.forEach(categoria => {
      const equipamentosCategoria = equipamentos.filter(eq => eq.categoria === categoria);
      const calibracoesVencidasCategoria = calibracoes.filter(cal => {
        const equipamento = equipamentos.find(eq => eq.id === cal.equipamento_id);
        return equipamento?.categoria === categoria && new Date(cal.data_proxima_calibracao) < hoje;
      }).length;
      
      conformidadePorCategoria[categoria] = equipamentosCategoria.length > 0 ? 
        ((equipamentosCategoria.length - calibracoesVencidasCategoria) / equipamentosCategoria.length) * 100 : 0;
    });
    
    return {
      totalEquipamentos,
      equipamentosAtivos,
      calibracoesVencidas,
      conformidadeGeral,
      custoTotal,
      conformidadePorCategoria
    };
  }

  // Gerar relatório em PDF
  async gerarPDF(dados: RelatorioDados): Promise<Blob> {
    try {
      const jsPDF = (await import('jspdf')).default;
      const autoTableLib = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      const analytics = this.calcularAnalytics(dados.equipamentos, dados.calibracoes, dados.manutencoes, dados.inspecoes);
      
      // Cabeçalho
      this.adicionarCabecalho(doc, dados.config.titulo);
      
      // Resumo executivo
      if (dados.config.secoes.resumo) {
        this.adicionarResumoExecutivo(doc, analytics);
      }
      
      // Seção de equipamentos
      if (dados.config.secoes.equipamentos) {
        this.adicionarSecaoEquipamentos(doc, dados.equipamentos, autoTableLib.default);
      }
      
      // Seção de calibrações
      if (dados.config.secoes.calibracoes) {
        this.adicionarSecaoCalibracoes(doc, dados.calibracoes, autoTableLib.default);
      }
      
      // Seção de manutenções
      if (dados.config.secoes.manutencoes) {
        this.adicionarSecaoManutencoes(doc, dados.manutencoes, autoTableLib.default);
      }
      
      // Seção de inspeções
      if (dados.config.secoes.inspecoes) {
        this.adicionarSecaoInspecoes(doc, dados.inspecoes, autoTableLib.default);
      }
      
      // Analytics
      if (dados.config.secoes.analytics) {
        this.adicionarAnalytics(doc, analytics, autoTableLib.default);
      }
      
      // Rodapé
      this.adicionarRodape(doc);
      
      return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw new Error('Erro na geração do PDF');
    }
  }

  // Gerar relatório em Excel
  async gerarExcel(dados: RelatorioDados): Promise<Blob> {
    try {
      const XLSX = await import('xlsx');
      
      const workbook = XLSX.utils.book_new();
      const analytics = this.calcularAnalytics(dados.equipamentos, dados.calibracoes, dados.manutencoes, dados.inspecoes);
      
      // Resumo
      if (dados.config.secoes.resumo) {
        const resumoData = [
          ['Métrica', 'Valor'],
          ['Total de Equipamentos', analytics.totalEquipamentos],
          ['Equipamentos Ativos', analytics.equipamentosAtivos],
          ['Calibrações Vencidas', analytics.calibracoesVencidas],
          ['Conformidade Geral', `${analytics.conformidadeGeral.toFixed(2)}%`],
          ['Custo Total', `€${analytics.custoTotal.toFixed(2)}`]
        ];
        const resumoSheet = XLSX.utils.aoa_to_sheet(resumoData);
        XLSX.utils.book_append_sheet(workbook, resumoSheet, 'Resumo');
      }
      
      // Equipamentos
      if (dados.config.secoes.equipamentos) {
        const equipamentosData = dados.equipamentos.map(eq => [
          eq.nome,
          eq.categoria,
          eq.estado,
          eq.data_aquisicao,
          eq.valor_aquisicao,
          eq.localizacao
        ]);
        equipamentosData.unshift(['Nome', 'Categoria', 'Estado', 'Data Aquisição', 'Valor', 'Localização']);
        const equipamentosSheet = XLSX.utils.aoa_to_sheet(equipamentosData);
        XLSX.utils.book_append_sheet(workbook, equipamentosSheet, 'Equipamentos');
      }
      
      // Calibrações
      if (dados.config.secoes.calibracoes) {
        const calibracoesData = dados.calibracoes.map(cal => [
          cal.equipamento_id,
          cal.data_calibracao,
          cal.data_proxima_calibracao,
          cal.resultado,
          cal.custo,
          cal.laboratorio
        ]);
        calibracoesData.unshift(['Equipamento ID', 'Data Calibração', 'Próxima Calibração', 'Resultado', 'Custo', 'Laboratório']);
        const calibracoesSheet = XLSX.utils.aoa_to_sheet(calibracoesData);
        XLSX.utils.book_append_sheet(workbook, calibracoesSheet, 'Calibrações');
      }
      
      return XLSX.write(workbook, { bookType: 'xlsx', type: 'blob' });
    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
      throw new Error('Erro na geração do Excel');
    }
  }

  // Gerar relatório em Word
  async gerarWord(dados: RelatorioDados): Promise<Blob> {
    try {
      // Template básico em HTML que será convertido
      const htmlContent = this.gerarHTMLTemplate(dados);
      
      // Converter HTML para Word (simplificado)
      const blob = new Blob([htmlContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      return blob;
    } catch (error) {
      console.error('Erro ao gerar Word:', error);
      throw new Error('Erro na geração do Word');
    }
  }

  // Gerar relatório em HTML
  gerarHTML(dados: RelatorioDados): string {
    const analytics = this.calcularAnalytics(dados.equipamentos, dados.calibracoes, dados.manutencoes, dados.inspecoes);
    
    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${dados.config.titulo}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .section { margin-bottom: 30px; }
          .section h2 { color: #2563eb; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; font-weight: bold; }
          .metric { display: inline-block; margin: 10px; padding: 15px; background-color: #f8fafc; border-radius: 8px; }
          .metric-value { font-size: 24px; font-weight: bold; color: #2563eb; }
          .footer { margin-top: 50px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${dados.config.titulo}</h1>
          <p>Relatório de Calibrações e Equipamentos</p>
          <p>Período: ${new Date(dados.config.periodo.inicio).toLocaleDateString('pt-PT')} a ${new Date(dados.config.periodo.fim).toLocaleDateString('pt-PT')}</p>
        </div>
        
        ${dados.config.secoes.resumo ? this.gerarSecaoResumoHTML(analytics) : ''}
        ${dados.config.secoes.equipamentos ? this.gerarSecaoEquipamentosHTML(dados.equipamentos) : ''}
        ${dados.config.secoes.calibracoes ? this.gerarSecaoCalibracoesHTML(dados.calibracoes) : ''}
        ${dados.config.secoes.manutencoes ? this.gerarSecaoManutencoesHTML(dados.manutencoes) : ''}
        ${dados.config.secoes.inspecoes ? this.gerarSecaoInspecoesHTML(dados.inspecoes) : ''}
        ${dados.config.secoes.analytics ? this.gerarSecaoAnalyticsHTML(analytics) : ''}
        
        <div class="footer">
          <p>Relatório gerado em ${new Date().toLocaleString('pt-PT')}</p>
          <p>Qualicore - Sistema de Gestão de Qualidade</p>
        </div>
      </body>
      </html>
    `;
  }

  // Métodos auxiliares para PDF
  private adicionarCabecalho(doc: any, titulo: string) {
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Relatório de Calibrações e Equipamentos', 105, 30, { align: 'center' });
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 105, 40, { align: 'center' });
  }

  private adicionarResumoExecutivo(doc: any, analytics: AnalyticsData) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Executivo', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total de Equipamentos: ${analytics.totalEquipamentos}`, 20, 40);
    doc.text(`Equipamentos Ativos: ${analytics.equipamentosAtivos}`, 20, 50);
    doc.text(`Conformidade Geral: ${analytics.conformidadeGeral.toFixed(2)}%`, 20, 60);
    doc.text(`Custo Total: €${analytics.custoTotal.toFixed(2)}`, 20, 70);
  }

  private adicionarSecaoEquipamentos(doc: any, equipamentos: Equipamento[], autoTable: any) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Equipamentos', 20, 20);
    
    const data = equipamentos.map(eq => [
      eq.nome,
      eq.categoria,
      eq.estado,
      new Date(eq.data_aquisicao).toLocaleDateString('pt-PT'),
      `€${eq.valor_aquisicao?.toFixed(2) || '0.00'}`
    ]);
    
    autoTable(doc, {
      head: [['Nome', 'Categoria', 'Estado', 'Data Aquisição', 'Valor']],
      body: data,
      startY: 30,
      styles: { fontSize: 10 }
    });
  }

  private adicionarSecaoCalibracoes(doc: any, calibracoes: Calibracao[], autoTable: any) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Calibrações', 20, 20);
    
    const data = calibracoes.map(cal => [
      cal.equipamento_id,
      new Date(cal.data_calibracao).toLocaleDateString('pt-PT'),
      new Date(cal.data_proxima_calibracao).toLocaleDateString('pt-PT'),
      cal.resultado,
      `€${cal.custo?.toFixed(2) || '0.00'}`
    ]);
    
    autoTable(doc, {
      head: [['Equipamento ID', 'Data Calibração', 'Próxima Calibração', 'Resultado', 'Custo']],
      body: data,
      startY: 30,
      styles: { fontSize: 10 }
    });
  }

  private adicionarSecaoManutencoes(doc: any, manutencoes: Manutencao[], autoTable: any) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Manutenções', 20, 20);
    
    const data = manutencoes.map(man => [
      man.equipamento_id,
      new Date(man.data_manutencao).toLocaleDateString('pt-PT'),
      man.descricao,
      `€${man.custo?.toFixed(2) || '0.00'}`
    ]);
    
    autoTable(doc, {
      head: [['Equipamento ID', 'Data', 'Descrição', 'Custo']],
      body: data,
      startY: 30,
      styles: { fontSize: 10 }
    });
  }

  private adicionarSecaoInspecoes(doc: any, inspecoes: Inspecao[], autoTable: any) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Inspeções', 20, 20);
    
    const data = inspecoes.map(ins => [
      ins.equipamento_id,
      new Date(ins.data_inspecao).toLocaleDateString('pt-PT'),
      ins.resultado,
      ins.inspetor
    ]);
    
    autoTable(doc, {
      head: [['Equipamento ID', 'Data', 'Resultado', 'Inspetor']],
      body: data,
      startY: 30,
      styles: { fontSize: 10 }
    });
  }

  private adicionarAnalytics(doc: any, analytics: AnalyticsData, autoTable: any) {
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Analytics e Métricas', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Conformidade por Categoria:`, 20, 40);
    
    const data = Object.entries(analytics.conformidadePorCategoria).map(([categoria, percentual]) => [
      categoria,
      `${percentual.toFixed(2)}%`
    ]);
    
    autoTable(doc, {
      head: [['Categoria', 'Conformidade']],
      body: data,
      startY: 50,
      styles: { fontSize: 10 }
    });
  }

  private adicionarRodape(doc: any) {
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Página ${i} de ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
      doc.text('Qualicore - Sistema de Gestão de Qualidade', 105, doc.internal.pageSize.height - 5, { align: 'center' });
    }
  }

  // Métodos auxiliares para HTML
  private gerarSecaoResumoHTML(analytics: AnalyticsData): string {
    return `
      <div class="section">
        <h2>Resumo Executivo</h2>
        <div class="metric">
          <div class="metric-value">${analytics.totalEquipamentos}</div>
          <div>Total de Equipamentos</div>
        </div>
        <div class="metric">
          <div class="metric-value">${analytics.equipamentosAtivos}</div>
          <div>Equipamentos Ativos</div>
        </div>
        <div class="metric">
          <div class="metric-value">${analytics.conformidadeGeral.toFixed(2)}%</div>
          <div>Conformidade Geral</div>
        </div>
        <div class="metric">
          <div class="metric-value">€${analytics.custoTotal.toFixed(2)}</div>
          <div>Custo Total</div>
        </div>
      </div>
    `;
  }

  private gerarSecaoEquipamentosHTML(equipamentos: Equipamento[]): string {
    const rows = equipamentos.map(eq => `
      <tr>
        <td>${eq.nome}</td>
        <td>${eq.categoria}</td>
        <td>${eq.estado}</td>
        <td>${new Date(eq.data_aquisicao).toLocaleDateString('pt-PT')}</td>
        <td>€${eq.valor_aquisicao?.toFixed(2) || '0.00'}</td>
        <td>${eq.localizacao}</td>
      </tr>
    `).join('');

    return `
      <div class="section">
        <h2>Equipamentos</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Estado</th>
              <th>Data Aquisição</th>
              <th>Valor</th>
              <th>Localização</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  private gerarSecaoCalibracoesHTML(calibracoes: Calibracao[]): string {
    const rows = calibracoes.map(cal => `
      <tr>
        <td>${cal.equipamento_id}</td>
        <td>${new Date(cal.data_calibracao).toLocaleDateString('pt-PT')}</td>
        <td>${new Date(cal.data_proxima_calibracao).toLocaleDateString('pt-PT')}</td>
        <td>${cal.resultado}</td>
        <td>€${cal.custo?.toFixed(2) || '0.00'}</td>
        <td>${cal.laboratorio}</td>
      </tr>
    `).join('');

    return `
      <div class="section">
        <h2>Calibrações</h2>
        <table>
          <thead>
            <tr>
              <th>Equipamento ID</th>
              <th>Data Calibração</th>
              <th>Próxima Calibração</th>
              <th>Resultado</th>
              <th>Custo</th>
              <th>Laboratório</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  private gerarSecaoManutencoesHTML(manutencoes: Manutencao[]): string {
    const rows = manutencoes.map(man => `
      <tr>
        <td>${man.equipamento_id}</td>
        <td>${new Date(man.data_manutencao).toLocaleDateString('pt-PT')}</td>
        <td>${man.descricao}</td>
        <td>€${man.custo?.toFixed(2) || '0.00'}</td>
      </tr>
    `).join('');

    return `
      <div class="section">
        <h2>Manutenções</h2>
        <table>
          <thead>
            <tr>
              <th>Equipamento ID</th>
              <th>Data</th>
              <th>Descrição</th>
              <th>Custo</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  private gerarSecaoInspecoesHTML(inspecoes: Inspecao[]): string {
    const rows = inspecoes.map(ins => `
      <tr>
        <td>${ins.equipamento_id}</td>
        <td>${new Date(ins.data_inspecao).toLocaleDateString('pt-PT')}</td>
        <td>${ins.resultado}</td>
        <td>${ins.inspetor}</td>
      </tr>
    `).join('');

    return `
      <div class="section">
        <h2>Inspeções</h2>
        <table>
          <thead>
            <tr>
              <th>Equipamento ID</th>
              <th>Data</th>
              <th>Resultado</th>
              <th>Inspetor</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  private gerarSecaoAnalyticsHTML(analytics: AnalyticsData): string {
    const conformidadeRows = Object.entries(analytics.conformidadePorCategoria).map(([categoria, percentual]) => `
      <tr>
        <td>${categoria}</td>
        <td>${percentual.toFixed(2)}%</td>
      </tr>
    `).join('');

    return `
      <div class="section">
        <h2>Analytics e Métricas</h2>
        <h3>Conformidade por Categoria</h3>
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Conformidade</th>
            </tr>
          </thead>
          <tbody>
            ${conformidadeRows}
          </tbody>
        </table>
      </div>
    `;
  }

  private gerarHTMLTemplate(dados: RelatorioDados): string {
    return this.gerarHTML(dados);
  }
}

export const calibracoesRelatoriosAvancados = new CalibracoesRelatoriosAvancados();
