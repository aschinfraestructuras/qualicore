const fs = require('fs');

async function mostrarSqlSinalizacao() {
  console.log('🚀 SQL para criar tabelas de Sinalização Ferroviária no Supabase\n');

  try {
    // Ler o arquivo SQL de migração
    console.log('📖 Lendo arquivo de migração...');
    const sqlContent = fs.readFileSync('supabase/migrations/002_create_sinalizacao_tables.sql', 'utf8');
    
    console.log('✅ Arquivo SQL lido com sucesso');
    console.log('📊 Tamanho do arquivo:', sqlContent.length, 'caracteres');

    // Mostrar instruções
    console.log('\n💡 INSTRUÇÕES PARA EXECUTAR O SQL:');
    console.log('=' .repeat(80));
    console.log('1. Acesse o Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Vá para o seu projeto');
    console.log('3. Clique em "SQL Editor" no menu lateral');
    console.log('4. Cole o SQL abaixo na área de texto');
    console.log('5. Clique em "Run" para executar');
    console.log('6. Aguarde a execução completar');
    console.log('7. Verifique se as tabelas foram criadas');
    console.log('=' .repeat(80));

    // Mostrar o SQL completo
    console.log('\n📋 SQL COMPLETO PARA EXECUTAR:');
    console.log('=' .repeat(80));
    console.log(sqlContent);
    console.log('=' .repeat(80));

    // Mostrar resumo do que será criado
    console.log('\n🎯 O QUE SERÁ CRIADO:');
    console.log('✅ Tabela: sinalizacoes');
    console.log('✅ Tabela: inspecoes_sinalizacao');
    console.log('✅ Índices para performance');
    console.log('✅ Triggers para updated_at');
    console.log('✅ Políticas RLS (Row Level Security)');
    console.log('✅ Função de estatísticas');
    console.log('✅ Dados de exemplo');

    console.log('\n🔍 APÓS EXECUTAR, VERIFIQUE:');
    console.log('1. Vá para "Table Editor" no Supabase');
    console.log('2. Confirme que as tabelas sinalizacoes e inspecoes_sinalizacao existem');
    console.log('3. Teste o módulo Sinalização no sistema');

  } catch (error) {
    console.error('💥 Erro ao ler arquivo SQL:', error.message);
  }
}

mostrarSqlSinalizacao()
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
