const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase (chave anônima - mesma da Via Férrea)
const supabaseUrl = 'https://mjgvjpqcdsmvervcxjig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executarMigracaoSinalizacao() {
  console.log('🚀 Iniciando migração de Sinalização Ferroviária...\n');

  try {
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'supabase', 'migrations', '002_create_sinalizacao_tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Arquivo SQL carregado com sucesso');
    console.log(`📊 Tamanho do arquivo: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);

    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`🔧 Executando ${commands.length} comandos SQL...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      if (command.trim() === '') continue;

      try {
        console.log(`📝 Executando comando ${i + 1}/${commands.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', { sql_query: command });
        
        if (error) {
          console.log(`❌ Erro no comando ${i + 1}: ${error.message}`);
          errorCount++;
        } else {
          console.log(`✅ Comando ${i + 1} executado com sucesso`);
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Erro no comando ${i + 1}: ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 Resumo da Execução:');
    console.log(`✅ Comandos executados com sucesso: ${successCount}`);
    console.log(`❌ Comandos com erro: ${errorCount}`);
    console.log(`📈 Taxa de sucesso: ${((successCount / (successCount + errorCount)) * 100).toFixed(2)}%`);

    if (errorCount === 0) {
      console.log('\n🎉 Migração de Sinalização concluída com sucesso!');
      console.log('📋 Tabelas criadas:');
      console.log('   - sinalizacoes');
      console.log('   - inspecoes_sinalizacao');
      console.log('📊 Dados de exemplo inseridos');
      console.log('🔒 Políticas de segurança configuradas');
      console.log('⚡ Índices de performance criados');
    } else {
      console.log('\n⚠️ Migração concluída com alguns erros. Verifique os logs acima.');
    }

  } catch (error) {
    console.error('💥 Erro fatal durante a migração:', error.message);
    process.exit(1);
  }
}

// Executar a migração
executarMigracaoSinalizacao()
  .then(() => {
    console.log('\n🏁 Script finalizado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro inesperado:', error);
    process.exit(1);
  });
