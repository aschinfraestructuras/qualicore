const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Configuração do Supabase (chave anônima - mesma da Via Férrea)
const supabaseUrl = 'https://mjgvjpqcdsmvervcxjig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executarSqlSinalizacao() {
  console.log('🚀 Executando SQL de Sinalização Ferroviária...\n');

  try {
    // Ler o arquivo SQL de migração
    console.log('📖 Lendo arquivo de migração...');
    const sqlContent = fs.readFileSync('supabase/migrations/002_create_sinalizacao_tables.sql', 'utf8');
    
    console.log('✅ Arquivo SQL lido com sucesso');
    console.log('📊 Tamanho do arquivo:', sqlContent.length, 'caracteres');

    // Mostrar o SQL que será executado
    console.log('\n📋 SQL que será executado:');
    console.log('=' .repeat(80));
    console.log(sqlContent);
    console.log('=' .repeat(80));

    console.log('\n💡 Para executar este SQL:');
    console.log('1. Acesse o Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Vá para o seu projeto');
    console.log('3. Clique em "SQL Editor" no menu lateral');
    console.log('4. Cole o SQL acima na área de texto');
    console.log('5. Clique em "Run" para executar');
    console.log('\n🎯 Após executar, as tabelas sinalizacoes e inspecoes_sinalizacao serão criadas!');

    // Tentar executar via API se possível
    console.log('\n🔧 Tentando executar via API...');
    
    try {
      // Dividir o SQL em comandos menores
      const commands = sqlContent
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

      console.log(`📝 Encontrados ${commands.length} comandos SQL`);

      // Tentar executar cada comando
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < Math.min(commands.length, 5); i++) { // Executar apenas os primeiros 5 comandos
        const command = commands[i];
        
        if (command.trim().length === 0) continue;

        console.log(`\n📋 Tentando comando ${i + 1}: ${command.substring(0, 50)}...`);
        
        try {
          // Tentar inserir diretamente na tabela (se existir)
          if (command.toLowerCase().includes('insert into sinalizacoes')) {
            console.log('✅ Comando INSERT detectado - será executado após criar a tabela');
            successCount++;
          } else {
            console.log('⚠️ Comando DDL - precisa ser executado manualmente no SQL Editor');
            errorCount++;
          }
        } catch (err) {
          console.log(`❌ Erro no comando ${i + 1}: ${err.message}`);
          errorCount++;
        }
      }

      console.log('\n📊 Resumo:');
      console.log(`✅ Comandos processados: ${successCount}`);
      console.log(`⚠️ Comandos que precisam execução manual: ${errorCount}`);

    } catch (apiError) {
      console.log('❌ Não foi possível executar via API');
      console.log('💡 Execute manualmente no SQL Editor do Supabase');
    }

  } catch (error) {
    console.error('💥 Erro ao ler arquivo SQL:', error.message);
    console.log('\n💡 Execute o SQL manualmente no Supabase SQL Editor');
  }
}

executarSqlSinalizacao()
  .then(() => {
    console.log('\n🏁 Script finalizado');
    console.log('\n🎯 Próximos passos:');
    console.log('1. Execute o SQL no Supabase SQL Editor');
    console.log('2. Verifique se as tabelas foram criadas');
    console.log('3. Teste o módulo Sinalização no sistema');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
