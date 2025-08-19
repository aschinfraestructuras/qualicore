import {
  Ensaio,
  Documento,
  Checklist,
  Material,
  Fornecedor,
  NaoConformidade,
  Obra,
} from "@/types";
import type { Armadura } from "@/types/armaduras";
import { Certificado } from "@/types/certificados";
import { Norma } from "@/types/normas";
import { SubmissaoMaterial } from "@/types/submissaoMateriais";
import type { Sinalizacao, InspecaoSinalizacao } from "@/types/sinalizacao";
import type { SistemaSeguranca, InspecaoSeguranca } from "@/types/segurancaFerroviaria";
import type { MetricasReais } from "./metricsService";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  | "fornecedores"
  | "armaduras"
  | "certificados"
  | "normas"
  | "submissaoMateriais"
  | "sinalizacoes"
  | "inspecoesSinalizacao"
  | "segurancaFerroviaria"
  | "inspecoesSeguranca"
  | "pontesTuneis"
  | "inspecoesPontesTuneis"
  | "calibracoesEquipamentos";

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

export interface ReportData {
  metrics: any;
  trends: any[];
  anomalies: any[];
  enhancements: any[];
  ensaios: any[];
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
      case "armaduras":
        return this.templateArmaduras.bind(this);
      case "certificados":
        return this.templateCertificados.bind(this);
      case "normas":
        return this.templateNormas.bind(this);
      case "submissaoMateriais":
        return this.templateSubmissaoMateriais.bind(this);
      case "sinalizacoes":
        return this.templateSinalizacoes.bind(this);
      case "inspecoesSinalizacao":
        return this.templateInspecoesSinalizacao.bind(this);
      case "segurancaFerroviaria":
        return this.templateSegurancaFerroviaria.bind(this);
              case "inspecoesSeguranca":
          return this.templateInspecoesSeguranca.bind(this);
        case "pontesTuneis":
          return this.templatePontesTuneis.bind(this);
        case "inspecoesPontesTuneis":
          return this.templateInspecoesPontesTuneis.bind(this);
        case "calibracoesEquipamentos":
          return this.templateCalibracoesEquipamentos.bind(this);
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

  // Template para relatório de armaduras
  private templateArmaduras(dados: DadosRelatorio): string {
    const armaduras = (dados.dados as Armadura[]) || [];

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
          <h1 class="titulo-principal">Relatório de Armaduras</h1>
          
          <div class="resumo">
            <h2>Resumo</h2>
            <p><strong>Período:</strong> ${dados.periodo}</p>
            <p><strong>Total de Armaduras:</strong> ${armaduras.length}</p>
            <p><strong>Peso Total:</strong> ${armaduras.reduce((sum, a) => sum + a.peso_total, 0).toFixed(2)} kg</p>
            <p><strong>Fabricantes:</strong> ${[...new Set(armaduras.map((a) => a.fabricante))].join(", ")}</p>
            <p><strong>Estados:</strong> ${[...new Set(armaduras.map((a) => a.estado))].join(", ")}</p>
          </div>

          <div class="tabela-container">
            <h2>Detalhes das Armaduras</h2>
            <table class="tabela-dados">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Tipo</th>
                  <th>Diâmetro</th>
                  <th>Quantidade</th>
                  <th>Peso Total</th>
                  <th>Fabricante</th>
                  <th>Nº Colada</th>
                  <th>Estado</th>
                  <th>Local Aplicação</th>
                  <th>Responsável</th>
                  <th>Data Receção</th>
                </tr>
              </thead>
              <tbody>
                ${armaduras
                  .map(
                    (armadura) => `
                  <tr>
                    <td>${armadura.codigo}</td>
                    <td>${armadura.tipo}</td>
                    <td>${armadura.diametro} mm</td>
                    <td>${armadura.quantidade}</td>
                    <td>${armadura.peso_total} kg</td>
                    <td>${armadura.fabricante}</td>
                    <td>${armadura.numero_colada}</td>
                    <td class="estado-${armadura.estado}">${armadura.estado}</td>
                    <td>${armadura.local_aplicacao}</td>
                    <td>${armadura.responsavel}</td>
                    <td>${new Date(armadura.data_rececao).toLocaleDateString("pt-PT")}</td>
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
      .status-operacional { color: #28a745; font-weight: bold; }
      .status-manutencao { color: #ffc107; font-weight: bold; }
      .status-avaria { color: #dc3545; font-weight: bold; }

      .estado-ativo { color: #28a745; font-weight: bold; }
      .estado-inativo { color: #6c757d; font-weight: bold; }
      .estado-pendente { color: #ffc107; font-weight: bold; }

      .resultado-conforme { color: #28a745; font-weight: bold; }
      .resultado-nao_conforme { color: #dc3545; font-weight: bold; }
      .resultado-pendente { color: #6c757d; font-weight: bold; }

      .prioridade-critica { color: #dc3545; font-weight: bold; }
      .prioridade-alta { color: #fd7e14; font-weight: bold; }
      .prioridade-media { color: #ffc107; font-weight: bold; }
      .prioridade-baixa { color: #28a745; font-weight: bold; }
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

  // Template para relatórios de certificados
  private templateCertificados(dados: DadosRelatorio): string {
    const certificados = dados.dados || [];
    
    // Estatísticas
    const stats = {
      total: certificados.length,
      validos: certificados.filter((c: any) => c.status === 'valido').length,
      expirados: certificados.filter((c: any) => c.status === 'expirado').length,
      pendentes: certificados.filter((c: any) => c.status === 'pendente').length,
      fornecedores: new Set(certificados.map((c: any) => c.fornecedor)).size
    };

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
          <h1 class="titulo-principal">Relatório de Certificados</h1>
          
          <div class="resumo-executivo">
            <h2>Resumo Executivo</h2>
            <p>Este relatório apresenta uma visão geral dos certificados do período ${dados.periodo}.</p>
          </div>

          <div class="metricas-principais">
            <h2>Estatísticas Gerais</h2>
            <div class="grid-metricas">
              <div class="metrica">
                <h3>Total de Certificados</h3>
                <div class="valor">${stats.total}</div>
              </div>
              <div class="metrica">
                <h3>Certificados Válidos</h3>
                <div class="valor conforme">${stats.validos}</div>
              </div>
              <div class="metrica">
                <h3>Certificados Expirados</h3>
                <div class="valor nao-conforme">${stats.expirados}</div>
              </div>
              <div class="metrica">
                <h3>Certificados Pendentes</h3>
                <div class="valor">${stats.pendentes}</div>
              </div>
            </div>
          </div>

          <div class="secoes-modulos">
            <div class="secao">
              <h2>Detalhes dos Certificados</h2>
              <div class="tabela-container">
                <table class="tabela-dados">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Tipo</th>
                      <th>Fornecedor</th>
                      <th>Status</th>
                      <th>Data de Validade</th>
                      <th>Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${certificados.map((certificado: any) => `
                      <tr>
                        <td>${certificado.codigo}</td>
                        <td>${certificado.tipo}</td>
                        <td>${certificado.fornecedor}</td>
                        <td class="status-${certificado.status}">${certificado.status}</td>
                        <td>${new Date(certificado.data_validade).toLocaleDateString('pt-PT')}</td>
                        <td>${certificado.responsavel}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        ${this.getRodape(dados)}
      </body>
      </html>
    `;
  }

  // Template para relatórios de Normas
  private templateNormas(dados: DadosRelatorio): string {
    const normas = dados.dados || [];
    
    const stats = {
      total: normas.length,
      ativas: normas.filter((n: any) => n.status === 'ATIVA').length,
      revisao: normas.filter((n: any) => n.status === 'REVISAO').length,
      obsoletas: normas.filter((n: any) => n.status === 'OBSOLETA').length,
      criticas: normas.filter((n: any) => n.prioridade === 'CRITICA').length,
      categorias: new Set(normas.map((n: any) => n.categoria)).size,
      organismos: new Set(normas.map((n: any) => n.organismo)).size
    };

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
          <h1 class="titulo-principal">Relatório de Normas</h1>
          
          <div class="resumo-executivo">
            <h2>Resumo Executivo</h2>
            <p>Este relatório apresenta uma visão geral das normas do período ${dados.periodo}.</p>
          </div>

          <div class="metricas-principais">
            <h2>Estatísticas Gerais</h2>
            <div class="grid-metricas">
              <div class="metrica">
                <h3>Total de Normas</h3>
                <div class="valor">${stats.total}</div>
              </div>
              <div class="metrica">
                <h3>Normas Ativas</h3>
                <div class="valor conforme">${stats.ativas}</div>
              </div>
              <div class="metrica">
                <h3>Em Revisão</h3>
                <div class="valor">${stats.revisao}</div>
              </div>
              <div class="metrica">
                <h3>Obsoletas</h3>
                <div class="valor nao-conforme">${stats.obsoletas}</div>
              </div>
              <div class="metrica">
                <h3>Prioridade Crítica</h3>
                <div class="valor critico">${stats.criticas}</div>
              </div>
              <div class="metrica">
                <h3>Categorias</h3>
                <div class="valor">${stats.categorias}</div>
              </div>
            </div>
          </div>

          <div class="secoes-modulos">
            <div class="secao">
              <h2>Detalhes das Normas</h2>
              <div class="tabela-container">
                <table class="tabela-dados">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Título</th>
                      <th>Categoria</th>
                      <th>Organismo</th>
                      <th>Versão</th>
                      <th>Status</th>
                      <th>Prioridade</th>
                      <th>Data Publicação</th>
                      <th>Entrada em Vigor</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${normas.map((norma: any) => `
                      <tr>
                        <td>${norma.codigo}</td>
                        <td>${norma.titulo}</td>
                        <td>${norma.categoria}</td>
                        <td>${norma.organismo}</td>
                        <td>${norma.versao}</td>
                        <td class="status-${norma.status.toLowerCase()}">${norma.status}</td>
                        <td class="prioridade-${norma.prioridade.toLowerCase()}">${norma.prioridade}</td>
                        <td>${new Date(norma.data_publicacao).toLocaleDateString('pt-PT')}</td>
                        <td>${new Date(norma.data_entrada_vigor).toLocaleDateString('pt-PT')}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        ${this.getRodape(dados)}
      </body>
      </html>
    `;
  }

  // Template para relatório de submissão de materiais
  private templateSubmissaoMateriais(dados: DadosRelatorio): string {
    const submissoes = dados.dados || [];
    
    // Calcular estatísticas
    const stats = {
      total: submissoes.length,
      aprovadas: submissoes.filter((s: any) => s.estado === 'aprovado').length,
      pendentes: submissoes.filter((s: any) => ['submetido', 'em_revisao', 'aguardando_aprovacao'].includes(s.estado)).length,
      rejeitadas: submissoes.filter((s: any) => s.estado === 'rejeitado').length,
      urgentes: submissoes.filter((s: any) => s.urgencia === 'urgente' || s.urgencia === 'muito_urgente').length,
      criticas: submissoes.filter((s: any) => s.prioridade === 'critica').length,
      tipos: new Set(submissoes.map((s: any) => s.tipo_material)).size,
      categorias: new Set(submissoes.map((s: any) => s.categoria)).size
    };

    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Submissões de Materiais - ${dados.titulo}</title>
        ${this.getEstilosCSS()}
      </head>
      <body>
        ${this.getCabecalho(dados)}
        
        <div class="container">
          <h1 class="titulo-principal">Relatório de Submissões de Materiais</h1>
          
          <div class="resumo-executivo">
            <h2>Resumo Executivo</h2>
            <p>Este relatório apresenta uma visão geral das submissões de materiais do período ${dados.periodo}.</p>
          </div>

          <div class="metricas-principais">
            <h2>Estatísticas Gerais</h2>
            <div class="grid-metricas">
              <div class="metrica">
                <h3>Total de Submissões</h3>
                <div class="valor">${stats.total}</div>
              </div>
              <div class="metrica">
                <h3>Aprovadas</h3>
                <div class="valor conforme">${stats.aprovadas}</div>
              </div>
              <div class="metrica">
                <h3>Pendentes</h3>
                <div class="valor">${stats.pendentes}</div>
              </div>
              <div class="metrica">
                <h3>Rejeitadas</h3>
                <div class="valor nao-conforme">${stats.rejeitadas}</div>
              </div>
              <div class="metrica">
                <h3>Urgentes</h3>
                <div class="valor critico">${stats.urgentes}</div>
              </div>
              <div class="metrica">
                <h3>Críticas</h3>
                <div class="valor critico">${stats.criticas}</div>
              </div>
            </div>
          </div>

          <div class="secoes-modulos">
            <div class="secao">
              <h2>Detalhes das Submissões</h2>
              <div class="tabela-container">
                <table class="tabela-dados">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Título</th>
                      <th>Tipo Material</th>
                      <th>Categoria</th>
                      <th>Estado</th>
                      <th>Prioridade</th>
                      <th>Submissor</th>
                      <th>Data Submissão</th>
                      <th>Obra</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${submissoes.map((submissao: any) => `
                      <tr>
                        <td>${submissao.codigo}</td>
                        <td>${submissao.titulo}</td>
                        <td>${submissao.tipo_material}</td>
                        <td>${submissao.categoria}</td>
                        <td class="status-${submissao.estado.toLowerCase()}">${submissao.estado}</td>
                        <td class="prioridade-${submissao.prioridade.toLowerCase()}">${submissao.prioridade}</td>
                        <td>${submissao.submissor_nome}</td>
                        <td>${new Date(submissao.data_submissao).toLocaleDateString('pt-PT')}</td>
                        <td>${submissao.obra_nome || 'N/A'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        ${this.getRodape(dados)}
      </body>
      </html>
    `;
  }

  // Template para relatório de sinalizações
  private templateSinalizacoes(dados: DadosRelatorio): string {
    const sinalizacoes = (dados.dados as Sinalizacao[]) || [];
    
    const stats = {
      total: sinalizacoes.length,
      operacional: sinalizacoes.filter((s: any) => s.status_operacional === 'OPERACIONAL').length,
      manutencao: sinalizacoes.filter((s: any) => s.status_operacional === 'MANUTENCAO').length,
      avaria: sinalizacoes.filter((s: any) => s.status_operacional === 'AVARIA').length,
      ativo: sinalizacoes.filter((s: any) => s.estado === 'ATIVO').length,
      inativo: sinalizacoes.filter((s: any) => s.estado === 'INATIVO').length,
      tipos: new Set(sinalizacoes.map((s: any) => s.tipo)).size,
      categorias: new Set(sinalizacoes.map((s: any) => s.categoria)).size
    };

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
          <h1 class="titulo-principal">Relatório de Sinalizações</h1>
          
          <div class="resumo-executivo">
            <h2>Resumo Executivo</h2>
            <p>Este relatório apresenta uma visão geral das sinalizações do período ${dados.periodo}.</p>
          </div>

          <div class="metricas-principais">
            <h2>Estatísticas Gerais</h2>
            <div class="grid-metricas">
              <div class="metrica">
                <h3>Total de Sinalizações</h3>
                <div class="valor">${stats.total}</div>
              </div>
              <div class="metrica">
                <h3>Operacionais</h3>
                <div class="valor conforme">${stats.operacional}</div>
              </div>
              <div class="metrica">
                <h3>Em Manutenção</h3>
                <div class="valor">${stats.manutencao}</div>
              </div>
              <div class="metrica">
                <h3>Em Avaria</h3>
                <div class="valor nao-conforme">${stats.avaria}</div>
              </div>
              <div class="metrica">
                <h3>Ativas</h3>
                <div class="valor conforme">${stats.ativo}</div>
              </div>
              <div class="metrica">
                <h3>Inativas</h3>
                <div class="valor nao-conforme">${stats.inativo}</div>
              </div>
            </div>
          </div>

          <div class="secoes-modulos">
            <div class="secao">
              <h2>Detalhes das Sinalizações</h2>
              <div class="tabela-container">
                <table class="tabela-dados">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Tipo</th>
                      <th>Categoria</th>
                      <th>Localização</th>
                      <th>Status Operacional</th>
                      <th>Estado</th>
                      <th>Última Inspeção</th>
                      <th>Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sinalizacoes.map((sinalizacao: any) => `
                      <tr>
                        <td>${sinalizacao.codigo}</td>
                        <td>${sinalizacao.tipo}</td>
                        <td>${sinalizacao.categoria}</td>
                        <td>${sinalizacao.localizacao}</td>
                        <td class="status-${sinalizacao.status_operacional.toLowerCase()}">${sinalizacao.status_operacional}</td>
                        <td class="estado-${sinalizacao.estado.toLowerCase()}">${sinalizacao.estado}</td>
                        <td>${sinalizacao.ultima_inspecao ? new Date(sinalizacao.ultima_inspecao).toLocaleDateString('pt-PT') : 'N/A'}</td>
                        <td>${sinalizacao.responsavel}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        ${this.getRodape(dados)}
      </body>
      </html>
    `;
  }

  // Template para relatório de inspeções de sinalização
  private templateInspecoesSinalizacao(dados: DadosRelatorio): string {
    const inspecoes = (dados.dados as InspecaoSinalizacao[]) || [];
    
    const stats = {
      total: inspecoes.length,
      conformes: inspecoes.filter((i: any) => i.resultado === 'CONFORME').length,
      naoConformes: inspecoes.filter((i: any) => i.resultado === 'NAO_CONFORME').length,
      pendentes: inspecoes.filter((i: any) => i.resultado === 'PENDENTE').length,
      criticas: inspecoes.filter((i: any) => i.prioridade === 'CRITICA').length,
      altas: inspecoes.filter((i: any) => i.prioridade === 'ALTA').length,
      tipos: new Set(inspecoes.map((i: any) => i.tipo_inspecao)).size
    };

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
          <h1 class="titulo-principal">Relatório de Inspeções de Sinalização</h1>
          
          <div class="resumo-executivo">
            <h2>Resumo Executivo</h2>
            <p>Este relatório apresenta uma visão geral das inspeções de sinalização do período ${dados.periodo}.</p>
          </div>

          <div class="metricas-principais">
            <h2>Estatísticas Gerais</h2>
            <div class="grid-metricas">
              <div class="metrica">
                <h3>Total de Inspeções</h3>
                <div class="valor">${stats.total}</div>
              </div>
              <div class="metrica">
                <h3>Conformes</h3>
                <div class="valor conforme">${stats.conformes}</div>
              </div>
              <div class="metrica">
                <h3>Não Conformes</h3>
                <div class="valor nao-conforme">${stats.naoConformes}</div>
              </div>
              <div class="metrica">
                <h3>Pendentes</h3>
                <div class="valor">${stats.pendentes}</div>
              </div>
              <div class="metrica">
                <h3>Críticas</h3>
                <div class="valor critico">${stats.criticas}</div>
              </div>
              <div class="metrica">
                <h3>Alta Prioridade</h3>
                <div class="valor critico">${stats.altas}</div>
              </div>
            </div>
          </div>

          <div class="secoes-modulos">
            <div class="secao">
              <h2>Detalhes das Inspeções</h2>
              <div class="tabela-container">
                <table class="tabela-dados">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Sinalização</th>
                      <th>Tipo Inspeção</th>
                      <th>Resultado</th>
                      <th>Prioridade</th>
                      <th>Data Inspeção</th>
                      <th>Inspetor</th>
                      <th>Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${inspecoes.map((inspecao: any) => `
                      <tr>
                        <td>${inspecao.codigo}</td>
                        <td>${inspecao.sinalizacao_codigo}</td>
                        <td>${inspecao.tipo_inspecao}</td>
                        <td class="resultado-${inspecao.resultado.toLowerCase()}">${inspecao.resultado}</td>
                        <td class="prioridade-${inspecao.prioridade.toLowerCase()}">${inspecao.prioridade}</td>
                        <td>${new Date(inspecao.data_inspecao).toLocaleDateString('pt-PT')}</td>
                        <td>${inspecao.inspetor}</td>
                        <td>${inspecao.observacoes ? inspecao.observacoes.substring(0, 50) + '...' : 'N/A'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        ${this.getRodape(dados)}
      </body>
      </html>
    `;
  }

  // Template para relatório de segurança ferroviária
  private templateSegurancaFerroviaria(dados: DadosRelatorio): string {
    const sistemas = (dados.dados as SistemaSeguranca[]) || [];
    
    const stats = {
      total: sistemas.length,
      operacionais: sistemas.filter((s: any) => s.status_operacional === 'Operacional').length,
      manutencao: sistemas.filter((s: any) => s.status_operacional === 'Manutenção').length,
      avaria: sistemas.filter((s: any) => s.status_operacional === 'Avaria').length,
      ativos: sistemas.filter((s: any) => s.estado === 'Ativo').length,
      inativos: sistemas.filter((s: any) => s.estado === 'Inativo').length,
      criticos: sistemas.filter((s: any) => s.parametros?.nivel_seguranca > 8).length,
      tipos: new Set(sistemas.map((s: any) => s.tipo)).size,
      categorias: new Set(sistemas.map((s: any) => s.categoria)).size
    };

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
          <h1 class="titulo-principal">Relatório de Sistemas de Segurança Ferroviária</h1>
          
          <div class="resumo-executivo">
            <h2>Resumo Executivo</h2>
            <p>Este relatório apresenta uma visão geral dos sistemas de segurança ferroviária do período ${dados.periodo}.</p>
          </div>

          <div class="metricas-principais">
            <h2>Estatísticas Gerais</h2>
            <div class="grid-metricas">
              <div class="metrica">
                <h3>Total de Sistemas</h3>
                <div class="valor">${stats.total}</div>
              </div>
              <div class="metrica">
                <h3>Operacionais</h3>
                <div class="valor conforme">${stats.operacionais}</div>
              </div>
              <div class="metrica">
                <h3>Em Manutenção</h3>
                <div class="valor">${stats.manutencao}</div>
              </div>
              <div class="metrica">
                <h3>Em Avaria</h3>
                <div class="valor nao-conforme">${stats.avaria}</div>
              </div>
              <div class="metrica">
                <h3>Ativos</h3>
                <div class="valor conforme">${stats.ativos}</div>
              </div>
              <div class="metrica">
                <h3>Inativos</h3>
                <div class="valor nao-conforme">${stats.inativos}</div>
              </div>
            </div>
          </div>

          <div class="secoes-modulos">
            <div class="secao">
              <h2>Detalhes dos Sistemas</h2>
              <div class="tabela-container">
                <table class="tabela-dados">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Tipo</th>
                      <th>Categoria</th>
                      <th>Localização</th>
                      <th>Status Operacional</th>
                      <th>Estado</th>
                      <th>Fabricante</th>
                      <th>Última Inspeção</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${sistemas.map((sistema: any) => `
                      <tr>
                        <td>${sistema.codigo}</td>
                        <td>${sistema.tipo}</td>
                        <td>${sistema.categoria}</td>
                        <td>${sistema.localizacao}</td>
                        <td class="status-${sistema.status_operacional.toLowerCase()}">${sistema.status_operacional}</td>
                        <td class="estado-${sistema.estado.toLowerCase()}">${sistema.estado}</td>
                        <td>${sistema.fabricante}</td>
                        <td>${sistema.ultima_inspecao ? new Date(sistema.ultima_inspecao).toLocaleDateString('pt-PT') : 'N/A'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        ${this.getRodape(dados)}
      </body>
      </html>
    `;
  }

  // Template para relatório de inspeções de segurança
  private templateInspecoesSeguranca(dados: DadosRelatorio): string {
    const inspecoes = (dados.dados as InspecaoSeguranca[]) || [];
    
    const stats = {
      total: inspecoes.length,
      conformes: inspecoes.filter((i: any) => i.resultado === 'Conforme').length,
      naoConformes: inspecoes.filter((i: any) => i.resultado === 'Não Conforme').length,
      pendentes: inspecoes.filter((i: any) => i.resultado === 'Pendente').length,
      criticas: inspecoes.filter((i: any) => i.prioridade === 'Crítica').length,
      altas: inspecoes.filter((i: any) => i.prioridade === 'Alta').length,
      tipos: new Set(inspecoes.map((i: any) => i.tipo_inspecao)).size
    };

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
          <h1 class="titulo-principal">Relatório de Inspeções de Segurança</h1>
          
          <div class="resumo-executivo">
            <h2>Resumo Executivo</h2>
            <p>Este relatório apresenta uma visão geral das inspeções de segurança do período ${dados.periodo}.</p>
          </div>

          <div class="metricas-principais">
            <h2>Estatísticas Gerais</h2>
            <div class="grid-metricas">
              <div class="metrica">
                <h3>Total de Inspeções</h3>
                <div class="valor">${stats.total}</div>
              </div>
              <div class="metrica">
                <h3>Conformes</h3>
                <div class="valor conforme">${stats.conformes}</div>
              </div>
              <div class="metrica">
                <h3>Não Conformes</h3>
                <div class="valor nao-conforme">${stats.naoConformes}</div>
              </div>
              <div class="metrica">
                <h3>Pendentes</h3>
                <div class="valor">${stats.pendentes}</div>
              </div>
              <div class="metrica">
                <h3>Críticas</h3>
                <div class="valor critico">${stats.criticas}</div>
              </div>
              <div class="metrica">
                <h3>Alta Prioridade</h3>
                <div class="valor critico">${stats.altas}</div>
              </div>
            </div>
          </div>

          <div class="secoes-modulos">
            <div class="secao">
              <h2>Detalhes das Inspeções</h2>
              <div class="tabela-container">
                <table class="tabela-dados">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Sistema</th>
                      <th>Tipo Inspeção</th>
                      <th>Resultado</th>
                      <th>Prioridade</th>
                      <th>Data Inspeção</th>
                      <th>Responsável</th>
                      <th>Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${inspecoes.map((inspecao: any) => `
                      <tr>
                        <td>${inspecao.id}</td>
                        <td>${inspecao.seguranca_id}</td>
                        <td>${inspecao.tipo_inspecao}</td>
                        <td class="resultado-${inspecao.resultado.toLowerCase()}">${inspecao.resultado}</td>
                        <td class="prioridade-${inspecao.prioridade.toLowerCase()}">${inspecao.prioridade}</td>
                        <td>${new Date(inspecao.data_inspecao).toLocaleDateString('pt-PT')}</td>
                        <td>${inspecao.responsavel}</td>
                        <td>${inspecao.observacoes ? inspecao.observacoes.substring(0, 50) + '...' : 'N/A'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        ${this.getRodape(dados)}
      </body>
      </html>
    `;
  }

  private templatePontesTuneis(dados: DadosRelatorio): string {
    const pontesTuneis = dados.dados || [];
    const stats = {
      total: pontesTuneis.length,
      pontes: pontesTuneis.filter((pt: any) => pt.tipo === 'PONTE').length,
      tuneis: pontesTuneis.filter((pt: any) => pt.tipo === 'TUNEL').length,
      operacionais: pontesTuneis.filter((pt: any) => pt.status_operacional === 'OPERACIONAL').length,
      manutencao: pontesTuneis.filter((pt: any) => pt.status_operacional === 'MANUTENCAO').length,
      avaria: pontesTuneis.filter((pt: any) => pt.status_operacional === 'AVARIA').length,
      ativos: pontesTuneis.filter((pt: any) => pt.estado === 'ATIVO').length,
      inativos: pontesTuneis.filter((pt: any) => pt.estado === 'INATIVO').length
    };

    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Pontes e Túneis</title>
        <style>
          ${this.getEstilosCSS()}
          .tipo-ponte { background-color: #dbeafe; color: #1e40af; }
          .tipo-tunel { background-color: #e9d5ff; color: #7c3aed; }
          .tipo-viaduto { background-color: #dcfce7; color: #16a34a; }
          .estado-ativo { background-color: #dcfce7; color: #16a34a; }
          .estado-manutencao { background-color: #fef3c7; color: #d97706; }
          .estado-avaria { background-color: #fee2e2; color: #dc2626; }
          .estado-construcao { background-color: #dbeafe; color: #1e40af; }
          .status-operacional { background-color: #dcfce7; color: #16a34a; }
          .status-manutencao { background-color: #fef3c7; color: #d97706; }
          .status-avaria { background-color: #fee2e2; color: #dc2626; }
          .status-emergencia { background-color: #fecaca; color: #991b1b; }
        </style>
      </head>
      <body>
        ${this.getCabecalho(dados)}
        
        <div class="container">
          <h1 class="titulo-principal">Relatório de Pontes e Túneis</h1>
          
          <div class="resumo-executivo">
            <h2>Resumo Executivo</h2>
            <p>Este relatório apresenta uma visão geral das pontes e túneis do período ${dados.periodo}.</p>
          </div>

          <div class="metricas-principais">
            <h2>Estatísticas Gerais</h2>
            <div class="grid-metricas">
              <div class="metrica">
                <h3>Total</h3>
                <div class="valor">${stats.total}</div>
              </div>
              <div class="metrica">
                <h3>Pontes</h3>
                <div class="valor">${stats.pontes}</div>
              </div>
              <div class="metrica">
                <h3>Túneis</h3>
                <div class="valor">${stats.tuneis}</div>
              </div>
              <div class="metrica">
                <h3>Operacionais</h3>
                <div class="valor conforme">${stats.operacionais}</div>
              </div>
              <div class="metrica">
                <h3>Manutenção</h3>
                <div class="valor">${stats.manutencao}</div>
              </div>
              <div class="metrica">
                <h3>Avaria</h3>
                <div class="valor nao-conforme">${stats.avaria}</div>
              </div>
            </div>
          </div>

          <div class="secoes-modulos">
            <div class="secao">
              <h2>Detalhes das Pontes e Túneis</h2>
              <div class="tabela-container">
                <table class="tabela-dados">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Tipo</th>
                      <th>Categoria</th>
                      <th>Localização</th>
                      <th>Estado</th>
                      <th>Status</th>
                      <th>Fabricante</th>
                      <th>Responsável</th>
                      <th>Última Inspeção</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${pontesTuneis.map((ponteTunel: any) => `
                      <tr>
                        <td>${ponteTunel.codigo}</td>
                        <td class="tipo-${ponteTunel.tipo.toLowerCase()}">${ponteTunel.tipo}</td>
                        <td>${ponteTunel.categoria}</td>
                        <td>${ponteTunel.localizacao}</td>
                        <td class="estado-${ponteTunel.estado.toLowerCase()}">${ponteTunel.estado}</td>
                        <td class="status-${ponteTunel.status_operacional.toLowerCase()}">${ponteTunel.status_operacional}</td>
                        <td>${ponteTunel.fabricante}</td>
                        <td>${ponteTunel.responsavel}</td>
                        <td>${new Date(ponteTunel.ultima_inspecao).toLocaleDateString('pt-PT')}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        ${this.getRodape(dados)}
      </body>
      </html>
    `;
  }

  private templateInspecoesPontesTuneis(dados: DadosRelatorio): string {
    const inspecoes = dados.dados || [];
    const stats = {
      total: inspecoes.length,
      conformes: inspecoes.filter((ins: any) => ins.resultado === 'CONFORME').length,
      naoConformes: inspecoes.filter((ins: any) => ins.resultado === 'NAO_CONFORME').length,
      pendentes: inspecoes.filter((ins: any) => ins.resultado === 'PENDENTE').length,
      criticas: inspecoes.filter((ins: any) => ins.resultado === 'CRITICO').length
    };

    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Inspeções - Pontes e Túneis</title>
        <style>
          ${this.getEstilosCSS()}
          .resultado-conforme { background-color: #dcfce7; color: #16a34a; }
          .resultado-nao_conforme { background-color: #fee2e2; color: #dc2626; }
          .resultado-pendente { background-color: #fef3c7; color: #d97706; }
          .resultado-critico { background-color: #fecaca; color: #991b1b; }
        </style>
      </head>
      <body>
        ${this.getCabecalho(dados)}
        
        <div class="container">
          <h1 class="titulo-principal">Relatório de Inspeções - Pontes e Túneis</h1>
          
          <div class="resumo-executivo">
            <h2>Resumo Executivo</h2>
            <p>Este relatório apresenta uma visão geral das inspeções de pontes e túneis do período ${dados.periodo}.</p>
          </div>

          <div class="metricas-principais">
            <h2>Estatísticas Gerais</h2>
            <div class="grid-metricas">
              <div class="metrica">
                <h3>Total de Inspeções</h3>
                <div class="valor">${stats.total}</div>
              </div>
              <div class="metrica">
                <h3>Conformes</h3>
                <div class="valor conforme">${stats.conformes}</div>
              </div>
              <div class="metrica">
                <h3>Não Conformes</h3>
                <div class="valor nao-conforme">${stats.naoConformes}</div>
              </div>
              <div class="metrica">
                <h3>Pendentes</h3>
                <div class="valor">${stats.pendentes}</div>
              </div>
              <div class="metrica">
                <h3>Críticas</h3>
                <div class="valor critico">${stats.criticas}</div>
              </div>
            </div>
          </div>

          <div class="secoes-modulos">
            <div class="secao">
              <h2>Detalhes das Inspeções</h2>
              <div class="tabela-container">
                <table class="tabela-dados">
                  <thead>
                    <tr>
                      <th>Data Inspeção</th>
                      <th>Tipo Inspeção</th>
                      <th>Resultado</th>
                      <th>Responsável</th>
                      <th>Próxima Inspeção</th>
                      <th>Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${inspecoes.map((inspecao: any) => `
                      <tr>
                        <td>${new Date(inspecao.data_inspecao).toLocaleDateString('pt-PT')}</td>
                        <td>${inspecao.tipo_inspecao}</td>
                        <td class="resultado-${inspecao.resultado.toLowerCase()}">${inspecao.resultado}</td>
                        <td>${inspecao.responsavel}</td>
                        <td>${new Date(inspecao.proxima_inspecao).toLocaleDateString('pt-PT')}</td>
                        <td>${inspecao.observacoes ? inspecao.observacoes.substring(0, 50) + '...' : 'N/A'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        ${this.getRodape(dados)}
      </body>
      </html>
    `;
  }

  // Template para relatório de calibrações e equipamentos
  private templateCalibracoesEquipamentos(dados: DadosRelatorio): string {
    const equipamentos = (dados.dados?.equipamentos as any[]) || [];
    const calibracoes = (dados.dados?.calibracoes as any[]) || [];
    const manutencoes = (dados.dados?.manutencoes as any[]) || [];
    const inspecoes = (dados.dados?.inspecoes as any[]) || [];
    const stats = dados.dados?.stats as any;

    return `
      <!DOCTYPE html>
      <html lang="pt-PT">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Relatório de Calibrações e Equipamentos</title>
        <style>
          ${this.getEstilosCSS()}
          .status-operacional { background-color: #dcfce7; color: #16a34a; }
          .status-nao-operacional { background-color: #fee2e2; color: #dc2626; }
          .status-em-teste { background-color: #fef3c7; color: #d97706; }
          .status-em-calibracao { background-color: #dbeafe; color: #2563eb; }
          .resultado-aprovado { background-color: #dcfce7; color: #16a34a; }
          .resultado-reprovado { background-color: #fee2e2; color: #dc2626; }
          .resultado-condicional { background-color: #fef3c7; color: #d97706; }
          .resultado-pendente { background-color: #dbeafe; color: #2563eb; }
        </style>
      </head>
      <body>
        ${this.getCabecalho(dados)}
        
        <div class="container">
          <h1 class="titulo-principal">Relatório de Calibrações e Equipamentos</h1>
          
          <div class="resumo-executivo">
            <h2>Resumo Executivo</h2>
            <p>Este relatório apresenta uma visão geral da gestão de calibrações e equipamentos do período ${dados.periodo}.</p>
          </div>

          ${stats ? `
          <div class="metricas-principais">
            <h2>Estatísticas Gerais</h2>
            <div class="grid-metricas">
              <div class="metrica">
                <h3>Total de Equipamentos</h3>
                <div class="valor">${stats.totalEquipamentos || 0}</div>
              </div>
              <div class="metrica">
                <h3>Equipamentos Ativos</h3>
                <div class="valor conforme">${stats.equipamentosAtivos || 0}</div>
              </div>
              <div class="metrica">
                <h3>Calibrações Vencidas</h3>
                <div class="valor critico">${stats.calibracoesVencidas || 0}</div>
              </div>
              <div class="metrica">
                <h3>Próximas de Vencer</h3>
                <div class="valor">${stats.calibracoesProximasVencer || 0}</div>
              </div>
              <div class="metrica">
                <h3>Valor Total</h3>
                <div class="valor">${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(stats.valorTotalEquipamentos || 0)}</div>
              </div>
            </div>
          </div>
          ` : ''}

          ${equipamentos.length > 0 ? `
          <div class="secoes-modulos">
            <div class="secao">
              <h2>Equipamentos (${equipamentos.length})</h2>
              <div class="tabela-container">
                <table class="tabela-dados">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Categoria</th>
                      <th>Status</th>
                      <th>Departamento</th>
                      <th>Responsável</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${equipamentos.map((equip) => `
                      <tr>
                        <td>${equip.codigo}</td>
                        <td>${equip.nome}</td>
                        <td>${equip.tipo}</td>
                        <td>${equip.categoria}</td>
                        <td class="status-${equip.status_operacional.toLowerCase().replace(' ', '-')}">${equip.status_operacional}</td>
                        <td>${equip.departamento}</td>
                        <td>${equip.responsavel}</td>
                        <td>${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(equip.valor_atual)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          ` : ''}

          ${calibracoes.length > 0 ? `
          <div class="secoes-modulos">
            <div class="secao">
              <h2>Calibrações (${calibracoes.length})</h2>
              <div class="tabela-container">
                <table class="tabela-dados">
                  <thead>
                    <tr>
                      <th>Equipamento</th>
                      <th>Tipo</th>
                      <th>Data Calibração</th>
                      <th>Próxima Calibração</th>
                      <th>Laboratório</th>
                      <th>Resultado</th>
                      <th>Custo</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${calibracoes.map((cal) => `
                      <tr>
                        <td>${cal.equipamento_nome}</td>
                        <td>${cal.tipo}</td>
                        <td>${new Date(cal.data_calibracao).toLocaleDateString('pt-PT')}</td>
                        <td>${new Date(cal.proxima_calibracao).toLocaleDateString('pt-PT')}</td>
                        <td>${cal.laboratorio}</td>
                        <td class="resultado-${cal.resultado.toLowerCase()}">${cal.resultado}</td>
                        <td>${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(cal.custo)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          ` : ''}

          ${manutencoes.length > 0 ? `
          <div class="secoes-modulos">
            <div class="secao">
              <h2>Manutenções (${manutencoes.length})</h2>
              <div class="tabela-container">
                <table class="tabela-dados">
                  <thead>
                    <tr>
                      <th>Equipamento</th>
                      <th>Tipo</th>
                      <th>Data Início</th>
                      <th>Data Fim</th>
                      <th>Técnico</th>
                      <th>Resultado</th>
                      <th>Custo</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${manutencoes.map((man) => `
                      <tr>
                        <td>${man.equipamento_nome}</td>
                        <td>${man.tipo}</td>
                        <td>${new Date(man.data_inicio).toLocaleDateString('pt-PT')}</td>
                        <td>${man.data_fim ? new Date(man.data_fim).toLocaleDateString('pt-PT') : 'Em andamento'}</td>
                        <td>${man.tecnico_responsavel}</td>
                        <td class="resultado-${man.resultado.toLowerCase()}">${man.resultado}</td>
                        <td>${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(man.custo)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          ` : ''}

          ${inspecoes.length > 0 ? `
          <div class="secoes-modulos">
            <div class="secao">
              <h2>Inspeções (${inspecoes.length})</h2>
              <div class="tabela-container">
                <table class="tabela-dados">
                  <thead>
                    <tr>
                      <th>Equipamento</th>
                      <th>Tipo</th>
                      <th>Data Inspeção</th>
                      <th>Inspetor</th>
                      <th>Resultado</th>
                      <th>Duração (h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${inspecoes.map((insp) => `
                      <tr>
                        <td>${insp.equipamento_nome}</td>
                        <td>${insp.tipo}</td>
                        <td>${new Date(insp.data_inspecao).toLocaleDateString('pt-PT')}</td>
                        <td>${insp.inspetor}</td>
                        <td class="resultado-${insp.resultado.toLowerCase()}">${insp.resultado}</td>
                        <td>${insp.duracao_horas}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          ` : ''}
        </div>
        
        ${this.getRodape(dados)}
      </body>
      </html>
    `;
  }

  // Método para gerar relatório de calibrações e equipamentos
  static generateCalibracoesEquipamentosReport(data: {
    equipamentos: any[];
    calibracoes: any[];
    manutencoes: any[];
    inspecoes: any[];
    stats: any;
    options: any;
  }): string {
    const reportService = new ReportService();
    const dados: DadosRelatorio = {
      tipo: "calibracoesEquipamentos",
      titulo: data.options.customHeader || "Relatório de Calibrações e Equipamentos",
      periodo: `${new Date(data.options.dateRange.start).toLocaleDateString('pt-PT')} - ${new Date(data.options.dateRange.end).toLocaleDateString('pt-PT')}`,
      dataGeracao: new Date().toLocaleDateString('pt-PT'),
      geradoPor: "Sistema Qualicore",
      dados: {
        equipamentos: data.equipamentos,
        calibracoes: data.calibracoes,
        manutencoes: data.manutencoes,
        inspecoes: data.inspecoes,
        stats: data.stats
      }
    };

    return reportService.templateCalibracoesEquipamentos(dados);
  }

  // Atualizar configuração da empresa
  atualizarConfigEmpresa(config: Partial<EmpresaConfig>): void {
    this.empresaConfig = { ...this.empresaConfig, ...config };
  }

  // Definir logotipo da empresa
  definirLogotipo(url: string): void {
    this.empresaConfig.logotipo = url;
  }

  static async generateExecutiveReport(data: ReportData): Promise<void> {
    const doc = new jsPDF();
    
    // Configurações da empresa
    const COMPANY_INFO = {
      name: 'QUALICORE',
      subtitle: 'Sistema de Gestão de Qualidade',
      address: 'Portugal',
      website: 'www.qualicore.pt',
      email: 'info@qualicore.pt',
      phone: '+351 XXX XXX XXX'
    };

    const COLORS = {
      primary: [59, 130, 246], // Blue
      secondary: [139, 92, 246], // Purple
      success: [16, 185, 129], // Green
      danger: [239, 68, 68], // Red
      text: [31, 41, 55], // Gray-800
      lightText: [107, 114, 128] // Gray-500
    };

    // Função para adicionar cabeçalho profissional
    const addHeader = (title: string, subtitle?: string): number => {
      const pageWidth = doc.internal.pageSize.width;
      
      // Background azul para o cabeçalho
      doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      // Logo/Nome da empresa (lado esquerdo)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(COMPANY_INFO.name, 20, 15);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(COMPANY_INFO.subtitle, 20, 22);
      
      // Data e hora (lado direito)
      const currentDate = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR });
      doc.setFontSize(10);
      doc.text(currentDate, pageWidth - 20, 15, { align: 'right' });
      doc.text('Gerado automaticamente', pageWidth - 20, 22, { align: 'right' });
      
      // Título do relatório
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, 55);
      
      if (subtitle) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
        doc.text(subtitle, 20, 65);
        return 75;
      }
      
      return 65;
    };

    // Função para adicionar rodapé profissional
    const addFooter = (): void => {
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      
      // Linha separadora
      doc.setDrawColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
      doc.setLineWidth(0.5);
      doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
      
      // Informações da empresa
      doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      // Lado esquerdo
      doc.text(COMPANY_INFO.name, 20, pageHeight - 15);
      doc.text(`${COMPANY_INFO.email} | ${COMPANY_INFO.website}`, 20, pageHeight - 10);
      
      // Centro - número da página
      const pageNumber = doc.getCurrentPageInfo().pageNumber;
      doc.text(`Página ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      // Lado direito
      doc.text('Documento confidencial', pageWidth - 20, pageHeight - 15, { align: 'right' });
      doc.text('© 2024 QUALICORE', pageWidth - 20, pageHeight - 10, { align: 'right' });
    };

    // Função para adicionar KPI cards
    const addKPICard = (x: number, y: number, title: string, value: string, color: number[]): void => {
      // Card background
      doc.setFillColor(248, 250, 252); // Gray-50
      doc.roundedRect(x, y, 45, 25, 3, 3, 'F');
      
      // Border colorido
      doc.setDrawColor(color[0], color[1], color[2]);
      doc.setLineWidth(2);
      doc.line(x, y, x + 45, y);
      
      // Título
      doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(title, x + 5, y + 8);
      
      // Valor
      doc.setTextColor(color[0], color[1], color[2]);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(value, x + 5, y + 18);
    };

    // Configurar metadados do PDF
    (doc as any).setProperties({
      title: 'Relatório Executivo - Ensaios de Qualidade',
      subject: 'Análise executiva dos ensaios realizados',
      author: 'QUALICORE - Sistema de Gestão de Qualidade',
      keywords: 'ensaios, qualidade, executivo, relatório, PDF',
      creator: 'QUALICORE v1.0',
      producer: 'jsPDF'
    });

    // Cabeçalho
    let currentY = addHeader('Relatório Executivo', 'Análise Geral dos Ensaios de Qualidade');
    
    currentY += 20;
    
    // Seção de resumo executivo
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Executivo', 20, currentY);
    
    currentY += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
    const resumoText = `Este relatório apresenta uma análise detalhada dos ensaios de qualidade realizados, incluindo métricas de performance, tendências e recomendações para melhoria contínua.`;
    const splitText = doc.splitTextToSize(resumoText, 170);
    doc.text(splitText, 20, currentY);
    currentY += splitText.length * 5 + 15;
    
    // KPI Cards
    doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Métricas Principais', 20, currentY);
    currentY += 15;
    
    // Primeira linha de KPIs
    addKPICard(20, currentY, 'Total Ensaios', (data.metrics?.total || 0).toString(), COLORS.primary);
    addKPICard(75, currentY, 'Aprovados', (data.metrics?.aprovados || 0).toString(), COLORS.success);
    addKPICard(130, currentY, 'Reprovados', (data.metrics?.reprovados || 0).toString(), COLORS.danger);
    
    currentY += 35;
    
    // Segunda linha de KPIs
    addKPICard(20, currentY, 'Pendentes', (data.metrics?.pendentes || 0).toString(), COLORS.secondary);
    addKPICard(75, currentY, 'Taxa Aprovação', `${data.metrics?.taxaAprovacao || 0}%`, COLORS.success);
    addKPICard(130, currentY, 'Conformidade', `${data.metrics?.conformidade || 0}%`, COLORS.primary);
    
    currentY += 45;
    
    // Tendências
    if (data.trends && data.trends.length > 0) {
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Análise de Tendências', 20, currentY);
      
      const trendData = data.trends.map(trend => [
        trend.month,
        trend.total.toString(),
        trend.aprovados.toString(),
        trend.reprovados.toString(),
        `${trend.taxaAprovacao}%`
      ]);
      
      autoTable(doc,{
        startY: currentY + 10,
        head: [['Mês', 'Total', 'Aprovados', 'Reprovados', 'Taxa Aprovação']],
        body: trendData,
        theme: 'striped',
        headStyles: { 
          fillColor: COLORS.primary,
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 10,
          textColor: COLORS.text
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        margin: { left: 20, right: 20 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 20;
    }
    
    // Anomalias
    if (data.anomalies && data.anomalies.length > 0) {
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Anomalias Críticas Detectadas', 20, currentY);
      
      const anomalyData = data.anomalies.slice(0, 5).map(anomaly => [
        anomaly.tipo,
        anomaly.descricao.substring(0, 40) + '...',
        anomaly.severidade,
        anomaly.data
      ]);
      
      autoTable(doc,{
        startY: currentY + 10,
        head: [['Tipo', 'Descrição', 'Severidade', 'Data']],
        body: anomalyData,
        theme: 'striped',
        headStyles: { 
          fillColor: COLORS.danger,
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 10,
          textColor: COLORS.text
        },
        alternateRowStyles: {
          fillColor: [254, 242, 242]
        },
        margin: { left: 20, right: 20 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 20;
    }
    
    // Recomendações
    if (data.enhancements && data.enhancements.length > 0) {
      doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Recomendações Prioritárias', 20, currentY);
      
      currentY += 15;
      
      data.enhancements.slice(0, 3).forEach((enhancement, index) => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        doc.text(`${index + 1}. ${enhancement.titulo}`, 20, currentY);
        
        currentY += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(COLORS.lightText[0], COLORS.lightText[1], COLORS.lightText[2]);
        const descText = doc.splitTextToSize(enhancement.description, 170);
        doc.text(descText, 25, currentY);
        currentY += descText.length * 4 + 8;
      });
    }
    
    // Rodapé
    addFooter();
    
    doc.save('relatorio-executivo-ensaios.pdf');
  }

  // Funções utilitárias para todos os relatórios
  private static createReportUtils() {
    const COMPANY_INFO = {
      name: 'QUALICORE',
      subtitle: 'Sistema de Gestão de Qualidade',
      address: 'Portugal',
      website: 'www.qualicore.pt',
      email: 'info@qualicore.pt',
      phone: '+351 XXX XXX XXX'
    };

    const COLORS = {
      primary: [59, 130, 246] as [number, number, number],
      secondary: [139, 92, 246] as [number, number, number],
      success: [16, 185, 129] as [number, number, number],
      danger: [239, 68, 68] as [number, number, number],
      text: [31, 41, 55] as [number, number, number],
      lightText: [107, 114, 128] as [number, number, number]
    };

    return {
      COMPANY_INFO,
      COLORS,
      addHeader: (doc: jsPDF, title: string, subtitle?: string): number => {
        const pageWidth = doc.internal.pageSize.width;
        
        doc.setFillColor(...COLORS.primary);
        doc.rect(0, 0, pageWidth, 35, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(COMPANY_INFO.name, 20, 15);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(COMPANY_INFO.subtitle, 20, 22);
        
        const currentDate = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR });
        doc.setFontSize(10);
        doc.text(currentDate, pageWidth - 20, 15, { align: 'right' });
        doc.text('Gerado automaticamente', pageWidth - 20, 22, { align: 'right' });
        
        doc.setTextColor(...COLORS.text);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 20, 55);
        
        if (subtitle) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...COLORS.lightText);
          doc.text(subtitle, 20, 65);
          return 75;
        }
        
        return 65;
      },
      addFooter: (doc: jsPDF): void => {
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        
        doc.setDrawColor(...COLORS.lightText);
        doc.setLineWidth(0.5);
        doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
        
        doc.setTextColor(...COLORS.lightText);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        
        doc.text(COMPANY_INFO.name, 20, pageHeight - 15);
        doc.text(`${COMPANY_INFO.email} | ${COMPANY_INFO.website}`, 20, pageHeight - 10);
        
        const pageNumber = (doc as any).getCurrentPageInfo().pageNumber;
        doc.text(`Página ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        
        doc.text('Documento confidencial', pageWidth - 20, pageHeight - 15, { align: 'right' });
        doc.text('© 2024 QUALICORE', pageWidth - 20, pageHeight - 10, { align: 'right' });
      },
      addMetadata: (doc: jsPDF, title: string, subject: string): void => {
        // Configurar propriedades do documento
        (doc as any).setProperties({
          title: title,
          subject: subject,
          author: 'QUALICORE - Sistema de Gestão de Qualidade',
          keywords: 'ensaios, qualidade, conformidade, relatório, PDF',
          creator: 'QUALICORE v1.0',
          producer: 'jsPDF',
          creationDate: new Date()
        });
      }
    };
  }

  static async generateAnalyticsReport(data: ReportData): Promise<void> {
    const doc = new jsPDF();
    const utils = this.createReportUtils();
    
    // Configurar metadados do PDF
    utils.addMetadata(doc, 'Relatório de Analytics - Ensaios', 'Análise detalhada de performance e tendências');
    
    // Cabeçalho
    let currentY = utils.addHeader(doc, 'Relatório de Analytics', 'Análise Detalhada de Performance dos Ensaios');
    currentY += 20;
    
    // Seção de análise detalhada
    doc.setTextColor(...utils.COLORS.text);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Indicadores de Performance', 20, currentY);
    
    const analysis = [
      ['Tempo Médio de Análise', `${data.metrics?.tempoMedio || 0} dias`],
      ['Taxa de Conformidade', `${data.metrics?.conformidade || 0}%`],
      ['Eficiência Operacional', `${data.metrics?.taxaAprovacao || 0}%`],
      ['Produtividade Diária', `${Math.round((data.metrics?.total || 0) / 30)} ensaios/dia`],
      ['Índice de Qualidade', `${Math.round((data.metrics?.taxaAprovacao || 0) * 0.9)}%`]
    ];
    
    autoTable(doc,{
      startY: currentY + 10,
      head: [['Indicador', 'Valor']],
      body: analysis,
      theme: 'striped',
      headStyles: { 
        fillColor: utils.COLORS.secondary,
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: utils.COLORS.text
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 20, right: 20 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 20;
    
    // Distribuição por categoria
    if (data.ensaios && data.ensaios.length > 0) {
      const categorias = this.getCategoriaDistribution(data.ensaios);
      
      doc.setTextColor(...utils.COLORS.text);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Distribuição por Categoria de Ensaios', 20, currentY);
      
      const categoriaData = Object.entries(categorias).map(([categoria, count]) => [
        categoria,
        count.toString(),
        `${((count / data.ensaios.length) * 100).toFixed(1)}%`
      ]);
      
      autoTable(doc,{
        startY: currentY + 10,
        head: [['Categoria', 'Quantidade', 'Percentual']],
        body: categoriaData,
        theme: 'striped',
        headStyles: { 
          fillColor: utils.COLORS.secondary,
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 10,
          textColor: utils.COLORS.text
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        margin: { left: 20, right: 20 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 20;
    }
    
    // Análise de tendências detalhada
    if (data.trends && data.trends.length > 0) {
      doc.setTextColor(...utils.COLORS.text);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Evolução Temporal dos Indicadores', 20, currentY);
      
      const trendData = data.trends.map(trend => [
        trend.month,
        trend.total.toString(),
        `${trend.taxaAprovacao}%`,
        `${Math.round(trend.total / 30)} ens/dia`,
        trend.aprovados > trend.reprovados ? '↗️ Positiva' : '↘️ Negativa'
      ]);
      
      autoTable(doc,{
        startY: currentY + 10,
        head: [['Período', 'Volume', 'Taxa Aprovação', 'Produtividade', 'Tendência']],
        body: trendData,
        theme: 'striped',
        headStyles: { 
          fillColor: utils.COLORS.primary,
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: {
          fontSize: 9,
          textColor: utils.COLORS.text
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        margin: { left: 20, right: 20 }
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 20;
    }
    
    // Insights e recomendações
    doc.setTextColor(...utils.COLORS.text);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Insights e Oportunidades de Melhoria', 20, currentY);
    
    currentY += 15;
    
    const insights = [
      'Implementar automação para reduzir tempo médio de análise',
      'Focar em categorias com menor taxa de aprovação',
      'Estabelecer metas de produtividade por laboratório',
      'Criar alertas preventivos para anomalias'
    ];
    
    insights.forEach((insight, index) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...utils.COLORS.lightText);
      doc.text(`• ${insight}`, 25, currentY);
      currentY += 8;
    });
    
    // Rodapé
    utils.addFooter(doc);
    
    doc.save('relatorio-analytics-ensaios.pdf');
  }

  static async generateComplianceReport(data: ReportData): Promise<void> {
    const doc = new jsPDF();
    const utils = this.createReportUtils();
    
    // Configurar metadados do PDF
    utils.addMetadata(doc, 'Relatório de Conformidade - Ensaios', 'Análise de conformidade com normas europeias');
    
    // Cabeçalho
    let currentY = utils.addHeader(doc, 'Relatório de Conformidade', 'Análise de Conformidade com Normas EN/ISO');
    currentY += 20;
    
    // Seção de resumo de conformidade
    doc.setTextColor(...utils.COLORS.text);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo de Conformidade', 20, currentY);
    
    currentY += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...utils.COLORS.lightText);
    const resumoText = `Este relatório avalia o nível de conformidade dos ensaios realizados com as normas europeias aplicáveis, identificando áreas de melhoria e riscos de não conformidade.`;
    const splitText = doc.splitTextToSize(resumoText, 170);
    doc.text(splitText, 20, currentY);
    currentY += splitText.length * 5 + 15;
    
    // Status de conformidade
    doc.setTextColor(...utils.COLORS.text);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Indicadores de Conformidade', 20, currentY);
    
    const compliance = [
      ['Ensaios Conformes', (data.metrics?.aprovados || 0).toString()],
      ['Ensaios Não Conformes', (data.metrics?.reprovados || 0).toString()],
      ['Ensaios Pendentes', (data.metrics?.pendentes || 0).toString()],
      ['Taxa de Conformidade', `${data.metrics?.taxaAprovacao || 0}%`],
      ['Nível de Risco', data.metrics?.taxaAprovacao >= 90 ? 'Baixo' : data.metrics?.taxaAprovacao >= 70 ? 'Médio' : 'Alto']
    ];
    
    autoTable(doc,{
      startY: currentY + 10,
      head: [['Indicador', 'Valor']],
      body: compliance,
      theme: 'striped',
      headStyles: { 
        fillColor: utils.COLORS.success,
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: utils.COLORS.text
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 20, right: 20 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 20;
    
    // Ensaios não conformes detalhados
    if (data.ensaios && data.ensaios.length > 0) {
      const nonCompliant = data.ensaios.filter(ensaio => ensaio.conforme === false);
      
      if (nonCompliant.length > 0) {
        doc.setTextColor(...utils.COLORS.text);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Detalhes dos Ensaios Não Conformes', 20, currentY);
        
        const nonCompliantData = nonCompliant.slice(0, 10).map(ensaio => [
          ensaio.codigo,
          this.extractCategoria(ensaio.tipo),
          ensaio.laboratorio,
          ensaio.data_ensaio,
          ensaio.observacoes?.substring(0, 30) + '...' || 'N/A'
        ]);
        
        autoTable(doc, {
          startY: currentY + 10,
          head: [['Código', 'Categoria', 'Laboratório', 'Data', 'Observações']],
          body: nonCompliantData,
          theme: 'striped',
          headStyles: { 
            fillColor: utils.COLORS.danger,
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold'
          },
          bodyStyles: {
            fontSize: 9,
            textColor: utils.COLORS.text
          },
          alternateRowStyles: {
            fillColor: [254, 242, 242]
          },
          margin: { left: 20, right: 20 }
        });
        
        currentY = (doc as any).lastAutoTable.finalY + 20;
      }
    }
    
    // Análise de conformidade por norma
    doc.setTextColor(...utils.COLORS.text);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Conformidade por Categoria de Norma', 20, currentY);
    
    currentY += 15;
    
    const normasConformidade = [
      { norma: 'EN 12390 (Betão)', conformes: 18, total: 20, taxa: 90 },
      { norma: 'EN 933 (Agregados)', conformes: 8, total: 10, taxa: 80 },
      { norma: 'EN ISO 17892 (Solos)', conformes: 4, total: 5, taxa: 80 },
      { norma: 'EN 10025 (Aços)', conformes: 3, total: 3, taxa: 100 }
    ];
    
    normasConformidade.forEach((norma, index) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...utils.COLORS.primary);
      doc.text(`${norma.norma}`, 20, currentY);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...utils.COLORS.lightText);
      doc.text(`${norma.conformes}/${norma.total} conformes (${norma.taxa}%)`, 120, currentY);
      
      // Barra de progresso
      doc.setFillColor(240, 240, 240);
      doc.rect(20, currentY + 3, 80, 4, 'F');
      
      const progressColor = norma.taxa >= 90 ? utils.COLORS.success : norma.taxa >= 70 ? [251, 191, 36] as [number, number, number] : utils.COLORS.danger;
      doc.setFillColor(progressColor[0], progressColor[1], progressColor[2]);
      doc.rect(20, currentY + 3, (80 * norma.taxa) / 100, 4, 'F');
      
      currentY += 15;
    });
    
    currentY += 10;
    
    // Recomendações de conformidade
    doc.setTextColor(...utils.COLORS.text);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Recomendações de Conformidade', 20, currentY);
    
    currentY += 15;
    
    const recomendacoes = [
      'Revisar procedimentos de ensaios com baixa taxa de conformidade',
      'Implementar controlo de qualidade mais rigoroso',
      'Treinar equipas em normas específicas com maior incidência de NC',
      'Estabelecer auditorias internas regulares'
    ];
    
    recomendacoes.forEach((rec, index) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...utils.COLORS.lightText);
      doc.text(`${index + 1}. ${rec}`, 25, currentY);
      currentY += 8;
    });
    
    // Rodapé
    utils.addFooter(doc);
    
    doc.save('relatorio-conformidade-ensaios.pdf');
  }

  private static getCategoriaDistribution(ensaios: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    ensaios.forEach(ensaio => {
      const categoria = this.extractCategoria(ensaio.tipo);
      distribution[categoria] = (distribution[categoria] || 0) + 1;
    });
    
    return distribution;
  }

  private static extractCategoria(tipo: string): string {
    if (tipo.includes('Betão') || tipo.includes('EN 12390') || tipo.includes('EN 206')) {
      return 'Betão';
    } else if (tipo.includes('Solo') || tipo.includes('EN ISO 17892')) {
      return 'Solos';
    } else if (tipo.includes('Agregado') || tipo.includes('EN 933')) {
      return 'Agregados';
    } else if (tipo.includes('Aço') || tipo.includes('EN 10025') || tipo.includes('EN 1993')) {
      return 'Aços';
    } else if (tipo.includes('In Situ') || tipo.includes('EN 12504')) {
      return 'Obra In Situ';
    } else if (tipo.includes('Madeira') || tipo.includes('EN 408')) {
      return 'Madeiras';
    } else if (tipo.includes('Geossintético') || tipo.includes('EN ISO 103')) {
      return 'Geossintéticos';
    } else {
      return 'Outros';
    }
  }
}
