const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://mjgvjpqcdsmvervcxjig.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTablesStructure() {
  console.log('🔍 Verificando estrutura das tabelas...\n');

  try {
    // Verificar tabelas existentes
    console.log('1. Verificando tabelas existentes...');
    const tables = ['obras', 'fornecedores', 'materiais', 'ensaios', 'checklists', 'documentos', 'nao_conformidades', 'rfis', 'ensaios_compactacao', 'ppi_modelos', 'ppi_instancias'];
    
    for (const tableName of tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Tabela ${tableName}: ${error.message}`);
          if (error.details) console.log(`   Detalhes: ${error.details}`);
          if (error.hint) console.log(`   Hint: ${error.hint}`);
        } else {
          console.log(`✅ Tabela ${tableName}: OK`);
        }
      } catch (err) {
        console.log(`❌ Tabela ${tableName}: ${err.message}`);
      }
    }

    // Verificar se há dados nas tabelas
    console.log('\n2. Verificando dados nas tabelas...');
    for (const tableName of tables) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ Erro ao contar ${tableName}: ${error.message}`);
        } else {
          console.log(`📊 Tabela ${tableName}: ${count} registros`);
        }
      } catch (err) {
        console.log(`❌ Erro ao contar ${tableName}: ${err.message}`);
      }
    }

    // Verificar políticas RLS
    console.log('\n3. Verificando políticas RLS...');
    try {
      const { data: policies, error } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('schemaname', 'public');
      
      if (error) {
        console.log('❌ Erro ao verificar políticas RLS:', error.message);
      } else {
        console.log(`✅ Encontradas ${policies?.length || 0} políticas RLS`);
      }
    } catch (err) {
      console.log('❌ Erro ao verificar políticas RLS:', err.message);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o teste
testTablesStructure().then(() => {
  console.log('\n🏁 Verificação concluída');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
}); 