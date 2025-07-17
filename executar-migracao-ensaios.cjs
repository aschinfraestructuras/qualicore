#!/usr/bin/env node

/**
 * Script para executar a migração de Ensaios de Compactação no Supabase
 * 
 * Como usar:
 * 1. Copie o conteúdo do arquivo supabase-migration-ensaios-compactacao.sql
 * 2. Cole no SQL Editor do Supabase Dashboard
 * 3. Execute o script
 * 
 * Ou use este script para verificar se a tabela existe
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarTabela() {
  try {
    console.log('🔍 Verificando se a tabela ensaios_compactacao existe...');
    
    const { data, error } = await supabase
      .from('ensaios_compactacao')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation "ensaios_compactacao" does not exist')) {
        console.log('❌ Tabela ensaios_compactacao não encontrada');
        console.log('\n📋 Para criar a tabela:');
        console.log('1. Acesse o Supabase Dashboard');
        console.log('2. Vá para SQL Editor');
        console.log('3. Cole o conteúdo do arquivo supabase-migration-ensaios-compactacao.sql');
        console.log('4. Execute o script');
        console.log('\n📄 Conteúdo do script de migração:');
        console.log('='.repeat(50));
        
        const fs = require('fs');
        const path = require('path');
        const migrationPath = path.join(__dirname, 'supabase-migration-ensaios-compactacao.sql');
        
        if (fs.existsSync(migrationPath)) {
          const migrationContent = fs.readFileSync(migrationPath, 'utf8');
          console.log(migrationContent);
        } else {
          console.log('Arquivo de migração não encontrado');
        }
        
        return false;
      } else {
        throw error;
      }
    }
    
    console.log('✅ Tabela ensaios_compactacao encontrada!');
    
    // Verificar se há dados
    const { count, error: countError } = await supabase
      .from('ensaios_compactacao')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Erro ao contar registros:', countError);
      return false;
    }
    
    console.log(`📊 Total de ensaios: ${count || 0}`);
    
    if (count === 0) {
      console.log('💡 A tabela está vazia. Execute o script de migração para adicionar dados de exemplo.');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar tabela:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Verificação da Tabela de Ensaios de Compactação');
  console.log('='.repeat(50));
  
  const tabelaExiste = await verificarTabela();
  
  if (tabelaExiste) {
    console.log('\n✅ Sistema pronto para uso!');
    console.log('💡 Você pode agora acessar a página de Ensaios de Compactação');
  } else {
    console.log('\n❌ Ação necessária: Execute a migração no Supabase');
  }
}

main().catch(console.error); 