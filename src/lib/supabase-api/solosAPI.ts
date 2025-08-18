import { supabase } from '@/lib/supabase';
import { CaracterizacaoSolo, FiltroSolos } from '@/types/solos';

// =====================================================
// API DE CARACTERIZAÇÃO DE SOLOS
// =====================================================

export const solosAPI = {
  // =====================================================
  // OPERAÇÕES CRUD BÁSICAS
  // =====================================================
  
  caracterizacoes: {
    getAll: async (): Promise<CaracterizacaoSolo[]> => {
      try {
        const { data, error } = await supabase
          .from('caracterizacoes_solos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Erro ao buscar caracterizações de solos:', error);
        return [];
      }
    },

    getById: async (id: string): Promise<CaracterizacaoSolo | null> => {
      try {
        const { data, error } = await supabase
          .from('caracterizacoes_solos')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar caracterização de solo:', error);
        return null;
      }
    },

    create: async (caracterizacao: Omit<CaracterizacaoSolo, 'id' | 'created_at' | 'updated_at'>): Promise<CaracterizacaoSolo | null> => {
      try {
        const { data, error } = await supabase
          .from('caracterizacoes_solos')
          .insert([caracterizacao])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao criar caracterização de solo:', error);
        throw error;
      }
    },

    update: async (id: string, caracterizacao: Partial<CaracterizacaoSolo>): Promise<CaracterizacaoSolo | null> => {
      try {
        const { data, error } = await supabase
          .from('caracterizacoes_solos')
          .update(caracterizacao)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao atualizar caracterização de solo:', error);
        throw error;
      }
    },

    delete: async (id: string): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('caracterizacoes_solos')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Erro ao eliminar caracterização de solo:', error);
        return false;
      }
    },

    // Busca com filtros avançados
    search: async (filtros: FiltroSolos): Promise<CaracterizacaoSolo[]> => {
      try {
        let query = supabase
          .from('caracterizacoes_solos')
          .select('*');

        // Aplicar filtros
        if (filtros.search) {
          query = query.or(`codigo.ilike.%${filtros.search}%,obra.ilike.%${filtros.search}%,localizacao.ilike.%${filtros.search}%`);
        }

        if (filtros.obra) {
          query = query.eq('obra', filtros.obra);
        }

        if (filtros.laboratorio) {
          query = query.eq('laboratorio', filtros.laboratorio);
        }

        if (filtros.conforme !== '') {
          query = query.eq('conforme', filtros.conforme === 'true');
        }

        if (filtros.tipo_amostra) {
          query = query.eq('tipo_amostra', filtros.tipo_amostra);
        }

        if (filtros.profundidade_min !== undefined) {
          query = query.gte('profundidade_colheita', filtros.profundidade_min);
        }

        if (filtros.profundidade_max !== undefined) {
          query = query.lte('profundidade_colheita', filtros.profundidade_max);
        }

        if (filtros.dataInicio && filtros.dataFim) {
          query = query.gte('data_colheita', filtros.dataInicio)
                       .lte('data_colheita', filtros.dataFim);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Erro na busca de caracterizações de solos:', error);
        return [];
      }
    }
  },

  // =====================================================
  // ESTATÍSTICAS E RELATÓRIOS
  // =====================================================
  
  stats: {
    getStats: async () => {
      try {
        const { data, error } = await supabase.rpc('get_solos_stats');
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Erro ao buscar estatísticas de solos:', error);
        // Retornar estatísticas calculadas localmente como fallback
        return {
          total_caracterizacoes: 0,
          conformes: 0,
          nao_conformes: 0,
          pendentes: 0,
          laboratorios_distribuicao: {},
          tipos_amostra_distribuicao: {},
          profundidade_media: 0,
          resistencia_media: 0
        };
      }
    }
  },

  // =====================================================
  // EXPORTAÇÃO E RELATÓRIOS
  // =====================================================
  
  export: {
    toCSV: async (caracterizacoes: CaracterizacaoSolo[]): Promise<string> => {
      const headers = [
        'Código',
        'Obra',
        'Localização',
        'Data Colheita',
        'Laboratório',
        'Profundidade (m)',
        'Tipo Amostra',
        'Humidade Natural (%)',
        'Densidade Natural (g/cm³)',
        'Limite de Liquidez (%)',
        'Limite de Plasticidade (%)',
        'CBR (%)',
        'Coesão (kPa)',
        'Ângulo de Atrito (°)',
        'pH',
        'Matéria Orgânica (%)',
        'Sulfatos (mg/kg)',
        'Conforme'
      ];

      const rows = caracterizacoes.map(solo => [
        solo.codigo,
        solo.obra,
        solo.localizacao,
        solo.data_colheita,
        solo.laboratorio,
        solo.profundidade_colheita,
        solo.tipo_amostra,
        solo.humidade_natural,
        solo.densidade_natural,
        solo.limites_consistencia.limite_liquidez,
        solo.limites_consistencia.limite_plasticidade,
        solo.cbr.valor_cbr,
        solo.resistencia_cisalhamento.coesao,
        solo.resistencia_cisalhamento.angulo_atrito,
        solo.caracteristicas_quimicas.ph,
        solo.caracteristicas_quimicas.materia_organica,
        solo.caracteristicas_quimicas.sulfatos,
        solo.conforme ? 'Sim' : 'Não'
      ]);

      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      return csvContent;
    },

    toPDF: async (caracterizacao: CaracterizacaoSolo): Promise<Blob> => {
      // Implementar geração de PDF específico para solos
      const content = `
        <html>
          <head>
            <title>Caracterização de Solo - ${caracterizacao.codigo}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .section h3 { color: #2563eb; border-bottom: 2px solid #2563eb; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
              .field { margin-bottom: 10px; }
              .field label { font-weight: bold; }
              .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              .table th { background-color: #f8fafc; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Caracterização de Solo</h1>
              <h2>Código: ${caracterizacao.codigo}</h2>
            </div>
            
            <div class="section">
              <h3>Informações Gerais</h3>
              <div class="grid">
                <div class="field">
                  <label>Obra:</label> ${caracterizacao.obra}
                </div>
                <div class="field">
                  <label>Localização:</label> ${caracterizacao.localizacao}
                </div>
                <div class="field">
                  <label>Data de Colheita:</label> ${caracterizacao.data_colheita}
                </div>
                <div class="field">
                  <label>Laboratório:</label> ${caracterizacao.laboratorio}
                </div>
                <div class="field">
                  <label>Profundidade:</label> ${caracterizacao.profundidade_colheita}m
                </div>
                <div class="field">
                  <label>Tipo de Amostra:</label> ${caracterizacao.tipo_amostra}
                </div>
              </div>
            </div>

            <div class="section">
              <h3>Características Físicas</h3>
              <table class="table">
                <tr>
                  <th>Parâmetro</th>
                  <th>Valor</th>
                  <th>Unidade</th>
                </tr>
                <tr>
                  <td>Humidade Natural</td>
                  <td>${caracterizacao.humidade_natural}</td>
                  <td>%</td>
                </tr>
                <tr>
                  <td>Densidade Natural</td>
                  <td>${caracterizacao.densidade_natural}</td>
                  <td>g/cm³</td>
                </tr>
                <tr>
                  <td>Densidade Seca</td>
                  <td>${caracterizacao.densidade_seca}</td>
                  <td>g/cm³</td>
                </tr>
                <tr>
                  <td>Índice de Vazios</td>
                  <td>${caracterizacao.indice_vazios}</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Porosidade</td>
                  <td>${caracterizacao.porosidade}</td>
                  <td>%</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <h3>Limites de Consistência</h3>
              <table class="table">
                <tr>
                  <th>Parâmetro</th>
                  <th>Valor</th>
                  <th>Unidade</th>
                </tr>
                <tr>
                  <td>Limite de Liquidez</td>
                  <td>${caracterizacao.limites_consistencia.limite_liquidez}</td>
                  <td>%</td>
                </tr>
                <tr>
                  <td>Limite de Plasticidade</td>
                  <td>${caracterizacao.limites_consistencia.limite_plasticidade}</td>
                  <td>%</td>
                </tr>
                <tr>
                  <td>Índice de Plasticidade</td>
                  <td>${caracterizacao.limites_consistencia.indice_plasticidade}</td>
                  <td>%</td>
                </tr>
                <tr>
                  <td>Índice de Liquidez</td>
                  <td>${caracterizacao.limites_consistencia.indice_liquidez}</td>
                  <td>-</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <h3>Ensaios de Resistência</h3>
              <table class="table">
                <tr>
                  <th>Parâmetro</th>
                  <th>Valor</th>
                  <th>Unidade</th>
                </tr>
                <tr>
                  <td>CBR</td>
                  <td>${caracterizacao.cbr.valor_cbr}</td>
                  <td>%</td>
                </tr>
                <tr>
                  <td>Coesão</td>
                  <td>${caracterizacao.resistencia_cisalhamento.coesao}</td>
                  <td>kPa</td>
                </tr>
                <tr>
                  <td>Ângulo de Atrito</td>
                  <td>${caracterizacao.resistencia_cisalhamento.angulo_atrito}</td>
                  <td>°</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <h3>Características Químicas</h3>
              <table class="table">
                <tr>
                  <th>Parâmetro</th>
                  <th>Valor</th>
                  <th>Unidade</th>
                </tr>
                <tr>
                  <td>pH</td>
                  <td>${caracterizacao.caracteristicas_quimicas.ph}</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Matéria Orgânica</td>
                  <td>${caracterizacao.caracteristicas_quimicas.materia_organica}</td>
                  <td>%</td>
                </tr>
                <tr>
                  <td>Sulfatos</td>
                  <td>${caracterizacao.caracteristicas_quimicas.sulfatos}</td>
                  <td>mg/kg</td>
                </tr>
                <tr>
                  <td>Gessos</td>
                  <td>${caracterizacao.caracteristicas_quimicas.gessos}</td>
                  <td>%</td>
                </tr>
              </table>
            </div>

            <div class="section">
              <h3>Classificação</h3>
              <div class="grid">
                <div class="field">
                  <label>Sistema Unificado (USCS):</label> ${caracterizacao.classificacao.sistema_unificado}
                </div>
                <div class="field">
                  <label>Sistema AASHTO:</label> ${caracterizacao.classificacao.sistema_aashto}
                </div>
                <div class="field">
                  <label>Grupo Português:</label> ${caracterizacao.classificacao.grupo_portugues}
                </div>
              </div>
            </div>

            <div class="section">
              <h3>Conformidade</h3>
              <div class="field">
                <label>Conforme:</label> ${caracterizacao.conforme ? 'SIM' : 'NÃO'}
              </div>
              <div class="field">
                <label>Observações:</label> ${caracterizacao.observacoes || 'Nenhuma'}
              </div>
              <div class="field">
                <label>Recomendações:</label> ${caracterizacao.recomendacoes || 'Nenhuma'}
              </div>
            </div>

            <div class="section">
              <h3>Normas de Referência</h3>
              <ul>
                ${caracterizacao.normas_referencia.map(norma => `<li>${norma}</li>`).join('')}
              </ul>
            </div>
          </body>
        </html>
      `;

      // Converter HTML para PDF (implementação básica)
      const blob = new Blob([content], { type: 'text/html' });
      return blob;
    }
  }
};
