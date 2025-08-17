const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase (chave anônima - mesma da Via Férrea)
const supabaseUrl = 'https://mjgvjpqcdsmvervcxjig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarTabelas() {
  console.log('🔍 Verificando tabelas existentes no Supabase...\n');

  const tabelas = [
    'trilhos',
    'travessas', 
    'inspecoes',
    'sinalizacoes',
    'inspecoes_sinalizacao',
    'obras',
    'fornecedores',
    'materiais',
    'ensaios',
    'checklists',
    'documentos',
    'nao_conformidades',
    'rfis'
  ];

  for (const tabela of tabelas) {
    try {
      const { data, error } = await supabase
        .from(tabela)
        .select('count')
        .limit(1);

      if (error) {
        console.log(`❌ ${tabela}: ${error.message}`);
      } else {
        console.log(`✅ ${tabela}: Existe`);
      }
    } catch (err) {
      console.log(`❌ ${tabela}: ${err.message}`);
    }
  }

  console.log('\n🏁 Verificação concluída');
}

verificarTabelas()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro:', error);
    process.exit(1);
  });
