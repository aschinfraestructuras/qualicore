import { supabase } from "./supabase";
import type { Tables, InsertDto, UpdateDto } from "./supabase";

// =====================================================
// TIPOS DE DADOS
// =====================================================

export type Obra = Tables<"obras">;
export type Fornecedor = Tables<"fornecedores">;
export type Material = Tables<"materiais">;
export type Ensaio = Tables<"ensaios">;
export type Checklist = Tables<"checklists">;
export type Documento = Tables<"documentos">;
export type NaoConformidade = Tables<"nao_conformidades">;
export type RFI = Tables<"rfis">;

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

const handleError = (error: any, operation: string) => {
  console.error(`Erro na operação ${operation}:`, error);
  throw new Error(`Falha na operação ${operation}: ${error.message}`);
};

const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(`Erro de autenticação: ${error.message}`);
    }
    
    if (!user) {
      throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

// =====================================================
// API DE OBRAS
// =====================================================

export const obrasAPI = {
  getAll: async (): Promise<Obra[]> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("obras")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "listar obras");
      return [];
    }
  },

  getById: async (id: string): Promise<Obra | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("obras")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "buscar obra");
      return null;
    }
  },

  create: async (
    obra: Omit<InsertDto<"obras">, "user_id">,
  ): Promise<Obra | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("obras")
        .insert([{ ...obra, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "criar obra");
      return null;
    }
  },

  update: async (
    id: string,
    obra: UpdateDto<"obras">,
  ): Promise<Obra | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("obras")
        .update(obra)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "atualizar obra");
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const user = await getCurrentUser();
      const { error } = await supabase
        .from("obras")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, "deletar obra");
      return false;
    }
  },
};

// =====================================================
// API DE FORNECEDORES
// =====================================================

export const fornecedoresAPI = {
  getAll: async (): Promise<Fornecedor[]> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("user_id", user.id)
        .order("nome", { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "listar fornecedores");
      return [];
    }
  },

  getById: async (id: string): Promise<Fornecedor | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("fornecedores")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "buscar fornecedor");
      return null;
    }
  },

  create: async (
    fornecedor: Omit<InsertDto<"fornecedores">, "user_id">,
  ): Promise<Fornecedor | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("fornecedores")
        .insert([{ ...fornecedor, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "criar fornecedor");
      return null;
    }
  },

  update: async (
    id: string,
    fornecedor: UpdateDto<"fornecedores">,
  ): Promise<Fornecedor | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("fornecedores")
        .update(fornecedor)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "atualizar fornecedor");
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const user = await getCurrentUser();
      const { error } = await supabase
        .from("fornecedores")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, "deletar fornecedor");
      return false;
    }
  },
};

// =====================================================
// API DE MATERIAIS
// =====================================================

export const materiaisAPI = {
  getAll: async (): Promise<Material[]> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("materiais")
        .select(
          `
          *,
          fornecedores (
            id,
            nome,
            nif
          )
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "listar materiais");
      return [];
    }
  },

  getById: async (id: string): Promise<Material | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("materiais")
        .select(
          `
          *,
          fornecedores (
            id,
            nome,
            nif
          )
        `,
        )
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "buscar material");
      return null;
    }
  },

  create: async (
    material: Omit<InsertDto<"materiais">, "user_id">,
  ): Promise<Material | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("materiais")
        .insert([{ ...material, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "criar material");
      return null;
    }
  },

  update: async (
    id: string,
    material: UpdateDto<"materiais">,
  ): Promise<Material | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("materiais")
        .update(material)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "atualizar material");
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const user = await getCurrentUser();
      const { error } = await supabase
        .from("materiais")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, "deletar material");
      return false;
    }
  },
};

// =====================================================
// API DE ENSAIOS
// =====================================================

export const ensaiosAPI = {
  getAll: async (): Promise<Ensaio[]> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("ensaios")
        .select(
          `
          *,
          materiais (
            id,
            codigo,
            nome,
            tipo
          )
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "listar ensaios");
      return [];
    }
  },

  getById: async (id: string): Promise<Ensaio | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("ensaios")
        .select(
          `
          *,
          materiais (
            id,
            codigo,
            nome,
            tipo
          )
        `,
        )
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "buscar ensaio");
      return null;
    }
  },

  create: async (
    ensaio: Omit<InsertDto<"ensaios">, "user_id">,
  ): Promise<Ensaio | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("ensaios")
        .insert([{ ...ensaio, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "criar ensaio");
      return null;
    }
  },

  update: async (
    id: string,
    ensaio: UpdateDto<"ensaios">,
  ): Promise<Ensaio | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("ensaios")
        .update(ensaio)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "atualizar ensaio");
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const user = await getCurrentUser();
      const { error } = await supabase
        .from("ensaios")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, "deletar ensaio");
      return false;
    }
  },
};

// =====================================================
// API DE CHECKLISTS
// =====================================================

export const checklistsAPI = {
  getAll: async (): Promise<Checklist[]> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("checklists")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "listar checklists");
      return [];
    }
  },

  getById: async (id: string): Promise<Checklist | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("checklists")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "buscar checklist");
      return null;
    }
  },

  getWithPontos: async (id: string): Promise<any> => {
    try {
      const user = await getCurrentUser();

      // Buscar checklist
      const { data: checklist, error: checklistError } = await supabase
        .from("checklists")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (checklistError) throw checklistError;

      // Buscar pontos de inspeção
      const { data: pontos, error: pontosError } = await supabase
        .from("checklist_pontos")
        .select("*")
        .eq("checklist_id", id)
        .order("created_at", { ascending: true });

      if (pontosError) throw pontosError;

      return {
        ...checklist,
        pontos: pontos || [],
      };
    } catch (error) {
      handleError(error, "buscar checklist com pontos");
      return null;
    }
  },

  create: async (
    checklist: Omit<InsertDto<"checklists">, "user_id">,
  ): Promise<Checklist | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("checklists")
        .insert([{ ...checklist, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "criar checklist");
      return null;
    }
  },

  createWithPontos: async (
    checklist: any,
    pontos: any[],
  ): Promise<Checklist | null> => {
    try {
      const user = await getCurrentUser();

      // Filtrar apenas campos válidos do checklist
      const validChecklistFields = [
        "codigo",
        "obra_id",
        "titulo",
        "status",
        "responsavel",
        "zona",
        "estado",
        "observacoes",
      ];
      const filteredChecklist = Object.keys(checklist)
        .filter((key) => validChecklistFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = checklist[key];
          return obj;
        }, {} as any);

      // Criar checklist
      const { data: checklistData, error: checklistError } = await supabase
        .from("checklists")
        .insert([{ ...filteredChecklist, user_id: user.id }])
        .select()
        .single();

      if (checklistError) throw checklistError;

      // Criar pontos de inspeção se houver
      if (pontos && pontos.length > 0) {
        const pontosData = pontos.map((ponto) => ({
          checklist_id: checklistData.id,
          descricao: ponto.descricao || "",
          tipo: ponto.tipo || "",
          localizacao: ponto.localizacao || "",
          responsavel: ponto.responsavel || "",
          status: ponto.status || "pendente",
          data_inspecao:
            ponto.data_inspecao && ponto.data_inspecao !== ""
              ? ponto.data_inspecao
              : null,
          observacoes: ponto.observacoes || "",
          anexos: ponto.anexos || [],
          comentarios: ponto.comentarios || [],
          linha_tempo: ponto.linha_tempo || [],
          user_id: user.id,
        }));

        const { error: pontosError } = await supabase
          .from("checklist_pontos")
          .insert(pontosData);

        if (pontosError) throw pontosError;
      }

      return checklistData;
    } catch (error) {
      handleError(error, "criar checklist com pontos");
      return null;
    }
  },

  update: async (
    id: string,
    checklist: UpdateDto<"checklists">,
  ): Promise<Checklist | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("checklists")
        .update(checklist)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "atualizar checklist");
      return null;
    }
  },

  updateWithPontos: async (
    id: string,
    checklist: any,
    pontos: any[],
  ): Promise<Checklist | null> => {
    try {
      const user = await getCurrentUser();

      // Atualizar checklist
      const { data: checklistData, error: checklistError } = await supabase
        .from("checklists")
        .update(checklist)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (checklistError) throw checklistError;

      // Deletar pontos existentes
      const { error: deleteError } = await supabase
        .from("checklist_pontos")
        .delete()
        .eq("checklist_id", id);

      if (deleteError) throw deleteError;

      // Criar novos pontos se houver
      if (pontos && pontos.length > 0) {
        const pontosData = pontos.map((ponto) => ({
          checklist_id: id,
          descricao: ponto.descricao,
          tipo: ponto.tipo,
          localizacao: ponto.localizacao,
          responsavel: ponto.responsavel,
          status: ponto.status,
          data_inspecao: ponto.data_inspecao,
          observacoes: ponto.observacoes,
          anexos: ponto.anexos || [],
          comentarios: ponto.comentarios || [],
          linha_tempo: ponto.linha_tempo || [],
        }));

        const { error: pontosError } = await supabase
          .from("checklist_pontos")
          .insert(pontosData);

        if (pontosError) throw pontosError;
      }

      return checklistData;
    } catch (error) {
      handleError(error, "atualizar checklist com pontos");
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const user = await getCurrentUser();
      const { error } = await supabase
        .from("checklists")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, "deletar checklist");
      return false;
    }
  },
};

// =====================================================
// API DE DOCUMENTOS
// =====================================================

export const documentosAPI = {
  getAll: async (): Promise<Documento[]> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("documentos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "listar documentos");
      return [];
    }
  },

  getById: async (id: string): Promise<Documento | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("documentos")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "buscar documento");
      return null;
    }
  },

  create: async (
    documento: Omit<InsertDto<"documentos">, "user_id">,
  ): Promise<Documento | null> => {
    try {
      const user = await getCurrentUser();
      
      // Validar dados obrigatórios
      if (!documento.codigo || !documento.tipo || !documento.versao || !documento.responsavel || !documento.zona) {
        throw new Error("Dados obrigatórios em falta");
      }
      
      const insertData = { 
        ...documento, 
        user_id: user.id,
        estado: documento.estado || "pendente",
        classificacao_confidencialidade: documento.classificacao_confidencialidade || "publico"
      };
      
      const { data, error } = await supabase
        .from("documentos")
        .insert([insertData])
        .select()
        .single();

      if (error) {
        // Tratar erros específicos
        if (error.code === '23505') {
          throw new Error("Código do documento já existe");
        } else if (error.code === '23514') {
          throw new Error("Dados inválidos - verifique os campos obrigatórios");
        } else {
          throw error;
        }
      }
      
      if (!data) {
        throw new Error("Nenhum documento foi criado");
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Erro desconhecido ao criar documento");
      }
    }
  },

  update: async (
    id: string,
    documento: UpdateDto<"documentos">,
  ): Promise<Documento | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("documentos")
        .update(documento)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "atualizar documento");
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const user = await getCurrentUser();
      const { error } = await supabase
        .from("documentos")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, "deletar documento");
      return false;
    }
  },
};

// =====================================================
// API DE NÃO CONFORMIDADES
// =====================================================

export const naoConformidadesAPI = {
  getAll: async (): Promise<NaoConformidade[]> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("nao_conformidades")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "listar não conformidades");
      return [];
    }
  },

  getById: async (id: string): Promise<NaoConformidade | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("nao_conformidades")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "buscar não conformidade");
      return null;
    }
  },

  create: async (
    nc: Omit<InsertDto<"nao_conformidades">, "user_id">,
  ): Promise<NaoConformidade | null> => {
    try {
      const user = await getCurrentUser();

      // Filtrar apenas campos válidos da tabela nao_conformidades
      const validFields = [
        "codigo",
        "tipo",
        "tipo_outro",
        "severidade",
        "categoria",
        "categoria_outro",
        "data_deteccao",
        "data_resolucao",
        "data_limite_resolucao",
        "data_verificacao_eficacia",
        "descricao",
        "causa_raiz",
        "impacto",
        "area_afetada",
        "responsavel_deteccao",
        "responsavel_resolucao",
        "responsavel_verificacao",
        "acao_corretiva",
        "acao_preventiva",
        "medidas_implementadas",
        "custo_estimado",
        "custo_real",
        "custo_preventivo",
        "observacoes",
        "relacionado_ensaio_id",
        "relacionado_ensaio_outro",
        "relacionado_material_id",
        "relacionado_material_outro",
        "relacionado_checklist_id",
        "relacionado_checklist_outro",
        "relacionado_documento_id",
        "relacionado_fornecedor_id",
        "relacionado_fornecedor_outro",
        "relacionado_obra_id",
        "relacionado_obra_outro",
        "relacionado_zona_id",
        "relacionado_zona_outro",
        "auditoria_id",
        "auditoria_outro",
        "anexos_evidencia",
        "anexos_corretiva",
        "anexos_verificacao",
        "timeline",
      ];

      const filteredNc = Object.keys(nc)
        .filter((key) => validFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = nc[key];
          return obj;
        }, {} as any);

      const { data, error } = await supabase
        .from("nao_conformidades")
        .insert([{ ...filteredNc, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "criar não conformidade");
      return null;
    }
  },

  update: async (
    id: string,
    nc: UpdateDto<"nao_conformidades">,
  ): Promise<NaoConformidade | null> => {
    try {
      const user = await getCurrentUser();

      // Filtrar apenas campos válidos da tabela nao_conformidades
      const validFields = [
        "codigo",
        "tipo",
        "tipo_outro",
        "severidade",
        "categoria",
        "categoria_outro",
        "data_deteccao",
        "data_resolucao",
        "data_limite_resolucao",
        "data_verificacao_eficacia",
        "descricao",
        "causa_raiz",
        "impacto",
        "area_afetada",
        "responsavel_deteccao",
        "responsavel_resolucao",
        "responsavel_verificacao",
        "acao_corretiva",
        "acao_preventiva",
        "medidas_implementadas",
        "custo_estimado",
        "custo_real",
        "custo_preventivo",
        "observacoes",
        "relacionado_ensaio_id",
        "relacionado_ensaio_outro",
        "relacionado_material_id",
        "relacionado_material_outro",
        "relacionado_checklist_id",
        "relacionado_checklist_outro",
        "relacionado_documento_id",
        "relacionado_fornecedor_id",
        "relacionado_fornecedor_outro",
        "relacionado_obra_id",
        "relacionado_obra_outro",
        "relacionado_zona_id",
        "relacionado_zona_outro",
        "auditoria_id",
        "auditoria_outro",
        "anexos_evidencia",
        "anexos_corretiva",
        "anexos_verificacao",
        "timeline",
      ];

      const filteredNc = Object.keys(nc)
        .filter((key) => validFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = nc[key];
          return obj;
        }, {} as any);

      const { data, error } = await supabase
        .from("nao_conformidades")
        .update(filteredNc)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "atualizar não conformidade");
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const user = await getCurrentUser();
      const { error } = await supabase
        .from("nao_conformidades")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, "deletar não conformidade");
      return false;
    }
  },
};

// =====================================================
// API DE RFIS
// =====================================================

export const rfisAPI = {
  getAll: async (): Promise<RFI[]> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("rfis")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, "listar RFIs");
      return [];
    }
  },

  getById: async (id: string): Promise<RFI | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("rfis")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "buscar RFI");
      return null;
    }
  },

  create: async (
    rfi: Omit<InsertDto<"rfis">, "user_id">,
  ): Promise<RFI | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("rfis")
        .insert([{ ...rfi, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "criar RFI");
      return null;
    }
  },

  update: async (id: string, rfi: UpdateDto<"rfis">): Promise<RFI | null> => {
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from("rfis")
        .update(rfi)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "atualizar RFI");
      return null;
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      const user = await getCurrentUser();
      const { error } = await supabase
        .from("rfis")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, "deletar RFI");
      return false;
    }
  },
};

// =====================================================
// API DE AUTENTICAÇÃO
// =====================================================

export const authAPI = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  getCurrentUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
