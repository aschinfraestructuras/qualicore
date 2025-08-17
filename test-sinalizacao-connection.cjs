const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (chave anônima - mesma da Via Férrea)
const supabaseUrl = 'https://mjgvjpqcdsmvervcxjig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...\n');

  try {
    // Teste simples de conexão
    const { data, error } = await supabase
      .from('sinalizacoes')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Erro na conexão:', error.message);
      
      // Tentar criar a tabela se não existir
      console.log('\n🔧 Tentando criar tabela sinalizacoes...');
      
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS sinalizacoes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          codigo VARCHAR(50) UNIQUE NOT NULL,
          tipo VARCHAR(100) NOT NULL,
          categoria VARCHAR(100) NOT NULL,
          localizacao VARCHAR(200) NOT NULL,
          km_inicial DECIMAL(10,2) NOT NULL,
          km_final DECIMAL(10,2) NOT NULL,
          estado VARCHAR(50) NOT NULL,
          fabricante VARCHAR(100) NOT NULL,
          modelo VARCHAR(100) NOT NULL,
          data_instalacao DATE NOT NULL,
          status_operacional VARCHAR(50) NOT NULL,
          observacoes TEXT,
          parametros JSONB DEFAULT '{}',
          ultima_inspecao DATE,
          proxima_inspecao DATE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      const { error: createError } = await supabase.rpc('exec_sql', { 
        sql_query: createTableSQL 
      });

      if (createError) {
        console.log('❌ Erro ao criar tabela:', createError.message);
      } else {
        console.log('✅ Tabela sinalizacoes criada com sucesso!');
      }
    } else {
      console.log('✅ Conexão com Supabase estabelecida com sucesso!');
      console.log('📊 Dados encontrados:', data);
    }

  } catch (error) {
    console.error('💥 Erro inesperado:', error.message);
  }
}

testConnection()
  .then(() => {
    console.log('\n🏁 Teste finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
