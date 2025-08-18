const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executarScriptSolosDireto() {
  try {
    console.log('🚀 Iniciando execução direta do script de Caracterização de Solos...');
    
    // 1. Criar tabela
    console.log('📋 1. Criando tabela caracterizacoes_solos...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS caracterizacoes_solos (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        codigo VARCHAR(50) UNIQUE NOT NULL,
        obra VARCHAR(255) NOT NULL,
        laboratorio VARCHAR(100) NOT NULL,
        tipo_amostra VARCHAR(50) NOT NULL CHECK (tipo_amostra IN (
          'Disturbada', 'Não Disturbada', 'Semi-Disturbada', 'Outro'
        )),
        localizacao VARCHAR(255) NOT NULL,
        profundidade_colheita DECIMAL(5,2) CHECK (profundidade_colheita >= 0),
        data_colheita DATE NOT NULL,
        data_ensaio DATE NOT NULL,
        responsavel_colheita VARCHAR(100),
        responsavel_ensaio VARCHAR(100),
        humidade_natural DECIMAL(5,2) CHECK (humidade_natural >= 0),
        densidade_aparente DECIMAL(4,2) CHECK (densidade_aparente >= 0),
        densidade_real DECIMAL(4,2) CHECK (densidade_real >= 0),
        indice_vazios DECIMAL(4,2) CHECK (indice_vazios >= 0),
        porosidade DECIMAL(5,2) CHECK (porosidade >= 0),
        granulometria_peneiracao JSONB,
        granulometria_sedimentacao JSONB,
        limites_consistencia JSONB,
        proctor_normal JSONB,
        proctor_modificado JSONB,
        cbr JSONB,
        resistencia_cisalhamento JSONB,
        caracteristicas_quimicas JSONB,
        ensaios_especificos JSONB,
        classificacao JSONB,
        conforme BOOLEAN DEFAULT true,
        observacoes TEXT,
        recomendacoes TEXT,
        relatorio_laboratorio TEXT,
        certificado_ensaio TEXT,
        fotos_amostra TEXT[],
        normas_referencia TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    if (createError) {
      console.error('❌ Erro ao criar tabela:', createError);
      return;
    }
    console.log('✅ Tabela criada com sucesso!');
    
    // 2. Criar índices
    console.log('🔍 2. Criando índices...');
    
    const indicesSQL = `
      CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_obra ON caracterizacoes_solos(obra);
      CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_laboratorio ON caracterizacoes_solos(laboratorio);
      CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_data_ensaio ON caracterizacoes_solos(data_ensaio);
      CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_conforme ON caracterizacoes_solos(conforme);
      CREATE INDEX IF NOT EXISTS idx_caracterizacoes_solos_tipo_amostra ON caracterizacoes_solos(tipo_amostra);
    `;
    
    const { error: indicesError } = await supabase.rpc('exec_sql', { sql: indicesSQL });
    if (indicesError) {
      console.error('❌ Erro ao criar índices:', indicesError);
    } else {
      console.log('✅ Índices criados com sucesso!');
    }
    
    // 3. Criar função de estatísticas
    console.log('📊 3. Criando função de estatísticas...');
    
    const statsFunctionSQL = `
      CREATE OR REPLACE FUNCTION get_solos_stats()
      RETURNS JSON AS $$
      DECLARE
          result JSON;
      BEGIN
          SELECT json_build_object(
              'total_solos', COUNT(*),
              'conformes', COUNT(*) FILTER (WHERE conforme = true),
              'nao_conformes', COUNT(*) FILTER (WHERE conforme = false),
              'adequados', COUNT(*) FILTER (WHERE (classificacao->>'adequacao') IN ('ADEQUADO', 'EXCELENTE')),
              'inadequados', COUNT(*) FILTER (WHERE (classificacao->>'adequacao') = 'INADECUADO'),
              'marginais', COUNT(*) FILTER (WHERE (classificacao->>'adequacao') IN ('MARGINAL', 'TOLERABLE')),
              'tipos_amostra_distribuicao', (
                  SELECT json_object_agg(tipo, count)
                  FROM (
                      SELECT tipo_amostra as tipo, COUNT(*) as count
                      FROM caracterizacoes_solos
                      GROUP BY tipo_amostra
                      ORDER BY count DESC
                      LIMIT 5
                  ) t
              ),
              'obras_distribuicao', (
                  SELECT json_object_agg(obra, count)
                  FROM (
                      SELECT obra, COUNT(*) as count
                      FROM caracterizacoes_solos
                      GROUP BY obra
                      ORDER BY count DESC
                      LIMIT 5
                  ) t
              ),
              'laboratorios_distribuicao', (
                  SELECT json_object_agg(laboratorio, count)
                  FROM (
                      SELECT laboratorio, COUNT(*) as count
                      FROM caracterizacoes_solos
                      GROUP BY laboratorio
                      ORDER BY count DESC
                      LIMIT 5
                  ) t
              ),
              'profundidade_media', AVG(profundidade_colheita),
              'cbr_medio', AVG((cbr->>'valor_cbr')::DECIMAL),
              'resistencia_cisalhamento_media', AVG((resistencia_cisalhamento->>'coesao')::DECIMAL)
          ) INTO result
          FROM caracterizacoes_solos;
          
          RETURN result;
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    const { error: functionError } = await supabase.rpc('exec_sql', { sql: statsFunctionSQL });
    if (functionError) {
      console.error('❌ Erro ao criar função:', functionError);
    } else {
      console.log('✅ Função de estatísticas criada com sucesso!');
    }
    
    // 4. Configurar RLS
    console.log('🔒 4. Configurando Row Level Security...');
    
    const rlsSQL = `
      ALTER TABLE caracterizacoes_solos ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Usuários autenticados podem ver caracterizações de solos" ON caracterizacoes_solos
          FOR SELECT USING (auth.role() = 'authenticated');
      
      CREATE POLICY "Usuários autenticados podem inserir caracterizações de solos" ON caracterizacoes_solos
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      
      CREATE POLICY "Usuários autenticados podem atualizar caracterizações de solos" ON caracterizacoes_solos
          FOR UPDATE USING (auth.role() = 'authenticated');
      
      CREATE POLICY "Usuários autenticados podem deletar caracterizações de solos" ON caracterizacoes_solos
          FOR DELETE USING (auth.role() = 'authenticated');
    `;
    
    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsSQL });
    if (rlsError) {
      console.error('❌ Erro ao configurar RLS:', rlsError);
    } else {
      console.log('✅ RLS configurado com sucesso!');
    }
    
    // 5. Inserir dados de exemplo
    console.log('📝 5. Inserindo dados de exemplo...');
    
    const dadosExemplo = [
      {
        codigo: 'SOL-2024-001',
        obra: 'Linha Ferroviária Lisboa-Porto',
        laboratorio: 'Laboratório Nacional de Engenharia Civil',
        tipo_amostra: 'Não Disturbada',
        localizacao: 'KM 45+200 - Talude Norte',
        profundidade_colheita: 2.50,
        data_colheita: '2024-01-15',
        data_ensaio: '2024-01-20',
        responsavel_colheita: 'Eng. João Silva',
        responsavel_ensaio: 'Dr. Maria Santos',
        humidade_natural: 12.5,
        densidade_aparente: 1.85,
        densidade_real: 2.65,
        indice_vazios: 0.43,
        porosidade: 30.2,
        granulometria_peneiracao: { peneiras: { "2mm": 95.2, "0.425mm": 78.5, "0.075mm": 12.3 }, curva_granulometrica: "Arenosa" },
        granulometria_sedimentacao: { sedimentacao: { d10: 0.08, d30: 0.15, d60: 0.35, cu: 4.4, cc: 0.8 } },
        limites_consistencia: { limite_liquidez: 28.5, limite_plasticidade: 18.2, indice_plasticidade: 10.3 },
        proctor_normal: { humidade_otima: 14.2, densidade_maxima: 1.95 },
        proctor_modificado: { humidade_otima: 12.8, densidade_maxima: 2.05 },
        cbr: { valor_cbr: 15.2, penetracao: 2.54, carga: 2050 },
        resistencia_cisalhamento: { coesao: 12.5, angulo_atrito: 32.5, resistencia_nao_drenada: 45.2 },
        caracteristicas_quimicas: { ph: 7.2, materia_organica: 1.2, sulfatos: 0.15, gessos: 0.08 },
        ensaios_especificos: { hinchamiento_livre: 2.1, colapso: 0.5 },
        classificacao: { sistema_unificado: "SM", aashto: "A-2-4", adequacao: "ADEQUADO" },
        conforme: true,
        observacoes: 'Solo arenoso com boa capacidade de suporte',
        recomendacoes: 'Adequado para aterros e sub-base',
        relatorio_laboratorio: 'relatorio_solo_001.pdf',
        certificado_ensaio: 'certificado_solo_001.pdf',
        fotos_amostra: ['foto_amostra_001_1.jpg', 'foto_amostra_001_2.jpg'],
        normas_referencia: ['NP 83:1965', 'EN ISO 14688-1:2018']
      }
    ];
    
    const { data: insertData, error: insertError } = await supabase
      .from('caracterizacoes_solos')
      .insert(dadosExemplo);
    
    if (insertError) {
      console.error('❌ Erro ao inserir dados:', insertError);
    } else {
      console.log('✅ Dados de exemplo inseridos com sucesso!');
    }
    
    // 6. Verificar resultado
    console.log('🔍 6. Verificando resultado...');
    
    const { data: verificacao, error: erroVerificacao } = await supabase
      .from('caracterizacoes_solos')
      .select('*')
      .limit(5);
    
    if (erroVerificacao) {
      console.error('❌ Erro ao verificar dados:', erroVerificacao);
    } else {
      console.log('✅ Verificação concluída!');
      console.log('📊 Registos encontrados:', verificacao.length);
    }
    
    // 7. Testar função de estatísticas
    console.log('📈 7. Testando função de estatísticas...');
    
    const { data: stats, error: erroStats } = await supabase.rpc('get_solos_stats');
    
    if (erroStats) {
      console.error('❌ Erro ao testar estatísticas:', erroStats);
    } else {
      console.log('✅ Estatísticas funcionando!');
      console.log('📊 Resultado:', JSON.stringify(stats, null, 2));
    }
    
    console.log('🎉 Script de Caracterização de Solos executado com sucesso!');
    console.log('📋 Próximos passos:');
    console.log('   1. Verificar os dados no painel da Supabase');
    console.log('   2. Testar o módulo no frontend');
    console.log('   3. Verificar se as estatísticas aparecem no dashboard');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    process.exit(1);
  }
}

// Executar o script
executarScriptSolosDireto();
