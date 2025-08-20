import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Building,
  CheckCircle,
  X,
  TrendingUp,
  Filter,
  Calendar,
  XCircle,
  FileText,
  Share2,
  Cloud,
  Download,
  Eye,
  Printer,
  Building2,
  DollarSign,
  Edit3,
  ArrowUpRight,
  BarChart3,
  AlertTriangle,
  Leaf,
} from "lucide-react";
import toast from "react-hot-toast";
import ObraForm from "@/components/forms/ObraForm";
import RelatorioObrasPremium from "@/components/RelatorioObrasPremium";
import { ShareObraModal } from "@/components/ShareObraModal";
import { SavedObrasViewer } from "@/components/SavedObrasViewer";
import ObraDashboard from "@/components/ObraDashboard";
import CronogramaObra from "@/components/obras/CronogramaObra";
import GestaoRiscos from "@/components/obras/GestaoRiscos";
import GestaoSubempreiteiros from "@/components/obras/GestaoSubempreiteiros";
import MetricasEVMComponent from "@/components/obras/MetricasEVM";
import DocumentacaoObraComponent from "@/components/obras/DocumentacaoObra";
import GestaoFinanceira from "@/components/obras/GestaoFinanceira";
import QualidadeSeguranca from "@/components/obras/QualidadeSeguranca";
import GestaoAmbiental from "@/components/obras/GestaoAmbiental";
import { obrasAPI } from "@/lib/supabase-api";
import { PDFService } from "@/services/pdfService";
import { ShareService } from "@/services/shareService";
import { Link } from "react-router-dom";

// Dados mock iniciais para demonstração - TOTALMENTE EDITÁVEIS
const mockObras: any[] = [
  {
    id: "1",
    codigo: "OBR-2024-001",
    nome: "Edifício Residencial Solar",
    cliente: "Construtora ABC",
    localizacao: "Lisboa, Portugal",
    data_inicio: "2024-01-15",
    data_fim_prevista: "2024-12-31",
    valor_contrato: 2500000,
    valor_executado: 1250000,
    percentual_execucao: 50,
    status: "em_execucao",
    tipo_obra: "residencial",
    categoria: "grande",
    responsavel_tecnico: "Eng. João Silva",
    coordenador_obra: "Eng. Maria Santos",
    fiscal_obra: "Eng. Carlos Mendes",
    engenheiro_responsavel: "Eng. Ana Costa",
    arquiteto: "Arq. Pedro Alves",
    zonas: ["Zona A - Fundações", "Zona B - Estrutura", "Zona C - Acabamentos"],
    fases: ["Fase 1 - Fundações", "Fase 2 - Estrutura", "Fase 3 - Acabamentos"],
    equipas: ["Equipa A - Fundações", "Equipa B - Estrutura", "Equipa C - Acabamentos"],
    fornecedores_principais: ["Fornecedor A", "Fornecedor B", "Fornecedor C"],
    riscos: [
      {
        id: "1",
        descricao: "Atraso na entrega de materiais",
        probabilidade: "alta",
        impacto: "critico",
        categoria: "fornecimento",
        status: "ativo",
        data_identificacao: "2024-01-20",
        responsavel: "Eng. João Silva"
      },
      {
        id: "2", 
        descricao: "Condições meteorológicas adversas",
        probabilidade: "media",
        impacto: "moderado",
        categoria: "ambiental",
        status: "monitorizado",
        data_identificacao: "2024-01-25",
        responsavel: "Eng. Maria Santos"
      }
    ],
    indicadores: [
      {
        id: "1",
        nome: "Progresso Físico",
        valor: 50,
        unidade: "%",
        data_medicao: "2024-03-15",
        meta: 60
      },
      {
        id: "2",
        nome: "Custo por m²",
        valor: 1200,
        unidade: "€/m²",
        data_medicao: "2024-03-15",
        meta: 1100
      }
    ],
    milestones: [
      {
        id: "1",
        titulo: "Conclusão das Fundações",
        descricao: "Finalização de todas as fundações da obra",
        data_prevista: "2024-03-31",
        data_real: "2024-03-28",
        status: "concluida",
        importancia: "critica",
        responsavel: "Eng. João Silva",
        percentual_conclusao: 100
      },
      {
        id: "2",
        titulo: "Início da Estrutura",
        descricao: "Começo da construção da estrutura em betão",
        data_prevista: "2024-04-15",
        data_real: null,
        status: "pendente",
        importancia: "alta",
        responsavel: "Eng. Maria Santos",
        percentual_conclusao: 0
      }
    ],
    dependencias_externas: [
      {
        id: "1",
        descricao: "Aprovação da Câmara Municipal",
        tipo: "licenciamento",
        status: "concluida",
        data_prevista: "2024-01-10",
        data_real: "2024-01-08",
        responsavel: "Arq. Pedro Alves"
      },
      {
        id: "2",
        descricao: "Ligação de Energia Elétrica",
        tipo: "infraestrutura",
        status: "pendente",
        data_prevista: "2024-04-30",
        data_real: null,
        responsavel: "Eng. Carlos Mendes"
      }
    ],
    subempreiteiros: [
      {
        id: "1",
        nome: "Subempreiteiro A - Fundações",
        especialidade: "Fundações",
        valor_contrato: 300000,
        data_inicio: "2024-01-20",
        data_fim: "2024-03-31",
        status: "concluido",
        responsavel: "Eng. João Silva"
      },
      {
        id: "2",
        nome: "Subempreiteiro B - Estrutura",
        especialidade: "Estruturas",
        valor_contrato: 800000,
        data_inicio: "2024-04-01",
        data_fim: "2024-08-31",
        status: "ativo",
        responsavel: "Eng. Maria Santos"
      }
    ],
    metricas_evm: {
      id: "1",
      pv: 1250000,
      ev: 1250000,
      ac: 1200000,
      bac: 2500000,
      spi: 1.0,
      cpi: 1.04,
      sv: 0,
      cv: 50000,
      eac: 2403846,
      etc: 1153846,
      vac: 96154,
      data_criacao: "2024-01-15T09:00:00Z",
      data_atualizacao: "2024-03-15T10:00:00Z"
    },
    indicadores_performance: [
      {
        id: "1",
        nome: "Eficiência de Custos",
        valor: 104,
        unidade: "%",
        data_medicao: "2024-03-15",
        meta: 100,
        categoria: "financeiro"
      },
      {
        id: "2",
        nome: "Eficiência de Cronograma",
        valor: 100,
        unidade: "%",
        data_medicao: "2024-03-15",
        meta: 100,
        categoria: "tempo"
      }
    ],
    documentacao: {
      id: "1",
      versao: "1.0",
      responsavel: "Eng. João Silva",
      data_criacao: "2024-01-15T09:00:00Z",
      data_revisao: "2024-03-15T10:00:00Z",
      categorias: ["Projeto", "Execução", "Qualidade", "Segurança"],
      templates: ["Relatório Semanal", "Relatório Mensal", "Relatório de Qualidade"],
      procedimentos_aprovacao: ["Aprovação Técnica", "Aprovação Financeira", "Aprovação Cliente"]
    },
    licencas_autorizacoes: [
      {
        id: "1",
        tipo: "Licença de Construção",
        numero: "LC-2024-001",
        emissor: "Câmara Municipal de Lisboa",
        data_emissao: "2024-01-08",
        data_validade: "2025-01-08",
        status: "ativa",
        responsavel: "Arq. Pedro Alves"
      }
    ],
    certificacoes_obrigatorias: [
      {
        id: "1",
        nome: "Certificação ISO 9001",
        emissor: "SGS",
        data_emissao: "2024-02-15",
        data_validade: "2027-02-15",
        status: "ativa",
        responsavel: "Eng. Ana Costa"
      }
    ],
    gestao_financeira: {
      id: "1",
      orcamento_total: 2500000,
      valor_executado: 1250000,
      valor_pendente: 1250000,
      fluxo_caixa: [
        { mes: "Janeiro", entrada: 0, saida: 200000, saldo: -200000 },
        { mes: "Fevereiro", entrada: 300000, saida: 400000, saldo: -300000 },
        { mes: "Março", entrada: 500000, saida: 300000, saldo: -100000 }
      ],
      indicadores_financeiros: [
        { nome: "Margem de Lucro", valor: 15, unidade: "%" },
        { nome: "ROI", valor: 12, unidade: "%" }
      ],
      data_criacao: "2024-01-15T09:00:00Z",
      data_atualizacao: "2024-03-15T10:00:00Z"
    },
    orcamentos_detalhados: [
      {
        id: "1",
        categoria: "Fundações",
        valor_orcamentado: 300000,
        valor_executado: 280000,
        percentual_execucao: 93,
        responsavel: "Eng. João Silva"
      },
      {
        id: "2",
        categoria: "Estrutura",
        valor_orcamentado: 800000,
        valor_executado: 400000,
        percentual_execucao: 50,
        responsavel: "Eng. Maria Santos"
      }
    ],
    controlo_custos: [
      {
        id: "1",
        categoria: "Materiais",
        valor_orcamentado: 500000,
        valor_real: 480000,
        variacao: -20000,
        percentual_variacao: -4,
        data_medicao: "2024-03-15"
      }
    ],
    plano_qualidade: {
      id: "1",
      versao: "1.0",
      responsavel: "Eng. Ana Costa",
      data_criacao: "2024-01-15T09:00:00Z",
      data_revisao: "2024-03-15T10:00:00Z",
      objetivos_qualidade: ["Cumprir especificações técnicas", "Satisfazer requisitos do cliente"],
      procedimentos_qualidade: ["Inspeção de receção", "Controle de qualidade"]
    },
    plano_seguranca: {
      id: "1",
      versao: "1.0",
      responsavel: "Eng. Carlos Mendes",
      data_criacao: "2024-01-15T09:00:00Z",
      data_revisao: "2024-03-15T10:00:00Z",
      equipamentos_protecao: ["Capacetes", "Coletes", "Botas de segurança"],
      procedimentos_seguranca: ["Formação de segurança", "Inspeções diárias"]
    },
    inspecoes_qualidade: [
      {
        id: "1",
        tipo: "Inspeção de Receção",
        data: "2024-03-10",
        responsavel: "Eng. Ana Costa",
        resultado: "Aprovado",
        observacoes: "Materiais conforme especificação"
      }
    ],
    acidentes_incidentes: [
      {
        id: "1",
        tipo: "Incidente",
        descricao: "Queda de ferramenta",
        data: "2024-02-15",
        gravidade: "leve",
        status: "resolvido",
        responsavel: "Eng. Carlos Mendes"
      }
    ],
    gestao_ambiental: {
      id: "1",
      versao_plano: "1.0",
      responsavel_ambiental: "Eng. Ana Costa",
      data_criacao: "2024-01-15T09:00:00Z",
      data_revisao_plano: "2024-03-15T10:00:00Z",
      objetivos_ambientais: ["Reduzir resíduos", "Minimizar impacto ambiental"],
      impactos_ambientais: ["Geração de resíduos", "Consumo de energia"],
      medidas_mitigacao: ["Reciclagem", "Eficiência energética"],
      recursos_ambientais: ["Contentores de reciclagem", "Sistema de iluminação LED"],
      monitorizacao_ambiental: ["Controlo de resíduos", "Monitorização de energia"]
    },
    certificacoes_ambientais: [
      {
        id: "1",
        nome: "Certificação ISO 14001",
        emissor: "SGS",
        data_emissao: "2024-02-20",
        data_validade: "2027-02-20",
        status: "ativa",
        responsavel: "Eng. Ana Costa"
      }
    ],
    responsavel: "Eng. João Silva",
    zona: "Lisboa",
    estado: "em_analise",
    data_criacao: "2024-01-15T09:00:00Z",
    data_atualizacao: "2024-01-15T09:00:00Z",
  },
  {
    id: "2",
    codigo: "OBR-2024-002",
    nome: "Centro Comercial Plaza",
    cliente: "Desenvolvimento XYZ",
    localizacao: "Porto, Portugal",
    data_inicio: "2024-02-01",
    data_fim_prevista: "2025-06-30",
    valor_contrato: 5000000,
    valor_executado: 750000,
    percentual_execucao: 15,
    status: "em_execucao",
    tipo_obra: "comercial",
    categoria: "mega",
    responsavel_tecnico: "Eng. Sofia Martins",
    coordenador_obra: "Eng. Ricardo Pereira",
    fiscal_obra: "Eng. Luísa Ferreira",
    engenheiro_responsavel: "Eng. Manuel Santos",
    arquiteto: "Arq. Teresa Silva",
    zonas: ["Zona Norte", "Zona Sul", "Zona Central"],
    fases: ["Fase 1 - Estrutura", "Fase 2 - Fachadas", "Fase 3 - Interiores"],
    equipas: ["Equipa Norte", "Equipa Sul", "Equipa Central"],
    fornecedores_principais: ["Fornecedor Norte", "Fornecedor Sul", "Fornecedor Central"],
    riscos: [
      {
        id: "1",
        descricao: "Complexidade da estrutura",
        probabilidade: "alta",
        impacto: "critico",
        categoria: "tecnico",
        status: "ativo",
        data_identificacao: "2024-02-05",
        responsavel: "Eng. Sofia Martins"
      }
    ],
    indicadores: [
      {
        id: "1",
        nome: "Progresso Físico",
        valor: 15,
        unidade: "%",
        data_medicao: "2024-03-15",
        meta: 20
      }
    ],
    milestones: [
      {
        id: "1",
        titulo: "Conclusão da Estrutura Principal",
        descricao: "Finalização da estrutura em betão armado",
        data_prevista: "2024-08-31",
        data_real: null,
        status: "pendente",
        importancia: "critica",
        responsavel: "Eng. Sofia Martins",
        percentual_conclusao: 15
      }
    ],
    dependencias_externas: [
      {
        id: "1",
        descricao: "Aprovação de Licença Comercial",
        tipo: "licenciamento",
        status: "pendente",
        data_prevista: "2024-05-31",
        data_real: null,
        responsavel: "Arq. Teresa Silva"
      }
    ],
    subempreiteiros: [
      {
        id: "1",
        nome: "Subempreiteiro Estrutural",
        especialidade: "Estruturas Complexas",
        valor_contrato: 1500000,
        data_inicio: "2024-02-15",
        data_fim: "2024-09-30",
        status: "ativo",
        responsavel: "Eng. Sofia Martins"
      }
    ],
    metricas_evm: {
      id: "2",
      pv: 1000000,
      ev: 750000,
      ac: 800000,
      bac: 5000000,
      spi: 0.75,
      cpi: 0.94,
      sv: -250000,
      cv: -50000,
      eac: 5319149,
      etc: 4569149,
      vac: -319149,
      data_criacao: "2024-02-01T10:00:00Z",
      data_atualizacao: "2024-03-15T10:00:00Z"
    },
    indicadores_performance: [
      {
        id: "1",
        nome: "Eficiência de Cronograma",
        valor: 75,
        unidade: "%",
        data_medicao: "2024-03-15",
        meta: 100,
        categoria: "tempo"
      }
    ],
    documentacao: {
      id: "2",
      versao: "1.0",
      responsavel: "Eng. Sofia Martins",
      data_criacao: "2024-02-01T10:00:00Z",
      data_revisao: "2024-03-15T10:00:00Z",
      categorias: ["Projeto", "Execução", "Qualidade"],
      templates: ["Relatório Semanal", "Relatório Mensal"],
      procedimentos_aprovacao: ["Aprovação Técnica", "Aprovação Cliente"]
    },
    licencas_autorizacoes: [
      {
        id: "1",
        tipo: "Licença de Construção",
        numero: "LC-2024-002",
        emissor: "Câmara Municipal do Porto",
        data_emissao: "2024-01-25",
        data_validade: "2026-01-25",
        status: "ativa",
        responsavel: "Arq. Teresa Silva"
      }
    ],
    certificacoes_obrigatorias: [],
    gestao_financeira: {
      id: "2",
      orcamento_total: 5000000,
      valor_executado: 750000,
      valor_pendente: 4250000,
      fluxo_caixa: [
        { mes: "Fevereiro", entrada: 0, saida: 300000, saldo: -300000 },
        { mes: "Março", entrada: 200000, saida: 450000, saldo: -550000 }
      ],
      indicadores_financeiros: [
        { nome: "Margem de Lucro", valor: 18, unidade: "%" },
        { nome: "ROI", valor: 15, unidade: "%" }
      ],
      data_criacao: "2024-02-01T10:00:00Z",
      data_atualizacao: "2024-03-15T10:00:00Z"
    },
    orcamentos_detalhados: [
      {
        id: "1",
        categoria: "Estrutura",
        valor_orcamentado: 2000000,
        valor_executado: 750000,
        percentual_execucao: 37.5,
        responsavel: "Eng. Sofia Martins"
      }
    ],
    controlo_custos: [
      {
        id: "1",
        categoria: "Materiais",
        valor_orcamentado: 1000000,
        valor_real: 800000,
        variacao: -200000,
        percentual_variacao: -20,
        data_medicao: "2024-03-15"
      }
    ],
    plano_qualidade: {
      id: "2",
      versao: "1.0",
      responsavel: "Eng. Luísa Ferreira",
      data_criacao: "2024-02-01T10:00:00Z",
      data_revisao: "2024-03-15T10:00:00Z",
      objetivos_qualidade: ["Excelência na execução", "Satisfação total do cliente"],
      procedimentos_qualidade: ["Controle rigoroso", "Inspeções frequentes"]
    },
    plano_seguranca: {
      id: "2",
      versao: "1.0",
      responsavel: "Eng. Ricardo Pereira",
      data_criacao: "2024-02-01T10:00:00Z",
      data_revisao: "2024-03-15T10:00:00Z",
      equipamentos_protecao: ["Capacetes", "Coletes", "Botas", "Óculos"],
      procedimentos_seguranca: ["Formação obrigatória", "Inspeções diárias", "Reuniões semanais"]
    },
    inspecoes_qualidade: [
      {
        id: "1",
        tipo: "Inspeção de Estrutura",
        data: "2024-03-12",
        responsavel: "Eng. Luísa Ferreira",
        resultado: "Aprovado com ressalvas",
        observacoes: "Necessário reforço em algumas ligações"
      }
    ],
    acidentes_incidentes: [],
    gestao_ambiental: {
      id: "2",
      versao_plano: "1.0",
      responsavel_ambiental: "Eng. Luísa Ferreira",
      data_criacao: "2024-02-01T10:00:00Z",
      data_revisao_plano: "2024-03-15T10:00:00Z",
      objetivos_ambientais: ["Sustentabilidade", "Eficiência energética"],
      impactos_ambientais: ["Consumo de energia", "Geração de resíduos"],
      medidas_mitigacao: ["Energias renováveis", "Gestão de resíduos"],
      recursos_ambientais: ["Painéis solares", "Sistema de reciclagem"],
      monitorizacao_ambiental: ["Controlo de energia", "Gestão de resíduos"]
    },
    certificacoes_ambientais: [],
    responsavel: "Eng. Sofia Martins",
    zona: "Porto",
    estado: "em_analise",
    data_criacao: "2024-02-01T10:00:00Z",
    data_atualizacao: "2024-02-01T10:00:00Z",
  },
  {
    id: "3",
    codigo: "OBR-2024-003",
    nome: "Ponte Pedonal Rio",
    cliente: "Câmara Municipal",
    localizacao: "Coimbra, Portugal",
    data_inicio: "2024-03-01",
    data_fim_prevista: "2024-08-31",
    valor_contrato: 800000,
    valor_executado: 600000,
    percentual_execucao: 75,
    status: "em_execucao",
    tipo_obra: "infraestrutura",
    categoria: "media",
    responsavel_tecnico: "Eng. António Costa",
    coordenador_obra: "Eng. Filipa Santos",
    fiscal_obra: "Eng. João Pereira",
    engenheiro_responsavel: "Eng. Maria Silva",
    arquiteto: "Arq. Carlos Mendes",
    zonas: ["Margem Norte", "Margem Sul", "Rio"],
    fases: ["Fase 1 - Fundações", "Fase 2 - Estrutura", "Fase 3 - Acabamentos"],
    equipas: ["Equipa Fundações", "Equipa Estrutura", "Equipa Acabamentos"],
    fornecedores_principais: ["Fornecedor Aço", "Fornecedor Betão", "Fornecedor Acabamentos"],
    riscos: [
      {
        id: "1",
        descricao: "Condições do rio",
        probabilidade: "alta",
        impacto: "moderado",
        categoria: "ambiental",
        status: "monitorizado",
        data_identificacao: "2024-03-05",
        responsavel: "Eng. António Costa"
      }
    ],
    indicadores: [
      {
        id: "1",
        nome: "Progresso Físico",
        valor: 75,
        unidade: "%",
        data_medicao: "2024-03-15",
        meta: 70
      }
    ],
    milestones: [
      {
        id: "1",
        titulo: "Conclusão da Estrutura Principal",
        descricao: "Finalização da estrutura da ponte",
        data_prevista: "2024-06-30",
        data_real: "2024-06-25",
        status: "concluida",
        importancia: "critica",
        responsavel: "Eng. António Costa",
        percentual_conclusao: 100
      }
    ],
    dependencias_externas: [
      {
        id: "1",
        descricao: "Autorização de Trabalhos no Rio",
        tipo: "ambiental",
        status: "concluida",
        data_prevista: "2024-02-15",
        data_real: "2024-02-10",
        responsavel: "Eng. António Costa"
      }
    ],
    subempreiteiros: [
      {
        id: "1",
        nome: "Subempreiteiro Estrutural",
        especialidade: "Estruturas Metálicas",
        valor_contrato: 400000,
        data_inicio: "2024-03-15",
        data_fim: "2024-07-31",
        status: "concluido",
        responsavel: "Eng. António Costa"
      }
    ],
    metricas_evm: {
      id: "3",
      pv: 600000,
      ev: 600000,
      ac: 600000,
      bac: 800000,
      spi: 1.0,
      cpi: 1.0,
      sv: 0,
      cv: 0,
      eac: 800000,
      etc: 200000,
      vac: 0,
      data_criacao: "2024-03-01T08:00:00Z",
      data_atualizacao: "2024-03-15T10:00:00Z"
    },
    indicadores_performance: [
      {
        id: "1",
        nome: "Eficiência de Cronograma",
        valor: 100,
        unidade: "%",
        data_medicao: "2024-03-15",
        meta: 100,
        categoria: "tempo"
      }
    ],
    documentacao: {
      id: "3",
      versao: "1.0",
      responsavel: "Eng. António Costa",
      data_criacao: "2024-03-01T08:00:00Z",
      data_revisao: "2024-03-15T10:00:00Z",
      categorias: ["Projeto", "Execução", "Ambiental"],
      templates: ["Relatório Semanal", "Relatório Ambiental"],
      procedimentos_aprovacao: ["Aprovação Técnica", "Aprovação Ambiental"]
    },
    licencas_autorizacoes: [
      {
        id: "1",
        tipo: "Licença Ambiental",
        numero: "LA-2024-003",
        emissor: "APA",
        data_emissao: "2024-02-10",
        data_validade: "2025-02-10",
        status: "ativa",
        responsavel: "Eng. António Costa"
      }
    ],
    certificacoes_obrigatorias: [],
    gestao_financeira: {
      id: "3",
      orcamento_total: 800000,
      valor_executado: 600000,
      valor_pendente: 200000,
      fluxo_caixa: [
        { mes: "Março", entrada: 0, saida: 200000, saldo: -200000 },
        { mes: "Abril", entrada: 300000, saida: 200000, saldo: -100000 },
        { mes: "Maio", entrada: 300000, saida: 200000, saldo: 0 }
      ],
      indicadores_financeiros: [
        { nome: "Margem de Lucro", valor: 12, unidade: "%" },
        { nome: "ROI", valor: 10, unidade: "%" }
      ],
      data_criacao: "2024-03-01T08:00:00Z",
      data_atualizacao: "2024-03-15T10:00:00Z"
    },
    orcamentos_detalhados: [
      {
        id: "1",
        categoria: "Estrutura",
        valor_orcamentado: 400000,
        valor_executado: 300000,
        percentual_execucao: 75,
        responsavel: "Eng. António Costa"
      },
      {
        id: "2",
        categoria: "Acabamentos",
        valor_orcamentado: 200000,
        valor_executado: 150000,
        percentual_execucao: 75,
        responsavel: "Eng. Filipa Santos"
      }
    ],
    controlo_custos: [
      {
        id: "1",
        categoria: "Materiais",
        valor_orcamentado: 300000,
        valor_real: 300000,
        variacao: 0,
        percentual_variacao: 0,
        data_medicao: "2024-03-15"
      }
    ],
    plano_qualidade: {
      id: "3",
      versao: "1.0",
      responsavel: "Eng. Filipa Santos",
      data_criacao: "2024-03-01T08:00:00Z",
      data_revisao: "2024-03-15T10:00:00Z",
      objetivos_qualidade: ["Qualidade estrutural", "Durabilidade"],
      procedimentos_qualidade: ["Ensaios de resistência", "Inspeções estruturais"]
    },
    plano_seguranca: {
      id: "3",
      versao: "1.0",
      responsavel: "Eng. João Pereira",
      data_criacao: "2024-03-01T08:00:00Z",
      data_revisao: "2024-03-15T10:00:00Z",
      equipamentos_protecao: ["Capacetes", "Coletes", "Botas", "Cintos"],
      procedimentos_seguranca: ["Formação específica", "Inspeções diárias"]
    },
    inspecoes_qualidade: [
      {
        id: "1",
        tipo: "Inspeção Estrutural",
        data: "2024-03-14",
        responsavel: "Eng. Filipa Santos",
        resultado: "Aprovado",
        observacoes: "Estrutura conforme projeto"
      }
    ],
    acidentes_incidentes: [],
    gestao_ambiental: {
      id: "3",
      versao_plano: "1.0",
      responsavel_ambiental: "Eng. António Costa",
      data_criacao: "2024-03-01T08:00:00Z",
      data_revisao_plano: "2024-03-15T10:00:00Z",
      objetivos_ambientais: ["Proteção do rio", "Minimizar impacto"],
      impactos_ambientais: ["Perturbação do rio", "Geração de resíduos"],
      medidas_mitigacao: ["Proteção do leito", "Gestão de resíduos"],
      recursos_ambientais: ["Barreiras de proteção", "Sistema de filtros"],
      monitorizacao_ambiental: ["Qualidade da água", "Nível do rio"]
    },
    certificacoes_ambientais: [
      {
        id: "1",
        nome: "Certificação Ambiental",
        emissor: "APA",
        data_emissao: "2024-02-15",
        data_validade: "2025-02-15",
        status: "ativa",
        responsavel: "Eng. António Costa"
      }
    ],
    responsavel: "Eng. António Costa",
    zona: "Coimbra",
    estado: "aprovado",
    data_criacao: "2024-03-01T08:00:00Z",
    data_atualizacao: "2024-03-01T08:00:00Z",
  },
  {
    id: "4",
    codigo: "OBR-2024-004",
    nome: "Complexo Residencial Setúbal Bay",
    cliente: "Setúbal Bay Development",
    localizacao: "Setúbal, Portugal",
    data_inicio: "2024-04-01",
    data_fim_prevista: "2025-12-31",
    valor_contrato: 3500000,
    valor_executado: 875000,
    percentual_execucao: 25,
    status: "em_execucao",
    tipo_obra: "residencial",
    categoria: "grande",
    responsavel_tecnico: "Eng. Francisco Setúbal",
    coordenador_obra: "Eng. Ana Setúbal",
    fiscal_obra: "Eng. Miguel Costa",
    engenheiro_responsavel: "Eng. Pedro Santos",
    arquiteto: "Arq. Sofia Mendes",
    zonas: ["Bloco A", "Bloco B", "Bloco C", "Área Comum"],
    fases: ["Fase 1 - Fundações", "Fase 2 - Estrutura", "Fase 3 - Acabamentos"],
    equipas: ["Equipa Fundações", "Equipa Estrutura", "Equipa Acabamentos"],
    fornecedores_principais: ["Fornecedor Betão", "Fornecedor Aço", "Fornecedor Acabamentos"],
    riscos: [
      {
        id: "1",
        descricao: "Atraso na entrega de materiais",
        probabilidade: "media",
        impacto: "moderado",
        categoria: "fornecimento",
        status: "monitorizado",
        data_identificacao: "2024-04-05",
        responsavel: "Eng. Francisco Setúbal"
      }
    ],
    indicadores: [
      {
        id: "1",
        nome: "Progresso Físico",
        valor: 25,
        unidade: "%",
        data_medicao: "2024-03-15",
        meta: 30
      }
    ],
    milestones: [
      {
        id: "1",
        titulo: "Conclusão das Fundações",
        descricao: "Finalização de todas as fundações dos blocos",
        data_prevista: "2024-06-30",
        data_real: null,
        status: "pendente",
        importancia: "critica",
        responsavel: "Eng. Francisco Setúbal",
        percentual_conclusao: 60
      }
    ],
    dependencias_externas: [
      {
        id: "1",
        descricao: "Aprovação do Plano de Urbanização",
        tipo: "urbanismo",
        status: "concluida",
        data_prevista: "2024-03-15",
        data_real: "2024-03-10",
        responsavel: "Arq. Sofia Mendes"
      }
    ],
    subempreiteiros: [
      {
        id: "1",
        nome: "Subempreiteiro Fundações",
        especialidade: "Fundações Profundas",
        valor_contrato: 500000,
        data_inicio: "2024-04-15",
        data_fim: "2024-07-31",
        status: "ativo",
        responsavel: "Eng. Francisco Setúbal"
      }
    ],
    metricas_evm: {
      id: "4",
      pv: 875000,
      ev: 875000,
      ac: 875000,
      bac: 3500000,
      spi: 1.0,
      cpi: 1.0,
      sv: 0,
      cv: 0,
      eac: 3500000,
      etc: 2625000,
      vac: 0,
      data_criacao: "2024-04-01T09:00:00Z",
      data_atualizacao: "2024-03-15T10:00:00Z"
    },
    indicadores_performance: [
      {
        id: "1",
        nome: "Eficiência de Cronograma",
        valor: 100,
        unidade: "%",
        data_medicao: "2024-03-15",
        meta: 100,
        categoria: "tempo"
      }
    ],
    documentacao: {
      id: "4",
      versao: "1.0",
      responsavel: "Eng. Francisco Setúbal",
      data_criacao: "2024-04-01T09:00:00Z",
      data_revisao: "2024-03-15T10:00:00Z",
      categorias: ["Projeto", "Execução", "Qualidade"],
      templates: ["Relatório Semanal", "Relatório Mensal"],
      procedimentos_aprovacao: ["Aprovação Técnica", "Aprovação Cliente"]
    },
    licencas_autorizacoes: [
      {
        id: "1",
        tipo: "Licença de Construção",
        numero: "LC-2024-004",
        emissor: "Câmara Municipal de Setúbal",
        data_emissao: "2024-03-10",
        data_validade: "2026-03-10",
        status: "ativa",
        responsavel: "Arq. Sofia Mendes"
      }
    ],
    certificacoes_obrigatorias: [],
    gestao_financeira: {
      id: "4",
      orcamento_total: 3500000,
      valor_executado: 875000,
      valor_pendente: 2625000,
      fluxo_caixa: [
        { mes: "Abril", entrada: 0, saida: 300000, saldo: -300000 },
        { mes: "Maio", entrada: 400000, saida: 300000, saldo: -200000 },
        { mes: "Junho", entrada: 475000, saida: 275000, saldo: 0 }
      ],
      indicadores_financeiros: [
        { nome: "Margem de Lucro", valor: 20, unidade: "%" },
        { nome: "ROI", valor: 18, unidade: "%" }
      ],
      data_criacao: "2024-04-01T09:00:00Z",
      data_atualizacao: "2024-03-15T10:00:00Z"
    },
    orcamentos_detalhados: [
      {
        id: "1",
        categoria: "Fundações",
        valor_orcamentado: 500000,
        valor_executado: 375000,
        percentual_execucao: 75,
        responsavel: "Eng. Francisco Setúbal"
      }
    ],
    controlo_custos: [
      {
        id: "1",
        categoria: "Materiais",
        valor_orcamentado: 800000,
        valor_real: 875000,
        variacao: 75000,
        percentual_variacao: 9.4,
        data_medicao: "2024-03-15"
      }
    ],
    plano_qualidade: {
      id: "4",
      versao: "1.0",
      responsavel: "Eng. Ana Setúbal",
      data_criacao: "2024-04-01T09:00:00Z",
      data_revisao: "2024-03-15T10:00:00Z",
      objetivos_qualidade: ["Qualidade premium", "Satisfação do cliente"],
      procedimentos_qualidade: ["Controle rigoroso", "Inspeções frequentes"]
    },
    plano_seguranca: {
      id: "4",
      versao: "1.0",
      responsavel: "Eng. Miguel Costa",
      data_criacao: "2024-04-01T09:00:00Z",
      data_revisao: "2024-03-15T10:00:00Z",
      equipamentos_protecao: ["Capacetes", "Coletes", "Botas", "Óculos"],
      procedimentos_seguranca: ["Formação obrigatória", "Inspeções diárias"]
    },
    inspecoes_qualidade: [
      {
        id: "1",
        tipo: "Inspeção de Fundações",
        data: "2024-03-13",
        responsavel: "Eng. Ana Setúbal",
        resultado: "Aprovado",
        observacoes: "Fundações conforme especificação"
      }
    ],
    acidentes_incidentes: [],
    gestao_ambiental: {
      id: "4",
      versao_plano: "1.0",
      responsavel_ambiental: "Eng. Francisco Setúbal",
      data_criacao: "2024-04-01T09:00:00Z",
      data_revisao_plano: "2024-03-15T10:00:00Z",
      objetivos_ambientais: ["Sustentabilidade", "Eficiência energética"],
      impactos_ambientais: ["Consumo de energia", "Geração de resíduos"],
      medidas_mitigacao: ["Energias renováveis", "Gestão de resíduos"],
      recursos_ambientais: ["Painéis solares", "Sistema de reciclagem"],
      monitorizacao_ambiental: ["Controlo de energia", "Gestão de resíduos"]
    },
    certificacoes_ambientais: [],
    responsavel: "Eng. Francisco Setúbal",
    zona: "Setúbal",
    estado: "em_execucao",
    data_criacao: "2024-04-01T09:00:00Z",
    data_atualizacao: "2024-04-01T09:00:00Z",
  },
];

export default function Obras() {
  const [obras, setObras] = useState<any[]>([]);
  const [filteredObras, setFilteredObras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingRealData, setUsingRealData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingObra, setEditingObra] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showRelatorios, setShowRelatorios] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSavedObrasViewer, setShowSavedObrasViewer] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [activeModule, setActiveModule] = useState<'dashboard' | 'cronograma' | 'riscos' | 'subempreiteiros' | 'metricas' | 'documentacao' | 'financeiro' | 'qualidade' | 'ambiente'>('dashboard');

  // Filtros ativos
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    tipo_obra: "",
    categoria: "",
    cliente: "",
    responsavel_tecnico: "",
    dataInicio: "",
    dataFim: "",
  });

  // Carregar obras da API ao montar o componente
  useEffect(() => {
    const loadObras = async () => {
      try {
        setLoading(true);
        console.log("🔄 Carregando obras da Supabase...");
        
        const loadedObras = await obrasAPI.getAll();
        console.log("📊 Obras carregadas da Supabase:", loadedObras);
        
        if (loadedObras && loadedObras.length > 0) {
          console.log("✅ Usando dados reais da Supabase");
          setObras(loadedObras);
          setFilteredObras(loadedObras);
          setUsingRealData(true);
          
          // Selecionar automaticamente a primeira obra se não houver nenhuma selecionada
          if (!editingObra) {
            setEditingObra(loadedObras[0]);
            console.log("🎯 Primeira obra selecionada automaticamente:", loadedObras[0].nome);
          }
        } else {
          console.log("⚠️ Nenhuma obra encontrada na Supabase, usando dados mock para demonstração");
          
          // Tentar carregar dados mock salvos localmente
          const savedMockObras = localStorage.getItem('qualicore_mock_obras');
          const obrasToUse = savedMockObras ? JSON.parse(savedMockObras) : mockObras;
          
          setObras(obrasToUse);
          setFilteredObras(obrasToUse);
          setUsingRealData(false);
          toast.success("Usando dados de demonstração - conecte-se à Supabase para dados reais");
          
          // Selecionar automaticamente a primeira obra mock se não houver nenhuma selecionada
          if (!editingObra) {
            setEditingObra(obrasToUse[0]);
            console.log("🎯 Primeira obra mock selecionada automaticamente:", obrasToUse[0].nome);
          }
        }
      } catch (error) {
        console.error("❌ Erro ao carregar obras da Supabase:", error);
        console.log("🔄 Usando dados mock devido ao erro");
        
        // Tentar carregar dados mock salvos localmente
        const savedMockObras = localStorage.getItem('qualicore_mock_obras');
        const obrasToUse = savedMockObras ? JSON.parse(savedMockObras) : mockObras;
        
        setObras(obrasToUse);
        setFilteredObras(obrasToUse);
        setUsingRealData(false);
        toast.error("Erro ao carregar obras - usando dados de demonstração");
        
        // Selecionar automaticamente a primeira obra mock em caso de erro
        if (!editingObra) {
          setEditingObra(obrasToUse[0]);
          console.log("🎯 Primeira obra mock selecionada automaticamente (erro):", obrasToUse[0].nome);
        }
      } finally {
        setLoading(false);
      }
    };
    loadObras();
  }, []);

  const handleCreate = () => {
    setEditingObra(null);
    setShowModal(true);
  };

  const handleEdit = (obra: any) => {
    console.log("Função handleEdit chamada!");
    console.log("Editando obra:", obra);
    console.log("Nome da obra:", obra?.nome);
    
    try {
      setEditingObra(obra);
      setShowModal(true);
      toast.success(`Editando obra: ${obra?.nome || 'obra'}`);
    } catch (error) {
      console.error("Erro ao abrir modal:", error);
      toast.error("Erro ao abrir modal de edição");
    }
  };

  // Função para salvar dados mock no localStorage
  const saveMockObras = (obrasToSave: any[]) => {
    if (!usingRealData) {
      localStorage.setItem('qualicore_mock_obras', JSON.stringify(obrasToSave));
      console.log("💾 Dados mock salvos no localStorage");
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      console.log("Dados do formulário:", data);

      // Validação dos campos obrigatórios
      if (
        !data.codigo ||
        !data.nome ||
        !data.cliente ||
        !data.localizacao ||
        !data.data_inicio ||
        !data.data_fim_prevista ||
        !data.valor_contrato
      ) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      // Converter dados do formulário para o formato da API
      const obraData = {
        codigo: data.codigo,
        nome: data.nome,
        cliente: data.cliente,
        localizacao: data.localizacao,
        data_inicio: data.data_inicio,
        data_fim_prevista: data.data_fim_prevista,
        data_fim_real: data.data_fim_real,
        valor_contrato: Number(data.valor_contrato) || 0,
        valor_executado: Number(data.valor_executado) || 0,
        percentual_execucao: Number(data.percentual_execucao) || 0,
        status: data.status,
        tipo_obra: data.tipo_obra,
        categoria: data.categoria,
        responsavel_tecnico: data.responsavel_tecnico,
        coordenador_obra: data.coordenador_obra,
        fiscal_obra: data.fiscal_obra,
        engenheiro_responsavel: data.engenheiro_responsavel,
        arquiteto: data.arquiteto,
        fornecedores_principais: data.fornecedores_principais || [],
        observacoes: data.observacoes,
      };

      console.log("Dados convertidos para API:", obraData);

      if (editingObra) {
        // Atualizar obra existente
        if (usingRealData) {
          const updatedObra = await obrasAPI.update(editingObra.id, obraData);
          if (updatedObra) {
            const updatedObras = obras.map((o) => (o.id === editingObra.id ? updatedObra : o));
            setObras(updatedObras);
            toast.success("Obra atualizada com sucesso!");
          } else {
            toast.error("Erro ao atualizar obra");
          }
        } else {
          // Atualizar obra mock
          const updatedObra = { ...editingObra, ...obraData };
          const updatedObras = obras.map((o) => (o.id === editingObra.id ? updatedObra : o));
          setObras(updatedObras);
          saveMockObras(updatedObras);
          toast.success("Obra mock atualizada com sucesso!");
        }
      } else {
        // Criar nova obra
        console.log("Tentando criar obra com dados:", obraData);

        if (usingRealData) {
          const newObra = await obrasAPI.create(obraData);
          console.log("Resultado da criação:", newObra);
          if (newObra) {
            const updatedObras = [...obras, newObra];
            setObras(updatedObras);
            toast.success("Obra criada com sucesso!");
          } else {
            toast.error("Erro ao criar obra");
          }
        } else {
          // Criar nova obra mock
          const newObra = {
            ...obraData,
            id: Date.now().toString(),
            data_criacao: new Date().toISOString(),
            data_atualizacao: new Date().toISOString(),
            zonas: [],
            fases: [],
            equipas: [],
            fornecedores_principais: [],
            riscos: [],
            indicadores: [],
            milestones: [],
            dependencias_externas: [],
            subempreiteiros: [],
            metricas_evm: {
              id: Date.now().toString(),
              pv: 0,
              ev: 0,
              ac: 0,
              bac: obraData.valor_contrato,
              spi: 0,
              cpi: 0,
              sv: 0,
              cv: 0,
              eac: 0,
              etc: 0,
              vac: 0,
              data_criacao: new Date().toISOString(),
              data_atualizacao: new Date().toISOString()
            },
            indicadores_performance: [],
            documentacao: {
              id: Date.now().toString(),
              versao: "1.0",
              responsavel: obraData.responsavel_tecnico,
              data_criacao: new Date().toISOString(),
              data_revisao: new Date().toISOString(),
              categorias: [],
              templates: [],
              procedimentos_aprovacao: []
            },
            licencas_autorizacoes: [],
            certificacoes_obrigatorias: [],
            gestao_financeira: {
              id: Date.now().toString(),
              orcamento_total: obraData.valor_contrato,
              valor_executado: obraData.valor_executado || 0,
              valor_pendente: obraData.valor_contrato - (obraData.valor_executado || 0),
              fluxo_caixa: [],
              indicadores_financeiros: [],
              data_criacao: new Date().toISOString(),
              data_atualizacao: new Date().toISOString()
            },
            orcamentos_detalhados: [],
            controlo_custos: [],
            plano_qualidade: {
              id: Date.now().toString(),
              versao: "1.0",
              responsavel: obraData.responsavel_tecnico,
              data_criacao: new Date().toISOString(),
              data_revisao: new Date().toISOString(),
              objetivos_qualidade: [],
              procedimentos_qualidade: []
            },
            plano_seguranca: {
              id: Date.now().toString(),
              versao: "1.0",
              responsavel: obraData.responsavel_tecnico,
              data_criacao: new Date().toISOString(),
              data_revisao: new Date().toISOString(),
              equipamentos_protecao: [],
              procedimentos_seguranca: []
            },
            inspecoes_qualidade: [],
            acidentes_incidentes: [],
            gestao_ambiental: {
              id: Date.now().toString(),
              versao_plano: "1.0",
              responsavel_ambiental: obraData.responsavel_tecnico,
              data_criacao: new Date().toISOString(),
              data_revisao_plano: new Date().toISOString(),
              objetivos_ambientais: [],
              impactos_ambientais: [],
              medidas_mitigacao: [],
              recursos_ambientais: [],
              monitorizacao_ambiental: []
            },
            certificacoes_ambientais: [],
            responsavel: obraData.responsavel_tecnico,
            zona: obraData.localizacao.split(',')[0],
            estado: obraData.status,
          };
          const updatedObras = [...obras, newObra];
          setObras(updatedObras);
          saveMockObras(updatedObras);
          toast.success("Obra mock criada com sucesso!");
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao salvar obra:", error);
      if (error instanceof Error) {
        toast.error(`Erro ao salvar obra: ${error.message}`);
      } else {
        toast.error("Erro ao salvar obra");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta obra?")) {
      try {
        console.log("Excluindo obra com ID:", id);
        
        if (usingRealData) {
          const success = await obrasAPI.delete(id);
          if (success) {
            const updatedObras = obras.filter((o) => o.id !== id);
            setObras(updatedObras);
            toast.success("Obra excluída com sucesso!");
          } else {
            toast.error("Erro ao excluir obra");
          }
        } else {
          // Excluir obra mock
          const updatedObras = obras.filter((o) => o.id !== id);
          setObras(updatedObras);
          saveMockObras(updatedObras);
          toast.success("Obra mock excluída com sucesso!");
        }
      } catch (error) {
        console.error("Erro ao excluir obra:", error);
        if (!usingRealData) {
          // Para demonstração, remover da lista local mesmo com erro
          const updatedObras = obras.filter((o) => o.id !== id);
          setObras(updatedObras);
          saveMockObras(updatedObras);
          toast.success("Obra mock excluída com sucesso!");
        } else {
          toast.error("Erro ao excluir obra");
        }
      }
    }
  };

  const handleGenerateIndividualReport = async (obra: any) => {
    try {
      console.log("Gerando relatório individual para obra:", obra);
      const pdfService = new PDFService();

      await pdfService.generateObrasIndividualReport([obra]);
      toast.success(`Relatório individual gerado com sucesso para ${obra.nome}!`);
    } catch (error) {
      console.error("Erro ao gerar relatório individual:", error);
      toast.error("Erro ao gerar relatório individual");
    }
  };



  // Aplicar filtros
  useEffect(() => {
    const filtered = obras.filter((obra) => {
      const matchesSearch = !filters.search || 
        obra.nome?.toLowerCase().includes(filters.search.toLowerCase()) ||
        obra.codigo?.toLowerCase().includes(filters.search.toLowerCase()) ||
        obra.cliente?.toLowerCase().includes(filters.search.toLowerCase()) ||
        obra.localizacao?.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = !filters.status || obra.status === filters.status;
      const matchesTipo = !filters.tipo_obra || obra.tipo_obra === filters.tipo_obra;
      const matchesCategoria = !filters.categoria || obra.categoria === filters.categoria;
      const matchesCliente = !filters.cliente || obra.cliente === filters.cliente;
      const matchesResponsavel = !filters.responsavel_tecnico || obra.responsavel_tecnico === filters.responsavel_tecnico;

      const matchesData = !filters.dataInicio || !filters.dataFim || 
        (obra.data_inicio >= filters.dataInicio && obra.data_inicio <= filters.dataFim);

      return matchesSearch && matchesStatus && matchesTipo && matchesCategoria && 
             matchesCliente && matchesResponsavel && matchesData;
    });
    setFilteredObras(filtered);
  }, [obras, filters]);

  // Obter valores únicos para os filtros
  const statusUnicos = [...new Set(obras.map(o => o.status).filter(Boolean))];
  const tiposUnicos = [...new Set(obras.map(o => o.tipo_obra).filter(Boolean))];
  const categoriasUnicas = [...new Set(obras.map(o => o.categoria).filter(Boolean))];
  const clientesUnicos = [...new Set(obras.map(o => o.cliente).filter(Boolean))];
  const responsaveisUnicos = [...new Set(obras.map(o => o.responsavel_tecnico).filter(Boolean))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em_execucao":
        return "bg-blue-100 text-blue-800";
      case "concluida":
        return "bg-green-100 text-green-800";
      case "paralisada":
        return "bg-yellow-100 text-yellow-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "em_execucao":
        return "Em Execução";
      case "concluida":
        return "Concluída";
      case "paralisada":
        return "Paralisada";
      case "cancelada":
        return "Cancelada";
      case "planeamento":
        return "Planeamento";
      default:
        return status;
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      tipo_obra: "",
      categoria: "",
      cliente: "",
      responsavel_tecnico: "",
      dataInicio: "",
      dataFim: "",
    });
  };

  const handleViewSavedObras = () => {
    setShowSavedObrasViewer(true);
  };

  // Funções de ação para os botões
  const handleEditObra = (obra: any) => {
    console.log("Editando obra:", obra);
    setEditingObra(obra);
    setShowModal(true);
    toast.success(`Editando obra: ${obra.nome}`);
  };

  const handleRelatorioObra = (obra: any) => {
    console.log("Gerando relatório para obra:", obra);
    setEditingObra(obra);
    setShowRelatorios(true);
    toast.success(`Gerando relatório para: ${obra.nome}`);
  };

  const handleExportObra = async (obra: any) => {
    console.log("Exportando obra:", obra);
    try {
      const pdfService = new PDFService();
      await pdfService.generateObrasIndividualReport([obra]);
      toast.success(`Obra ${obra.nome} exportada com sucesso!`);
    } catch (error) {
      console.error("Erro ao exportar obra:", error);
      toast.error("Erro ao exportar obra");
    }
  };

  const handleShareObra = (obra: any) => {
    console.log("Partilhando obra:", obra);
    setEditingObra(obra);
    setShowShareModal(true);
    toast.success(`Abrindo modal de partilha para ${obra.nome}`);
  };

  const handleDeleteObra = async (obra: any) => {
    console.log("Excluindo obra:", obra);
    if (confirm(`Tem certeza que deseja excluir a obra "${obra.nome}"?`)) {
      try {
        await obrasAPI.delete(obra.id);
        toast.success(`Obra ${obra.nome} excluída com sucesso!`);
        setObras(obras.filter((o) => o.id !== obra.id));
      } catch (error) {
        console.error("Erro ao excluir obra:", error);
        toast.error("Erro ao excluir obra");
      }
    }
  };

  // Handlers para o Dashboard
  const handleAddObra = () => {
    setEditingObra(null);
    setShowModal(true);
  };

  const handleViewObra = (obra: any) => {
    setEditingObra(obra);
    setShowRelatorios(true);
  };

  const handleSearchObras = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleFilterChangeObras = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const stats = {
    total: filteredObras.length,
    em_execucao: filteredObras.filter((o) => o.status === "em_execucao").length,
    concluidas: filteredObras.filter((o) => o.status === "concluida").length,
    valor_total: filteredObras.reduce((acc, o) => acc + o.valor_contrato, 0),
    valor_executado: filteredObras.reduce((acc, o) => acc + o.valor_executado, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-bounce"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Carregando obras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8 pt-16">
      {/* Header Premium */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-2">
              Gestão de Obras
            </h1>
            <p className="text-xl text-gray-600 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-500" />
              Controlo completo de projetos e obras em tempo real
            </p>
            {usingRealData ? (
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Dados Reais da Supabase</span>
              </div>
            ) : (
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-orange-600 font-medium">Dados de Demonstração</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveModule('dashboard')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group ${
                  activeModule === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white'
                }`}
              >
                <BarChart3 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveModule('cronograma')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group ${
                  activeModule === 'cronograma'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white'
                }`}
              >
                <Calendar className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Cronograma
              </button>
              <button
                onClick={() => setActiveModule('riscos')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group ${
                  activeModule === 'riscos'
                    ? 'bg-red-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white'
                }`}
              >
                <AlertTriangle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Riscos
              </button>
              <button
                onClick={() => setActiveModule('subempreiteiros')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group ${
                  activeModule === 'subempreiteiros'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white'
                }`}
              >
                <Building className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Subempreiteiros
              </button>
              <button
                onClick={() => setActiveModule('metricas')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group ${
                  activeModule === 'metricas'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white'
                }`}
              >
                <TrendingUp className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Métricas EVM
              </button>
              <button
                onClick={() => setActiveModule('documentacao')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group ${
                  activeModule === 'documentacao'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white'
                }`}
              >
                <FileText className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Documentação
              </button>
              <button
                onClick={() => setActiveModule('financeiro')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group ${
                  activeModule === 'financeiro'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white'
                }`}
              >
                <DollarSign className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Financeiro
              </button>
              <button
                onClick={() => setActiveModule('qualidade')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group ${
                  activeModule === 'qualidade'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white'
                }`}
              >
                <CheckCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Qualidade
              </button>
              <button
                onClick={() => setActiveModule('ambiente')}
                className={`inline-flex items-center px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl group ${
                  activeModule === 'ambiente'
                    ? 'bg-green-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white'
                }`}
              >
                <Leaf className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Ambiente
              </button>
            </div>
            
            <Link
              to="/obras/nova"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Nova Obra
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards - Ultra Premium */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
      >
        {/* Total de Obras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group cursor-pointer relative"
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-3xl"></div>
            <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+1</span>
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total de Obras</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.total}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.total / 10) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Em Execução */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="group cursor-pointer relative"
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Em Execução</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.em_execucao}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.em_execucao / stats.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Concluídas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="group cursor-pointer relative"
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Concluídas</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.concluidas}</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.concluidas / stats.total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Valor Total */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="group cursor-pointer relative"
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Valor Total</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.valor_total.toLocaleString('pt-PT')} €</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.valor_executado / stats.valor_total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Valor Executado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="group cursor-pointer relative"
        >
          <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <h3 className="text-sm font-medium text-gray-600 mb-2">Executado</h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stats.valor_executado.toLocaleString('pt-PT')} €</p>
              
              <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out" 
                     style={{ width: `${(stats.valor_executado / stats.valor_total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Dashboard ou Lista */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-6"
      >
        {activeModule === 'dashboard' && (
          <ObraDashboard
            obras={filteredObras}
            onSearch={handleSearchObras}
            onFilterChange={handleFilterChangeObras}
            onAddObra={handleAddObra}
            onEditObra={handleEditObra}
            onDeleteObra={handleDeleteObra}
            onViewObra={handleViewObra}
          />
        )}
        
                 {activeModule === 'cronograma' && (
           editingObra ? (
             <CronogramaObra
               milestones={editingObra?.milestones || []}
               dependencias={editingObra?.dependencias_externas || []}
                               onMilestoneChange={(milestones) => {
                  if (editingObra) {
                    const updatedObra = { ...editingObra, milestones };
                    setEditingObra(updatedObra);
                    // Update in obras list
                    const updatedObras = obras.map(o => 
                      o.id === editingObra.id ? updatedObra : o
                    );
                    setObras(updatedObras);
                    saveMockObras(updatedObras);
                  }
                }}
                onDependenciaChange={(dependencias) => {
                  if (editingObra) {
                    const updatedObra = { ...editingObra, dependencias_externas: dependencias };
                    setEditingObra(updatedObra);
                    // Update in obras list
                    const updatedObras = obras.map(o => 
                      o.id === editingObra.id ? updatedObra : o
                    );
                    setObras(updatedObras);
                    saveMockObras(updatedObras);
                  }
                }}
             />
           ) : (
             <div className="text-center py-12">
               <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma Obra</h3>
               <p className="text-gray-600">Selecione uma obra da lista para gerir o cronograma</p>
               <div className="mt-6">
                 <button
                   onClick={() => setActiveModule('dashboard')}
                   className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                 >
                   <BarChart3 className="h-4 w-4 mr-2" />
                   Voltar ao Dashboard
                 </button>
               </div>
             </div>
           )
         )}
        
                 {activeModule === 'riscos' && (
           editingObra ? (
             <GestaoRiscos
               riscos={editingObra?.riscos || []}
               planoMitigacao={editingObra?.plano_mitigacao || {
                 id: '1',
                 versao: '1.0',
                 data_criacao: new Date().toISOString(),
                 data_revisao: new Date().toISOString(),
                 responsavel: 'Eng. Responsável',
                 estrategias_gerais: [],
                 recursos_mitigacao: [],
                 procedimentos_emergencia: []
               }}
               auditorias={editingObra?.auditorias_risco || []}
               onRiscosChange={(riscos) => {
                 if (editingObra) {
                   const updatedObra = { ...editingObra, riscos };
                   setEditingObra(updatedObra);
                   // Update in obras list
                   const updatedObras = obras.map(o => 
                     o.id === editingObra.id ? updatedObra : o
                   );
                   setObras(updatedObras);
                   saveMockObras(updatedObras);
                 }
               }}
               onPlanoMitigacaoChange={(planoMitigacao) => {
                 if (editingObra) {
                   const updatedObra = { ...editingObra, plano_mitigacao: planoMitigacao };
                   setEditingObra(updatedObra);
                   // Update in obras list
                   const updatedObras = obras.map(o => 
                     o.id === editingObra.id ? updatedObra : o
                   );
                   setObras(updatedObras);
                   saveMockObras(updatedObras);
                 }
               }}
               onAuditoriasChange={(auditorias) => {
                 if (editingObra) {
                   const updatedObra = { ...editingObra, auditorias_risco: auditorias };
                   setEditingObra(updatedObra);
                   // Update in obras list
                   const updatedObras = obras.map(o => 
                     o.id === editingObra.id ? updatedObra : o
                   );
                   setObras(updatedObras);
                   saveMockObras(updatedObras);
                 }
               }}
             />
           ) : (
             <div className="text-center py-12">
               <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma Obra</h3>
               <p className="text-gray-600">Selecione uma obra da lista para gerir os riscos</p>
               <div className="mt-6">
                 <button
                   onClick={() => setActiveModule('dashboard')}
                   className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                 >
                   <BarChart3 className="h-4 w-4 mr-2" />
                   Voltar ao Dashboard
                 </button>
               </div>
             </div>
           )
         )}
        
                 {activeModule === 'subempreiteiros' && (
           editingObra ? (
             <GestaoSubempreiteiros
               subempreiteiros={editingObra?.subempreiteiros || []}
               onSubempreiteirosChange={(subempreiteiros) => {
                 if (editingObra) {
                   const updatedObra = { ...editingObra, subempreiteiros };
                   setEditingObra(updatedObra);
                   // Update in obras list
                   const updatedObras = obras.map(o => 
                     o.id === editingObra.id ? updatedObra : o
                   );
                   setObras(updatedObras);
                   saveMockObras(updatedObras);
                 }
               }}
             />
           ) : (
             <div className="text-center py-12">
               <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma Obra</h3>
               <p className="text-gray-600">Selecione uma obra da lista para gerir os subempreiteiros</p>
               <div className="mt-6">
                 <button
                   onClick={() => setActiveModule('dashboard')}
                   className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                 >
                   <BarChart3 className="h-4 w-4 mr-2" />
                   Voltar ao Dashboard
                 </button>
               </div>
             </div>
           )
         )}

        {activeModule === 'metricas' && (
          editingObra ? (
            <MetricasEVMComponent
              metricas={editingObra?.metricas_evm || {
                id: '1',
                pv: 0,
                ev: 0,
                ac: 0,
                bac: 0,
                spi: 0,
                cpi: 0,
                sv: 0,
                cv: 0,
                eac: 0,
                etc: 0,
                vac: 0,
                data_criacao: new Date().toISOString(),
                data_atualizacao: new Date().toISOString()
              }}
              indicadores={editingObra?.indicadores_performance || []}
              onMetricasChange={(metricas) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, metricas_evm: metricas };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
              onIndicadoresChange={(indicadores) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, indicadores_performance: indicadores };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
            />
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma Obra</h3>
              <p className="text-gray-600 mb-6">Selecione uma obra da lista para ver as métricas EVM</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setActiveModule('dashboard')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </button>
                {obras.length > 0 && (
                  <button
                    onClick={() => handleEditObra(obras[0])}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Selecionar Primeira Obra
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {activeModule === 'documentacao' && (
          editingObra ? (
            <DocumentacaoObraComponent
              documentacao={editingObra?.documentacao || {
                id: '1',
                versao: '1.0',
                responsavel: 'Eng. Responsável',
                data_criacao: new Date().toISOString(),
                data_revisao: new Date().toISOString(),
                categorias: [],
                templates: [],
                procedimentos_aprovacao: []
              }}
              licencas={editingObra?.licencas_autorizacoes || []}
              certificacoes={editingObra?.certificacoes_obrigatorias || []}
              onDocumentacaoChange={(documentacao) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, documentacao };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
              onLicencasChange={(licencas) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, licencas_autorizacoes: licencas };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
              onCertificacoesChange={(certificacoes) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, certificacoes_obrigatorias: certificacoes };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
            />
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma Obra</h3>
              <p className="text-gray-600 mb-6">Selecione uma obra da lista para gerir a documentação</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setActiveModule('dashboard')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </button>
                {obras.length > 0 && (
                  <button
                    onClick={() => handleEditObra(obras[0])}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Selecionar Primeira Obra
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {activeModule === 'financeiro' && (
          editingObra ? (
            <GestaoFinanceira
              gestaoFinanceira={editingObra?.gestao_financeira || {
                id: '1',
                orcamento_total: 0,
                valor_executado: 0,
                valor_pendente: 0,
                fluxo_caixa: [],
                indicadores_financeiros: [],
                data_criacao: new Date().toISOString(),
                data_atualizacao: new Date().toISOString()
              }}
              orcamentos={editingObra?.orcamentos_detalhados || []}
              controloCustos={editingObra?.controlo_custos || []}
              onGestaoFinanceiraChange={(gestao) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, gestao_financeira: gestao };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
              onOrcamentosChange={(orcamentos) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, orcamentos_detalhados: orcamentos };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
              onControloCustosChange={(controlo) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, controlo_custos: controlo };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
            />
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma Obra</h3>
              <p className="text-gray-600 mb-6">Selecione uma obra da lista para gerir as finanças</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setActiveModule('dashboard')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </button>
                {obras.length > 0 && (
                  <button
                    onClick={() => handleEditObra(obras[0])}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Selecionar Primeira Obra
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {activeModule === 'qualidade' && (
          editingObra ? (
            <QualidadeSeguranca
              planoQualidade={editingObra?.plano_qualidade || {
                id: '1',
                versao: '1.0',
                responsavel: 'Eng. Qualidade',
                data_criacao: new Date().toISOString(),
                data_revisao: new Date().toISOString(),
                objetivos_qualidade: [],
                procedimentos_qualidade: []
              }}
              planoSeguranca={editingObra?.plano_seguranca || {
                id: '1',
                versao: '1.0',
                responsavel: 'Coord. Segurança',
                data_criacao: new Date().toISOString(),
                data_revisao: new Date().toISOString(),
                equipamentos_protecao: [],
                procedimentos_seguranca: []
              }}
              inspecoes={editingObra?.inspecoes_qualidade || []}
              acidentes={editingObra?.acidentes_incidentes || []}
              onPlanoQualidadeChange={(plano) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, plano_qualidade: plano };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
              onPlanoSegurancaChange={(plano) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, plano_seguranca: plano };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
              onInspecoesChange={(inspecoes) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, inspecoes_qualidade: inspecoes };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
              onAcidentesChange={(acidentes) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, acidentes_incidentes: acidentes };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
            />
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma Obra</h3>
              <p className="text-gray-600 mb-6">Selecione uma obra da lista para gerir qualidade e segurança</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setActiveModule('dashboard')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </button>
                {obras.length > 0 && (
                  <button
                    onClick={() => handleEditObra(obras[0])}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Selecionar Primeira Obra
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {activeModule === 'ambiente' && (
          editingObra ? (
            <GestaoAmbiental
              gestaoAmbiental={editingObra?.gestao_ambiental || {
                id: '1',
                versao_plano: '1.0',
                responsavel_ambiental: 'Eng. Ambiente',
                data_criacao: new Date().toISOString(),
                data_revisao_plano: new Date().toISOString(),
                objetivos_ambientais: [],
                impactos_ambientais: [],
                medidas_mitigacao: [],
                recursos_ambientais: [],
                monitorizacao_ambiental: []
              }}
              certificacoes={editingObra?.certificacoes_ambientais || []}
              onGestaoAmbientalChange={(gestao) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, gestao_ambiental: gestao };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
              onCertificacoesChange={(certificacoes) => {
                if (editingObra) {
                  const updatedObra = { ...editingObra, certificacoes_ambientais: certificacoes };
                  setEditingObra(updatedObra);
                  const updatedObras = obras.map(o => 
                    o.id === editingObra.id ? updatedObra : o
                  );
                  setObras(updatedObras);
                }
              }}
            />
          ) : (
            <div className="text-center py-12">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione uma Obra</h3>
              <p className="text-gray-600 mb-6">Selecione uma obra da lista para gerir o ambiente</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setActiveModule('dashboard')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </button>
                {obras.length > 0 && (
                  <button
                    onClick={() => handleEditObra(obras[0])}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Selecionar Primeira Obra
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </motion.div>

      {/* Lista de Obras - Ultra Premium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-6"
      >
        {filteredObras.map((obra, index) => (
          <motion.div
            key={obra.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 + index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/3 to-indigo-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <Building2 className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{obra.nome}</h3>
                      <span className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-lg border border-blue-400/30">
                        {getStatusText(obra.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Código:</span>
                        <span>{obra.codigo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Cliente:</span>
                        <span>{obra.cliente}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Localização:</span>
                        <span>{obra.localizacao}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Responsável:</span>
                        <span>{obra.responsavel_tecnico}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Progresso</span>
                        <span className="text-sm font-bold text-blue-600">{obra.percentual_execucao}%</span>
                      </div>
                      <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-3 shadow-inner">
                        <div 
                          className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden" 
                          style={{ width: `${obra.percentual_execucao}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => handleEditObra(obra)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        EDITAR
                      </button>
                      <button 
                        onClick={() => handleRelatorioObra(obra)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        RELATÓRIO
                      </button>
                      <button 
                        onClick={() => handleExportObra(obra)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        EXPORTAR
                      </button>
                      <button 
                        onClick={() => handleShareObra(obra)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        PARTILHAR
                      </button>
                      <button 
                        onClick={() => handleDeleteObra(obra)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        EXCLUIR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modais e Componentes */}
      <AnimatePresence>
        {/* Modal de Edição */}
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ObraForm
                initialData={editingObra}
                onSubmit={async (data) => {
                  try {
                    if (editingObra) {
                      await obrasAPI.update(editingObra.id, data);
                      toast.success('Obra atualizada com sucesso!');
                    } else {
                      await obrasAPI.create(data);
                      toast.success('Obra criada com sucesso!');
                    }
                    setShowModal(false);
                    // Recarregar obras
                    const loadedObras = await obrasAPI.getAll();
                    setObras(loadedObras || mockObras);
                  } catch (error) {
                    console.error('Erro ao salvar obra:', error);
                    toast.error('Erro ao salvar obra');
                  }
                }}
                onCancel={() => setShowModal(false)}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Modal de Relatórios */}
        {showRelatorios && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRelatorios(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <RelatorioObrasPremium
                obras={editingObra ? [editingObra] : obras}
                onClose={() => setShowRelatorios(false)}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Modal de Partilha */}
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <ShareObraModal
                obra={editingObra}
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Modal de Obras Guardadas */}
        {showSavedObrasViewer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSavedObrasViewer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <SavedObrasViewer
                isOpen={showSavedObrasViewer}
                onClose={() => setShowSavedObrasViewer(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
