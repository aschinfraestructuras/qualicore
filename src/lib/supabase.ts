import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do Supabase
export interface Database {
  public: {
    Tables: {
      obras: {
        Row: {
          id: string;
          codigo: string;
          nome: string;
          cliente: string;
          localizacao: string;
          data_inicio: string;
          data_fim_prevista: string;
          data_fim_real: string | null;
          valor_contrato: number;
          valor_executado: number;
          percentual_execucao: number;
          status:
            | "planeamento"
            | "em_execucao"
            | "paralisada"
            | "concluida"
            | "cancelada";
          tipo_obra:
            | "residencial"
            | "comercial"
            | "industrial"
            | "infraestrutura"
            | "reabilitacao"
            | "outro";
          categoria: "pequena" | "media" | "grande" | "mega";
          responsavel_tecnico: string;
          coordenador_obra: string;
          fiscal_obra: string;
          engenheiro_responsavel: string;
          arquiteto: string;
          fornecedores_principais: string[];
          observacoes: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          codigo: string;
          nome: string;
          cliente: string;
          localizacao: string;
          data_inicio: string;
          data_fim_prevista: string;
          data_fim_real?: string | null;
          valor_contrato?: number;
          valor_executado?: number;
          percentual_execucao?: number;
          status?:
            | "planeamento"
            | "em_execucao"
            | "paralisada"
            | "concluida"
            | "cancelada";
          tipo_obra?:
            | "residencial"
            | "comercial"
            | "industrial"
            | "infraestrutura"
            | "reabilitacao"
            | "outro";
          categoria?: "pequena" | "media" | "grande" | "mega";
          responsavel_tecnico: string;
          coordenador_obra: string;
          fiscal_obra: string;
          engenheiro_responsavel: string;
          arquiteto: string;
          fornecedores_principais?: string[];
          observacoes?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          codigo?: string;
          nome?: string;
          cliente?: string;
          localizacao?: string;
          data_inicio?: string;
          data_fim_prevista?: string;
          data_fim_real?: string | null;
          valor_contrato?: number;
          valor_executado?: number;
          percentual_execucao?: number;
          status?:
            | "planeamento"
            | "em_execucao"
            | "paralisada"
            | "concluida"
            | "cancelada";
          tipo_obra?:
            | "residencial"
            | "comercial"
            | "industrial"
            | "infraestrutura"
            | "reabilitacao"
            | "outro";
          categoria?: "pequena" | "media" | "grande" | "mega";
          responsavel_tecnico?: string;
          coordenador_obra?: string;
          fiscal_obra?: string;
          engenheiro_responsavel?: string;
          arquiteto?: string;
          fornecedores_principais?: string[];
          observacoes?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      fornecedores: {
        Row: {
          id: string;
          nome: string;
          nif: string;
          morada: string;
          telefone: string;
          email: string;
          contacto: string;
          estado: "ativo" | "inativo";
          website: string | null;
          certificacoes: string | null;
          produtos_servicos: string | null;
          observacoes: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          nif: string;
          morada: string;
          telefone: string;
          email: string;
          contacto: string;
          estado?: "ativo" | "inativo";
          website?: string | null;
          certificacoes?: string | null;
          produtos_servicos?: string | null;
          observacoes?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          nif?: string;
          morada?: string;
          telefone?: string;
          email?: string;
          contacto?: string;
          estado?: "ativo" | "inativo";
          website?: string | null;
          certificacoes?: string | null;
          produtos_servicos?: string | null;
          observacoes?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      materiais: {
        Row: {
          id: string;
          codigo: string;
          nome: string;
          tipo: "betao" | "aco" | "agregado" | "cimento" | "outro";
          fornecedor_id: string | null;
          certificado_id: string | null;
          data_rececao: string;
          quantidade: number;
          unidade: string;
          lote: string;
          responsavel: string;
          zona: string;
          estado:
            | "pendente"
            | "em_analise"
            | "aprovado"
            | "reprovado"
            | "concluido";
          observacoes: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          codigo: string;
          nome: string;
          tipo: "betao" | "aco" | "agregado" | "cimento" | "outro";
          fornecedor_id?: string | null;
          certificado_id?: string | null;
          data_rececao: string;
          quantidade: number;
          unidade: string;
          lote: string;
          responsavel: string;
          zona: string;
          estado?:
            | "pendente"
            | "em_analise"
            | "aprovado"
            | "reprovado"
            | "concluido";
          observacoes?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          codigo?: string;
          nome?: string;
          tipo?: "betao" | "aco" | "agregado" | "cimento" | "outro";
          fornecedor_id?: string | null;
          certificado_id?: string | null;
          data_rececao?: string;
          quantidade?: number;
          unidade?: string;
          lote?: string;
          responsavel?: string;
          zona?: string;
          estado?:
            | "pendente"
            | "em_analise"
            | "aprovado"
            | "reprovado"
            | "concluido";
          observacoes?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      ensaios: {
        Row: {
          id: string;
          codigo: string;
          tipo: string;
          material_id: string | null;
          resultado: string;
          valor_obtido: number;
          valor_esperado: number;
          unidade: string;
          laboratorio: string;
          data_ensaio: string;
          conforme: boolean;
          responsavel: string;
          zona: string;
          estado:
            | "pendente"
            | "em_analise"
            | "aprovado"
            | "reprovado"
            | "concluido";
          observacoes: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          codigo: string;
          tipo: string;
          material_id?: string | null;
          resultado: string;
          valor_obtido: number;
          valor_esperado: number;
          unidade: string;
          laboratorio: string;
          data_ensaio: string;
          conforme?: boolean;
          responsavel: string;
          zona: string;
          estado?:
            | "pendente"
            | "em_analise"
            | "aprovado"
            | "reprovado"
            | "concluido";
          observacoes?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          codigo?: string;
          tipo?: string;
          material_id?: string | null;
          resultado?: string;
          valor_obtido?: number;
          valor_esperado?: number;
          unidade?: string;
          laboratorio?: string;
          data_ensaio?: string;
          conforme?: boolean;
          responsavel?: string;
          zona?: string;
          estado?:
            | "pendente"
            | "em_analise"
            | "aprovado"
            | "reprovado"
            | "concluido";
          observacoes?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      checklists: {
        Row: {
          id: string;
          codigo: string;
          obra_id: string | null;
          titulo: string;
          status: "em_andamento" | "concluido" | "aprovado" | "reprovado";
          responsavel: string;
          zona: string;
          estado:
            | "pendente"
            | "em_analise"
            | "aprovado"
            | "reprovado"
            | "concluido";
          observacoes: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          codigo: string;
          obra_id?: string | null;
          titulo: string;
          status?: "em_andamento" | "concluido" | "aprovado" | "reprovado";
          responsavel: string;
          zona: string;
          estado?:
            | "pendente"
            | "em_analise"
            | "aprovado"
            | "reprovado"
            | "concluido";
          observacoes?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          codigo?: string;
          obra_id?: string | null;
          titulo?: string;
          status?: "em_andamento" | "concluido" | "aprovado" | "reprovado";
          responsavel?: string;
          zona?: string;
          estado?:
            | "pendente"
            | "em_analise"
            | "aprovado"
            | "reprovado"
            | "concluido";
          observacoes?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      documentos: {
        Row: {
          id: string;
          codigo: string;
          tipo: string;
          tipo_outro: string | null;
          versao: string;
          data_validade: string | null;
          data_aprovacao: string | null;
          data_revisao: string | null;
          responsavel: string;
          zona: string;
          estado:
            | "pendente"
            | "em_analise"
            | "aprovado"
            | "reprovado"
            | "concluido";
          aprovador: string | null;
          revisor: string | null;
          categoria: string | null;
          categoria_outro: string | null;
          observacoes: string | null;
          palavras_chave: string[];
          classificacao_confidencialidade: string | null;
          distribuicao: string[];
          numero_rfi: string | null;
          solicitante: string | null;
          data_solicitacao: string | null;
          data_resposta: string | null;
          prioridade: string | null;
          impacto_custo: number | null;
          impacto_prazo: number | null;
          resposta: string | null;
          escopo: string | null;
          responsabilidades: string[];
          recursos_necessarios: string[];
          criterios_aceitacao: string[];
          registros_obrigatorios: string[];
          frequencia_revisao: string | null;
          material_ensaio: string | null;
          tipo_ensaio: string | null;
          normas_referencia: string[];
          equipamentos_necessarios: string[];
          laboratorio_responsavel: string | null;
          frequencia_ensaios: string | null;
          acoes_nao_conformidade: string[];
          escopo_obra: string | null;
          objetivos_qualidade: string[];
          responsabilidades_qualidade: string[];
          recursos_qualidade: string[];
          controlos_qualidade: string[];
          indicadores_qualidade: string[];
          auditorias_planeadas: string[];
          acoes_melhoria: string[];
          relacionado_obra_id: string | null;
          relacionado_obra_outro: string | null;
          relacionado_zona_id: string | null;
          relacionado_zona_outro: string | null;
          relacionado_ensaio_id: string | null;
          relacionado_ensaio_outro: string | null;
          relacionado_material_id: string | null;
          relacionado_material_outro: string | null;
          relacionado_fornecedor_id: string | null;
          relacionado_fornecedor_outro: string | null;
          relacionado_checklist_id: string | null;
          relacionado_checklist_outro: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          codigo: string;
          tipo: string;
          tipo_outro?: string | null;
          versao: string;
          data_validade?: string | null;
          data_aprovacao?: string | null;
          data_revisao?: string | null;
          responsavel: string;
          zona: string;
          estado?:
            | "pendente"
            | "em_analise"
            | "aprovado"
            | "reprovado"
            | "concluido";
          aprovador?: string | null;
          revisor?: string | null;
          categoria?: string | null;
          categoria_outro?: string | null;
          observacoes?: string | null;
          palavras_chave?: string[];
          classificacao_confidencialidade?: string | null;
          distribuicao?: string[];
          numero_rfi?: string | null;
          solicitante?: string | null;
          data_solicitacao?: string | null;
          data_resposta?: string | null;
          prioridade?: string | null;
          impacto_custo?: number | null;
          impacto_prazo?: number | null;
          resposta?: string | null;
          escopo?: string | null;
          responsabilidades?: string[];
          recursos_necessarios?: string[];
          criterios_aceitacao?: string[];
          registros_obrigatorios?: string[];
          frequencia_revisao?: string | null;
          material_ensaio?: string | null;
          tipo_ensaio?: string | null;
          normas_referencia?: string[];
          equipamentos_necessarios?: string[];
          laboratorio_responsavel?: string | null;
          frequencia_ensaios?: string | null;
          acoes_nao_conformidade?: string[];
          escopo_obra?: string | null;
          objetivos_qualidade?: string[];
          responsabilidades_qualidade?: string[];
          recursos_qualidade?: string[];
          controlos_qualidade?: string[];
          indicadores_qualidade?: string[];
          auditorias_planeadas?: string[];
          acoes_melhoria?: string[];
          relacionado_obra_id?: string | null;
          relacionado_obra_outro?: string | null;
          relacionado_zona_id?: string | null;
          relacionado_zona_outro?: string | null;
          relacionado_ensaio_id?: string | null;
          relacionado_ensaio_outro?: string | null;
          relacionado_material_id?: string | null;
          relacionado_material_outro?: string | null;
          relacionado_fornecedor_id?: string | null;
          relacionado_fornecedor_outro?: string | null;
          relacionado_checklist_id?: string | null;
          relacionado_checklist_outro?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          codigo?: string;
          tipo?: string;
          tipo_outro?: string | null;
          versao?: string;
          data_validade?: string | null;
          data_aprovacao?: string | null;
          data_revisao?: string | null;
          responsavel?: string;
          zona?: string;
          estado?:
            | "pendente"
            | "em_analise"
            | "aprovado"
            | "reprovado"
            | "concluido";
          aprovador?: string | null;
          revisor?: string | null;
          categoria?: string | null;
          categoria_outro?: string | null;
          observacoes?: string | null;
          palavras_chave?: string[];
          classificacao_confidencialidade?: string | null;
          distribuicao?: string[];
          numero_rfi?: string | null;
          solicitante?: string | null;
          data_solicitacao?: string | null;
          data_resposta?: string | null;
          prioridade?: string | null;
          impacto_custo?: number | null;
          impacto_prazo?: number | null;
          resposta?: string | null;
          escopo?: string | null;
          responsabilidades?: string[];
          recursos_necessarios?: string[];
          criterios_aceitacao?: string[];
          registros_obrigatorios?: string[];
          frequencia_revisao?: string | null;
          material_ensaio?: string | null;
          tipo_ensaio?: string | null;
          normas_referencia?: string[];
          equipamentos_necessarios?: string[];
          laboratorio_responsavel?: string | null;
          frequencia_ensaios?: string | null;
          acoes_nao_conformidade?: string[];
          escopo_obra?: string | null;
          objetivos_qualidade?: string[];
          responsabilidades_qualidade?: string[];
          recursos_qualidade?: string[];
          controlos_qualidade?: string[];
          indicadores_qualidade?: string[];
          auditorias_planeadas?: string[];
          acoes_melhoria?: string[];
          relacionado_obra_id?: string | null;
          relacionado_obra_outro?: string | null;
          relacionado_zona_id?: string | null;
          relacionado_zona_outro?: string | null;
          relacionado_ensaio_id?: string | null;
          relacionado_ensaio_outro?: string | null;
          relacionado_material_id?: string | null;
          relacionado_material_outro?: string | null;
          relacionado_fornecedor_id?: string | null;
          relacionado_fornecedor_outro?: string | null;
          relacionado_checklist_id?: string | null;
          relacionado_checklist_outro?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      nao_conformidades: {
        Row: {
          id: string;
          codigo: string;
          tipo: string;
          tipo_outro: string | null;
          severidade: "baixa" | "media" | "alta" | "critica";
          categoria: string;
          categoria_outro: string | null;
          data_deteccao: string;
          data_resolucao: string | null;
          data_limite_resolucao: string | null;
          data_verificacao_eficacia: string | null;
          descricao: string;
          causa_raiz: string | null;
          impacto: "baixo" | "medio" | "alto" | "critico";
          area_afetada: string;
          responsavel_deteccao: string;
          responsavel_resolucao: string | null;
          responsavel_verificacao: string | null;
          acao_corretiva: string | null;
          acao_preventiva: string | null;
          medidas_implementadas: string[];
          custo_estimado: number | null;
          custo_real: number | null;
          custo_preventivo: number | null;
          observacoes: string | null;
          relacionado_ensaio_id: string | null;
          relacionado_ensaio_outro: string | null;
          relacionado_material_id: string | null;
          relacionado_material_outro: string | null;
          relacionado_checklist_id: string | null;
          relacionado_checklist_outro: string | null;
          relacionado_documento_id: string | null;
          relacionado_fornecedor_id: string | null;
          relacionado_fornecedor_outro: string | null;
          relacionado_obra_id: string | null;
          relacionado_obra_outro: string | null;
          relacionado_zona_id: string | null;
          relacionado_zona_outro: string | null;
          auditoria_id: string | null;
          auditoria_outro: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          codigo: string;
          tipo: string;
          tipo_outro?: string | null;
          severidade: "baixa" | "media" | "alta" | "critica";
          categoria: string;
          categoria_outro?: string | null;
          data_deteccao: string;
          data_resolucao?: string | null;
          data_limite_resolucao?: string | null;
          data_verificacao_eficacia?: string | null;
          descricao: string;
          causa_raiz?: string | null;
          impacto: "baixo" | "medio" | "alto" | "critico";
          area_afetada: string;
          responsavel_deteccao: string;
          responsavel_resolucao?: string | null;
          responsavel_verificacao?: string | null;
          acao_corretiva?: string | null;
          acao_preventiva?: string | null;
          medidas_implementadas?: string[];
          custo_estimado?: number | null;
          custo_real?: number | null;
          custo_preventivo?: number | null;
          observacoes?: string | null;
          relacionado_ensaio_id?: string | null;
          relacionado_ensaio_outro?: string | null;
          relacionado_material_id?: string | null;
          relacionado_material_outro?: string | null;
          relacionado_checklist_id?: string | null;
          relacionado_checklist_outro?: string | null;
          relacionado_documento_id?: string | null;
          relacionado_fornecedor_id?: string | null;
          relacionado_fornecedor_outro?: string | null;
          relacionado_obra_id?: string | null;
          relacionado_obra_outro?: string | null;
          relacionado_zona_id?: string | null;
          relacionado_zona_outro?: string | null;
          auditoria_id?: string | null;
          auditoria_outro?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          codigo?: string;
          tipo?: string;
          tipo_outro?: string | null;
          severidade?: "baixa" | "media" | "alta" | "critica";
          categoria?: string;
          categoria_outro?: string | null;
          data_deteccao?: string;
          data_resolucao?: string | null;
          data_limite_resolucao?: string | null;
          data_verificacao_eficacia?: string | null;
          descricao?: string;
          causa_raiz?: string | null;
          impacto?: "baixo" | "medio" | "alto" | "critico";
          area_afetada?: string;
          responsavel_deteccao?: string;
          responsavel_resolucao?: string | null;
          responsavel_verificacao?: string | null;
          acao_corretiva?: string | null;
          acao_preventiva?: string | null;
          medidas_implementadas?: string[];
          custo_estimado?: number | null;
          custo_real?: number | null;
          custo_preventivo?: number | null;
          observacoes?: string | null;
          relacionado_ensaio_id?: string | null;
          relacionado_ensaio_outro?: string | null;
          relacionado_material_id?: string | null;
          relacionado_material_outro?: string | null;
          relacionado_checklist_id?: string | null;
          relacionado_checklist_outro?: string | null;
          relacionado_documento_id?: string | null;
          relacionado_fornecedor_id?: string | null;
          relacionado_fornecedor_outro?: string | null;
          relacionado_obra_id?: string | null;
          relacionado_obra_outro?: string | null;
          relacionado_zona_id?: string | null;
          relacionado_zona_outro?: string | null;
          auditoria_id?: string | null;
          auditoria_outro?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      rfis: {
        Row: {
          id: string;
          codigo: string;
          numero: string;
          titulo: string;
          descricao: string;
          solicitante: string;
          destinatario: string;
          data_solicitacao: string;
          data_resposta: string | null;
          prioridade: "baixa" | "media" | "alta" | "urgente";
          status: "pendente" | "em_analise" | "respondido" | "fechado";
          resposta: string | null;
          impacto_custo: number | null;
          impacto_prazo: number | null;
          observacoes: string | null;
          relacionado_obra_id: string | null;
          relacionado_zona_id: string | null;
          relacionado_documento_id: string | null;
          relacionado_ensaio_id: string | null;
          relacionado_material_id: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          codigo: string;
          numero: string;
          titulo: string;
          descricao: string;
          solicitante: string;
          destinatario: string;
          data_solicitacao: string;
          data_resposta?: string | null;
          prioridade: "baixa" | "media" | "alta" | "urgente";
          status?: "pendente" | "em_analise" | "respondido" | "fechado";
          resposta?: string | null;
          impacto_custo?: number | null;
          impacto_prazo?: number | null;
          observacoes?: string | null;
          relacionado_obra_id?: string | null;
          relacionado_zona_id?: string | null;
          relacionado_documento_id?: string | null;
          relacionado_ensaio_id?: string | null;
          relacionado_material_id?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          codigo?: string;
          numero?: string;
          titulo?: string;
          descricao?: string;
          solicitante?: string;
          destinatario?: string;
          data_solicitacao?: string;
          data_resposta?: string | null;
          prioridade?: "baixa" | "media" | "alta" | "urgente";
          status?: "pendente" | "em_analise" | "respondido" | "fechado";
          resposta?: string | null;
          impacto_custo?: number | null;
          impacto_prazo?: number | null;
          observacoes?: string | null;
          relacionado_obra_id?: string | null;
          relacionado_zona_id?: string | null;
          relacionado_documento_id?: string | null;
          relacionado_ensaio_id?: string | null;
          relacionado_material_id?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateDto<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
