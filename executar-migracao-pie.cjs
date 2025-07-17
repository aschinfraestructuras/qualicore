#!/usr/bin/env node

/**
 * Script para executar a migração de PIE (Pontos de Inspeção e Ensaios) no Supabase
 * 
 * Como usar:
 * 1. Copie o conteúdo do arquivo supabase-migration-pie.sql
 * 2. Cole no SQL Editor do Supabase Dashboard
 * 3. Execute o script
 * 
 * Ou use este script para verificar se as tabelas existem
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

async function verificarTabelasPIE() {
  try {
    console.log('🔍 Verificando tabelas PIE no Supabase...\n');

    const tabelas = [
      'ppi_modelos',
      'ppi_secoes', 
      'ppi_pontos',
      'ppi_instancias',
      'ppi_respostas',
      'ppi_historico'
    ];

    for (const tabela of tabelas) {
      try {
        const { data, error } = await supabase
          .from(tabela)
          .select('count')
          .limit(1);

        if (error) {
          console.log(`❌ ${tabela}: ${error.message}`);
        } else {
          console.log(`✅ ${tabela}: Tabela existe`);
        }
      } catch (err) {
        console.log(`❌ ${tabela}: ${err.message}`);
      }
    }

    console.log('\n📋 Para criar as tabelas:');
    console.log('1. Acesse o Supabase Dashboard');
    console.log('2. Vá para SQL Editor');
    console.log('3. Cole o conteúdo do arquivo supabase-migration-pie.sql');
    console.log('4. Execute o script');

  } catch (error) {
    console.error('❌ Erro ao verificar tabelas:', error.message);
  }
}

async function verificarViews() {
  try {
    console.log('\n🔍 Verificando views PIE...\n');

    const views = [
      'v_instancias_com_estatisticas',
      'v_relatorio_pie_completo'
    ];

    for (const view of views) {
      try {
        const { data, error } = await supabase
          .from(view)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ ${view}: ${error.message}`);
        } else {
          console.log(`✅ ${view}: View existe`);
        }
      } catch (err) {
        console.log(`❌ ${view}: ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro ao verificar views:', error.message);
  }
}

async function verificarFuncoes() {
  try {
    console.log('\n🔍 Verificando funções PIE...\n');

    // Testar função gerar_codigo_pie
    try {
      const { data, error } = await supabase.rpc('gerar_codigo_pie');
      
      if (error) {
        console.log(`❌ gerar_codigo_pie(): ${error.message}`);
      } else {
        console.log(`✅ gerar_codigo_pie(): Função existe`);
        console.log(`   Código gerado: ${data}`);
      }
    } catch (err) {
      console.log(`❌ gerar_codigo_pie(): ${err.message}`);
    }

    // Testar função calcular_estatisticas_pie
    try {
      const { data, error } = await supabase.rpc('calcular_estatisticas_pie', {
        instancia_uuid: '00000000-0000-0000-0000-000000000000'
      });
      
      if (error) {
        console.log(`❌ calcular_estatisticas_pie(): ${error.message}`);
      } else {
        console.log(`✅ calcular_estatisticas_pie(): Função existe`);
      }
    } catch (err) {
      console.log(`❌ calcular_estatisticas_pie(): ${err.message}`);
    }

  } catch (error) {
    console.error('❌ Erro ao verificar funções:', error.message);
  }
}

async function verificarDadosExemplo() {
  try {
    console.log('\n🔍 Verificando dados de exemplo...\n');

    // Verificar modelos
    const { data: modelos, error: errorModelos } = await supabase
      .from('ppi_modelos')
      .select('*')
      .limit(5);

    if (errorModelos) {
      console.log(`❌ Erro ao buscar modelos: ${errorModelos.message}`);
    } else {
      console.log(`✅ Modelos encontrados: ${modelos?.length || 0}`);
      if (modelos && modelos.length > 0) {
        console.log('   Exemplos:', modelos.map(m => m.codigo).join(', '));
      }
    }

    // Verificar instâncias
    const { data: instancias, error: errorInstancias } = await supabase
      .from('ppi_instancias')
      .select('*')
      .limit(5);

    if (errorInstancias) {
      console.log(`❌ Erro ao buscar instâncias: ${errorInstancias.message}`);
    } else {
      console.log(`✅ Instâncias encontradas: ${instancias?.length || 0}`);
      if (instancias && instancias.length > 0) {
        console.log('   Exemplos:', instancias.map(i => i.codigo).join(', '));
      }
    }

  } catch (error) {
    console.error('❌ Erro ao verificar dados:', error.message);
  }
}

async function main() {
  console.log('🚀 Verificação do Sistema PIE (Pontos de Inspeção e Ensaios)\n');
  
  await verificarTabelasPIE();
  await verificarViews();
  await verificarFuncoes();
  await verificarDadosExemplo();

  console.log('\n📝 INSTRUÇÕES:');
  console.log('1. Se alguma tabela não existe, execute a migração:');
  console.log('   - Abra o arquivo supabase-migration-pie.sql');
  console.log('   - Copie todo o conteúdo');
  console.log('   - Cole no SQL Editor do Supabase');
  console.log('   - Execute o script');
  console.log('\n2. Após a migração, execute este script novamente para verificar');
  console.log('\n3. O sistema PIE estará pronto para uso!');
}

main().catch(console.error); 