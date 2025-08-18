const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executarScriptNormas() {
  try {
    console.log('🚀 Iniciando execução do script de Normas...');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'supabase', 'migrations', '008_create_normas_tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Script SQL carregado com sucesso');
    console.log('📊 Executando comandos SQL...');
    
    // Dividir o script em comandos individuais
    const comandos = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    for (let i = 0; i < comandos.length; i++) {
      const comando = comandos[i];
      if (comando.trim()) {
        try {
          console.log(`⚡ Executando comando ${i + 1}/${comandos.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: comando + ';' });
          
          if (error) {
            console.error(`❌ Erro no comando ${i + 1}:`, error);
          } else {
            console.log(`✅ Comando ${i + 1} executado com sucesso`);
          }
        } catch (err) {
          console.error(`❌ Erro ao executar comando ${i + 1}:`, err);
        }
      }
    }
    
    console.log('🎉 Script de Normas executado com sucesso!');
    console.log('📋 Verifique no Supabase Dashboard se as tabelas foram criadas');
    
  } catch (error) {
    console.error('❌ Erro ao executar script:', error);
  }
}

executarScriptNormas();
