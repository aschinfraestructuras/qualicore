const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executarScriptSolos() {
  try {
    console.log('🚀 Iniciando execução do script de Caracterização de Solos...');
    
    // Ler o arquivo SQL
    const sqlFilePath = path.join(__dirname, 'supabase', 'migrations', '007_create_solos_tables.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      console.error('❌ Erro: Arquivo SQL não encontrado:', sqlFilePath);
      process.exit(1);
    }
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('📄 Script SQL carregado com sucesso');
    
    // Executar o script completo
    console.log('⚡ Executando script SQL na Supabase...');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sqlContent
    });
    
    if (error) {
      console.error('❌ Erro ao executar script:', error);
      process.exit(1);
    }
    
    console.log('✅ Script executado com sucesso!');
    console.log('📊 Resultado:', data);
    
    // Verificar se a tabela foi criada
    console.log('🔍 Verificando se a tabela foi criada...');
    
    const { data: verificacao, error: erroVerificacao } = await supabase
      .from('caracterizacoes_solos')
      .select('count')
      .limit(1);
    
    if (erroVerificacao) {
      console.error('❌ Erro ao verificar tabela:', erroVerificacao);
    } else {
      console.log('✅ Tabela caracterizacoes_solos criada com sucesso!');
    }
    
    // Verificar estatísticas
    console.log('📈 Verificando função de estatísticas...');
    
    const { data: stats, error: erroStats } = await supabase.rpc('get_solos_stats');
    
    if (erroStats) {
      console.error('❌ Erro ao verificar estatísticas:', erroStats);
    } else {
      console.log('✅ Função de estatísticas funcionando!');
      console.log('📊 Estatísticas:', JSON.stringify(stats, null, 2));
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
executarScriptSolos();
