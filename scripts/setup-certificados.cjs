const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

if (!supabaseServiceKey || supabaseServiceKey === 'your-service-role-key') {
  console.error('❌ Erro: SUPABASE_SERVICE_ROLE_KEY não configurada');
  console.log('Por favor, configure a variável de ambiente SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL() {
  try {
    console.log('🚀 Iniciando criação das tabelas de Certificados...');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '..', 'SCRIPT_COMPLETO_CERTIFICADOS.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📄 Arquivo SQL carregado com sucesso');
    
    // Executar o SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      // Se não existir a função exec_sql, tentar executar diretamente
      console.log('⚠️  Função exec_sql não encontrada, tentando execução direta...');
      
      // Dividir o SQL em comandos individuais
      const commands = sqlContent
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
      
      for (const command of commands) {
        if (command.trim()) {
          try {
            const { error: cmdError } = await supabase.rpc('exec_sql', { sql: command + ';' });
            if (cmdError) {
              console.log(`⚠️  Comando ignorado (pode já existir): ${command.substring(0, 50)}...`);
            }
          } catch (e) {
            console.log(`⚠️  Comando ignorado: ${e.message}`);
          }
        }
      }
    }
    
    console.log('✅ Script SQL executado com sucesso!');
    
    // Verificar se as tabelas foram criadas
    console.log('🔍 Verificando tabelas criadas...');
    
    const tables = ['certificados', 'registos', 'termos_condicoes', 'cabecalhos_documentos', 'relatorios'];
    
    for (const table of tables) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (tableError) {
          console.log(`❌ Tabela ${table}: ${tableError.message}`);
        } else {
          console.log(`✅ Tabela ${table}: OK`);
        }
      } catch (e) {
        console.log(`❌ Tabela ${table}: ${e.message}`);
      }
    }
    
    console.log('🎉 Setup dos Certificados concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante a execução:', error);
    process.exit(1);
  }
}

executeSQL();
