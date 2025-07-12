import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas do Supabase
export interface Database {
  public: {
    Tables: {
      documentos: {
        Row: {
          id: string
          codigo: string
          tipo: string
          versao: string
          data_validade: string | null
          fornecedor_id: string | null
          responsavel: string
          zona: string
          estado: string
          observacoes: string | null
          data_criacao: string
          data_atualizacao: string
        }
        Insert: {
          id?: string
          codigo: string
          tipo: string
          versao: string
          data_validade?: string | null
          fornecedor_id?: string | null
          responsavel: string
          zona: string
          estado: string
          observacoes?: string | null
          data_criacao?: string
          data_atualizacao?: string
        }
        Update: {
          id?: string
          codigo?: string
          tipo?: string
          versao?: string
          data_validade?: string | null
          fornecedor_id?: string | null
          responsavel?: string
          zona?: string
          estado?: string
          observacoes?: string | null
          data_criacao?: string
          data_atualizacao?: string
        }
      }
      ensaios: {
        Row: {
          id: string
          codigo: string
          tipo: string
          material_id: string
          resultado: string
          valor_obtido: number
          valor_esperado: number
          unidade: string
          laboratorio: string
          data_ensaio: string
          conforme: boolean
          responsavel: string
          zona: string
          estado: string
          observacoes: string | null
          data_criacao: string
          data_atualizacao: string
        }
        Insert: {
          id?: string
          codigo: string
          tipo: string
          material_id: string
          resultado: string
          valor_obtido: number
          valor_esperado: number
          unidade: string
          laboratorio: string
          data_ensaio: string
          conforme: boolean
          responsavel: string
          zona: string
          estado: string
          observacoes?: string | null
          data_criacao?: string
          data_atualizacao?: string
        }
        Update: {
          id?: string
          codigo?: string
          tipo?: string
          material_id?: string
          resultado?: string
          valor_obtido?: number
          valor_esperado?: number
          unidade?: string
          laboratorio?: string
          data_ensaio?: string
          conforme?: boolean
          responsavel?: string
          zona?: string
          estado?: string
          observacoes?: string | null
          data_criacao?: string
          data_atualizacao?: string
        }
      }
      checklists: {
        Row: {
          id: string
          codigo: string
          tipo: string
          itens: any
          percentual_conformidade: number
          data_inspecao: string
          inspetor: string
          responsavel: string
          zona: string
          estado: string
          observacoes: string | null
          data_criacao: string
          data_atualizacao: string
        }
        Insert: {
          id?: string
          codigo: string
          tipo: string
          itens: any
          percentual_conformidade: number
          data_inspecao: string
          inspetor: string
          responsavel: string
          zona: string
          estado: string
          observacoes?: string | null
          data_criacao?: string
          data_atualizacao?: string
        }
        Update: {
          id?: string
          codigo?: string
          tipo?: string
          itens?: any
          percentual_conformidade?: number
          data_inspecao?: string
          inspetor?: string
          responsavel?: string
          zona?: string
          estado?: string
          observacoes?: string | null
          data_criacao?: string
          data_atualizacao?: string
        }
      }
      materiais: {
        Row: {
          id: string
          codigo: string
          nome: string
          tipo: string
          fornecedor_id: string
          certificado_id: string | null
          data_rececao: string
          quantidade: number
          unidade: string
          lote: string
          responsavel: string
          zona: string
          estado: string
          observacoes: string | null
          data_criacao: string
          data_atualizacao: string
        }
        Insert: {
          id?: string
          codigo: string
          nome: string
          tipo: string
          fornecedor_id: string
          certificado_id?: string | null
          data_rececao: string
          quantidade: number
          unidade: string
          lote: string
          responsavel: string
          zona: string
          estado: string
          observacoes?: string | null
          data_criacao?: string
          data_atualizacao?: string
        }
        Update: {
          id?: string
          codigo?: string
          nome?: string
          tipo?: string
          fornecedor_id?: string
          certificado_id?: string | null
          data_rececao?: string
          quantidade?: number
          unidade?: string
          lote?: string
          responsavel?: string
          zona?: string
          estado?: string
          observacoes?: string | null
          data_criacao?: string
          data_atualizacao?: string
        }
      }
      fornecedores: {
        Row: {
          id: string
          nome: string
          nif: string
          morada: string
          telefone: string
          email: string
          contacto: string
          data_registo: string
          estado: string
        }
        Insert: {
          id?: string
          nome: string
          nif: string
          morada: string
          telefone: string
          email: string
          contacto: string
          data_registo?: string
          estado?: string
        }
        Update: {
          id?: string
          nome?: string
          nif?: string
          morada?: string
          telefone?: string
          email?: string
          contacto?: string
          data_registo?: string
          estado?: string
        }
      }
      nao_conformidades: {
        Row: {
          id: string
          codigo: string
          tipo: string
          severidade: string
          data_deteccao: string
          data_resolucao: string | null
          acao_corretiva: string | null
          responsavel_resolucao: string | null
          custo_estimado: number | null
          relacionado_ensaio_id: string | null
          relacionado_material_id: string | null
          responsavel: string
          zona: string
          estado: string
          observacoes: string | null
          data_criacao: string
          data_atualizacao: string
        }
        Insert: {
          id?: string
          codigo: string
          tipo: string
          severidade: string
          data_deteccao: string
          data_resolucao?: string | null
          acao_corretiva?: string | null
          responsavel_resolucao?: string | null
          custo_estimado?: number | null
          relacionado_ensaio_id?: string | null
          relacionado_material_id?: string | null
          responsavel: string
          zona: string
          estado: string
          observacoes?: string | null
          data_criacao?: string
          data_atualizacao?: string
        }
        Update: {
          id?: string
          codigo?: string
          tipo?: string
          severidade?: string
          data_deteccao?: string
          data_resolucao?: string | null
          acao_corretiva?: string | null
          responsavel_resolucao?: string | null
          custo_estimado?: number | null
          relacionado_ensaio_id?: string | null
          relacionado_material_id?: string | null
          responsavel?: string
          zona?: string
          estado?: string
          observacoes?: string | null
          data_criacao?: string
          data_atualizacao?: string
        }
      }
      anexos: {
        Row: {
          id: string
          nome: string
          tipo: string
          tamanho: number
          url: string
          data_upload: string
          entidade_id: string
          entidade_tipo: string
        }
        Insert: {
          id?: string
          nome: string
          tipo: string
          tamanho: number
          url: string
          data_upload?: string
          entidade_id: string
          entidade_tipo: string
        }
        Update: {
          id?: string
          nome?: string
          tipo?: string
          tamanho?: number
          url?: string
          data_upload?: string
          entidade_id?: string
          entidade_tipo?: string
        }
      }
    }
  }
} 