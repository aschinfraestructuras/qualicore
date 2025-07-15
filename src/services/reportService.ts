import {
  Ensaio,
  Documento,
  Checklist,
  Material,
  Fornecedor,
  NaoConformidade,
  Obra,
} from "@/types";
import type { MetricasReais } from "./metricsService";

// Configuração da empresa
export interface EmpresaConfig {
  nome: string;
  logotipo?: string;
  morada: string;
  telefone: string;
  email: string;
  website?: string;
  nif: string;
}

// Configuração padrão da empresa
export const empresaConfig: EmpresaConfig = {
  nome: "Qualicore",
  morada: "Rua da Qualidade, 123",
  telefone: "+351 123 456 789",
  email: "info@qualicore.pt",
  website: "www.qualicore.pt",
  nif: "123456789",
};

// Tipos de relatório
export type TipoRelatorio =
  | "executivo"
  | "ensaios"
  | "checklists"
  | "materiais"
  | "ncs"
  | "documentos"
  | "obras"
  | "fornecedores";

// Interface para dados do relatório
export interface DadosRelatorio {
  tipo: TipoRelatorio;
  titulo: string;
  periodo: string;
  dataGeracao: string;
  geradoPor: string;
  metricas?: MetricasReais;
  dados?: any[];
  filtros?: any;
}

// Classe principal para geração de relatórios
export class ReportService {
  private empresaConfig: EmpresaConfig;

  constructor(config?: Partial<EmpresaConfig>) {
    this.empresaConfig = { ...empresaConfig, ...config };
  }

  // Gerar relatório em PDF
  async gerarPDF(dados: DadosRelatorio): Promise<void> {
    const html = await this.gerarHTML(dados);
    this.imprimirPDF(html, dados.titulo);
  }

  // Gerar relatório em HTML para impressão
  async gerarHTML(dados: DadosRelatorio): Promise<string> {
    const template = this.getTemplate(dados.tipo);
    return template(dados);
  }

  // Imprimir PDF usando window.print()
  private imprimirPDF(html: string, titulo: string): void {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert(
        "Erro ao abrir janela de impressão. Verifique se o popup está bloqueado.",
      );
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();

    // Aguardar carregamento e imprimir
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  }

  // Obter template baseado no tipo de relatório
  private getTemplate(tipo: TipoRelatorio) {
    switch (tipo) {
      case "executivo":
        return this.templateExecutivo.bind(this);
      case "ensaios":
        return this.templateEnsaios.bind(this);
      case "checklists":
        return this.templateChecklists.bind(this);
      case "materiais":
        return this.templateMateriais.bind(this);
      case "ncs":
        return this.templateNCs.bind(this);
      case "documentos":
        return this.templateDocumentos.bind(this);
      case "obras":
        return this.templateObras.bind(this);
      case "fornecedores":
        return this.templateFornecedores.bind(this);
      default:
        return this.templateGenerico.bind(this);
    }
  }

  // Template para relatório executivo
  private templateExecutivo(dados: DadosRelatorio): string {
    const { metricas } = dados;
    if (!metricas) return this.templateGenerico(dados);

    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${dados.titulo}</title>
        <style>
          ${this.getEstilosCSS()}
        </style>
      </head>
      <body>
        ${this.getCabecalho(dados)}
        
        <div class="container">
          <h1 class="titulo-principal">Relatório Executivo de Qualidade</h1>
          
          <div class="resumo-executivo">
            <h2>Resumo Executivo</h2>
            <p>Este relatório apresenta uma visão geral do desempenho de qualidade do período ${dados.periodo}.</p>
          </div>

          <div class="metricas-principais">
            <h2>Métricas Principais</h2>
            <div class="grid-metricas">
              <div class="metrica">
                <h3>Conformidade Geral</h3>
                <div class="valor">${metricas.geral.conformidade_geral.toFixed(1)}%</div>
              </div>
              <div class="metrica">
                <h3>Total de Registos</h3>
                <div class="valor">${metricas.geral.total_registros}</div>
              </div>
              <div class="metrica">
                <h3>Alertas Críticos</h3>
                <div class="valor">${metricas.geral.alertas_criticos}</div>
              </div>
            </div>
          </div>

          <div class="secoes-modulos">
            <div class="secao">
              <h2>Ensaios</h2>
              <div class="dados-modulo">
                <p><strong>Taxa de Conformidade:</strong> ${metricas.ensaios.taxa_conformidade.toFixed(1)}%</p>
                <p><strong>Total de Ensaios:</strong> ${metricas.ensaios.total_ensaios}</p>
                <p><strong>Ensaios Conformes:</strong> ${metricas.ensaios.ensaios_conformes}</p>
                <p><strong>Ensaios Não Conformes:</strong> ${metricas.ensaios.ensaios_nao_conformes}</p>
              </div>
            </div>

            <div class="secao">
              <h2>Checklists</h2>
              <div class="dados-modulo">
                <p><strong>Conformidade Média:</strong> ${metricas.checklists.conformidade_media.toFixed(1)}%</p>
                <p><strong>Total de Checklists:</strong> ${metricas.checklists.total_checklists}</p>
                <p><strong>Checklists Concluídos:</strong> ${metricas.checklists.checklists_concluidos}</p>
                <p><strong>Checklists Pendentes:</strong> ${metricas.checklists.checklists_pendentes}</p>
              </div>
            </div>

            <div class="secao">
              <h2>Materiais</h2>
              <div class="dados-modulo">
                <p><strong>Taxa de Aprovação:</strong> ${metricas.materiais.taxa_aprovacao.toFixed(1)}%</p>
                <p><strong>Total de Materiais:</strong> ${metricas.materiais.total_materiais}</p>
                <p><strong>Materiais Aprovados:</strong> ${metricas.materiais.materiais_aprovados}</p>
                <p><strong>Materiais Pendentes:</strong> ${metricas.materiais.materiais_pendentes}</p>
              </div>
            </div>

            <div class="secao">
              <h2>Não Conformidades</h2>
              <div class="dados-modulo">
                <p><strong>Total de NCs:</strong> ${metricas.naoConformidades.total_ncs}</p>
                <p><strong>NCs Pendentes:</strong> ${metricas.naoConformidades.ncs_pendentes}</p>
                <p><strong>NCs Resolvidas:</strong> ${metricas.naoConformidades.ncs_resolvidas}</p>
                <p><strong>Taxa de Resolução:</strong> ${metricas.naoConformidades.taxa_resolucao.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          ${this.getRodape(dados)}
        </div>
      </body>
      </html>
    `;
  }

  // Template para relatório de ensaios
  private templateEnsaios(dados: DadosRelatorio): string {
    const ensaios = (dados.dados as Ensaio[]) || [];

    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${dados.titulo}</title>
        <style>
          ${this.getEstilosCSS()}
        </style>
      </head>
      <body>
        ${this.getCabecalho(dados)}
        
        <div class="container">
          <h1 class="titulo-principal">Relatório de Ensaios</h1>
          
          <div class="resumo">
            <h2>Resumo</h2>
            <p><strong>Período:</strong> ${dados.periodo}</p>
            <p><strong>Total de Ensaios:</strong> ${ensaios.length}</p>
            <p><strong>Ensaios Conformes:</strong> ${ensaios.filter((e) => e.conforme).length}</p>
            <p><strong>Ensaios Não Conformes:</strong> ${ensaios.filter((e) => !e.conforme).length}</p>
          </div>

          <div class="tabela-container">
            <h2>Detalhes dos Ensaios</h2>
            <table class="tabela-dados">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Tipo</th>
                  <th>Material</th>
                  <th>Resultado</th>
                  <th>Conforme</th>
                  <th>Data</th>
                  <th>Responsável</th>
                </tr>
              </thead>
              <tbody>
                ${ensaios
                  .map(
                    (ensaio) => `
                  <tr>
                    <td>${ensaio.codigo}</td>
                    <td>${ensaio.tipo}</td>
                    <td>${ensaio.material_id}</td>
                    <td>${ensaio.resultado}</td>
                    <td class="${ensaio.conforme ? "conforme" : "nao-conforme"}">
                      ${ensaio.conforme ? "Sim" : "Não"}
                    </td>
                    <td>${new Date(ensaio.data_ensaio).toLocaleDateString("pt-PT")}</td>
                    <td>${ensaio.responsavel}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          ${this.getRodape(dados)}
        </div>
      </body>
      </html>
    `;
  }

  // Template para relatório de checklists
  private templateChecklists(dados: DadosRelatorio): string {
    const checklists = (dados.dados as Checklist[]) || [];

    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${dados.titulo}</title>
        <style>
          ${this.getEstilosCSS()}
        </style>
      </head>
      <body>
        ${this.getCabecalho(dados)}
        
        <div class="container">
          <h1 class="titulo-principal">Relatório de Checklists</h1>
          
          <div class="resumo">
            <h2>Resumo</h2>
            <p><strong>Período:</strong> ${dados.periodo}</p>
            <p><strong>Total de Checklists:</strong> ${checklists.length}</p>
            <p><strong>Status:</strong> ${checklists.map((c) => c.status).join(", ")}</p>
          </div>

          <div class="tabela-container">
            <h2>Detalhes dos Checklists</h2>
            <table class="tabela-dados">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Obra</th>
                  <th>Status</th>
                  <th>Pontos</th>
                  <th>Responsável</th>
                  <th>Data Criação</th>
                </tr>
              </thead>
              <tbody>
                ${checklists
                  .map(
                    (checklist) => `
                  <tr>
                    <td>${checklist.titulo}</td>
                    <td>${checklist.obra}</td>
                    <td class="status-${checklist.status}">${checklist.status}</td>
                    <td>${checklist.pontos.length}</td>
                    <td>${checklist.responsavel}</td>
                    <td>${new Date(checklist.data_criacao).toLocaleDateString("pt-PT")}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          ${this.getRodape(dados)}
        </div>
      </body>
      </html>
    `;
  }

  // Template para relatório de materiais
  private templateMateriais(dados: DadosRelatorio): string {
    const materiais = (dados.dados as Material[]) || [];

    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${dados.titulo}</title>
        <style>
          ${this.getEstilosCSS()}
        </style>
      </head>
      <body>
        ${this.getCabecalho(dados)}
        
        <div class="container">
          <h1 class="titulo-principal">Relatório de Materiais</h1>
          
          <div class="resumo">
            <h2>Resumo</h2>
            <p><strong>Período:</strong> ${dados.periodo}</p>
            <p><strong>Total de Materiais:</strong> ${materiais.length}</p>
            <p><strong>Tipos:</strong> ${[...new Set(materiais.map((m) => m.tipo))].join(", ")}</p>
          </div>

          <div class="tabela-container">
            <h2>Detalhes dos Materiais</h2>
            <table class="tabela-dados">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Tipo</th>
                  <th>Quantidade</th>
                  <th>Estado</th>
                  <th>Responsável</th>
                  <th>Data Receção</th>
                </tr>
              </thead>
              <tbody>
                ${materiais
                  .map(
                    (material) => `
                  <tr>
                    <td>${material.codigo}</td>
                    <td>${material.nome}</td>
                    <td>${material.tipo}</td>
                    <td>${material.quantidade} ${material.unidade}</td>
                    <td class="estado-${material.estado}">${material.estado}</td>
                    <td>${material.responsavel}</td>
                    <td>${new Date(material.data_rececao).toLocaleDateString("pt-PT")}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          ${this.getRodape(dados)}
        </div>
      </body>
      </html>
    `;
  }

  // Template para relatório de não conformidades
  private templateNCs(dados: DadosRelatorio): string {
    const ncs = (dados.dados as NaoConformidade[]) || [];

    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${dados.titulo}</title>
        <style>
          ${this.getEstilosCSS()}
        </style>
      </head>
      <body>
        ${this.getCabecalho(dados)}
        
        <div class="container">
          <h1 class="titulo-principal">Relatório de Não Conformidades</h1>
          
          <div class="resumo">
            <h2>Resumo</h2>
            <p><strong>Período:</strong> ${dados.periodo}</p>
            <p><strong>Total de NCs:</strong> ${ncs.length}</p>
            <p><strong>NCs Pendentes:</strong> ${ncs.filter((nc) => nc.estado === "pendente").length}</p>
            <p><strong>NCs Resolvidas:</strong> ${ncs.filter((nc) => nc.estado === "concluido").length}</p>
          </div>

          <div class="tabela-container">
            <h2>Detalhes das Não Conformidades</h2>
            <table class="tabela-dados">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Tipo</th>
                  <th>Severidade</th>
                  <th>Descrição</th>
                  <th>Estado</th>
                  <th>Responsável</th>
                  <th>Data Deteção</th>
                </tr>
              </thead>
              <tbody>
                ${ncs
                  .map(
                    (nc) => `
                  <tr>
                    <td>${nc.codigo}</td>
                    <td>${nc.tipo}</td>
                    <td class="severidade-${nc.severidade}">${nc.severidade}</td>
                    <td>${nc.descricao.substring(0, 50)}...</td>
                    <td class="estado-${nc.estado}">${nc.estado}</td>
                    <td>${nc.responsavel_deteccao}</td>
                    <td>${new Date(nc.data_deteccao).toLocaleDateString("pt-PT")}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          ${this.getRodape(dados)}
        </div>
      </body>
      </html>
    `;
  }

  // Template para relatório de documentos
  private templateDocumentos(dados: DadosRelatorio): string {
    const documentos = (dados.dados as Documento[]) || [];

    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${dados.titulo}</title>
        <style>
          ${this.getEstilosCSS()}
        </style>
      </head>
      <body>
        ${this.getCabecalho(dados)}
        
        <div class="container">
          <h1 class="titulo-principal">Relatório de Documentos</h1>
          
          <div class="resumo">
            <h2>Resumo</h2>
            <p><strong>Período:</strong> ${dados.periodo}</p>
            <p><strong>Total de Documentos:</strong> ${documentos.length}</p>
            <p><strong>Tipos:</strong> ${[...new Set(documentos.map((d) => d.tipo))].join(", ")}</p>
          </div>

          <div class="tabela-container">
            <h2>Detalhes dos Documentos</h2>
            <table class="tabela-dados">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Tipo</th>
                  <th>Versão</th>
                  <th>Estado</th>
                  <th>Responsável</th>
                  <th>Data Criação</th>
                  <th>Data Validade</th>
                </tr>
              </thead>
              <tbody>
                ${documentos
                  .map(
                    (doc) => `
                  <tr>
                    <td>${doc.codigo}</td>
                    <td>${doc.tipo}</td>
                    <td>${doc.versao}</td>
                    <td class="estado-${doc.estado}">${doc.estado}</td>
                    <td>${doc.responsavel}</td>
                    <td>${new Date(doc.data_criacao).toLocaleDateString("pt-PT")}</td>
                    <td>${doc.data_validade ? new Date(doc.data_validade).toLocaleDateString("pt-PT") : "-"}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          ${this.getRodape(dados)}
        </div>
      </body>
      </html>
    `;
  }

  // Template para relatório de obras
  private templateObras(dados: DadosRelatorio): string {
    const obras = (dados.dados as Obra[]) || [];

    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${dados.titulo}</title>
        <style>
          ${this.getEstilosCSS()}
        </style>
      </head>
      <body>
        ${this.getCabecalho(dados)}
        
        <div class="container">
          <h1 class="titulo-principal">Relatório de Obras</h1>
          
          <div class="resumo">
            <h2>Resumo</h2>
            <p><strong>Período:</strong> ${dados.periodo}</p>
            <p><strong>Total de Obras:</strong> ${obras.length}</p>
            <p><strong>Obras em Execução:</strong> ${obras.filter((o) => o.status === "em_execucao").length}</p>
            <p><strong>Obras Concluídas:</strong> ${obras.filter((o) => o.status === "concluida").length}</p>
          </div>

          <div class="tabela-container">
            <h2>Detalhes das Obras</h2>
            <table class="tabela-dados">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Cliente</th>
                  <th>Status</th>
                  <th>% Execução</th>
                  <th>Valor Contrato</th>
                  <th>Data Início</th>
                </tr>
              </thead>
              <tbody>
                ${obras
                  .map(
                    (obra) => `
                  <tr>
                    <td>${obra.codigo}</td>
                    <td>${obra.nome}</td>
                    <td>${obra.cliente}</td>
                    <td class="status-${obra.status}">${obra.status}</td>
                    <td>${obra.percentual_execucao.toFixed(1)}%</td>
                    <td>${obra.valor_contrato.toLocaleString("pt-PT")} €</td>
                    <td>${new Date(obra.data_inicio).toLocaleDateString("pt-PT")}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          ${this.getRodape(dados)}
        </div>
      </body>
      </html>
    `;
  }

  // Template para relatório de fornecedores
  private templateFornecedores(dados: DadosRelatorio): string {
    const fornecedores = (dados.dados as Fornecedor[]) || [];

    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${dados.titulo}</title>
        <style>
          ${this.getEstilosCSS()}
        </style>
      </head>
      <body>
        ${this.getCabecalho(dados)}
        
        <div class="container">
          <h1 class="titulo-principal">Relatório de Fornecedores</h1>
          
          <div class="resumo">
            <h2>Resumo</h2>
            <p><strong>Período:</strong> ${dados.periodo}</p>
            <p><strong>Total de Fornecedores:</strong> ${fornecedores.length}</p>
            <p><strong>Fornecedores Ativos:</strong> ${fornecedores.filter((f) => f.estado === "ativo").length}</p>
            <p><strong>Fornecedores Inativos:</strong> ${fornecedores.filter((f) => f.estado === "inativo").length}</p>
          </div>

          <div class="tabela-container">
            <h2>Detalhes dos Fornecedores</h2>
            <table class="tabela-dados">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>NIF</th>
                  <th>Contacto</th>
                  <th>Email</th>
                  <th>Estado</th>
                  <th>Data Registo</th>
                </tr>
              </thead>
              <tbody>
                ${fornecedores
                  .map(
                    (fornecedor) => `
                  <tr>
                    <td>${fornecedor.nome}</td>
                    <td>${fornecedor.nif}</td>
                    <td>${fornecedor.contacto}</td>
                    <td>${fornecedor.email}</td>
                    <td class="estado-${fornecedor.estado}">${fornecedor.estado}</td>
                    <td>${new Date(fornecedor.data_registo).toLocaleDateString("pt-PT")}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          ${this.getRodape(dados)}
        </div>
      </body>
      </html>
    `;
  }

  // Template genérico
  private templateGenerico(dados: DadosRelatorio): string {
    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${dados.titulo}</title>
        <style>
          ${this.getEstilosCSS()}
        </style>
      </head>
      <body>
        ${this.getCabecalho(dados)}
        
        <div class="container">
          <h1 class="titulo-principal">${dados.titulo}</h1>
          
          <div class="resumo">
            <h2>Resumo</h2>
            <p><strong>Período:</strong> ${dados.periodo}</p>
            <p><strong>Data de Geração:</strong> ${dados.dataGeracao}</p>
            <p><strong>Gerado por:</strong> ${dados.geradoPor}</p>
          </div>

          ${this.getRodape(dados)}
        </div>
      </body>
      </html>
    `;
  }

  // Gerar cabeçalho do relatório
  private getCabecalho(dados: DadosRelatorio): string {
    return `
      <header class="cabecalho">
        <div class="empresa-info">
          ${this.empresaConfig.logotipo ? `<img src="${this.empresaConfig.logotipo}" alt="Logo" class="logo">` : ""}
          <div class="empresa-detalhes">
            <h1>${this.empresaConfig.nome}</h1>
            <p>${this.empresaConfig.morada}</p>
            <p>Tel: ${this.empresaConfig.telefone} | Email: ${this.empresaConfig.email}</p>
            ${this.empresaConfig.website ? `<p>${this.empresaConfig.website}</p>` : ""}
          </div>
        </div>
        <div class="relatorio-info">
          <h2>${dados.titulo}</h2>
          <p><strong>Período:</strong> ${dados.periodo}</p>
          <p><strong>Data:</strong> ${dados.dataGeracao}</p>
          <p><strong>Gerado por:</strong> ${dados.geradoPor}</p>
        </div>
      </header>
    `;
  }

  // Gerar rodapé do relatório
  private getRodape(dados: DadosRelatorio): string {
    return `
      <footer class="rodape">
        <div class="pagina-info">
          <p>Página 1</p>
          <p>Gerado em ${new Date().toLocaleString("pt-PT")}</p>
        </div>
        <div class="empresa-rodape">
          <p>${this.empresaConfig.nome} - NIF: ${this.empresaConfig.nif}</p>
        </div>
      </footer>
    `;
  }

  // Estilos CSS para os relatórios
  private getEstilosCSS(): string {
    return `
      @media print {
        body { margin: 0; padding: 0; }
        .no-print { display: none !important; }
      }

      * {
        box-sizing: border-box;
      }

      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background: #fff;
      }

      .cabecalho {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        color: white;
        padding: 20px;
        margin-bottom: 30px;
      }

      .empresa-info {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
      }

      .logo {
        width: 80px;
        height: 80px;
        margin-right: 20px;
        object-fit: contain;
      }

      .empresa-detalhes h1 {
        margin: 0 0 10px 0;
        font-size: 24px;
        font-weight: bold;
      }

      .empresa-detalhes p {
        margin: 5px 0;
        font-size: 14px;
        opacity: 0.9;
      }

      .relatorio-info {
        text-align: right;
      }

      .relatorio-info h2 {
        margin: 0 0 10px 0;
        font-size: 20px;
      }

      .relatorio-info p {
        margin: 5px 0;
        font-size: 14px;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }

      .titulo-principal {
        color: #1e3c72;
        font-size: 28px;
        font-weight: bold;
        text-align: center;
        margin: 30px 0;
        border-bottom: 3px solid #1e3c72;
        padding-bottom: 10px;
      }

      .resumo {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 30px;
        border-left: 4px solid #1e3c72;
      }

      .resumo h2 {
        color: #1e3c72;
        margin: 0 0 15px 0;
        font-size: 20px;
      }

      .resumo p {
        margin: 8px 0;
        font-size: 16px;
      }

      .metricas-principais {
        margin-bottom: 30px;
      }

      .metricas-principais h2 {
        color: #1e3c72;
        margin-bottom: 20px;
        font-size: 20px;
      }

      .grid-metricas {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
      }

      .metrica {
        background: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        border: 1px solid #e9ecef;
      }

      .metrica h3 {
        color: #6c757d;
        margin: 0 0 10px 0;
        font-size: 16px;
        font-weight: normal;
      }

      .metrica .valor {
        color: #1e3c72;
        font-size: 32px;
        font-weight: bold;
      }

      .secoes-modulos {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }

      .secao {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        border: 1px solid #e9ecef;
      }

      .secao h2 {
        color: #1e3c72;
        margin: 0 0 15px 0;
        font-size: 18px;
        border-bottom: 2px solid #1e3c72;
        padding-bottom: 5px;
      }

      .dados-modulo p {
        margin: 8px 0;
        font-size: 14px;
      }

      .dados-modulo strong {
        color: #495057;
      }

      .tabela-container {
        margin-bottom: 30px;
      }

      .tabela-container h2 {
        color: #1e3c72;
        margin-bottom: 15px;
        font-size: 20px;
      }

      .tabela-dados {
        width: 100%;
        border-collapse: collapse;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        border-radius: 8px;
        overflow: hidden;
      }

      .tabela-dados th {
        background: #1e3c72;
        color: white;
        padding: 12px;
        text-align: left;
        font-weight: 600;
        font-size: 14px;
      }

      .tabela-dados td {
        padding: 12px;
        border-bottom: 1px solid #e9ecef;
        font-size: 14px;
      }

      .tabela-dados tr:nth-child(even) {
        background: #f8f9fa;
      }

      .tabela-dados tr:hover {
        background: #e9ecef;
      }

      .conforme {
        color: #28a745;
        font-weight: bold;
      }

      .nao-conforme {
        color: #dc3545;
        font-weight: bold;
      }

      .status-em_execucao { color: #ffc107; font-weight: bold; }
      .status-concluido { color: #28a745; font-weight: bold; }
      .status-pendente { color: #6c757d; font-weight: bold; }
      .status-aprovado { color: #28a745; font-weight: bold; }
      .status-reprovado { color: #dc3545; font-weight: bold; }
      .status-em_analise { color: #17a2b8; font-weight: bold; }

      .estado-ativo { color: #28a745; font-weight: bold; }
      .estado-inativo { color: #6c757d; font-weight: bold; }
      .estado-pendente { color: #ffc107; font-weight: bold; }
      .estado-aprovado { color: #28a745; font-weight: bold; }
      .estado-reprovado { color: #dc3545; font-weight: bold; }
      .estado-concluido { color: #28a745; font-weight: bold; }

      .severidade-baixa { color: #28a745; font-weight: bold; }
      .severidade-media { color: #ffc107; font-weight: bold; }
      .severidade-alta { color: #fd7e14; font-weight: bold; }
      .severidade-critica { color: #dc3545; font-weight: bold; }

      .rodape {
        background: #f8f9fa;
        padding: 20px;
        margin-top: 40px;
        border-top: 2px solid #1e3c72;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        color: #6c757d;
      }

      .pagina-info p {
        margin: 5px 0;
      }

      .empresa-rodape p {
        margin: 5px 0;
        font-weight: bold;
      }

      @media print {
        .cabecalho {
          background: #1e3c72 !important;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        
        .tabela-dados th {
          background: #1e3c72 !important;
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        
        .metrica, .secao {
          box-shadow: none;
          border: 1px solid #ddd;
        }
      }
    `;
  }

  // Atualizar configuração da empresa
  atualizarConfigEmpresa(config: Partial<EmpresaConfig>): void {
    this.empresaConfig = { ...this.empresaConfig, ...config };
  }

  // Definir logotipo da empresa
  definirLogotipo(url: string): void {
    this.empresaConfig.logotipo = url;
  }
}

// Instância global do serviço
export const reportService = new ReportService();
