const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

console.log('🚀 Iniciando execução do script de betonagens na Supabase...');
console.log('📋 URL:', supabaseUrl);

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executarScriptBetonagens() {
  try {
    console.log('📖 Lendo arquivo SQL...');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '006_create_betonagens_tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('✅ Arquivo SQL lido com sucesso');
    console.log('📊 Tamanho do script:', sqlContent.length, 'caracteres');
    
    // Dividir o script em comandos individuais
    const comandos = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`🔧 Executando ${comandos.length} comandos SQL...`);
    
    let sucessos = 0;
    let erros = 0;
    
    for (let i = 0; i < comandos.length; i++) {
      const comando = comandos[i];
      
      try {
        console.log(`\n📝 Executando comando ${i + 1}/${comandos.length}...`);
        
        // Executar comando SQL
        const { error } = await supabase.rpc('exec_sql', { sql_query: comando + ';' });
        
        if (error) {
          console.log(`❌ Erro no comando ${i + 1}:`, error.message);
          erros++;
        } else {
          console.log(`✅ Comando ${i + 1} executado com sucesso`);
          sucessos++;
        }
        
        // Pequena pausa entre comandos
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`❌ Erro fatal no comando ${i + 1}:`, error.message);
        erros++;
      }
    }
    
    console.log('\n📊 Resumo da execução:');
    console.log(`✅ Comandos executados com sucesso: ${sucessos}`);
    console.log(`❌ Comandos com erro: ${erros}`);
    console.log(`📈 Taxa de sucesso: ${((sucessos / comandos.length) * 100).toFixed(1)}%`);
    
    if (erros === 0) {
      console.log('\n🎉 Script executado com sucesso!');
      console.log('📋 Tabelas de betonagens criadas e dados inseridos.');
      console.log('🔍 Verifique no painel da Supabase se as tabelas foram criadas corretamente.');
    } else {
      console.log('\n⚠️ Script executado com alguns erros.');
      console.log('🔍 Verifique os logs acima para mais detalhes.');
    }
    
  } catch (error) {
    console.error('❌ Erro fatal:', error.message);
    console.error('🔍 Stack trace:', error.stack);
  }
}

// Verificar se a função exec_sql existe
async function verificarFuncaoExecSql() {
  try {
    console.log('🔍 Verificando se a função exec_sql existe...');
    
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: 'SELECT 1 as test;' 
    });
    
    if (error) {
      console.log('❌ Função exec_sql não encontrada ou não acessível');
      console.log('💡 Erro:', error.message);
      console.log('\n🔧 Para criar a função exec_sql, execute primeiro:');
      console.log('node criar-funcao-exec-sql.cjs');
      return false;
    }
    
    console.log('✅ Função exec_sql encontrada e funcionando');
    return true;
    
  } catch (error) {
    console.log('❌ Erro ao verificar função exec_sql:', error.message);
    return false;
  }
}

// Função principal
async function main() {
  console.log('🏗️ Script de Execução de Betonagens na Supabase');
  console.log('================================================');
  
  // Verificar se a função exec_sql existe
  const funcaoExiste = await verificarFuncaoExecSql();
  
  if (!funcaoExiste) {
    console.log('\n❌ Não é possível continuar sem a função exec_sql');
    process.exit(1);
  }
  
  // Executar o script
  await executarScriptBetonagens();
  
  console.log('\n🏁 Script concluído!');
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { executarScriptBetonagens, verificarFuncaoExecSql };
