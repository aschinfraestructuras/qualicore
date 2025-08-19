import { supabase } from '../lib/supabase';
import { EnsaioCompactacao } from '../types';

export class EnsaioCompactacaoService {
  private tableName = 'ensaios_compactacao';

  // Buscar todos os ensaios
  async getAll(): Promise<EnsaioCompactacao[]> {
    try {
      // Obter usuário autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', user.id) // Filtrar por user_id
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapFromDatabase);
    } catch (error) {
      console.error('Erro ao buscar ensaios de compactação:', error);
      throw error;
    }
  }

  // Buscar ensaio por ID
  async getById(id: string): Promise<EnsaioCompactacao | null> {
    try {
      // Obter usuário autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id) // Filtrar por user_id
        .single();

      if (error) throw error;
      return this.mapFromDatabase(data);
    } catch (error) {
      console.error('Erro ao buscar ensaio de compactação:', error);
      throw error;
    }
  }

  // Criar novo ensaio
  async create(ensaio: Omit<EnsaioCompactacao, 'id' | 'created' | 'updated'>): Promise<EnsaioCompactacao> {
    try {
      // Obter usuário autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .insert([{
          user_id: user.id, // Adicionar user_id
          obra: ensaio.obra,
          localizacao: ensaio.localizacao,
          elemento: ensaio.elemento,
          numero_ensaio: ensaio.numeroEnsaio,
          codigo: ensaio.codigo,
          data_amostra: ensaio.dataAmostra,
          densidade_maxima_referencia: ensaio.densidadeMaximaReferencia,
          humidade_otima_referencia: ensaio.humidadeOtimaReferencia,
          pontos: ensaio.pontos,
          densidade_seca_media: ensaio.densidadeSecaMedia,
          humidade_media: ensaio.humidadeMedia,
          grau_compactacao_medio: ensaio.grauCompactacaoMedio,
          referencia_laboratorio_externo: ensaio.referenciaLaboratorioExterno,
          observacoes: ensaio.observacoes,
          documents: ensaio.documents || []
        }])
        .select()
        .single();

      if (error) throw error;
      return this.mapFromDatabase(data);
    } catch (error) {
      console.error('Erro ao criar ensaio de compactação:', error);
      throw error;
    }
  }

  // Atualizar ensaio
  async update(id: string, ensaio: Partial<EnsaioCompactacao>): Promise<EnsaioCompactacao> {
    try {
      // Obter usuário autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const updateData: any = {};
      
      if (ensaio.obra !== undefined) updateData.obra = ensaio.obra;
      if (ensaio.localizacao !== undefined) updateData.localizacao = ensaio.localizacao;
      if (ensaio.elemento !== undefined) updateData.elemento = ensaio.elemento;
      if (ensaio.numeroEnsaio !== undefined) updateData.numero_ensaio = ensaio.numeroEnsaio;
      if (ensaio.codigo !== undefined) updateData.codigo = ensaio.codigo;
      if (ensaio.dataAmostra !== undefined) updateData.data_amostra = ensaio.dataAmostra;
      if (ensaio.densidadeMaximaReferencia !== undefined) updateData.densidade_maxima_referencia = ensaio.densidadeMaximaReferencia;
      if (ensaio.humidadeOtimaReferencia !== undefined) updateData.humidade_otima_referencia = ensaio.humidadeOtimaReferencia;
      if (ensaio.pontos !== undefined) updateData.pontos = ensaio.pontos;
      if (ensaio.densidadeSecaMedia !== undefined) updateData.densidade_seca_media = ensaio.densidadeSecaMedia;
      if (ensaio.humidadeMedia !== undefined) updateData.humidade_media = ensaio.humidadeMedia;
      if (ensaio.grauCompactacaoMedio !== undefined) updateData.grau_compactacao_medio = ensaio.grauCompactacaoMedio;
      if (ensaio.referenciaLaboratorioExterno !== undefined) updateData.referencia_laboratorio_externo = ensaio.referenciaLaboratorioExterno;
      if (ensaio.observacoes !== undefined) updateData.observacoes = ensaio.observacoes;
      if (ensaio.documents !== undefined) updateData.documents = ensaio.documents;

      const { data, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id) // Adicionar condição user_id
        .select()
        .single();

      if (error) throw error;
      return this.mapFromDatabase(data);
    } catch (error) {
      console.error('Erro ao atualizar ensaio de compactação:', error);
      throw error;
    }
  }

  // Deletar ensaio
  async delete(id: string): Promise<void> {
    try {
      // Obter usuário autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Adicionar condição user_id

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar ensaio de compactação:', error);
      throw error;
    }
  }

  // Buscar por obra
  async getByObra(obra: string): Promise<EnsaioCompactacao[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('obra', obra)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapFromDatabase);
    } catch (error) {
      console.error('Erro ao buscar ensaios por obra:', error);
      throw error;
    }
  }

  // Buscar por localização
  async getByLocalizacao(localizacao: string): Promise<EnsaioCompactacao[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('localizacao', localizacao)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapFromDatabase);
    } catch (error) {
      console.error('Erro ao buscar ensaios por localização:', error);
      throw error;
    }
  }

  // Buscar por código
  async getByCodigo(codigo: string): Promise<EnsaioCompactacao[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('codigo', codigo)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapFromDatabase);
    } catch (error) {
      console.error('Erro ao buscar ensaios por código:', error);
      throw error;
    }
  }

  // Mapear dados do banco para o formato da aplicação
  private mapFromDatabase(data: any): EnsaioCompactacao {
    return {
      id: data.id,
      obra: data.obra,
      localizacao: data.localizacao,
      elemento: data.elemento,
      numeroEnsaio: data.numero_ensaio,
      codigo: data.codigo,
      dataAmostra: data.data_amostra,
      densidadeMaximaReferencia: data.densidade_maxima_referencia,
      humidadeOtimaReferencia: data.humidade_otima_referencia,
      pontos: data.pontos || [],
      densidadeSecaMedia: data.densidade_seca_media,
      humidadeMedia: data.humidade_media,
      grauCompactacaoMedio: data.grau_compactacao_medio,
      referenciaLaboratorioExterno: data.referencia_laboratorio_externo,
      observacoes: data.observacoes,
      documents: data.documents || [],
      created: data.created_at,
      updated: data.updated_at
    };
  }

  // Mapear dados da aplicação para o formato do banco
  private mapToDatabase(ensaio: EnsaioCompactacao): any {
    return {
      id: ensaio.id,
      obra: ensaio.obra,
      localizacao: ensaio.localizacao,
      elemento: ensaio.elemento,
      numero_ensaio: ensaio.numeroEnsaio,
      codigo: ensaio.codigo,
      data_amostra: ensaio.dataAmostra,
      densidade_maxima_referencia: ensaio.densidadeMaximaReferencia,
      humidade_otima_referencia: ensaio.humidadeOtimaReferencia,
      pontos: ensaio.pontos,
      densidade_seca_media: ensaio.densidadeSecaMedia,
      humidade_media: ensaio.humidadeMedia,
      grau_compactacao_medio: ensaio.grauCompactacaoMedio,
      observacoes: ensaio.observacoes
    };
  }
}

export const ensaioCompactacaoService = new EnsaioCompactacaoService(); 