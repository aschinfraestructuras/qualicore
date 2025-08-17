const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (chave anônima - mesma da Via Férrea)
const supabaseUrl = 'https://mjgvjpqcdsmvervcxjig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function criarFuncaoExecSql() {
  console.log('🔧 Criando função exec_sql no Supabase...\n');

  try {
    // Primeiro, vamos tentar usar a função para ver se ela existe
    console.log('📝 Testando se a função exec_sql existe...');
    
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: 'SELECT version();' 
    });

    if (error && error.message.includes('Could not find the function')) {
      console.log('❌ Função exec_sql não existe - vamos criá-la');
      
      // SQL para criar a função exec_sql
      const createFunctionSQL = `
        CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
        RETURNS text
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          EXECUTE sql_query;
          RETURN 'SQL executed successfully';
        EXCEPTION
          WHEN OTHERS THEN
            RETURN 'Error: ' || SQLERRM;
        END;
        $$;
      `;

      console.log('📝 Tentando criar a função exec_sql...');
      
      // Tentar executar via SQL direto
      const { error: createError } = await supabase
        .from('information_schema.routines')
        .select('routine_name')
        .eq('routine_name', 'exec_sql')
        .limit(1);

      if (createError) {
        console.log('❌ Não foi possível criar a função via API');
        console.log('💡 Você precisa criar a função manualmente no Supabase SQL Editor:');
        console.log('\n' + createFunctionSQL);
        console.log('\n📋 Depois de criar a função, execute o script de migração da sinalização');
        return;
      }

    } else {
      console.log('✅ Função exec_sql já existe!');
    }

    // Testar a função
    console.log('\n📝 Testando a função exec_sql...');
    
    const { data: testData, error: testError } = await supabase.rpc('exec_sql', { 
      sql_query: 'SELECT version();' 
    });

    if (testError) {
      console.log('❌ Erro ao testar função:', testError.message);
    } else {
      console.log('✅ Função exec_sql funcionando corretamente!');
      console.log('📊 Resultado do teste:', testData);
    }

  } catch (error) {
    console.error('💥 Erro:', error.message);
    console.log('\n💡 Para criar a função exec_sql manualmente:');
    console.log('1. Acesse o Supabase Dashboard');
    console.log('2. Vá para SQL Editor');
    console.log('3. Execute o seguinte SQL:');
    console.log(`
      CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
      RETURNS text
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        EXECUTE sql_query;
        RETURN 'SQL executed successfully';
      EXCEPTION
        WHEN OTHERS THEN
          RETURN 'Error: ' || SQLERRM;
      END;
      $$;
    `);
  }
}

criarFuncaoExecSql()
  .then(() => {
    console.log('\n🏁 Script finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
