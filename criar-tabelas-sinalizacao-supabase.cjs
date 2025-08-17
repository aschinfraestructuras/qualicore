const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Configuração do Supabase (chave anônima - mesma da Via Férrea)
const supabaseUrl = 'https://mjgvjpqcdsmvervcxjig.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3ZqcHFjZHNtdmVydmN4amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU1NDksImV4cCI6MjA2Nzk4MTU0OX0.dlsCn20Z9M71DGjnNeansnw--Kt8A3bdeIUbfYFpNqk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function criarTabelasSinalizacao() {
  console.log('🚀 Criando tabelas de Sinalização Ferroviária no Supabase...\n');

  try {
    // Ler o arquivo SQL de migração
    console.log('📖 Lendo arquivo de migração...');
    const sqlContent = fs.readFileSync('supabase/migrations/002_create_sinalizacao_tables.sql', 'utf8');
    
    console.log('✅ Arquivo SQL lido com sucesso');
    console.log('📊 Tamanho do arquivo:', sqlContent.length, 'caracteres');

    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`📝 Encontrados ${commands.length} comandos SQL para executar`);

    // Executar cada comando individualmente
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      if (command.trim().length === 0) continue;

      console.log(`\n📋 Executando comando ${i + 1}/${commands.length}...`);
      console.log(`🔧 Comando: ${command.substring(0, 100)}...`);
      
      try {
        // Tentar executar via função exec_sql se existir
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: command + ';' 
        });

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

    if (errorCount > 0) {
      console.log('\n💡 Se houve erros, você pode executar o SQL manualmente:');
      console.log('1. Acesse o Supabase Dashboard: https://supabase.com/dashboard');
      console.log('2. Vá para o seu projeto');
      console.log('3. Clique em "SQL Editor" no menu lateral');
      console.log('4. Cole o conteúdo do arquivo: supabase/migrations/002_create_sinalizacao_tables.sql');
      console.log('5. Clique em "Run" para executar');
    } else {
      console.log('\n🎉 Migração concluída com sucesso!');
      console.log('📋 Tabelas de Sinalização criadas');
      console.log('🔒 Pronto para uso no sistema');
    }

    // Verificar se as tabelas foram criadas
    console.log('\n🔍 Verificando se as tabelas foram criadas...');
    
    const tabelas = ['sinalizacoes', 'inspecoes_sinalizacao'];
    
    for (const tabela of tabelas) {
      try {
        const { error } = await supabase
          .from(tabela)
          .select('id')
          .limit(1);

        if (error) {
          console.log(`❌ Tabela ${tabela}: ${error.message}`);
        } else {
          console.log(`✅ Tabela ${tabela}: Criada com sucesso`);
        }
      } catch (err) {
        console.log(`❌ Tabela ${tabela}: ${err.message}`);
      }
    }

  } catch (error) {
    console.error('💥 Erro ao ler arquivo SQL:', error.message);
    console.log('\n💡 Execute o SQL manualmente no Supabase SQL Editor:');
    console.log('Arquivo: supabase/migrations/002_create_sinalizacao_tables.sql');
  }
}

criarTabelasSinalizacao()
  .then(() => {
    console.log('\n🏁 Script finalizado');
    console.log('\n🎯 Próximos passos:');
    console.log('1. Verifique se as tabelas foram criadas no Supabase');
    console.log('2. Teste o módulo Sinalização no sistema');
    console.log('3. Se necessário, execute o SQL manualmente no SQL Editor');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
