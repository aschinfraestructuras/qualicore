#!/usr/bin/env node

/**
 * Script para verificar e executar a migração da tabela ensaios no Supabase
 * 
 * Como usar:
 * 1. Copie o conteúdo do arquivo supabase-migration-ensaios.sql
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

async function verificarTabelaEnsaios() {
  try {
    console.log('🔍 Verificando se a tabela ensaios existe...');
    
    // Tentar fazer uma consulta na tabela
    const { data, error } = await supabase
      .from('ensaios')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation "ensaios" does not exist')) {
        console.log('❌ Tabela ensaios NÃO existe');
        console.log('\n📋 Para criar a tabela:');
        console.log('1. Abra o arquivo supabase-migration-ensaios.sql');
        console.log('2. Copie todo o conteúdo');
        console.log('3. Cole no SQL Editor do Supabase Dashboard');
        console.log('4. Execute o script');
        return false;
      } else {
        throw error;
      }
    }
    
    console.log('✅ Tabela ensaios existe!');
    
    // Verificar quantos registros existem
    const { count, error: countError } = await supabase
      .from('ensaios')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('⚠️ Erro ao contar registros:', countError.message);
    } else {
      console.log(`📊 Total de registros: ${count}`);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao verificar tabela:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Verificando status da tabela ensaios...\n');
  
  const existe = await verificarTabelaEnsaios();
  
  if (existe) {
    console.log('\n🎉 Tabela ensaios está pronta para uso!');
  } else {
    console.log('\n⚠️ Execute a migração para criar a tabela ensaios');
  }
}

main().catch(console.error); 