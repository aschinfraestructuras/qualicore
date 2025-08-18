import { supabase } from './supabaseClient';
import { Armadura, ArmaduraFormData, ArmaduraFilters, ArmaduraStats } from '@/types/armaduras';

export const armadurasAPI = {
  async getAll(): Promise<Armadura[]> {
    const { data, error } = await supabase
      .from('armaduras')
      .select(`
        *,
        fornecedores:fornecedor_id(nome),
        obras:obra_id(nome)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      ...item,
      fornecedor_nome: item.fornecedores?.nome,
      obra_nome: item.obras?.nome,
      fotos: item.fotos || [],
      documentos: item.documentos || [],
      ensaios_realizados: item.ensaios_realizados || []
    }));
  },

  async getById(id: string): Promise<Armadura | null> {
    const { data, error } = await supabase
      .from('armaduras')
      .select(`
        *,
        fornecedores:fornecedor_id(nome),
        obras:obra_id(nome)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return null;

    return {
      ...data,
      fornecedor_nome: data.fornecedores?.nome,
      obra_nome: data.obras?.nome,
      fotos: data.fotos || [],
      documentos: data.documentos || [],
      ensaios_realizados: data.ensaios_realizados || []
    };
  },

  async create(armadura: ArmaduraFormData): Promise<Armadura> {
    const peso_total = armadura.quantidade * armadura.peso_unitario;
    
    const { data, error } = await supabase
      .from('armaduras')
      .insert({
        ...armadura,
        peso_total,
        fotos: [],
        documentos: [],
        ensaios_realizados: armadura.ensaios_realizados || []
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, armadura: Partial<ArmaduraFormData>): Promise<Armadura> {
    const updateData: any = { ...armadura };
    
    // Recalcular peso total se quantidade ou peso unitário mudaram
    if (armadura.quantidade && armadura.peso_unitario) {
      updateData.peso_total = armadura.quantidade * armadura.peso_unitario;
    }

    const { data, error } = await supabase
      .from('armaduras')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('armaduras')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getWithFilters(filters: ArmaduraFilters): Promise<Armadura[]> {
    let query = supabase
      .from('armaduras')
      .select(`
        *,
        fornecedores:fornecedor_id(nome),
        obras:obra_id(nome)
      `);

    if (filters.search) {
      query = query.or(`codigo.ilike.%${filters.search}%,numero_colada.ilike.%${filters.search}%,numero_guia_remessa.ilike.%${filters.search}%,fabricante.ilike.%${filters.search}%,local_aplicacao.ilike.%${filters.search}%`);
    }

    if (filters.tipo) {
      query = query.eq('tipo', filters.tipo);
    }

    if (filters.estado) {
      query = query.eq('estado', filters.estado);
    }

    if (filters.zona) {
      query = query.eq('zona', filters.zona);
    }

    if (filters.fornecedor) {
      query = query.eq('fornecedor_id', filters.fornecedor);
    }

    if (filters.obra) {
      query = query.eq('obra_id', filters.obra);
    }

    if (filters.fabricante) {
      query = query.ilike('fabricante', `%${filters.fabricante}%`);
    }

    if (filters.numero_colada) {
      query = query.ilike('numero_colada', `%${filters.numero_colada}%`);
    }

    if (filters.numero_guia_remessa) {
      query = query.ilike('numero_guia_remessa', `%${filters.numero_guia_remessa}%`);
    }

    if (filters.local_aplicacao) {
      query = query.ilike('local_aplicacao', `%${filters.local_aplicacao}%`);
    }

    if (filters.dataInicio) {
      query = query.gte('data_rececao', filters.dataInicio);
    }

    if (filters.dataFim) {
      query = query.lte('data_rececao', filters.dataFim);
    }

    if (filters.diametroMin) {
      query = query.gte('diametro', filters.diametroMin);
    }

    if (filters.diametroMax) {
      query = query.lte('diametro', filters.diametroMax);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      ...item,
      fornecedor_nome: item.fornecedores?.nome,
      obra_nome: item.obras?.nome,
      fotos: item.fotos || [],
      documentos: item.documentos || [],
      ensaios_realizados: item.ensaios_realizados || []
    }));
  },

  async getStats(): Promise<ArmaduraStats> {
    const { data, error } = await supabase
      .from('armaduras')
      .select('*');

    if (error) throw error;

    const armaduras = data || [];
    
    // Estatísticas básicas
    const total_armaduras = armaduras.length;
    const armaduras_aprovadas = armaduras.filter(a => a.estado === 'aprovado').length;
    const armaduras_pendentes = armaduras.filter(a => a.estado === 'pendente').length;
    const armaduras_reprovadas = armaduras.filter(a => a.estado === 'reprovado').length;
    const armaduras_instaladas = armaduras.filter(a => a.estado === 'instalado').length;
    const peso_total = armaduras.reduce((sum, a) => sum + (a.peso_total || 0), 0);
    const valor_estimado = peso_total * 1200; // Preço estimado por tonelada
    const conformidade_media = total_armaduras > 0 ? (armaduras_aprovadas / total_armaduras) * 100 : 0;

    // Novas estatísticas
    const total_lotes = new Set(armaduras.map(a => a.lote_aplicacao).filter(Boolean)).size;
    const fabricantes_unicos = new Set(armaduras.map(a => a.fabricante).filter(Boolean)).size;
    const zonas_ativas = new Set(armaduras.map(a => a.zona_aplicacao).filter(Boolean)).size;

    // Peso por diâmetro
    const peso_por_diametro: { [key: number]: number } = {};
    armaduras.forEach(a => {
      if (a.diametro && a.peso_total) {
        peso_por_diametro[a.diametro] = (peso_por_diametro[a.diametro] || 0) + a.peso_total;
      }
    });

    // Distribuição por estado
    const estado_distribuicao: { [key: string]: number } = {};
    armaduras.forEach(a => {
      estado_distribuicao[a.estado] = (estado_distribuicao[a.estado] || 0) + 1;
    });

    // Aplicação por zona
    const aplicacao_por_zona: { [key: string]: number } = {};
    armaduras.forEach(a => {
      if (a.zona_aplicacao) {
        aplicacao_por_zona[a.zona_aplicacao] = (aplicacao_por_zona[a.zona_aplicacao] || 0) + 1;
      }
    });

    return {
      total_armaduras,
      armaduras_aprovadas,
      armaduras_pendentes,
      armaduras_reprovadas,
      armaduras_instaladas,
      peso_total,
      valor_estimado,
      conformidade_media,
      total_lotes,
      fabricantes_unicos,
      zonas_ativas,
      peso_por_diametro,
      estado_distribuicao,
      aplicacao_por_zona
    };
  },

  // Adicionar foto
  async addFoto(id: string, foto: any): Promise<void> {
    try {
      const { data: armadura } = await supabase
        .from(this.tableName)
        .select('fotos')
        .eq('id', id)
        .single();

      const fotos = armadura?.fotos || [];
      fotos.push(foto);

      const { error } = await supabase
        .from(this.tableName)
        .update({ fotos })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao adicionar foto:', error);
      throw error;
    }
  },

  // Adicionar documento
  async addDocumento(id: string, documento: any): Promise<void> {
    try {
      const { data: armadura } = await supabase
        .from(this.tableName)
        .select('documentos')
        .eq('id', id)
        .single();

      const documentos = armadura?.documentos || [];
      documentos.push(documento);

      const { error } = await supabase
        .from(this.tableName)
        .update({ documentos })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao adicionar documento:', error);
      throw error;
    }
  }
};
