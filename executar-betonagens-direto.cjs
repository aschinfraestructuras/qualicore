const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

console.log('🚀 Iniciando criação das tabelas de betonagens na Supabase...');
console.log('📋 URL:', supabaseUrl);

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function criarTabelasBetonagens() {
  try {
    console.log('🏗️ Criando tabelas de betonagens...');
    
    // 1. Criar tabela betonagens
    console.log('📋 Criando tabela betonagens...');
    const { error: errorBetonagens } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS betonagens (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          codigo VARCHAR(50) UNIQUE NOT NULL,
          obra VARCHAR(255) NOT NULL,
          elemento_estrutural VARCHAR(100) NOT NULL CHECK (elemento_estrutural IN (
            'Pilar', 'Viga', 'Laje', 'Fundação', 'Muro', 'Escada', 'Cobertura', 'Pavimento', 'Outro'
          )),
          localizacao VARCHAR(255) NOT NULL,
          data_betonagem DATE NOT NULL,
          data_ensaio_7d DATE,
          data_ensaio_28d DATE,
          fornecedor VARCHAR(100) NOT NULL,
          guia_remessa VARCHAR(100) NOT NULL,
          tipo_betao VARCHAR(50),
          aditivos VARCHAR(100) DEFAULT 'Nenhum',
          hora_limite_uso TIME,
          slump DECIMAL(5,2) CHECK (slump >= 0),
          temperatura DECIMAL(4,1) CHECK (temperatura >= -10 AND temperatura <= 50),
          resistencia_7d_1 DECIMAL(6,2) CHECK (resistencia_7d_1 >= 0),
          resistencia_7d_2 DECIMAL(6,2) CHECK (resistencia_7d_2 >= 0),
          resistencia_28d_1 DECIMAL(6,2) CHECK (resistencia_28d_1 >= 0),
          resistencia_28d_2 DECIMAL(6,2) CHECK (resistencia_28d_2 >= 0),
          resistencia_28d_3 DECIMAL(6,2) CHECK (resistencia_28d_3 >= 0),
          resistencia_rotura DECIMAL(6,2) CHECK (resistencia_rotura >= 0),
          dimensoes_provete VARCHAR(50) NOT NULL CHECK (dimensoes_provete IN (
            '15x15x15 cm', '15x30 cm', '10x20 cm', 'Outro'
          )),
          status_conformidade VARCHAR(50) NOT NULL CHECK (status_conformidade IN (
            'Conforme', 'Não Conforme', 'Pendente'
          )) DEFAULT 'Pendente',
          observacoes TEXT,
          relatorio_rotura TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (errorBetonagens) {
      console.log('❌ Erro ao criar tabela betonagens:', errorBetonagens.message);
    } else {
      console.log('✅ Tabela betonagens criada com sucesso');
    }
    
    // 2. Criar tabela ensaios_betonagem
    console.log('📋 Criando tabela ensaios_betonagem...');
    const { error: errorEnsaios } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS ensaios_betonagem (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          betonagem_id UUID NOT NULL REFERENCES betonagens(id) ON DELETE CASCADE,
          data_ensaio DATE NOT NULL,
          tipo_ensaio VARCHAR(100) NOT NULL CHECK (tipo_ensaio IN (
            'Resistência 7 dias - Probeta 1', 'Resistência 7 dias - Probeta 2',
            'Resistência 28 dias - Probeta 1', 'Resistência 28 dias - Probeta 2',
            'Resistência 28 dias - Probeta 3', 'Resistência de Rotura',
            'Slump', 'Temperatura', 'Outro'
          )),
          resultado DECIMAL(8,2) NOT NULL,
          observacoes TEXT,
          responsavel VARCHAR(100) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (errorEnsaios) {
      console.log('❌ Erro ao criar tabela ensaios_betonagem:', errorEnsaios.message);
    } else {
      console.log('✅ Tabela ensaios_betonagem criada com sucesso');
    }
    
    // 3. Criar índices
    console.log('🔍 Criando índices...');
    const indices = [
      'CREATE INDEX IF NOT EXISTS idx_betonagens_codigo ON betonagens(codigo);',
      'CREATE INDEX IF NOT EXISTS idx_betonagens_obra ON betonagens(obra);',
      'CREATE INDEX IF NOT EXISTS idx_betonagens_elemento_estrutural ON betonagens(elemento_estrutural);',
      'CREATE INDEX IF NOT EXISTS idx_betonagens_localizacao ON betonagens(localizacao);',
      'CREATE INDEX IF NOT EXISTS idx_betonagens_data_betonagem ON betonagens(data_betonagem);',
      'CREATE INDEX IF NOT EXISTS idx_betonagens_fornecedor ON betonagens(fornecedor);',
      'CREATE INDEX IF NOT EXISTS idx_betonagens_status_conformidade ON betonagens(status_conformidade);',
      'CREATE INDEX IF NOT EXISTS idx_ensaios_betonagem_betonagem_id ON ensaios_betonagem(betonagem_id);',
      'CREATE INDEX IF NOT EXISTS idx_ensaios_betonagem_tipo_ensaio ON ensaios_betonagem(tipo_ensaio);'
    ];
    
    for (const indice of indices) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: indice });
      if (error) {
        console.log('⚠️ Erro ao criar índice:', error.message);
      }
    }
    
    console.log('✅ Índices criados');
    
    // 4. Habilitar RLS
    console.log('🔒 Habilitando Row Level Security...');
    const { error: errorRLS1 } = await supabase.rpc('exec_sql', {
      sql_query: 'ALTER TABLE betonagens ENABLE ROW LEVEL SECURITY;'
    });
    
    const { error: errorRLS2 } = await supabase.rpc('exec_sql', {
      sql_query: 'ALTER TABLE ensaios_betonagem ENABLE ROW LEVEL SECURITY;'
    });
    
    if (errorRLS1 || errorRLS2) {
      console.log('⚠️ Erro ao habilitar RLS:', errorRLS1?.message || errorRLS2?.message);
    } else {
      console.log('✅ RLS habilitado');
    }
    
    // 5. Criar políticas RLS
    console.log('📋 Criando políticas RLS...');
    const politicas = [
      'CREATE POLICY "Permitir acesso total aos utilizadores autenticados" ON betonagens FOR ALL USING (auth.role() = \'authenticated\');',
      'CREATE POLICY "Permitir acesso total aos utilizadores autenticados" ON ensaios_betonagem FOR ALL USING (auth.role() = \'authenticated\');'
    ];
    
    for (const politica of politicas) {
      const { error } = await supabase.rpc('exec_sql', { sql_query: politica });
      if (error) {
        console.log('⚠️ Erro ao criar política:', error.message);
      }
    }
    
    console.log('✅ Políticas RLS criadas');
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error.message);
    return false;
  }
}

async function inserirDadosExemplo() {
  try {
    console.log('📊 Inserindo dados de exemplo...');
    
    // Dados de exemplo
    const betonagens = [
      {
        codigo: 'BET-2024-001',
        obra: 'Viaduto A1 - Km 45',
        elemento_estrutural: 'Pilar',
        localizacao: 'Pilar P1 - Nível 0',
        data_betonagem: '2024-01-15',
        data_ensaio_7d: '2024-01-22',
        data_ensaio_28d: '2024-02-12',
        fornecedor: 'Cimpor',
        guia_remessa: 'GR-2024-001',
        tipo_betao: 'C30/37',
        aditivos: 'Superplastificante',
        hora_limite_uso: '14:30:00',
        slump: 12.5,
        temperatura: 18.0,
        resistencia_7d_1: 25.3,
        resistencia_7d_2: 26.1,
        resistencia_28d_1: 38.5,
        resistencia_28d_2: 39.2,
        resistencia_28d_3: 37.8,
        resistencia_rotura: 42.1,
        dimensoes_provete: '15x15x15 cm',
        status_conformidade: 'Conforme',
        observacoes: 'Betonagem conforme especificações',
        relatorio_rotura: 'Relatório LAB-001/2024 - Resistência 42.1 MPa'
      },
      {
        codigo: 'BET-2024-002',
        obra: 'Viaduto A1 - Km 45',
        elemento_estrutural: 'Viga',
        localizacao: 'Viga V1 - Nível 1',
        data_betonagem: '2024-01-18',
        data_ensaio_7d: '2024-01-25',
        data_ensaio_28d: '2024-02-15',
        fornecedor: 'Secil',
        guia_remessa: 'GR-2024-002',
        tipo_betao: 'C35/45',
        aditivos: 'Retardador',
        hora_limite_uso: '15:00:00',
        slump: 14.0,
        temperatura: 16.5,
        resistencia_7d_1: 27.8,
        resistencia_7d_2: 28.2,
        resistencia_28d_1: 41.5,
        resistencia_28d_2: 42.1,
        resistencia_28d_3: 40.8,
        resistencia_rotura: 45.2,
        dimensoes_provete: '15x15x15 cm',
        status_conformidade: 'Conforme',
        observacoes: 'Excelente trabalhabilidade',
        relatorio_rotura: 'Relatório LAB-002/2024 - Resistência 45.2 MPa'
      },
      {
        codigo: 'BET-2024-003',
        obra: 'Ponte Rio Douro - Porto',
        elemento_estrutural: 'Fundação',
        localizacao: 'Fundação F1 - Sapata',
        data_betonagem: '2024-01-22',
        data_ensaio_7d: '2024-01-29',
        data_ensaio_28d: '2024-02-19',
        fornecedor: 'Secil',
        guia_remessa: 'GR-2024-004',
        tipo_betao: 'C40/50',
        aditivos: 'Impermeabilizante',
        hora_limite_uso: '16:00:00',
        slump: 13.5,
        temperatura: 17.0,
        resistencia_7d_1: 26.8,
        resistencia_7d_2: 27.3,
        resistencia_28d_1: 39.8,
        resistencia_28d_2: 40.5,
        resistencia_28d_3: 39.1,
        resistencia_rotura: 43.6,
        dimensoes_provete: '15x15x15 cm',
        status_conformidade: 'Conforme',
        observacoes: 'Fundação conforme projeto',
        relatorio_rotura: 'Relatório LAB-004/2024 - Resistência 43.6 MPa'
      },
      {
        codigo: 'BET-2024-004',
        obra: 'Metro Lisboa - Linha Vermelha',
        elemento_estrutural: 'Escada',
        localizacao: 'Escada E1 - Bloco A',
        data_betonagem: '2024-01-28',
        data_ensaio_7d: '2024-02-04',
        data_ensaio_28d: '2024-02-25',
        fornecedor: 'Secil',
        guia_remessa: 'GR-2024-006',
        tipo_betao: 'C30/37',
        aditivos: 'Acelerador',
        hora_limite_uso: '14:15:00',
        slump: 12.0,
        temperatura: 18.5,
        resistencia_7d_1: 25.7,
        resistencia_7d_2: 26.3,
        resistencia_28d_1: 38.9,
        resistencia_28d_2: 39.6,
        resistencia_28d_3: 38.2,
        resistencia_rotura: 42.5,
        dimensoes_provete: '15x15x15 cm',
        status_conformidade: 'Pendente',
        observacoes: 'Aguardando ensaios 28 dias',
        relatorio_rotura: null
      },
      {
        codigo: 'BET-2024-005',
        obra: 'Estação Comboios - Braga',
        elemento_estrutural: 'Pavimento',
        localizacao: 'Pavimento P1 - Estacionamento',
        data_betonagem: '2024-02-05',
        data_ensaio_7d: '2024-02-12',
        data_ensaio_28d: '2024-03-05',
        fornecedor: 'Secil',
        guia_remessa: 'GR-2024-008',
        tipo_betao: 'C25/30',
        aditivos: 'Nenhum',
        hora_limite_uso: '16:30:00',
        slump: 13.0,
        temperatura: 17.5,
        resistencia_7d_1: 26.1,
        resistencia_7d_2: 26.7,
        resistencia_28d_1: 38.4,
        resistencia_28d_2: 39.1,
        resistencia_28d_3: 37.8,
        resistencia_rotura: 41.9,
        dimensoes_provete: '15x15x15 cm',
        status_conformidade: 'Não Conforme',
        observacoes: 'Resistência abaixo do especificado',
        relatorio_rotura: 'Relatório LAB-008/2024 - Resistência 41.9 MPa (NÃO CONFORME)'
      }
    ];
    
    let inseridos = 0;
    let erros = 0;
    
    for (const betonagem of betonagens) {
      try {
        const { error } = await supabase
          .from('betonagens')
          .insert(betonagem);
        
        if (error) {
          console.log(`❌ Erro ao inserir ${betonagem.codigo}:`, error.message);
          erros++;
        } else {
          console.log(`✅ ${betonagem.codigo} inserido com sucesso`);
          inseridos++;
        }
      } catch (error) {
        console.log(`❌ Erro fatal ao inserir ${betonagem.codigo}:`, error.message);
        erros++;
      }
    }
    
    console.log(`\n📊 Dados inseridos: ${inseridos} sucessos, ${erros} erros`);
    return inseridos > 0;
    
  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error.message);
    return false;
  }
}

// Função principal
async function main() {
  console.log('🏗️ Script de Criação de Betonagens na Supabase');
  console.log('===============================================');
  
  // Verificar se a função exec_sql existe
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: 'SELECT 1 as test;' });
    if (error) {
      console.log('❌ Função exec_sql não encontrada');
      console.log('💡 Execute primeiro: node criar-funcao-exec-sql.cjs');
      return;
    }
  } catch (error) {
    console.log('❌ Erro ao verificar função exec_sql:', error.message);
    return;
  }
  
  // Criar tabelas
  const tabelasCriadas = await criarTabelasBetonagens();
  
  if (tabelasCriadas) {
    console.log('\n✅ Tabelas criadas com sucesso!');
    
    // Inserir dados
    const dadosInseridos = await inserirDadosExemplo();
    
    if (dadosInseridos) {
      console.log('\n🎉 Script concluído com sucesso!');
      console.log('📋 Tabelas de betonagens criadas e dados inseridos.');
      console.log('🔍 Verifique no painel da Supabase se tudo foi criado corretamente.');
    } else {
      console.log('\n⚠️ Tabelas criadas mas houve problemas ao inserir dados.');
    }
  } else {
    console.log('\n❌ Erro ao criar tabelas.');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { criarTabelasBetonagens, inserirDadosExemplo };
