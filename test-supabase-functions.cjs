const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (chave anônima - mesma da Via Férrea)
const supabaseUrl = 'https://mjgvjpqcdsmvervcxjig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseFunctions() {
  console.log('🔍 Testando funções SQL no Supabase...\n');

  try {
    // Testar função exec_sql
    console.log('📝 Testando função exec_sql...');
    
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: 'SELECT version();' 
    });

    if (error) {
      console.log('❌ Função exec_sql não existe:', error.message);
    } else {
      console.log('✅ Função exec_sql existe:', data);
    }

    // Testar outras funções
    console.log('\n📝 Testando outras funções...');
    
    const functions = [
      'create_table',
      'create_signal_table',
      'setup_signalization',
      'init_signalization'
    ];

    for (const func of functions) {
      try {
        const { error: funcError } = await supabase.rpc(func, {});
        if (funcError) {
          console.log(`❌ Função ${func}: ${funcError.message}`);
        } else {
          console.log(`✅ Função ${func} existe`);
        }
      } catch (err) {
        console.log(`❌ Função ${func}: ${err.message}`);
      }
    }

    // Verificar se posso inserir diretamente
    console.log('\n📝 Testando inserção direta...');
    
    const testData = {
      codigo: 'TEST-001',
      tipo: 'Teste',
      categoria: 'Teste',
      localizacao: 'Teste',
      km_inicial: 0,
      km_final: 1,
      estado: 'Teste',
      fabricante: 'Teste',
      modelo: 'Teste',
      data_instalacao: '2024-01-01',
      status_operacional: 'Teste',
      observacoes: 'Teste',
      parametros: {},
      ultima_inspecao: '2024-01-01',
      proxima_inspecao: '2024-01-01'
    };

    const { error: insertError } = await supabase
      .from('sinalizacoes')
      .insert(testData);

    if (insertError) {
      console.log('❌ Erro na inserção:', insertError.message);
    } else {
      console.log('✅ Inserção funcionou!');
    }

  } catch (error) {
    console.error('💥 Erro:', error.message);
  }
}

testSupabaseFunctions()
  .then(() => {
    console.log('\n🏁 Teste finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
